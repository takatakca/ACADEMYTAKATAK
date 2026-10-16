import {NextRequest,NextResponse} from "next/server";
import {currentIdentity} from "@/lib/session";
import {progressConfigured} from "@/lib/progress";
import {eraseMyWorkbookResponses} from "@/lib/account-data";
import {isSameWriteOrigin} from "@/lib/request-origin";

export const runtime="nodejs";export const dynamic="force-dynamic";
const json=(value:object,status:number)=>NextResponse.json(value,{
  status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}
});
export async function DELETE(request:NextRequest){
  if(!isSameWriteOrigin(request.headers.get("origin"),request.nextUrl.origin))
    return json({ok:false,error:"origin_not_allowed"},403);
  if(!(request.headers.get("content-type")||"").toLowerCase().startsWith("application/json"))
    return json({ok:false,error:"json_required"},415);
  if(Number(request.headers.get("content-length")||0)>200)return json({ok:false,error:"too_large"},413);
  const identity=await currentIdentity();
  if(!identity)return json({ok:false,error:"sign_in_required"},401);
  if(!progressConfigured())return json({ok:false,error:"storage_unavailable"},503);
  let payload:unknown;
  try{
    const raw=await request.text();if(raw.length>200)return json({ok:false,error:"too_large"},413);
    payload=JSON.parse(raw);
  }catch{return json({ok:false,error:"invalid_json"},400);}
  if(!payload||typeof payload!=="object"||Array.isArray(payload)||
     (payload as Record<string,unknown>).confirmation!=="DELETE MY WORKBOOKS")
    return json({ok:false,error:"explicit_confirmation_required"},400);
  try{
    const removed=await eraseMyWorkbookResponses(identity);
    return json({ok:true,removed,scope:"academy_workbook_responses_only"},200);
  }catch{return json({ok:false,error:"storage_unavailable"},503);}
}
