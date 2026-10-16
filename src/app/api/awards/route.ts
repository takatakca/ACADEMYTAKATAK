import { isSameWriteOrigin } from "@/lib/request-origin";
import { NextRequest,NextResponse } from "next/server";
import { currentIdentity } from "@/lib/session";
import { canReadLesson } from "@/lib/access";
import { courses } from "@/lib/catalog";
import { getProgram,getProgramCourses } from "@/lib/programs";
import { readAllProgress,progressConfigured } from "@/lib/progress";
import { readExamSummaries } from "@/lib/exam-records";
import { eligibleForProgramAward } from "@/lib/award-policy";
import { issueProgramAward,readMyAwards } from "@/lib/awards";

export const runtime="nodejs";export const dynamic="force-dynamic";
const json=(data:object,status:number)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(){
 const identity=await currentIdentity();
 if(!identity)return json({ok:false,error:"sign_in_required"},401);
 if(!progressConfigured())return json({ok:false,error:"storage_unavailable"},503);
 try{return json({ok:true,awards:await readMyAwards(identity)},200);}
 catch{return json({ok:false,error:"storage_unavailable"},503);}
}
export async function POST(request:NextRequest){
 if(!isSameWriteOrigin(request.headers.get("origin"),request.nextUrl.origin))return json({ok:false,error:"origin_not_allowed"},403);
 if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
 if(Number(request.headers.get("content-length")||0)>1024)return json({ok:false,error:"too_large"},413);
 const identity=await currentIdentity();
 if(!identity)return json({ok:false,error:"sign_in_required"},401);
 let input:unknown;
 try{const raw=await request.text();if(raw.length>1024)return json({ok:false,error:"too_large"},413);input=JSON.parse(raw);}
 catch{return json({ok:false,error:"invalid_json"},400);}
 if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
 const programName=(input as Record<string,unknown>).program;
 if(typeof programName!=="string")return json({ok:false,error:"invalid_payload"},400);
 const program=getProgram(programName);
 if(!program)return json({ok:false,error:"unknown_program"},404);
 const paths=getProgramCourses(program);
 if(paths.length!==program.courseSlugs.length)return json({ok:false,error:"program_catalog_invalid"},503);
 if(!paths.every(course=>course.lessons.every(lesson=>canReadLesson(course,lesson,identity))))
   return json({ok:false,error:"program_entitlement_required"},403);
 try {
  const [progress,attempts]=await Promise.all([readAllProgress(identity),readExamSummaries(identity)]);
  const scores=new Map(attempts.map(x=>[x.courseSlug,x]));
  if(!eligibleForProgramAward(program,courses,progress,scores))
    return json({ok:false,error:"program_not_complete"},403);
  const points=paths.reduce((sum,path)=>sum+(scores.get(path.slug)?.bestPoints||0),0);
  const award=await issueProgramAward(identity,program.slug,program.courseSlugs,points);
  return json({ok:award.status==="active",award},award.status==="active"?200:409);
 }catch{return json({ok:false,error:"storage_unavailable"},503);}
}
