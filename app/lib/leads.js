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

export async function createLead(input = {}) {
  const lead = normalizeLead(input);
  const validation = validateLead(lead);

  if (!validation.ok) {
    const error = new Error(validation.error);
    error.status = 400;
    throw error;
  }

  // Voorkom dubbele records door dubbelklikken/netwerk-retries binnen enkele minuten.
  const duplicate = await queryOne(
    `select *
     from leads
     where regexp_replace(coalesce(telefoon, ''), '\\D', '', 'g') = $1
       and upper(replace(coalesce(postcode, ''), ' ', '')) = $2
       and lower(trim(coalesce(huisnummer, ''))) = lower($3)
       and created_at >= now() - interval '3 minutes'
     order by created_at desc
     limit 1`,
    [
      lead.telefoon.replace(/\D/g, ""),
      lead.postcode,
      lead.huisnummer,
    ]
  );

  if (duplicate) {
    return { lead: duplicate, mail: { duplicate: true } };
  }

  const saved = await queryOne(
    `insert into leads (
      naam, email, telefoon, postcode, huisnummer, woningtype, staat, reden, pagina, bron, status
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Nieuwe aanvraag') returning *`,
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

const ARCHIVE_LEAD_STATUSES = ["Akkoord", "Afgewezen", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];

export async function listLeads({ status, search, limit = 300, archive = "active" } = {}) {
  const where = [];
  const params = [];

  if (status && status !== "Alle") {
    params.push(status);
    where.push(`l.status = $${params.length}`);
  } else if (archive === "archive") {
    params.push(ARCHIVE_LEAD_STATUSES);
    where.push(`l.status = any($${params.length})`);
  } else if (archive !== "all") {
    params.push(ARCHIVE_LEAD_STATUSES);
    where.push(`coalesce(l.status, 'Nieuw') <> all($${params.length})`);
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
      p.last_proposal_viewed_at,
      coalesce(p.proposal_view_count, 0)::int as proposal_view_count,
      p.last_interest_at,
      p.interest_status,
      m.last_mail_at
    from leads l
    left join (
      select lead_id, count(*) filter (where status <> 'Afgerond') as open_tasks
      from tasks
      group by lead_id
    ) t on t.lead_id = l.id
    left join (
      select
        lead_id,
        max(created_at) as last_proposal_at,
        max(coalesce(public_last_viewed_at, public_viewed_at)) as last_proposal_viewed_at,
        sum(coalesce(public_view_count, 0)) as proposal_view_count,
        max(interest_at) as last_interest_at,
        (array_agg(interest_status order by interest_at desc nulls last) filter (where interest_status is not null))[1] as interest_status
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
