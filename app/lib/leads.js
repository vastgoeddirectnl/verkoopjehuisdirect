import { query, queryOne } from "./neonDb";
import { sendApplicantConfirmation, sendLeadNotification } from "./mail";
import { logMailEventSafe } from "./mailLog";
import { refreshLeadAutomation } from "./automation";

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

  const automatedLead = await refreshLeadAutomation(saved);

  const mail = {
    internal: { skipped: true },
    applicant: { skipped: true },
  };

  try {
    mail.internal = await sendLeadNotification(automatedLead || saved || lead);
    await logMailEventSafe({
      lead_id: saved?.id,
      type: "interne melding",
      recipient: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
      subject: `Nieuwe aanvraag verkoopvoorstel${saved?.postcode ? ` - ${saved.postcode}` : ""}`,
      status: mail.internal?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: mail.internal?.id,
      error: mail.internal?.reason,
    });
  } catch (error) {
    console.warn("Lead opgeslagen, maar interne e-mailmelding is niet verzonden:", error.message);
    mail.internal = { skipped: false, error: error.message };
    await logMailEventSafe({
      lead_id: saved?.id,
      type: "interne melding",
      recipient: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
      subject: "Nieuwe aanvraag verkoopvoorstel",
      status: "Fout",
      error: error.message,
    });
  }

  try {
    mail.applicant = await sendApplicantConfirmation(automatedLead || saved || lead);
    await logMailEventSafe({
      lead_id: saved?.id,
      type: "ontvangstbevestiging",
      recipient: saved?.email || lead.email,
      subject: "Wij hebben uw aanvraag ontvangen",
      status: mail.applicant?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: mail.applicant?.id,
      error: mail.applicant?.reason,
    });
  } catch (error) {
    console.warn("Lead opgeslagen, maar ontvangstbevestiging is niet verzonden:", error.message);
    mail.applicant = { skipped: false, error: error.message };
    await logMailEventSafe({
      lead_id: saved?.id,
      type: "ontvangstbevestiging",
      recipient: saved?.email || lead.email,
      subject: "Wij hebben uw aanvraag ontvangen",
      status: "Fout",
      error: error.message,
    });
  }

  return { lead: automatedLead || saved, mail };
}

export async function listLeads({ status, search, limit = 300 } = {}) {
  const where = [];
  const params = [];

  if (status && status !== "Alle") {
    params.push(status);
    where.push(`l.status = $${params.length}`);
  }

  const cleanedSearch = cleanText(search, 120);
  if (cleanedSearch) {
    params.push(`%${cleanedSearch}%`);
    const i = params.length;
    where.push(`(
      l.naam ilike $${i} or l.email ilike $${i} or l.telefoon ilike $${i} or l.postcode ilike $${i} or
      l.huisnummer ilike $${i} or l.pagina ilike $${i} or l.bron ilike $${i} or l.woningtype ilike $${i} or l.reden ilike $${i}
    )`);
  }

  params.push(Math.min(Number(limit) || 300, 500));
  const sql = `
    select
      l.*,
      coalesce(t.open_tasks, 0)::int as open_tasks,
      p.last_proposal_at,
      m.last_mail_at
    from leads l
    left join (
      select lead_id, count(*) filter (where status <> 'Afgerond') as open_tasks
      from tasks
      group by lead_id
    ) t on t.lead_id = l.id
    left join (
      select lead_id, max(created_at) as last_proposal_at
      from proposals
      group by lead_id
    ) p on p.lead_id = l.id
    left join (
      select lead_id, max(created_at) as last_mail_at
      from mail_logs
      group by lead_id
    ) m on m.lead_id = l.id
    ${where.length ? `where ${where.join(" and ")}` : ""}
    order by l.created_at desc
    limit $${params.length}
  `;

  const { rows } = await query(sql, params);
  return rows;
}
