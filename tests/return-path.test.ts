import test from "node:test";
import assert from "node:assert/strict";
import { safeLearningReturnPath } from "../src/lib/return-path";
test("sign-in can resume a real Academy lesson or exam",()=>{
 for(const path of ["/account","/courses/seo-aeo","/courses/travel-agent/exam",
    "/courses/seo-aeo/search-fundamentals","/programs","/programs/travel-advisor","/dashboard-guide"]){
   assert.equal(safeLearningReturnPath(path),path);
 }
});
test("login redirects cannot escape the Academy origin",()=>{
 for(const bad of ["https://evil.example","//evil.example","/%2f%2fevil.example","/\\evil.example",
   "/admin","/api/exams","/auth/logout","/courses/../../etc","/courses/seo-aeo?to=//evil.example",
   "/%61ccount","/courses/abc%0d%0aHost:evil.example",undefined,null,123]){
   assert.equal(safeLearningReturnPath(bad),"/account");
 }
});
