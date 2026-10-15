"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { PublicQuestion } from "@/lib/exams";

type Grade={correct:number;total:number;percent:number;points:number;passed:boolean;
  review:{id:string;prompt:string;correct:boolean;correctAnswer:string;explanation:string}[]};
type ApiResult={ok:boolean;grade?:Grade;bestPoints?:number;error?:string};
export default function ExamForm({course,questions,ticket}:{course:string;questions:PublicQuestion[];ticket:string}){
  const [answers,setAnswers]=useState<(number|null)[]>(Array(questions.length).fill(null));
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState<ApiResult|null>(null);
  const [error,setError]=useState("");
  const ready=answers.every(v=>v!==null);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(!ready||busy)return;
    setBusy(true);setError("");
    try {
      const response=await fetch("/api/exams",{method:"POST",credentials:"same-origin",
        headers:{"Content-Type":"application/json"},body:JSON.stringify({course,answers,ticket})});
      const data=await response.json() as ApiResult;
      if(!response.ok||!data.ok){
        const messages:Record<string,string>={
          exam_attempt_limit:"You have reached three attempts in the last 24 hours. Review the lessons before trying again.",
          finish_lessons_first:"Complete every lesson before taking this assessment.",
          payment_or_entitlement_required:"Your current TAKATAK account does not have access to the entire course.",
          sign_in_required:"Sign in to your TAKATAK account to continue.",
          progress_not_configured:"Exam storage is not yet configured.",
          exam_unavailable:"The assessment service is temporarily unavailable.",
          exam_ticket_expired:"This exam session has expired. Reload the exam page to begin again.",
          exam_version_unavailable:"This exam version is unavailable. Reload the exam page."
        };
        setError(messages[data.error||""]||"Could not submit. Please try again.");return;
      }
      setResult(data);
    }catch{setError("A network error prevented submission. Please try again.");}
    finally{setBusy(false);}
  }
  if(result?.grade)return <div className="assessment-result" role="status" aria-live="polite">
    <span className="kicker">ASSESSMENT RESULT</span>
    <div className="grade-score">{result.grade.percent}%</div>
    <h2>{result.grade.passed?"You passed — excellent work!":"Keep learning. You can improve."}</h2>
    <p>You answered {result.grade.correct} out of {result.grade.total} questions correctly.
      You earned {result.grade.points} points on this attempt. Your best exam score for this course is <strong>{result.bestPoints} points</strong>.</p>
    <p>{result.grade.passed?"Your passed exam is recorded in your learning transcript.":"Review the lessons before your next attempt. You may attempt this exam up to three times in any 24-hour window."}</p>
    <section className="exam-review"><h3>Review what you learned</h3>
      <p>Use these explanations to strengthen your understanding before the next course.</p>
      {result.grade.review.map((item,i)=><div key={item.id} className="exam-review-item">
        <span className={item.correct?"review-correct":"review-incorrect"}>{item.correct?"✓ Correct":"Review needed"} · Question {i+1}</span>
        <strong>{item.prompt}</strong><p>Correct answer: {item.correctAnswer}</p><p>{item.explanation}</p>
      </div>)}
    </section>
    <div className="assessment-actions"><Link href="/account" className="btn btn-primary">My learning transcript →</Link>
    <Link href={`/courses/${course}`} className="btn btn-outline">Course overview</Link></div>
  </div>;
  return <form className="exam-form" onSubmit={submit}>
    {questions.map((q,index)=><fieldset className="exam-question" key={q.id}>
      <legend><span>QUESTION {index+1} OF {questions.length}</span>{q.prompt}</legend>
      <div className="answer-list">{q.choices.map((choice,i)=><label key={i} className={answers[index]===i?"answer-choice selected":"answer-choice"}>
        <input type="radio" name={`question-${q.id}`} value={i} checked={answers[index]===i}
          onChange={()=>{setAnswers(current=>current.map((v,n)=>n===index?i:v));setResult(null);}} required/>
        <span>{String.fromCharCode(65+i)}</span><span>{choice}</span>
      </label>)}</div>
    </fieldset>)}
    <div className="exam-submit"><span>{answers.filter(x=>x!==null).length} of {questions.length} answered · Pass mark 80%</span>
    <button type="submit" disabled={!ready||busy} className="btn btn-primary">{busy?"Submitting…":"Submit exam for grading →"}</button></div>
    {error&&<p className="error-text" role="alert">{error}</p>}
    <p className="fine-print">Your score is checked by the server and attached to your TAKATAK identity. Three attempts per rolling 24 hours; only the best course score counts toward lifetime points.</p>
  </form>;
}
