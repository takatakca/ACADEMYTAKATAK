/** Reject cross-scheme, cross-host and malformed browser write origins.
 * The reverse proxy must preserve the public request scheme and Host.
 * Fail closed rather than allowing a same-host HTTP page to act on an HTTPS session.
 */
export function isSameWriteOrigin(originHeader:string|null,requestOrigin:string):boolean {
 if(!originHeader)return false;
 try{
   const origin=new URL(originHeader);
   const target=new URL(requestOrigin);
   if(origin.username||origin.password||origin.pathname!=="/"||origin.search||origin.hash)return false;
   if(origin.protocol!=="https:" && !(origin.protocol==="http:"&&
      ["localhost","127.0.0.1"].includes(origin.hostname)))return false;
   return origin.origin===target.origin;
 }catch{return false;}
}
