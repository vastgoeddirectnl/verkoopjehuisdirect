import crypto from "crypto";
import { verifyTotpCode } from "./totp.js";

const COOKIE = "vdn_admin_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function hasAdminSessionSecret() {
  return Boolean(secret());
}

export function hasAdminTotpSecret() {
  return Boolean(process.env.ADMIN_TOTP_SECRET);
}

/**
 * Tweede factor bovenop ADMIN_PASSWORD. Eén gedeeld secret, geen aparte
 * accounts — zelfde model als het wachtwoord zelf. Zie ADMIN_TOTP_SECRET in
 * het README en scripts/generate-totp-secret.js voor de inrichting.
 */
export function verifyAdminTotpCode(code) {
  return verifyTotpCode(process.env.ADMIN_TOTP_SECRET, code);
}

/**
 * Korte vingerafdruk van het huidige adminwachtwoord.
 *
 * Die reist mee in het token, zodat een wachtwoordwijziging in Vercel alle
 * lopende sessies meteen ongeldig maakt. Zonder dit blijft iemand die is
 * ingelogd nog twaalf uur binnen, juist op het moment dat je dat niet wilt.
 */
function passwordFingerprint() {
  return crypto
    .createHash("sha256")
    .update(process.env.ADMIN_PASSWORD || "")
    .digest("hex")
    .slice(0, 8);
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
  const payload = `${issued}.${nonce}.${passwordFingerprint()}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token) {
  if (!token || !secret()) return false;

  const [issued, nonce, fingerprint, sig] = String(token).split(".");
  if (
    !issued ||
    !nonce ||
    !fingerprint ||
    !sig ||
    !/^\d+$/.test(issued) ||
    !/^[a-f0-9]{32}$/i.test(nonce) ||
    !/^[a-f0-9]{8}$/i.test(fingerprint)
  ) {
    return false;
  }

  // Wachtwoord gewijzigd sinds dit token is uitgegeven: sessie is ongeldig.
  if (fingerprint !== passwordFingerprint()) return false;

  const payload = `${issued}.${nonce}.${fingerprint}`;
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
  // Dynamische import i.p.v. een top-level import van "next/headers": dat
  // module bestaat alleen binnen de Next.js-runtime. createAdminToken/
  // verifyAdminToken/safeEqualText zijn pure functies zonder die afhankelijk-
  // heid — met een top-level import kon dit bestand niet eens geladen worden
  // door test/adminAuth.test.js onder gewone `node --test`.
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE)?.value);
}

export function adminCookieName() {
  return COOKIE;
}
