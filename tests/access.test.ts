import test from "node:test";
import assert from "node:assert/strict";
import { canReadLesson, courseProgress } from "../src/lib/access";
import { courses, getCourse, getLesson } from "../src/lib/catalog";

const future=Math.floor(Date.now()/1000)+300;
const free={slug:"seo-aeo",access:"free" as const};
const plus={slug:"shopify",access:"freemium" as const};
const special={slug:"travel-agent",access:"one_time" as const};
const publicLesson={access:"free" as const};
const premiumLesson={access:"plus" as const};
const specialistLesson={access:"purchase" as const};
const account=(entitlements:string[],exp=future)=>({sub:"master-identity-id",name:"Learner",entitlements,exp});

test("free courses and free previews can always be read",()=>{
  assert.equal(canReadLesson(free,premiumLesson,null),true);
  assert.equal(canReadLesson(plus,publicLesson,null),true);
  assert.equal(canReadLesson(special,publicLesson,null),true);
});
test("paid lessons are never publicly accessible",()=>{
  assert.equal(canReadLesson(plus,premiumLesson,null),false);
  assert.equal(canReadLesson(special,specialistLesson,null),false);
  assert.equal(canReadLesson(plus,premiumLesson,account([],future-400)),false);
});
test("Academy Plus cannot unlock individually purchased professional training",()=>{
  assert.equal(canReadLesson(plus,premiumLesson,account(["academy_plus"])),true);
  assert.equal(canReadLesson(special,specialistLesson,account(["academy_plus"])),false);
});
test("individual purchased courses are isolated",()=>{
  assert.equal(canReadLesson(special,specialistLesson,account(["academy_course:travel-agent"])),true);
  assert.equal(canReadLesson({slug:"different-course",access:"one_time"},specialistLesson,account(["academy_course:travel-agent"])),false);
  assert.equal(canReadLesson(plus,premiumLesson,account(["academy_course:travel-agent"])),false);
});
test("all access can unlock premium course lessons for an active identity",()=>{
  assert.equal(canReadLesson(special,specialistLesson,account(["academy_all_access"])),true);
  assert.equal(canReadLesson(plus,premiumLesson,account(["academy_all_access"])),true);
});
test("all lesson identifiers in a course are unique and accessible by lookup",()=>{
  for(const course of courses){
    assert.ok(course.lessons.length>=4);
    assert.equal(new Set(course.lessons.map((lesson)=>lesson.slug)).size,course.lessons.length);
    assert.equal(getCourse(course.slug)?.title,course.title);
    for(const lesson of course.lessons)assert.equal(getLesson(course,lesson.slug)?.title,lesson.title);
    if(course.access==="freemium" || course.access==="one_time"){
      assert.equal(course.lessons[0].access,"free");
      assert.equal(course.lessons[1].access,"free");
      assert.ok(course.lessons.slice(2).every((item)=>item.access!=="free"));
    }
  }
});
test("progress is bounded and counts distinct lessons",()=>{
  assert.equal(courseProgress(["one","one","two"],4),50);
  assert.equal(courseProgress(["one"],0),0);
  assert.equal(courseProgress(["a","b","c"],2),100);
});
