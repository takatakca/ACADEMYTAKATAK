import { isSameWriteOrigin } from "@/lib/request-origin";
import { NextRequest, NextResponse } from "next/server";
import { currentIdentity } from "@/lib/session";
import { getCourse,getLesson } from "@/lib/catalog";
import { canReadLesson } from "@/lib/access";
import { writeProgress,progressConfigured } from "@/lib/progress";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const json=(data:object,status:number)=>NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:NextRequest){
  if(!isSameWriteOrigin(request.headers.get("origin"),request.nextUrl.origin))return json({ok:false,error:"origin_not_allowed"},403);
  if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
  const length=Number(request.headers.get("content-length")||"0");
  if(!Number.isFinite(length) || length>1024)return json({ok:false,error:"request_too_large"},413);
  const identity=await currentIdentity();
  if(!identity)return json({ok:false,error:"sign_in_required"},401);
  let input:unknown;
  try{
    const raw=await request.text();
    if(raw.length>1024)return json({ok:false,error:"request_too_large"},413);
    input=JSON.parse(raw);
  }catch{return json({ok:false,error:"invalid_json"},400)}
  if(!input || typeof input!=="object" || Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
  const {course:slug,lesson:lessonSlug}=input as Record<string,unknown>;
  if(typeof slug!=="string"||typeof lessonSlug!=="string")return json({ok:false,error:"invalid_payload"},400);
  const course=getCourse(slug);
  const lesson=course&&getLesson(course,lessonSlug);
  if(!course||!lesson)return json({ok:false,error:"not_found"},404);
  if(!canReadLesson(course,lesson,identity))return json({ok:false,error:"payment_or_entitlement_required"},403);
  if(!progressConfigured())return json({ok:false,error:"progress_not_configured"},503);
  try{await writeProgress(identity,course.slug,lesson.slug);return json({ok:true,completed:true},200);}
  catch{return json({ok:false,error:"progress_unavailable"},503);}
}
