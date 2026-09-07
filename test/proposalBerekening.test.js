import test from "node:test";
import assert from "node:assert/strict";

import {
  amount,
  costInclVatValue,
  monthlyRentValue,
  months,
  percent,
} from "../app/components/proposal/proposalFormat.js";
import {
  calculateNetComparison,
  calculateResaleExample,
  calculateSellerWorkTotal,
} from "../app/lib/admin/leadDetail.js";
import { daysUntilAmsterdam, isExpiredAmsterdam } from "../app/lib/date.js";

/**
 * Dit zijn de bedragen die de klant in het verkoopvoorstel te zien krijgt.
 * Een fout hier is geen weergavefoutje maar een verkeerd voorstel, dus de
 * rekenregels liggen hier vast.
 */

const NU = new Date("2026-09-07T10:00:00Z");

// Intl.NumberFormat zet een non-breaking space achter het euroteken. Voor de
// vergelijking maakt dat niet uit, voor het leesbaar houden van deze tests wel.
const sp = (tekst) => String(tekst).replace(/\u00a0/g, " ");

// ---------- btw ----------

test("kosten worden excl. btw ingevoerd en incl. btw getoond", () => {
  // € 5.000 excl. → € 6.050 incl., getoond als aftrekpost
  assert.equal(sp(costInclVatValue("5000")), "- € 6.050");
  assert.equal(sp(costInclVatValue("€ 5.000")), "- € 6.050");
});

test("een leeg of niet-numeriek kostenveld wordt niet verzonnen", () => {
  assert.equal(costInclVatValue(""), "-");
  assert.equal(costInclVatValue("", "n.v.t."), "n.v.t.");
  // Vrije tekst blijft staan zoals ingevoerd, in plaats van als € 0 te tonen.
  assert.equal(costInclVatValue("in overleg"), "in overleg");
});

test("makelaarskosten en overige verkoopkosten krijgen allebei 21% btw", () => {
  const c = calculateNetComparison({
    traditional_price_text: "€ 300.000",
    agent_costs_text: "5000",
    other_costs_text: "1000",
    notary_costs_text: "800",
    renovation_costs_text: "0",
    amount_text: "€ 275.000",
  });

  assert.equal(c.agentExVat, 5000);
  assert.equal(c.agentInclVat, 6050);
  assert.equal(c.otherExVat, 1000);
  assert.equal(c.otherInclVat, 1210);
  // Notaris- en herstelkosten zijn geen btw-plichtige dienst in deze opzet.
  assert.equal(c.notaryCosts, 800);
});

// ---------- netto-opbrengst ----------

test("de traditionele netto-opbrengst trekt alle kosten af", () => {
  const c = calculateNetComparison({
    traditional_price_text: "€ 300.000",
    agent_costs_text: "5000",     // 6.050 incl.
    notary_costs_text: "800",
    renovation_costs_text: "15000",
    other_costs_text: "1000",     // 1.210 incl.
    amount_text: "€ 275.000",
  });

  assert.equal(c.traditionalNet, 300000 - 6050 - 800 - 15000 - 1210);
  assert.equal(c.traditionalNet, 276940);
  assert.equal(c.directNet, 275000);
  assert.equal(c.difference, 275000 - 276940);
});

test("herstelkosten op nul tellen niet mee", () => {
  const basis = {
    traditional_price_text: "€ 300.000",
    agent_costs_text: "5000",
    notary_costs_text: "800",
    other_costs_text: "1000",
    amount_text: "€ 275.000",
  };

  const nul = calculateNetComparison({ ...basis, renovation_costs_text: "0" });
  const leeg = calculateNetComparison({ ...basis, renovation_costs_text: "" });
  const ontbreekt = calculateNetComparison(basis);

  assert.equal(nul.renovationCosts, 0);
  assert.equal(nul.traditionalNet, leeg.traditionalNet);
  assert.equal(nul.traditionalNet, ontbreekt.traditionalNet);
  assert.equal(nul.traditionalNet, 291940);
});

test("de netto-opbrengst wordt niet negatief getoond", () => {
  const c = calculateNetComparison({
    traditional_price_text: "€ 10.000",
    agent_costs_text: "20000",
    amount_text: "€ 5.000",
  });
  assert.equal(c.traditionalNet, 0, "een negatieve opbrengst zou onzin zijn in het voorstel");
});

test("de directe netto-opbrengst valt terug op het voorgestelde bedrag", () => {
  const zonder = calculateNetComparison({ traditional_price_text: "€ 300.000", amount_text: "€ 275.000" });
  assert.equal(zonder.directNet, 275000);

  const met = calculateNetComparison({
    traditional_price_text: "€ 300.000",
    amount_text: "€ 275.000",
    direct_net_text: "€ 280.000",
  });
  assert.equal(met.directNet, 280000, "een expliciete netto-opbrengst wint van het bedrag");
});

// ---------- werkzaamheden en doorverkoop ----------

test("de totaalprijs bij werkzaamheden is basisprijs plus werkzaamheden", () => {
  const totaal = calculateSellerWorkTotal({
    seller_work_base_price_text: "€ 245.000",
    seller_work_amount_text: "€ 15.000",
  });
  assert.match(String(totaal), /260\.000/);
});

test("de rekenvoorbeelden bij doorverkoop gebruiken drempel en percentage", () => {
  const voorbeeld = calculateResaleExample({
    resale_threshold_text: "€ 300.000",
    resale_percentage_text: "50",
  });
  assert.ok(voorbeeld, "er hoort een voorbeeld te komen bij een ingevulde drempel");
});

// ---------- huur ----------

test("een kaal huurbedrag krijgt de periode erbij", () => {
  assert.equal(sp(monthlyRentValue("2500")), "€ 2.500 per maand");
  assert.equal(sp(monthlyRentValue("1250")), "€ 1.250 per maand");
});

test("een huurbedrag dat de periode al bevat wordt niet dubbel opgemaakt", () => {
  assert.equal(sp(monthlyRentValue("€ 2.500 per maand")), "€ 2.500 per maand");
  assert.equal(sp(monthlyRentValue("2500 per maand")), "€ 2.500 per maand");
  assert.equal(sp(monthlyRentValue("€ 2.500 p/m")), "€ 2.500 per maand");
});

test("een huurtoelichting in vrije tekst blijft ongewijzigd", () => {
  const tekst = "€ 2.500 per maand, exclusief servicekosten";
  assert.equal(monthlyRentValue(tekst), tekst);
  assert.equal(monthlyRentValue(""), "Niet ingevuld");
  assert.equal(monthlyRentValue("", "-"), "-");
});

// ---------- opmaak ----------

test("bedragen worden Nederlands opgemaakt met een vaste terugval", () => {
  assert.equal(sp(amount("245000")), "€ 245.000");
  assert.equal(sp(amount("€ 245.000")), "€ 245.000");
  assert.equal(amount(""), "In overleg");
  assert.equal(amount("", "-"), "-");
});

test("percentage en looptijd blijven leesbaar", () => {
  assert.equal(percent("50"), "50%");
  assert.equal(percent("12,5"), "12,5%");
  assert.equal(months("12"), "12 maanden");
  assert.equal(months(""), "-");
});

// ---------- geldigheid ----------

test("de geldigheid wordt in hele dagen geteld", () => {
  assert.equal(daysUntilAmsterdam("2026-09-07", NU), 0);
  assert.equal(daysUntilAmsterdam("2026-09-08", NU), 1);
  assert.equal(daysUntilAmsterdam("2026-09-21", NU), 14);
  assert.equal(daysUntilAmsterdam("2026-09-06", NU), -1);
});

test("een verlopen voorstel blokkeert de klantactie, de laatste dag nog niet", () => {
  // Dezelfde regel als canRecordProposalAction in de action-route:
  // status verzonden/bekeken én niet verlopen.
  const mag = (validity, status) =>
    ["verzonden", "bekeken"].includes(String(status).toLowerCase()) && !isExpiredAmsterdam(validity, NU);

  assert.equal(mag("2026-09-07", "Verzonden"), true, "op de laatste dag mag het nog");
  assert.equal(mag("2026-09-08", "Bekeken"), true);
  assert.equal(mag("2026-09-06", "Verzonden"), false, "een dag te laat is verlopen");
  assert.equal(mag("2026-09-08", "Concept"), false, "een concept is niet actief");
  assert.equal(mag("2026-09-08", "Akkoord"), false);
  assert.equal(mag("2026-09-08", "Verlopen"), false);
});

test("zonder geldigheidsdatum verloopt een voorstel niet vanzelf", () => {
  assert.equal(isExpiredAmsterdam(null, NU), false);
  assert.equal(isExpiredAmsterdam("", NU), false);
});
