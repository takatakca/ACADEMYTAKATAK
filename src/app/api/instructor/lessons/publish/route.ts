import {NextRequest,NextResponse} from "next/server";
import {currentIdentity} from "@/lib/session";
import {getCourse,getLesson} from "@/lib/catalog";
import {canPublishLessons} from "@/lib/lesson-policy";
import {hasLessonRevisionSchema,LessonRevisionConflict,publishLessonRevision} from "@/lib/lesson-revisions";
import {isSameWriteOrigin} from "@/lib/request-origin";

export const dynamic="force-dynamic";export const runtime="nodejs";
const json=(body:object,status:number)=>NextResponse.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
export async function POST(request:NextRequest){
 const identity=await currentIdentity();
 if(!identity||!canPublishLessons(identity))return json({ok:false,error:"reviewer_access_required"},403);
 if(!isSameWriteOrigin(request.headers.get("origin"),request.nextUrl.origin))return json({ok:false,error:"origin_not_allowed"},403);
 if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
 if(Number(request.headers.get("content-length")||0)>1024)return json({ok:false,error:"too_large"},413);
 let input:unknown;
 try{const raw=await request.text();if(raw.length>1024)return json({ok:false,error:"too_large"},413);input=JSON.parse(raw);}
 catch{return json({ok:false,error:"invalid_json"},400);}
 if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
 const {course,lesson,revision}=input as Record<string,unknown>;
 if(typeof course!=="string"||typeof lesson!=="string"||!getCourse(course)||
    !getLesson(getCourse(course)!,lesson)||!Number.isInteger(revision)|| (revision as number)<1)
    return json({ok:false,error:"invalid_payload"},400);
 try{
  if(!await hasLessonRevisionSchema())return json({ok:false,error:"migration_required"},503);
  await publishLessonRevision(identity,course,lesson,revision as number);
  return json({ok:true,course,lesson,revision,status:"published"},200);
 }catch(err){
  if(err instanceof LessonRevisionConflict)return json({ok:false,error:"independent_review_required"},409);
  return json({ok:false,error:"storage_unavailable"},503);
 }
}
