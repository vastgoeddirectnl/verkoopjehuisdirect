import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "vdn_admin_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function hasAdminSessionSecret() {
  return Boolean(secret());
}

export function safeEqualText(a, b) {
  const left = Buffer.from(String(a ?? ""));
  const right = Buffer.from(String(b ?? ""));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function createAdminToken() {
  if (!secret()) {
    throw new Error("ADMIN_SESSION_SECRET ontbreekt.");
  }

  const issued = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${issued}.${nonce}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token || !secret()) return false;

  const [issued, nonce, sig] = String(token).split(".");
  if (!issued || !nonce || !sig || !/^\d+$/.test(issued) || !/^[a-f0-9]{32}$/i.test(nonce)) {
    return false;
  }

  const payload = `${issued}.${nonce}`;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("hex");

  try {
    if (!safeEqualText(sig, expected)) return false;
  } catch {
    return false;
  }

  const age = Date.now() - Number(issued);
  return age >= 0 && age < SESSION_MAX_AGE_MS;
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE)?.value);
}

export function adminCookieName() {
  return COOKIE;
}
