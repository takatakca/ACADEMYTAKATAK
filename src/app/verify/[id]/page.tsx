import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readPublicAward } from "@/lib/awards";
import { getProgram } from "@/lib/programs";
import { validAwardId } from "@/lib/award-policy";

type Props={params:Promise<{id:string}>};
export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{
 return {title:"Verify educational completion | TAKATAK Academy",robots:{index:false,follow:false}};
}
export default async function VerifyAward({params}:Props){
 const {id}=await params;if(!validAwardId(id))notFound();
 let award:Awaited<ReturnType<typeof readPublicAward>>=null;
 let unavailable=false;
 try{award=await readPublicAward(id);}catch{unavailable=true;}
 if(!award&&!unavailable)notFound();
 const program=award&&getProgram(award.programSlug);
 return <div className="container inner-page centered-page">
   <span className="eyebrow">TAKATAK ACADEMY · EDUCATIONAL COMPLETION VERIFICATION</span>
   <div className="award-verify-card">
     {unavailable?<><span className="award-symbol">!</span><h1>Verification temporarily unavailable</h1>
       <p>The Academy database could not be checked. We cannot confirm this record right now. Do not treat a screenshot as validation.</p></>
       :<><span className="award-symbol">{award?.status==="active"?"✓":"×"}</span>
         <h1>{award?.status==="active"?"Academy completion record verified":"This completion record was revoked"}</h1>
         <p>{award?.status==="active"?"The following Academy educational achievement exists in the issuer's records.":"The original education record is no longer valid and must not be presented as current."}</p>
         <dl className="award-details">
           <div><dt>Program</dt><dd>{program?.title||award?.programSlug}</dd></div>
           <div><dt>Learning paths completed at issue</dt><dd>{award?.courseSlugs.length}</dd></div>
           <div><dt>Earned exam points at issue</dt><dd>{award?.pointsEarned}</dd></div>
           <div><dt>Issued on</dt><dd>{award?.issuedAt?new Date(award.issuedAt).toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"}):"Unavailable"}</dd></div>
           <div><dt>Issuer</dt><dd>TAKATAK Academy · GROUPE TAKATAK</dd></div>
           <div><dt>Record ID</dt><dd className="award-code">{award?.awardId}</dd></div>
         </dl></>}
     <p className="fine-print">This confirms only an internal Academy education record, not the bearer’s identity, academic accreditation, employment qualification, government permit, travel adviser licence, or external professional certification. No student identity is disclosed on this public page.</p>
     <Link href="/programs" className="btn btn-outline">Explore TAKATAK learning →</Link>
   </div>
 </div>;
}
