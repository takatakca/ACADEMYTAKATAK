# TAKATAK Academy

Education platform for the **GROUPE TAKATAK** ecosystem. Its master dashboard and identity authority is [TAKATAK-V1](https://github.com/takatakca/takatak-v1). The Academy is an independent learning UI, **not an independent CRM, billing engine or user directory**.

## Implemented foundation

- Next.js 16 / React 19, responsive electric-blue on navy Academy frontend.
- Eight curated course paths covering SEO/AEO, Shopify, local SEO, websites, social marketing, AI automation, travel advisor fundamentals and telecom.
- Free lesson previews plus server-side subscription/purchase gates.
- Central TAKATAK sign-in bridge with state-bound launch, short-lived one-time code exchange and signed HttpOnly session cookies. A missing bridge fails closed.
- Student dashboard and authenticated lesson completion API backed by PostgreSQL.
- Pricing, resources and partner information pages that do not advertise unapproved rates.
- SQL learning-progress table (does not copy client identity, billing or other tenant data).
- GitHub Actions verification and container build for Coolify when production is approved.

This is a **working application foundation**, not a claim of live paid checkout, licensing authorization or deployed production. Future course editorial content, video hosting, educator CMS, exams, certificates and analytics require further work.

## Running the project

Node.js 22 is required. Install with `npm install`, copy `.env.example` to `.env.local`, then:

```bash
npm run dev
npm run test
npm run typecheck
npm run lint
npm run build
```

Visit http://localhost:3000. Free lessons work without auth or database. To track progress, use a PostgreSQL instance and explicitly apply `db/001_academy.sql`; never run a migration automatically on startup.

## Identity and payment boundary

**Master application:** `takatakca/takatak-v1`.

1. Academy `/auth/start` generates a random state cookie and sends browser to `TAKATAK_ACADEMY_LAUNCH_URL?state=<random>`.
2. TAKATAK-V1 authenticates the person via TAKATAK Auth, verifies the master identity, creates a one-time 90-second launch code, and returns to Academy `/auth/callback?code=<code>&state=<same state>`.
3. Academy verifies the original state and exchanges code server-to-server at `TAKATAK_ACADEMY_EXCHANGE_URL` using a dedicated service token.
4. TAKATAK-V1 atomically consumes the code, verifies the user is active and returns a restricted session snapshot.
5. Academy sets a signed HttpOnly session with maximum 15-minute TTL. Entitlements must be supplied by TAKATAK-V1; they cannot be added by the student.
6. A paid lesson is served only for valid `academy_plus`, `academy_course:<course-slug>` or `academy_all_access` entitlements. **Specialist purchases are not unlocked by Academy Plus alone.**
7. Free courses and free lesson previews are publicly readable. Signing in is only necessary for saving progress and accessing a verified paid entitlement.

Exchange response schema:

```json
{
  "ok": true,
  "session": {
    "masterIdentityId": "uuid-from-takatak",
    "displayName": "First Last",
    "productCode": "academy",
    "entitlements": ["academy_free"],
    "expiresAt": "2026-10-15T12:00:00.000Z"
  }
}
```

TAKATAK-V1 manages purchase flows and future subscription webhooks. **This Academy deliberately has no Stripe payment collection or browser-controlled purchase activation.** Until catalog plans, approved prices, entitlements and verified webhooks exist at TAKATAK-V1, paying for Academy is not possible.

## Environment variables

| Name | Use |
|---|---|
| `NEXT_PUBLIC_TAKATAK_DASHBOARD_URL` | Main TAKATAK-V1 dashboard navigation |
| `TAKATAK_ACADEMY_LAUNCH_URL` | TAKATAK-V1 authenticated launch endpoint |
| `TAKATAK_ACADEMY_EXCHANGE_URL` | TAKATAK-V1 protected one-time code exchange |
| `TAKATAK_ACADEMY_SERVICE_TOKEN` | Server-only dedicated Academy service token; use same value at TAKATAK-V1 |
| `ACADEMY_SESSION_SECRET` | Random session-signing secret, minimum 32 characters |
| `DATABASE_URL` | Academy-owned PostgreSQL progress database connection |

Never commit real secrets. Use Coolify runtime secret variables. Sign-in URLs must use HTTPS in production, and the callback must be exactly configured at V1.

## Health and release gates

GET `/api/health` reports running and whether authentication / learning storage are configured; it does **not** claim integration or paid checkout is active until real server-to-server exchange testing.

CI runs unit tests, type-checking, linting and build. A passing CI run means source-level checks pass, **not** that a Coolify production deployment succeeded.

Provision the Academy as its own Coolify app connected to this repository, configure domain and secrets, apply approved SQL migration, then test real callback/auth exchange and progress. Existing TAKATAK-V1 release controls prohibit unrelated agents from pushing V1 main or directly deploying it.

## Professional courses

The Travel Advisor track contains learning exercises but is **not** itself an official travel agent licence or a government accreditation. Québec travel agency permits and travel counsellor certificates have distinct legal requirements administered by the OPC: https://www.opc.gouv.qc.ca/commercant/permis-certificat/agentsdevoyages/ and https://www.opc.gouv.qc.ca/commercant/permis-certificat/conseiller/

## Next steps

See [the TAKATAK-V1 integration contract](docs/TAKATAK_V1_INTEGRATION.md), plus [work log](WORKLOG.md).
