import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { AcademyIdentity } from "./access";

export const SESSION_COOKIE = "takatak_academy_session";
export const STATE_COOKIE = "takatak_academy_state";
const MAX_AGE = 15 * 60;

function signingKey(): string | null {
  const key = process.env.ACADEMY_SESSION_SECRET;
  return key && key.length >= 32 ? key : null;
}
function mac(value: string, key: string): Buffer {
  return createHmac("sha256", key).update(value).digest();
}
export function signSession(identity: AcademyIdentity): string {
  const key = signingKey();
  if (!key) throw new Error("ACADEMY_SESSION_SECRET is not configured");
  const exp = Math.min(identity.exp, Math.floor(Date.now() / 1000) + MAX_AGE);
  if (exp <= Math.floor(Date.now() / 1000)) throw new Error("Expired exchange identity");
  const payload = Buffer.from(JSON.stringify({ ...identity, exp })).toString("base64url");
  return payload + "." + mac(payload, key).toString("base64url");
}
export function verifySession(token: string | undefined): AcademyIdentity | null {
  const key = signingKey();
  if (!key || !token || token.length > 8192) return null;
  const pair = token.split(".");
  if (pair.length !== 2) return null;
  const [payload, signature] = pair;
  if (!/^[A-Za-z0-9_-]+$/.test(payload) || !/^[A-Za-z0-9_-]+$/.test(signature)) return null;
  const provided = Buffer.from(signature, "base64url");
  const expected = mac(payload, key);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  try {
    const json: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!json || typeof json !== "object" || Array.isArray(json)) return null;
    const x = json as Record<string, unknown>;
    if (typeof x.sub !== "string" || x.sub.length < 1 || x.sub.length > 150) return null;
    if (typeof x.name !== "string" || x.name.length > 150) return null;
    if (typeof x.exp !== "number" || !Number.isFinite(x.exp) || x.exp <= Date.now() / 1000 || x.exp > Date.now() / 1000 + MAX_AGE + 5) return null;
    if (!Array.isArray(x.entitlements) || x.entitlements.length > 200 || !x.entitlements.every((e: unknown) => typeof e === "string" && e.length <= 100)) return null;
    return x as AcademyIdentity;
  } catch { return null; }
}
export async function currentIdentity(): Promise<AcademyIdentity | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}
export function newLaunchState(): string { return randomBytes(32).toString("base64url"); }
export const sessionCookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const,
  path: "/", maxAge: MAX_AGE
};
