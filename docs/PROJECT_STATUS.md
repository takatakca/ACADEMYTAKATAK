# TAKATAK Academy — PROJECT STATUS

Last reviewed: 2026-10-15 (GitHub main). Source of truth: https://github.com/takatakca/ACADEMYTAKATAK

## Confirmed status
- Main repository: `takatakca/ACADEMYTAKATAK`, branch `main` (push permission confirmed).
- Existing application: Next.js 16 / Node.js 22 / PostgreSQL; **do not restart from scratch**.
- Existing content: 29 courses, 145 authored introductory lessons, 8 multi-course programs; learning route directory mapping 55 TAKATAK-V1 navigation entries.
- Free and paid course access checked server-side against short-lived SSO entitlements.
- V1 single sign-on consumer, session handling, course progress, five-question exams, best-score points and learning transcript implemented in source.
- Student academic achievement counts are corrected to count **whole programs**, not individual passing courses.
- PostgreSQL migrations 001/002/003 exist for lessons, exams and student workbooks. They are **not known to be applied in production**.
- Original course-cover SVG assets exist; no official TAKATAK logo invented.
- CI: Academy tests, typecheck, lint and Next.js build validated on GitHub. Latest commit-specific run must be checked again after every further push.

## Incomplete / not claimable as launched
- Live Academy Coolify application, public Academy HTTPS URL and runtime secrets **not verified**.
- TAKATAK-V1 Academy bridge PR #183 is still open/unmerged at last verification, V1 owns master identity and payment.
- Subscription/one-time paid commerce and revocations are not provisioned in V1.
- Complete instructor-reviewed lesson videos, downloadable materials, bilingual delivery, CMS and external AI tutor are not finished.
- Exam question/answer bank remains visible in public GitHub source. These are low-stakes knowledge checks, not secure regulated professional examinations.
- No independently verified live payment, SSO, PostgreSQL or exam E2E has occurred.
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
