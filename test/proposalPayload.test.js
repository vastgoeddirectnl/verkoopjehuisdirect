import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCalculatedProposalPayload,
  normalizeProposalForForm,
  applyAdditionalAgreementDefaults,
  defaultProposalForLead,
  DEFAULT_NONBINDING_TEXT,
} from "../app/lib/admin/leadDetail.js";

/**
 * TEST-01. Dit is de logica die bepaalt wat er bij het opslaan van een
 * voorstel daadwerkelijk in de database belandt — anders dan
 * proposalBerekening.test.js, dat alleen de bedragen dekt die de klant te
 * zien krijgt.
 */

// Intl.NumberFormat zet een non-breaking space achter het euroteken.
const sp = (tekst) => String(tekst).replace(/ /g, " ");

const LEAD = {
  id: "lead-1",
  naam: "Jan Jansen",
  email: "jan@example.nl",
  telefoon: "0612345678",
  postcode: "9711AB",
  huisnummer: "12",
  woningtype: "Tussenwoning",
  staat: "Goed onderhouden",
};

// ---------- applyAdditionalAgreementDefaults ----------

test("een leeg voorstel krijgt alle standaardwaarden voor aanvullende afspraken", () => {
  const result = applyAdditionalAgreementDefaults({});
  assert.equal(result.seller_work_enabled, false);
  assert.equal(result.seller_work_description, "");
  assert.equal(result.resale_deduct_courtage, true);
  assert.equal(result.resale_period_months, 12);
  assert.equal(result.object_usage_type, "Woon-winkelpand");
  assert.equal(result.current_occupancy_status, "Verhuurd");
  assert.equal(result.delivery_occupancy_status, "Vrij van huur en gebruik");
  assert.equal(result.tenant_cooperation_status, "Onbekend");
  assert.equal(result.nonbinding_text, DEFAULT_NONBINDING_TEXT);
});

test("werkzaamheden aan zonder eigen basisprijs: die valt terug op het voorgestelde bedrag", () => {
  const result = applyAdditionalAgreementDefaults({ seller_work_enabled: true, amount_text: "€ 250.000" });
  assert.equal(result.seller_work_base_price_text, "€ 250.000");
});

test("werkzaamheden uit: er wordt geen basisprijs verzonnen uit het voorgestelde bedrag", () => {
  const result = applyAdditionalAgreementDefaults({ seller_work_enabled: false, amount_text: "€ 250.000" });
  assert.equal(result.seller_work_base_price_text, "");
});

test("een expliciet ingevulde basisprijs wint van het voorgestelde bedrag", () => {
  const result = applyAdditionalAgreementDefaults({
    seller_work_enabled: true,
    amount_text: "€ 250.000",
    seller_work_base_price_text: "€ 245.000",
  });
  assert.equal(result.seller_work_base_price_text, "€ 245.000");
});

test("de totaalprijs bij werkzaamheden wordt afgeleid zolang hij nog ontbreekt", () => {
  const result = applyAdditionalAgreementDefaults({
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
  });
  assert.match(sp(result.seller_work_total_price_text), /260\.000/);
});

test("een al ingevulde totaalprijs wordt niet overschreven door de afleiding", () => {
  const result = applyAdditionalAgreementDefaults({
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
    seller_work_total_price_text: "€ 999.999",
  });
  assert.equal(result.seller_work_total_price_text, "€ 999.999");
});

test("resale_deduct_courtage staat standaard aan, maar een expliciete keuze blijft staan", () => {
  assert.equal(applyAdditionalAgreementDefaults({}).resale_deduct_courtage, true, "onbekend -> aan");
  assert.equal(applyAdditionalAgreementDefaults({ resale_deduct_courtage: false }).resale_deduct_courtage, false);
  assert.equal(applyAdditionalAgreementDefaults({ resale_deduct_courtage: true }).resale_deduct_courtage, true);
});

test("resale_period_months van 0 wordt behandeld als 'niet ingevuld' en krijgt de standaard 12", () => {
  // Bestaand gedrag van `current.resale_period_months || 12`: 0 is geldig als
  // aantal maanden, maar wordt door `||` niet onderscheiden van "leeg". Deze
  // test legt vast wat het systeem nu doet, niet wat wenselijk zou zijn.
  assert.equal(applyAdditionalAgreementDefaults({ resale_period_months: 0 }).resale_period_months, 12);
  assert.equal(applyAdditionalAgreementDefaults({ resale_period_months: 24 }).resale_period_months, 24);
});

test("tweemaal toepassen levert hetzelfde resultaat op", () => {
  const eerste = applyAdditionalAgreementDefaults({ seller_work_enabled: true, amount_text: "€ 250.000" });
  const tweede = applyAdditionalAgreementDefaults(eerste);
  assert.deepEqual(tweede, eerste);
});

// ---------- buildCalculatedProposalPayload ----------

test("bedragen worden herberekend en in het Nederlands opgemaakt teruggezet", () => {
  const payload = buildCalculatedProposalPayload({
    traditional_price_text: "300000",
    agent_costs_text: "5000",
    notary_costs_text: "800",
    renovation_costs_text: "15000",
    other_costs_text: "1000",
    amount_text: "275000",
  });

  assert.equal(sp(payload.traditional_price_text), "€ 300.000");
  // De kostenvelden zelf blijven excl. btw staan (zoals de gebruiker ze
  // invoert) en krijgen alleen het "-"-prefix van een aftrekpost; de 21% btw
  // wordt uitsluitend in de netto-opbrengstberekening zelf verwerkt.
  assert.equal(sp(payload.agent_costs_text), "- € 5.000");
  assert.equal(sp(payload.notary_costs_text), "- € 800");
  assert.equal(sp(payload.renovation_costs_text), "- € 15.000");
  assert.equal(sp(payload.other_costs_text), "- € 1.000");
  assert.equal(sp(payload.direct_net_text), "€ 275.000");
  assert.match(sp(payload.traditional_net_text), /276\.940/);
});

test("een onherkenbaar bedrag wordt niet vervangen door een verzonnen leeg veld", () => {
  const payload = buildCalculatedProposalPayload({ traditional_price_text: "handmatige tekst" });
  // parseMoney leest hier 0; formatMoney(0) geeft "" — dan blijft de
  // oorspronkelijke tekst staan in plaats van dat de invoer verdwijnt.
  assert.equal(payload.traditional_price_text, "handmatige tekst");
});

test("zonder enig bedrag blijft de directe netto-opbrengst ongedefinieerd, niet € 0", () => {
  const payload = buildCalculatedProposalPayload({});
  assert.equal(payload.direct_net_text, undefined);
});

test("het doorverkooppercentage wordt genormaliseerd naar 0-100", () => {
  assert.equal(buildCalculatedProposalPayload({ resale_percentage_text: "150" }).resale_percentage_text, "100");
  assert.equal(buildCalculatedProposalPayload({ resale_percentage_text: "20" }).resale_percentage_text, "20");
});

test("een doorverkooppercentage van 0 blijft als ingevoerde tekst staan", () => {
  // formatPercent geeft "" terug bij 0, dus buildCalculatedProposalPayload
  // valt terug op de oorspronkelijke tekst — hetzelfde patroon als hierboven.
  const payload = buildCalculatedProposalPayload({ resale_percentage_text: "0" });
  assert.equal(payload.resale_percentage_text, "0");
});

test("de totaalprijs bij werkzaamheden wordt ook hier herberekend uit basis + werkzaamheden", () => {
  const payload = buildCalculatedProposalPayload({
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
  });
  assert.match(sp(payload.seller_work_total_price_text), /260\.000/);
});

// ---------- normalizeProposalForForm ----------

test("zonder bestaand voorstel levert normalizeProposalForForm de defaults voor deze lead op", () => {
  const result = normalizeProposalForForm(null, LEAD);
  const verwacht = defaultProposalForLead(LEAD);

  assert.equal(result.lead_id, LEAD.id);
  assert.equal(result.lead_naam, LEAD.naam);
  assert.equal(result.property_postcode, "9711AB");
  assert.equal(result.validity_date, verwacht.validity_date);
  // en de aanvullende-afspraken-defaults staan er ook op
  assert.equal(result.object_usage_type, "Woon-winkelpand");
  assert.equal(result.resale_deduct_courtage, true);
});

test("lange ISO-datums uit de database worden voor formuliervelden afgekapt tot YYYY-MM-DD", () => {
  const result = normalizeProposalForForm(
    {
      validity_date: "2026-09-07T10:00:00.000Z",
      desired_transfer_date: "2026-10-01T00:00:00.000Z",
      seller_work_deadline: "2026-11-15T00:00:00.000Z",
      lease_end_date: "2027-01-01T00:00:00.000Z",
      tenant_vacate_deadline: "2027-02-01T00:00:00.000Z",
    },
    LEAD
  );

  assert.equal(result.validity_date, "2026-09-07");
  assert.equal(result.desired_transfer_date, "2026-10-01");
  assert.equal(result.seller_work_deadline, "2026-11-15");
  assert.equal(result.lease_end_date, "2027-01-01");
  assert.equal(result.tenant_vacate_deadline, "2027-02-01");
});

test("velden uit een bestaand voorstel overschrijven de defaults voor deze lead", () => {
  const result = normalizeProposalForForm({ amount_text: "€ 250.000", proposal_type: "Uitgestelde levering" }, LEAD);
  assert.equal(result.amount_text, "€ 250.000");
  assert.equal(result.proposal_type, "Uitgestelde levering");
});

test("het meegegeven lead-object wint altijd van een lead_id in het opgeslagen voorstel", () => {
  const result = normalizeProposalForForm({ lead_id: "ander-lead-id" }, LEAD);
  assert.equal(result.lead_id, LEAD.id, "voorkomt dat een voorstel aan de verkeerde lead blijft hangen");
});

test("zonder ingevulde vervaldatums blijven de datumvelden leeg in plaats van 'Invalid Date'", () => {
  const result = normalizeProposalForForm({}, LEAD);
  assert.equal(result.desired_transfer_date, "");
  assert.equal(result.seller_work_deadline, "");
  assert.equal(result.lease_end_date, "");
  assert.equal(result.tenant_vacate_deadline, "");
});
