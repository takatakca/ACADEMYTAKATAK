import test from "node:test";
import assert from "node:assert/strict";
import { courses } from "../src/lib/catalog";
import { getExamKey,getPublicExam,gradeExam,POINTS_PER_QUESTION,PASS_PERCENT } from "../src/lib/exams";
import { serviceDashboardPaths } from "../src/lib/service-courses";

test("every TAKATAK course has a complete five-question graded exam",()=>{
  assert.ok(courses.length>=25);
  assert.equal(new Set(courses.map(c=>c.slug)).size,courses.length);
  for(const c of courses){
    const key=getExamKey(c.slug);
    assert.ok(key,`missing exam for ${c.slug}`);
    assert.equal(key.length,5);
    assert.equal(new Set(key.map(x=>x.id)).size,5);
    for(const q of key){
      assert.equal(q.choices.length,4);
      assert.equal(new Set(q.choices).size,4);
      assert.ok(q.prompt.length>=20);
      assert.ok(q.correctIndex>=0&&q.correctIndex<4);
      assert.ok(q.explanation.length>15);
    }
    const publicQuestions=getPublicExam(c.slug);
    assert.equal(publicQuestions.length,5);
    assert.ok(publicQuestions.every(question=>!("correctIndex" in question) && !("explanation" in question)));
  }
});
test("correct responses pass, earn 100 points; wrong responses fail",()=>{
  for(const c of courses){
    const key=getExamKey(c.slug)!;
    const correct=key.map(x=>x.correctIndex);
    const passed=gradeExam(key,correct);
    assert.equal(passed.passed,true);
    assert.equal(passed.correct,5);
    assert.equal(passed.percent,100);
    assert.equal(passed.points,5*POINTS_PER_QUESTION);
    const wrong=correct.map(x=>(x+1)%4);
    const failed=gradeExam(key,wrong);
    assert.equal(failed.passed,false);
    assert.equal(failed.points,0);
    assert.equal(failed.percent,0);
  }
  assert.equal(PASS_PERCENT,80);
});
test("answers cannot supply arbitrary points or malformed choices",()=>{
  const key=getExamKey("seo-aeo")!;
  assert.throws(()=>gradeExam(key,[0]),/Invalid/);
  assert.throws(()=>gradeExam(key,[0,0,0,0,9]),/Invalid/);
  assert.throws(()=>gradeExam(key,[0,0,0,0,NaN]),/Invalid/);
  assert.equal(getExamKey("nonexistent-course"),null);
  assert.deepEqual(getPublicExam("nonexistent-course"),[]);
});
test("new courses map to genuine TAKATAK-V1 dashboard module routes",()=>{
  assert.ok(serviceDashboardPaths.length>=20);
  const slugSet=new Set(courses.map(c=>c.slug));
  for(const {slug,dashboardPath} of serviceDashboardPaths){
    assert.ok(slugSet.has(slug),slug);
    assert.match(dashboardPath,/^\/dashboard(?:\/[a-z0-9-]+)*$/);
    assert.equal(courses.find(c=>c.slug===slug)?.dashboardPath,dashboardPath);
  }
});
