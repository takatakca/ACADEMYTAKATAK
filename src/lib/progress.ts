import "server-only";
import { Pool } from "pg";
import type { AcademyIdentity } from "./access";

let pool: Pool | null = null;
function db(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) pool = new Pool({ connectionString:url, max:5, connectionTimeoutMillis:4000 });
  return pool;
}
export async function readProgress(identity: AcademyIdentity, courseSlug: string): Promise<string[]> {
  const client = db();
  if (!client) return [];
  const result = await client.query<{ lesson_slug: string }>(
    "SELECT lesson_slug FROM academy_lesson_progress WHERE master_identity_id=$1 AND course_slug=$2",
    [identity.sub, courseSlug]
  );
  return result.rows.map((row)=>row.lesson_slug);
}
export async function writeProgress(identity: AcademyIdentity, courseSlug: string, lessonSlug: string): Promise<void> {
  const client = db();
  if (!client) throw new Error("Academy learning database not configured");
  await client.query(
    "INSERT INTO academy_lesson_progress (master_identity_id,course_slug,lesson_slug) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
    [identity.sub, courseSlug, lessonSlug]
  );
}
/** Load every saved lesson with one scoped query instead of one query per course. */
export async function readAllProgress(identity: AcademyIdentity): Promise<Map<string,string[]>> {
  const client=db();if(!client)return new Map();
  const result=await client.query<{course_slug:string;lesson_slug:string}>(
    "SELECT course_slug,lesson_slug FROM academy_lesson_progress WHERE master_identity_id=$1",
    [identity.sub]
  );
  const byCourse=new Map<string,string[]>();
  for(const row of result.rows){
    const entries=byCourse.get(row.course_slug)??[];
    entries.push(row.lesson_slug);
    byCourse.set(row.course_slug,entries);
  }
  return byCourse;
}

export function progressConfigured(): boolean { return Boolean(process.env.DATABASE_URL); }

/** Reuse the Academy-owned Postgres pool for graded learning records. */
export function learningDb(): Pool | null { return db(); }
