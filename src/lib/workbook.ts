import "server-only";
import type { AcademyIdentity } from "./access";
import { learningDb } from "./progress";

export const MAX_WORKBOOK_CHARS=4000;
export function validWorkbookText(input:unknown):input is string {
  return typeof input==="string" && input.trim().length>=1 && input.length<=MAX_WORKBOOK_CHARS;
}
export async function readWorkbook(identity:AcademyIdentity,courseSlug:string,lessonSlug:string):Promise<string|null>{
  const db=learningDb();if(!db)return null;
  const result=await db.query<{response_text:string}>(
    "SELECT response_text FROM academy_activity_submission WHERE master_identity_id=$1 AND course_slug=$2 AND lesson_slug=$3",
    [identity.sub,courseSlug,lessonSlug]);
  return result.rows[0]?.response_text??null;
}
export async function saveWorkbook(identity:AcademyIdentity,courseSlug:string,lessonSlug:string,text:string):Promise<void>{
  if(!validWorkbookText(text))throw new Error("invalid_workbook_text");
  const db=learningDb();if(!db)throw new Error("workbook_database_not_configured");
  await db.query(
    `INSERT INTO academy_activity_submission(master_identity_id,course_slug,lesson_slug,response_text)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT(master_identity_id,course_slug,lesson_slug)
     DO UPDATE SET response_text=EXCLUDED.response_text,updated_at=now()`,
    [identity.sub,courseSlug,lessonSlug,text.trim()]
  );
}
