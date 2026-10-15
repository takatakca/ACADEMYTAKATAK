# TAKATAK Academy — AGENT HANDOFF

Updated: 2026-10-15. Repository: https://github.com/takatakca/ACADEMYTAKATAK. Branch: `main`.

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
