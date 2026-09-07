import test from "node:test";
import assert from "node:assert/strict";

import { normalizeLead, validateLead } from "../app/lib/leadValidation.js";

const geldig = {
  naam: "Rob Schiphuis",
  telefoon: "06 12 23 80 51",
  postcode: "9501 ab",
  huisnummer: "14",
};

test("normalizeLead maakt postcode en e-mail consistent", () => {
  const lead = normalizeLead({
    ...geldig,
    email: "  ROB@Example.COM ",
    postcode: " 9501 ab ",
  });

  assert.equal(lead.postcode, "9501AB");
  assert.equal(lead.email, "rob@example.com");
  assert.equal(lead.naam, "Rob Schiphuis");
});

test("normalizeLead vult pagina en bron met een standaardwaarde", () => {
  const lead = normalizeLead(geldig);
  assert.equal(lead.pagina, "/");
  assert.equal(lead.bron, "direct");
});

test("normalizeLead kapt te lange invoer af in plaats van te weigeren", () => {
  const lead = normalizeLead({ ...geldig, naam: "x".repeat(500) });
  assert.equal(lead.naam.length, 160);
});

test("een volledige aanvraag komt door de validatie", () => {
  assert.deepEqual(validateLead(normalizeLead(geldig)), { ok: true });
});

test("ontbrekende verplichte velden worden allemaal tegelijk gemeld", () => {
  const resultaat = validateLead(normalizeLead({ naam: "Rob" }));
  assert.equal(resultaat.ok, false);
  assert.match(resultaat.error, /telefoon/);
  assert.match(resultaat.error, /postcode/);
  assert.match(resultaat.error, /huisnummer/);
});

test("de postcode moet Nederlands zijn", () => {
  for (const postcode of ["9501", "AB9501", "12345", "9501ABC", "950AB"]) {
    const resultaat = validateLead(normalizeLead({ ...geldig, postcode }));
    assert.equal(resultaat.ok, false, `verwacht afkeuring voor ${postcode}`);
  }
});

test("spaties in de postcode worden weggenormaliseerd, waar de bezoeker ze ook zet", () => {
  // Bezoekers typen "9501 AB", soms met een spatie op een rare plek. Dat mag
  // geen afkeuring opleveren: normalizeLead haalt alle witruimte eruit.
  for (const postcode of ["9501AB", "9501 ab", " 9501 AB ", "950 1AB"]) {
    assert.equal(
      validateLead(normalizeLead({ ...geldig, postcode })).ok,
      true,
      `verwacht acceptatie voor ${JSON.stringify(postcode)}`
    );
    assert.equal(normalizeLead({ ...geldig, postcode }).postcode, "9501AB");
  }
});

test("telefoonnummers worden op cijferaantal beoordeeld, niet op opmaak", () => {
  assert.equal(validateLead(normalizeLead({ ...geldig, telefoon: "0612238051" })).ok, true);
  assert.equal(validateLead(normalizeLead({ ...geldig, telefoon: "+31 6 12 23 80 51" })).ok, true);
  assert.equal(validateLead(normalizeLead({ ...geldig, telefoon: "06-1223" })).ok, false);
});

test("een ongeldig e-mailadres wordt afgekeurd, een leeg adres niet", () => {
  assert.equal(validateLead(normalizeLead({ ...geldig, email: "rob@example" })).ok, false);
  assert.equal(validateLead(normalizeLead({ ...geldig, email: "" })).ok, true);
  assert.equal(validateLead(normalizeLead({ ...geldig, email: "rob@example.nl" })).ok, true);
});

test("huisnummers met toevoeging worden geaccepteerd", () => {
  for (const huisnummer of ["14", "14a", "14 A", "14-16", "123/2"]) {
    assert.equal(
      validateLead(normalizeLead({ ...geldig, huisnummer })).ok,
      true,
      `verwacht acceptatie voor ${huisnummer}`
    );
  }

  assert.equal(validateLead(normalizeLead({ ...geldig, huisnummer: "abc" })).ok, false);
});

test("een naam van één teken wordt afgekeurd", () => {
  assert.equal(validateLead(normalizeLead({ ...geldig, naam: "R" })).ok, false);
});
