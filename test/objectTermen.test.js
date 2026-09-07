import test from "node:test";
import assert from "node:assert/strict";

import {
  COMPARISON_BASIS_NOTE,
  COST_VAT_NOTE,
  NO_BUYER_CONDITIONS_NOTICE_TEXT,
  NO_BUYER_CONDITIONS_NOTICE_TITLE,
  constructieChecks,
  isObjectProposal,
  objectAwareText,
  objectTerms,
} from "../app/components/proposal/proposalContent.js";

/**
 * Een woon-winkelpand mag in het voorstel geen "woning" heten, en een gewone
 * eengezinswoning geen "object". De term wordt op twee manieren bepaald:
 * objectTerms() voor labels, objectAwareText() voor lopende tekst.
 */

const woning = { property_type: "Tussenwoning", object_usage_type: "Woning" };
const winkelpand = { property_type: "Woon-winkelpand", object_usage_type: "Woon-winkelpand" };

test("een object wordt herkend aan type, gebruik of situatie", () => {
  assert.equal(isObjectProposal(woning), false);
  assert.equal(isObjectProposal({ property_type: "Vrijstaande woning" }), false);
  assert.equal(isObjectProposal({ property_type: "Appartement" }), false);

  for (const veld of ["property_type", "object_usage_type", "current_situation"]) {
    for (const waarde of ["Woon-winkelpand", "bedrijfsruimte", "Gemengd object", "kantoor", "horecapand", "beleggingspand"]) {
      assert.equal(isObjectProposal({ [veld]: waarde }), true, `${veld} = ${waarde}`);
    }
  }
});

test("een leeg voorstel valt terug op woning", () => {
  assert.equal(isObjectProposal({}), false);
  assert.equal(isObjectProposal(null), false);
});

test("de labels volgen de soort", () => {
  const w = objectTerms(woning);
  const o = objectTerms(winkelpand);

  assert.equal(w.lower, "woning");
  assert.equal(o.lower, "object");
  assert.equal(w.possessive, "uw woning");
  assert.equal(o.possessive, "uw object");
  assert.equal(w.typeLabel, "Type woning");
  assert.equal(o.typeLabel, "Type object");
  assert.equal(w.gegevens, "Woninggegevens");
  assert.equal(o.gegevens, "Objectgegevens");
});

test("de printvariant gebruikt eigen labels maar dezelfde soort", () => {
  assert.equal(objectTerms(woning, "print").gegevens, "Gegevens woning");
  assert.equal(objectTerms(winkelpand, "print").gegevens, "Gegevens object");
});

test("geen enkel label bevat 'woning' bij een object", () => {
  for (const variant of ["public", "print"]) {
    for (const [sleutel, waarde] of Object.entries(objectTerms(winkelpand, variant))) {
      assert.doesNotMatch(
        String(waarde),
        /woning/i,
        `${sleutel} bevat nog "woning" in variant ${variant}: ${waarde}`
      );
    }
  }
});

test("bij een gewone woning blijft alles gewoon woning heten", () => {
  const t = objectTerms(woning);
  assert.doesNotMatch(t.lower, /object/i);
  assert.doesNotMatch(t.possessive, /object/i);
  assert.doesNotMatch(t.gegevens, /object/i);
});

test("lopende tekst wordt omgezet voor objecten en gelaten voor woningen", () => {
  const zinnen = [
    "Dit voorstel is gebaseerd op openbare woninginformatie en de huidige bekende staat van de woning.",
    "Controle woninggegevens",
    "Woning blijft tot levering in de huidige staat",
    "Wij nemen uw woning over in de staat waarin deze zich bevindt.",
    "Het verkoopklaar maken van de woning is niet nodig.",
  ];

  for (const zin of zinnen) {
    const alsObject = objectAwareText(zin, winkelpand);
    assert.doesNotMatch(alsObject, /woning/i, `nog "woning" in: ${alsObject}`);

    const alsWoning = objectAwareText(zin, woning);
    assert.equal(alsWoning, zin, "een woningvoorstel mag niet worden herschreven");
  }
});

test("de opleveringsregel heet bij een object 'Object blijft ...'", () => {
  const proposal = { ...winkelpand, property_same_state: true };
  const checks = constructieChecks(proposal).map((item) => objectAwareText(item, proposal));
  const regel = checks.find((c) => /blijft tot levering/i.test(c));

  assert.ok(regel, "de opleveringsregel hoort erbij te staan");
  assert.match(regel, /^Object blijft/);
  assert.doesNotMatch(regel, /woning/i);
});

test("dezelfde regel blijft bij een woning gewoon 'Woning blijft ...'", () => {
  const proposal = { ...woning, property_same_state: true };
  const checks = constructieChecks(proposal).map((item) => objectAwareText(item, proposal));
  const regel = checks.find((c) => /blijft tot levering/i.test(c));

  assert.ok(regel);
  assert.match(regel, /^Woning blijft/);
});

test("ook de kortere printvariant van die regel wordt omgezet", () => {
  // De printpagina geeft een eigen, kortere tekst mee.
  const proposal = { ...winkelpand, property_same_state: true };
  const checks = constructieChecks(proposal, { sameStateText: "Woning blijft tot levering in huidige staat" })
    .map((item) => objectAwareText(item, proposal));
  const regel = checks.find((c) => /blijft tot levering/i.test(c));

  assert.match(regel, /^Object blijft/);
});

test("geen enkele controleregel noemt 'woning' bij een object", () => {
  const proposal = {
    ...winkelpand,
    property_same_state: true,
    delivery_free_of_claims: true,
    allow_kadaster_registration: true,
    allow_abc_resale: true,
    seller_cooperates_resale: true,
  };
  for (const regel of constructieChecks(proposal).map((c) => objectAwareText(c, proposal))) {
    assert.doesNotMatch(regel, /woning/i, `nog "woning" in: ${regel}`);
  }
});

test("de gedeelde vaste teksten zijn termneutraal", () => {
  // Deze blokken worden niet door objectAwareText gehaald, dus ze mogen zelf
  // geen "woning" bevatten — anders leest een woon-winkelpandvoorstel scheef.
  for (const [naam, tekst] of Object.entries({
    NO_BUYER_CONDITIONS_NOTICE_TITLE,
    NO_BUYER_CONDITIONS_NOTICE_TEXT,
    COST_VAT_NOTE,
    COMPARISON_BASIS_NOTE,
  })) {
    assert.doesNotMatch(String(tekst), /woning/i, `${naam} bevat "woning"`);
  }
});

test("de zekerheidstekst herhaalt de slotbepaling niet woordelijk", () => {
  // De volledige juridische zin hoort één keer in het voorstel te staan.
  assert.doesNotMatch(
    NO_BUYER_CONDITIONS_NOTICE_TEXT,
    /zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud/i
  );
  // Maar de strekking blijft wel staan, inclusief het voorbehoud.
  assert.match(NO_BUYER_CONDITIONS_NOTICE_TEXT, /in beginsel/i);
  assert.match(NO_BUYER_CONDITIONS_NOTICE_TEXT, /ontbindende voorbehouden/i);
});
