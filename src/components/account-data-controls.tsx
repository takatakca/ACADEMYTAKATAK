"use client";
import {useState} from "react";
export default function AccountDataControls(){
  const [open,setOpen]=useState(false);
  const [confirmation,setConfirmation]=useState("");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  async function removeWorkbooks(){
    if(busy||confirmation!=="DELETE MY WORKBOOKS")return;
    setBusy(true);setError("");setMessage("");
    try{
      const response=await fetch("/api/account/workbooks",{
        method:"DELETE",credentials:"same-origin",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({confirmation})
      });
      const data=await response.json() as {ok?:boolean;removed?:number;error?:string};
      if(!response.ok||!data.ok)throw new Error(data.error==="origin_not_allowed"?
        "Secure request rejected. Check the Academy HTTPS address.":
        "Could not erase your workbook responses. No deletion has been confirmed.");
      setMessage(String(data.removed??0)+" workbook response(s) erased. Course progress, exam scores, and Academy awards were not deleted.");
      setConfirmation("");setOpen(false);
    }catch(err){setError(err instanceof Error?err.message:"Deletion could not be confirmed.");}
    finally{setBusy(false);}
  }
  return <section className="transcript-panel" aria-label="Your Academy learning data">
    <span className="kicker">PRIVACY AND DATA CONTROL</span><h2>Your learning records</h2>
    <p>Export the learning progress, exam scores, personal workbook responses and Academy award records associated with your TAKATAK account. Your file contains personal data; store it securely.</p>
    <div className="assessment-actions">
      <a className="btn btn-outline" href="/api/account/export" download="takatak-academy-learning.json">Export my Academy learning data (JSON) ↓</a>
      <button className="btn btn-outline" type="button" onClick={()=>{setOpen(!open);setConfirmation("");setError("");}}>
        {open?"Cancel deletion":"Erase my workbook answers"}</button>
    </div>
    {open&&<div className="account-erase-form">
      <p><strong>Permanent operation:</strong> delete only the text answers you saved in Academy workbooks. This does not delete your TAKATAK identity, progress, exam history, purchases, or educational awards.</p>
      <label className="instructor-label" htmlFor="workbook-delete-confirm">Type DELETE MY WORKBOOKS to confirm</label>
      <input className="instructor-select" id="workbook-delete-confirm" type="text" autoComplete="off"
        value={confirmation} onChange={e=>setConfirmation(e.target.value)} maxLength={50}/>
      <button className="btn btn-primary" type="button" disabled={busy||confirmation!=="DELETE MY WORKBOOKS"} onClick={()=>void removeWorkbooks()}>
        {busy?"Erasing…":"Permanently erase my workbook answers"}</button>
    </div>}
    {message&&<p className="workbook-success" role="status">{message}</p>}
    {error&&<p className="error-text" role="alert">{error}</p>}
    <p className="fine-print">Academy cannot delete central TAKATAK accounts, payment records or independently auditable examination records through this control.</p>
  </section>;
}
