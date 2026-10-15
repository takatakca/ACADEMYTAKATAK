import { NextRequest,NextResponse } from "next/server";
import { currentIdentity } from "@/lib/session";
import { getCourse,getLesson } from "@/lib/catalog";
import { canReadLesson } from "@/lib/access";
import { progressConfigured } from "@/lib/progress";
import { saveWorkbook,validWorkbookText } from "@/lib/workbook";

export const runtime="nodejs";export const dynamic="force-dynamic";
const json=(x:object,status:number)=>NextResponse.json(x,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(!origin||(()=>{try{return new URL(origin).host!==request.nextUrl.host;}catch{return true;}})())return json({ok:false,error:"origin_not_allowed"},403);
 if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
 if(Number(request.headers.get("content-length")||0)>6000)return json({ok:false,error:"request_too_large"},413);
 const identity=await currentIdentity();if(!identity)return json({ok:false,error:"sign_in_required"},401);
 let input:unknown;
 try{const raw=await request.text();if(raw.length>6000)return json({ok:false,error:"request_too_large"},413);input=JSON.parse(raw);}
 catch{return json({ok:false,error:"invalid_json"},400);}
 if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
 const {course:slug,lesson:lessonSlug,text}=input as Record<string,unknown>;
 if(typeof slug!=="string"||typeof lessonSlug!=="string"||!validWorkbookText(text))return json({ok:false,error:"invalid_payload"},400);
 const course=getCourse(slug);const lesson=course&&getLesson(course,lessonSlug);
 if(!course||!lesson)return json({ok:false,error:"not_found"},404);
 if(!canReadLesson(course,lesson,identity))return json({ok:false,error:"entitlement_required"},403);
 if(!progressConfigured())return json({ok:false,error:"storage_not_configured"},503);
 try{await saveWorkbook(identity,course.slug,lesson.slug,text);return json({ok:true,saved:true},200);}
 catch{return json({ok:false,error:"storage_unavailable"},503);}
}
