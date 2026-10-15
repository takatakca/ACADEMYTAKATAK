import Link from "next/link";
import { notFound } from "next/navigation";
import { currentIdentity } from "@/lib/session";
import { canRevokeAwards } from "@/lib/awards";
import AwardRevocationForm from "@/components/award-revocation-form";

export const dynamic="force-dynamic";
export const metadata={title:"Academy award administration",robots:{index:false,follow:false}};
export default async function AwardsAdmin(){
 const identity=await currentIdentity();
 if(!canRevokeAwards(identity))notFound();
 return <div className="container inner-page">
   <div className="breadcrumbs"><Link href="/account">My learning</Link><span>/</span><span>Award administration</span></div>
   <div className="assessment-head"><span className="eyebrow">TAKATAK ACADEMY · RESTRICTED STAFF ACTION</span>
     <h1>Revoke an educational <span className="gradient-text">record.</span></h1>
     <p>Use this only when a verified correction or compliance event requires invalidating an existing Academy award. Revocation is permanent through this interface and recorded with your TAKATAK master identity and a reason.</p>
   </div>
   <AwardRevocationForm/>
   <div className="important-note"><strong>Scope</strong><p>Only V1-signed <code>academy_awards_admin</code> permission allows this operation. A certificate from TAKATAK Academy is educational only; it never represents a government licence.</p></div>
 </div>;
}
