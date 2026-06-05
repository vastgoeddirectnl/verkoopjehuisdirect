import { queryOne } from "./neonDb";

export function normalizeLead(input = {}) {
  return {
    naam: String(input.naam || "").trim(),
    email: String(input.email || "").trim(),
    telefoon: String(input.telefoon || "").trim(),
    postcode: String(input.postcode || "").trim(),
    huisnummer: String(input.huisnummer || "").trim(),
    woningtype: String(input.woningtype || "").trim(),
    staat: String(input.staat || "").trim(),
    reden: String(input.reden || "").trim(),
    pagina: String(input.pagina || "").trim() || "/",
    bron: String(input.bron || "").trim() || "direct",
  };
}

export async function createLead(input) {
  const lead = normalizeLead(input);

  if (!lead.telefoon && !lead.email) {
    const error = new Error("Vul minimaal een telefoonnummer of e-mailadres in.");
    error.status = 400;
    throw error;
  }

  return queryOne(
    `insert into leads (
      naam, email, telefoon, postcode, huisnummer, woningtype, staat, reden, pagina, bron
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    returning *`,
    [
      lead.naam,
      lead.email,
      lead.telefoon,
      lead.postcode,
      lead.huisnummer,
      lead.woningtype,
      lead.staat,
      lead.reden,
      lead.pagina,
      lead.bron,
    ]
  );
}
