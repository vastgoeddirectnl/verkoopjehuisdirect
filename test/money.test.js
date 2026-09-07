import test from "node:test";
import assert from "node:assert/strict";

import { parseMoney, parsePercent, formatEuro } from "../app/lib/money.js";

/**
 * ARCH-02: parseMoney() is nu de enige plek die bedragnotaties leest — voor
 * de leadvalidatie (via proposalValidation.js), de admin-API (v2/route.js)
 * en de weergave in het voorstel (proposalFormat.js). Zie
 * test/proposalValidation.test.js voor de bijbehorende parseProposalMoney-
 * wrapper, die op dezelfde gevallen groen moet blijven.
 */
test("parseMoney leest Nederlandse en internationale bedragnotaties", () => {
  assert.equal(parseMoney("€ 245.000"), 245000);
  assert.equal(parseMoney("245000"), 245000);
  assert.equal(parseMoney("245.000,50"), 245000.5);
  assert.equal(parseMoney("€ 1.234.567"), 1234567);
  assert.equal(parseMoney("2500,75"), 2500.75);
  assert.equal(parseMoney("1.234,56"), 1234.56);
});

test("parseMoney behandelt een losse punt met drie cijfers als duizendtal", () => {
  assert.equal(parseMoney("1.234"), 1234);
});

test("parseMoney geeft 0 bij lege, niet-numerieke of ontbrekende invoer", () => {
  assert.equal(parseMoney(""), 0);
  assert.equal(parseMoney(null), 0);
  assert.equal(parseMoney(undefined), 0);
  assert.equal(parseMoney("In overleg"), 0);
  assert.equal(parseMoney("nader te bepalen"), 0);
});

test("parseMoney levert nooit een negatief bedrag", () => {
  assert.equal(parseMoney("-500"), 500);
});

test("parseMoney negeert een percentteken (vroeger apart weggestript door parseNonNegativeNumber)", () => {
  // De losse '.replace(/%/g, "")'-stap uit de oude parseNonNegativeNumber was
  // al overbodig: de generieke opschoonstap hieronder haalt '%' net zo goed
  // weg. Dat gedrag blijft hetzelfde nu er nog maar één implementatie is.
  assert.equal(parseMoney("50%"), 50);
});

test("parseMoney: een letter zonder cijfers ervoor wordt genegeerd, maar een punt in de tekst telt mee als scheidingsteken", () => {
  assert.equal(parseMoney("ca 120000"), 120000);
  // Bestaand (en niet ARCH-02-specifiek) grensgeval: de punt in "ca." blijft
  // staan na het opschonen ("ca. 120000" -> ".120000") en wordt daarna als
  // decimaalteken gelezen, niet als duizendtal-punt. Dit gedrag zat al in
  // alle drie de oorspronkelijke implementaties en is bewust ongewijzigd
  // overgenomen — vandaar dat de printpagina hiervoor een eigen "strict"-
  // stand heeft (zie amount() in app/components/proposal/proposalFormat.js).
  assert.equal(parseMoney("ca. 120000"), 0.12);
});

test("parsePercent gedraagt zich hetzelfde als parseMoney voor percentagetekst", () => {
  assert.equal(parsePercent("50"), 50);
  assert.equal(parsePercent("50%"), 50);
  assert.equal(parsePercent(""), 0);
});

test("formatEuro toont een afgeronde euronotatie zonder decimalen", () => {
  assert.equal(formatEuro(245000), "€ 245.000");
});

test("formatEuro geeft '' bij 0, negatieve of niet-numerieke invoer", () => {
  assert.equal(formatEuro(0), "");
  assert.equal(formatEuro(-10), "");
  assert.equal(formatEuro(Number.NaN), "");
  assert.equal(formatEuro(undefined), "");
});

test("formatEuro kan een negatief bedrag tonen met een '- '-prefix", () => {
  assert.equal(formatEuro(1000, { negative: true }), "- € 1.000");
});
