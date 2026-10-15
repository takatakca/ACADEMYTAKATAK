import Link from "next/link";
import { currentIdentity } from "@/lib/session";
import { courses } from "@/lib/catalog";
import { readAllProgress, progressConfigured } from "@/lib/progress";
import { programs } from "@/lib/programs";
import { isCourseMastered, masteredProgramCount, totalEarnedPoints } from "@/lib/achievements";
import { readExamSummaries } from "@/lib/exam-records";
import { courseProgress } from "@/lib/access";
import { canAuthorExams,canReviewExams } from "@/lib/assessment-policy";

export const dynamic="force-dynamic";
export default async function Account(){
  const identity=await currentIdentity();
  if(!identity)return <div className="container inner-page centered-page"><span className="kicker">YOUR LEARNING SPACE</span><h1>One account. All your skills.</h1><p>Sign in through TAKATAK-V1 to access your learning progress and any purchased training.</p><Link href="/auth/start" className="btn btn-primary">Sign in with TAKATAK →</Link></div>;
  let progress=new Map<string,string[]>();
  let exams:Awaited<ReturnType<typeof readExamSummaries>>=[];
  let storageError=false;
  if(progressConfigured()) {
    try { [progress,exams]=await Promise.all([readAllProgress(identity),readExamSummaries(identity)]); }
    catch { storageError=true; }
  }
  const records=courses.map(course=>({course,completed:progress.get(course.slug)??[]}));
  const examByCourse=new Map(exams.map(row=>[row.courseSlug,row]));
  const myCourses=records.filter(({course,completed})=>completed.length>0 || examByCourse.has(course.slug));
  const totalPoints=totalEarnedPoints(exams);
  const passed=exams.filter(row=>row.passed).length;
  const completedCourses=records.filter(({course})=>isCourseMastered(course,progress,examByCourse)).length;
  const completedPrograms=masteredProgramCount(programs,courses,progress,examByCourse);
  return <div className="container inner-page">
    <div className="account-head"><div><span className="kicker">MY LEARNING · TAKATAK-V1 MASTER ACCOUNT</span><h1>Welcome, {identity.name||"learner"}.</h1><p>Your courses, exam results and accumulated points—always linked to one TAKATAK identity.</p></div><div className="assessment-actions">{(canAuthorExams(identity)||canReviewExams(identity))&&<Link href="/instructor/exams" className="btn btn-outline">Instructor exam desk →</Link>}<Link href="/auth/logout" className="btn btn-outline">Sign out</Link></div></div>
    {storageError&&<div className="important-note" role="alert"><strong>Learning data temporarily unavailable.</strong><p>We could not load your transcript. Your saved records have not been reset; please retry later.</p></div>}
    {!progressConfigured()&&<div className="important-note"><strong>Learning database not configured.</strong><p>Progress and exams cannot be saved until Academy PostgreSQL migrations are activated.</p></div>}
    <section className="student-overview" aria-label="Personal learning statistics">
      <div><span>Accumulated points</span><strong>{totalPoints.toLocaleString()}</strong><small>Best score per course; no repeat farming</small></div>
      <div><span>Courses started</span><strong>{myCourses.length}</strong><small>Across {courses.length} learning paths</small></div>
      <div><span>Exams passed</span><strong>{passed}</strong><small>Passing mark: 80%</small></div>
      <div><span>Programs completed</span><strong>{completedPrograms}</strong><small>{completedCourses} courses mastered · all lessons + exams</small></div>
    </section>
    <div className="section-heading"><div><span className="kicker">PICK UP WHERE YOU LEFT OFF</span><h2>My learning paths</h2><p>Your most relevant programs appear here as soon as you complete a lesson.</p></div><Link href="/#courses" className="btn btn-outline">Explore all courses →</Link></div>
    {myCourses.length?<div className="course-grid">{myCourses.map(({course,completed})=>{
      const percentage=courseProgress(completed,course.lessons.length);
      const result=examByCourse.get(course.slug);
      return <div key={course.slug} className="course-card">
        <Link href={"/courses/"+course.slug} className={"course-art art-"+course.accent}><span className="art-icon">{course.icon}</span><span className="art-detail">{course.category}</span></Link>
        <div className="course-body"><span className="kicker">{course.lessons.length} LESSONS · {result?.bestPoints??0} EXAM POINTS</span><h3><Link href={"/courses/"+course.slug}>{course.title}</Link></h3>
          <div className="progress-row"><span>Lesson progress</span><strong>{percentage}%</strong></div><div className="progress-track"><i style={{width:percentage+"%"}}></i></div>
          <div className="transcript-actions"><Link className="text-link" href={"/courses/"+course.slug}>Continue lessons →</Link><Link className="text-link" href={"/courses/"+course.slug+"/exam"}>{result?.passed?"Passed exam ✓":"Final exam →"}</Link></div>
        </div>
      </div>;
    })}</div>:<div className="panel"><h3>Your learning adventure starts here.</h3><p>Choose one of the free opening lessons in any Academy course. Mark it complete to add it to this dashboard.</p><Link href="/#courses" className="btn btn-primary">Explore the course catalog →</Link></div>}
    <section className="transcript-panel"><span className="kicker">PRIVATE ACADEMIC TRANSCRIPT</span><h2>Exam points and achievements</h2>
      {exams.length?<div className="transcript-list">{exams.map(item=><div key={item.courseSlug} className="transcript-item">
        <div><strong>{courses.find(c=>c.slug===item.courseSlug)?.title??item.courseSlug}</strong><small>{item.attempts} graded attempt(s) · Best score recorded</small></div>
        <span className="transcript-points">{item.bestPoints} / 100</span><span className={item.passed?"transcript-passed":"transcript-review"}>{item.passed?"Passed":"Review"}</span>
      </div>)}</div>:<p>No graded exams yet. Finish a program&apos;s lessons to unlock its knowledge assessment.</p>}
      <p className="fine-print">Learning points reflect graded course quizzes, not a government licence or regulated credential. Professional certifications require separate verification.</p>
    </section>
    <div className="notice account-note">Payments, specialist-course purchases and access rights are managed by TAKATAK-V1. <a href={process.env.NEXT_PUBLIC_TAKATAK_DASHBOARD_URL||"https://takatak.ca/dashboard"}>Open your main dashboard ↗</a></div>
  </div>;
}
