# TAKATAK Academy — Coolify first-time bootstrap and verified production runbook

Updated: 2026-11-15. **Deployment status: NOT LIVE / no Coolify resource ID or public readiness evidence.**

## Verified source and external infrastructure discovery
- Source: `takatakca/ACADEMYTAKATAK`, `main` SHA `2ef80385bceb224254ca00e7d5e902df26204880`.
- Full CI on that SHA: GitHub Actions 43781806034 **success** (unit/PG tests, types, lint, build).
- Coolify production deploy job 43781939618 **skipped by its explicit `ACADEMY_AUTODEPLOY_ENABLED` condition**. Separately, an authorized operator's read-only inventory found **no Academy app or dedicated PostgreSQL resource** in GROUPE TAKATAK / production. These are distinct facts: absence of the app alone is **not** GitHub's skip condition.
- This repository does not contain Coolify credentials, project/server UUIDs, PostgreSQL passwords or a confirmed Academy domain.
- User approved progress toward deployment, **not** turning on payment collection or bypassing tenant/data-protection controls.

## Gate 0 — authorize a specific, separate target
- Environment: existing Coolify project **GROUPE TAKATAK**, environment **production**, one operator-selected server (and destination if there is more than one).
- Proposed resource names: `academy-takatak` (Dockerfile application), `academy-takatak-db` (PostgreSQL 16).
- Public DNS candidate: `academy.takatak.ca`, **unconfirmed**. Do NOT set a custom domain until DNS/owner approval/TLS are validated.
- No edits to `takatak-v1`, SC4NNER, BEH4VIOR, LOY4LTY or any existing/unknown database during resource creation.

## Gate 1 — provision two isolated resource records, without running them
`scripts/coolify-provision-academy.mjs` is an idempotent Coolify REST client. It checks that the given project UUID resolves to exactly GROUPE TAKATAK, that the server exists, and lists existing applications and databases before any action. It fails closed on ambiguous/unsafe existing resources. It creates the **database first**, then application, with no public database access, no domain, no automatic container startup, and no rollout. A retry after partial creation should reuse matching resources. It does not receive/store/postgres passwords.

### Preferred: protected GitHub manual workflow
In `takatakca/ACADEMYTAKATAK`, configure GitHub **Environment: production** with required reviewer(s) where possible. Supply the following as GitHub Actions configuration, **never committed to a file**:

| Key | Source | Type |
| --- | --- | --- |
| `COOLIFY_BASE_URL` | HTTPS Coolify control-plane origin only (no `/api/v1`) | Environment variable |
| `COOLIFY_PROJECT_UUID` | UUID of **GROUPE TAKATAK** | Environment variable |
| `COOLIFY_SERVER_UUID` | UUID of selected approved production server | Environment variable |
| `COOLIFY_DESTINATION_UUID` | UUID if multiple Docker destinations exist; omit otherwise | Optional variable |
| `COOLIFY_API_TOKEN` | Coolify API token with the minimum resources/permissions needed to read and create only this team's resources | **Encrypted secret** |

Run `Academy Coolify infrastructure bootstrap (manual)` **on `main`**:
1. Input `mode = plan`. It verifies latest `main` SHA with successful exact push CI and returns read-only actions and existing UUIDs.
2. Inspect the named target and the existence of any Academy resources. Confirm project/server and isolated DB.
3. Input `mode = apply`, `approval = CREATE_ACADEMY_RESOURCES`, with GitHub environment review approval. Only then may it create missing resource records. **The token must be authorized by the actual Coolify team; no other project is modified.**
4. Capture new application and database UUIDs in the restricted operations ledger. Never paste DB connection strings, Coolify tokens or signing keys into issues, CI summaries or Drive.

### Alternative: execute the same operator script from an authorized shell
Use a secure environment-variable store (shell examples deliberately omit actual values). Never paste a token in the shell history or public CI logs.

```bash
# Load securely from your approved secret vault or CI runtime, not source control.
# Required: COOLIFY_BASE_URL, COOLIFY_API_TOKEN, COOLIFY_PROJECT_UUID,
# COOLIFY_SERVER_UUID, ACADEMY_SOURCE_SHA (exact verified main commit).
node scripts/coolify-provision-academy.mjs --plan
ACADEMY_CREATE_RESOURCES_APPROVED=yes node scripts/coolify-provision-academy.mjs --apply
```

No secret or database URL is emitted by this script, only resource UUIDs and action statuses.

## Gate 2 — database, access, backups, and ordered migrations
1. Start only the newly created Academy PostgreSQL in Coolify after confirming its persistent volume, resource limits and **backups with restore testing**. Never reuse the generic or MIMT/PPPMTL/BEH4VIOR databases.
2. Keep PostgreSQL **private** on the selected Coolify destination/network. Get the actual **internal** `DATABASE_URL` through Coolify's secure database configuration; do not guess the hostname.
3. The app must be able to reach the database over the internal network. Test with short-lived authorized credentials from its runtime; never enable a public PostgreSQL port for convenience.
4. Apply schema migrations **001 to 007** in order to the empty dedicated Academy database after confirming the backup policy. Reconcile actual schema before any retry. Example for authorized operators using `psql`, with secret DATABASE_URL already set in environment:

```bash
set -euo pipefail
psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 --single-transaction \
  -f db/001_academy.sql \
  -f db/002_exam_attempt.sql \
  -f db/003_lesson_workbook.sql \
  -f db/004_private_exam_bank.sql \
  -f db/005_program_awards.sql \
  -f db/006_exam_ticket_once.sql \
  -f db/007_lesson_revisions.sql
```

5. `db/008_organizations.sql` is **optional**, only after the master-org grant/revocation contract and Québec OBNL policies are approved. A seat record never grants a paid lesson by itself.
6. Record applied migration filenames, deployment target, backups and a schema-only verification. Keep credentials/learner rows out of logs.

## Gate 3 — auth bridge and safe application runtime
This is a **new, independent Academy Coolify application** based on `main` with build pack **Dockerfile**, `Dockerfile`, **port 3000**. Create with `instant_deploy=false`; ensure Coolify native auto-deploy is disabled, to preserve the GitHub CI release gate.

Set Academy environment variables as **encrypted runtime-only values**:
- `NODE_ENV=production`
- `DATABASE_URL`: only the Academy internal dedicated PostgreSQL URL
- `NEXT_PUBLIC_TAKATAK_DASHBOARD_URL`: the approved V1 dashboard origin/path
- `TAKATAK_ACADEMY_LAUNCH_URL`: approved V1 `/api/experiences/academy/launch` HTTPS endpoint
- `TAKATAK_ACADEMY_EXCHANGE_URL`: approved V1 `/api/experiences/academy/exchange` HTTPS endpoint
- `TAKATAK_ACADEMY_SERVICE_TOKEN`: dedicated shared bearer token, independently provisioned (20+ chars; use high entropy)
- `ACADEMY_SESSION_SECRET`: separate high-entropy session key (32+ chars)

On TAKATAK-V1, **through its own release/change process**, set:
- `TAKATAK_ACADEMY_URL` = Academy approved HTTPS origin
- `ACADEMY_EXPERIENCE_CALLBACK_URL` = `https://<approved-academy-domain>/auth/callback`
- `TAKATAK_ACADEMY_SERVICE_TOKEN` = exact shared bearer token

Check that the actual deployed TAKATAK-V1 bridge supports the endpoints before advertising login. **Free-only** is the current verified entitlement shape. Paid plans, `academy_plus`, `academy_course:<slug>`, teacher roles, organization grants and employer seat funding are not enabled by this bootstrap.

## Gate 4 — domain, security, validation, deployment proof
1. Operator confirms `academy.takatak.ca` or the actual owner-approved domain, DNS routing and TLS certificate. Don't force domain override if another app currently owns the hostname.
2. Initial deploy requires a verified exact `main` SHA; check Dockerfile build logs without printing secret env values.
3. `GET /api/health`: liveness only. `GET /api/ready` must be HTTP 200 and `{"service":"takatak-academy","ready":true}` before declaring production ready.
4. Real end-to-end tests: V1 student login, expired/replayed SSO code denials, scoped lesson progress/workbooks/exam attempts, public free content, paid-content rejection for free identities, teacher edit/reviewer separation, and organization isolation. No paid checkout before verified charge/refund policy.
5. Québec Loi 25/privacy review, retention/consent, accessible FR/EN rollout and youth safety policies remain release gates for broader public and institutional enrollment.
6. Once authorized, configure GitHub Actions vars `ACADEMY_AUTODEPLOY_ENABLED=true` and `ACADEMY_HEALTHCHECK_URL=https://<approved-domain>/api/ready`; secrets `COOLIFY_WEBHOOK` (single Academy resource) and `COOLIFY_TOKEN` through protected repository/Environment configuration. The existing `.github/workflows/deploy-coolify.yml` handles **successful CI on the latest main SHA only**.
7. Confirm deployment UUID, `status=finished`, `commit=verified SHA` and public `/api/ready ready:true`; log the evidence and a rollback procedure. **A queued job or a skipped job is not a deployment.**

## Gate 5 — paid and institutional launch (separate approval)
Before accepting money: implement V1-owned tuition catalog/prices in CAD, GST/QST treatment, payment confirmation, subscription/one-time purchase, refunds, failures, entitlements and revocation; verify partner OBNL/enterprise contract terms. Academy does not implement another Stripe customer database. Existing source `/pricing` is explanatory and must not imply working paid checkout. Keep Runway/HeyGen generation disabled until approved original content/rights/cost limits.

## Official API contract references
- Coolify create public Git application: https://coolify.io/docs/api/endpoints/applications/create-public-application
- Coolify create dedicated PostgreSQL: https://coolify.io/docs/api/endpoints/databases/create-database-postgresql
- Coolify list existing resources: https://coolify.io/docs/api/endpoints/applications/list-applications and https://coolify.io/docs/api/endpoints/databases/list-databases
- Coolify API secrets: https://coolify.io/docs/api/endpoints/applications/create-env-by-application-uuid
- Coolify deployments and start: https://coolify.io/docs/api/endpoints/applications/start-application-by-uuid

**Do not call this live until a real Academy resource, database and SSO satisfy the conditions above.**
