# TAKATAK Academy — Deployment runbook (Coolify)

**Current status:** a Dockerfile and gated GitHub Actions workflow exist. No verified production deployment or service configuration is currently recorded.

## Correct service ownership
- TAKATAK-V1 (`takatakca/takatak-v1`) is master account, subscriptions, refunds, product entitlements and billing.
- Academy (`takatakca/ACADEMYTAKATAK`) owns learning content, progress, examinations and program display.
- Academy runs as its own Coolify application attached to this repository's `main`, not as a cloned V1 identity system.

## Prerequisites (do NOT invent values)
1. Authorized Coolify team/project, actual server, Academy application UUID, published domain and TLS.
2. TAKATAK-V1 Academy bridge merged and deployed under V1 coordinator's release controls (PR #183).
3. Academy PostgreSQL database and backup. Apply `db/001_academy.sql` then `db/002_exam_attempt.sql` then `db/003_lesson_workbook.sql` then `db/004_private_exam_bank.sql` then `db/005_program_awards.sql` with explicit approval; never migrate silently on startup.
4. Provision Academy environment variables in Coolify:
   - `NEXT_PUBLIC_TAKATAK_DASHBOARD_URL`
   - `TAKATAK_ACADEMY_LAUNCH_URL` (V1 launch route)
   - `TAKATAK_ACADEMY_EXCHANGE_URL` (V1 one-use exchange route)
   - `TAKATAK_ACADEMY_SERVICE_TOKEN` (long secret shared with V1)
   - `ACADEMY_SESSION_SECRET` (independent random 32+ character key)
   - `DATABASE_URL` (Academy-only PostgreSQL).
5. V1 environment variables: `TAKATAK_ACADEMY_URL`, `ACADEMY_EXPERIENCE_CALLBACK_URL`, `TAKATAK_ACADEMY_SERVICE_TOKEN` matching Academy's token.
6. Use a dedicated Academy subdomain over HTTPS; avoid exposing tokens to the browser.

## Source CI
`.github/workflows/ci.yml` executes Node 22: `npm install --no-audit --no-fund`, `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`. Test/compile success does not imply runtime authentication or database readiness.

## Coolify automation
`.github/workflows/deploy-coolify.yml` triggers only from a successful `Academy CI` run on the *current* `main` commit. Its production job is **disabled by default**. It requires:
- Repo Actions **variable** `ACADEMY_AUTODEPLOY_ENABLED=true` (explicit release decision).
- Repo Actions **secrets** `COOLIFY_WEBHOOK` (the single Academy resource `https://<coolify-host>/api/v1/deploy?uuid=<academy-uuid>&force=false`) and `COOLIFY_TOKEN` (deploy authorization; deployment inspection also needs read access).
- Repo Actions **variable** `ACADEMY_HEALTHCHECK_URL=https://<academy-public-origin>/api/ready`.
- `production` GitHub Environment; configure approval protection if required by release policy.

Workflow refuses missing or non-HTTPS configuration, ignores outdated CI revisions, requests a Coolify resource deploy, polls the returned deployment UUID and requires the deployed `commit` to match the verified Git SHA. Then checks the public `/api/ready` route for `ready:true`. API acceptance alone is **not** deployment proof.

Coolify docs: https://coolify.io/docs/core/automation/deploy-webhooks and https://coolify.io/docs/api/endpoints/deployments/get-deployment-by-uuid

IMPORTANT: Coolify automatic native GitHub deployment on push can bypass our CI gate. Configure it for external CI-triggered deployment only, or align native deploy policy with required quality gates.

## Live verification
- GET `/api/health`: app liveness and *configuration flags* only.
- GET `/api/ready`: HTTP 200 only when signed central auth bridge env and Academy progress/exam/workbook/private-bank/award tables are available and queryable; HTTP 503 otherwise.
- Run 90-second one-use code, replay and state mismatch smoke tests through V1.
- Validate guest paid-lesson denial and unauthorized exam POST denial.
- Validate actual persisted progress, grade best-score, three attempts in rolling 24 hours and program completion.
- Check `deployment_uuid`, commit, result and app health before communicating that release is live.
- If deployment fails, use Coolify logs, revert/rollback to last verified deployment; never run destructive migration to mask a problem.

## Instructor exam bank activation
V1 must issue short-lived, signed `academy_editor` entitlements to editorial staff and `academy_reviewer` entitlements to independent reviewers. The same master identity cannot publish its own draft. Do not grant roles locally or derive them from browser input. Apply migration 004, verify staff can create drafts at `/instructor/exams`, then have a **different** reviewer inspect and publish a version. A version becomes available to new sittings only after this transition; old public-source banks remain unaccredited low-stakes practice until replaced. Protect the PostgreSQL table and do not expose it through an anonymous database API.

## Academy educational completion awards
The optional program-completion award is issued only after every component course has all lessons completed **and** a passing exam, plus a current V1 entitlement when requesting the record. Its unguessable UUID is verifiable at `/verify/<award-uuid>` without disclosing the holder's master identity or name. A separate V1-signed `academy_awards_admin` entitlement authorizes `/instructor/awards` and the revocation API, which records the reason and administering master identity. The award is a non-accredited **internal educational record**; public verification does not prove who possesses the URL. Test issuance, duplicate prevention, authorized revocation and privacy before enabling in production.

## Revalidate `main` on demand
The Academy CI workflow supports `workflow_dispatch`. When documentation-only commits have advanced the HEAD past the last compiled source SHA, use **GitHub Actions → Academy CI → Run workflow → main** after obtaining authorized repository access. A passing manual CI on exact current HEAD can trigger the gated Coolify workflow if production deployment is explicitly enabled; do not bypass the two independent checks. No external restart/orchestrator is configured by this workflow.


## One-time exam replay migration and disposable database CI
- After authorized database backup and migrations 001–005, apply `db/006_exam_ticket_once.sql` before deploying application commits that require it.
- The migration adds a nullable ticket nonce to preserve historical attempts and a unique partial index so each new signed candidate session can be graded at most once. `/api/ready` requires that index for operational readiness.
- The `Academy CI` verification job creates disposable PostgreSQL 16 credentials only within the GitHub Actions ephemeral runner. It creates a random test schema, executes migrations 001–006 and validates workbook isolation, exam history and award constraints before the build. This CI database is never a production environment.
- New exam API error `exam_ticket_already_used` (409) tells the learner to reload for another attempt; repeated requests cannot farm points on one signed ticket.


## Origin checks and secure proxy
All student and instructor POST APIs now reject an Origin whose scheme, host, or port differs from the public request origin. Verify that Coolify/Traefik forwards the browser's HTTPS scheme and intended Academy domain to Next.js (`request.nextUrl.origin` must reflect that origin). Do not change API guards to host-only comparisons or disable CSRF controls for convenience. Check requests from mobile browsers after TLS setup; reject same-host HTTP and unrelated domains.

## SQL replay and ephemeral CI verification
Apply migration 006 before enabling the new exam POST handler. GitHub Actions PostgreSQL tests verify concurrent insertion with a shared nonce using independent connections and two-person editorial review constraint. A 409 `exam_ticket_already_used` means the learner must obtain a fresh signed ticket; neither a repeat submission nor a changed answer can bypass the uniqueness index. **Green isolated CI is not proof that production DB migrations ran.**


## Lesson editorial CMS — activation (migration 007)
- GitHub PR #183 has now been merged into TAKATAK-V1 (2026-10-16, merge commit `1c349ce4`); verify that V1 is **deployed** and SSO truly works before enabling the Academy production release.
- DBA must approve/backup the dedicated Academy PostgreSQL database and apply migrations in order **001 → 002 → 003 → 004 → 005 → 006 → 007**. Never apply a new migration silently at web startup.
- Migration 007 creates `academy_lesson_revision` with exactly one published version per course/lesson, immutable historical revisions, separate author/reviewer IDs. The new `/api/ready` requires this table to be queryable and returns HTTP 503 until configured.
- The staff page `/instructor/lessons` requires signed `academy_editor` or `academy_reviewer` entitlements from TAKATAK-V1; separate accounts must create and approve a real draft. Confirm unavailable roles return 403/404 as appropriate.
- Confirm the student lesson displays only the published revision after checking TAKATAK purchase entitlements; restricted content must not appear to guests or users of unrelated companies.
- Staging QA: draft new revision → GET versions as instructor → verify student still sees old version → different reviewer publishes → verify newly approved copy for an authorized student → verify previous version retired and not returned to students → test original curriculum fallback for untouched lessons.
- Do not activate Coolify auto-deploy until live SSO, migration 007, public HTTPS readiness, canonical Origin and deployment SHA have been verified.

### Latest validation checkpoint
Academy source `eef9e1478e31ed363be28976f292dbefcc28d595` passed GitHub Actions Academy CI run `38883044268` (40 tests, TypeScript, lint, build). This is **test** infrastructure, not a deployed Academy resource; migration 007 still needs DBA backup/approval and execution in the actual authorized service before release.


## Student export and workbook erasure QA
Academy exposes `GET /api/account/export` (authenticated JSON attachment) and `DELETE /api/account/workbooks` (authenticated HTTPS same-origin JSON with `{"confirmation":"DELETE MY WORKBOOKS"}`). Both require all existing Academy tables and the V1 SSO session. The export uses a consistent read-only repeatable-read PostgreSQL transaction and enforces 10,000 records per data category rather than silently truncating. Download must not be publicly cached. Verify an unauthorized account returns 401; an authenticated student sees **only** own progress, graded attempts, workbook answers and award records. Test deletion with two distinct V1 identities; deleting one user's workbook must preserve the other student's submissions and must not change grades, learning progress, or awards. Do not assume erasure reaches backups. Existing database migrations 001–007 are sufficient; no production SQL was executed by this code change.
