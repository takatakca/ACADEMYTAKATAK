import "server-only";
import type { AcademyIdentity } from "./access";
import type { LessonRevisionDraft } from "./lesson-policy";
import {validLessonRevision} from "./lesson-policy";
import {learningDb} from "./progress";

export type LessonRevision=LessonRevisionDraft & {
 courseSlug:string;lessonSlug:string;revision:number;status:"draft"|"published"|"retired";
 createdBy:string;reviewedBy:string|null;createdAt:string;publishedAt:string|null;
};
type RevisionRow={
 course_slug:string;lesson_slug:string;revision:number;status:LessonRevision["status"];
 title:string;paragraphs:unknown;activity:string;created_by:string;reviewed_by:string|null;
 created_at:string;published_at:string|null
};
export class LessonRevisionConflict extends Error {}
const mapRow=(row:RevisionRow):LessonRevision=>{
 const data={title:row.title,paragraphs:row.paragraphs,activity:row.activity};
 if(!validLessonRevision(data))throw new Error("invalid_lesson_revision");
 return {...data,courseSlug:row.course_slug,lessonSlug:row.lesson_slug,revision:row.revision,
  status:row.status,createdBy:row.created_by,reviewedBy:row.reviewed_by,
  createdAt:row.created_at,publishedAt:row.published_at};
};
export async function hasLessonRevisionSchema():Promise<boolean>{
 const db=learningDb();if(!db)return false;
 const row=await db.query<{table_name:string|null}>(
  "SELECT to_regclass('academy_lesson_revision')::text AS table_name");
 return !!row.rows[0]?.table_name;
}
export async function readPublishedLesson(course:string,lesson:string):Promise<LessonRevision|null>{
 const db=learningDb();if(!db||!await hasLessonRevisionSchema())return null;
 const result=await db.query<RevisionRow>(
  `SELECT course_slug,lesson_slug,revision,status,title,paragraphs,activity,created_by,
     reviewed_by,created_at::text AS created_at,published_at::text AS published_at
     FROM academy_lesson_revision
     WHERE course_slug=$1 AND lesson_slug=$2 AND status='published' LIMIT 1`,
  [course,lesson]);
 return result.rows[0]?mapRow(result.rows[0]):null;
}
export async function listLessonRevisions(course:string,lesson:string):Promise<LessonRevision[]>{
 const db=learningDb();if(!db)throw new Error("db_not_configured");
 const rows=await db.query<RevisionRow>(
  `SELECT course_slug,lesson_slug,revision,status,title,paragraphs,activity,created_by,
     reviewed_by,created_at::text AS created_at,published_at::text AS published_at
     FROM academy_lesson_revision WHERE course_slug=$1 AND lesson_slug=$2
     ORDER BY revision DESC LIMIT 30`,[course,lesson]);
 return rows.rows.map(mapRow);
}
export async function draftLessonRevision(
 identity:AcademyIdentity,course:string,lesson:string,draft:LessonRevisionDraft
):Promise<number>{
 if(!validLessonRevision(draft))throw new Error("invalid_lesson_revision");
 const db=learningDb();if(!db)throw new Error("db_not_configured");
 const client=await db.connect();
 try{
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1),hashtext($2))",[course,lesson]);
  const next=await client.query<{revision:number}>(
   `SELECT COALESCE(MAX(revision),0)::integer+1 AS revision
      FROM academy_lesson_revision WHERE course_slug=$1 AND lesson_slug=$2`,[course,lesson]);
  const revision=next.rows[0].revision;
  await client.query(
   `INSERT INTO academy_lesson_revision(course_slug,lesson_slug,revision,status,title,paragraphs,activity,created_by)
     VALUES($1,$2,$3,'draft',$4,$5::jsonb,$6,$7)`,
   [course,lesson,revision,draft.title,JSON.stringify(draft.paragraphs),draft.activity,identity.sub]);
  await client.query("COMMIT");return revision;
 }catch(error){await client.query("ROLLBACK");throw error;}
 finally{client.release();}
}
export async function publishLessonRevision(
 identity:AcademyIdentity,course:string,lesson:string,revision:number
):Promise<void>{
 const db=learningDb();if(!db)throw new Error("db_not_configured");
 const client=await db.connect();
 try{
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1),hashtext($2))",[course,lesson]);
  const rows=await client.query<RevisionRow>(
   `SELECT course_slug,lesson_slug,revision,status,title,paragraphs,activity,created_by,
     reviewed_by,created_at::text AS created_at,published_at::text AS published_at
     FROM academy_lesson_revision WHERE course_slug=$1 AND lesson_slug=$2
     AND revision=$3 FOR UPDATE`,[course,lesson,revision]);
  const target=rows.rows[0];
  if(!target||target.status!=="draft"||target.created_by===identity.sub)
   throw new LessonRevisionConflict("different_reviewer_required");
  mapRow(target); // Validate content again at the publishing boundary.
  await client.query(
   "UPDATE academy_lesson_revision SET status='retired' WHERE course_slug=$1 AND lesson_slug=$2 AND status='published'",
   [course,lesson]);
  await client.query(
   `UPDATE academy_lesson_revision SET status='published',reviewed_by=$4,published_at=NOW()
     WHERE course_slug=$1 AND lesson_slug=$2 AND revision=$3`,[course,lesson,revision,identity.sub]);
  await client.query("COMMIT");
 }catch(error){await client.query("ROLLBACK");throw error;}
 finally{client.release();}
}
