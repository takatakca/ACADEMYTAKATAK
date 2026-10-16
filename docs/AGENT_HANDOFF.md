# TAKATAK Academy — AGENT HANDOFF

Updated: 2026-10-16. Repository: https://github.com/takatakca/ACADEMYTAKATAK. Branch: `main`.

## Follow-on checkpoint — 2026-10-16, individual response erasure
- **Latest source SHA VERIFIED:** `c28e915376ffb8a25d534d125e790531be24af0d`, Academy CI **38943064719** completed **SUCCESS**: 41/41 tests including the PostgreSQL scoped single-lesson and bulk-erasure assertions, TypeScript, ESLint and Next.js build. Documentation-only `[skip ci]` commits follow; read the GitHub `main` ref for absolute latest SHA.
- **Completed:** `DELETE /api/workbook`, `src/lib/workbook.ts` identity-scoped query, `src/components/workbook-form.tsx` two-step confirmation, `src/app/globals.css` responsive styles, `tests/db-integration.test.ts` isolated single-lesson and cross-student deletion test. Preserves historical grades, other lessons, awards and TAKATAK-V1 master account/billing.
- **Next action:** verify newest source CI; confirm exact GitHub `main` SHA after docs, then pursue remaining real V1 login, academy DB migrations 001–007 and Coolify verification when authorized. No live migration or deploy occurred.
- **Deployment status:** **NOT VERIFIED / NOT ACTIVATED**. Last successful source CI `38943064719` for `c28e9153` (41 passing tests) is test evidence only; Coolify production deploy still requires approved V1/runtime and verified database migration.
- **Access needed:** Academy Coolify application, secrets/domain/TLS, approved PostgreSQL backup and migration, V1 SSO and staff entitlements; never invent or disclose credentials.

---

## 2026-10-16 — student-data portability and workbook privacy
- **Repository / branch:** `takatakca/ACADEMYTAKATAK` / `main`. HEAD before this session: `7ed5d02db09ad57d5d1564e40f573758dadc997e`. No force-push.
- **Last completed task:** new privacy-preserving Academy learner export (signed central TAKATAK identity, all course progress/attempts/workbooks/awards, coherent read-only snapshot, JSON attachment with no-store headers); explicit confirmation and CSRF-aware deletion of user's *own* workbook responses; responsive account UI. Maintains central V1 account, billing, exam-grade, progress and award records.
- **Files modified:** `src/lib/account-data.ts`, `src/app/api/account/export/route.ts`, `src/app/api/account/workbooks/route.ts`, `src/components/account-data-controls.tsx`, `src/app/account/page.tsx`, `tests/db-integration.test.ts`; `README.md`, `WORKLOG.md`, `docs/{PROJECT_STATUS,TASK_QUEUE,AGENT_HANDOFF,DEPLOYMENT,DECISIONS}.md`.
- **Latest application/source commit before docs:** `1cf1184c0e4c9989d093f33f7235cb91a4f5785c`. **CI was running at handoff preparation; check the actual newest workflow outcome before calling it passed**. Prior verified code checkpoint: `eef9e1478e31ed363be28976f292dbefcc28d595`, run `38883044268`, 40 tests, full build green.
- **Work done / verification:** Inspected live GitHub `main`, files, Actions history, previous `AGENTS.md` and handoff. Examined existing V1 session, scoped learning tables, workbook query and dashboard. Pushed expected-blob-SHA commits for new account data module, export endpoint, erasure endpoint, learner UI and Postgres identity-isolation test. Verified no change to TAKATAK-V1 or production DB.
- **V1 PR #183:** MERGED in V1 on 2026-10-16; this does not establish a deployed SSO bridge, staff entitlements or paid purchases.
- **Actual deployment:** Academy Coolify still **NOT VERIFIED**, release Actions jobs skipped under opt-in gate. No migrations 001–007 applied by this session; no public Academy HTTPS readiness URL or verified target SHA, provider token or real session available. Never claim 100% or production success based on isolated CI.
- **Known blockers and access:** approved dedicated Academy PostgreSQL backing DB with backup/migrations, V1 production one-use SSO secrets and claims, Coolify configured app/domain/TLS and Actions webhook/token, payment entitlements, genuine browser/regression QA; editor review and Québec French course parity. Do not invent access or secrets.
- **Currently ongoing:** await latest GitHub CI on `1cf1184c`, inspect the failed job logs if any; correct promptly and verify. User-facing download/deletion needs real SSO and PostgreSQL deployment to become live.
- **Exact next action:** read GitHub `refs/heads/main`, newest Academy CI, this handoff and `docs/TASK_QUEUE.md`; fix failure if present; once green, continue independent accessible bilingual Academy UI/content. After authorized backend/SSO activation, test full student export and workbook erasure using two genuine V1 identities, verify migration/readiness/deployed SHA before enabling gated Coolify. Maintain these five docs at handoff.
- **Continuous restart:** no external orchestrator has been configured; GitHub handoff enables future separate agents to resume, not unattended continuation after this session.

---

## Handoff — 2026-10-16 (current session)
- **Repository:** `takatakca/ACADEMYTAKATAK`, branch `main`. Starting GitHub HEAD: `a0876d94e3651b77c5ee814f184a3cc7ddeac8ad`.
- **Last finished task:** source implementation of instructor lesson CMS with migration 007, TAKATAK-signature-gated draft and independent publication APIs, new UI, published-only entitlement-checked learner rendering, and disposable PostgreSQL migration/integrity tests.
- **Source files:** `db/007_lesson_revisions.sql`; `src/lib/lesson-policy.ts`, `src/lib/lesson-revisions.ts`; `src/app/api/instructor/lessons/route.ts`, `src/app/api/instructor/lessons/publish/route.ts`; `src/components/instructor-lesson-editor.tsx`, `src/app/instructor/lessons/page.tsx`; `src/app/courses/[slug]/[lesson]/page.tsx`, `src/app/account/page.tsx`, `src/app/api/ready/route.ts`, `src/app/globals.css`, `tests/lesson-policy.test.ts`, `tests/db-integration.test.ts`; README and required documentation.
- **Latest SOURCE SHA, VERIFIED:** `eef9e1478e31ed363be28976f292dbefcc28d595`. Academy CI run **38883044268** completed **SUCCESS**: 40/40 tests (including migration 007 SQL constraints), npm install, TypeScript, ESLint and Next.js build. Initial lint failure was caused by unnecessary React `useCallback` memoization and corrected in this SHA. Documentation-only commits followed; read `main` HEAD for absolute latest SHA.
- **Central V1:** GitHub PR #183 is now **MERGED** (2026-10-16T05:34:34Z, V1 SHA `1c349ce40ef36ed92d115fb675f0df7fa3d0d465`). This does NOT establish live deployment, proper staff claims or SSO smoke-test success.
- **Verification performed:** GitHub main tree/ref and handoff checked, V1 merged status read, GitHub Actions failure logs diagnosed, fix pushed, **Academy CI 38883044268 green** with 40 tests including all 001–007 migrations, independent review and active-version constraints, TypeScript, lint, build. No live staging or production tests executed.
- **Known blockers:** no confirmed Coolify Academy service UUID/domain, production PostgreSQL/backup/migrations 001–007, live V1 one-time SSO and entitlements, paid plans, authorized staff claims or approved lesson content; no deployed E2E. Revisions require the dedicated database migration before launch.
- **Actual deployment:** **NOT VERIFIED / NOT ACTIVATED**. CI-pass or V1 PR merged does not prove an Academy production release. Coolify Actions gated variable remains unconfirmed and deployment jobs historically skipped; do not turn on production release without real prerequisites.
- **Required access:** Authorized V1 production operator, dedicated Academy Postgres DBA backup/migration approval, Coolify app/domain, TLS, tokens and environment settings in secret stores; no secret values in Git.
- **Next executable action:** source CI is green at `eef9e147` (run 38883044268). Inspect latest `main` for other agent changes and manually rerun Academy CI on final HEAD before production release, then implement remaining independent instructor content improvements. Where production configuration is still absent, add more integration coverage or improve factual lesson content. When infrastructure is approved, apply 001–007 migrations, run true staff draft/reviewer/student access smoke tests, verify V1 SSO, then deploy gated with exact matching SHA.
- **Commit / handoff source of truth:** last source SHA `eef9e1478e31ed363be28976f292dbefcc28d595`, verified Academy CI run 38883044268. Re-read GitHub `refs/heads/main` after final documentation commits to obtain exact pushed HEAD; documentation commits are tagged `[skip ci]` and do not assert a newer compiled build.
- **Automation:** this chat does not self-restart; an external authorized orchestrator is required for automatic reactivation.

---

## Current checkpoint — 2026-10-15 evening (latest session)
- **Repository / branch:** `takatakca/ACADEMYTAKATAK` / `main`. Latest source commit before documentation writes: `01e7cbc029c0cb668a6f39d9ec3f1b3ac84e0f65`. Re-fetch `main` HEAD after documentation commits for exact final commit.
- **Last completed task:** six-migration PostgreSQL CI, atomic one-use exam tickets (nonce UUID signed, persisted with grading), clear HTTP 409 on replay, separate DB connection race test, reviewer/author separation DB check, exact write Origin enforcement for seven authenticated mutation routes, and bounded progress POST body.
- **Current state:** Latest application source CI **PASSED**: `38848457760` for `01e7cbc029c0cb668a6f39d9ec3f1b3ac84e0f65`, 37/37 tests including ephemeral PostgreSQL concurrent replay, typecheck, lint, build. Production release remains blocked; continue live environment prerequisites or independent course work.
- **Modified files:** `db/006_exam_ticket_once.sql`, `src/lib/assessment-ticket.ts`, `src/lib/private-exams.ts`, `src/lib/exam-records.ts`, `src/app/api/exams/route.ts`, `src/components/exam-form.tsx`, `src/app/api/ready/route.ts`, `src/lib/request-origin.ts`, seven `src/app/api/**/route.ts` mutation handlers, `tests/assessment-ticket-replay.test.ts`, `tests/db-integration.test.ts`, `tests/request-origin.test.ts`, `tests/assessment-policy.test.ts`, `.github/workflows/ci.yml`, and the documentation files.
- **Executed verification:** GitHub Actions test/typecheck/lint/build; GitHub Actions PostgreSQL 16 service, migrations 001–006 applied in a disposable isolated schema, duplicate nonce blocked even across two concurrent clients, two-person reviewer constraint enforced. Source CI run `38848221344` passed; new origin-code run must be checked before claiming green.
- **Known blockers:** Production migrations 001–006 not applied or verified, Academy Coolify application and HTTPS runtime not confirmed, V1 PR #183 open and role/payment entitlements not provisioned. Origin checks require correct proxy scheme forwarding. No actual production student login/paid-content denial/grade/award E2E.
- **Production status:** **NOT DEPLOYED / NOT VERIFIED**. Coolify deploy workflow remains gated and skipped absent explicit release variable and confirmed secrets; no resource UUID or verified live SHA. No secrets obtained or committed.
- **Access needed:** V1 coordinator for PR #183/role issuance, Coolify authorized app/domain/HTTPS, approved Academy-only PostgreSQL DBA migration and secrets, repo production Actions configuration. Avoid exposing tokens.
- **Exact next actions:** inspect GitHub `main` and source CI run `38848457760` (green); rerun manually on actual latest HEAD for a release candidate if source has advanced. Apply migration 006 only following DB approval/backup after 001–005. Test actual V1 SSO/cancel/expiring plan, HTTPS Origin, repeated and concurrent exam submission and student data isolation in a real staging deployment; only then enable opt-in Coolify release. Continue independent course quality and live integration tests if environment remains unavailable.
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
