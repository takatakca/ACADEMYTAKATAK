import Link from "next/link";
const resources=[
  {title:"SEO starter checklist",desc:"A repeatable page audit for titles, headings, canonicals, indexing and search intent.",course:"seo-aeo"},
  {title:"Local presence checklist",desc:"Review business profiles, opening hours, categories, citations and customer feedback.",course:"local-seo"},
  {title:"Store launch checklist",desc:"Plan product pages, fulfilment, taxes, consumer disclosures and checkout quality.",course:"shopify"},
  {title:"AI workflow safety checklist",desc:"Plan data minimization, approvals, monitoring and incident handling.",course:"ai-automation"},
];
export const metadata={title:"Learning resources"};
export default function Resources(){return <div className="container inner-page"><span className="kicker">RESOURCE CENTER</span><h1>Useful knowledge, made practical.</h1><p className="lead">Start with educational guides and course activities. Connected product audit tools will be added only when their APIs are available.</p>
<div className="resource-grid">{resources.map(r=><div key={r.title} className="panel"><span className="resource-icon">✦</span><h2>{r.title}</h2><p>{r.desc}</p><Link className="text-link" href={"/courses/"+r.course}>Open the academy →</Link></div>)}</div>
<div className="notice">Automated GEO audits, AI search checks, ranking analytics, domain checks and competitive analysis are planned TAKATAK services—not currently active tools on this site.</div></div>}
