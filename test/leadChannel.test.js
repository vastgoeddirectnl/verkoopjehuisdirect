import test from "node:test";
import assert from "node:assert/strict";

import { leadChannel, isTestLead, cleanLandingPath, parseLeadSourceDetails, LEAD_CHANNELS as K } from "../app/lib/sourceParser.js";

/**
 * SRC-01. De rapportage "leads per bron" groepeerde op het ruwe bronveld, en
 * dat bevat per advertentieklik een unieke gclid. Daardoor stond elke
 * Google Ads-lead op een eigen regel en was niet te zien welk kanaal werkt.
 * Deze tests gebruiken de vormen die echt in de database voorkomen.
 */

test("een advertentieklik is Google Ads, ook als de klik-ID alleen in de pagina-URL staat", () => {
  assert.equal(leadChannel({ bron: "gclid=Cj0KCQjw-MDTBhCgARIsAB | referrer=https://www.google.com/" }), K.googleAds);
  assert.equal(leadChannel({ bron: "gbraid=0AAAABDmROpoqXm7N-" }), K.googleAds);
  assert.equal(
    leadChannel({ bron: "referrer=https://www.google.com/", pagina: "/huis-verkopen-aan-opkoper?gad_source=1&gad_campaignid=239 · Huis verkopen aan een opkoper" }),
    K.googleAds
  );
});

test("Google zonder klik-ID is organisch zoekverkeer", () => {
  assert.equal(leadChannel({ bron: "referrer=https://www.google.com/" }), K.googleOrganic);
  assert.equal(leadChannel({ bron: "referrer=https://www.google.nl/" }), K.googleOrganic);
});

test("ChatGPT en andere AI-assistenten worden herkend, ook met tikfout bij handmatige invoer", () => {
  assert.equal(leadChannel({ bron: "utm_source=chatgpt.com" }), K.ai);
  assert.equal(leadChannel({ bron: "Chatgtp" }), K.ai);
  assert.equal(leadChannel({ bron: "referrer=https://www.perplexity.ai/" }), K.ai);
});

test("Facebook en Instagram vallen onder één kanaal", () => {
  assert.equal(leadChannel({ bron: "utm_source=facebook | utm_medium=paid_social" }), K.social);
  assert.equal(leadChannel({ bron: "referrer=https://l.facebook.com/" }), K.social);
  assert.equal(leadChannel({ bron: "referrer=https://www.instagram.com/" }), K.social);
});

test("testverkeer telt niet mee als echte aanvraag", () => {
  assert.equal(leadChannel({ bron: "https://tagassistant.google.com/" }), K.test);
  assert.equal(leadChannel({ bron: "referrer=https://tagassistant.google.com/ | gclid=abc" }), K.test, "Tag Assistant met klik-ID is nog steeds een test");
  assert.equal(leadChannel({ bron: "https://vercel.com/" }), K.test);
  assert.equal(isTestLead({ bron: "https://tagassistant.google.com/" }), true);
  assert.equal(isTestLead({ bron: "direct" }), false);
});

test("handmatig ingevoerde bronnen krijgen een herkenbaar kanaal", () => {
  assert.equal(leadChannel({ bron: "Telefonisch", pagina: "Handmatig ingevoerd" }), K.phone);
  assert.equal(leadChannel({ bron: "Mail" }), K.email);
  assert.equal(leadChannel({ bron: "WhatsApp" }), K.whatsapp);
  assert.equal(leadChannel({ bron: "Netwerk van een kennis", pagina: "Handmatig ingevoerd" }), K.manual);
});

test("een verwijzing van een andere site is een verwijzing, van de eigen site is direct", () => {
  assert.equal(leadChannel({ bron: "referrer=https://www.funda.nl/koop/" }), K.referral);
  assert.equal(leadChannel({ bron: "referrer=https://www.vastgoeddirectnederland.nl/situaties" }), K.direct);
  assert.equal(leadChannel({ bron: "https://www.verkoopjehuisdirect.nl/" }), K.direct, "oud domein, kale URL als bron");
  assert.equal(leadChannel({ bron: "direct" }), K.direct);
});

test("een leeg bronveld is onbekend", () => {
  assert.equal(leadChannel({}), K.unknown);
  assert.equal(leadChannel({ bron: "", pagina: "" }), K.unknown);
});

test("het landingspad wordt zonder querystring en paginatitel gegroepeerd", () => {
  assert.equal(cleanLandingPath("/huis-verkopen-aan-opkoper?gad_source=1&gclid=abc · Huis verkopen aan een opkoper"), "/huis-verkopen-aan-opkoper");
  assert.equal(cleanLandingPath("/ · Home"), "/");
  assert.equal(cleanLandingPath(""), "/");
  // attribution.js scheidt pad en titel met " | ", oudere records met " · ".
  assert.equal(cleanLandingPath("/huis-direct-verkopen | Huis direct verkopen"), "/huis-direct-verkopen");
  assert.equal(cleanLandingPath("/ | Homepage"), "/");
});

test("parseLeadSourceDetails haalt de klik-ID ook uit een oude pagina-URL", () => {
  const details = parseLeadSourceDetails({ bron: "direct", pagina: "/huis-snel-verkopen?gclid=xyz&utm_campaign=najaar · Huis snel verkopen" });
  assert.equal(details.clickId, "xyz");
  assert.equal(details.campaign, "najaar");
  assert.equal(details.pagePath, "/huis-snel-verkopen");
});
