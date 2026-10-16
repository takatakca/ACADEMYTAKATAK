import "server-only";
import type { AcademyIdentity } from "./access";
import { learningDb } from "./progress";

export type StudentLearningExport={
  format:"takatak-academy-learning-export";
  version:1;
  exportedAt:string;
  masterIdentityId:string;
  learningProgress:Array<{courseSlug:string;lessonSlug:string;completedAt:string}>;
  examAttempts:Array<{courseSlug:string;correctAnswers:number;questionCount:number;points:number;passed:boolean;assessmentSource:string;assessmentVersion:number|null;submittedAt:string}>;
  workbookResponses:Array<{courseSlug:string;lessonSlug:string;responseText:string;updatedAt:string}>;
  programAwards:Array<{awardId:string;programSlug:string;courseSlugs:string[];pointsEarned:number;issuedAt:string;status:string;revokedAt:string|null}>;
};
const MAX_EXPORT_ROWS=10000;
export class LearningExportTooLarge extends Error {constructor(){super("learning_export_too_large");}}
/** Reads a single master identity in a repeatable-read snapshot, with explicit projections.
 * Does not export central TAKATAK account, other tenant data, secrets or test-bank answers.
 */
export async function exportMyLearningData(identity:AcademyIdentity):Promise<StudentLearningExport>{
  const db=learningDb();if(!db)throw new Error("database_unavailable");
  const client=await db.connect();
  try{
    await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY");
    const [progress,exams,workbooks,awards]=await Promise.all([
      client.query<{course_slug:string;lesson_slug:string;completed_at:string}>(
        "SELECT course_slug,lesson_slug,completed_at::text FROM academy_lesson_progress WHERE master_identity_id=$1 ORDER BY completed_at DESC LIMIT 10001",[identity.sub]),
      client.query<{course_slug:string;correct_answers:number;question_count:number;points:number;passed:boolean;assessment_source:string;assessment_version:number|null;submitted_at:string}>(
        "SELECT course_slug,correct_answers,question_count,points,passed,assessment_source,assessment_version,submitted_at::text FROM academy_exam_attempt WHERE master_identity_id=$1 ORDER BY submitted_at DESC LIMIT 10001",[identity.sub]),
      client.query<{course_slug:string;lesson_slug:string;response_text:string;updated_at:string}>(
        "SELECT course_slug,lesson_slug,response_text,updated_at::text FROM academy_activity_submission WHERE master_identity_id=$1 ORDER BY updated_at DESC LIMIT 10001",[identity.sub]),
      client.query<{award_id:string;program_slug:string;course_slugs:string[];points_earned:number;issued_at:string;status:string;revoked_at:string|null}>(
        "SELECT award_id::text,program_slug,course_slugs,points_earned,issued_at::text,status,revoked_at::text FROM academy_program_award WHERE master_identity_id=$1 ORDER BY issued_at DESC LIMIT 10001",[identity.sub])
    ]);
    if([progress,exams,workbooks,awards].some(x=>x.rows.length>MAX_EXPORT_ROWS))
      throw new LearningExportTooLarge();
    await client.query("COMMIT");
    return {
      format:"takatak-academy-learning-export",version:1,
      exportedAt:new Date().toISOString(),masterIdentityId:identity.sub,
      learningProgress:progress.rows.map(r=>({courseSlug:r.course_slug,lessonSlug:r.lesson_slug,completedAt:r.completed_at})),
      examAttempts:exams.rows.map(r=>({courseSlug:r.course_slug,correctAnswers:r.correct_answers,
        questionCount:r.question_count,points:r.points,passed:r.passed,
        assessmentSource:r.assessment_source,assessmentVersion:r.assessment_version,submittedAt:r.submitted_at})),
      workbookResponses:workbooks.rows.map(r=>({courseSlug:r.course_slug,lessonSlug:r.lesson_slug,
        responseText:r.response_text,updatedAt:r.updated_at})),
      programAwards:awards.rows.map(r=>({awardId:r.award_id,programSlug:r.program_slug,
        courseSlugs:r.course_slugs,pointsEarned:r.points_earned,issuedAt:r.issued_at,
        status:r.status,revokedAt:r.revoked_at}))
    };
  }catch(err){await client.query("ROLLBACK").catch(()=>{});throw err;}
  finally{client.release();}
}
/** Explicitly scoped and irreversible: only student-written workbook answers.
 * Progress, exams, awards, TAKATAK master accounts and billing remain untouched.
 */
export async function eraseMyWorkbookResponses(identity:AcademyIdentity):Promise<number>{
  const db=learningDb();if(!db)throw new Error("database_unavailable");
  const result=await db.query(
    "DELETE FROM academy_activity_submission WHERE master_identity_id=$1",[identity.sub]);
  return result.rowCount??0;
}
