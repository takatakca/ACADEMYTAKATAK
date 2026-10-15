import test from "node:test";
import assert from "node:assert/strict";
import { validWorkbookText,MAX_WORKBOOK_CHARS } from "../src/lib/workbook-policy";
test("workbook accepts reasonable student responses",()=>{
 assert.ok(validWorkbookText("This is my practice action plan."));
 assert.ok(validWorkbookText("a".repeat(MAX_WORKBOOK_CHARS)));
});
test("workbook rejects empty oversized or incorrectly typed content",()=>{
 for(const input of ["", "   ", "a".repeat(MAX_WORKBOOK_CHARS+1),null,12,{},[]])
  assert.equal(validWorkbookText(input),false);
});
