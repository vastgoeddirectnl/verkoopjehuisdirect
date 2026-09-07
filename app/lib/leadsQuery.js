// Querybouw voor het leadoverzicht (ARCH-06).
//
// Losgetrokken van app/lib/leads.js zodat de opbouw testbaar is zonder
// database: dat bestand importeert neonDb en is daardoor niet los te laden.
//
// Waarom LATERAL: de vorige versie groepeerde eerst *alle* rijen in tasks,
// proposals en mail_logs en joinde dat resultaat pas daarna aan de maximaal
// 300 getoonde leads. Dat werkt prima bij weinig data, maar de kosten groeien
// mee met de hele historie in plaats van met wat je toont. Nu wordt eerst de
// pagina leads bepaald (CTE `base`, inclusief where en limit) en pas daarna
// per lead gerekend. De bestaande indexen tasks_lead_id_idx,
// proposals_lead_id_idx en mail_logs_lead_id_idx dekken die lookups, dus er is
// geen nieuwe migratie nodig.

import { cleanText } from "./leadValidation.js";
import { ARCHIVE_LEAD_STATUSES } from "./leadStatus.js";

export const MAX_LEAD_LIMIT = 500;
export const DEFAULT_LEAD_LIMIT = 300;

// De kolommen die het overzicht bovenop de leadvelden zelf oplevert. Staat
// hier zodat een test kan vastleggen dat er geen veld verdwijnt.
export const LIST_LEADS_EXTRA_FIELDS = [
  "open_tasks",
  "last_proposal_at",
  "last_proposal_viewed_at",
  "proposal_view_count",
  "last_interest_at",
  "interest_status",
  "last_mail_at",
];

export function buildListLeadsQuery({
  status,
  search,
  limit = DEFAULT_LEAD_LIMIT,
  archive = "active",
} = {}) {
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

  params.push(Math.min(Number(limit) || DEFAULT_LEAD_LIMIT, MAX_LEAD_LIMIT));
  const limitParam = `$${params.length}`;

  const sql = `
    with base as (
      select l.*
      from leads l
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by l.created_at desc
      limit ${limitParam}
    )
    select
      b.*,
      coalesce(t.open_tasks, 0)::int as open_tasks,
      p.last_proposal_at,
      p.last_proposal_viewed_at,
      coalesce(p.proposal_view_count, 0)::int as proposal_view_count,
      p.last_interest_at,
      p.interest_status,
      m.last_mail_at
    from base b
    left join lateral (
      -- Openstaande taken. Een automatische taak die uit een klantactie op het
      -- voorstel is ontstaan telt niet meer mee zodra er ná die taak contact is
      -- vastgelegd; anders blijft een afgehandelde klantactie als open actie staan.
      select count(*)::int as open_tasks
      from tasks t
      where t.lead_id = b.id
        and t.status <> 'Afgerond'
        and not (
          coalesce(t.automation_key, '') like 'proposal-interest-%'
          and b.last_contact_at is not null
          and b.last_contact_at >= t.created_at
        )
    ) t on true
    left join lateral (
      select
        max(pr.created_at) as last_proposal_at,
        max(coalesce(pr.public_last_viewed_at, pr.public_viewed_at)) as last_proposal_viewed_at,
        sum(coalesce(pr.public_view_count, 0)) as proposal_view_count,
        max(pr.interest_at) as last_interest_at,
        (array_agg(pr.interest_status order by pr.interest_at desc nulls last)
           filter (where pr.interest_status is not null))[1] as interest_status
      from proposals pr
      where pr.lead_id = b.id
    ) p on true
    left join lateral (
      select max(ml.created_at) as last_mail_at
      from mail_logs ml
      where ml.lead_id = b.id
    ) m on true
    order by b.created_at desc
  `;

  return { sql, params };
}
