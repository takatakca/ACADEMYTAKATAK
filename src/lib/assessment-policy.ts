import type { AnswerKeyQuestion } from "./service-courses";
import type { AcademyIdentity } from "./access";

export const MIN_PRIVATE_QUESTIONS = 10;
export const MAX_PRIVATE_QUESTIONS = 60;
export const EXAM_QUESTION_COUNT = 5;

export function canAuthorExams(identity:AcademyIdentity|null):boolean {
 return !!identity && identity.exp>Date.now()/1000 && identity.entitlements.includes("academy_editor");
}
export function canReviewExams(identity:AcademyIdentity|null):boolean {
 return !!identity && identity.exp>Date.now()/1000 && identity.entitlements.includes("academy_reviewer");
}
export function validExamBank(input:unknown):input is AnswerKeyQuestion[]{
 if(!Array.isArray(input)||input.length<MIN_PRIVATE_QUESTIONS||input.length>MAX_PRIVATE_QUESTIONS)return false;
 const seen=new Set<string>();
 for(const row of input){
   if(!row||typeof row!=="object"||Array.isArray(row))return false;
   const item=row as Record<string,unknown>;
   if(typeof item.id!=="string"||!/^[a-zA-Z0-9_-]{1,45}$/.test(item.id)||seen.has(item.id))return false;
   seen.add(item.id);
   if(typeof item.prompt!=="string"||item.prompt.trim().length<20||item.prompt.length>800)return false;
   if(!Array.isArray(item.choices)||item.choices.length!==4||
      !item.choices.every(v=>typeof v==="string"&&v.trim().length>=2&&v.length<=300))return false;
   if(new Set(item.choices.map(v=>(v as string).trim().toLowerCase())).size!==4)return false;
   if(!Number.isInteger(item.correctIndex)|| (item.correctIndex as number)<0 || (item.correctIndex as number)>3)return false;
   if(typeof item.explanation!=="string"||item.explanation.trim().length<15||item.explanation.length>1000)return false;
 }
 return true;
}
export function selectQuestionIds(questions:readonly AnswerKeyQuestion[],count=EXAM_QUESTION_COUNT,random:()=>number=Math.random):string[]{
 if(questions.length<count||count<=0||count>EXAM_QUESTION_COUNT)throw new Error("invalid_question_pool");
 const pool=questions.map(q=>q.id);
 for(let i=pool.length-1;i>0;i--){
   const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw new Error("invalid_random");
   const j=Math.floor(r*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];
 }
 return pool.slice(0,count);
}
