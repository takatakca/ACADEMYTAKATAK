/**
 * TAKATAK-V1 course coverage snapshot.
 * Source reviewed: takatak-v1/src/lib/dashboard/dashboard-config.ts NAV_SECTIONS (2026-10-15).
 * These are NAVIGATION entries, not claims that provider integrations are activated.
 */
export type DashboardLearningEntry={label:string;href:string;course:string};
export type DashboardLearningSection={title:string;items:DashboardLearningEntry[]};
const section=(title:string,items:[string,string,string][]):DashboardLearningSection=>({
  title,items:items.map(([label,href,course])=>({label,href,course}))
});
export const dashboardLearningMap:DashboardLearningSection[]=[
 section("Your Dashboard & Clients",[
   ["Dashboard overview","/dashboard","dashboard-essentials"],
   ["Clients","/dashboard/clients","crm-clients"],
   ["Businesses & brands","/dashboard/brands","business-brands"],
   ["Locations","/dashboard/locations","business-brands"],
   ["Services","/dashboard/services","dashboard-essentials"]
 ]),
 section("Connected Services & Marketing",[
   ["Web integration","/dashboard/web-hosting","websites"],
   ["Websites","/dashboard/web-hosting/websites","websites"],
   ["Domains","/dashboard/web-hosting/domains","domains-dns-security"],
   ["SSL certificates","/dashboard/web-hosting/ssl","domains-dns-security"],
   ["Hosting","/dashboard/web-hosting/hosting","hosting-operations"],
   ["Social media","/dashboard/social","social"],
   ["TAKATAK ADS","/dashboard/advertising","ads-manager"],
   ["Reviews","/dashboard/local-listings/reviews","reputation-reviews"],
   ["Local listings","/dashboard/local-listings","local-seo"],
   ["Leads","/dashboard/leads","lead-pipelines"],
   ["AI Studio","/dashboard/ai-studio","ai-studio-creative"],
   ["Content moderation","/dashboard/contributions","content-moderation"]
 ]),
 section("Growth Suite",[
   ["Growth hub","/dashboard/growth","business-analytics"],
   ["Growth analytics","/dashboard/growth/analytics","business-analytics"],
   ["Monthly reports","/dashboard/growth/report","report-builder"],
   ["Reputation & reviews","/dashboard/growth/reviews","reputation-reviews"],
   ["Conversations","/dashboard/growth/conversations","customer-support"],
   ["Ads manager","/dashboard/growth/ads-manager","ads-manager"],
   ["Retargeting & geo","/dashboard/growth/audiences","retargeting-geo"],
   ["AI engine & credits","/dashboard/growth/ai-engine","ai-automation"],
   ["Growth connectors","/dashboard/growth/connectors","integrations-connectors"],
   ["Plans & pricing","/dashboard/growth/pricing","billing-invoices"]
 ]),
 section("Industry Services & Infrastructure",[
   ["Rentauto","/dashboard/rentauto","rentauto-operations"],
   ["ALKAO ticketing","/dashboard/ticketing","ticketing-events"],
   ["Hosting overview","/dashboard/hosting","hosting-operations"],
   ["Hosting accounts","/dashboard/hosting/accounts","hosting-operations"],
   ["Hosting servers","/dashboard/hosting/servers","hosting-operations"],
   ["Backups","/dashboard/web-hosting/backups","hosting-operations"],
   ["Business email","/dashboard/hosting/email","business-email"],
   ["Security","/dashboard/web-hosting/security","domains-dns-security"],
   ["Business phone","/dashboard/voip","voip"]
 ]),
 section("SEO & Citations",[
   ["SEO overview","/dashboard/seo","seo-aeo"],
   ["Local citations","/dashboard/local-listings/citations","local-seo"],
   ["Backlinks","/dashboard/seo/backlinks","seo-aeo"],
   ["Keywords","/dashboard/seo/keywords","seo-aeo"]
 ]),
 section("Reports & Service Delivery",[
   ["Analytics reports","/dashboard/reports","report-builder"],
   ["Custom reports","/dashboard/reports/builder","report-builder"],
   ["Invoices","/dashboard/invoices","billing-invoices"],
   ["Bill my customers","/dashboard/client-billing","billing-invoices"],
   ["Files","/dashboard/files","dashboard-essentials"],
   ["Support","/dashboard/support","customer-support"]
 ]),
 section("Settings & Team Operations",[
   ["Account profile","/dashboard/profile","teams-permissions"],
   ["User management","/dashboard/users","teams-permissions"],
   ["Team & permissions","/dashboard/team","teams-permissions"],
   ["Notifications","/dashboard/notifications","automation-jobs"],
   ["Billing & plans","/dashboard/billing","billing-invoices"],
   ["Integrations","/dashboard/integrations","integrations-connectors"],
   ["Jobs","/dashboard/jobs","automation-jobs"],
   ["Activity","/dashboard/activity","dashboard-essentials"],
   ["Admin","/dashboard/admin","teams-permissions"],
   ["Settings","/dashboard/settings","dashboard-essentials"]
 ])
];
export const dashboardMappedScreens=dashboardLearningMap.reduce((total,section)=>total+section.items.length,0);
