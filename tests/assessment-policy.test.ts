import test from "node:test";
import assert from "node:assert/strict";
import { validExamBank,selectQuestionIds,canAuthorExams,canReviewExams } from "../src/lib/assessment-policy";
import { issueAssessmentTicket,verifyAssessmentTicket } from "../src/lib/assessment-ticket";
const questions=Array.from({length:12},(_,i)=>({
 id:"topic-"+i,prompt:"Which behavior fits a real-world professional learning program? "+i,
 choices:["Verify and document result "+i,"Invent the customer data "+i,"Ignore security rules "+i,"Declare success without a check "+i],
 correctIndex:0,explanation:"Reliable work requires evidence and documented verification "+i
}));
test("private bank validates diverse items and rejects malformed answer keys",()=>{
 assert.equal(validExamBank(questions),true);
 assert.equal(validExamBank(questions.slice(0,5)),false);
 assert.equal(validExamBank([...questions,{...questions[0]}]),false);
 assert.equal(validExamBank(questions.map((q,i)=>i===0?{...q,correctIndex:12}:q)),false);
 assert.equal(validExamBank(questions.map((q,i)=>i===0?{...q,choices:[q.choices[0],q.choices[0],"X","Y"]}:q)),false);
});
test("question sampler returns distinct items reproducibly with injected entropy",()=>{
 const selected=selectQuestionIds(questions,5,()=>0.5);
 assert.equal(selected.length,5);
 assert.equal(new Set(selected).size,5);
 assert.deepEqual(selectQuestionIds(questions,5,()=>0.5),selected);
});
test("editor and reviewer require different signed TAKATAK entitlements",()=>{
 const now=Math.ceil(Date.now()/1000)+120;
 const editor={sub:"123",name:"Editor",exp:now,entitlements:["academy_editor"]};
 assert.equal(canAuthorExams(editor),true);
 assert.equal(canReviewExams(editor),false);
 assert.equal(canReviewExams({...editor,entitlements:["academy_reviewer"]}),true);
 assert.equal(canAuthorExams({...editor,exp:1}),false);
});
test("exam ticket bound to user, course, five selected IDs, expiry and signature",()=>{
 const now=2_000_000_000,secret="s".repeat(40);
 const t={sub:"person1",course:"seo-aeo",version:3,source:"private_reviewed" as const,
 questionIds:["q1","q2","q3","q4","q5"],expiresAt:now+900,nonce:"bb644ee3-c218-43ea-bd8f-d74783a423f9"};
 const token=issueAssessmentTicket(t,secret);
 assert.deepEqual(verifyAssessmentTicket(token,secret,"person1","seo-aeo",now),t);
 assert.equal(verifyAssessmentTicket(token,secret,"person2","seo-aeo",now),null);
 assert.equal(verifyAssessmentTicket(token,secret,"person1","shopify",now),null);
 assert.equal(verifyAssessmentTicket(token,secret,"person1","seo-aeo",now+901),null);
 assert.equal(verifyAssessmentTicket(token+"x",secret,"person1","seo-aeo",now),null);
});
