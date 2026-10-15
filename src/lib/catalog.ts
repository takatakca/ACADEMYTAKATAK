export type LessonAccess = "free" | "plus" | "purchase";
export type Course = {
  slug: string;
  title: string;
  category: string;
  description: string;
  outcome: string;
  icon: string;
  accent: string;
  level: "Beginner" | "Intermediate" | "Professional";
  access: "free" | "freemium" | "one_time";
  estimatedHours: number;
  certification: "completion" | "none";
  disclaimer?: string;
  lessons: { slug: string; title: string; duration: number; access: LessonAccess; content: string[]; activity: string }[];
};

const lesson = (slug: string, title: string, duration: number, access: LessonAccess, content: string[], activity: string) =>
  ({ slug, title, duration, access, content, activity });

export const courses: Course[] = [
  {
    slug: "seo-aeo", title: "SEO + AEO Academy", category: "Marketing & Growth", icon: "✦",
    accent: "blue", level: "Beginner", access: "free", estimatedHours: 6, certification: "completion",
    description: "Build search visibility across traditional search engines and AI answer experiences.",
    outcome: "Publish a measurable, trustworthy search strategy.",
    lessons: [
      lesson("search-fundamentals","How modern search works",12,"free",[
        "Search engines discover documents, process content and rank results against an intent. AI answer engines retrieve and synthesize information, sometimes citing original sources.",
        "Start by defining the specific people you serve, the questions they ask and the actions you want visitors to take.",
        "A good learning objective is measurable: identify five real search questions relevant to your business."
      ],"Write down five questions your customers ask before buying."),
      lesson("topic-research","Understand intent and topics",15,"free",[
        "Organize queries into informational, comparison, local and transactional intentions. A single landing page should solve one primary need thoroughly.",
        "Read current search results and official documentation rather than copying competitor claims. Track queries and landing pages in Search Console when available."
      ],"Create a topic map with one pillar page and three supporting articles."),
      lesson("technical-foundations","Technical SEO essentials",18,"free",[
        "Maintain descriptive titles, crawlable links, valid canonical URLs, mobile usability and a current sitemap. A robots.txt file is not a privacy boundary.",
        "Use structured data only when it accurately describes visible page content. Test it and repair warnings."
      ],"Audit one page for a title, heading hierarchy, canonical URL and crawlability."),
      lesson("aeo-citations","Earn AI visibility responsibly",18,"free",[
        "Clear factual answers, source transparency and consistent entity information make content easier to verify. No technique can guarantee inclusion in a model response.",
        "Measure a fixed set of prompts over time and manually confirm mentions or citations. Avoid fabricating endorsements."
      ],"Create three concise answers to frequently asked customer questions."),
      lesson("content-clusters","Create a content publishing plan",20,"free",[
        "Build clusters around genuine expertise. Each page should offer examples, limitations and original evidence rather than keyword repetition.",
        "Refresh articles when facts or product terms change. Use internal links to connect logical follow-up questions."
      ],"Draft a four-week editorial calendar with named owners."),
      lesson("authority-links","Earn relevant backlinks",20,"free",[
        "Prefer earned editorial mentions, partnerships and useful resources. Link schemes and undisclosed paid links can undermine search quality.",
        "Measure relevant referral traffic and conversions, not only third-party domain authority scores."
      ],"List five potential partners and one original resource worth citing."),
      lesson("measurement","Track and improve results",18,"free",[
        "Use Search Console impressions and clicks, analytics engagement and CRM conversions. Changes in rankings are not proof of causation.",
        "Review search performance monthly and make one documented change at a time."
      ],"Build a scorecard with baseline, target and review date.")
    ]
  },
  {
    slug:"shopify", title:"Shopify & E-commerce", category:"Commerce", icon:"◈", accent:"violet", level:"Beginner",
    access:"freemium", estimatedHours:5, certification:"completion",
    description:"From your first online store to product discovery, checkout and repeat purchases.",
    outcome:"Plan and improve a conversion-ready storefront.",
    lessons:[
      lesson("store-model","Choose the right storefront model",15,"free",["Define your products, audience, margins, shipping coverage and return policy before building pages.","Compare hosted commerce services and consider recurring fees, transaction costs and integrations."],"Write a one-page store business model."),
      lesson("product-pages","Create useful product pages",18,"free",["Write a specific product title, explain benefits and specifications, and include clear photos, availability and shipping details.","Accessible images and honest reviews help shoppers make informed decisions."],"Draft a product detail page with three real customer questions."),
      lesson("checkout","Build checkout trust",18,"plus",["Make taxes, shipping, return windows and contact options visible before payment. Avoid hidden fees and misleading timers.","Test guest and account checkout flows on mobile and desktop. Limit required fields."],"Map checkout steps and note one source of friction."),
      lesson("shop-seo","Product structured data",18,"plus",["Use canonical product URLs and accurate Product structured data where applicable. Keep price and inventory current.","Group variants carefully so search engines and customers understand options."],"Check one product listing for structured data accuracy."),
      lesson("retention","Retention and lifecycle",20,"plus",["Segment post-purchase messages by consent and activity. Offer useful onboarding and support before upsells.","Measure reorder rate, lifetime value and opt-outs."],"Create a compliant three-message post-purchase sequence.")
    ]
  },
  {
    slug:"local-seo", title:"Local SEO & QMAPS", category:"Marketing & Growth", icon:"⌖", accent:"cyan", level:"Beginner",
    access:"freemium", estimatedHours:4, certification:"completion",
    description:"Help nearby customers discover your business across maps, listings and search.",
    outcome:"Build a practical local visibility checklist.",
    lessons:[
      lesson("local-signals","Understand local discovery",12,"free",["Location relevance, useful business information and genuine reputation signals influence local discovery.","Define your real service area and the types of queries customers use."],"List five searches from within your service area."),
      lesson("business-profiles","Business profile essentials",15,"free",["Keep names, addresses, phone numbers and opening hours consistent across owned channels.","Choose accurate categories and avoid keyword stuffing in business names."],"Audit your business identity across three channels."),
      lesson("citations","Citations and duplicates",20,"plus",["Prioritize authoritative directories and correct duplicate listings; mass submissions often create maintenance problems.","Record listing URLs, ownership and last verified dates."],"Create a citation inventory spreadsheet."),
      lesson("reviews","Review management",20,"plus",["Ask customers for honest reviews without incentives prohibited by platform policies.","Reply professionally and protect sensitive customer information."],"Write three response templates for common review scenarios."),
      lesson("local-pages","Service-area pages",20,"plus",["Create pages only for real serviced locations and provide unique, verifiable local information.","Measure calls and qualified leads rather than ranking screenshots alone."],"Outline one legitimate local landing page.")
    ]
  },
  {
    slug:"websites", title:"Websites, Domains & Hosting", category:"Digital Foundations", icon:"▣", accent:"blue",
    level:"Beginner", access:"freemium", estimatedHours:5, certification:"completion",
    description:"Understand websites, domains, hosting, speed, security and publishing.",
    outcome:"Launch a maintainable and secure web presence.",
    lessons:[
      lesson("web-basics","How websites fit together",12,"free",["A domain points users to a web service; hosting serves code and assets over HTTPS.","Explain the difference between DNS, a certificate and application hosting."],"Diagram a visitor request from browser to website."),
      lesson("domain-choice","Choose and protect a domain",15,"free",["Pick a name that is distinctive and easy to communicate. Keep domain ownership and registrar recovery under your control.","Enable registrar multi-factor authentication and renewal reminders."],"Build a registrar ownership checklist."),
      lesson("publish","Safe publishing workflows",20,"plus",["Use version control and repeatable builds. Store production credentials in deployment secrets, not source code.","Separate deployment validation from database migrations and irreversible changes."],"Write your site release checklist."),
      lesson("performance","Performance and accessibility",18,"plus",["Optimize images, caching and predictable layout. Test keyboard navigation and color contrast.","Monitor real-user performance where available."],"Identify three slow or inaccessible interactions."),
      lesson("backup-security","Maintenance and backups",20,"plus",["Document the rollback path, apply security patches and verify backup restoration periodically.","Restrict access to administrative tools with least privilege."],"Draft a monthly maintenance calendar.")
    ]
  },
  {
    slug:"social", title:"Social Media & TAKATAK Marketing", category:"Marketing & Growth", icon:"◎", accent:"violet",
    level:"Beginner", access:"freemium", estimatedHours:4, certification:"completion",
    description:"Content, community, advertising basics and responsible automation.",
    outcome:"Build a repeatable, measurable social content system.",
    lessons:[
      lesson("goals","Set outcomes before posting",12,"free",["Choose a primary outcome such as awareness, appointment requests or support.","Match each channel to the audience and capacity you actually have."],"Choose one KPI per channel."),
      lesson("calendar","Build a content calendar",15,"free",["Plan helpful themes and repurpose owned content with context.","Respect copyright and obtain consent for identifiable people."],"Write one week of posts."),
      lesson("publishing","Approvals and scheduling",18,"plus",["Use clear roles for drafting, reviewing, approval and publication. Never assume a third-party integration grants permission to post.","Record failed deliveries and retry safely."],"Create a two-person publication approval flow."),
      lesson("campaigns","Understand paid campaigns",20,"plus",["Define budgets, target regions and conversion tracking before publishing ads.","Separate reach from attributable business results."],"Prepare a campaign brief with a maximum budget.")
    ]
  },
  {
    slug:"ai-automation", title:"AI Tools & Business Automation", category:"AI & Productivity", icon:"✧", accent:"cyan",
    level:"Intermediate", access:"freemium", estimatedHours:5, certification:"completion",
    description:"Practical AI workflows, prompting, data privacy and business automations.",
    outcome:"Build a human-reviewed AI-assisted workflow.",
    lessons:[
      lesson("ai-literacy","Where AI helps and fails",15,"free",["Generative models draft and transform information but may invent facts. Validate important output against reliable sources.","Do not paste client secrets or protected records into unapproved tools."],"Classify three tasks as safe, review-required or unsuitable."),
      lesson("prompting","Write useful instructions",15,"free",["Specify the audience, format, constraints and examples. Ask for uncertainty when evidence is incomplete.","Evaluate outputs against criteria rather than perceived fluency."],"Compare two prompts for the same business task."),
      lesson("workflow-design","Design automation with approvals",20,"plus",["Map trigger, input, decision, approval, output and failure path.","Use idempotent event handling so retries do not duplicate customer actions."],"Design a workflow diagram for one repetitive task."),
      lesson("governance","Privacy and access control",20,"plus",["Apply minimum required data access and log decisions without storing unnecessary sensitive content.","Review vendor data retention, contract terms and incident response obligations."],"Write an AI workflow risk checklist.")
    ]
  },
  {
    slug:"travel-agent", title:"Travel Advisor Professional", category:"Professional Careers", icon:"✈", accent:"orange",
    level:"Professional", access:"one_time", estimatedHours:12, certification:"completion",
    description:"Travel planning, supplier processes, customer care and agency operations.",
    outcome:"Practice travel advisor skills through realistic client scenarios.",
    disclaimer:"Academy completion does not grant a government-issued travel agency or travel counsellor licence, industry accreditation or authorization to sell travel. Applicable Québec/Canadian legal and professional requirements must be verified with the responsible regulator before launch. Any licensing claim requires approved curriculum and eligibility review.",
    lessons:[
      lesson("industry","Understand the travel industry",18,"free",["Travel advisors coordinate client needs, suppliers, bookings and support. Roles and licensing rules vary by jurisdiction.","Distinguish agency licensing, individual certification and supplier credentials."],"Create a glossary of agency and supplier roles."),
      lesson("client-discovery","Discover traveller requirements",20,"free",["Ask about destination, dates, mobility, budget, insurance and cancellation flexibility with consent.","Avoid collecting passport or payment details before there is a secure operational need."],"Draft a client intake questionnaire."),
      lesson("travel-regulation","Know your legal duties",40,"purchase",["Identify your jurisdiction and consult current official regulator guidance for licensing, consumer protection and disclosures.","Never promise that this course itself provides legal authorization to act as an advisor."],"Build a regulator-sourced compliance checklist."),
      lesson("itineraries","Build a responsible itinerary",35,"purchase",["Confirm transport connections, border documentation requirements and accessibility needs using primary sources.","Provide clear contingency plans and disclose limitations of price estimates."],"Prepare a seven-day itinerary with two alternatives."),
      lesson("pricing","Quotes and supplier terms",35,"purchase",["Document total cost, currency, fees, change rules and refund conditions. Do not conceal compensation arrangements.","Use supplier contracts and current availability before issuing a quote."],"Create an itemized mock quote and cancellation summary."),
      lesson("service","Manage bookings and disruptions",30,"purchase",["Build checklists for confirmation, traveller communication, delays and escalation.","Protect customer records and track every material supplier change."],"Resolve a simulated delayed flight and hotel rebooking.")
    ]
  },
  {
    slug:"voip", title:"Business Phone & Customer Experience", category:"Digital Foundations", icon:"☎", accent:"blue",
    level:"Intermediate", access:"freemium", estimatedHours:4, certification:"completion",
    description:"Phone systems, virtual numbers, call flows, customer consent and support.",
    outcome:"Design a responsible inbound call experience.",
    lessons:[
      lesson("phone-systems","What a business phone system does",15,"free",["Compare phone numbers, routing, voicemail, IVR and team handoff.","Account for carrier capabilities and number portability constraints."],"Sketch the path for an incoming customer call."),
      lesson("call-routing","Design office hours and routing",15,"free",["Create clear open/closed greetings, fallback handling and emergency instructions.","Keep routing simple for customers and staff."],"Write a business-hours call script."),
      lesson("consent","Recording, consent and privacy",20,"plus",["Follow applicable consent and retention rules. Do not assume every jurisdiction permits the same call recording defaults.","Restrict access to recordings and protect customer information."],"Draft a consent and retention checklist."),
      lesson("analytics","Measure call outcomes",18,"plus",["Track unanswered calls and customer resolutions, not merely call volume.","Review reliability, abandon rate and follow-up procedures."],"Define three meaningful service metrics.")
    ]
  }
];
export const getCourse = (slug: string) => courses.find((course) => course.slug === slug);
export const getLesson = (course: Course, slug: string) => course.lessons.find((item) => item.slug === slug);
export const categories = [...new Set(courses.map((course) => course.category))];
