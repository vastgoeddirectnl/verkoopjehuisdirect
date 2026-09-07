import test from "node:test";
import assert from "node:assert/strict";

import { buildErrorReport, reportError, resetErrorThrottle } from "../app/lib/reportError.js";

/**
 * De foutmelder mag zelf nooit een request laten omvallen, en mag geen
 * persoonsgegevens de logs in schrijven.
 */

function vangLogs(fn) {
  const regels = [];
  const origError = console.error;
  const origWarn = console.warn;
  console.error = (...a) => regels.push(["error", a.join(" ")]);
  console.warn = (...a) => regels.push(["warn", a.join(" ")]);
  return Promise.resolve(fn()).finally(() => {
    console.error = origError;
    console.warn = origWarn;
  }).then(() => regels);
}

test("de melding heeft een vaste, doorzoekbare vorm", () => {
  const r = buildErrorReport({ scope: "api/leads", error: new Error("stuk"), severity: "critical" });
  assert.equal(r.tag, "[vdn-error]");
  assert.equal(r.scope, "api/leads");
  assert.equal(r.severity, "critical");
  assert.equal(r.message, "stuk");
  assert.match(r.at, /^\d{4}-\d{2}-\d{2}T/);
});

test("een onbekende severity valt terug op waarschuwing", () => {
  assert.equal(buildErrorReport({ scope: "x", error: "y", severity: "paniek" }).severity, "warning");
  assert.equal(buildErrorReport({ scope: "x", error: "y" }).severity, "warning");
});

test("een fout als losse tekst of zonder message levert geen crash op", () => {
  assert.equal(buildErrorReport({ scope: "x", error: "kapot" }).message, "kapot");
  assert.equal(buildErrorReport({ scope: "x", error: null }).message, "");
  assert.equal(buildErrorReport({}).scope, "onbekend");
});

test("lege contextwaarden worden weggelaten", () => {
  const r = buildErrorReport({
    scope: "x",
    error: "y",
    context: { lead_id: "abc", leeg: null, ook_leeg: undefined, nul: 0 },
  });
  assert.deepEqual(r.context, { lead_id: "abc", nul: 0 }, "0 is een waarde, null en undefined niet");
});

test("kritieke meldingen gaan naar console.error, waarschuwingen naar console.warn", async () => {
  const regels = await vangLogs(async () => {
    await reportError({ scope: "test/kritiek", error: new Error("a"), severity: "critical" });
    await reportError({ scope: "test/waarschuwing", error: new Error("b") });
  });

  assert.equal(regels.length, 2);
  assert.equal(regels[0][0], "error");
  assert.equal(regels[1][0], "warn");
  assert.ok(regels.every(([, tekst]) => tekst.startsWith("[vdn-error]")), "altijd doorzoekbaar op de tag");
});

test("de logregel is geldige JSON, zodat je erin kunt filteren", async () => {
  const regels = await vangLogs(() => reportError({ scope: "test/json", error: new Error("x"), context: { lead_id: "l1" } }));
  const json = JSON.parse(regels[0][1].replace("[vdn-error] ", ""));
  assert.equal(json.scope, "test/json");
  assert.equal(json.context.lead_id, "l1");
});

test("reportError gooit nooit, ook niet bij rare invoer", async () => {
  await vangLogs(async () => {
    await assert.doesNotReject(() => reportError());
    await assert.doesNotReject(() => reportError({ scope: 123, error: { toString() { throw new Error("boem"); } } }));
    const kringloop = {}; kringloop.zelf = kringloop;
    await assert.doesNotReject(() => reportError({ scope: "x", error: "y", context: { kringloop } }));
  });
});

test("zonder mailconfiguratie wordt er geen storingsmail geprobeerd", async () => {
  const vorige = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  resetErrorThrottle();
  try {
    await vangLogs(() => reportError({ scope: "test/geen-mail", error: new Error("x"), severity: "critical" }));
  } finally {
    if (vorige !== undefined) process.env.RESEND_API_KEY = vorige;
  }
  // Geen assertie op de mail zelf: het punt is dat dit niet gooit en niet hangt.
});

test("zonder SENTRY_DSN blijft reportError ongewijzigd werken (MON-01)", async () => {
  const vorige = process.env.SENTRY_DSN;
  delete process.env.SENTRY_DSN;
  resetErrorThrottle();
  try {
    await vangLogs(() => reportError({ scope: "test/geen-sentry", error: new Error("x") }));
  } finally {
    if (vorige !== undefined) process.env.SENTRY_DSN = vorige;
  }
  // @sentry/nextjs wordt bij een lege SENTRY_DSN nooit geïmporteerd; dit
  // bevestigt alleen dat de rest van de foutafhandeling daar niet van afhangt.
});

test("met SENTRY_DSN gezet faalt reportError niet, ook zonder geïnitialiseerde Sentry-client", async () => {
  const vorige = process.env.SENTRY_DSN;
  process.env.SENTRY_DSN = "https://fake@o0.ingest.sentry.io/0";
  resetErrorThrottle();
  try {
    await assert.doesNotReject(() =>
      vangLogs(() => reportError({ scope: "test/sentry", error: new Error("x"), severity: "critical" }))
    );
  } finally {
    if (vorige === undefined) delete process.env.SENTRY_DSN;
    else process.env.SENTRY_DSN = vorige;
  }
});
