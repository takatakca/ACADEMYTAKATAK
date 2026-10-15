import { NextRequest,NextResponse } from "next/server";
import { getCourse } from "@/lib/catalog";
import { currentIdentity } from "@/lib/session";
import { canReviewExams } from "@/lib/assessment-policy";
import { ExamDraftConflict,publishExamDraft,hasPrivateBankSchema } from "@/lib/private-exams";

export const runtime="nodejs";export const dynamic="force-dynamic";
const json=(data:object,status:number)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}});
export async function POST(request:NextRequest){
 const identity=await currentIdentity();
 if(!identity||!canReviewExams(identity))return json({ok:false,error:"reviewer_entitlement_required"},403);
 const origin=request.headers.get("origin");
 if(!origin||(()=>{try{return new URL(origin).host!==request.nextUrl.host;}catch{return true;}})())return json({ok:false,error:"origin_not_allowed"},403);
 if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
 if(Number(request.headers.get("content-length")||0)>1024)return json({ok:false,error:"too_large"},413);
 let input:unknown;
 try{const raw=await request.text();if(raw.length>1024)return json({ok:false,error:"too_large"},413);input=JSON.parse(raw);}catch{return json({ok:false,error:"invalid_json"},400);}
 if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
 const {course,version}=input as Record<string,unknown>;
 if(typeof course!=="string"||!getCourse(course)||!Number.isInteger(version)|| (version as number)<1)return json({ok:false,error:"invalid_payload"},400);
 try {
   if(!await hasPrivateBankSchema())return json({ok:false,error:"migration_required"},503);
   await publishExamDraft(identity,course,version as number);
   return json({ok:true,course,version,status:"published"},200);
 }catch(error){
   if(error instanceof ExamDraftConflict)return json({ok:false,error:"different_reviewer_or_valid_draft_required"},409);
   return json({ok:false,error:"storage_unavailable"},503);
 }
}
