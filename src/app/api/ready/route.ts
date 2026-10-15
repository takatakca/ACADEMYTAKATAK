import { NextResponse } from "next/server";
import { learningDb } from "@/lib/progress";

export const runtime="nodejs";
export const dynamic="force-dynamic";
/**
 * Operational readiness, distinct from /api/health liveness.
 * No secrets or private learner data are returned.
 */
export async function GET(){
  const authConfigured=Boolean(
    process.env.TAKATAK_ACADEMY_LAUNCH_URL &&
    process.env.TAKATAK_ACADEMY_EXCHANGE_URL &&
    (process.env.TAKATAK_ACADEMY_SERVICE_TOKEN||"").length>=20 &&
    (process.env.ACADEMY_SESSION_SECRET||"").length>=32
  );
  let dataReady=false;
  const db=learningDb();
  if(db){
    try {
      const result=await db.query<{progress:string|null;exams:string|null;workbook:string|null;bank:string|null;awards:string|null}>(
        "SELECT to_regclass('academy_lesson_progress')::text AS progress, to_regclass('academy_exam_attempt')::text AS exams, to_regclass('academy_activity_submission')::text AS workbook, to_regclass('academy_exam_version')::text AS bank, to_regclass('academy_program_award')::text AS awards"
      );
      if(result.rows[0]?.progress && result.rows[0]?.exams && result.rows[0]?.workbook && result.rows[0]?.bank && result.rows[0]?.awards){
        await db.query("SELECT 1 FROM academy_lesson_progress LIMIT 1");
        await db.query("SELECT 1 FROM academy_exam_attempt LIMIT 1");
        await db.query("SELECT 1 FROM academy_activity_submission LIMIT 1");
        await db.query("SELECT 1 FROM academy_exam_version LIMIT 1");
        await db.query("SELECT 1 FROM academy_program_award LIMIT 1");
        dataReady=true;
      }
    } catch { dataReady=false; }
  }
  const ready=authConfigured&&dataReady;
  return NextResponse.json(
    {service:"takatak-academy",ready,identityBridge:authConfigured?"configured":"not_configured",
      learningStorage:dataReady?"ready":"not_ready",billingAuthority:"TAKATAK-V1"},
    {status:ready?200:503,headers:{"Cache-Control":"no-store"}}
  );
}
