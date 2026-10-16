import "server-only";
import type { AcademyIdentity } from "./access";
import { learningDb } from "./progress";
import type { ReturnTypeGrade } from "./exam-types";

export type CourseExamSummary={courseSlug:string;attempts:number;bestPoints:number;passed:boolean;lastAttempt:string};
export class ExamReplayError extends Error {constructor(){super("exam_ticket_already_used");}}
export class ExamLimitError extends Error { constructor(){ super("exam_attempt_limit"); } }
export async function readExamSummaries(identity:AcademyIdentity):Promise<CourseExamSummary[]>{
  const pool=learningDb(); if(!pool)return [];
  const result=await pool.query<{course_slug:string;attempts:string;best_points:number;passed:boolean;last_attempt:string}>(
    `SELECT course_slug, COUNT(*)::text AS attempts, MAX(points)::integer AS best_points,
       BOOL_OR(passed) AS passed, MAX(submitted_at)::text AS last_attempt
     FROM academy_exam_attempt WHERE master_identity_id=$1 GROUP BY course_slug ORDER BY course_slug`,
    [identity.sub]);
  return result.rows.map(r=>({
    courseSlug:r.course_slug,attempts:Number(r.attempts),bestPoints:r.best_points,
    passed:r.passed,lastAttempt:r.last_attempt
  }));
}
export async function saveExamAttempt(identity:AcademyIdentity,slug:string,grade:ReturnTypeGrade,source:"public_practice"|"private_reviewed",version:number,nonce:string):Promise<number>{
  const pool=learningDb();
  if(!pool)throw new Error("exam_storage_not_configured");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    // Lock per master identity + course: ensures concurrent requests cannot bypass attempt cap.
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))",[identity.sub,slug]);
    const recent=await client.query<{attempts:string}>(
      `SELECT COUNT(*)::text AS attempts FROM academy_exam_attempt
       WHERE master_identity_id=$1 AND course_slug=$2 AND submitted_at > NOW() - INTERVAL '24 hours'`,
      [identity.sub,slug]);
    if(Number(recent.rows[0].attempts)>=3)throw new ExamLimitError();
    await client.query(
      `INSERT INTO academy_exam_attempt
       (master_identity_id,course_slug,correct_answers,question_count,points,passed,assessment_source,assessment_version,ticket_nonce)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::uuid)`,
      [identity.sub,slug,grade.correct,grade.total,grade.points,grade.passed,source,version===0?null:version,nonce]);
    const best=await client.query<{best_points:number}>(
      "SELECT MAX(points)::integer AS best_points FROM academy_exam_attempt WHERE master_identity_id=$1 AND course_slug=$2",
      [identity.sub,slug]);
    await client.query("COMMIT");
    return best.rows[0].best_points;
  } catch (err) {
    await client.query("ROLLBACK");
    if(err && typeof err==="object" && "code" in err && err.code==="23505")throw new ExamReplayError();
    throw err;
  } finally { client.release(); }
}
