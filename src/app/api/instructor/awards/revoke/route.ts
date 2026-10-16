import { isSameWriteOrigin } from "@/lib/request-origin";
import { NextRequest,NextResponse } from "next/server";
import { currentIdentity } from "@/lib/session";
import { canRevokeAwards,revokeProgramAward } from "@/lib/awards";
import { validAwardId } from "@/lib/award-policy";

export const runtime="nodejs";export const dynamic="force-dynamic";
const json=(data:object,status:number)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store"}});
export async function POST(request:NextRequest){
 const identity=await currentIdentity();
 if(!identity||!canRevokeAwards(identity))return json({ok:false,error:"award_admin_entitlement_required"},403);
 if(!isSameWriteOrigin(request.headers.get("origin"),request.nextUrl.origin))return json({ok:false,error:"origin_not_allowed"},403);
 if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))return json({ok:false,error:"json_required"},415);
 if(Number(request.headers.get("content-length")||0)>1500)return json({ok:false,error:"too_large"},413);
 let input:unknown;
 try{const raw=await request.text();if(raw.length>1500)return json({ok:false,error:"too_large"},413);input=JSON.parse(raw);}
 catch{return json({ok:false,error:"invalid_json"},400);}
 if(!input||typeof input!=="object"||Array.isArray(input))return json({ok:false,error:"invalid_payload"},400);
 const {awardId,reason}=input as Record<string,unknown>;
 if(!validAwardId(awardId)||typeof reason!=="string"||reason.trim().length<15||reason.length>500)
   return json({ok:false,error:"invalid_payload"},400);
 try {
  const revoked=await revokeProgramAward(identity,awardId,reason);
  return json({ok:revoked,status:revoked?"revoked":"not_found_or_already_revoked"},revoked?200:404);
 }catch{return json({ok:false,error:"storage_unavailable"},503);}
}
