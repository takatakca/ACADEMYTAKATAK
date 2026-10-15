import test from "node:test";
import assert from "node:assert/strict";
import { eligibleForProgramAward,validAwardId } from "../src/lib/award-policy";
import { courses } from "../src/lib/catalog";
import { programs } from "../src/lib/programs";
import { randomUUID } from "node:crypto";
test("award eligibility requires all program lessons AND passing final exams",()=>{
 const program=programs[0], selected=program.courseSlugs.map(slug=>courses.find(c=>c.slug===slug)!);
 const progress=new Map(selected.map(c=>[c.slug,c.lessons.map(l=>l.slug)]));
 const grades=new Map(selected.map(c=>[c.slug,{courseSlug:c.slug,passed:true,bestPoints:80}]));
 assert.equal(eligibleForProgramAward(program,courses,progress,grades),true);
 const missing=new Map(progress);missing.set(selected[0].slug,[]);
 assert.equal(eligibleForProgramAward(program,courses,missing,grades),false);
 const failed=new Map(grades);failed.set(selected[0].slug,{courseSlug:selected[0].slug,passed:false,bestPoints:60});
 assert.equal(eligibleForProgramAward(program,courses,progress,failed),false);
 assert.equal(eligibleForProgramAward({courseSlugs:["unknown"]},courses,progress,grades),false);
});
test("public certificate IDs are opaque UUIDs, not identity or unsafe paths",()=>{
 assert.equal(validAwardId(randomUUID()),true);
 for(const id of ["1234","../config","person-name@example.com","nonexistent","%2f",null])assert.equal(validAwardId(id),false);
});
