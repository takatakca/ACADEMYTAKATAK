/** Strict relative allowlist for post-SSO return destinations; never redirects to arbitrary URLs. */
export function safeLearningReturnPath(value:unknown):string {
  if(typeof value!=="string"||value.length>220||value.length<1)return "/account";
  if(!value.startsWith("/")||value.startsWith("//")||/[\\\r\n\t#]/.test(value))return "/account";
  let decoded:string;
  try{decoded=decodeURIComponent(value);}catch{return "/account";}
  if(decoded!==value || !decoded.startsWith("/")||decoded.startsWith("//")||/[\\\r\n\t#]/.test(decoded))return "/account";
  if(/^\/(?:account|dashboard-guide|programs(?:\/[a-z0-9-]+)?|courses\/[a-z0-9-]+(?:\/(?:[a-z0-9-]+|exam))?)$/.test(value))
    return value;
  return "/account";
}
