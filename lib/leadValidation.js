/**
 * Normalisatie en validatie van een binnenkomende aanvraag.
 *
 * Bewust een eigen bestand zonder imports: dit is de laag die bepaalt of een
 * lead wordt opgeslagen, en die wil je los kunnen testen zonder database- of
 * mailafhankelijkheden. `app/lib/leads.js` gebruikt en her-exporteert deze
 * functies, dus bestaande imports blijven werken.
 */

const TEXT_LIMITS = {
  naam: 160,
  email: 190,
  telefoon: 80,
  postcode: 20,
  huisnummer: 40,
  woningtype: 120,
  staat: 160,
  reden: 180,
  pagina: 260,
  bron: 300,
};

export function cleanText(value, max = 300) {
  return String(value || "").trim().slice(0, max);
}

export function normalizeLead(input = {}) {
  const lead = {};
  for (const [key, max] of Object.entries(TEXT_LIMITS)) {
    lead[key] = cleanText(input[key], max);
  }

  lead.email = lead.email.toLowerCase();
  lead.postcode = lead.postcode.replace(/\s+/g, "").toUpperCase();

  if (!lead.pagina) lead.pagina = "/";
  if (!lead.bron) lead.bron = "direct";
  return lead;
}

export function validateLead(lead) {
  const missing = [];
  for (const field of ["naam", "telefoon", "postcode", "huisnummer"]) {
    if (!lead[field]) missing.push(field);
  }

  if (missing.length) {
    return { ok: false, error: `Verplichte velden ontbreken: ${missing.join(", ")}.` };
  }

  if (lead.naam.length < 2) {
    return { ok: false, error: "Controleer de naam." };
  }

  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return { ok: false, error: "Controleer het e-mailadres." };
  }

  if (!/^\d{4}[A-Z]{2}$/.test(lead.postcode)) {
    return { ok: false, error: "Controleer de postcode (bijvoorbeeld 9501AB)." };
  }

  const phoneDigits = lead.telefoon.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    return { ok: false, error: "Controleer het telefoonnummer." };
  }

  if (!/^\d{1,6}[A-Za-z0-9\-\/ ]{0,12}$/.test(lead.huisnummer)) {
    return { ok: false, error: "Controleer het huisnummer." };
  }

  return { ok: true };
}

export { TEXT_LIMITS };
