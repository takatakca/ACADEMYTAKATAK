"use client";
import { useCallback,useEffect,useState,type FormEvent } from "react";
import type { AnswerKeyQuestion } from "@/lib/service-courses";

type CourseOption={slug:string;title:string};
type Version={courseSlug:string;version:number;status:"draft"|"published"|"retired";
 questions:AnswerKeyQuestion[];createdBy:string;reviewedBy:string|null;publishedAt:string|null};
type Response={ok?:boolean;error?:string;versions?:Version[];version?:number};
const errorText=(key:string)=>({
 forbidden:"This area requires authorized TAKATAK staff permissions.",
 migration_required:"Private exam migration 004 is not installed. Ask your database administrator to apply the approved migration.",
 storage_unavailable:"The private exam database is not available.",
 invalid_question_bank:"Provide 10–60 original, valid questions with distinct IDs, four answers and a complete explanation.",
 different_reviewer_or_valid_draft_required:"A separate authorized reviewer must approve a valid draft that is not yet published."
} as Record<string,string>)[key]||"The operation was not completed.";
export default function InstructorExamEditor({courses,canAuthor,canReview}:{
 courses:CourseOption[];canAuthor:boolean;canReview:boolean;
}){
 const [course,setCourse]=useState(courses[0]?.slug||"");
 const [versions,setVersions]=useState<Version[]>([]);
 const [draft,setDraft]=useState("");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const reload=useCallback(async (slug:string)=>{
   setError("");
   const response=await fetch("/api/instructor/exams?course="+encodeURIComponent(slug),{credentials:"same-origin",cache:"no-store"});
   const result=await response.json() as Response;
   if(!response.ok||!result.ok)throw new Error(errorText(result.error||""));
   setVersions(result.versions||[]);
 },[]);
 useEffect(()=>{let active=true;
   async function load(){try{await reload(course);}catch(e){if(active)setError(e instanceof Error?e.message:"Unable to load exam versions.");}}
   void load();return()=>{active=false};
 },[course,reload]);
 async function submit(event:FormEvent<HTMLFormElement>){
   event.preventDefault();if(!canAuthor||busy)return;
   setError("");setMessage("");
   let questions:unknown;
   try{questions=JSON.parse(draft);}catch{setError("The question bank must be valid JSON.");return;}
   setBusy(true);
   try{
     const response=await fetch("/api/instructor/exams",{method:"POST",credentials:"same-origin",
       headers:{"Content-Type":"application/json"},body:JSON.stringify({course,questions})});
     const result=await response.json() as Response;
     if(!response.ok||!result.ok)throw new Error(errorText(result.error||""));
     setMessage("Draft v"+result.version+" saved privately. A different reviewer must approve publication.");
     setDraft("");await reload(course);
   }catch(e){setError(e instanceof Error?e.message:"Unable to save draft.");}
   finally{setBusy(false);}
 }
 async function publish(version:number){
   if(!canReview||busy)return;
   setBusy(true);setError("");setMessage("");
   try{
     const response=await fetch("/api/instructor/exams/publish",{method:"POST",credentials:"same-origin",
       headers:{"Content-Type":"application/json"},body:JSON.stringify({course,version})});
     const result=await response.json() as Response;
     if(!response.ok||!result.ok)throw new Error(errorText(result.error||""));
     setMessage("Version "+version+" approved and published. New sittings now use its private question pool.");
     await reload(course);
   }catch(e){setError(e instanceof Error?e.message:"Unable to publish.");}
   finally{setBusy(false);}
 }
 return <div className="instructor-shell">
   <label className="instructor-label" htmlFor="instructor-course">Course to review</label>
   <select id="instructor-course" className="instructor-select" value={course} onChange={e=>{setCourse(e.target.value);setVersions([]);setMessage("");setError("");}}>
     {courses.map(c=><option key={c.slug} value={c.slug}>{c.title}</option>)}
   </select>
   {error&&<p role="alert" className="error-text">{error}</p>}
   {message&&<p role="status" className="workbook-success">{message}</p>}
   <section className="panel">
     <h2>Version history</h2>
     <p>A published bank remains available to in-flight exam tickets for a limited period when replaced.</p>
     {versions.length?versions.map(item=><details key={item.version} className="instructor-version">
       <summary><strong>Version {item.version} · {item.status.toUpperCase()}</strong><span>{item.questions.length} questions · {item.publishedAt?"Published":"Awaiting review"}</span></summary>
       <div className="instructor-version-body">
         <p>Author: {item.createdBy===undefined?"Not recorded":item.createdBy===item.reviewedBy?"Invalid review separation":"TAKATAK master account verified"} · Reviewer: {item.reviewedBy?"Recorded":"Not yet assigned"}</p>
         <ol>{item.questions.map(q=><li key={q.id}><strong>{q.prompt}</strong>
           <p>Correct answer: {q.choices[q.correctIndex]}</p><p>{q.explanation}</p></li>)}</ol>
         {canReview&&item.status==="draft"&&<button type="button" className="btn btn-primary" disabled={busy} onClick={()=>void publish(item.version)}>Review complete — publish version {item.version} →</button>}
       </div>
     </details>):<p>No private question banks have been created for this course yet. Existing legacy questions remain low-stakes practice until a reviewed version is published.</p>}
   </section>
   {canAuthor&&<section className="panel">
     <h2>Create a new draft question bank</h2>
     <p>Upload an original JSON array containing 10 to 60 questions. Each question requires a unique ID, a prompt (20–800 characters), exactly four distinct choices, a correctIndex from 0 to 3, and an explanation (15–1000 characters).</p>
     <form onSubmit={submit}>
       <label className="instructor-label" htmlFor="exam-json">Unpublished questions (JSON)</label>
       <textarea id="exam-json" className="instructor-textarea" rows={12} value={draft} onChange={e=>setDraft(e.target.value)} maxLength={105000}
         placeholder={'[\n  { "id": "q01", "prompt": "Write a meaningful factual question here", "choices": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "Explain the verified concept here" },\n  ...at least 9 more original questions\n]'} required/>
       <div className="workbook-actions"><span>Private draft; never shown to students until separate approval</span>
         <button className="btn btn-primary" type="submit" disabled={busy||!draft.trim()}>{busy?"Saving…":"Save versioned draft →"}</button></div>
     </form>
   </section>}
 </div>;
}
