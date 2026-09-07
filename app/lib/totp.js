// TOTP (RFC 6238, op HOTP uit RFC 4226) voor de tweede factor op /admin.
//
// Bewust geen dependency: het algoritme is klein genoeg (HMAC-SHA1 op een
// tijdteller, plus base32) en dit is precies het soort code waar je zelf de
// timing-safe vergelijking en de invoervalidatie wilt controleren. Puur en
// zonder afhankelijkheid van next/headers, dus rechtstreeks testbaar onder
// `node --test`, net als app/lib/adminAuth.js.

import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;
const DIGITS = 6;

function base32Encode(bytes) {
  let bits = "";
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");

  let output = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    output += BASE32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  // Restbits (< 5) leveren geen vol symbool op en vallen weg, zoals bij
  // base32 zonder padding gebruikelijk is.
  return output;
}

function base32Decode(value) {
  const cleaned = String(value || "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) continue;
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/** Genereert een nieuw secret voor eenmalige inrichting van de authenticator-app. */
export function generateTotpSecret(byteLength = 20) {
  return base32Encode(crypto.randomBytes(byteLength));
}

function hotp(secretBytes, counter) {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac("sha1", secretBytes).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binary % 10 ** DIGITS).padStart(DIGITS, "0");
}

/** Vooral voor tests en de inrichtingsscript; de login zelf gebruikt verifyTotpCode. */
export function generateTotpCode(secret, at = Date.now()) {
  const counter = Math.floor(at / 1000 / STEP_SECONDS);
  return hotp(base32Decode(secret), counter);
}

function safeEqualDigits(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Controleert een 6-cijferige TOTP-code, met één stap speling voor en na
 * (±30s) om een klein kloktikverschil tussen server en telefoon op te vangen.
 */
export function verifyTotpCode(secret, code, { at = Date.now(), window = 1 } = {}) {
  const normalized = String(code ?? "").trim();
  if (!/^\d{6}$/.test(normalized)) return false;

  const secretBytes = base32Decode(secret);
  if (!secretBytes.length) return false;

  const counter = Math.floor(at / 1000 / STEP_SECONDS);
  for (let drift = -window; drift <= window; drift += 1) {
    if (safeEqualDigits(hotp(secretBytes, counter + drift), normalized)) return true;
  }
  return false;
}
