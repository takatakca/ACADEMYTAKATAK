import "server-only";
import type { AcademyIdentity } from "./access";

export async function exchangeAcademyCode(code: string): Promise<AcademyIdentity> {
  if (!/^[A-Za-z0-9_-]{20,256}$/.test(code)) throw new Error("Invalid launch code");
  const endpoint = process.env.TAKATAK_ACADEMY_EXCHANGE_URL;
  const secret = process.env.TAKATAK_ACADEMY_SERVICE_TOKEN;
  if (!endpoint || !secret || secret.length < 20) throw new Error("TAKATAK Academy exchange not configured");
  const url = new URL(endpoint);
  if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("TAKATAK Academy exchange must use HTTPS");
  }
  const response = await fetch(url, {
    method:"POST",
    headers: { "Content-Type":"application/json", "Authorization":"Bearer " + secret },
    body:JSON.stringify({code}),
    cache:"no-store",
    signal:AbortSignal.timeout(7000)
  });
  if (!response.ok) throw new Error("TAKATAK Academy code exchange failed");
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") throw new Error("Invalid exchange response");
  const data = payload as Record<string, unknown>;
  if (data.ok !== true || !data.session || typeof data.session !== "object") throw new Error("Invalid exchange session");
  const session = data.session as Record<string, unknown>;
  const sub = session.masterIdentityId;
  const name = session.displayName;
  const entitlements = session.entitlements;
  const expiresAt = session.expiresAt;
  const productCode = session.productCode;
  if (productCode !== "academy" || typeof sub !== "string" || !sub || typeof name !== "string" ||
      !Array.isArray(entitlements) || !entitlements.every((x: unknown)=>typeof x === "string") ||
      typeof expiresAt !== "string") {
    throw new Error("Unexpected TAKATAK Academy identity response");
  }
  const exp = Math.floor(new Date(expiresAt).getTime() / 1000);
  if (!Number.isFinite(exp) || exp <= Date.now() / 1000 || exp > Date.now() / 1000 + 3600) {
    throw new Error("Invalid exchange expiry");
  }
  return { sub, name, entitlements, exp };
}
