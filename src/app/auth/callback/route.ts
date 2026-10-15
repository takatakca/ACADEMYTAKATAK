import { NextRequest, NextResponse } from "next/server";
import { exchangeAcademyCode } from "@/lib/bridge";
import { SESSION_COOKIE, STATE_COOKIE, sessionCookieOptions, signSession } from "@/lib/session";
import { timingSafeEqual } from "node:crypto";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
  const supplied=request.nextUrl.searchParams.get("state")||"";
  const expected=request.cookies.get(STATE_COOKIE)?.value||"";
  const code=request.nextUrl.searchParams.get("code")||"";
  const responseError=()=>NextResponse.redirect(new URL("/account?auth=failed",request.url),303);
  if(!supplied || !expected || supplied.length!==expected.length ||
    !timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) {
    const failure=responseError();failure.cookies.delete(STATE_COOKIE);failure.headers.set("Cache-Control","no-store");return failure;
  }
  try{
    const identity=await exchangeAcademyCode(code);
    const response=NextResponse.redirect(new URL("/account",request.url),303);
    response.cookies.set(SESSION_COOKIE,signSession(identity),sessionCookieOptions);
    response.cookies.delete(STATE_COOKIE);
    response.headers.set("Cache-Control","no-store");
    response.headers.set("Referrer-Policy","no-referrer");
    return response;
  }catch{
    const failure=responseError();
    failure.cookies.delete(STATE_COOKIE);
    failure.headers.set("Cache-Control","no-store");
    return failure;
  }
}
