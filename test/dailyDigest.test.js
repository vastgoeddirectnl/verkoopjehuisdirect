import test from "node:test";
import assert from "node:assert/strict";

import { buildDailyDigest } from "../app/lib/admin/dailyDigest.js";

// CRON-01: de ochtendmail. Getest zonder database of mailprovider.
const base = { siteUrl: "https://www.example.nl", today: "2026-10-03" };

test("het onderwerp telt klantreacties, opvolgingen en nieuwe aanvragen", () => {
  const digest = buildDailyDigest({
    ...base,
    customerActions: [{ lead_id: "a", lead_naam: "Jan", event_type: "discuss", message: "Liefst gebeld: middag." }],
    followUps: [{ id: "b", naam: "Piet", status: "Voorstel bekeken", next_follow_up_at: "2026-10-03" }, { id: "c", naam: "Klaas", status: "Nieuw", next_follow_up_at: "2026-10-01" }],
    newLeads: [{ id: "d", naam: "Anna", postcode: "9711AB", huisnummer: "1", channel: "Google Ads" }],
  });
  assert.equal(digest.subject, "Vandaag: 1 klantreactie, 2 opvolgingen, 1 nieuwe aanvraag");
  assert.equal(digest.total, 4);
  assert.match(digest.html, /over tijd sinds/);
  assert.match(digest.html, /https:\/\/www\.example\.nl\/admin\/leads\/b/);
});

test("een rustige dag levert een korte mail op in plaats van een lege", () => {
  const digest = buildDailyDigest(base);
  assert.equal(digest.total, 0);
  assert.equal(digest.subject, "Vandaag: geen openstaande acties");
  assert.match(digest.html, /De automatisering is wel gedraaid/);
});

test("klantinvoer wordt ge-escaped", () => {
  const digest = buildDailyDigest({
    ...base,
    customerActions: [{ lead_id: "a", lead_naam: "<script>x</script>", event_type: "question", message: "<b>hoi</b>" }],
  });
  assert.doesNotMatch(digest.html, /<script>x<\/script>/);
  assert.doesNotMatch(digest.html, /<b>hoi<\/b>/);
});
