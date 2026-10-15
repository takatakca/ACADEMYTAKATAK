import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, STATE_COOKIE } from "@/lib/session";
export const runtime="nodejs";
export async function GET(request:NextRequest){
  const response=NextResponse.redirect(new URL("/",request.url),303);
  response.cookies.delete(SESSION_COOKIE);response.cookies.delete(STATE_COOKIE);
  response.headers.set("Cache-Control","no-store");
  return response;
}
