import test from "node:test";
import assert from "node:assert/strict";

import { hasUsableEmail, isValidEmail } from "../app/lib/admin/validators.js";
import { parseLeadSourceDetails, sourceChannelLabel } from "../app/lib/sourceParser.js";

test("isValidEmail eist een apenstaartje en een punt in het domein", () => {
  assert.equal(isValidEmail("rob@vastgoeddirectnederland.nl"), true);
  assert.equal(isValidEmail("  rob@example.com  "), true);
  assert.equal(isValidEmail("rob@example"), false);
  assert.equal(isValidEmail("rob apenstaart example.nl"), false);
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail(null), false);
});

test("hasUsableEmail keurt lege invoer af, ook als die uit spaties bestaat", () => {
  assert.equal(hasUsableEmail("rob@example.com"), true);
  assert.equal(hasUsableEmail("   "), false);
  assert.equal(hasUsableEmail(undefined), false);
});

test("parseLeadSourceDetails pelt de UTM-parameters uit het bronveld", () => {
  const details = parseLeadSourceDetails({
    bron: "utm_source=google | utm_medium=cpc | utm_campaign=voorjaar | gclid=abc123",
    pagina: "/huis-snel-verkopen · Huis snel verkopen",
  });

  assert.equal(details.source, "google");
  assert.equal(details.medium, "cpc");
  assert.equal(details.campaign, "voorjaar");
  assert.equal(details.clickId, "abc123");
  assert.equal(details.pagePath, "/huis-snel-verkopen");
  assert.equal(details.pageTitle, "Huis snel verkopen");
});

test("parseLeadSourceDetails komt om met een leeg of onbekend bronveld", () => {
  const leeg = parseLeadSourceDetails({});
  assert.equal(leeg.source, "");
  assert.equal(leeg.clickId, "");

  const direct = parseLeadSourceDetails({ bron: "direct", pagina: "/" });
  assert.equal(direct.source, "direct");
  assert.equal(direct.pagePath, "/");
});

test("sourceChannelLabel herkent het advertentiekanaal", () => {
  assert.equal(sourceChannelLabel({ clickId: "abc123" }), "Google Ads");
  assert.equal(sourceChannelLabel({ source: "google", medium: "organic" }), "Google Ads");
  assert.equal(sourceChannelLabel({ medium: "cpc" }), "Google Ads");
  assert.equal(sourceChannelLabel({ source: "direct" }), "Direct");
  assert.equal(sourceChannelLabel({ referrer: "https://www.funda.nl" }), "Verwijzende website");
  assert.equal(sourceChannelLabel({ pagePath: "/huis-verkopen-emmen" }), "Website / SEO");
  assert.equal(sourceChannelLabel({}), "Onbekend");
});
