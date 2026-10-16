import test from "node:test";
import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {issueAssessmentTicket,verifyAssessmentTicket} from "../src/lib/assessment-ticket";
test("signed exam ticket requires an unpredictable 128-bit nonce",()=>{
 const secret="f".repeat(48), now=Math.floor(Date.now()/1000);
 const ticket={sub:"master1",course:"seo-aeo",source:"private_reviewed" as const,version:1,
  questionIds:["a1","a2","a3","a4","a5"],expiresAt:now+600,nonce:randomUUID()};
 const signed=issueAssessmentTicket(ticket,secret);
 assert.deepEqual(verifyAssessmentTicket(signed,secret,"master1","seo-aeo",now),ticket);
 assert.equal(verifyAssessmentTicket(signed,"z".repeat(48),"master1","seo-aeo",now),null);
 assert.throws(()=>issueAssessmentTicket({...ticket,nonce:"not a UUID"},secret),/invalid_ticket/);
 assert.throws(()=>issueAssessmentTicket({...ticket,nonce:undefined} as never,secret),/invalid_ticket/);
});
