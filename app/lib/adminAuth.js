import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "vdn_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function createAdminToken() {
  const secret = getSecret();

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD is missing.");
  }

  const issuedAt = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(issuedAt)
    .digest("hex");

  return `${issuedAt}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token) return false;

  const secret = getSecret();
  if (!secret) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(issuedAt)
    .digest("hex");

  try {
    const validSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!validSignature) return false;
  } catch {
    return false;
  }

  const maxAgeMs = 1000 * 60 * 60 * 12;
  const age = Date.now() - Number(issuedAt);

  return Number.isFinite(age) && age >= 0 && age < maxAgeMs;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return verifyAdminToken(token);
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
