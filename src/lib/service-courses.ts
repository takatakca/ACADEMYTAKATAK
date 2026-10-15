import type { Course } from "./catalog";

/**
 * Curriculum sourced from TAKATAK-V1's dashboard-config NAV_SECTIONS and screen map.
 * Editorially generated learning plans, NOT live AI calls or government accreditation.
 * Only the Academy owns this syllabus; TAKATAK-V1 remains the master account system.
 */
type Topic = [title: string, teach: string, task: string, question: string, right: string, wrongA: string, wrongB: string, wrongC: string];
type Path = {
  slug: string; title: string; category: string; description: string; outcome: string;
  dashboardPath: string; icon: string; accent: string; topics: Topic[];
};
const T = (title:string,teach:string,task:string,question:string,right:string,wrongA:string,wrongB:string,wrongC:string):Topic =>
  [title,teach,task,question,right,wrongA,wrongB,wrongC];

const pathways: Path[] = [
  {
    slug:"dashboard-essentials",title:"TAKATAK-V1 Dashboard Essentials",category:"Platform & Operations",
    description:"Navigate the master dashboard, understand modules and confidently complete everyday tasks.",
    outcome:"Build a documented workflow across TAKATAK-V1 without crossing client boundaries.",dashboardPath:"/dashboard",icon:"▦",accent:"blue",
    topics:[
      T("Your dashboard and workspace","The TAKATAK dashboard is the control tower for clients, brands and service modules. A learner should locate their permitted workspace before opening records.","Identify the dashboard overview, active client selector and two service modules.","Where should you begin before changing a client's data?","Verify the active client and your permission.","Open the first client shown.","Copy a customer record into another brand.","Disable security checks."),
      T("Understand products and access","Service navigation depends on subscribed products, entitlements and role permissions. Hidden menus are not proof that a purchase exists.","Draft a checklist of the services and permissions your role needs.","What grants a user access to a restricted product?","A valid entitlement and the required role permissions.","A link copied from another account.","A completed free course.","A screenshot of an invoice."),
      T("Find an activity and its owner","Events, notifications and jobs are ways to follow progress. Distinguish a pending job from a completed task.","Trace a sample customer request through job, owner and status.","A job marked pending means what?","It has not yet completed and should not be presented as successful.","It is already in production.","The customer was automatically billed.","The user has administrator rights."),
      T("Work with client separation","A merchant must only access its own client records, even if the platform resolves identities across businesses centrally.","Describe three rules preventing cross-tenant exposure.","Which approach protects tenant information?","Server-side authorization and tenant-scoped queries.","Only hiding buttons with CSS.","Sharing an admin account.","Using unverified query parameters."),
      T("Build a daily dashboard routine","Review alerts, assigned tasks, integration errors and results. Record actions and escalate uncertain changes.","Create a 10-minute morning review checklist.","What should your daily routine prioritize?","Pending actions, failures, ownership and verified outcomes.","Decorative charts with no data.","Clearing the audit log.","Guessing the status of external integrations.")
    ]
  },
  {
    slug:"crm-clients",title:"CRM, Clients & Customer Relationships",category:"Sales & Customer Success",description:"Manage client accounts, contact quality and responsible follow-ups.",outcome:"Design a customer lifecycle from initial contact to ongoing support.",dashboardPath:"/dashboard/clients",icon:"♧",accent:"cyan",
    topics:[
      T("Client and contact fundamentals","Separate a master customer identity from a business-specific customer relationship. Never expose another tenant's activity.","Draw a relationship diagram for one person and two merchants.","How should a merchant view customer information?","Only records authorized for its own tenant.","All historical data across the platform.","A shared export from unrelated businesses.","Every record with the same phone number."),
      T("Create a clean client record","Capture only necessary contact information and verify duplicates through approved matching workflows.","Write a minimum data checklist for onboarding a customer.","What is the right approach to duplicate records?","Review and link with an authorized identity workflow.","Delete every matching record immediately.","Merge people on first-name similarity.","Publish contact data in comments."),
      T("Organize the relationship","Use assigned owners, brands, notes and a clear status history. Sensitive customer details require access control.","Create a fictional client profile with assigned owner and activity log.","What should a client activity log contain?","Relevant dated actions and responsible owners.","Passwords and API secrets.","Private notes from another business.","Unconfirmed marketing claims."),
      T("Build thoughtful follow-ups","Agree on next steps, communication preferences and consent before contacting a lead.","Draft a follow-up sequence with opt-out handling.","What makes a responsible follow-up?","A relevant message consistent with consent and preferences.","Unlimited daily unsolicited texts.","Sharing the contact list with partners.","Ignoring a withdrawal of consent."),
      T("Review CRM results","Measure response time, qualified opportunities and customer satisfaction in context.","Create a weekly CRM scorecard with definitions and owners.","Which CRM measure is most actionable?","Qualified outcomes and follow-up completion.","The raw count of imported names.","A fabricated satisfaction score.","The size of hidden data exports.")
    ]
  },
  {
    slug:"business-brands",title:"Brand & Business Workspace Management",category:"Platform & Operations",description:"Set up business identities, locations, teams and brand assets safely.",outcome:"Prepare a consistent and access-controlled business workspace.",dashboardPath:"/dashboard/brands",icon:"◩",accent:"violet",
    topics:[
      T("Map company and brand","A client can operate multiple brands; a brand is not a new master user identity.","Draw the client-to-brand hierarchy for a fictional company.","How do multiple brands relate to the platform?","They belong to authorized client workspaces.","Each becomes an unrelated master customer database.","Every team member sees all brands by default.","All brands must share one login."),
      T("Define brand identity","Record official names, voice, service areas and visual asset ownership. Use approved TAKATAK identity standards.","Prepare a one-page brand brief with voice and asset rules.","How should official logos be used?","Use approved assets without redrawing or distorting them.","Invent a similar mark from memory.","Stretch the logo to fit any container.","Replace verified branding with stock imagery."),
      T("Assign collaborators","Least privilege means each team member gets only necessary access for their responsibilities.","Create a fictional role matrix for owner, editor and viewer.","What principle guides access assignment?","Least privilege with auditable role changes.","Administrator access for everyone.","Access controlled only in the browser.","Shared team passwords."),
      T("Manage locations accurately","Physical locations and service areas must be factual and distinct from brand headquarters.","Audit addresses, hours and service territories for two locations.","What is best for location data?","Use verified facts and update changes consistently.","Invent local addresses for SEO.","Reuse unrelated phone numbers.","Hide closed locations without documentation."),
      T("Launch review and handoff","Before publishing, verify brand assets, authorized members, contact details and linked services.","Produce a brand workspace launch checklist.","What should happen before going live?","A documented permissions and identity review.","Assume external services are connected.","Skip consent reviews.","Give all vendors permanent admin access.")
    ]
  },
  {
    slug:"ads-manager",title:"TAKATAK ADS & Campaign Management",category:"Marketing & Growth",description:"Build responsible local advertising campaigns with budgets, creatives and attribution.",outcome:"Present a measurable campaign brief and placement strategy.",dashboardPath:"/dashboard/advertising",icon:"◉",accent:"blue",
    topics:[
      T("Set a campaign objective","Distinguish awareness, qualified traffic, booked leads and completed purchases. Choose an objective before placements.","Write one SMART outcome and primary conversion event.","What comes before ad creative selection?","A measurable business objective and audience.","A guaranteed return on spend.","Buying every available impression.","Copying a competitor's statistics."),
      T("Choose placements and targeting","Use authorized local segments, contextual relevance and frequency limits while respecting privacy.","Outline two appropriate placements and their audience constraints.","What is responsible targeting?","Relevant lawful audiences with clear privacy constraints.","Targeting sensitive traits without consent.","Excluding regions at random.","Assuming every impression is a unique person."),
      T("Create trustworthy ads","Creative and landing pages must describe real products, verified prices and available services.","Write an ad and landing-page checklist with disclosures.","What should match between an ad and landing page?","The actual offer, terms and call to action.","Only the brand's favorite colors.","An invented testimonial.","An unverified discount."),
      T("Budget and launch controls","Set total spend limits, approvals, creative checks and failure monitoring before activation.","Calculate a sample budget split and set an approval gate.","What prevents accidental overspend?","Explicit budgets and operational controls.","Allowing uncapped automatic bidding.","Ignoring payment events.","Removing human approval."),
      T("Measure outcomes","Review conversions, qualified leads and incremental evidence; do not equate clicks with sales.","Draft a campaign report with caveats and next experiment.","What indicates meaningful campaign performance?","Verified business outcomes against cost and baseline.","Only high impression counts.","Any graphic labelled successful.","A promise of 80% improvement without evidence.")
    ]
  },
  {
    slug:"reputation-reviews",title:"Reputation, Reviews & Customer Trust",category:"Marketing & Growth",description:"Monitor feedback, reply professionally and improve service quality.",outcome:"Run a transparent, privacy-aware customer feedback program.",dashboardPath:"/dashboard/growth/reviews",icon:"☆",accent:"cyan",
    topics:[
      T("Listen across channels","Identify review sources and distinguish actual feedback from spam or duplicates.","Create a review channel inventory with responsibilities.","How should incoming reviews be assessed?","Validate source, context and authenticity.","Remove all negative reviews.","Assume every five-star review is genuine.","Publish unverified customer identities."),
      T("Ask for fair feedback","Requests must follow platform rules and should not pressure clients toward a particular rating.","Draft a neutral post-service feedback request.","Which review invitation is appropriate?","Ask all eligible customers for honest feedback.","Offer gifts only for five stars.","Block dissatisfied customers from reviewing.","Write reviews on behalf of customers."),
      T("Respond without exposure","Acknowledge the issue, avoid personal records in public replies and route specific cases privately.","Write replies for praise, delay and disputed charge scenarios.","How do you handle a complaint containing private data?","Respond generally and move account specifics to secure support.","Post the customer's invoice publicly.","Argue using private contact history.","Ignore privacy rules."),
      T("Escalation and service recovery","Route complex situations to an authorized owner and maintain a resolution timeline.","Map a review-to-ticket escalation workflow.","What is an effective escalation?","Assign an owner, time frame and documented follow-up.","Ask a bot to promise a refund automatically.","Delete the original conversation.","Transfer the ticket without context."),
      T("Improve using themes","Analyze recurring pain points alongside volume and time period; avoid treating sentiment alone as truth.","Write a monthly insight summary and corrective action.","What proves review management is improving service?","Documented recurring-issue fixes and customer outcomes.","Purchased positive reviews.","Only a larger review count.","An AI-generated rating without source.")
    ]
  },
  {
    slug:"lead-pipelines",title:"FLEXS Lead Pipeline & Sales Follow-up",category:"Sales & Customer Success",description:"Qualify leads, manage stages and build consistent sales follow-up workflows.",outcome:"Operate a measurable and respectful sales pipeline.",dashboardPath:"/dashboard/leads/pipeline",icon:"➜",accent:"violet",
    topics:[
      T("Identify a qualified lead","Separate anonymous interest from consented contact and a relevant sales opportunity.","Define three qualification criteria for your service.","What makes a lead qualified?","Demonstrated fit, need and a lawful way to follow up.","Every website visitor automatically.","Any scraped email address.","A duplicate imported record."),
      T("Define pipeline stages","Use consistent stage definitions: new, contacted, qualified, proposal and won/lost.","Write entry and exit rules for five pipeline stages.","Why define stages clearly?","So team members classify opportunities consistently.","To increase pipeline counts artificially.","To avoid keeping contact history.","To bypass owner assignment."),
      T("Assign and schedule work","Each actionable lead needs an owner, next action and deadline. Respect contact preferences.","Build a lead follow-up SLA with handoff rules.","What should each open opportunity contain?","An owner, next step and expected follow-up time.","Only a high estimated price.","An unverified promise of a sale.","Several conflicting owners."),
      T("Prepare proposals","Tie the proposal to verified needs and clear pricing; track response and change requests.","Write a brief proposal with scope, exclusions and expiration.","What makes a proposal trustworthy?","Explicit scope, terms and evidence.","Omitted cancellation terms.","Unapproved discounts.","Made-up conversion guarantees."),
      T("Analyze conversion","Measure stage transitions, cycle time and qualified win rates, excluding duplicates.","Create a funnel report with five conversion stages.","What is a useful pipeline metric?","Stage-to-stage conversion on defined qualified leads.","Counting a duplicate as a new sale.","A screenshot of an unfiltered chart.","The total number of visits alone.")
    ]
  },
  {
    slug:"ai-studio-creative",title:"AI Studio: Content & Campaign Creation",category:"AI & Productivity",description:"Learn prompts, brand voice, creative briefs and a review-first publication flow.",outcome:"Produce a usable campaign content package with human approval.",dashboardPath:"/dashboard/ai-studio",icon:"✧",accent:"blue",
    topics:[
      T("Brief the creative assistant","Specify audience, goals, channel and brand voice while excluding personal secrets.","Write a creative brief with voice, desired outcome and boundaries.","What creates a better AI brief?","Specific audience, task, constraints and examples.","A vague request with no context.","Customer access credentials.","An instruction to invent facts."),
      T("Draft channel-specific content","Adapt hooks, copy length, accessibility and call to action to each social platform.","Write two platform-specific versions of one real offer.","What is the correct use of AI captions?","Draft, fact-check and adapt to platform requirements.","Publish without reading.","Include fabricated awards.","Ignore copyrighted materials."),
      T("Build a campaign story","Sequence awareness, proof, objection handling and conversion rather than repeating one claim.","Plan a four-post campaign sequence with a CTA.","How should a multi-post campaign be structured?","A coherent sequence matched to the audience journey.","Four unrelated product claims.","Identical posts on every channel without review.","Unverified customer results."),
      T("Approve before publishing","Run human checks for brand, law, consent, claims and accessibility before sending content.","Create an editorial approval checklist and roles.","What is required before an AI draft goes live?","Authorized human review and approval.","A high language-model confidence score.","A direct prompt-to-post shortcut.","No audit trail."),
      T("Measure and iterate","Compare approved experiments to objectives and capture learnings in the next brief.","Prepare a retrospective using reach and confirmed conversions.","How should results guide the next AI draft?","Use validated performance data and controlled changes.","Assume engagement always means sales.","Claim success without measurements.","Copy another tenant's campaign.")
    ]
  },
  {
    slug:"business-analytics",title:"Business Analytics & Growth Hub",category:"Analytics & Reporting",description:"Understand dashboards, baselines, attribution and responsible experimentation.",outcome:"Create a decision-ready business performance scorecard.",dashboardPath:"/dashboard/growth/analytics",icon:"▥",accent:"cyan",
    topics:[
      T("Choose decision metrics","Separate vanity metrics from outcomes aligned to your business objective.","Define three KPIs and their owners.","What should determine the KPIs?","A specific decision and desired business outcome.","Whatever appears largest on a chart.","The metric with the best colors.","An unverified industry benchmark."),
      T("Validate data sources","Document source, time zone, attribution window and data freshness before comparing values.","Create a data dictionary for three dashboard metrics.","What must be checked before combining two reports?","Definitions, date ranges and source quality.","Only whether the graphs look similar.","Whether their titles match.","The number of screenshots."),
      T("Read trends responsibly","Separate seasonality, missing data and potential causal explanations from confirmed results.","Annotate a sample graph with three possible confounders.","Does correlation prove causation?","No, alternate explanations must be considered.","Yes, whenever values rise together.","Only if the graph is monthly.","Only if AI wrote the summary."),
      T("Run a measured experiment","Set one hypothesis, a baseline and a stopping rule before changing campaigns.","Design a small A/B test with a success metric.","What makes an experiment useful?","A defined hypothesis and observable comparison.","Changing five variables simultaneously.","Reporting only the winning day.","Stopping as soon as a result looks favorable."),
      T("Turn reports into action","Translate movement into owned follow-ups and documented decisions.","Build a weekly insight-to-action meeting agenda.","What is the final purpose of business analytics?","Make better decisions and verify their outcomes.","Produce more charts.","Replace human judgment entirely.","Hide inconvenient results.")
    ]
  },
  {
    slug:"report-builder",title:"Reports, Dashboards & Client Insights",category:"Analytics & Reporting",description:"Build accurate client reports, templates and executive narratives.",outcome:"Deliver a repeatable report that readers can act on.",dashboardPath:"/dashboard/reports/builder",icon:"▤",accent:"violet",
    topics:[
      T("Plan a report","Identify reader, question, scope, period and trusted data owners before designing charts.","Write a report brief for a monthly client update.","What should a report outline start with?","The audience, decision and period.","An attractive chart without a source.","Every metric available.","Copied benchmark claims."),
      T("Select reliable metrics","Ensure that metrics have names, units, definitions and comparable date ranges.","Create a glossary for six common client KPIs.","What avoids misleading comparisons?","Consistent definitions and aligned time periods.","Changing the denominator each month.","Mixing currencies without disclosure.","Removing zero-value months."),
      T("Explain performance","Separate facts, hypotheses and next steps. Disclose missing data and limitations.","Write a 100-word summary with one uncertainty.","What belongs in an executive summary?","Verified outcomes, important context and recommended actions.","Invented improvements.","Private client identifiers.","Statements with no dates."),
      T("Publish and share safely","Use role checks, client scoping and authorized destinations for generated reports.","Create a secure sharing checklist.","Who should access a client report?","Only authenticated and authorized recipients.","Anyone guessing the URL.","Every tenant in the platform.","Anyone with a social post link."),
      T("Schedule follow-through","Set review cadence and action owners so reports have business value.","Design a monthly reporting calendar and action register.","What is a successful reporting cycle?","A report followed by accountable decisions.","An automated PDF sent to everyone.","A permanently static dashboard.","No review of failed deliveries.")
    ]
  },
  {
    slug:"retargeting-geo",title:"Audiences, Retargeting & Geo Strategy",category:"Marketing & Growth",description:"Learn audience segments, geographic campaigns and privacy-first measurement.",outcome:"Draft a lawful segment and retargeting plan.",dashboardPath:"/dashboard/growth/audiences",icon:"◎",accent:"cyan",
    topics:[
      T("Define a useful audience","Start with customer needs and the purpose of the communication; do not assume all data can be repurposed.","Write a first-party audience definition and its purpose.","What is a legitimate audience foundation?","A defined purpose with lawful data use.","An undisclosed purchased contact list.","Sensitive traits inferred without a basis.","Another tenant's customer export."),
      T("Segment by context","Combine contextual and geographic relevance with minimum necessary granularity.","Design segments for two genuine service regions.","What makes geo segmentation appropriate?","Accurate serviced regions and proportionate targeting.","Invented locations.","Precise tracking without consent.","Assuming everyone in a ZIP code has identical interests."),
      T("Build retargeting rules","Respect consent choices, frequency limits and user suppression after conversion.","Write a retargeting frequency and exclusion policy.","Which retargeting safeguard matters?","Consent, frequency caps and opt-out handling.","Unlimited ad repetition.","Including opted-out customers.","Ignoring converted audiences."),
      T("Protect customer privacy","Use documented retention limits and permitted platform integrations.","Draft a data lifecycle for an audience sync.","What should happen to expired audience data?","Remove or refresh it under retention policy.","Keep it indefinitely by default.","Move it to a public spreadsheet.","Share it with unrelated brands."),
      T("Measure incremental value","Compare to baseline and account for attribution overlap across channels.","Plan an incremental-lift evaluation.","What is stronger than last-click counts alone?","Controlled or carefully contextualized incrementality analysis.","A promise every impression caused a sale.","Only counting clicks.","A vanity audience-size estimate.")
    ]
  },
  {
    slug:"integrations-connectors",title:"Connectors, Integrations & Secure APIs",category:"Technology & Infrastructure",description:"Connect services safely using API scopes, webhooks and retries.",outcome:"Design a reliable and auditable service integration.",dashboardPath:"/dashboard/integrations",icon:"⌘",accent:"blue",
    topics:[
      T("Understand integration boundaries","APIs exchange structured data through approved permissions. TAKATAK-V1 owns shared business identity.","Map a source system, integration adapter and destination.","How should a new provider be integrated?","Through a scoped adapter with clear contracts.","Direct database access to every tenant.","A shared hardcoded admin key.","Browser-side secrets."),
      T("OAuth and consent","OAuth grants specific scopes and requires verified redirect and state handling.","Write an OAuth authorization flow checklist.","What should OAuth callbacks verify?","Expected state, redirect settings and authorized scopes.","Only the user's display name.","Any callback URL in a query string.","An unverified public token."),
      T("Handle webhooks and events","Verify signatures, treat events as potentially duplicated and process them idempotently.","Outline a payment-status webhook consumer without storing secrets.","What protects webhook processing?","Signature verification and idempotent event handling.","Trusting all incoming POST bodies.","Assuming events are always ordered.","Running every event twice."),
      T("Recover from errors","Define retries, dead-letter handling and observable job states without masking failures.","Build a retry policy for a failed provider request.","What should retries avoid?","Duplicate side effects and endless unbounded attempts.","Logging failures.","Using exponential backoff.","Displaying honest connection status."),
      T("Audit and retire access","Rotate credentials, review access and handle disconnected or expired accounts.","Create a quarterly integration access review checklist.","How should unused credentials be handled?","Revoke or rotate them with recorded ownership.","Publish them in documentation.","Share them over chat.","Leave all scopes active forever.")
    ]
  },
  {
    slug:"domains-dns-security",title:"DNS, Domains, SSL & Website Security",category:"Technology & Infrastructure",description:"Understand web records, HTTPS, renewals, backups and incident readiness.",outcome:"Prepare a safe and repeatable website operations plan.",dashboardPath:"/dashboard/web-hosting/domains",icon:"◌",accent:"violet",
    topics:[
      T("Own your domain","Registrar ownership, MFA and renewals are essential operational controls.","Create an owner and renewal inventory for three sample domains.","What is most important in domain ownership?","Verified registrant control and renewal protection.","A screenshot of the homepage.","Free use of somebody else's account.","Removing account recovery."),
      T("Understand DNS records","A/AAAA, CNAME, MX and TXT records serve different purposes; TTL affects caching.","Build a sample DNS plan for web and mail.","Which record commonly routes email delivery?","MX.","CNAME for every case.","A blank TXT record.","Any arbitrary A record."),
      T("Secure HTTPS","Certificates validate a secure TLS connection for covered hostnames. Monitor expiration and origin configuration.","Write a certificate renewal and verification checklist.","Does HTTPS alone prove the company is trustworthy?","No, it protects transport but does not verify every business claim.","Yes, it proves all content is factual.","Yes, it guarantees secure backups.","It prevents all phishing."),
      T("Back up and restore","A backup policy is only useful if periodic restore tests succeed.","Plan a restore drill with a recovery objective.","What confirms a usable backup?","A successful tested restore.","An unchecked backup icon.","A backup on the same disk only.","A verbal promise of retention."),
      T("Respond to incidents","Document detection, access revocation, recovery and communications responsibilities.","Design a website outage response checklist.","What should happen after an incident?","Contain, recover, communicate and review the cause.","Delete all incident logs.","Ignore affected users.","Assume DNS propagation fixes every problem.")
    ]
  },
  {
    slug:"hosting-operations",title:"Hosting, Servers & Managed Infrastructure",category:"Technology & Infrastructure",description:"Manage hosting plans, servers, deployments and service health.",outcome:"Operate a monitored hosting service with documented recovery.",dashboardPath:"/dashboard/hosting",icon:"▧",accent:"cyan",
    topics:[
      T("Choose hosting correctly","Compare workload requirements, resource limits, service levels and support models.","Prepare a sizing worksheet for a small website.","What determines a hosting plan?","Verified application workload and operational constraints.","The most expensive plan automatically.","An ad claiming unlimited performance.","A competitor's logo."),
      T("Understand the server","Differentiate container applications, file hosting, databases and reverse proxies.","Draw the application-to-database dependency path.","What should remain private on the server?","Credentials and internal database endpoints.","Public marketing images.","Published sitemap URLs.","Read-only press releases."),
      T("Prepare deployment","Build in CI when production servers have limited resources; verify artifacts and runtime configuration.","Create a build-and-release checklist.","What is safer than building heavy apps on a limited host?","Build in CI and deploy verified artifacts.","Run unlimited builds directly in production.","Commit .env secrets.","Disable release checks."),
      T("Monitor availability","Health checks should confirm meaningful runtime behavior, not only an HTTP response with generic text.","Write an availability and alert checklist.","What does a failing readiness check mean?","Do not mark the release healthy until dependencies are assessed.","Deployment must have succeeded.","All paid subscriptions are active.","A user should ignore the warning."),
      T("Plan recovery","Rollback, backup restoration and incident ownership are required before a significant update.","Practice a written deployment rollback scenario.","What is a necessary recovery control?","A documented, tested rollback route.","Deleting the previous deployment instantly.","No backup verification.","Only browser refreshes.")
    ]
  },
  {
    slug:"business-email",title:"Business Email & Communications",category:"Technology & Infrastructure",description:"Configure professional email, authenticity records and reliable customer communication.",outcome:"Design a trustworthy domain email setup and communication policy.",dashboardPath:"/dashboard/hosting/email",icon:"✉",accent:"blue",
    topics:[
      T("Choose a business mailbox","Plan roles, aliases, ownership and retention before setting up accounts.","Design a mailbox structure for a five-person business.","What is a good shared-mailbox policy?","Named roles, access owners and offboarding procedures.","One public shared password.","Unlimited permanent ex-employee access.","No recovery contact."),
      T("Understand mail DNS","MX routes inbound mail while SPF, DKIM and DMARC help authenticate outbound mail.","Draft a verification checklist for mail DNS.","Which record describes a domain's outbound sender policy?","SPF.","An image file.","A browser cookie.","A CNAME used for every mailbox."),
      T("Write helpful customer email","Subject clarity, consent, accessible layout and truthful offers build trust.","Write a welcome email and service announcement.","What should commercial email respect?","Applicable consent and unsubscribe requirements.","Purchased mailing lists without checks.","Hidden sender identity.","Misleading subject lines."),
      T("Handle delivery problems","Differentiate bounce, suppression, provider outage and user preference changes.","Create a troubleshooting flow for non-delivery.","How should repeated hard bounces be handled?","Suppress and investigate the invalid address.","Retry constantly forever.","Change the recipient without consent.","Conceal the failure."),
      T("Protect mailbox access","Use MFA, delegated roles and secure recovery; monitor suspicious sign-ins.","Create a mailbox security checklist.","What is a core mailbox safeguard?","MFA with controlled recovery and least privilege.","Sharing recovery codes publicly.","Disabling audit activity.","Putting SMTP passwords in source code.")
    ]
  },
  {
    slug:"billing-invoices",title:"Customer Billing, Invoices & Subscriptions",category:"Business & Finance",description:"Learn invoicing, recurring plans, payment status and customer-friendly billing support.",outcome:"Document a transparent billing lifecycle with controlled access.",dashboardPath:"/dashboard/client-billing",icon:"◇",accent:"violet",
    topics:[
      T("Set clear product terms","Describe price, currency, tax treatment and service delivery without ambiguity.","Build a sample invoice and plain-language plan summary.","What should a billing quote include?","Clear scope, currency, pricing and applicable taxes.","Unstated mandatory fees.","An imaginary discount.","Conflicting renewal dates."),
      T("Understand subscription states","Differentiate trial, active, past due, cancelled and expired; only trusted payment events activate entitlements.","Draw a recurring subscription state diagram.","When may paid access be issued?","After verified entitlement rules and confirmed billing state.","When a query string says paid=true.","When the browser shows a checkout success page.","Whenever a customer uploads a screenshot."),
      T("Process payments safely","Tokenized payment providers manage sensitive card collection; do not store raw card details.","Write a secure payment flow checklist.","Where should card data be entered?","An approved payment provider's secure flow.","A free-text support ticket.","A public spreadsheet.","An unencrypted database field."),
      T("Handle corrections and refunds","Audit credits, refunds and account changes while preventing duplicate billing.","Document a refund request lifecycle.","What should a refund update?","Verified payment state and related entitlement where required.","Only the button color.","An unrelated client's invoice.","The customer name in a public URL."),
      T("Reconcile and communicate","Compare provider records, invoices and service entitlements; flag exceptions for review.","Create a monthly billing reconciliation list.","What is responsible reconciliation?","Match evidence across invoice, provider event and service state.","Assume every pending charge succeeded.","Change bank details without verification.","Ignore failed webhooks.")
    ]
  },
  {
    slug:"customer-support",title:"Support Desk, Tickets & Service Recovery",category:"Sales & Customer Success",description:"Handle requests with clear intake, priorities, knowledge and escalation.",outcome:"Run an accountable support workflow from first response to resolution.",dashboardPath:"/dashboard/support",icon:"☏",accent:"cyan",
    topics:[
      T("Receive a useful ticket","Collect the minimum necessary issue, contact route and business impact.","Design a secure issue-intake form.","What belongs in a support ticket?","Problem details, impact and safe contact information.","Complete payment card numbers.","Passwords and login tokens.","Other customers' unrelated records."),
      T("Set priority and ownership","Define urgency from impact, not from message volume, and assign an owner.","Write a support priority matrix for four cases.","What makes prioritization fair?","Consistent impact and urgency criteria.","Always choosing the loudest message.","Guessing the customer's identity.","Ignoring outages."),
      T("Respond clearly","Confirm the issue, explain the next step, and set realistic expectations without false guarantees.","Write an initial response for a service interruption.","What is a good first response?","Acknowledge, clarify ownership and set the next action.","Promise a solution without evidence.","Send account secrets over email.","Mark resolved without checking."),
      T("Escalate responsibly","Move complex technical or billing cases to authorized specialists with a complete history.","Prepare a handoff note template.","What should an escalation include?","Verified context, prior attempts and a responsible owner.","Only 'please fix'.","An unrelated customer record.","Unconfirmed production access."),
      T("Learn from recurring requests","Turn solved issues into reviewed documentation and measure actual resolution quality.","Draft a knowledge article from a fictional resolved ticket.","How does support improve over time?","Use resolved cases to correct root causes and guidance.","Hide repeated failures.","Automatically delete critical reports.","Replace verification with an AI guess.")
    ]
  },
  {
    slug:"teams-permissions",title:"Teams, Roles & Account Security",category:"Platform & Operations",description:"Onboard team members and control access to TAKATAK services safely.",outcome:"Build a least-privilege team access plan.",dashboardPath:"/dashboard/team",icon:"♙",accent:"blue",
    topics:[
      T("Understand roles","Platform administrators, client managers and viewers have distinct scopes.","Create a role matrix for four team functions.","Which role model is safest?","Least privilege aligned to each person's tasks.","Owner rights for every teammate.","A single shared account.","Role claims sent from the browser."),
      T("Onboard with verification","Require verified identity and appropriate organization membership before access.","Design a new-hire access request checklist.","What should precede granting access?","Identity verification and authorized approval.","A forwarded password.","An unsigned chat message.","An unverified email domain."),
      T("Keep tenants separated","Membership and service entitlements must be checked server-side for each request.","Map which sample records a second tenant may view.","What enforces tenant separation?","Validated membership and scoped server-side data access.","The color of a sidebar.","Hidden links only.","A browser-supplied client ID alone."),
      T("Review sensitive permissions","Audit ownership changes, high-risk features and third-party access.","Set a quarterly access review schedule.","How should high-privilege roles be managed?","Recorded approvals and periodic audits.","Unlogged permanent access.","Broad default grants.","Ignoring departing staff."),
      T("Handle offboarding","Revoke sessions, tokens and integrations promptly while preserving legitimate records.","Write an offboarding checklist including MFA recovery.","What is necessary when a user leaves?","Revoke access and transfer ownership securely.","Leave shared credentials active.","Delete all client history.","Give them ongoing billing access.")
    ]
  },
  {
    slug:"automation-jobs",title:"Automation, Scheduled Jobs & Notifications",category:"AI & Productivity",description:"Plan reliable background workflows with approvals, retries and monitoring.",outcome:"Design an automation that is safe to operate and recover.",dashboardPath:"/dashboard/jobs",icon:"↻",accent:"violet",
    topics:[
      T("Identify the right trigger","Define event, input, expected result and explicit approval before automating.","Map a customer notification flow from trigger to delivery.","What should every automation begin with?","A defined trigger, ownership and success criteria.","Unbounded actions with no log.","An AI-generated assumption of consent.","A production secret in code."),
      T("Model states and retries","Jobs may queue, run, succeed, fail or retry. Use idempotency to prevent duplicate actions.","Write the state transitions for a report-generation job.","Why is idempotency important?","It prevents duplicate side effects when requests repeat.","It guarantees infinite provider uptime.","It bypasses approvals.","It removes the need for logs."),
      T("Route notification consent","Check recipient, permitted channel, consent and delivery constraints before sending.","Create a preference-aware notification decision table.","When should a marketing message be sent?","Only when allowed by preferences and applicable consent rules.","Whenever a job can be queued.","To every record across all tenants.","With no unsubscribe handling."),
      T("Observe workflow failures","Log safe diagnostic context and raise actionable alerts instead of silently discarding errors.","Prepare an error alert with owner and retry instructions.","What is a helpful failure alert?","A traceable job, error category and next action.","A fake success notification.","Full exposed API tokens.","No time stamp."),
      T("Test before activation","Use staging data and include rollback, kill switch and human signoff for impactful workflows.","Create a go-live automation verification checklist.","What is needed before enabling sensitive automation?","Validation, approval, monitoring and a stop mechanism.","Only a green button.","Publishing immediately after an AI draft.","No test records.")
    ]
  },
  {
    slug:"rentauto-operations",title:"Rentauto Vehicle Rental Operations",category:"Industry Applications",description:"Understand rental availability, reservations, trip handling and customer support.",outcome:"Document a fair and verifiable vehicle rental journey.",dashboardPath:"/dashboard/rentauto",icon:"▰",accent:"cyan",
    topics:[
      T("Map the rental lifecycle","Distinguish search, selection, identity requirements, booking, pickup, return and follow-up.","Draw a seven-stage vehicle rental customer journey.","What must a rental journey make clear?","Eligibility, pricing, availability and terms.","A guaranteed vehicle without checking.","Unpublished fees.","A fake live availability badge."),
      T("Explain rental terms","Present insurance choices, deposits, mileage, fuel and cancellation rules before a booking.","Build a transparent sample rental quote.","What belongs in a rental quote?","Total cost, conditions and applicable options.","Mandatory surprises after checkout.","Unverified insurance promises.","Only a daily base rate."),
      T("Protect booking information","Limit personal identification collection and access to what operations require.","Create a booking-data retention checklist.","What is correct for driving licence data?","Collect only when justified and store it securely.","Include copies in public reports.","Share with all advertisers.","Leave unsecured files in logs."),
      T("Handle pickup and return","Use documented inspection, consented photos and signed condition evidence.","Draft a fair pickup inspection checklist.","How should vehicle condition be recorded?","With a dated, mutually reviewable inspection record.","By guessing after return.","Without informing the renter.","By altering photos secretly."),
      T("Resolve disruptions","Handle breakdowns, late returns and disputes with documented escalation.","Write a delayed-return support scenario.","What helps resolve a rental dispute?","Clear terms and verifiable communications.","An automatic unsupported penalty.","Deletion of the agreement.","A public complaint post.")
    ]
  },
  {
    slug:"ticketing-events",title:"Events, Ticketing & Attendee Experience",category:"Industry Applications",description:"Plan events, ticket sales, entry verification and refunds.",outcome:"Create a secure end-to-end event attendance process.",dashboardPath:"/dashboard/ticketing",icon:"▣",accent:"blue",
    topics:[
      T("Design event inventory","Define dates, capacity, ticket types and accessibility before publishing.","Create a small event capacity and ticket matrix.","What prevents overselling?","Server-verified inventory and atomic allocation.","A count in the browser only.","Unlimited duplicated QR codes.","An untracked spreadsheet."),
      T("Price and disclose clearly","State ticket conditions, tax, restrictions and potential service fees up front.","Build a transparent ticket order summary.","What must be visible before ticket payment?","Real total pricing and relevant policies.","Hidden fees after authorization.","Invented scarcity.","An expired offer presented as live."),
      T("Verify entry securely","A scanned ticket needs server-side redemption and duplication prevention.","Draw a ticket check-in flow with error states.","What should prevent reuse of one ticket?","Server-side one-time redemption.","Trusting a visual QR image alone.","Allowing unlimited re-entry by default.","Publishing check-in access keys."),
      T("Communicate event changes","Provide timely accurate messages for delays, cancellation or venue changes.","Write an event rescheduling communication plan.","What should attendees receive after cancellation?","Accurate remedies and instructions consistent with policy.","A claim no refunds ever apply regardless of law.","No status update.","An unverified new venue."),
      T("Measure event outcomes","Compare attendance, actual sales, support cases and operational incidents.","Create a post-event review template.","Which measure helps improve the next event?","Verified attendance and experience signals.","Raw page views alone.","An invented sellout report.","Unreviewed AI estimates.")
    ]
  },
  {
    slug:"content-moderation",title:"Content Moderation & Community Publishing",category:"Platform & Operations",description:"Review community submissions, handle permissions and publish reliably.",outcome:"Create a transparent and safe content approval process.",dashboardPath:"/dashboard/contributions",icon:"▱",accent:"violet",
    topics:[
      T("Define submission policies","Clarify allowed content, ownership, privacy and evidence of consent before accepting community material.","Draft five moderation rules for brand submissions.","What should govern content acceptance?","Published policy with clear review criteria.","Automatic approval of every upload.","Copying copyrighted media without permission.","Review based solely on follower counts."),
      T("Check media permission","Obtain the necessary rights and special care for images featuring minors or private information.","Create a release and privacy checklist for photos.","What matters when publishing a child's photo?","Appropriate guardian consent and privacy safeguards.","A social-media tag alone guarantees consent.","Assuming public visibility removes privacy rights.","Publishing private location data."),
      T("Review and explain decisions","Separate submitted, approved, rejected and scheduled states with a recorded decision.","Write a moderation decision template.","What makes moderation auditable?","Recorded reason, authorized reviewer and clear status.","Silent content deletion without records.","An unverified automatic approval.","Changing content without attribution."),
      T("Publish across channels","Use provider permissions and safe retry handling, avoiding duplicate public posts.","Design a reviewed publish-and-retry workflow.","What should happen after an API publishing failure?","Log, verify delivery state and retry idempotently.","Send the same post endlessly.","Mark published immediately.","Expose integration tokens."),
      T("Handle appeals and corrections","Allow correction requests and remove dangerous disclosures promptly.","Create a content correction and appeal flow.","What should a fair appeals process provide?","A documented review and correction route.","Automatic rejection of every appeal.","No explanation of outcomes.","Public access to private complaints.")
    ]
  }
];

const categoryIcon = (p:Path) => p.icon;
export const serviceCourses: Course[] = pathways.map((path) => ({
  slug:path.slug, title:path.title, category:path.category,description:path.description,outcome:path.outcome,
  dashboardPath:path.dashboardPath, icon:categoryIcon(path),accent:path.accent,
  level:path.category==="Industry Applications"?"Intermediate":"Beginner", access:"freemium",
  estimatedHours:4,certification:"completion",
  lessons:path.topics.map(([title,teach,task],i)=>({
    slug:`step-${i+1}`,title,duration:18+(i*3),access:i<2?"free":"plus",
    content:[
      teach,
      `In TAKATAK-V1 this subject connects to the ${path.title} workflow. Work only in a permitted client context. First identify the intended user, the evidence needed, and the responsible role before making changes.`,
      `Practice with a fictional example rather than private customer records. Document what you decided, how you would verify success, and what could go wrong. Course outcome: ${path.outcome}`
    ],
    activity:task
  }))
}));

export type AnswerKeyQuestion = { id:string; prompt:string; choices:string[]; correctIndex:number; explanation:string };
export const serviceExams: Record<string,AnswerKeyQuestion[]> = Object.fromEntries(pathways.map(path=>[
  path.slug,path.topics.map(([title,,,question,right,a,b,c],i)=>{
    const distractors=[a,b,c];
    const correctIndex=(i*3+1)%4;
    const choices=[...distractors]; choices.splice(correctIndex,0,right);
    return {id:`q${i+1}`,prompt:question,choices,correctIndex,explanation:`Review “${title}”: ${right}`};
  })
]));
export const serviceDashboardPaths = pathways.map(({slug,dashboardPath})=>({slug,dashboardPath}));
