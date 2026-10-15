import { NextRequest,NextResponse } from "next/server";
import { currentIdentity } from "@/lib/session";
import { getCourse } from "@/lib/catalog";
import { canAuthorExams,canReviewExams,validExamBank } from "@/lib/assessment-policy";
import { createExamDraft,hasPrivateBankSchema,listExamVersions } from "@/lib/private-exams";

export const runtime="nodejs";export const dynamic="force-dynamic";
const json=(data:object,status:number)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(request:NextRequest){
 const identity=await currentIdentity();
 if(!identity||!(canAuthorExams(identity)||canReviewExams(identity)))return json({ok:false,error:"forbidden"},403);
 const slug=request.nextUrl.searchParams.get("course")||"";
 if(!getCourse(slug))return json({ok:false,error:"not_found"},404);
 try{
   if(!await hasPrivateBankSchema())return json({ok:false,error:"migration_required"},503);
   const versions=await listExamVersions(slug);
   return json({ok:true,versions},200);
 }catch{return json({ok:false,error:"storage_unavailable"},503);}
}
export async function POST(request:NextRequest){
 const identity=await currentIdentity();
 if(!identity||!canAuthorExams(identity))return json({ok:false,error:"editor_entitlement_required"},403);
 const origin=request.headers.get("origin");
 if(!origin||(()=>{try{return new URL(origin).host!==request.nextUrl.host;}catch{return true;}})())return json({ok:false,error:"origin_not_allowed"},403);
 if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
 if(Number(request.headers.get("content-length")||0)>110000)return json({ok:false,error:"too_large"},413);
 let input:unknown;
 try{const raw=await request.text();if(raw.length>110000)return json({ok:false,error:"too_large"},413);input=JSON.parse(raw);}catch{return json({ok:false,error:"invalid_json"},400);}
 if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
 const {course,questions}=input as Record<string,unknown>;
 if(typeof course!=="string"||!getCourse(course)||!validExamBank(questions))
    return json({ok:false,error:"invalid_question_bank",minimumQuestions:10},400);
 try {
   if(!await hasPrivateBankSchema())return json({ok:false,error:"migration_required"},503);
   const version=await createExamDraft(identity,course,questions);
   return json({ok:true,course,version,status:"draft"},201);
 }catch{return json({ok:false,error:"storage_unavailable"},503);}
}
