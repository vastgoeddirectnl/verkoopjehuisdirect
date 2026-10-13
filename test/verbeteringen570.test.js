import test from "node:test";
import assert from "node:assert/strict";

import { buildSourceLabel, externalReferrer, nextLandingRecord } from "../app/lib/attribution.js";
import { addressFromPdokDoc, isInWerkgebied, normalizeProvince, WERKGEBIED_PROVINCIES } from "../app/lib/address.js";
import { calculateLeadAutomation, followUpPlan, STALE_AFTER_DAYS } from "../app/lib/automation.js";
import { internalLeadSubject } from "../app/lib/leadSummary.js";
import { proposalAlertContent, whatsappNumber } from "../app/lib/proposalAlertContent.js";
import { normalizeLead } from "../app/lib/leadValidation.js";
import { leadChannel, LEAD_CHANNELS, parseLeadSourceDetails } from "../app/lib/sourceParser.js";

// ---------------------------------------------------------------- toelichting

test("een gewone toelichting en de adrescontrole blijven volledig bewaard", () => {
  const toelichting = "De woning is van mijn moeder die vorig jaar is overleden. We zijn met drie erfgenamen en willen graag snel duidelijkheid. Er is lekkage in de badkamer.";
  const reden = ["Termijn: Binnen 3 maanden", `Toelichting: ${toelichting}`, "Adrescontrole: Dirk Breebaartstraat 4, 1624PH Hoorn"].join(" | ");
  assert.equal(normalizeLead({ reden }).reden, reden);
});

// ---------------------------------------------------------------- herkomst

test("de eigen site telt niet als verwijzer, een zoekmachine wel", () => {
  assert.equal(externalReferrer("https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-erfenis"), "");
  assert.equal(externalReferrer("https://verkoopjehuisdirect.nl/"), "");
  assert.equal(externalReferrer("https://www.google.com/"), "https://www.google.com/");
  assert.equal(externalReferrer("geen url"), "");
});

test("de eerste binnenkomst van een bezoek blijft staan bij doorklikken", () => {
  const eerste = nextLandingRecord({ search: "?gclid=abc&utm_source=google", referrer: "https://www.google.com/", path: "/huis-verkopen-bij-erfenis", now: 1 });
  assert.deepEqual(eerste.tracking, ["utm_source=google", "gclid=abc"]);

  // Doorklikken binnen de site: niets nieuws, dus geen nieuwe registratie.
  assert.equal(nextLandingRecord({ stored: eerste, referrer: "https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-erfenis", path: "/huis-verkopen-na-overlijden" }), null);

  // Een nieuwe advertentieklik in hetzelfde bezoek vervangt de oude.
  const tweede = nextLandingRecord({ stored: eerste, search: "?gclid=xyz", path: "/" });
  assert.deepEqual(tweede.tracking, ["gclid=xyz"]);
});

test("een externe verwijzer vervangt een eerdere directe binnenkomst, maar geen advertentieklik", () => {
  const direct = nextLandingRecord({ path: "/" });
  const viaBing = nextLandingRecord({ stored: direct, referrer: "https://www.bing.com/", path: "/huis-snel-verkopen" });
  assert.equal(viaBing.referrer, "https://www.bing.com/");

  const advertentie = nextLandingRecord({ search: "?gclid=abc", path: "/" });
  assert.equal(nextLandingRecord({ stored: advertentie, referrer: "https://www.bing.com/", path: "/x" }), null);
});

test("een aanvraag na doorklikken houdt het kanaal Google Ads en de landingspagina", () => {
  const stored = nextLandingRecord({ search: "?gclid=abc&utm_source=google&utm_medium=cpc", referrer: "https://www.google.com/", path: "/huis-verkopen-bij-erfenis" });
  const bron = buildSourceLabel({
    currentSearch: "",
    currentReferrer: "https://www.vastgoeddirectnederland.nl/huis-verkopen-bij-erfenis",
    stored,
    pagePath: "/huis-verkopen-na-overlijden",
  });

  assert.match(bron, /gclid=abc/);
  assert.match(bron, /landing=\/huis-verkopen-bij-erfenis/);
  assert.equal(leadChannel({ bron, pagina: "/huis-verkopen-na-overlijden" }), LEAD_CHANNELS.googleAds);
  assert.equal(parseLeadSourceDetails({ bron }).entryPath, "/huis-verkopen-bij-erfenis");
});

test("zonder enige herkomst blijft het bronveld 'direct'", () => {
  assert.equal(buildSourceLabel({ pagePath: "/" }), "direct");
  const bron = buildSourceLabel({ currentReferrer: "https://chatgpt.com/", pagePath: "/" });
  assert.equal(bron, "referrer=https://chatgpt.com/");
  assert.equal(leadChannel({ bron }), LEAD_CHANNELS.ai);
});

// ---------------------------------------------------------------- adres en werkgebied

test("PDOK schrijft Fryslân; voor ons is dat Friesland", () => {
  assert.equal(normalizeProvince("Fryslân"), "Friesland");
  assert.equal(normalizeProvince("Flevoland"), "Flevoland");
});

test("Flevoland hoort bij het werkgebied, Noord-Holland niet, onbekend is onbekend", () => {
  assert.ok(WERKGEBIED_PROVINCIES.includes("Flevoland"));
  assert.equal(isInWerkgebied("Flevoland"), true);
  assert.equal(isInWerkgebied("Fryslân"), true);
  assert.equal(isInWerkgebied("Noord-Holland"), false);
  assert.equal(isInWerkgebied(""), null);
});

test("een PDOK-adres wordt omgezet naar plaats, gemeente en provincie", () => {
  const adres = addressFromPdokDoc({
    straatnaam: "Stationsplein", huisnummer: 1, huisletter: "A", postcode: "1315KT",
    woonplaatsnaam: "Almere", gemeentenaam: "Almere", provincienaam: "Flevoland",
    weergavenaam: "Stationsplein 1A, 1315KT Almere",
  });
  assert.equal(adres.city, "Almere");
  assert.equal(adres.province, "Flevoland");
  assert.equal(adres.houseNumber, "1A");
  assert.equal(addressFromPdokDoc(null), null);
});

// ---------------------------------------------------------------- score

const basis = { naam: "Test", telefoon: "0612345678", email: "a@b.nl", postcode: "1624PH", huisnummer: "4", status: "Nieuwe aanvraag", created_at: "2026-10-12T10:00:00Z" };
const NU = new Date("2026-10-13T08:00:00Z");

test("'direct' in het bronveld is geen haast meer", () => {
  const lead = { ...basis, staat: "Geen bijzonderheden", reden: "Termijn: Ik oriënteer mij alleen", pagina: "/ | Homepage", bron: "direct" };
  const { reasons } = calculateLeadAutomation(lead, { now: NU });
  assert.ok(!reasons.includes("duidelijke behoefte aan snelheid/duidelijkheid"));
  assert.ok(reasons.includes("oriënteert zich nog"));
});

test("de titel van een landingspagina in 'reden' telt niet als klantwens", () => {
  const lead = { ...basis, staat: "Niet ingevuld", reden: "Campagne landingspagina: Huis snel verkopen", pagina: "/huis-snel-verkopen", bron: "direct" };
  const { reasons } = calculateLeadAutomation(lead, { now: NU });
  assert.ok(!reasons.includes("duidelijke behoefte aan snelheid/duidelijkheid"));
  assert.ok(reasons.includes("binnengekomen via relevante pagina/bron"), "de pagina telt wel als relevante bron");
});

test("de provincie bepaalt het werkgebied, ook als het woord nergens in de tekst staat", () => {
  const binnen = calculateLeadAutomation({ ...basis, provincie: "Flevoland" }, { now: NU });
  const buiten = calculateLeadAutomation({ ...basis, provincie: "Noord-Holland" }, { now: NU });
  assert.ok(binnen.reasons.some((r) => r.includes("in het werkgebied (Flevoland)")));
  assert.ok(buiten.reasons.some((r) => r.includes("buiten het werkgebied")));
  assert.equal(binnen.score - buiten.score, 3);
});

// ---------------------------------------------------------------- opvolging

test("een bekeken voorstel zonder activiteit sinds juni is stilgevallen, niet elke dag 'vandaag'", () => {
  const plan = followUpPlan({ ...basis, status: "Voorstel bekeken", created_at: "2026-06-28T10:00:00Z", proposal_viewed_at: "2026-07-01T10:00:00Z" }, { now: NU });
  assert.equal(plan.stale, true);
  assert.equal(plan.nextFollowUpAt, null);
  assert.equal(STALE_AFTER_DAYS, 30);
});

test("opnieuw bekeken na het laatste contact: bellen op de dag van bekijken", () => {
  const plan = followUpPlan({ ...basis, status: "Voorstel bekeken", created_at: "2026-10-01T10:00:00Z", last_contact_at: "2026-10-05T10:00:00Z", last_proposal_view_at: "2026-10-10T10:00:00Z" }, { now: NU });
  assert.equal(plan.nextFollowUpAt, "2026-10-10");
});

test("na het nabellen pas drie dagen later weer", () => {
  const plan = followUpPlan({ ...basis, status: "Voorstel bekeken", created_at: "2026-10-01T10:00:00Z", last_contact_at: "2026-10-11T10:00:00Z", last_proposal_view_at: "2026-10-10T10:00:00Z" }, { now: NU });
  assert.equal(plan.nextFollowUpAt, "2026-10-14");
});

test("'Voorstel verzonden' schuift niet meer elke dag op: twee dagen na het verzenden", () => {
  const plan = followUpPlan({ ...basis, status: "Voorstel verzonden", created_at: "2026-10-01T10:00:00Z", last_contact_at: "2026-10-08T10:00:00Z" }, { now: NU });
  assert.equal(plan.nextFollowUpAt, "2026-10-10");
});

test("een reactie op de voorstelpagina na lange stilte maakt de lead weer actief", () => {
  const lead = { ...basis, status: "In onderhandeling", created_at: "2026-06-01T10:00:00Z", last_contact_at: "2026-07-01T10:00:00Z", last_customer_reaction_at: "2026-10-12T20:00:00Z" };
  const plan = followUpPlan(lead, { now: NU });
  assert.equal(plan.stale, false);
  assert.equal(plan.nextFollowUpAt, "2026-10-14");
});

test("gearchiveerde leads krijgen geen opvolging", () => {
  assert.equal(followUpPlan({ ...basis, status: "Gearchiveerd" }, { now: NU }).nextFollowUpAt, null);
});

// ---------------------------------------------------------------- meldingen

test("het onderwerp van de interne melding noemt plaats, werkgebied, situatie en kanaal", () => {
  const subject = internalLeadSubject({ postcode: "1624PH", plaats: "Hoorn", provincie: "Noord-Holland", staat: "Erfenis / nalatenschap", bron: "utm_source=chatgpt.com" });
  assert.equal(subject, "Nieuwe aanvraag: Hoorn (buiten werkgebied) · Erfenis / nalatenschap · via AI-assistent (ChatGPT e.d.)");

  const zonderPlaats = internalLeadSubject({ postcode: "9501AB", staat: "Geen bijzonderheden", bron: "direct" });
  assert.equal(zonderPlaats, "Nieuwe aanvraag: 9501AB · via Direct");
});

test("whatsappNumber maakt van een 06-nummer een internationaal nummer", () => {
  assert.equal(whatsappNumber("06 12 23 80 51"), "31612238051");
  assert.equal(whatsappNumber("+31612238051"), "31612238051");
  assert.equal(whatsappNumber("123"), "");
});

test("de melding bij akkoord noemt de klant, het bericht en een link naar de lead", () => {
  const mail = proposalAlertContent({
    kind: "interested",
    lead: { naam: "J. de Vries", telefoon: "0612345678" },
    proposal: { lead_id: "lead-1", property_address: "Dorpsstraat 1, Assen" },
    message: "Graag <morgen> bellen",
    baseUrl: "https://example.nl",
  });
  assert.equal(mail.subject, "Akkoord op voorstel: J. de Vries (Dorpsstraat 1, Assen)");
  assert.match(mail.html, /https:\/\/example\.nl\/admin\/leads\/lead-1/);
  assert.match(mail.html, /wa\.me\/31612345678/);
  assert.match(mail.html, /Graag &lt;morgen&gt; bellen/, "het bericht van de klant wordt ge-escaped");
  assert.equal(proposalAlertContent({ kind: "onbekend" }), null);
});
