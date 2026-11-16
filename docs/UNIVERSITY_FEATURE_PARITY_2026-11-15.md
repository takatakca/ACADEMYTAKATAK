# TAKATAK University — MasterClass Executive feature parity ledger
Research date: 2026-11-15 | Source: public MasterClass Executive pages and official help center; owner-provided promotional screenshots. **No authenticated MasterClass student account, private lesson video, or private instructor script was accessed.** The public embedded promo video cannot be reliably viewed from the text retrieval available here.

## Originality contract
We build **feature parity**: equivalent categories of functionality and learning outcomes in an original TAKATAK product. Do not copy MasterClass videos, scripts, slide decks, illustrations, protected course content, voice/likeness, trademark, CSS or private user experience. New TAKATAK lessons are original and may teach comparable general skills. All generated media requires approved provenance, assets and subject rights.

## MasterClass capability -> TAKATAK requirements and current evidence
Legend: **SOURCE** means an Academy implementation exists in GitHub, not that production has been verified. **PARTIAL** means source covers only part of the behavior. **PLANNED** means not implemented and must not be advertised as active. **EXTERNAL** means it must be implemented and verified through TAKATAK-V1 or approved providers.

| Area | Reference capability | TAKATAK product requirement | Status |
| --- | --- | --- | --- |
| Recruitment | Marketing microsite, teaser, instructor bios, program overview | Original Academy /universe microsite, conversion CTA, pricing disclosures | PARTIAL: draft PR #3 |
| Recruitment | Application screening, admissions decision | School-managed program enrollment and acceptance workflow when selection required | PLANNED |
| Accounts | Single user account | Reuse TAKATAK-V1 master sign-in, no second identity directory | SOURCE: bridge, live not verified |
| Onboarding | Learner profile, goals and current industry | Opt-in goal and subject profile private to learner | PLANNED |
| Course catalog | Ten broad subjects + modules | Original structured multi-school course catalog, pathways, prerequisites | SOURCE: current programs/catalog |
| Content | Instructor video chapters | Original TAKATAK video library, chapter cue points, copyright-cleared media | PLANNED |
| Content | Articles, podcasts, case studies | Reviewed original text/audio, case data, files and transcripts | PARTIAL: text lessons |
| Content | Searchable and contextual lesson resources | Subject-linked resources, approved downloadable assets and tools | PARTIAL: resources |
| Learning | Adaptive AI teacher conducts instruction | Source-grounded AI tutor through server-only policy, consent, cost caps, human reviews | PLANNED |
| Learning | Self-paced topic navigation | Course/lesson program structure with stable slugs | SOURCE |
| Learning | Multiple learning modes | Text, accessible original video, audio-only, captions, screen reader and keyboard | PLANNED |
| Learning | Ask follow-ups, request examples | Context-aware conversational teacher per active lesson | PLANNED |
| Learning | Personalized feedback and dynamic pacing | Feedback engine and mastery tracking, no arbitrary AI auto-grading | PARTIAL: exam feedback |
| Learning | Dictation speech-to-text | Accessible voice input with explicit consent and edit-before-send | PLANNED |
| Learning | Teacher memory across subjects | Private, reviewable, editable/deletable learner preference memory | PLANNED |
| Learning | Saved AI responses/lesson bookmarks | Private subject-scoped notes, message saves, search and exports | PLANNED |
| Lab | Hands-on AI project assignments | AI labs with approved briefs/rubrics, safe work samples, evidence history | PARTIAL: lesson workbooks |
| Lab | Live workshop demonstrations | Staff-scheduled virtual workshops + recorded playback | PLANNED |
| Lab | Project submission and review | Teacher queue, rubric, acceptance/revision with audit | PLANNED |
| Lab | Student portfolio and shareable artifacts | User-owned private-by-default portfolio and selectively shareable work | PLANNED |
| Assessment | Knowledge checks and low-stakes grading | Server-verified exam attempts, best score and exam feedback | SOURCE |
| Assessment | Subject/lab completion rules | Configurable original program eligibility and reviewed lab criteria | PARTIAL |
| Credential | Certificate of completion | Revocable education record with no unsupported accreditation claim | SOURCE; runtime unverified |
| People | Instructor identity and contributions | Verified TAKATAK staff, author and distinct reviewer entitlements | SOURCE: staff CMS |
| People | Teacher calendar and class management | Teacher roster, lesson authoring, student feedback and cohort administration | PARTIAL |
| Community | Cohort profiles/pods, private discussion | Moderated membership-scoped community and cohort discussions | PLANNED |
| Community | Instructor Q&A, community office hours | Recurring Q&A + event archives with controls | PLANNED |
| Events | Zoom event registration, live streams, recordings | Approved event provider, attendance, recordings with permissions | PLANNED |
| Analytics | Learner progress and topic completion | Scoped progress, exams, achievements and dashboard | SOURCE |
| Analytics | Instructor cohort progress | Consent- and role-scoped aggregates, no cross-tenant inspection | PLANNED |
| Organization | Employer enrollment/group onboarding | Sponsor organizations/OBNL verified by V1 and Academy memberships | PARTIAL: this branch |
| Organization | Organization-sponsored access | Seat grant after V1 contract/payment confirmation; seat record never unlocks content | PLANNED |
| Organization | Partner financial assistance | OBNL negotiated rate or sponsorship governed by approved contracts | PLANNED |
| Commerce | Premium subscription | Central V1 `academy_plus` entitlement with verified payments | EXTERNAL |
| Commerce | Standalone course purchase | Central V1 per-course entitlement and refunds/revocation | EXTERNAL |
| Commerce | Enrollment installments | V1-managed installments and tax treatment approved per jurisdiction | PLANNED |
| Commerce | Employer invoice and reimbursement documents | V1 invoices/receipts, employer reimbursement toolkit | PLANNED |
| Privacy | Student data export/erasure | Academy-scoped data export/workbook erasure + privacy runbooks | SOURCE |
| Privacy | Confidential lab inputs | Default private, anonymization checks and anti-leakage | PLANNED |
| Accessibility | Language, captions and accommodations | FR-CA and EN parity, closed captions, transcripts, contrast and accessible assessments | PARTIAL |
| Media production | Professional film & editing | TAKATAK original Runway workflows with credits, usage logs, human rights review | PLANNED |
| Media production | Presenter/teacher character | Consented original HeyGen avatars and narration, bilingual template management | PLANNED |
| Quality | Course refresh and review | Versioned content, independent reviewer, provenance and accessibility approval | SOURCE |
| Support | Help center + refund and access requests | TAKATAK support AI with guarded service escalation, ticketing and audit | PLANNED |
| Governance | Program code of conduct | Academic integrity, moderation, safe content and incident resolution policies | PLANNED |
| Device support | Responsive web + playback controls | Mobile/desktop user journey and future offline/audio features | PARTIAL |

## Teacher, student, OBNL and platform-admin roles
- **Student:** existing Academy learner account, personal lesson completion, exams, workbooks and awards; future tutor/portfolio.
- **Teacher / author:** currently requires verified `academy_editor` from the V1 bridge for lesson draft and exam authoring.
- **Independent reviewer:** currently requires verified `academy_reviewer` for publish; cannot approve own work.
- **OBNL/business manager:** future `academy_org_manager` or `academy_org_admin` signed V1 grant **plus** an approved organization and active manager membership in Academy; no browser-supplied role.
- **Academy platform administrator:** separate audited V1 permissions, limited access, no blanket access to private learner artifacts without business necessity.

## Production / cost / copyright gates
Runway Dev: https://docs.dev.runwayml.com/api/ ; https://dev.runway.com/pricing .
HeyGen Developers: https://developers.heygen.com/ .
No current Runway/HeyGen credentials or provider capabilities are assumed. Validate account plan, commercial rights, original script approval, avatar consent, generation budgets and exact API versions. Log expenses per training artifact and block unexpected spend.
`takatak-v1` controls academy plans, refunds, taxes and vendor charges. A student cannot self-grant an organizational sponsorship.
No public source or promotional screenshot proves that a MasterClass feature is available to our student account. Ground implementation in reviewed official docs and actual TAKATAK source tests.

## Public source references
- MasterClass Executive details: https://www.masterclass.com/executive/program-details
- Getting started (subjects, notes, memory, labs, community, dictation): https://www.masterclass.com/help-center/executive/answers/getting-started-with-master-class-executive--id--3EgQWpDsQtihO05aeKqYhg
- Program structure: https://www.masterclass.com/help-center/executive/answers/master-class-executive--id--CnkitFmMSUOXT-gKD-emzA
- Group/corporate enrollment: https://www.masterclass.com/help-center/executive/answers/group-corporate-enrollment-and-tax--id--sB1H4TT_QeauE7PaJTGYYQ
- Learning materials and accessibility: https://www.masterclass.com/help-center/masterclass/answers/how-do-classes-work--id--GfYxwjzXQuSxglxsayS8Hg
- Cost and payment plans: https://www.masterclass.com/help-center/executive/answers/fee--id--h9T4qdngTuO3rXBu-TQaog
