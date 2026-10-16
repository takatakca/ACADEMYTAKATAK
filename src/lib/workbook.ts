import "server-only";
import type { AcademyIdentity } from "./access";
import { learningDb } from "./progress";

import { validWorkbookText } from "./workbook-policy";
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

/** A student may erase their own exercise text without losing exam scores or course completion.
 * This is intentionally not conditioned on a current paid-content entitlement.
 */
export async function deleteWorkbook(identity:AcademyIdentity,courseSlug:string,lessonSlug:string):Promise<boolean>{
  const db=learningDb();if(!db)throw new Error("workbook_database_not_configured");
  const result=await db.query(
    "DELETE FROM academy_activity_submission WHERE master_identity_id=$1 AND course_slug=$2 AND lesson_slug=$3",
    [identity.sub,courseSlug,lessonSlug]);
  return (result.rowCount??0)>0;
}
