// Opmaakhelpers die het publieke voorstel (app/voorstel/[token]) en de admin-
// printversie (app/admin/voorstellen/[id]/print) delen. Voorheen stonden deze
// 24 functies letterlijk dubbel in beide bestanden (ARCH-01).
//
// `amount()` heeft een `strict`-optie: de printpagina accepteerde bewust geen
// bedragtekst met niet-numerieke tekens ernaast (bv. "ca. 120000" blijft dan
// ongewijzigd staan), terwijl de publieke pagina alle niet-cijfers wegstript
// en het bedrag altijd probeert te formatteren. Dat verschil bestond al vóór
// deze samenvoeging en blijft via de optie behouden per variant.
//
// parseMoney() zelf komt uit app/lib/money.js (ARCH-02) — dat was voorheen
// hier een eigen, bijna-identieke kopie, naast nog twee andere in de
// codebase.

import { parseMoney, formatEuro } from "../../lib/money.js";

export { parseMoney };

export function costInclVatValue(rawValue, fallback = "-") {
  const raw = String(rawValue || "").trim();
  if (!raw) return fallback;
  const parsed = parseMoney(raw);
  if (!parsed) return raw;
  return formatEuro(parsed * 1.21, { negative: true }) || raw;
}

export function amount(rawValue, fallback = "In overleg", { strict = false } = {}) {
  const raw = String(rawValue || "").trim();
  if (!raw) return fallback;
  if (raw.includes("€")) return raw;

  if (!strict) {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return raw;
    return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Number(digits))}`;
  }

  const cleaned = raw.replace(/\s/g, "");
  const numberLike = cleaned.replace(/[^\d]/g, "");
  if (!numberLike) return raw;

  if (/^\d+$/.test(cleaned.replace(/\./g, "").replace(/,/g, ""))) {
    const formatted = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Number(numberLike));
    return `€ ${formatted}`;
  }

  return raw;
}

export function percent(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) return "-";
  return raw.includes("%") ? raw : `${raw}%`;
}

export function months(rawValue, fallback = "-") {
  const raw = String(rawValue || "").trim();
  if (!raw) return fallback;
  return `${raw} maanden`;
}

export function value(rawValue, fallback = "-") {
  return String(rawValue || "").trim() || fallback;
}

export function hasText(rawValue) {
  return Boolean(String(rawValue || "").trim());
}

export function hasMeaningfulDeposit(rawValue) {
  const raw = String(rawValue || "").replace(/\s+/g, " ").trim();
  return Boolean(raw && !/^in overleg(?: bespreekbaar)?$/i.test(raw));
}

export function lines(rawValue, fallback = []) {
  const raw = String(rawValue || "").trim();
  if (!raw) return fallback;
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

// Voorheen public's `areaValue` een andere standaard-fallback had ("Nog te
// controleren") dan print's ("-"). Die fallback komt nu altijd expliciet van
// de aanroeper mee, zodat beide pagina's hun eigen tekst behouden.
export function areaValue(rawValue, fallback) {
  const raw = String(rawValue || "").trim();
  if (!raw) return fallback;
  if (/m²|m2|㎡/i.test(raw)) return raw.replace(/m2/i, "m²");
  if (/^\d+(?:[,.]\d+)?$/.test(raw)) return `${raw} m²`;
  return raw;
}

export function monthlyRentValue(rawValue, fallback = "Niet ingevuld") {
  const raw = String(rawValue || "").replace(/\s+/g, " ").trim();
  if (!raw) return fallback;

  const periodPattern = /per\s*maand|p\.?\s*\/?\s*m\.?|maandelijks/i;
  const amountPart = raw.replace(periodPattern, "").trim();
  const hasOnlyAmountAndPeriod = /^[€\s\d.,-]+$/.test(amountPart);

  if (hasOnlyAmountAndPeriod) {
    const formatted = amount(amountPart, "");
    if (formatted) return `${formatted} per maand`;
  }

  return raw;
}

export function formatPostal(rawValue) {
  return String(rawValue || "").trim().toUpperCase();
}

export function formatAddress(proposal) {
  if (proposal.property_address) return formatPostal(proposal.property_address);
  const parts = [proposal.property_postcode, proposal.property_house_number].filter(Boolean);
  return formatPostal(parts.join(" ")) || "-";
}
