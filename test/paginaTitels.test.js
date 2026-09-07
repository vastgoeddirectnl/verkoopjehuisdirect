import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

/**
 * SEO-01. Google kapt paginatitels af rond de 60 tekens. De landingspagina's
 * zetten zelf een titel, waar app/layout.jsx via title.template nog
 * " | Vastgoed Direct Nederland" achter plakt — 28 tekens. Zonder deze test
 * kruipt dat vanzelf weer over de grens zodra iemand een pagina toevoegt.
 *
 * Uitzondering: app/page.jsx zit in hetzelfde segment als de layout die de
 * template definieert, dus daar geldt de template niet. Die pagina zet zijn
 * volledige titel met `absolute`.
 */

const SUFFIX = " | Vastgoed Direct Nederland";
const MAX = 60;

function paginas(dir = "app", gevonden = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const vol = path.join(dir, item.name);
    if (item.isDirectory()) paginas(vol, gevonden);
    else if (item.name === "page.jsx") gevonden.push(vol);
  }
  return gevonden;
}

function publiekePaginas() {
  return paginas().filter((f) => {
    // path.join() gebruikt op Windows backslashes; hier genormaliseerd naar
    // "/" zodat de slice/startsWith-check op Windows en Linux hetzelfde werkt.
    const genormaliseerd = f.split(path.sep).join("/");
    const rel = genormaliseerd.slice("app".length, -"/page.jsx".length) || "/";
    return !rel.startsWith("/admin") && !rel.startsWith("/voorstel");
  });
}

function leesTitel(bestand) {
  const src = fs.readFileSync(bestand, "utf8");
  const absolute = src.match(/^ {2}title:\s*\{\s*absolute:\s*"([^"]+)"/m);
  if (absolute) return { titel: absolute[1], absoluut: true };
  const gewoon = src.match(/^ {2}("title"|title):\s*"([^"]+)"/m);
  return gewoon ? { titel: gewoon[2], absoluut: false } : null;
}

function volledigeTitel(bestand) {
  const gevonden = leesTitel(bestand);
  if (!gevonden) return null;
  return gevonden.absoluut ? gevonden.titel : gevonden.titel + SUFFIX;
}

test("elke publieke pagina heeft een titel", () => {
  const zonder = publiekePaginas().filter((f) => !leesTitel(f));
  assert.deepEqual(zonder, []);
});

test("geen enkele paginatitel komt boven 60 tekens uit", () => {
  const telang = publiekePaginas()
    .map((f) => ({ bestand: f, titel: volledigeTitel(f) }))
    .filter((r) => r.titel && r.titel.length > MAX)
    .map((r) => `${r.bestand} (${r.titel.length}): ${r.titel}`);

  assert.deepEqual(telang, [], `titels boven ${MAX} tekens:\n  ` + telang.join("\n  "));
});

test("de homepage noemt de merknaam", () => {
  const titel = volledigeTitel("app/page.jsx");
  assert.ok(titel, "de homepage heeft een titel");
  assert.match(titel, /Vastgoed Direct Nederland/, "juist de belangrijkste pagina had het merk niet");
  assert.ok(titel.length <= MAX, `${titel.length} tekens`);
});

test("de merknaam staat er niet twee keer in", () => {
  const dubbel = publiekePaginas()
    .map((f) => ({ bestand: f, titel: volledigeTitel(f) }))
    .filter((r) => r.titel && (r.titel.match(/Vastgoed Direct Nederland/g) || []).length > 1)
    .map((r) => `${r.bestand}: ${r.titel}`);

  assert.deepEqual(dubbel, []);
});

test("titels zijn onderling verschillend", () => {
  const titels = publiekePaginas().map(volledigeTitel).filter(Boolean);
  const dubbelen = titels.filter((t, i) => titels.indexOf(t) !== i);
  assert.deepEqual([...new Set(dubbelen)], [], "twee pagina's met dezelfde titel concurreren met elkaar");
});
