# TAKATAK Academy: curriculum and assessment architecture

Status: implemented source foundation; launch remains gated on TAKATAK-V1 bridge, Academy deployment and database migrations.

## Verified source of service coverage

Inspected 2026-10-15:
- `takatakca/takatak-v1/src/lib/dashboard/dashboard-config.ts` (NAV_SECTIONS)
- `takatakca/takatak-v1/docs/TAKATAK_DASHBOARD_V1_FULL_SCREEN_ARCHITECTURE.md`
- `takatakca/takatak-v1/BRAND.md`

A mapping snapshot lives at `src/lib/dashboard-learning-map.ts`. It links 55 sidebar navigation screens to courses without claiming that all backend integrations are live. Follow V1 changes by reviewing that mapping whenever a module is added, renamed, retired, or moved.

## Content structure

- 29 modular courses (`src/lib/catalog.ts` + `src/lib/service-courses.ts`) with 145 current lessons.
- 8 sequenced programs (`src/lib/programs.ts`) spanning digital business, marketing, commerce, sales, professional travel, IT and operations.
- Every lesson supplies a focused teaching sequence and a practical activity. Free lessons are public; premium lessons require **server-verified** V1 product entitlements.
- Each course has a five-question learning exam, graded on the server.
- Student progress, exam history and free-text practice workbooks are keyed by verified master identity ID; practical exercises require an authorized session and server-side content/access validation.
- Images: four original editable SVG course illustration assets under `public/course-art` with GROUPE TAKATAK blue/navy visual treatment. These are not substitutes for the owner's logo.

## Grading and achievements

- Five multiple-choice questions per course, 4 choices each.
- 20 points per correct answer, maximum 100/course; a score of 80+ passes.
- Learners must finish and mark every course lesson complete before an exam is available.
- V1 must grant any paid access before a student can take a premium course assessment. Specialist-course purchases are separate entitlements.
- Three attempted submissions per learner/course within any rolling 24 hours, serialized with an advisory transaction lock.
- All attempts are stored; each student's displayed total is the **sum of their best course scores**, not the sum of repeated attempts.
- Program achievement requires all lessons plus a passed exam for each constituent course. Programs are curated roadmaps, not separately billed products.
- Travel advisor training completion is **not** an OPC permit, consultant certificate or supplier credential.

## Data migrations

`db/001_academy.sql`: student lesson completion.

`db/002_exam_attempt.sql`: scored exam attempt history, index, validation.

`db/003_lesson_workbook.sql`: student practice response upsert, 4,000 character limit and identity/course/lesson compound key.

`db/004_private_exam_bank.sql`: private immutable draft/review/published assessment versions, unique active version per course, source and version fields on attempts. No migrations occur automatically at startup.

Production DBA approval is required before applying migrations. Back up first, apply in order, and verify SELECT and INSERT access with a dedicated least-privilege Academy application account. Academy stores neither payment details nor another tenant's customer records.

## Current exam assurance level

**Learning check / low stakes only.** Existing legacy practice quizzes remain exposed as source-code examples in this public GitHub repository. New reviewed item banks are stored only in private Academy PostgreSQL and require two separate authorized reviewer/editor identities. Students can inspect source to discover answers. Neither obscuring server HTML nor limiting attempts addresses public source disclosure.

Before issuing any high-stakes or externally verifiable certificate:
1. Populate the implemented private, versioned bank with original expert-reviewed items and independently publish approved versions.
2. Add versioning, larger randomized question banks, response audits and review from subject matter experts.
3. Add plagiarism/risk review and reasonable accessibility accommodations.
4. Require identification/proctoring proportional to the credential.
5. Build signed verification and revocation records.
6. Secure official accreditation or regulator approval **before** promising licensing outcomes.

Do not advertise current Academy training as externally accredited.

## Editorial quality process

All generated material is a structured starting curriculum. Each unit should be reviewed by a knowledgeable instructor for accuracy, jurisdiction, branding and real-world exercises before commercial release. Add approved video demonstrations, downloadable workbook assets, multimedia transcripts, formative quizzes and bilingual French Canadian translations as content matures.

Do not claim live AI content generation until a provider adapter, access controls, generation costs, human review and publication approval workflows have been implemented.

## Integration with TAKATAK-V1

PR #183 proposes a V1 Academy landing tile and a free-only SSO launch/exchange. It remains subject to coordinator review/merge and full runtime smoke tests. The master dashboard alone owns identity, subscription state, refunds, course purchases and entitlements. Academy must not independently process Stripe charges or grant itself privileged paid access.

Launch checklist:
1. V1 PR reviewed and merged under V1 release policy.
2. Academy has its own Coolify app and public HTTPS domain.
3. Required V1 and Academy secrets provisioned outside Git.
4. Both SQL migrations explicitly applied to Academy-owned PostgreSQL.
5. Real SSO happy/error/replay tests pass.
6. Paid-content denial tests verified, including revoked entitlements.
7. Exam DB transactional throttle, score calculation and program completion smoke-tested using actual sessions.
8. Mobile, keyboard, screen-reader and browser QA plus security review.
9. Only then public launch. Paid checkout requires additional V1 billing implementation and signed webhook QA.

## QA

`npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` on Node 22. CI logs are the actual verification evidence; a code push alone does not establish deployment health.

## Reviewed private bank implementation (source phase)
`src/lib/private-exams.ts` stores 10–60 questions per authored version, requires V1 `academy_editor` to draft and separate V1 `academy_reviewer` to publish. All published questions remain server-side. Student exam pages receive only five sampled questions plus a 15-minute HMAC-signed selection token scoped to learner, course, bank version and item IDs; submissions are graded using the exact approved version. Attempt history records both source and version; retries remain capped at three per 24 hours. The learner sees answer explanations only **after** server grading and persisted score. `/instructor/exams` remains inaccessible without signed TAKATAK permissions; V1 must later issue these staff entitlements after its own governance review. This is not yet a proctored or regulated high-stakes exam system.

## Program completion verification (source phase)
`db/005_program_awards.sql` adds Academy-only optional immutable educational completion snapshots (opaque UUID, course IDs and points, issuance time) and revocation/audit fields. A student may explicitly claim a record only after all lessons and examinations in an Academy program are confirmed complete in their own master-linked progress, with currently valid learning access. `/verify/<uuid>` checks the record status and makes **no personal identity assertion**. Only V1 `academy_awards_admin` may record a revocation and reason. This is not an accredited, externally licensed or proctored credential. Migrations 001–005 and real service/identity integration remain outstanding before live issuance.


## Single-use exam attempt integrity
Migration `006_exam_ticket_once.sql` augments the 15-minute signed exam ticket with a cryptographic random v4 UUID nonce and a UNIQUE index on the persisted attempt nonce. A successfully recorded grade therefore consumes its exact ticket once; another concurrent or later submission of the same token fails without additional points. This is enforced in PostgreSQL, not in browser state. CI applies six migrations to an isolated disposable PostgreSQL schema and validates constraints; production approval, SSO smoke tests and DB migration remain separate launch gates.
