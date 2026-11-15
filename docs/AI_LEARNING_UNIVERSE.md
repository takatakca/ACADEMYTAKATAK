# TAKATAK Academy — AI Learning Universe (original experience)

Date: 2026-11-15. Status: source-only M0 on branch `feat/ai-learning-universe-20261115`. Source is not a verified production deployment.

## Owner's product direction
Build a premium, original immersive learning universe inside the existing `takatakca/ACADEMYTAKATAK` product, connected to the TAKATAK-V1 master dashboard and identity. AI should eventually help create adaptive explanations, instructional visuals, spoken teaching, practical assignments and feedback. Students should learn *with* an AI instructor instead of merely viewing a static library.

The reference is the public MasterClass Executive sales/learning experience, https://www.masterclass.com/executive/program-details (observed 2026-11-15). Competitive design principles only: guided learning, AI personalization, cohorts, AI labs, multimedia and real outcomes. Do **not** copy MasterClass source code, scripts, videos, course text, branding, instructor likenesses, logos, UI artwork, or copyrighted materials.

## Current TAKATAK source capabilities
- 29 course paths, 145 starter lessons, eight curated programs.
- Exercises, low-stakes exams, course scores, program progression, optional educational records and editor/reviewer publishing workflow in source.
- Identity and entitlements originate in TAKATAK-V1; Academy stores learning content and records only.
- V1 bridge was merged into the V1 repository, but the Academy production database, domain, secrets, real SSO exchange and Coolify deployment are **not verified**.
- Master TAKATAK-V1 handles all subscriptions/purchases; there is no approved Academy live checkout.

## New M0 microsite on this branch
- New independent visual destination at `/universe` with original text, CSS-defined abstract mentor illustration, responsive design and reduced-motion handling.
- Current catalog and program counts generated from source data rather than claimed marketing metrics.
- Real links into `/programs`, `/programs/marketing-ai`, `/programs/business-intelligence`, `/programs/digital-business`, `/programs/sales-success`, `/#courses`, `/account`, `/auth/start`.
- Source Academy homepage directs users to the new route.
- Clear labels distinguish concept AI mentor visuals from available lessons. No provider calls, credentials, invoices, schema migrations or autonomous voice agents.
- Supporting test asserts known program slugs and disclosure labels.

## Target experience architecture
1. **Learner identity:** TAKATAK-V1 authenticated identity and server-verifiable entitlements only. Existing one-use bridge; no additional Academy password or payment system.
2. **Tutor orchestration:** consent-based, server-only AI provider adapter with configurable provider/version, documented prompts, source-grounded retrieval from approved Academy lessons, injection defense, refusal boundaries and optional human fallback. Never ingest all private cross-tenant TAKATAK information into a generic tutor context.
3. **Curriculum engine:** lesson/subject version, topic mastery, prerequisites, accessibility accommodations, retry and evaluation; staff author → different reviewer publishes via current CMS governance.
4. **AI-generated media:** licensed/original characters and visual assets, authorized speech and voice, explicit disclosure, subtitles, written transcript, non-AI alternative, opt-out; never simulate a real person without permission.
5. **Labs:** project briefs, rubric, artifacts, feedback, plagiarism and integrity protections; stronger regulated/high-stakes assessment procedures before external recognition.
6. **Portfolio:** user-controlled work samples, version history, private-by-default sharing with expiry/revocation; certificates remain educational unless separately accredited.
7. **Community and events:** separately moderated, age-appropriate cohort access with privacy and safety controls, optional external live event providers under contracts.
8. **Analytics and spend:** scoped telemetry, provider-call ledger per student/course/task, explicit token/dollar budgets, caching, rate limits, idempotent retries and hard quotas. No covert use of private source materials.

## Milestones with truth-in-advertising gates
- **M0: Visual universe / source only** — route, responsive UI, safe existing links, explicit concept labels, unit/CI evidence.
- **M1: Real tutor proof of concept** — provider selection, backend endpoints, privacy consent, grounded approved lesson citations, server-side access, mock and actual provider tests, abuse/cost caps and human review. **Not implemented.**
- **M2: Multimodal lesson studio** — scripts, original visuals, consented narration, captions/transcripts, localization FR-CA + EN, content approvals and accessibility QA. **Not implemented.**
- **M3: AI Labs and portfolio** — teacher rubrics, student submissions, feedback audit and safe exports. **Not implemented.**
- **M4: Cohorts + events** — real scheduling, educator controls, moderated communities and permissions. **Not implemented.**
- **M5: Staging and production** — release-gated runtime, DB backup and ordered migrations, genuine TAKATAK-V1 SSO and tenant-isolation E2E, mobile/performance/security QA, deployed exact-SHA ready proof, approved plans. **Not implemented/verified.**

## Acceptance checks
- Route renders on mobile/desktop, keyboard navigable; no unlicensed assets or deceptive active-provider signals.
- Source counters match real catalog; all navigational targets exist; current Academy entitlements remain server-gated.
- AI endpoints must never be activated before V1 identity validation, consent, retrieval controls, rate/cost caps, privacy design, audit and test approval.
- Never label a marketing source demo as a deployed AI assistant.
- Production is only "live" after exact commit SHA + Coolify resource UUID + `/api/ready` + real user E2E verification.

## Reference
- MasterClass Executive program details: https://www.masterclass.com/executive/program-details
- MasterClass own Help Center learning experience: https://www.masterclass.com/help-center/executive/answers/getting-started-with-master-class-executive--id--3EgQWpDsQtihO05aeKqYhg
- TAKATAK integration: docs/TAKATAK_V1_INTEGRATION.md; docs/DEPLOYMENT.md.
