import { getCourse } from "./catalog";

export type LearningProgram = {
 slug:string; title:string; department:string; description:string; outcome:string;
 icon:string;accent:"blue"|"cyan"|"violet"|"orange";courseSlugs:string[];
};
export const programs:LearningProgram[]=[
 {slug:"digital-business",title:"Digital Business Foundation",department:"Business School",icon:"▦",accent:"blue",
  description:"A practical foundation across the TAKATAK master dashboard, client accounts, brands, websites and business operations.",
  outcome:"Manage a digital business workspace with safe roles, verified records and working web operations.",
  courseSlugs:["dashboard-essentials","crm-clients","business-brands","websites","teams-permissions"]},
 {slug:"marketing-ai",title:"Growth Marketing & AI Professional",department:"Marketing School",icon:"◉",accent:"violet",
  description:"Search, local discovery, advertising, content, audience strategy and responsible AI-powered marketing.",
  outcome:"Deliver an integrated, measurable, responsible marketing strategy.",
  courseSlugs:["seo-aeo","local-seo","social","ads-manager","ai-studio-creative","retargeting-geo","reputation-reviews"]},
 {slug:"sales-success",title:"Sales, CRM & Customer Success",department:"Commerce School",icon:"♧",accent:"cyan",
  description:"Build lead pipelines, nurture relationships, manage reviews, issue bills and resolve customer cases.",
  outcome:"Run a dependable lead-to-customer service journey.",
  courseSlugs:["crm-clients","lead-pipelines","customer-support","reputation-reviews","billing-invoices"]},
 {slug:"it-infrastructure",title:"Web & Infrastructure Specialist",department:"Technology School",icon:"▧",accent:"blue",
  description:"Understand websites, hosting, DNS, secure email, connectivity, integrations and operating reliable systems.",
  outcome:"Design a maintainable and secure small-business infrastructure.",
  courseSlugs:["websites","domains-dns-security","hosting-operations","business-email","integrations-connectors","voip"]},
 {slug:"business-intelligence",title:"Business Intelligence & Automation",department:"Technology School",icon:"▥",accent:"violet",
  description:"Turn operational data into analytics, reports, trustworthy AI workflows and controlled automation.",
  outcome:"Create monitored workflows and decision-ready client reporting.",
  courseSlugs:["business-analytics","report-builder","ai-automation","automation-jobs","integrations-connectors"]},
 {slug:"ecommerce",title:"E-commerce Business Builder",department:"Commerce School",icon:"◈",accent:"cyan",
  description:"Learn product operations, stores, digital promotion, invoicing and retention.",
  outcome:"Plan and operate a trustworthy, measurable commerce business.",
  courseSlugs:["shopify","websites","seo-aeo","ads-manager","billing-invoices"]},
 {slug:"travel-advisor",title:"Travel Advisor Career Path",department:"Professional School",icon:"✈",accent:"orange",
  description:"Develop client discovery, travel itinerary and supplier communication skills with a specialist final course.",
  outcome:"Complete practical travel-planning projects and a course exam, not a government-issued licence.",
  courseSlugs:["dashboard-essentials","crm-clients","customer-support","travel-agent"]},
 {slug:"service-operations",title:"Service & Event Operations",department:"Industry School",icon:"▣",accent:"violet",
  description:"Learn rentals, events, moderation, customer communications and operational support.",
  outcome:"Design safe, accountable service delivery with verified customer outcomes.",
  courseSlugs:["rentauto-operations","ticketing-events","content-moderation","customer-support","business-analytics"]}
];
export function getProgram(slug:string){return programs.find(p=>p.slug===slug);}
export function getProgramCourses(program:LearningProgram){
 return program.courseSlugs.map(slug=>getCourse(slug)).filter((c):c is NonNullable<typeof c>=>Boolean(c));
}
