"use client";
import { useState,type FormEvent } from "react";
import Link from "next/link";
export default function AwardRevocationForm(){
 const [id,setId]=useState("");
 const [reason,setReason]=useState("");
 const [confirmed,setConfirmed]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [revoked,setRevoked]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
   event.preventDefault();if(busy||!confirmed)return;
   setBusy(true);setError("");setRevoked(false);
   try {
     const response=await fetch("/api/instructor/awards/revoke",{
       method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({awardId:id.trim(),reason:reason.trim()})
     });
     const body=await response.json() as {ok?:boolean;error?:string};
     if(!response.ok||!body.ok)throw new Error(
       body.error==="invalid_payload"?"Use a valid UUID and at least 15 characters describing the factual reason.":
       body.error==="award_admin_entitlement_required"?"Your TAKATAK administrative permission is not active.":
       body.error==="storage_unavailable"?"The Academy award database is unavailable.":
       "Award not found or already revoked. No additional changes were made.");
     setRevoked(true);
   }catch(e){setError(e instanceof Error?e.message:"Revocation was not saved.");}
   finally{setBusy(false);}
 }
 return <form className="panel award-revoke" onSubmit={submit}>
   <label className="instructor-label" htmlFor="award-revoke-id">Award ID (UUID)</label>
   <input className="instructor-select" id="award-revoke-id" type="text" value={id} onChange={e=>{setId(e.target.value);setRevoked(false);}} maxLength={36} required placeholder="xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx"/>
   <label className="instructor-label" htmlFor="award-revoke-reason">Recorded reason for revocation</label>
   <textarea className="instructor-textarea" id="award-revoke-reason" value={reason} onChange={e=>setReason(e.target.value)}
     minLength={15} maxLength={500} rows={5} required placeholder="Describe the verified reason and supporting internal case reference; avoid unnecessary personal data."/>
   <label className="instructor-check"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>
     I have verified the record and authorization, and understand that this invalidates public verification.</label>
   <button className="btn btn-primary" type="submit" disabled={!confirmed||busy||reason.trim().length<15||id.length!==36}>{busy?"Recording revocation…":"Revoke this educational record →"}</button>
   {revoked&&<p className="workbook-success" role="status">The record is revoked. <Link href={"/verify/"+id.trim()}>View public verification status →</Link></p>}
   {error&&<p className="error-text" role="alert">{error}</p>}
 </form>;
}
