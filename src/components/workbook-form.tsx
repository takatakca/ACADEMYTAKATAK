"use client";
import { useState, type FormEvent } from "react";
import { MAX_WORKBOOK_CHARS } from "@/lib/workbook-policy";
export default function WorkbookForm({course,lesson,initialText}:{course:string;lesson:string;initialText:string}){
 const [text,setText]=useState(initialText);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [error,setError]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
   event.preventDefault();
   if(!text.trim()||text.length>MAX_WORKBOOK_CHARS||busy)return;
   setBusy(true);setError("");setMessage("");
   try{
     const response=await fetch("/api/workbook",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({course,lesson,text})});
     if(!response.ok)throw new Error(response.status===401?"Please sign in again to save your work.":response.status===403?"Your TAKATAK access to this lesson has expired.":"Unable to save your answer. Check storage and retry.");
     setMessage("Your workbook answer has been saved to your TAKATAK learner account.");
   }catch(e){setError(e instanceof Error?e.message:"Unable to save workbook.");}
   finally{setBusy(false);}
 }
 return <form onSubmit={submit} className="workbook-form">
   <label htmlFor="workbook-response">Your exercise notes</label>
   <p>Work with fictional or anonymized examples. Never include customer names, passwords, payment details or other confidential records.</p>
   <textarea id="workbook-response" value={text} onChange={e=>{setText(e.target.value);setMessage("");}} maxLength={MAX_WORKBOOK_CHARS} rows={7}
      placeholder="Write your answer or practical action plan here…" required/>
   <div className="workbook-actions"><span>{text.length} / {MAX_WORKBOOK_CHARS} characters</span>
   <button type="submit" className="btn btn-outline" disabled={!text.trim()||busy}>{busy?"Saving…":"Save my exercise →"}</button></div>
   {message&&<p className="workbook-success" role="status">{message}</p>}
   {error&&<p className="error-text" role="alert">{error}</p>}
 </form>;
}
