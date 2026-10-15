# TAKATAK Academy

Education platform for the **GROUPE TAKATAK** ecosystem. Its master dashboard and identity authority is [TAKATAK-V1](https://github.com/takatakca/takatak-v1). The Academy is an independent learning UI, **not an independent CRM, billing engine or user directory**.

## Implemented foundation

- Next.js 16 / React 19, responsive electric-blue on navy Academy frontend.
- **29 course paths and 145 lessons** across the existing SEO, Shopify, local SEO, websites, social, AI, travel and telecom foundation and 21 additional module-aligned TAKATAK-V1 service courses. Each service course maps to the main dashboard's actual module route.
- Free lesson previews plus server-side subscription/purchase gates.
- Central TAKATAK sign-in bridge with state-bound launch, short-lived one-time code exchange and signed HttpOnly session cookies. A missing bridge fails closed.
- Student dashboard and authenticated lesson completion API backed by PostgreSQL.
- Pricing, resources and partner information pages that do not advertise unapproved rates.
- SQL learning-progress and graded-exam history tables (do not copy billing, customer records or other tenant data).
- **8 sequenced programs** (/programs) with course roadmaps, lesson prerequisites for exams, individual assessment grading and cumulative student points.
- **Final knowledge exams:** five questions per course; 80% passing mark; 20 points per correct answer; three attempts per rolling 24-hour window, best course score only; server-verified results shown in /account.
- Original blue/cyan/violet/orange course illustrations stored in public/course-art/.
- GitHub Actions verification and container build for Coolify when production is approved.

This is a **working application foundation**, not a claim of live paid checkout, licensing authorization or deployed production. Deeper instructor-reviewed content, video hosting, an educator CMS, verified certificates, secure private exam item banks and advanced analytics require further work. Exams currently use **publicly viewable source-code item banks** and must be treated as low-stakes learning checks, not high-stakes external accreditation.

## Running the project

Node.js 22 is required. Install with `npm install`, copy `.env.example` to `.env.local`, then:

```bash
npm run dev
npm run test
npm run typecheck
npm run lint
npm run build
```

Visit http://localhost:3000. Free lessons work without auth or database. To track progress and graded exams, use a PostgreSQL instance and explicitly apply `db/001_academy.sql` followed by `db/002_exam_attempt.sql` through an approved migration process; never run migrations automatically on startup. If 002 is missing, exam submission fails closed with a 503; no points are silently awarded.

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

## Student progression and scoring

1. Explore a free lesson from the course catalog or browse a curated multi-course program.
2. Sign in using the TAKATAK-V1 master account to save course progress.
3. Complete each available lesson and its practical exercise; advanced lessons require a verified V1 entitlement.
4. When all lessons of a course are complete and accessible, open its final assessment.
5. The server checks session, prerequisites, entitlements and answer choices before recording the score.
6. Five questions at 20 points each; 80% to pass. Three submissions are allowed in a rolling 24-hour period. Points are calculated from the best score **per course**, not from the sum of every retry.
7. Personal exam history, passing marks, cumulative points and program achievement status appear in the private /account and /programs pages.

**Important:** The current exam item banks are in the public source repository. They are for low-stakes practice and not suitable as tamper-resistant regulated professional examinations. Before real professional certifications, move the question bank to an access-controlled datastore, add instructor review, randomized items, identity verification and independent accreditation where applicable.

## Next steps

See [the TAKATAK-V1 integration contract](docs/TAKATAK_V1_INTEGRATION.md), plus [work log](WORKLOG.md).
