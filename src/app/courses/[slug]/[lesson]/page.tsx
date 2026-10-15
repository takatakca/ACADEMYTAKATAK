import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getLesson } from "@/lib/catalog";
import { canReadLesson, accessLabel } from "@/lib/access";
import { currentIdentity } from "@/lib/session";
import { readProgress } from "@/lib/progress";
import ProgressButton from "@/components/progress-button";
import WorkbookForm from "@/components/workbook-form";
import { readWorkbook } from "@/lib/workbook";

type Props={params:Promise<{slug:string;lesson:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug,lesson}=await params; const course=getCourse(slug); const entry=course&&getLesson(course,lesson);
  return {title:entry?.title||"Lesson",robots:{index:false,follow:true}};
}
export default async function LessonPage({params}:Props){
  const {slug,lesson:slugLesson}=await params; const course=getCourse(slug); if(!course) notFound();
  const entry=getLesson(course,slugLesson); if(!entry) notFound();
  const identity=await currentIdentity(); const allowed=canReadLesson(course,entry,identity);
  const position=course.lessons.findIndex((item)=>item.slug===entry.slug);
  const previous=course.lessons[position-1],next=course.lessons[position+1];
  let initialWorkbook="";
  if(identity&&allowed)try{initialWorkbook=await readWorkbook(identity,slug,entry.slug)||"";}catch{}
  let completed=false;
  if(identity && allowed) try{completed=(await readProgress(identity,slug)).includes(entry.slug)}catch{}
  return <div className="container inner-page">
    <div className="breadcrumbs"><Link href="/">Academies</Link><span>/</span><Link href={"/courses/"+slug}>{course.title}</Link><span>/</span><span>Lesson {position+1}</span></div>
    <div className="reader-grid"><aside className="reader-sidebar"><h3>Course outline</h3><Link className="reader-course" href={"/courses/"+slug}>← {course.title}</Link>
      <div className="reader-nav">{course.lessons.map((item,i)=><Link key={item.slug} href={"/courses/"+slug+"/"+item.slug} className={item.slug===entry.slug?"reader-nav-item current":"reader-nav-item"}>
        <span>{i+1}.</span><span>{item.title}</span>{!canReadLesson(course,item,identity)&&<span aria-label="Locked">🔒</span>}
      </Link>)}</div></aside>
    <article className="reader-content">
      <div className="lesson-header"><span className="kicker">LESSON {position+1} OF {course.lessons.length} · {entry.duration} MIN</span><h1>{entry.title}</h1><div className="lesson-access"><span className={allowed?"tag tag-free":"tag"}>{allowed?"Available to you":accessLabel(entry.access)}</span></div></div>
      {allowed?<><div className="lesson-copy">{entry.content.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>
        <section className="lesson-activity"><span className="kicker">PRACTICAL ACTIVITY</span><h2>Put it into practice</h2><p>{entry.activity}</p></section>
        {identity?<WorkbookForm course={slug} lesson={entry.slug} initialText={initialWorkbook}/>:<div className="notice workbook-notice">Sign in with TAKATAK to save this practical exercise in your personal workbook. <Link href={"/auth/start?next="+encodeURIComponent("/courses/"+slug+"/"+entry.slug)}>Sign in →</Link></div>}
        <div className="lesson-complete">{identity?<ProgressButton course={slug} lesson={entry.slug} initialCompleted={completed}/>:<div className="notice">Sign in with your TAKATAK account to save lesson completion. <Link href={"/auth/start?next="+encodeURIComponent("/courses/"+slug+"/"+entry.slug)}>Sign in →</Link></div>}</div>
      </>:<section className="locked-panel"><div className="lock-big">🔒</div><span className="kicker">ADVANCED LESSON</span><h2>Continue your journey</h2>
        <p>This lesson is part of {course.access==="one_time"?"the separately purchased professional course":"Academy Plus"}. Content is protected until TAKATAK-V1 confirms your access.</p>
        <Link href={identity?"/pricing":"/auth/start"} className="btn btn-primary">{identity?"Explore access plans":"Sign in to continue"} →</Link>
        <p className="fine-print">Already purchased? Your access will appear here when your TAKATAK account entitlement is active.</p></section>}
      <div className="lesson-pager">{previous?<Link href={"/courses/"+slug+"/"+previous.slug}>← Previous lesson</Link>:<span/>}{next?<Link href={"/courses/"+slug+"/"+next.slug}>Next lesson →</Link>:<Link href={"/courses/"+slug}>Back to curriculum →</Link>}</div>
    </article></div>
  </div>;
}
