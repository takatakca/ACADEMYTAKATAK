"use client";
import {useCallback,useEffect,useState,type FormEvent} from "react";

type LessonOption={slug:string;title:string;content:string[];activity:string};
type CourseOption={slug:string;title:string;lessons:LessonOption[]};
type Revision={revision:number;status:"draft"|"published"|"retired";title:string;paragraphs:string[];
 activity:string;createdBy:string;reviewedBy:string|null;createdAt:string;publishedAt:string|null};
type ApiResult={ok:boolean;error?:string;revision?:number;revisions?:Revision[]};
const errors:Record<string,string>={
 staff_access_required:"Your TAKATAK staff session has expired or does not include an editorial role.",
 migration_required:"Database migration 007 must be approved and applied before using this editor.",
 independent_review_required:"A different authorized TAKATAK reviewer must approve this draft.",
 invalid_lesson_revision:"Enter a title (8–140 characters), 2–15 paragraphs (30–2,000 characters each), and a practical activity (15–2,000 characters).",
 storage_unavailable:"The editorial database is unavailable. No content was published.",
 origin_not_allowed:"Request origin was rejected. Check the Academy HTTPS URL."
};
const messageFor=(error?:string)=>errors[error||""]||"The operation failed; no publication was confirmed.";
export default function InstructorLessonEditor({courses,canAuthor,canReview}:{
 courses:CourseOption[];canAuthor:boolean;canReview:boolean;
}){
 const [courseSlug,setCourseSlug]=useState(courses[0]?.slug||"");
 const course=courses.find(c=>c.slug===courseSlug);
 const [lessonSlug,setLessonSlug]=useState(courses[0]?.lessons[0]?.slug||"");
 const lesson=course?.lessons.find(x=>x.slug===lessonSlug);
 const [title,setTitle]=useState("");
 const [paragraphs,setParagraphs]=useState("");
 const [activity,setActivity]=useState("");
 const [versions,setVersions]=useState<Revision[]>([]);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [success,setSuccess]=useState("");
 const showStarter=(v:LessonOption)=>{
   setTitle(v.title);setParagraphs(v.content.join("\n\n"));setActivity(v.activity);
 };
 const reload=useCallback(async(courseName:string,lessonName:string)=>{
  const res=await fetch("/api/instructor/lessons?course="+encodeURIComponent(courseName)+
   "&lesson="+encodeURIComponent(lessonName),{cache:"no-store",credentials:"same-origin"});
  const data=await res.json() as ApiResult;
  if(!res.ok||!data.ok)throw new Error(messageFor(data.error));
  setVersions(data.revisions||[]);
 },[]);
 useEffect(()=>{
  if(!course||!lesson)return;
  let live=true;
  const c=course.slug,l=lesson.slug;
  async function start(){
   try{
    const res=await fetch("/api/instructor/lessons?course="+encodeURIComponent(c)+
      "&lesson="+encodeURIComponent(l),{cache:"no-store",credentials:"same-origin"});
    const data=await res.json() as ApiResult;
    if(!live)return;
    if(!res.ok||!data.ok){setError(messageFor(data.error));return;}
    setVersions(data.revisions||[]);
   }catch{if(live)setError("Could not load existing revisions.");}
  }
  void start();
  return()=>{live=false};
 },[course,lesson]);
 function pickCourse(slug:string){
  const next=courses.find(x=>x.slug===slug);
  setCourseSlug(slug);setLessonSlug(next?.lessons[0]?.slug||"");
  setVersions([]);setError("");setSuccess("");setTitle("");setParagraphs("");setActivity("");
 }
 function pickLesson(slug:string){
  setLessonSlug(slug);setVersions([]);setError("");setSuccess("");
  setTitle("");setParagraphs("");setActivity("");
 }
 async function save(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!canAuthor||busy||!course||!lesson)return;
  setBusy(true);setError("");setSuccess("");
  try{
   const draft={title:title.trim(),paragraphs:paragraphs.split(/\n\s*\n/g).map(p=>p.trim()).filter(Boolean),activity:activity.trim()};
   const response=await fetch("/api/instructor/lessons",{
     method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({course:course.slug,lesson:lesson.slug,draft})
   });
   const result=await response.json() as ApiResult;
   if(!response.ok||!result.ok)throw new Error(messageFor(result.error));
   setSuccess("Private draft #"+result.revision+" saved. Another TAKATAK reviewer must approve publication.");
   await reload(course.slug,lesson.slug);
  }catch(e){setError(e instanceof Error?e.message:"The draft could not be saved.");}
  finally{setBusy(false);}
 }
 async function publish(revision:number){
  if(!canReview||busy||!course||!lesson)return;
  setBusy(true);setError("");setSuccess("");
  try{
   const response=await fetch("/api/instructor/lessons/publish",{
    method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({course:course.slug,lesson:lesson.slug,revision})
   });
   const result=await response.json() as ApiResult;
   if(!response.ok||!result.ok)throw new Error(messageFor(result.error));
   setSuccess("Lesson revision #"+revision+" published. Students with valid access now see the reviewed copy.");
   await reload(course.slug,lesson.slug);
  }catch(e){setError(e instanceof Error?e.message:"No publication confirmed.");}
  finally{setBusy(false);}
 }
 return <div className="instructor-shell">
   <div className="lesson-edit-filters">
    <div><label className="instructor-label" htmlFor="edit-course">Course</label>
      <select className="instructor-select" id="edit-course" value={courseSlug} onChange={e=>pickCourse(e.target.value)}>
        {courses.map(c=><option key={c.slug} value={c.slug}>{c.title}</option>)}
      </select></div>
    <div><label className="instructor-label" htmlFor="edit-lesson">Lesson</label>
      <select className="instructor-select" id="edit-lesson" value={lessonSlug} onChange={e=>pickLesson(e.target.value)}>
        {course?.lessons.map(l=><option key={l.slug} value={l.slug}>{l.title}</option>)}
      </select></div>
   </div>
   {error&&<p className="error-text" role="alert">{error}</p>}
   {success&&<p className="workbook-success" role="status">{success}</p>}
   <section className="panel">
     <h2>Editorial history</h2>
     <p>Only reviewed and published revisions appear in student lessons. Previous revisions remain recorded for review and rollback by publishing a new draft.</p>
     {versions.length?versions.map(v=><details className="instructor-version" key={v.revision}>
       <summary><strong>Revision #{v.revision} · {v.status.toUpperCase()}</strong><span>{v.paragraphs.length} paragraphs</span></summary>
       <div className="instructor-version-body">
        <h3>{v.title}</h3>
        {v.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
        <p><strong>Practical activity:</strong> {v.activity}</p>
        <p className="fine-print">Recorded author identity: {v.createdBy ? "TAKATAK account" : "Unknown"}
          · Reviewed: {v.reviewedBy?"Yes":"Awaiting approval"}</p>
        {canAuthor&&<button type="button" className="btn btn-outline" disabled={busy}
          onClick={()=>{setTitle(v.title);setParagraphs(v.paragraphs.join("\n\n"));setActivity(v.activity);}}>
          Create a new draft from this revision</button>}
        {canReview&&v.status==="draft"&&<button type="button" className="btn btn-primary"
          disabled={busy} onClick={()=>void publish(v.revision)}>Approve and publish revision #{v.revision} →</button>}
       </div>
     </details>):<p>No editorial revisions yet. The original syllabus remains visible to authorized students.</p>}
   </section>
   {canAuthor&&<section className="panel"><h2>Prepare an editorial revision</h2>
     <p>Changes remain private drafts until a different reviewer approves them. This editor stores plain text only; no external assets or unverified hyperlinks are published automatically.</p>
     {lesson&&<button type="button" className="btn btn-outline" onClick={()=>showStarter(lesson)}>
       Load original lesson into editor</button>}
     <form onSubmit={save}>
       <label className="instructor-label" htmlFor="lesson-edit-title">Reviewed lesson title</label>
       <input className="instructor-select" id="lesson-edit-title" value={title} onChange={e=>setTitle(e.target.value)}
         minLength={8} maxLength={140} required/>
       <label className="instructor-label" htmlFor="lesson-edit-body">Lesson paragraphs — separate with a blank line</label>
       <textarea className="instructor-textarea" id="lesson-edit-body" rows={13} value={paragraphs}
         onChange={e=>setParagraphs(e.target.value)} maxLength={30500} required/>
       <label className="instructor-label" htmlFor="lesson-edit-activity">Practical activity</label>
       <textarea className="instructor-textarea" id="lesson-edit-activity" rows={4} value={activity}
         onChange={e=>setActivity(e.target.value)} maxLength={2000} required/>
       <div className="workbook-actions"><span>Requires another TAKATAK reviewer to publish</span>
         <button className="btn btn-primary" type="submit" disabled={busy||!title.trim()||!paragraphs.trim()||!activity.trim()}>
           {busy?"Saving…":"Save private draft →"}</button></div>
     </form>
   </section>}
 </div>;
}
