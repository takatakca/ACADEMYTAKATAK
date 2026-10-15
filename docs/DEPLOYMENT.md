# TAKATAK Academy — Deployment runbook (Coolify)

**Current status:** a Dockerfile and gated GitHub Actions workflow exist. No verified production deployment or service configuration is currently recorded.

## Correct service ownership
- TAKATAK-V1 (`takatakca/takatak-v1`) is master account, subscriptions, refunds, product entitlements and billing.
- Academy (`takatakca/ACADEMYTAKATAK`) owns learning content, progress, examinations and program display.
- Academy runs as its own Coolify application attached to this repository's `main`, not as a cloned V1 identity system.

## Prerequisites (do NOT invent values)
1. Authorized Coolify team/project, actual server, Academy application UUID, published domain and TLS.
2. TAKATAK-V1 Academy bridge merged and deployed under V1 coordinator's release controls (PR #183).
3. Academy PostgreSQL database and backup. Apply `db/001_academy.sql` then `db/002_exam_attempt.sql` with explicit approval; never migrate silently on startup.
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
- GET `/api/ready`: HTTP 200 only when signed central auth bridge env and Academy progress/exam tables are available and queryable; HTTP 503 otherwise.
- Run 90-second one-use code, replay and state mismatch smoke tests through V1.
- Validate guest paid-lesson denial and unauthorized exam POST denial.
- Validate actual persisted progress, grade best-score, three attempts in rolling 24 hours and program completion.
- Check `deployment_uuid`, commit, result and app health before communicating that release is live.
- If deployment fails, use Coolify logs, revert/rollback to last verified deployment; never run destructive migration to mask a problem.
