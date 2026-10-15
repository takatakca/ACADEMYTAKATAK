import Link from "next/link";
import { currentIdentity } from "@/lib/session";
import { courses } from "@/lib/catalog";
import { readProgress, progressConfigured } from "@/lib/progress";
import { courseProgress } from "@/lib/access";

export const dynamic="force-dynamic";
export default async function Account(){
  const identity=await currentIdentity();
  if(!identity)return <div className="container inner-page centered-page"><span className="kicker">YOUR LEARNING SPACE</span><h1>One account. All your skills.</h1><p>Sign in through TAKATAK-V1 to access your learning progress and any purchased training.</p><Link href="/auth/start" className="btn btn-primary">Sign in with TAKATAK →</Link></div>;
  const records=await Promise.all(courses.map(async course=>{
    try{return {course,completed:await readProgress(identity,course.slug)}}catch{return {course,completed:[] as string[]}};}));
  return <div className="container inner-page"><div className="account-head"><div><span className="kicker">MY LEARNING</span><h1>Welcome, {identity.name||"learner"}.</h1><p>Continue learning from your TAKATAK Academy account.</p></div><Link href="/auth/logout" className="btn btn-outline">Sign out</Link></div>
    {!progressConfigured()&&<div className="important-note"><strong>Progress saving is not configured.</strong><p>Your identity is connected, but database configuration is still required to persist completed lessons.</p></div>}
    <div className="course-grid">{records.map(({course,completed})=><Link key={course.slug} href={"/courses/"+course.slug} className="course-card">
      <div className={"course-art art-"+course.accent}><span className="art-icon">{course.icon}</span><span className="art-detail">{course.category}</span></div>
      <div className="course-body"><span className="kicker">{course.lessons.length} LESSONS</span><h3>{course.title}</h3><div className="progress-row"><span>Progress</span><strong>{courseProgress(completed,course.lessons.length)}%</strong></div><div className="progress-track"><i style={{width:courseProgress(completed,course.lessons.length)+"%"}}></i></div></div>
    </Link>)}</div>
    <div className="notice account-note">Subscription and specialist-course access are controlled by your TAKATAK-V1 account. <a href={process.env.NEXT_PUBLIC_TAKATAK_DASHBOARD_URL||"https://takatak.ca/dashboard"}>Open main dashboard ↗</a></div>
  </div>;
}
