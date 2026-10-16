import "server-only";
import { randomInt,randomUUID } from "node:crypto";
import type { AnswerKeyQuestion } from "./service-courses";
import type { AcademyIdentity } from "./access";
import { getExamKey, type PublicQuestion } from "./exams";
import { validExamBank,selectQuestionIds } from "./assessment-policy";
import { issueAssessmentTicket, type AssessmentTicket } from "./assessment-ticket";
import { learningDb } from "./progress";

export type ExamBankVersion={
 courseSlug:string;version:number;status:"draft"|"published"|"retired";
 questions:AnswerKeyQuestion[];createdBy:string;reviewedBy:string|null;publishedAt:string|null
};
export type LearnerAssessment={
 questions:PublicQuestion[]; ticket:string; source:"public_practice"|"private_reviewed";
 version:number
};
const PUBLIC=(questions:AnswerKeyQuestion[]):PublicQuestion[]=>
 questions.map(({id,prompt,choices})=>({id,prompt,choices}));
type ExamBankRow={course_slug:string;version:number;status:ExamBankVersion["status"];
 questions:AnswerKeyQuestion[];created_by:string;reviewed_by:string|null;published_at:string|null};
const mapRow=(r:ExamBankRow):ExamBankVersion=>({
 courseSlug:r.course_slug,version:r.version,status:r.status,questions:r.questions,
 createdBy:r.created_by,reviewedBy:r.reviewed_by,publishedAt:r.published_at
});

export async function hasPrivateBankSchema():Promise<boolean>{
 const db=learningDb();if(!db)return false;
 const result=await db.query<{bank:string|null}>("SELECT to_regclass('academy_exam_version')::text AS bank");
 return !!result.rows[0]?.bank;
}
export async function readPublishedExam(course:string):Promise<ExamBankVersion|null>{
 const db=learningDb();if(!db)return null;
 if(!await hasPrivateBankSchema())return null;
 const r=await db.query<ExamBankRow>(
   "SELECT * FROM academy_exam_version WHERE course_slug=$1 AND status='published' LIMIT 1",[course]);
 return r.rows[0]?mapRow(r.rows[0]):null;
}
export async function readExamVersion(course:string,version:number):Promise<ExamBankVersion|null>{
 const db=learningDb();if(!db)return null;
 if(!await hasPrivateBankSchema())return null;
 const r=await db.query<ExamBankRow>(
   "SELECT * FROM academy_exam_version WHERE course_slug=$1 AND version=$2 AND status IN ('published','retired')",
   [course,version]);
 return r.rows[0]?mapRow(r.rows[0]):null;
}
export async function issueLearnerAssessment(identity:AcademyIdentity,slug:string):Promise<LearnerAssessment|null>{
 const published=await readPublishedExam(slug);
 const bank=published?.questions??getExamKey(slug);
 if(!bank)return null;
 if(published && !validExamBank(bank))throw new Error("invalid_published_exam");
 const ids=published?
  selectQuestionIds(bank,5,()=>randomInt(0,2**24)/(2**24)) :
  bank.map(q=>q.id);
 const byId=new Map(bank.map(q=>[q.id,q]));
 const questions=ids.map(id=>byId.get(id)).filter((q):q is AnswerKeyQuestion=>Boolean(q));
 if(questions.length!==5)throw new Error("invalid_assessment_selection");
 const source=published?"private_reviewed" as const:"public_practice" as const;
 const version=published?.version??0;
 const secret=process.env.ACADEMY_SESSION_SECRET||"";
 const ticket:AssessmentTicket={sub:identity.sub,course:slug,version,source,
   questionIds:ids,expiresAt:Math.floor(Date.now()/1000)+15*60,nonce:randomUUID()};
 return {questions:PUBLIC(questions),ticket:issueAssessmentTicket(ticket,secret),source,version};
}
export async function verifyTicketQuestions(ticket:AssessmentTicket):Promise<AnswerKeyQuestion[]|null>{
 const bank=ticket.source==="private_reviewed"?
   (await readExamVersion(ticket.course,ticket.version))?.questions??null :
   ticket.version===0?getExamKey(ticket.course):null;
 if(!bank)return null;
 const byId=new Map(bank.map(q=>[q.id,q]));
 const selected=ticket.questionIds.map(id=>byId.get(id));
 return selected.every((q):q is AnswerKeyQuestion=>!!q)?selected as AnswerKeyQuestion[]:null;
}
export class ExamDraftConflict extends Error {}
export async function createExamDraft(identity:AcademyIdentity,course:string,questions:AnswerKeyQuestion[]):Promise<number>{
 if(!validExamBank(questions))throw new Error("invalid_question_bank");
 const db=learningDb();if(!db)throw new Error("database_unavailable");
 const client=await db.connect();
 try{
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1), 823418)",[course]);
  const next=await client.query<{version:number}>(
    "SELECT COALESCE(MAX(version),0)::integer+1 AS version FROM academy_exam_version WHERE course_slug=$1",[course]);
  const version=next.rows[0].version;
  await client.query(
    "INSERT INTO academy_exam_version(course_slug,version,status,questions,created_by) VALUES($1,$2,'draft',$3::jsonb,$4)",
    [course,version,JSON.stringify(questions),identity.sub]);
  await client.query("COMMIT");return version;
 }catch(error){await client.query("ROLLBACK");throw error;}
 finally{client.release();}
}
export async function publishExamDraft(identity:AcademyIdentity,course:string,version:number):Promise<void>{
 const db=learningDb();if(!db)throw new Error("database_unavailable");
 const client=await db.connect();
 try{
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1), 823418)",[course]);
  const r=await client.query<ExamBankRow>(
    "SELECT * FROM academy_exam_version WHERE course_slug=$1 AND version=$2 FOR UPDATE",[course,version]);
  const target=r.rows[0];
  if(!target||target.status!=="draft"||target.created_by===identity.sub||!validExamBank(target.questions))
    throw new ExamDraftConflict("review_separation_or_draft_invalid");
  await client.query(
    "UPDATE academy_exam_version SET status='retired' WHERE course_slug=$1 AND status='published'",[course]);
  await client.query(
    "UPDATE academy_exam_version SET status='published',reviewed_by=$3,published_at=NOW() WHERE course_slug=$1 AND version=$2",
    [course,version,identity.sub]);
  await client.query("COMMIT");
 }catch(error){await client.query("ROLLBACK");throw error;}
 finally{client.release();}
}
export async function listExamVersions(course:string):Promise<ExamBankVersion[]>{
 const db=learningDb();if(!db)throw new Error("database_unavailable");
 const r=await db.query<ExamBankRow>(
   "SELECT * FROM academy_exam_version WHERE course_slug=$1 ORDER BY version DESC LIMIT 30",[course]);
 return r.rows.map(mapRow);
}
