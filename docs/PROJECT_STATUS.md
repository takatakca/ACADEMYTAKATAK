# TAKATAK Academy — PROJECT STATUS

Last reviewed: 2026-10-15 (GitHub main). Source of truth: https://github.com/takatakca/ACADEMYTAKATAK

## Confirmed status
- Main repository: `takatakca/ACADEMYTAKATAK`, branch `main` (push permission confirmed).
- Existing application: Next.js 16 / Node.js 22 / PostgreSQL; **do not restart from scratch**.
- Existing content: 29 courses, 145 authored introductory lessons, 8 multi-course programs; learning route directory mapping 55 TAKATAK-V1 navigation entries.
- Free and paid course access checked server-side against short-lived SSO entitlements.
- V1 single sign-on consumer, session handling, course progress, five-question exams, best-score points and learning transcript implemented in source.
- Optional course-program completion awards: verified eligibility across every lesson and exam; immutable unique UUID record, privacy-safe public verification and restricted V1-admin revocation, all implemented in source.
- Student academic achievement counts are corrected to count **whole programs**, not individual passing courses.
- PostgreSQL migrations 001/002/003/004/005 exist for lessons, exams, workbooks, private reviewed assessment banks and revocable educational program awards. They are **not known to be applied in production**.
- Original course-cover SVG assets exist; no official TAKATAK logo invented.
- CI: Academy tests, typecheck, lint and Next.js build validated on GitHub. Latest commit-specific run must be checked again after every further push.

## Incomplete / not claimable as launched
- Live Academy Coolify application, public Academy HTTPS URL and runtime secrets **not verified**.
- TAKATAK-V1 Academy bridge PR #183 is still open/unmerged at last verification, V1 owns master identity and payment.
- Subscription/one-time paid commerce and revocations are not provisioned in V1; Academy instructor and award-admin role entitlements are not issued by V1 yet.
- Complete instructor-reviewed lesson videos, downloadable materials, bilingual delivery, CMS and external AI tutor are not finished.
- Existing legacy exam answer keys remain in public GitHub and are **low-stakes practice**. A separately stored PostgreSQL private bank with author/reviewer separation, signed exam tickets and randomized 5-of-10+ questions is now implemented in source, but not activated/seeded in production. Not a regulated professional credential.
- No independently verified live payment, SSO, PostgreSQL, reviewed exam bank, student award issuance or exam E2E has occurred.
- `/api/health` only confirms a running app; `/api/ready` now checks bridge env, database tables and read permissions, returning HTTP 503 until ready.
- Production deploy workflow is explicitly disabled unless `ACADEMY_AUTODEPLOY_ENABLED=true` and Coolify credentials and health URL are provided.

## Deployment truth
Not verified deployed. A green CI is not equivalent to a healthy production service. Do not mark 100% until requirements, dependencies and live checks pass.

## Documents
- `docs/TASK_QUEUE.md` — pending work and blockers.
- `docs/AGENT_HANDOFF.md` — last work, next action, exact commands.
- `docs/DEPLOYMENT.md` — deployment and verification process.
- `docs/DECISIONS.md` — architectural decisions and release constraints.
- `docs/ACADEMY_LEARNING_ARCHITECTURE.md` — course and assessment contract.

## Release checkpoint 2026-10-15
- Last fully successful application CI on `491e088e96322219147529faffac3a130ccfe6ea`: GitHub run `38791816925` (test, typecheck, lint and build).
- `.github/workflows/ci.yml` now also supports manual `workflow_dispatch` on current `main` for a fresh production-candidate validation after documentation-only commits.
- Workflow-source update `f176531a73196bb4ef668152c59afb6452833fcc` PASSED Academy CI run `38792169955`: tests, typecheck, lint and Next.js build. Documentation-only commits followed, so the latest main HEAD is not an independently retested deployable source revision until CI is manually redispatched.
- Live Coolify release is still intentionally disabled and V1 PR #183 remains open. No migration, payment processing or real Academy student SSO was tested in production.
