import { NextResponse } from "next/server";
import { newLaunchState, STATE_COOKIE } from "@/lib/session";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
  const target=process.env.TAKATAK_ACADEMY_LAUNCH_URL;
  if(!target)return NextResponse.json({ok:false,message:"TAKATAK-V1 Academy sign-in bridge is not configured."},{status:503,headers:{"Cache-Control":"no-store"}});
  let url:URL;
  try{url=new URL(target);}catch{return NextResponse.json({ok:false,message:"Invalid TAKATAK launch configuration."},{status:503});}
  if(url.protocol!=="https:" && !(process.env.NODE_ENV!=="production" && ["localhost","127.0.0.1"].includes(url.hostname)))
    return NextResponse.json({ok:false,message:"TAKATAK launch requires HTTPS."},{status:503});
  const state=newLaunchState();
  url.searchParams.set("state",state);
  const response=NextResponse.redirect(url,303);
  response.cookies.set(STATE_COOKIE,state,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:300});
  response.headers.set("Cache-Control","no-store");
  return response;
}
