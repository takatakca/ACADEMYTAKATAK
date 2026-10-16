import {NextResponse} from "next/server";
import {currentIdentity} from "@/lib/session";
import {progressConfigured} from "@/lib/progress";
import {exportMyLearningData,LearningExportTooLarge} from "@/lib/account-data";

export const runtime="nodejs";export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store, max-age=0","Pragma":"no-cache","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"};
export async function GET(){
  const identity=await currentIdentity();
  if(!identity)return NextResponse.json({ok:false,error:"sign_in_required"},{status:401,headers});
  if(!progressConfigured())return NextResponse.json({ok:false,error:"storage_unavailable"},{status:503,headers});
  try{
    const data=await exportMyLearningData(identity);
    return new Response(JSON.stringify(data,null,2),{status:200,headers:{
      ...headers,"Content-Type":"application/json; charset=utf-8",
      "Content-Disposition":'attachment; filename="takatak-academy-learning.json"'
    }});
  }catch(err){
    if(err instanceof LearningExportTooLarge)return NextResponse.json(
      {ok:false,error:"export_too_large_contact_support"},{status:413,headers});
    return NextResponse.json({ok:false,error:"storage_unavailable"},{status:503,headers});
  }
}
