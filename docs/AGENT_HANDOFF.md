# TAKATAK Academy — AGENT HANDOFF

Updated: 2026-10-15. Repository: https://github.com/takatakca/ACADEMYTAKATAK. Branch: `main`.

## Current checkpoint — 2026-10-15 evening (latest session)
- **Repository / branch:** `takatakca/ACADEMYTAKATAK` / `main`. Latest source commit before documentation writes: `01e7cbc029c0cb668a6f39d9ec3f1b3ac84e0f65`. Re-fetch `main` HEAD after documentation commits for exact final commit.
- **Last completed task:** six-migration PostgreSQL CI, atomic one-use exam tickets (nonce UUID signed, persisted with grading), clear HTTP 409 on replay, separate DB connection race test, reviewer/author separation DB check, exact write Origin enforcement for seven authenticated mutation routes, and bounded progress POST body.
- **Currently in progress:** final GitHub CI for latest source `01e7cbc0`; last known green concurrency CI is `38848221344` (35 tests, typecheck, lint, build; SHA `60aca968b71194161dce2258dbc21011b4c29fc2`).
- **Modified files:** `db/006_exam_ticket_once.sql`, `src/lib/assessment-ticket.ts`, `src/lib/private-exams.ts`, `src/lib/exam-records.ts`, `src/app/api/exams/route.ts`, `src/components/exam-form.tsx`, `src/app/api/ready/route.ts`, `src/lib/request-origin.ts`, seven `src/app/api/**/route.ts` mutation handlers, `tests/assessment-ticket-replay.test.ts`, `tests/db-integration.test.ts`, `tests/request-origin.test.ts`, `tests/assessment-policy.test.ts`, `.github/workflows/ci.yml`, and the documentation files.
- **Executed verification:** GitHub Actions test/typecheck/lint/build; GitHub Actions PostgreSQL 16 service, migrations 001–006 applied in a disposable isolated schema, duplicate nonce blocked even across two concurrent clients, two-person reviewer constraint enforced. Source CI run `38848221344` passed; new origin-code run must be checked before claiming green.
- **Known blockers:** Production migrations 001–006 not applied or verified, Academy Coolify application and HTTPS runtime not confirmed, V1 PR #183 open and role/payment entitlements not provisioned. Origin checks require correct proxy scheme forwarding. No actual production student login/paid-content denial/grade/award E2E.
- **Production status:** **NOT DEPLOYED / NOT VERIFIED**. Coolify deploy workflow remains gated and skipped absent explicit release variable and confirmed secrets; no resource UUID or verified live SHA. No secrets obtained or committed.
- **Access needed:** V1 coordinator for PR #183/role issuance, Coolify authorized app/domain/HTTPS, approved Academy-only PostgreSQL DBA migration and secrets, repo production Actions configuration. Avoid exposing tokens.
- **Exact next actions:** inspect latest GitHub `main` and Academy CI; if failed, read job logs and fix with SHA-safe commit, then rerun. Apply migration 006 only following DB approval/backup after 001–005. Test actual V1 SSO/cancel/expiring plan, HTTPS Origin, repeated and concurrent exam submission and student data isolation in a real staging deployment; only then enable opt-in Coolify release. Continue independent course quality and live integration tests if environment remains unavailable.
- **Orchestration:** GitHub handoff documents are not a running agent. External restart automation requires a separately authorized orchestrator.

---

## Current handoff — 2026-10-15, 14:59 Montréal
- **Repository / branch:** `takatakca/ACADEMYTAKATAK`, `main`. This session began at `ffc63d7c337de3f169e28f08fd519556e9f5d35e`.
- **Last application + workflow commit VERIFIED:** `f176531a73196bb4ef668152c59afb6452833fcc`; Academy CI run `38792169955` completed success (npm install, test, typecheck, lint, Next.js build). Earlier application commit `491e088e96322219147529faffac3a130ccfe6ea` passed run `38791816925`.
- **Latest GitHub HEAD before final handoff update:** `119a8c724a69148239b801c1c26f6b5f502609ce`; documentation-only commits after the verified source commit. After this handoff commit, re-read GitHub `main` ref for definitive latest SHA.
- **Last completed task:** implemented private versioned exams with 10–60 author-created questions, 5-item cryptographic selection, 15-minute signed learner tickets and persisted bank source/version. Restricted `/instructor/exams` and its create/publish API to short-lived V1 entitlements `academy_editor` and `academy_reviewer`, enforcing separate author and reviewer master identities. Implemented optional revocable educational program awards and privacy-safe verification (UUID), `/api/awards`, `/verify/[id]`, staff `/instructor/awards` with V1 `academy_awards_admin` permission, and learner account/program UI. Added `workflow_dispatch` to CI.
- **Current task:** complete deployment prerequisites, real PostgreSQL/SSO/role end-to-end QA and improve teacher-reviewed course content. Source CI green; **not live**.
- **Files changed:** `db/004_private_exam_bank.sql`, `db/005_program_awards.sql`, `src/lib/{assessment-policy,assessment-ticket,private-exams,award-policy,awards,exam-records}.ts`, `src/app/api/{exams,instructor/exams,instructor/exams/publish,awards,instructor/awards/revoke,ready}/route.ts`, `src/app/{instructor/exams,instructor/awards,verify/[id],courses/[slug]/exam,programs/[slug],account}/page.tsx`, `src/components/{exam-form,instructor-exam-editor,award-button,award-revocation-form}.tsx`, `src/app/globals.css`, `tests/{assessment-policy,award-policy}.test.ts`, `.github/workflows/ci.yml`, `README.md`, five status/handoff documents and learning architecture document.
- **Verification performed:** GitHub file/ref/tree inspection, V1 PR #183 inspection, search for Academy PRs/issues (none open), multiple Academy CI logs. First CI failure on a page committed before its component was resolved by the following component commit; final code CI passed. Attempt to read GitHub deployments through the public fetch connector was refused as an unsupported API endpoint, so no verified deployment status can be inferred from it.
- **Deployment status:** **NOT VERIFIED**. The GitHub Coolify deployment workflow is intentionally skipped without `ACADEMY_AUTODEPLOY_ENABLED=true`; no Academy Coolify UUID, deployed commit, public HTTPS readiness or DB E2E evidence. No SQL was applied during this session. TAKATAK-V1 PR #183 remains open/unmerged as last checked.
- **Known blockers:** provision dedicated Academy Coolify app/domain + Secrets without disclosure; authorized DBA backup/migrations `001`→`002`→`003`→`004`→`005`; V1 SSO bridge merge and signed, governance-approved `academy_editor`, `academy_reviewer`, `academy_awards_admin` claims; payment-confirmed Plus/course entitlements and refund/revocation lifecycle from V1; independent exam content review; real tests for exam review separation, 24-hour throttle, SSO, workbook isolation, award issuance/revocation, mobile and accessibility.
- **Required accesses:** V1 coordinator PR merge/release rights, existing TAKATAK and Coolify config, Academy PostgreSQL migration access, matching Academy/V1 environment secrets, GitHub production environment/secrets. No secrets embedded in source or logs.
- **Exact next action:** fetch latest `main` and rerun Academy CI with `workflow_dispatch` on that SHA if documentation commits advanced HEAD; read this file and `docs/TASK_QUEUE.md`. With no live environment, implement higher-fidelity course lessons and DB-backed integration tests using an authorized ephemeral Postgres; never invent passed live tests. When V1 PR approved, environment/secrets provisioned and migrations applied, run full end-to-end QA before explicitly enabling Coolify auto-deploy.
- **Reactivation:** these files do not self-start agents; an authorized external orchestrator is necessary to resume after interruption.

---

## Source-of-truth checkpoint
- **Last verified SOURCE commit:** `043f059b1ccbfd1cec30e86a8046d551cbc938df`. Documentation-only commits followed; run `git rev-parse HEAD` or read the GitHub `main` ref for the absolute latest pushed HEAD.
- **Last task completed:** implemented practical student workbook, corrected multi-course program achievement totals, batched student transcript queries, secure post-login return path, post-exam explanations, readiness route, gated Coolify workflow and durable project documentation.
- **Current task:** source CI is green; continue independent features and external deployment readiness. Production launch is not verified.
- **Push status:** Academy changes committed to `main` with expected-SHA writes. No force push.
- **V1 bridge:** `takatakca/takatak-v1` PR #183 was open, unmerged at last check. V1 coordinator must own its approval and merge.

## Changed files in this continuation
- `src/lib/achievements.ts` and `tests/achievements.test.ts`
- `src/lib/progress.ts`, `src/app/account/page.tsx` (accurate completed-program counts, scoped single-query progress)
- `src/lib/return-path.ts`, `tests/return-path.test.ts`, `src/app/auth/start/route.ts`, `src/app/auth/callback/route.ts`
- `src/app/courses/[slug]/[lesson]/page.tsx` and `src/app/courses/[slug]/exam/page.tsx`
- `src/lib/workbook-policy.ts`, `src/lib/workbook.ts`, `src/components/workbook-form.tsx`, `src/app/api/workbook/route.ts`, `tests/workbook.test.ts`
- `src/app/api/exams/route.ts` (post-submission question-by-question learning review)
- `src/components/exam-form.tsx`, `src/app/globals.css`
- `db/003_lesson_workbook.sql`, `src/app/api/ready/route.ts`
- `.github/workflows/deploy-coolify.yml`
- `README.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/DEPLOYMENT.md`, `docs/DECISIONS.md`, `docs/ACADEMY_LEARNING_ARCHITECTURE.md`, this handoff and `AGENTS.md`/`WORKLOG.md` after finalization.

## Verification
- Earlier completed CI on HEAD `7143b2d7c08f3c018f5b0c17ef1c363d5f06e99d`: run `38735966292` succeeded.
- Subsequent incremental Auth/achievements changes CI also succeeded, e.g. run `38773802562` for `b2c1b99d`.
- **Verified latest source CI:** `043f059b1ccbfd1cec30e86a8046d551cbc938df` passed Academy CI run `38775342885`: unit tests, typecheck, lint and build successful. Corrected prior workbook TypeScript import failure. Documentation-only changes after this commit do not establish a new deployed build.
- Existing CI executes `npm install --no-audit --no-fund`, `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` on Node.js 22.
- Deploy workflow jobs are **skipped by design** while repository variable `ACADEMY_AUTODEPLOY_ENABLED` is unset/not true. Do not interpret skipped as a successful live deploy.
- No local or production database migration executed here; all new DB work is source-only.

## Known blockers and production status
- **Deployment: NOT VERIFIED / NOT ACTIVATED** for Academy. No Coolify resource UUID, service token, runtime secrets or verified public Academy origin were available through this session.
- Apply explicit approved migrations in order: `db/001_academy.sql` → `db/002_exam_attempt.sql` → `db/003_lesson_workbook.sql`.
- V1 PR #183 must be merged and deployed by its authorized coordinator; supply matching V1 ↔ Academy bridge secret and callback origin.
- V1 billing plans, subscriptions, individual course purchases, refunds and revocation are incomplete; do not fake entitlements or Stripe success.
- Public exam answer keys still make assessments low stakes, unfit for regulated certification.
- Course editorial review, provider-backed AI tutor, instructor CMS, bilingual content and credential verification are still future work.
- The app now exposes `/api/ready` which requires real configured V1 bridge and Academy database tables/permissions. A liveness response from `/api/health` is not readiness.

## Access requirements — NEVER expose actual secret values
Coolify configured app/domain and provider token; Academy-only Postgres credentials and backup; V1 approval/merge and production environment settings; GitHub Actions repo secrets `COOLIFY_WEBHOOK`, `COOLIFY_TOKEN`, variable `ACADEMY_HEALTHCHECK_URL` pointing to HTTPS `/api/ready`, and explicit `ACADEMY_AUTODEPLOY_ENABLED=true` only when release approved. Academy env: `DATABASE_URL`, `ACADEMY_SESSION_SECRET`, `TAKATAK_ACADEMY_SERVICE_TOKEN`, and SSO endpoint URLs. V1 env: callback URL, Academy origin and matching service token.

## Exact next actions
1. Read `AGENTS.md`, this handoff, `WORKLOG.md`, `docs/TASK_QUEUE.md` and latest GitHub `main` commit and newest CI. If latest CI is failing, inspect failed job logs and fix on Academy `main` with expected SHA, then verify success.
2. If CI green, continue an independent source-level task: private instructor-reviewed exam bank/versioning or course authoring workflows with appropriate authorization. Avoid changing V1 directly while PR #183 pending.
3. Request only the missing runtime actions that require the actual authorized Coolify/V1 operators; meanwhile continue code that is not blocked.
4. Once dependencies exist, verify real SSO exchange, Academy DB persistence, paid-content denials and exam attempts, then enable CI-gated Coolify release. Record actual deployment UUID, SHA and `/api/ready` health.
5. Update all five documentation files and `WORKLOG.md` at end of next session.

**No autonomous agent restart is configured by a GitHub file.** Resume requires a separately authorized external orchestrator/trigger.
