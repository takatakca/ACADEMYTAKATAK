import test from "node:test";
import assert from "node:assert/strict";
import { courses,getCourse } from "../src/lib/catalog";
import { dashboardLearningMap,dashboardMappedScreens } from "../src/lib/dashboard-learning-map";
import { programs,getProgram,getProgramCourses } from "../src/lib/programs";

test("every actual TAKATAK-V1 navigation item has a relevant Academy learning link",()=>{
 const routes=new Set<string>();
 let count=0;
 for(const section of dashboardLearningMap){
   assert.ok(section.title.length>0);
   for(const item of section.items){
     assert.ok(item.label);
     assert.match(item.href,/^\/dashboard(?:\/[a-z0-9-]+)*$/);
     assert.ok(!routes.has(item.href),`duplicated V1 route ${item.href}`);
     routes.add(item.href);
     assert.ok(getCourse(item.course),`missing course for dashboard route ${item.href}`);
     count++;
   }
 }
 assert.equal(dashboardMappedScreens,count);
 assert.ok(count>=55);
});
test("structured programs provide unique paths and real active course references",()=>{
 assert.equal(new Set(programs.map(p=>p.slug)).size,programs.length);
 assert.ok(programs.length>=8);
 for(const program of programs){
   assert.equal(getProgram(program.slug),program);
   const paths=getProgramCourses(program);
   assert.equal(paths.length,program.courseSlugs.length);
   assert.equal(new Set(program.courseSlugs).size,program.courseSlugs.length);
   assert.ok(paths.length>=4);
   for(const path of paths){
      assert.ok(courses.includes(path));
      assert.ok(path.lessons.length>=4);
   }
 }
 assert.equal(getProgram("not-a-program"),undefined);
});
