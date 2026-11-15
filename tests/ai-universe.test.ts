import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getProgram } from "../src/lib/programs";

const source = readFileSync(new URL("../src/app/universe/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/app/universe/universe.module.css", import.meta.url), "utf8");

test("AI learning universe links only to known Academy program paths", () => {
  for (const slug of ["marketing-ai", "business-intelligence", "digital-business", "sales-success"]) {
    assert.ok(getProgram(slug), `Expected a real Academy program: ${slug}`);
    assert.ok(source.includes(`/programs/${slug}`));
  }
});

test("concept presentation clearly discloses unavailable tutor capabilities", () => {
  for (const notice of ["CONCEPT PREVIEW", "NOT YET ACTIVE", "no live AI conversation", "design goals, not live product features"]) {
    assert.ok(source.includes(notice), `Missing availability disclosure: ${notice}`);
  }
  assert.ok(!source.includes("masterclass.com"), "Microsite must not reuse competitor branding or reference links");
});

test("visual experience has responsive and reduced-motion styles", () => {
  assert.ok(styles.includes("@media(max-width:650px)"));
  assert.ok(styles.includes("@media(prefers-reduced-motion:reduce)"));
});
