# Academy TASK QUEUE

Legend: [x] committed to main; [ ] incomplete or unverified. Tasks are ordered to minimize risk and dependency conflicts.

## Source-level foundation
- [x] Preserve original application; use Next.js 16/React 19, central TAKATAK identity.
- [x] 29 categorized course tracks + 145 starter lessons; 8 structured programs.
- [x] Map TAKATAK-V1 service navigation into Academy training directory.
- [x] Explicit free/Plus/one-time purchase access boundaries.
- [x] Authenticated completion API, graded exams, best-score point accumulation.
- [x] Fix completed-program count, batch student transcript query and surface storage failures.
- [x] Resume the requested lesson or exam after trusted V1 login (relative allowlist).
- [x] Save student-written exercises in private Academy PostgreSQL workbooks, scoped to course/lesson and central TAKATAK identity; show question-by-question feedback after exams.
- [x] Original course illustration assets and mobile-responsive assessment UI.
- [x] Add Coolify workflow gated on green `main` CI and explicit opt-in; require matching deployed commit and operational readiness.
- [x] Implement separate `/api/ready` endpoint for database migration/SSO config checks.
- [x] Add versioned private 10–60-item exam banks, random five-question candidate tickets, V1-authorized editor/reviewer UI, review separation and versioned attempt metadata (migration 004).
- [x] Add revocable privacy-safe internal educational awards for genuinely completed programs (migration 005), issuance/verification API, student experience, and V1-authorized admin revocation interface.

## Required production blockers
- [ ] V1 owner/coordinator reviews, CI-validates and merges PR #183, **not** through an unrelated Academy agent.
- [ ] Create Academy application in the approved Coolify instance on Contabo or confirmed host, with public HTTPS origin.
- [ ] Configure V1 and Academy callback URLs, dedicated service token, session secret, and Academy PostgreSQL `DATABASE_URL` (never commit values).
- [ ] Take Academy DB backup, obtain migration approval and apply `db/001_academy.sql`, `db/002_exam_attempt.sql`, `db/003_lesson_workbook.sql`, `db/004_private_exam_bank.sql`, `db/005_program_awards.sql`.
- [ ] Exercise genuine V1 one-use-code SSO (valid, expired, replay, wrong state) and verify identity-specific private data.
- [ ] Implement V1 paid plans and purchases with payment-confirmed entitlements; test subscription expiry, cancellation, refund and specialist-course isolation.
- [ ] Configure `COOLIFY_WEBHOOK`, `COOLIFY_TOKEN`, `ACADEMY_HEALTHCHECK_URL`, and enable `ACADEMY_AUTODEPLOY_ENABLED` only when migration and service smoke tests succeed.
- [ ] Inspect actual Coolify deployment record and production `/api/ready` for exact commit.
- [ ] Run real authentication, progress storage, exam grading and access-denial E2E on deployed environment.

## Curriculum and product completion
- [ ] Instructor editorial review and deeper module content/video, multimedia transcripts, hands-on demonstrations, worked examples and graded practical assignments.
- [x] Private versioned item-bank source, randomized selection, instructor review/publish workflow, signed tickets and schema migration authored.
- [ ] Provision distinct V1 editor/reviewer entitlements, apply migration 004, create original reviewed exam items, and test actual private bank E2E; add risk-based anti-cheating/regulated controls.
- [ ] Provision V1 `academy_awards_admin` entitlement, apply migration 005, test real program award issuance, exact progress/score eligibility, public verification, revoke and idempotency; review jurisdictional educational wording.
- [ ] Student/staff role-authorized instructor CMS: draft/review/publish content, moderation, audit history.
- [ ] Optional AI tutor through server-side provider adapter, privacy minimization, consent, rate/cost limits and grounded answers; no fabricated integration status.
- [ ] Accessible Québec French localization with content, legal notices and assessment parity.
- [x] Academy-only educational program record issuance, privacy-safe public verification and revocation are implemented in source.
- [ ] Complete deployed E2E and official branding/content review for Academy educational awards; **not** government-accredited licensing without approvals.
- [ ] Optional affiliate/referrals only after tracking, contracts, fraud checks and payout reconciliation.
- [ ] Security, accessibility and real-browser regression QA, threat modelling, mobile performance and privacy review.
- [ ] Document operational runbooks and final production evidence; only then consider repository 100% complete.

## Next executable development after this session
Review GitHub `main` / `docs/AGENT_HANDOFF.md`, latest Academy CI, then implement the next independent source-level task (private exam bank/instructor-reviewed syllabus or resilient credential workflow) while V1 and Coolify activation remain externally gated. Do not invent secrets or deployment evidence.

## Next quality milestone
- [x] Add `workflow_dispatch` to Academy CI so latest `main` can be reverified after documentation-only pushes without bypassing tests.
- [x] Verify workflow-source commit `f176531a` via green Academy CI run `38792169955` (tests, typecheck, lint, build).
- [ ] Produce end-to-end database-backed test coverage (approved dedicated test Postgres) for exam-bank four-eyes publication, signed exam tickets, 24h attempt cap, student workbook isolation, educational record issuance/revocation and replay.
- [ ] Prepare deeper instructional content and accessible bilingual training, with instructor approvals and QA.
