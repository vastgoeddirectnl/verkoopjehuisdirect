import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { createAdminToken, verifyAdminToken, safeEqualText } from "../app/lib/adminAuth.js";

const SECRET = "test-secret-voor-de-unit-tests-lang-genoeg";

function metOmgeving({ password = "geheim123", secret = SECRET } = {}, fn) {
  const vorigePassword = process.env.ADMIN_PASSWORD;
  const vorigeSecret = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_PASSWORD = password;
  process.env.ADMIN_SESSION_SECRET = secret;
  try {
    return fn();
  } finally {
    process.env.ADMIN_PASSWORD = vorigePassword;
    process.env.ADMIN_SESSION_SECRET = vorigeSecret;
  }
}

/** Bouwt een token met een zelfgekozen uitgiftetijd, om verlopen sessies te testen. */
function tokenMetLeeftijd(msGeleden, password = "geheim123") {
  const issued = String(Date.now() - msGeleden);
  const nonce = crypto.randomBytes(16).toString("hex");
  const fingerprint = crypto.createHash("sha256").update(password).digest("hex").slice(0, 8);
  const payload = `${issued}.${nonce}.${fingerprint}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

test("een vers token is geldig", () => {
  metOmgeving({}, () => {
    assert.equal(verifyAdminToken(createAdminToken()), true);
  });
});

test("een gemanipuleerde signature wordt afgewezen", () => {
  metOmgeving({}, () => {
    const token = createAdminToken();
    const delen = token.split(".");
    delen[3] = delen[3].replace(/.$/, (c) => (c === "a" ? "b" : "a"));
    assert.equal(verifyAdminToken(delen.join(".")), false);
  });
});

test("een gewijzigd wachtwoord maakt bestaande sessies ongeldig", () => {
  const token = metOmgeving({ password: "oud-wachtwoord" }, () => createAdminToken());

  metOmgeving({ password: "oud-wachtwoord" }, () => {
    assert.equal(verifyAdminToken(token), true);
  });

  metOmgeving({ password: "nieuw-wachtwoord" }, () => {
    assert.equal(verifyAdminToken(token), false);
  });
});

test("een token in het oude formaat zonder vingerafdruk wordt afgewezen", () => {
  metOmgeving({}, () => {
    const issued = String(Date.now());
    const nonce = crypto.randomBytes(16).toString("hex");
    const payload = `${issued}.${nonce}`;
    const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    assert.equal(verifyAdminToken(`${payload}.${sig}`), false);
  });
});

test("een token ouder dan twaalf uur is verlopen", () => {
  metOmgeving({}, () => {
    const eenUur = 1000 * 60 * 60;
    assert.equal(verifyAdminToken(tokenMetLeeftijd(eenUur * 11)), true);
    assert.equal(verifyAdminToken(tokenMetLeeftijd(eenUur * 13)), false);
  });
});

test("een token uit de toekomst wordt afgewezen", () => {
  metOmgeving({}, () => {
    assert.equal(verifyAdminToken(tokenMetLeeftijd(-60000)), false);
  });
});

test("rommel en lege invoer worden afgewezen", () => {
  metOmgeving({}, () => {
    for (const invoer of ["", null, undefined, "abc", "1.2.3.4", "....", "x".repeat(200)]) {
      assert.equal(verifyAdminToken(invoer), false, `verwacht false voor ${JSON.stringify(invoer)}`);
    }
  });
});

test("zonder ADMIN_SESSION_SECRET is geen enkel token geldig", () => {
  const token = metOmgeving({}, () => createAdminToken());
  metOmgeving({ secret: "" }, () => {
    assert.equal(verifyAdminToken(token), false);
  });
});

test("createAdminToken weigert te werken zonder secret", () => {
  metOmgeving({ secret: "" }, () => {
    assert.throws(() => createAdminToken(), /ADMIN_SESSION_SECRET/);
  });
});

test("safeEqualText vergelijkt zonder te struikelen over lengteverschil", () => {
  assert.equal(safeEqualText("abc", "abc"), true);
  assert.equal(safeEqualText("abc", "abd"), false);
  assert.equal(safeEqualText("abc", "abcd"), false);
  assert.equal(safeEqualText("", ""), true);
  assert.equal(safeEqualText(null, undefined), true);
});
