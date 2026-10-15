"use client";
import { useState } from "react";
import Link from "next/link";
export default function AwardButton({program,initialId}:{program:string;initialId:string|null}){
 const [awardId,setAwardId]=useState(initialId);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function issue(){
  if(busy||awardId)return;
  setBusy(true);setError("");
  try{
   const response=await fetch("/api/awards",{method:"POST",credentials:"same-origin",
     headers:{"Content-Type":"application/json"},body:JSON.stringify({program})});
   const data=await response.json() as {ok?:boolean;award?:{awardId:string;status:string};error?:string};
   if(!response.ok||!data.ok||!data.award||data.award.status!=="active"){
     throw new Error(data.error==="program_not_complete"?
       "All lessons and final assessments must be complete.":
       data.error==="program_entitlement_required"?"Your TAKATAK access does not authorize award issuance.":
       "The Academy could not verify and save an award. Try again after the learning service is available.");
   }
   setAwardId(data.award.awardId);
  }catch(e){setError(e instanceof Error?e.message:"Unable to issue award.");}
  finally{setBusy(false);}
 }
 return <div className="award-claim">
   <strong>Internal Academy completion record</strong>
   <p>You have met the learning milestones. Issue an optional privacy-respecting verification record; public verification does not disclose your account identity.</p>
   {awardId?<Link className="btn btn-primary" href={"/verify/"+awardId}>View my verified learning record →</Link>:
     <button type="button" className="btn btn-primary" onClick={issue} disabled={busy}>{busy?"Verifying and issuing…":"Issue my completion record →"}</button>}
   {error&&<p className="error-text" role="alert">{error}</p>}
   <p className="fine-print">Educational achievement only. Not a government licence or independently accredited professional certification.</p>
 </div>;
}
