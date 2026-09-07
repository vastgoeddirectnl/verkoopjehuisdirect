// Eén plek voor het parsen en formatteren van bedragen (ARCH-02).
//
// Er stonden drie bijna-identieke bedragparsers in de codebase:
// `parseNonNegativeNumber` (app/api/admin/v2/route.js), `parseMoney` (het
// voorstel, inmiddels app/components/proposal/proposalFormat.js) en
// `parseProposalMoney` (app/lib/proposalValidation.js). Ze normaliseerden
// Nederlandse en internationale notaties elk net even anders geschreven,
// maar kwamen — op de laatste stap na, die toch alles weghaalt buiten
// cijfers/komma/punt/streepje — op precies hetzelfde gedrag uit. Dat maakte
// ze een risico: bij bedragen die naar een klant gaan mag de validatie geen
// ander getal zien dan wat er wordt getoond.
//
// parseMoney() is nu de enige implementatie; alle drie de plekken importeren
// hiervandaan. parsePercent() bestaat apart van parseMoney() zodat een
// percentageveld niet per ongeluk als bedrag wordt gelezen (of andersom),
// ook al is de onderliggende opschoonstap voor beide gelijk.

export function parseMoney(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;

  // Alles behalve cijfers, komma, punt en streepje weg — dit vangt €, %,
  // spaties en letters in één stap, ongeacht waar ze in de tekst staan.
  const cleaned = raw.replace(/[^0-9,.-]/g, "");
  if (!cleaned) return 0;

  let normalized = cleaned;
  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");

  if (hasComma && hasDot) {
    // "1.234,56" — punt is duizendtal, komma is decimaal.
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    // "1234,56" — komma is decimaal.
    normalized = normalized.replace(",", ".");
  } else if (hasDot) {
    // Een losse punt is dubbelzinnig: "1.234" (duizendtal) vs "1.5" (decimaal).
    // Drie cijfers na de laatste punt wordt als duizendtal gelezen.
    const dotParts = normalized.split(".");
    const lastPart = dotParts[dotParts.length - 1];
    if (lastPart.length === 3 && dotParts.length > 1) {
      normalized = normalized.replace(/\./g, "");
    }
  }

  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? Math.abs(number) : 0;
}

// Los van parseMoney() gehouden voor leesbaarheid op de aanroepplek — een
// percentageveld ("50" of "50%") is geen bedrag, ook al is de opschoonstap
// hieronder identiek.
export function parsePercent(value) {
  return parseMoney(value);
}

// Formatteert een al-geparsed, niet-negatief bedrag als Nederlandse
// euronotatie. Geeft "" terug voor 0, negatieve of niet-numerieke waarden —
// aanroepers die in dat geval liever null willen, doen dat zelf op basis van
// parseMoney(value) vóór het formatteren.
export function formatEuro(amountValue, { negative = false } = {}) {
  const number = Number(amountValue || 0);
  if (!Number.isFinite(number) || number <= 0) return "";
  const formatted = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(number));
  return negative ? `- ${formatted}` : formatted;
}
