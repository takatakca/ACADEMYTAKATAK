import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/catalog";
import { canReadLesson, accessLabel } from "@/lib/access";
import { currentIdentity } from "@/lib/session";
import { readProgress } from "@/lib/progress";

type Props = { params: Promise<{slug:string}> };
export async function generateMetadata({params}:Props): Promise<Metadata> {
  const {slug}=await params; const course=getCourse(slug);
  return {title:course?.title || "Course not found", description:course?.description, robots:course?undefined:{index:false}};
}
export default async function CoursePage({params}:Props) {
  const {slug}=await params; const course=getCourse(slug); if(!course) notFound();
  const identity=await currentIdentity();
  let completed:string[]=[];
  if(identity) try{completed=await readProgress(identity,slug)}catch{}
  return <div className="container inner-page">
    <div className="breadcrumbs"><Link href="/">Academies</Link><span>/</span><span>{course.category}</span><span>/</span><span>{course.title}</span></div>
    <div className="course-detail-hero">
      <div><span className="eyebrow">{course.level.toUpperCase()} PATH · {course.lessons.length} LESSONS</span>
        <h1>{course.title}</h1><p className="lead">{course.description}</p>
        <div className="course-meta"><span>◷ About {course.estimatedHours} hours</span><span>✦ {course.lessons.length} lessons</span><span>{course.access==="free"?"Free access":course.access==="one_time"?"One-time purchase track":"Free preview + Academy Plus"}</span></div>
        <Link className="btn btn-primary" href={"/courses/"+course.slug+"/"+course.lessons[0].slug}>Start learning →</Link>
      </div><div className={"course-detail-art art-"+course.accent}><span>{course.icon}</span><small>TAKATAK ACADEMY</small></div>
    </div>
    <div className="course-columns"><div><div className="panel outcome"><span className="kicker">WHAT YOU WILL LEARN</span><h2>Your outcome</h2><p>{course.outcome}</p></div>
      {course.disclaimer&&<div className="important-note"><strong>Important professional training information</strong><p>{course.disclaimer}</p></div>}
      <h2 className="lessons-title">Course curriculum <span className="muted">({course.lessons.length} lessons)</span></h2>
      <div className="lesson-list">{course.lessons.map((lesson,index)=>{const allowed=canReadLesson(course,lesson,identity);const done=completed.includes(lesson.slug);return <Link key={lesson.slug} href={"/courses/"+course.slug+"/"+lesson.slug} className="lesson-item">
        <span className={done?"lesson-number done":"lesson-number"}>{done?"✓":String(index+1).padStart(2,"0")}</span><span className="lesson-title"><strong>{lesson.title}</strong><small>{lesson.duration} min · {accessLabel(lesson.access)}</small></span><span className={allowed?"lesson-open":"lesson-locked"}>{allowed?"Read lesson →":"🔒"}</span>
      </Link>})}</div>
      <Link className="assessment-promo" href={"/courses/"+course.slug+"/exam"}><span><small>FINAL ASSESSMENT · 5 QUESTIONS</small><strong>Earn up to 100 course points</strong><em>Finish the lessons, pass with 80%, and add your score to your student transcript.</em></span><span aria-hidden="true">→</span></Link>
    </div><aside className="sidebar-panel"><div className="panel"><span className="kicker">LEARNING ACCESS</span><h3>{course.access==="free"?"Learn for free":course.access==="one_time"?"Specialist training":"A flexible path"}</h3>
      {course.dashboardPath&&<a className="text-link" href={(process.env.NEXT_PUBLIC_TAKATAK_DASHBOARD_URL||"https://takatak.ca/dashboard").replace(/\/dashboard\/?$/, "")+course.dashboardPath}>Explore this module in TAKATAK-V1 ↗</a>}
      <p>{course.access==="free"?"Every lesson in this academy is currently free.":course.access==="one_time"?"Begin with free introductory lessons; advanced training requires a course entitlement from TAKATAK-V1.":"Start with free lessons and continue with an Academy Plus entitlement."}</p>
      <Link className="btn btn-primary full" href={identity?"/account":"/auth/start"}>{identity?"My learning":"Connect your TAKATAK account"}</Link>
      <Link className="text-link centered" href="/pricing">Access options →</Link></div></aside></div>
  </div>;
}
