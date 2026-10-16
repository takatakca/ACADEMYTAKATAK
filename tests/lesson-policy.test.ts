import test from "node:test";
import assert from "node:assert/strict";
import {validLessonRevision,canWriteLessons,canPublishLessons} from "../src/lib/lesson-policy";

const good={title:"Planning a customer journey",paragraphs:[
 "Document the customer's real needs and the action expected at each stage.",
 "Identify measurable outcomes, permission boundaries and a verification checklist."
],activity:"Write a five-step checklist to document one customer interaction."};
test("lesson editorial copy has bounded, plain-text content and useful practice",()=>{
 assert.equal(validLessonRevision(good),true);
 assert.equal(validLessonRevision({...good,paragraphs:["Short"]}),false);
 assert.equal(validLessonRevision({...good,title:"Tiny"}),false);
 assert.equal(validLessonRevision({...good,activity:"Too short"}),false);
 assert.equal(validLessonRevision({...good,paragraphs:[...good.paragraphs,...Array(14).fill(good.paragraphs[0])]}),false);
 assert.equal(validLessonRevision({...good,paragraphs:[good.paragraphs[0],123]}),false);
});
test("separate signed TAKATAK instructor author/reviewer roles are required",()=>{
 const base={sub:"master-a",name:"staff",exp:Math.floor(Date.now()/1000)+200,entitlements:["academy_editor"]};
 assert.equal(canWriteLessons(base),true);
 assert.equal(canPublishLessons(base),false);
 assert.equal(canPublishLessons({...base,entitlements:["academy_reviewer"]}),true);
 assert.equal(canWriteLessons({...base,exp:1}),false);
 assert.equal(canPublishLessons(null),false);
});
