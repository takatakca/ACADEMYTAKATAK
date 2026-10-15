import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/catalog";
import { canReadLesson } from "@/lib/access";
import { currentIdentity } from "@/lib/session";
import { readProgress, progressConfigured } from "@/lib/progress";
import { readExamSummaries } from "@/lib/exam-records";
import { getPublicExam } from "@/lib/exams";
import ExamForm from "@/components/exam-form";

type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const c=getCourse(slug);
  return {title:c?`${c.title} | Final assessment`:"Assessment",robots:{index:false,follow:false}};
}
export default async function ExamPage({params}:Props){
  const {slug}=await params;const course=getCourse(slug);if(!course)notFound();
  const questions=getPublicExam(slug);if(!questions.length)notFound();
  const identity=await currentIdentity();
  const unlocked=identity!==null && course.lessons.every(lesson=>canReadLesson(course,lesson,identity));
  let completed:string[]=[];let bestPoints=0;let attempts=0;
  if(identity && progressConfigured()){
    try{
      const [progress,summaries]=await Promise.all([readProgress(identity,slug),readExamSummaries(identity)]);
      completed=progress;
      const exam=summaries.find(row=>row.courseSlug===slug);
      bestPoints=exam?.bestPoints??0;attempts=exam?.attempts??0;
    }catch{/* Display storage unavailability without granting access. */}
  }
  const finished=course.lessons.every(lesson=>completed.includes(lesson.slug));
  const allowed=identity && unlocked && finished && progressConfigured();
  return <div className="container inner-page">
    <div className="breadcrumbs"><Link href="/">Academies</Link><span>/</span>
      <Link href={`/courses/${slug}`}>{course.title}</Link><span>/</span><span>Final assessment</span></div>
    <div className="assessment-head"><span className="eyebrow">TAKATAK ACADEMY · LEARNING ASSESSMENT</span>
      <h1>{course.title}<br/><span className="gradient-text">Final assessment.</span></h1>
      <p>Show what you learned across the full program. Five questions, twenty points each, with an 80% passing mark.</p>
      <div className="assessment-stat-row"><span>5 questions</span><span>100 possible points</span><span>80% to pass</span><span>{bestPoints} best points earned</span></div>
    </div>
    {allowed?
      <><div className="notice">Your TAKATAK identity is connected. All {course.lessons.length} lessons are marked complete. {attempts>0?`${attempts} previous attempt(s) recorded.`:"Ready for your first attempt."}</div>
      <ExamForm course={slug} questions={questions}/></>
      :<section className="panel assessment-locked"><h2>{!identity?"Sign in to take this exam":!progressConfigured()?"Exam storage not configured":!unlocked?"Full course access required":"Complete all lessons first"}</h2>
      <p>{!identity?"Your exam points belong to your centralized TAKATAK learner account.":!progressConfigured()?"Your learning database must be activated before graded exams can be saved.":!unlocked?"Advanced lessons must be unlocked by a verified TAKATAK-V1 entitlement before the final assessment.":`You completed ${completed.length} of ${course.lessons.length} lessons. Mark all lessons complete before starting the assessment.`}</p>
      <Link href={!identity?`/auth/start?next=${encodeURIComponent(`/courses/${slug}/exam`)}`:`/courses/${slug}`} className="btn btn-primary">{!identity?"Sign in with TAKATAK":"Return to curriculum"} →</Link></section>}
    {course.disclaimer&&<div className="important-note"><strong>Professional training notice</strong><p>{course.disclaimer}</p></div>}
    <p className="fine-print">These are learning assessments and points, not external professional licences or regulated credentials.</p>
  </div>;
}
