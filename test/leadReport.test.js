import test from "node:test";
import assert from "node:assert/strict";

import { aggregateLeadMarketing } from "../app/lib/admin/leadReport.js";

const leads = [
  { bron: "gclid=AAA | referrer=https://www.google.com/", pagina: "/huis-verkopen-aan-opkoper?gclid=AAA · Opkoper", status: "Akkoord", created_at: "2026-09-02T10:00:00Z" },
  { bron: "gclid=BBB", pagina: "/huis-verkopen-aan-opkoper · Opkoper", status: "Voorstel bekeken", created_at: "2026-09-20T10:00:00Z" },
  { bron: "referrer=https://www.google.com/", pagina: "/huis-verkopen-emmen · Emmen", status: "Nieuw", created_at: "2026-08-15T10:00:00Z" },
  { bron: "https://tagassistant.google.com/", pagina: "/ · Home", status: "Gearchiveerd", created_at: "2026-09-01T10:00:00Z" },
  { bron: "utm_source=chatgpt.com", pagina: "/", status: "Afgerond", created_at: "2026-10-01T10:00:00Z" },
];

test("advertentieleads met verschillende klik-ID's tellen samen als één kanaal", () => {
  const { byChannel } = aggregateLeadMarketing(leads);
  const ads = byChannel.find((row) => row.label === "Google Ads");
  assert.equal(ads.total, 2);
  assert.equal(ads.won, 1, "één daarvan werd een deal");
});

test("testaanvragen tellen niet mee, maar worden wel gemeld", () => {
  const report = aggregateLeadMarketing(leads);
  assert.equal(report.testCount, 1);
  assert.equal(report.total, 4);
  assert.ok(!report.byChannel.some((row) => row.label === "Test"));
});

test("landingspagina's worden zonder trackingparameters gegroepeerd", () => {
  const { byPage } = aggregateLeadMarketing(leads);
  assert.equal(byPage[0].label, "/huis-verkopen-aan-opkoper");
  assert.equal(byPage[0].total, 2);
});

test("maanden staan nieuwste eerst en tellen deals mee", () => {
  const { byMonth } = aggregateLeadMarketing(leads);
  assert.deepEqual(byMonth.map((row) => row.label), ["2026-10", "2026-09", "2026-08"]);
  assert.equal(byMonth[1].won, 1);
});

test("Afgerond telt niet als deal, alleen Akkoord", () => {
  const { byChannel, byMonth } = aggregateLeadMarketing(leads);
  assert.equal(byChannel.find((row) => row.label.startsWith("AI-assistent")).won, 0);
  assert.equal(byMonth[0].won, 0);
});

test("een lege lijst levert een lege rapportage op", () => {
  const report = aggregateLeadMarketing([]);
  assert.equal(report.total, 0);
  assert.deepEqual(report.byChannel, []);
});
