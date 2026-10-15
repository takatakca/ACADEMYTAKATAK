"use client";
import { useState } from "react";
export default function ProgressButton({course,lesson,initialCompleted}:{course:string;lesson:string;initialCompleted:boolean}){
  const [done,setDone]=useState(initialCompleted);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  async function complete(){
    setLoading(true);setError("");
    try{
      const response=await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({course,lesson}),credentials:"same-origin"});
      if(!response.ok)throw new Error(response.status===503?"Progress storage is not configured yet.":"Could not save progress. Please sign in again or retry.");
      setDone(true);
    }catch(e){setError(e instanceof Error?e.message:"Unable to save progress");}
    finally{setLoading(false);}
  }
  return <div><button className="btn btn-primary" disabled={done||loading} onClick={complete}>{done?"✓ Lesson completed":loading?"Saving…":"Mark lesson complete ✓"}</button>{error&&<p role="alert" className="error-text">{error}</p>}</div>;
}
