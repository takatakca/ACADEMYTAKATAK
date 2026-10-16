import { NextRequest, NextResponse } from "next/server";
import { currentIdentity } from "@/lib/session";
import { getCourse } from "@/lib/catalog";
import { canReadLesson } from "@/lib/access";
import { gradeExam } from "@/lib/exams";
import { verifyAssessmentTicket } from "@/lib/assessment-ticket";
import { verifyTicketQuestions } from "@/lib/private-exams";
import { readProgress,progressConfigured } from "@/lib/progress";
import { ExamLimitError,ExamReplayError,saveExamAttempt } from "@/lib/exam-records";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const json=(data:object,status:number)=>NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:NextRequest){
  const origin=request.headers.get("origin");
  if(!origin || (()=>{try{return new URL(origin).host!==request.nextUrl.host;}catch{return true;}})())return json({ok:false,error:"origin_not_allowed"},403);
  if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
  if(Number(request.headers.get("content-length")||0)>4096)return json({ok:false,error:"request_too_large"},413);
  const identity=await currentIdentity();
  if(!identity)return json({ok:false,error:"sign_in_required"},401);
  if(!progressConfigured())return json({ok:false,error:"progress_not_configured"},503);
  let input:unknown;
  try { const raw=await request.text(); if(raw.length>4096)return json({ok:false,error:"request_too_large"},413);input=JSON.parse(raw); }
  catch{return json({ok:false,error:"invalid_json"},400);}
  if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
  const {course:slug,answers,ticket:ticketToken}=input as Record<string,unknown>;
  if(typeof slug!=="string"||slug.length>100||typeof ticketToken!=="string"||!Array.isArray(answers)||answers.length!==5||
     !answers.every(x=>Number.isInteger(x)&&x>=0&&x<=3))return json({ok:false,error:"invalid_answers"},400);
  const course=getCourse(slug);
  if(!course)return json({ok:false,error:"not_found"},404);
  const ticket=verifyAssessmentTicket(ticketToken,process.env.ACADEMY_SESSION_SECRET||"",identity.sub,slug);
  if(!ticket)return json({ok:false,error:"exam_ticket_expired"},403);
  if(!course.lessons.every(lesson=>canReadLesson(course,lesson,identity)))
    return json({ok:false,error:"payment_or_entitlement_required"},403);
  try {
    const completed=await readProgress(identity,slug);
    if(!course.lessons.every(lesson=>completed.includes(lesson.slug)))
      return json({ok:false,error:"finish_lessons_first"},403);
    const questions=await verifyTicketQuestions(ticket);
    if(!questions)return json({ok:false,error:"exam_version_unavailable"},409);
    const grade=gradeExam(questions,answers as number[]);
    const bestPoints=await saveExamAttempt(identity,slug,grade,ticket.source,ticket.version,ticket.nonce);
    const review=questions.map((q,i)=>({
      id:q.id,prompt:q.prompt,correct:q.correctIndex===(answers as number[])[i],
      correctAnswer:q.choices[q.correctIndex],explanation:q.explanation
    }));
    return json({ok:true,grade:{...grade,review},bestPoints,attemptLimit:3,passingPercent:80},200);
  }catch(e){
    if(e instanceof ExamLimitError)return json({ok:false,error:"exam_attempt_limit"},429);
    if(e instanceof ExamReplayError)return json({ok:false,error:"exam_ticket_already_used"},409);
    return json({ok:false,error:"exam_unavailable"},503);
  }
}
