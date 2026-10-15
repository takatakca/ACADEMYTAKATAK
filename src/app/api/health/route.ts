import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export function GET(){
  const configured=Boolean(process.env.TAKATAK_ACADEMY_EXCHANGE_URL && process.env.TAKATAK_ACADEMY_SERVICE_TOKEN && (process.env.ACADEMY_SESSION_SECRET||"").length>=32);
  return NextResponse.json({
    service:"takatak-academy",status:"running",
    takatakAuthBridge:configured?"configured":"not_configured",
    learningDatabase:process.env.DATABASE_URL?"configured":"not_configured",
    paymentAuthority:"TAKATAK-V1 (not enabled here)"
  },{headers:{"Cache-Control":"no-store"}});
}
