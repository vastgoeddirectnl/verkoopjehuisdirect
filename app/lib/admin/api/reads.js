// Leesacties van de admin-API (GET /api/admin/v2?action=…). Zie shared.js.

import { NextResponse } from "next/server";
import { query, queryOne, SQL_TODAY_NL } from "../../neonDb";
import { listLeads } from "../../leads";
import { ARCHIVE_LEAD_STATUSES } from "../../leadStatus.js";
import { ARCHIVE_PROPOSAL_STATUSES } from "./shared";
import { aggregateLeadMarketing } from "../leadReport.js";
import { isUuid } from "../../requestSecurity";

export async function leads({ searchParams }) {
  const leads = await listLeads({
    status: searchParams.get("status"),
    search: searchParams.get("search"),
    limit: Number(searchParams.get("limit") || 300),
    archive: searchParams.get("archive") || "active",
  });
  return NextResponse.json({ leads });
}

export async function lead({ searchParams }) {
  const id = searchParams.get("id");
  if (!isUuid(id)) return NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });
  const lead = await queryOne("select * from leads where id = $1", [id]);
  if (!lead) return NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });

  // Andere aanvragen op hetzelfde adres (dubbel ingestuurd, of eerder al eens
  // aangevraagd). De duplicaatcontrole bij binnenkomst kijkt maar 3 minuten
  // terug; dit laat de rest zien zonder iets automatisch samen te voegen.
  const relatedLeadsQuery = lead.postcode && lead.huisnummer
    ? query(
      `select id, naam, status, created_at
       from leads
       where id <> $1
         and upper(replace(coalesce(postcode, ''), ' ', '')) = upper(replace($2, ' ', ''))
         and lower(trim(coalesce(huisnummer, ''))) = lower(trim($3))
       order by created_at desc
       limit 10`,
      [id, lead.postcode, lead.huisnummer]
    )
    : Promise.resolve({ rows: [] });

  const [{ rows: tasks }, { rows: proposals }, { rows: mailLogs }, { rows: proposalEvents }, { rows: relatedLeads }] = await Promise.all([
    query("select * from tasks where lead_id = $1 order by due_date asc nulls last, created_at desc", [id]),
    query("select * from proposals where lead_id = $1 order by created_at desc", [id]),
    query("select * from mail_logs where lead_id = $1 order by created_at desc limit 100", [id]),
    query(`select e.*, p.amount_text, p.property_address, p.version_number
           from proposal_events e
           left join proposals p on p.id = e.proposal_id
           where e.lead_id = $1
           order by e.created_at desc
           limit 200`, [id]),
    relatedLeadsQuery,
  ]);

  return NextResponse.json({ lead, tasks, proposals, mailLogs, proposalEvents, relatedLeads });
}

export async function tasks({ searchParams }) {
  const status = searchParams.get("status");
  const params = [];
  const where = [];
  if (status && status !== "Alle") {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  where.push(`not (
    coalesce(automation_key, '') like 'proposal-interest-%'
    and exists (
      select 1 from leads l
      where l.id = tasks.lead_id
        and l.last_contact_at is not null
        and l.last_contact_at >= tasks.created_at
    )
  )`);
  const { rows } = await query(
    `select * from tasks ${where.length ? `where ${where.join(" and ")}` : ""} order by due_date asc nulls last, created_at desc limit 300`,
    params
  );
  return NextResponse.json({ tasks: rows });
}

export async function proposals({ searchParams }) {
  const archive = searchParams.get("archive") || "active";
  const params = [];
  let where = "";

  if (archive === "archive") {
    params.push(ARCHIVE_PROPOSAL_STATUSES);
    where = `where coalesce(status, 'Concept') = any($${params.length})`;
  } else if (archive !== "all") {
    params.push(ARCHIVE_PROPOSAL_STATUSES);
    where = `where coalesce(status, 'Concept') <> all($${params.length})`;
  }

  const { rows } = await query(`select * from proposals ${where} order by created_at desc limit 300`, params);
  return NextResponse.json({ proposals: rows });
}

export async function proposal({ searchParams }) {
  const id = searchParams.get("id");
  const proposal = await queryOne("select * from proposals where id = $1", [id]);
  if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
  const [{ rows: proposalEvents }, { rows: versions }] = await Promise.all([
    query("select * from proposal_events where proposal_id = $1 order by created_at desc limit 200", [id]),
    query(`select id, status, version_number, created_at, updated_at, amount_text, public_token
           from proposals
           where id = $1 or parent_proposal_id = $1 or id = (select parent_proposal_id from proposals where id = $1)
              or parent_proposal_id = (select parent_proposal_id from proposals where id = $1)
           order by version_number asc, created_at asc`, [id]),
  ]);
  return NextResponse.json({ proposal, proposalEvents, versions });
}

export async function mailLogs({ searchParams }) {
  const leadId = searchParams.get("lead_id");
  const params = [];
  const where = [];
  if (leadId) {
    params.push(leadId);
    where.push(`lead_id = $${params.length}`);
  }
  const { rows } = await query(
    `select * from mail_logs ${where.length ? `where ${where.join(" and ")}` : ""} order by created_at desc limit 250`,
    params
  );
  return NextResponse.json({ mailLogs: rows });
}

export async function report() {
  const [kpis, marketingLeads, byStatus, recentTasks] = await Promise.all([
    queryOne(`
      select
        count(*) filter (where coalesce(status, 'Nieuw') <> all($1))::int as total_leads,
        count(*) filter (where created_at >= now() - interval '30 days' and coalesce(status, 'Nieuw') <> all($1))::int as leads_30d,
        count(*) filter (where coalesce(status, 'Nieuw') in ('Nieuw','Nieuwe aanvraag'))::int as new_leads,
        count(*) filter (where coalesce(status, 'Nieuw') = any($1))::int as archived_leads,
        (select count(*)::int
         from tasks t
         left join leads l2 on l2.id = t.lead_id
         where t.status <> 'Afgerond'
           and not (
             coalesce(t.automation_key, '') like 'proposal-interest-%'
             and l2.last_contact_at is not null
             and l2.last_contact_at >= t.created_at
           )) as open_tasks,
        count(*) filter (where lead_priority = 'Hoog' and coalesce(status, 'Nieuw') <> all($1))::int as high_priority_leads,
        count(*) filter (where next_follow_up_at is not null and next_follow_up_at <= ${SQL_TODAY_NL} and coalesce(status, 'Nieuw') <> all($1))::int as followups_due,
        count(*) filter (where status = 'Voorstel bekeken')::int as proposal_viewed_leads,
        (select count(*)::int from proposals where coalesce(status, 'Concept') <> all($2)) as total_proposals,
        (select count(*)::int from proposals where coalesce(status, 'Concept') = any($2)) as archived_proposals,
        (select count(*)::int from mail_logs where status = 'Verzonden') as sent_mails
      from leads
    `, [ARCHIVE_LEAD_STATUSES, ARCHIVE_PROPOSAL_STATUSES]),
    // SRC-01: kanaal- en paginarapportage over alle aanvragen van de laatste
    // twaalf maanden (ook afgehandelde — die kwamen ook ergens vandaan), en
    // per kanaal hoeveel er tot een deal leidden. Het groeperen gebeurt in
    // leadReport.js, omdat het kanaal uit meerdere velden wordt afgeleid.
    query(`
      select bron, pagina, status, created_at
      from leads
      where created_at >= now() - interval '12 months'
    `),
    query(`
      select coalesce(nullif(status, ''), 'Onbekend') as label, count(*)::int as total
      from leads where coalesce(status, 'Nieuw') <> all($1) group by 1 order by total desc, label asc
    `, [ARCHIVE_LEAD_STATUSES]),
    query(`
      select t.*
      from tasks t
      left join leads l2 on l2.id = t.lead_id
      where t.status <> 'Afgerond'
        and not (
          coalesce(t.automation_key, '') like 'proposal-interest-%'
          and l2.last_contact_at is not null
          and l2.last_contact_at >= t.created_at
        )
      order by t.due_date asc nulls last, t.created_at desc
      limit 10
    `),
  ]);

  const marketing = aggregateLeadMarketing(marketingLeads.rows);

  return NextResponse.json({
    kpis: kpis || {},
    byChannel: marketing.byChannel,
    byPage: marketing.byPage,
    byMonth: marketing.byMonth,
    marketingTotal: marketing.total,
    testLeads: marketing.testCount,
    byStatus: byStatus.rows,
    recentTasks: recentTasks.rows,
  });
}
