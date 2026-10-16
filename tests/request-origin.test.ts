import test from "node:test";
import assert from "node:assert/strict";
import {isSameWriteOrigin} from "../src/lib/request-origin";
test("write endpoints enforce full same-origin including scheme and port",()=>{
 assert.equal(isSameWriteOrigin("https://academy.example","https://academy.example"),true);
 assert.equal(isSameWriteOrigin("https://academy.example","https://academy.example/api/exams"),true);
 for(const origin of [
    null,"http://academy.example","https://academy.example:8443","https://evil.example",
    "https://academy.example.evil.example","https://academy.example@evil.example",
    "https://academy.example/path","null","not an origin", "https://academy.example?foo=bar"
 ]){
   assert.equal(isSameWriteOrigin(origin,"https://academy.example"),false,String(origin));
 }
});
test("HTTP is permitted only for trusted localhost development origins",()=>{
 assert.equal(isSameWriteOrigin("http://localhost:3000","http://localhost:3000"),true);
 assert.equal(isSameWriteOrigin("http://127.0.0.1:3000","http://127.0.0.1:3000"),true);
 assert.equal(isSameWriteOrigin("http://10.0.0.2:3000","http://10.0.0.2:3000"),false);
});
