# Academy architectural decisions

Updated 2026-10-15. Maintain these decisions unless the owner explicitly approves revisions.

1. **TAKATAK-V1 is the master dashboard** for all identities, companies, teams, subscriptions, product entitlements and purchase lifecycle. Academy never creates a competing customer CRM or a standalone password/payment system. Learner workbooks are stored only in Academy, keyed by the opaque master identity, not shared across merchants.
2. **Separate frontend and database** for Academy coursework. Learning is indexed by the opaque V1 master identity ID; other merchant tenant data is not replicated.
3. **Paid content is server-gated** by the signed short-lived V1 product session. Free lesson access is public; a professional one-time purchase is not implied by Academy Plus.
4. **Current question banks and post-submission review are low-stakes educational exercises**, not private regulated exam content. Public GitHub repository includes answer keys; do not misrepresent their integrity.
5. **Points only reward best score per course**, max 100, 80% passing, max three attempts in rolling 24h. Whole-program completion requires all component course lessons AND passed exams.
6. **Course content is generated editorial groundwork**, needing expert review, practice and accessibility improvement. No false assertion of active external AI tutoring or official course accreditation.
7. **Travel professional training is not a government-issued travel agency licence**, travel counsellor certificate or supplier credential. Regulatory claims require official approval.
8. **GitHub main is permitted for Academy** with coherent commits, SHA-aware updates, CI verification and handoff docs. TAKATAK-V1 has its own coordinator and release policy; PR #183 must follow it.
9. **Coolify deployment is opt-in and evidence-based**, protected by a passing CI SHA, deployment UUID and actual operational readiness. Secrets belong exclusively to Coolify/GitHub encrypted stores, not repository history.
10. **No fabricated integrations, conversions or testimonials.** A connected badge requires evidence of a live authorized provider request.
11. **Visual language is electric blue on deep navy.** Original learning illustrations are allowed, but official TAKATAK logos must use approved assets.
12. **Agent continuity is recorded in GitHub** in docs/PROJECT_STATUS.md, TASK_QUEUE.md, AGENT_HANDOFF.md, DEPLOYMENT.md, DECISIONS.md and WORKLOG.md.
