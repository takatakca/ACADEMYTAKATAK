import Link from "next/link";
import { getCourse } from "@/lib/catalog";
import { dashboardLearningMap,dashboardMappedScreens } from "@/lib/dashboard-learning-map";

export const metadata={title:"TAKATAK-V1 Service Learning Guide",description:"Find the right Academy course for each TAKATAK-V1 dashboard module and service."};
export default function DashboardLearningGuide(){
  const dashboard=(process.env.NEXT_PUBLIC_TAKATAK_DASHBOARD_URL||"https://takatak.ca/dashboard").replace(/\/dashboard\/?$/,"");
  return <div className="container inner-page">
    <div className="centered-heading"><span className="eyebrow">LEARN EVERY TAKATAK TOOL</span>
      <h1>Your dashboard. <span className="gradient-text">Your classroom.</span></h1>
      <p>We mapped {dashboardMappedScreens} navigation screens across TAKATAK-V1 to the training that helps you use them. Choose a service, then learn the fundamentals and take its related assessment.</p>
      <Link href="/programs" className="btn btn-primary">Explore full learning programs →</Link></div>
    <nav className="guide-categories" aria-label="Jump to a learning department">{dashboardLearningMap.map((s,i)=><a key={s.title} href={`#module-${i}`}>{s.title}</a>)}</nav>
    {dashboardLearningMap.map((s,i)=><section key={s.title} id={`module-${i}`} className="learning-guide-section">
      <div className="section-heading"><div><span className="kicker">TAKATAK-V1 DEPARTMENT</span><h2>{s.title}</h2></div><span className="guide-count">{s.items.length} modules</span></div>
      <div className="guide-grid">{s.items.map(item=>{const course=getCourse(item.course);
        return <div key={item.href} className="guide-item"><span className="guide-item-symbol">↗</span>
          <div><h3>{item.label}</h3><p>{course?.title??"Course being prepared"}</p>
          <div className="guide-links"><Link href={`/courses/${item.course}`}>Learn this service →</Link><a href={dashboard+item.href}>Open in TAKATAK-V1 ↗</a></div></div>
        </div>;
      })}</div>
    </section>)}
    <div className="notice account-note">This directory maps documented dashboard navigation and training topics. A linked module may require a separate active TAKATAK-V1 service entitlement or may still be in development; the link does not guarantee access or provider activation.</div>
  </div>;
}
