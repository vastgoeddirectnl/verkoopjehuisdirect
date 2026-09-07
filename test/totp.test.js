import test from "node:test";
import assert from "node:assert/strict";

import { generateTotpSecret, generateTotpCode, verifyTotpCode } from "../app/lib/totp.js";

/**
 * De tweede factor op /admin. Een fout hier betekent óf dat een geldige code
 * wordt geweigerd (admin buitengesloten) óf dat een verkeerde/oude code wordt
 * geaccepteerd (2FA is dan decoratie) — allebei onacceptabel.
 */

// RFC 4226 bijlage D: bekende HOTP-waarden bij een vast 20-byte secret
// ("12345678901234567890" in ASCII). "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ" is
// de base32-vorm van diezelfde ASCII-tekst en is het gangbare testsecret in
// TOTP-implementaties. RFC 6238 gebruikt dezelfde reeks voor de TOTP-variant.
const RFC_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
const RFC_CODES = [
  "755224", "287082", "359152", "969429", "338314",
  "254676", "287922", "162583", "399871", "520489",
];

test("bekende testvector (RFC 4226/6238) levert exact de gepubliceerde codes op", () => {
  const stapMs = 30_000;
  RFC_CODES.forEach((verwacht, counter) => {
    assert.equal(generateTotpCode(RFC_SECRET, counter * stapMs), verwacht, `stap ${counter}`);
  });
});

test("een zojuist gegenereerde code op hetzelfde moment is geldig", () => {
  const secret = generateTotpSecret();
  const nu = Date.now();
  assert.equal(verifyTotpCode(secret, generateTotpCode(secret, nu), { at: nu }), true);
});

test("een code blijft geldig binnen één tijdstap ervoor of erna", () => {
  const secret = generateTotpSecret();
  const nu = Date.now();
  const code = generateTotpCode(secret, nu);

  assert.equal(verifyTotpCode(secret, code, { at: nu + 25_000 }), true, "25s later, binnen de speling");
  assert.equal(verifyTotpCode(secret, code, { at: nu - 25_000 }), true, "25s eerder, binnen de speling");
});

test("een code buiten de toegestane speling wordt geweigerd", () => {
  const secret = generateTotpSecret();
  const nu = Date.now();
  const code = generateTotpCode(secret, nu);

  assert.equal(verifyTotpCode(secret, code, { at: nu + 95_000 }), false);
});

test("rommel, lege en verkeerd geformatteerde codes worden altijd geweigerd", () => {
  const secret = generateTotpSecret();
  for (const invoer of ["", null, undefined, "12345", "1234567", "abcdef", " 123456 ".trim() + "x"]) {
    assert.equal(verifyTotpCode(secret, invoer), false, `verwacht false voor ${JSON.stringify(invoer)}`);
  }
});

test("zonder secret is geen enkele code geldig", () => {
  assert.equal(verifyTotpCode("", "123456"), false);
  assert.equal(verifyTotpCode(undefined, "123456"), false);
});

test("een gegenereerd secret is base32 en levert zelf een geldige 6-cijferige code op", () => {
  const secret = generateTotpSecret();
  assert.match(secret, /^[A-Z2-7]+$/);
  assert.match(generateTotpCode(secret), /^\d{6}$/);
});

test("twee gegenereerde secrets zijn (zo goed als) altijd verschillend", () => {
  assert.notEqual(generateTotpSecret(), generateTotpSecret());
});
