import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "vdn_admin_session";
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

export function createAdminToken() {
  const issued = Date.now().toString();
  const sig = crypto.createHmac("sha256", secret()).update(issued).digest("hex");
  return `${issued}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token || !secret()) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(issued).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  return Date.now() - Number(issued) < 1000 * 60 * 60 * 12;
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE)?.value);
}

export function adminCookieName() {
  return COOKIE;
}
