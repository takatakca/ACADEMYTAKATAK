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
- [x] Original course illustration assets and mobile-responsive assessment UI.
- [x] Add Coolify workflow gated on green `main` CI and explicit opt-in; require matching deployed commit and operational readiness.
- [x] Implement separate `/api/ready` endpoint for database migration/SSO config checks.

## Required production blockers
- [ ] V1 owner/coordinator reviews, CI-validates and merges PR #183, **not** through an unrelated Academy agent.
- [ ] Create Academy application in the approved Coolify instance on Contabo or confirmed host, with public HTTPS origin.
- [ ] Configure V1 and Academy callback URLs, dedicated service token, session secret, and Academy PostgreSQL `DATABASE_URL` (never commit values).
- [ ] Take Academy DB backup, obtain migration approval and apply `db/001_academy.sql`, `db/002_exam_attempt.sql`.
- [ ] Exercise genuine V1 one-use-code SSO (valid, expired, replay, wrong state) and verify identity-specific private data.
- [ ] Implement V1 paid plans and purchases with payment-confirmed entitlements; test subscription expiry, cancellation, refund and specialist-course isolation.
- [ ] Configure `COOLIFY_WEBHOOK`, `COOLIFY_TOKEN`, `ACADEMY_HEALTHCHECK_URL`, and enable `ACADEMY_AUTODEPLOY_ENABLED` only when migration and service smoke tests succeed.
- [ ] Inspect actual Coolify deployment record and production `/api/ready` for exact commit.
- [ ] Run real authentication, progress storage, exam grading and access-denial E2E on deployed environment.

## Curriculum and product completion
- [ ] Instructor editorial review and deeper module content/video, multimedia transcripts, hands-on demonstrations, worked examples and graded practical assignments.
- [ ] Harden exam integrity: private versioned item bank, sufficient randomized questions, instructor review and proportional anti-cheating.
- [ ] Student/staff role-authorized instructor CMS: draft/review/publish content, moderation, audit history.
- [ ] Optional AI tutor through server-side provider adapter, privacy minimization, consent, rate/cost limits and grounded answers; no fabricated integration status.
- [ ] Accessible Québec French localization with content, legal notices and assessment parity.
- [ ] Educational completion credential issuance/verification and revocation; **not** government-accredited licensing without approvals.
- [ ] Optional affiliate/referrals only after tracking, contracts, fraud checks and payout reconciliation.
- [ ] Security, accessibility and real-browser regression QA, threat modelling, mobile performance and privacy review.
- [ ] Document operational runbooks and final production evidence; only then consider repository 100% complete.

## Next executable development after this session
Review GitHub `main` / `docs/AGENT_HANDOFF.md`, latest Academy CI, then implement the next independent source-level task (private exam bank/instructor-reviewed syllabus or resilient credential workflow) while V1 and Coolify activation remain externally gated. Do not invent secrets or deployment evidence.
