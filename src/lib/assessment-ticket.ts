import { createHmac,timingSafeEqual } from "node:crypto";

export type AssessmentTicket={
 sub:string;course:string;version:number;source:"public_practice"|"private_reviewed";
 questionIds:string[];expiresAt:number
};
const ticketMac=(payload:string,secret:string)=>
 createHmac("sha256",secret).update("academy-exam-ticket:v1:").update(payload).digest();
export function issueAssessmentTicket(ticket:AssessmentTicket,secret:string):string {
 if(secret.length<32||!validTicket(ticket))throw new Error("invalid_ticket");
 const payload=Buffer.from(JSON.stringify(ticket)).toString("base64url");
 return payload+"."+ticketMac(payload,secret).toString("base64url");
}
export function verifyAssessmentTicket(
 token:string,secret:string,sub:string,course:string,now=Math.floor(Date.now()/1000)
):AssessmentTicket|null {
 if(secret.length<32||!token||token.length>4096)return null;
 const parts=token.split(".");
 if(parts.length!==2||!parts.every(x=>/^[A-Za-z0-9_-]+$/.test(x)))return null;
 const expected=ticketMac(parts[0],secret),given=Buffer.from(parts[1],"base64url");
 if(expected.length!==given.length||!timingSafeEqual(expected,given))return null;
 try{
  const obj:unknown=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8"));
  if(!validTicket(obj))return null;
  if(obj.sub!==sub||obj.course!==course||obj.expiresAt<=now||obj.expiresAt>now+1200)return null;
  return obj;
 }catch{return null}
}
function validTicket(x:unknown):x is AssessmentTicket {
 if(!x||typeof x!=="object"||Array.isArray(x))return false;
 const d=x as Record<string,unknown>;
 return typeof d.sub==="string"&&d.sub.length>0&&d.sub.length<=150&&
 typeof d.course==="string"&&/^[a-z0-9-]{2,100}$/.test(d.course)&&
 Number.isInteger(d.version)&&(d.version as number)>=0&&(d.version as number)<=2147483647 &&
 (d.source==="public_practice"||d.source==="private_reviewed") &&
 Array.isArray(d.questionIds)&&d.questionIds.length===5&&
 d.questionIds.every(x=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,45}$/.test(x))&&
 new Set(d.questionIds).size===5&&Number.isInteger(d.expiresAt);
}
