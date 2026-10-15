import test from "node:test";
import assert from "node:assert/strict";
import { courses } from "../src/lib/catalog";
import { programs } from "../src/lib/programs";
import { isCourseMastered,masteredProgramCount,totalEarnedPoints } from "../src/lib/achievements";
const one=courses.find(x=>x.slug==="dashboard-essentials")!;
test("a passed exam alone never completes a program or course",()=>{
 const grades=new Map([[one.slug,{courseSlug:one.slug,passed:true,bestPoints:100}]]);
 assert.equal(isCourseMastered(one,new Map(),grades),false);
 assert.equal(masteredProgramCount(programs,courses,new Map(),grades),0);
});
test("all lessons plus a passing exam masters a course",()=>{
 const grades=new Map([[one.slug,{courseSlug:one.slug,passed:true,bestPoints:80}]]);
 const progress=new Map([[one.slug,one.lessons.map(l=>l.slug)]]);
 assert.equal(isCourseMastered(one,progress,grades),true);
 grades.set(one.slug,{courseSlug:one.slug,passed:false,bestPoints:60});
 assert.equal(isCourseMastered(one,progress,grades),false);
});
test("program totals count programs, not individual passed courses",()=>{
 const first=programs[0];
 const all=first.courseSlugs.map(slug=>courses.find(c=>c.slug===slug)!);
 const grades=new Map(all.map(c=>[c.slug,{courseSlug:c.slug,passed:true,bestPoints:100}]));
 const progress=new Map(all.map(c=>[c.slug,c.lessons.map(l=>l.slug)]));
 const made=masteredProgramCount(programs,courses,progress,grades);
 assert.ok(made>=1);assert.ok(made<all.length);
 assert.equal(totalEarnedPoints([...grades.values()]),all.length*100);
});
