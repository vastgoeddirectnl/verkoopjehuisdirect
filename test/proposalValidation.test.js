import test from "node:test";
import assert from "node:assert/strict";

import {
  isSellerWorkComplete,
  parseProposalMoney,
  proposalReviewWarnings,
  proposalValidationIssues,
  sellerWorkDetails,
} from "../app/lib/proposalValidation.js";

/**
 * Deze bedragen gaan één op één naar de klant in het verkoopvoorstel.
 * Als de validatie een ander getal ziet dan de weergave, verstuur je een
 * voorstel dat niet klopt. Vandaar dat het parsegedrag hier is vastgelegd.
 */
test("parseProposalMoney leest Nederlandse bedragnotaties", () => {
  assert.equal(parseProposalMoney("€ 245.000"), 245000);
  assert.equal(parseProposalMoney("245000"), 245000);
  assert.equal(parseProposalMoney("245.000,50"), 245000.5);
  assert.equal(parseProposalMoney("€ 1.234.567"), 1234567);
  assert.equal(parseProposalMoney("2500,75"), 2500.75);
});

test("parseProposalMoney behandelt een losse punt met drie cijfers als duizendtal", () => {
  // Bewust vastgelegd: "1.234" is in deze context 1234, geen 1,234.
  assert.equal(parseProposalMoney("1.234"), 1234);
});

test("parseProposalMoney geeft 0 bij lege of niet-numerieke invoer", () => {
  assert.equal(parseProposalMoney(""), 0);
  assert.equal(parseProposalMoney(null), 0);
  assert.equal(parseProposalMoney(undefined), 0);
  assert.equal(parseProposalMoney("In overleg"), 0);
  assert.equal(parseProposalMoney("nader te bepalen"), 0);
});

test("parseProposalMoney levert nooit een negatief bedrag", () => {
  assert.equal(parseProposalMoney("-500"), 500);
});

test("een voorstel zonder bedrag is niet op te slaan", () => {
  const issues = proposalValidationIssues({});
  assert.equal(issues.length, 1);
  assert.match(issues[0], /bedrag/i);
});

test("een voorstel met alleen een bedrag mag als concept worden opgeslagen", () => {
  assert.deepEqual(proposalValidationIssues({ amount_text: "€ 245.000" }), []);
});

test("verzenden stelt strengere eisen dan opslaan", () => {
  const concept = { amount_text: "€ 245.000" };
  assert.deepEqual(proposalValidationIssues(concept), []);

  const bijVerzenden = proposalValidationIssues(concept, { forSending: true });
  assert.equal(bijVerzenden.length, 2);
  assert.ok(bijVerzenden.some((issue) => /geldigheidsdatum/i.test(issue)));
  assert.ok(bijVerzenden.some((issue) => /adres/i.test(issue)));
});

test("alleen postcode en huisnummer als adres wordt bij verzenden afgekeurd", () => {
  const issues = proposalValidationIssues(
    {
      amount_text: "€ 245.000",
      validity_date: "2026-04-15",
      property_address: "9501 AB 14",
    },
    { forSending: true }
  );
  assert.equal(issues.length, 1);
  assert.match(issues[0], /volledige straatadres/i);
});

test("een compleet voorstel is verzendklaar", () => {
  const issues = proposalValidationIssues(
    {
      amount_text: "€ 245.000",
      validity_date: "2026-04-15",
      property_address: "Hoofdstraat 14, 9501 AB Stadskanaal",
    },
    { forSending: true }
  );
  assert.deepEqual(issues, []);
});

test("bij werkzaamheden moet de basisprijs gelijk zijn aan het voorgestelde bedrag", () => {
  const details = sellerWorkDetails({
    amount_text: "€ 245.000",
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
    seller_work_total_price_text: "€ 260.000",
  });

  assert.equal(details.offer, 245000);
  assert.equal(details.expectedTotal, 260000);
  assert.equal(details.baseMatchesOffer, true);
  assert.equal(details.totalMatches, true);
});

test("een niet-kloppende totaalprijs bij werkzaamheden wordt gemeld", () => {
  const issues = proposalValidationIssues({
    amount_text: "€ 245.000",
    seller_work_enabled: true,
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
    seller_work_total_price_text: "€ 250.000",
    seller_work_description: "Dak herstellen",
    seller_work_deadline: "2026-05-01",
  });

  assert.equal(issues.length, 1);
  assert.match(issues[0], /totale koopprijs/i);
});

test("isSellerWorkComplete vraagt om alle velden", () => {
  const compleet = {
    amount_text: "€ 245.000",
    seller_work_enabled: true,
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
    seller_work_total_price_text: "€ 260.000",
    seller_work_description: "Dak herstellen",
    seller_work_deadline: "2026-05-01",
  };

  assert.equal(isSellerWorkComplete(compleet), true);
  assert.equal(isSellerWorkComplete({ ...compleet, seller_work_description: "" }), false);
  assert.equal(isSellerWorkComplete({ ...compleet, seller_work_enabled: false }), false);
});

test("een aanvullende betaling zonder percentage of periode wordt afgekeurd", () => {
  const issues = proposalValidationIssues({
    amount_text: "€ 245.000",
    resale_payment_enabled: true,
  });

  assert.equal(issues.length, 3);
  assert.ok(issues.some((issue) => /drempelbedrag/i.test(issue)));
  assert.ok(issues.some((issue) => /percentage/i.test(issue)));
  assert.ok(issues.some((issue) => /periode/i.test(issue)));
});

test("waarschuwingen blokkeren niet, maar melden wel een scheve vergelijking", () => {
  const warnings = proposalReviewWarnings({
    amount_text: "€ 200.000",
    direct_net_text: "€ 200.000",
    traditional_net_text: "€ 300.000",
  });

  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /netto-opbrengst/i);
});

test("een vage aanbetaling levert een waarschuwing op", () => {
  const warnings = proposalReviewWarnings({
    amount_text: "€ 245.000",
    deposit_text: "In overleg bespreekbaar",
  });

  assert.ok(warnings.some((warning) => /aanbetaling/i.test(warning)));
});
