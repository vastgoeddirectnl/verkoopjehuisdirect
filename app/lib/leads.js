import { query, queryOne } from "./neonDb";
import { sendApplicantConfirmation, sendLeadNotification } from "./mail";

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

function cleanText(value, max = 300) {
  return String(value || "").trim().slice(0, max);
}

export function normalizeLead(input = {}) {
  const lead = {};
  for (const [key, max] of Object.entries(TEXT_LIMITS)) {
    lead[key] = cleanText(input[key], max);
  }

  if (!lead.pagina) lead.pagina = "/";
  if (!lead.bron) lead.bron = "direct";
  return lead;
}

export function validateLead(lead) {
  const missing = [];
  for (const field of ["naam", "telefoon", "postcode", "huisnummer"]) {
    if (!lead[field]) missing.push(field);
  }

  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) {
    return { ok: false, error: "Controleer het e-mailadres." };
  }

  if (missing.length) {
    return { ok: false, error: `Verplichte velden ontbreken: ${missing.join(", ")}.` };
  }

  return { ok: true };
}

export async function createLead(input = {}) {
  const lead = normalizeLead(input);
  const validation = validateLead(lead);

  if (!validation.ok) {
    const error = new Error(validation.error);
    error.status = 400;
    throw error;
  }

  const saved = await queryOne(
    `insert into leads (
      naam, email, telefoon, postcode, huisnummer, woningtype, staat, reden, pagina, bron, status
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Nieuw') returning *`,
    [
      lead.naam,
      lead.email || null,
      lead.telefoon,
      lead.postcode,
      lead.huisnummer,
      lead.woningtype || null,
      lead.staat || null,
      lead.reden || null,
      lead.pagina,
      lead.bron,
    ]
  );

  const mail = {
    internal: { skipped: true },
    applicant: { skipped: true },
  };

  try {
    mail.internal = await sendLeadNotification(saved || lead);
  } catch (error) {
    console.warn("Lead opgeslagen, maar interne e-mailmelding is niet verzonden:", error.message);
    mail.internal = { skipped: false, error: error.message };
  }

  try {
    mail.applicant = await sendApplicantConfirmation(saved || lead);
  } catch (error) {
    console.warn("Lead opgeslagen, maar ontvangstbevestiging is niet verzonden:", error.message);
    mail.applicant = { skipped: false, error: error.message };
  }

  return { lead: saved, mail };
}

export async function listLeads({ status, search, limit = 300 } = {}) {
  const where = [];
  const params = [];

  if (status && status !== "Alle") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  const cleanedSearch = cleanText(search, 120);
  if (cleanedSearch) {
    params.push(`%${cleanedSearch}%`);
    const i = params.length;
    where.push(`(
      naam ilike $${i} or email ilike $${i} or telefoon ilike $${i} or postcode ilike $${i} or
      huisnummer ilike $${i} or pagina ilike $${i} or bron ilike $${i} or woningtype ilike $${i} or reden ilike $${i}
    )`);
  }

  params.push(Math.min(Number(limit) || 300, 500));
  const sql = `
    select * from leads
    ${where.length ? `where ${where.join(" and ")}` : ""}
    order by created_at desc
    limit $${params.length}
  `;

  const { rows } = await query(sql, params);
  return rows;
}
