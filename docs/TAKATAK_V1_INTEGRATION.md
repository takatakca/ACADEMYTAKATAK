# Academy ↔ TAKATAK-V1 integration contract

## Ownership

TAKATAK-V1: master identity, login, master customer/CRM records, product catalog, subscriptions, purchases, entitlements, billing, refund/cancel/revocation and dashboard module navigation.

Academy: catalog/course presentation, private lesson content, lesson completion, learning analytics, classroom resources and eventual content authoring.

Never query TAKATAK-V1 database directly from Academy; exchange only minimal short-lived product-session information.

## First live bridge phase

Deploy TAKATAK-V1 endpoints:
- GET /api/experiences/academy/launch?state=<43 character base64url>
- POST /api/experiences/academy/exchange, Authorization: Bearer <dedicated service token>
- Environment: ACADEMY_EXPERIENCE_CALLBACK_URL and TAKATAK_ACADEMY_SERVICE_TOKEN

The launch redirects back to Academy's HTTPS `/auth/callback` with exactly the same state and a random one-time code. The exchange must revalidate identity and account status, consume the code once, then return the JSON schema in README.md. Codes expire in 90 seconds; Academy product session max 15 minutes; cancel/suspend takes effect at next session refresh or immediately when introspection/revocation hooks are added.

The first live phase may return only `academy_free` to authenticated users, since no paid catalog has yet been provisioned. Never infer paid access from a query string, a checkout redirect or a local progress record.

## Pricing and entitlement catalogue to implement in TAKATAK-V1

- Product `academy`.
- Free plan `academy_free` (entry), entitlement `academy_free`.
- Monthly Plus plan with approved CAD price (not yet set), entitlement `academy_plus`. Its source of truth must be confirmed payment/subscription status.
- Individual professional course purchases: `academy_course:<slug>` entitlements, issued only after confirmed payment and eligibility checks. Plus does not imply specialist access.
- Optional admin-issued `academy_all_access` must have audit logs and explicit authorized grant.
- Refunds, cancellations, failed invoices and subscription expiry must automatically affect entitlement issuance.
- Preserve master-identity and tenant-scoped visibility rules in the billing administration screens.

## Student experience

- Public catalog and free lessons: accessible to all.
- Learner account: authenticate through TAKATAK-V1. There is no Academy-specific password database.
- Lessons 1 and 2 of every freemium/professional course are free in the initial curriculum.
- Subsequent lessons: middleware/service gate on the server for the specific lesson and entitlements.
- One-time paid travel course is a separate purchase. Its pedagogical completion certificate, if later offered, is not a legal permit or certification.
- Progress saved in Academy PostgreSQL as master identity ID + course slug + lesson slug.
- Dashboard: a gated TAKATAK-V1 navigation entry opens Academy in the same browser session through secure launch, not by embedding private records in public URLs.

## Operational gates

1. Verify approved Academy domain and callback over HTTPS.
2. Provision secrets in both apps, never in source.
3. Verify genuine TAKATAK login, original-state matching and one-time exchange, including expired/replayed code rejection.
4. Verify paused/cancelled subscription and refunded one-time purchase do not unlock advanced content.
5. Apply Academy-only learning-progress SQL after explicit approval and database backup.
6. Complete automated and manual accessibility, mobile, security and payment checks.
7. Only then enable protected billing checkout and market the platform as generally available.

## Planned course content and capabilities

Video lesson library, instructor/administrator CMS, draft-review-publish workflow, quizzes and graded assessments, certificate templates with unique verification URLs, French Canadian translations, syllabus versioning, affiliate referrals with fraud prevention and payouts, free SEO/GEO audit tools connected to TAKATAK SEO APIs, advanced student analytics, course prerequisites, organization/team seats.

The example affiliate percentages from other companies are **not** TAKATAK contractual rates and should not be presented as actual TAKATAK offers.
