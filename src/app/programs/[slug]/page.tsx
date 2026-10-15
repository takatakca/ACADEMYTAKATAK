import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgram,getProgramCourses } from "@/lib/programs";
import { currentIdentity } from "@/lib/session";
import { readProgress,progressConfigured } from "@/lib/progress";
import { readExamSummaries } from "@/lib/exam-records";
import { readMyAwards } from "@/lib/awards";
import AwardButton from "@/components/award-button";

type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const p=getProgram(slug);
 return {title:p?`${p.title} | TAKATAK Academy`:"Learning program",description:p?.description,robots:p?undefined:{index:false}};
}
export default async function ProgramPage({params}:Props){
 const {slug}=await params;const program=getProgram(slug);if(!program)notFound();
 const courses=getProgramCourses(program);
 const identity=await currentIdentity();
 let examRows:Awaited<ReturnType<typeof readExamSummaries>>=[];
 if(identity&&progressConfigured())try{examRows=await readExamSummaries(identity);}catch{}
 const details=await Promise.all(courses.map(async course=>{
   let completed:string[]=[];if(identity&&progressConfigured())try{completed=await readProgress(identity,course.slug);}catch{}
   const exam=examRows.find(row=>row.courseSlug===course.slug);
   const finished=course.lessons.every(lesson=>completed.includes(lesson.slug));
   return {course,completed,exam,finished,passed:!!(finished&&exam?.passed)};
 }));
 const points=details.reduce((sum,{exam})=>sum+(exam?.bestPoints||0),0);
 const mastered=details.filter(d=>d.passed).length;
 const completion=details.length>0&&mastered===details.length;
 let award:Awaited<ReturnType<typeof readMyAwards>>[number]|null=null;
 if(identity&&progressConfigured())try{award=(await readMyAwards(identity)).find(row=>row.programSlug===program.slug)??null;}catch{}

 return <div className="container inner-page">
   <div className="breadcrumbs"><Link href="/programs">Programs</Link><span>/</span><span>{program.department}</span><span>/</span><span>{program.title}</span></div>
   <div className="program-heading"><div><span className="eyebrow">{program.department.toUpperCase()} · STRUCTURED LEARNING PATH</span><h1>{program.title}</h1><p>{program.description}</p>
     <div className="assessment-stat-row"><span>{courses.length} courses</span><span>{courses.reduce((n,c)=>n+c.lessons.length,0)} lessons</span><span>{courses.length*100} available exam points</span></div></div>
     <div className={`program-hero-art art-${program.accent}`}><span>{program.icon}</span><small>GROUPE TAKATAK ACADEMY</small></div>
   </div>
   {identity&&<div className="program-meter"><div><strong>{points} earned points</strong><span>{mastered}/{courses.length} courses mastered</span></div><div className="progress-track"><i style={{width:`${Math.round(100*mastered/courses.length)}%`}}/></div>
     {completion?<p className="program-congrats">✓ Program mastery achieved. All lessons completed and all final assessments passed.</p>:<p>Your progress is saved through your TAKATAK account. Finish all lessons and pass every course assessment to complete this learning program.</p>}</div>}
   <div className="section-heading"><div><span className="kicker">RECOMMENDED ORDER</span><h2>Your course roadmap</h2><p>Each stage has lessons, a practice activity and a graded exam. Complete stages at your own pace.</p></div></div>
   <div className="roadmap">{details.map(({course,completed,exam,passed},index)=><div className="roadmap-item" key={course.slug}>
     <div className="roadmap-number">{passed?"✓":String(index+1).padStart(2,"0")}</div>
     <div className="roadmap-detail"><div className="roadmap-top"><span>{course.category}</span><span>{passed?"Mastered":exam?.passed?"Exam passed · lessons pending":"Course "+(index+1)}</span></div>
       <h3><Link href={`/courses/${course.slug}`}>{course.title}</Link></h3><p>{course.description}</p>
       <div className="roadmap-meta"><span>{completed.length}/{course.lessons.length} lessons</span><span>{exam?.bestPoints??0}/100 points</span><span>{course.access==="one_time"?"Specialist purchase":course.access==="free"?"Free course":"Free + Premium"}</span></div>
       <div className="roadmap-links"><Link href={`/courses/${course.slug}`} className="text-link">Open course →</Link><Link href={`/courses/${course.slug}/exam`} className="text-link">Final exam ↗</Link></div>
     </div></div>)}</div>
   {identity&&completion&&(award?.status==="revoked"?<div className="important-note"><strong>Learning record revoked.</strong><p>This record has been revoked; a new award cannot be generated automatically. Contact authorized Academy support.</p></div>:<AwardButton program={program.slug} initialId={award?.status==="active"?award.awardId:null}/>)}
   <section className="panel"><span className="kicker">YOUR LEARNING OUTCOME</span><h2>{program.outcome}</h2><p>Course achievements are educational. Completion does not automatically unlock TAKATAK-V1 customer service privileges, employment, government credentials or independent professional licensing.</p>
     {!identity&&<Link href="/auth/start" className="btn btn-primary">Sign in to track points →</Link>}</section>
 </div>;
}
