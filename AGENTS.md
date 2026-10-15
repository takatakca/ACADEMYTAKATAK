# TAKATAK Academy agent guide

- Read README.md, WORKLOG.md, docs/AGENT_HANDOFF.md, docs/TASK_QUEUE.md and docs/TAKATAK_V1_INTEGRATION.md before new development.
- TAKATAK-V1 is the **master dashboard** and sole authority for accounts, entitlements, subscriptions and course-purchase status. Academy stores only its own learning content and progress, keyed by the master identity ID.
- Do not add separate Academy password registration, local Stripe billing or browser-trusted role/plan claims.
- Paid content must be gated on the server, not merely hidden with CSS. Never render restricted lesson copy into guest HTML.
- In the academy repository, avoid pushing unverified changes over other agents' commits. Use expected-SHA updates and CI.
- Follow GROUPE TAKATAK blue-on-navy brand; do not invent or substitute official logo files.
- Keep regulated travel education clearly separate from actual licensing and certification.
- Write WORKLOG.md handoff notes and maintain accurate deployment status.

- Keep docs/PROJECT_STATUS.md, docs/TASK_QUEUE.md, docs/AGENT_HANDOFF.md, docs/DEPLOYMENT.md, docs/DECISIONS.md updated at handoff. Inspect latest CI for actual green status.
- Readiness: /api/health is liveness only; /api/ready requires the V1 bridge configuration and all approved Academy tables. Do not claim deployment unless actual Coolify deployment UUID, matching SHA and ready response are verified.
- Coolify deployment is gated on the explicit GitHub variable ACADEMY_AUTODEPLOY_ENABLED=true. The workflow being skipped is intentional, not a deploy success.
