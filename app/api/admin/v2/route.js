import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { query, queryOne } from "../../../lib/neonDb";
import { listLeads } from "../../../lib/leads";
import { escapeHtml, sendResendMail } from "../../../lib/mail";
import { logMailEventSafe } from "../../../lib/mailLog";
import { markProposalSentAutomation, refreshLeadAutomation, refreshAllLeadAutomation } from "../../../lib/automation";
import { isValidEmail } from "../../../lib/admin/validators";
import { formatDateNL } from "../../../lib/date";

export const runtime = "nodejs";

const STATUSES = [
  "Nieuw",
  "Nieuwe aanvraag",
  "Contact opgenomen",
  "In behandeling",
  "In beoordeling",
  "Eerste bod gedaan",
  "Beoordeling gepland",
  "Voorstel opgesteld",
  "Voorstel verzonden",
  "Voorstel bekeken",
  "In onderhandeling",
  "Akkoord",
  "Afgewezen",
  "Afgewezen / vervallen",
  "Afgerond",
  "Gearchiveerd",
];
const ARCHIVE_LEAD_STATUSES = ["Akkoord", "Afgewezen", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];
const ARCHIVE_PROPOSAL_STATUSES = ["Akkoord", "Gearchiveerd", "Afgewezen", "Verlopen"];
const PROPOSAL_STATUSES = ["Concept", "Verzonden", "Bekeken", "Akkoord", "Afgewezen", "Verlopen", "Gearchiveerd"];

const PROPOSAL_FIELDS = [
  "proposal_variant",
  "lead_id",
  "lead_naam",
  "lead_email",
  "lead_telefoon",
  "property_address",
  "property_postcode",
  "property_house_number",
  "property_type",
  "living_area_text",
  "plot_area_text",
  "build_year_text",
  "current_situation",
  "amount_text",
  "validity_date",
  "transfer_date_text",
  "deposit_text",
  "conditions_text",
  "assumptions_text",
  "included_items",
  "traditional_price_text",
  "agent_costs_text",
  "notary_costs_text",
  "renovation_costs_text",
  "other_costs_text",
  "traditional_net_text",
  "direct_net_text",
  "short_comparison_text",
  "reservations_text",
  "next_steps_text",
  "contact_person",
  "proposal_type",
  "delivery_term_text",
  "desired_transfer_date",
  "buyer_text",
  "allow_kadaster_registration",
  "allow_abc_resale",
  "seller_cooperates_resale",
  "delivery_free_of_claims",
  "property_same_state",
  "bridge_current_home",
  "bridge_old_home",
  "bridge_goal_text",
  "bridge_explanation_text",
  "seller_work_enabled",
  "seller_work_description",
  "seller_work_deadline",
  "seller_work_amount_text",
  "seller_work_base_price_text",
  "seller_work_total_price_text",
  "seller_work_conditions_text",
  "resale_payment_enabled",
  "resale_threshold_text",
  "resale_percentage_text",
  "resale_deduct_courtage",
  "resale_period_months",
  "resale_cap_text",
  "resale_explanation_text",
  "use_rental_enabled",
  "object_usage_type",
  "current_occupancy_status",
  "delivery_occupancy_status",
  "lease_agreement_available",
  "lease_end_date",
  "tenant_vacate_deadline",
  "tenant_cooperation_status",
  "current_rent_text",
  "deposit_present",
  "rent_arrears_or_dispute",
  "commercial_area_text",
  "residential_area_text",
  "separate_entrance_status",
  "independent_residence_status",
  "zoning_permits_checked",
  "split_potential_status",
  "fire_safety_check_status",
  "use_rental_notes_text",
  "nonbinding_text",
  "notes",
];

function clean(value, max = 1500) {
  return String(value || "").trim().slice(0, max);
}


function parseNonNegativeNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;
  const cleaned = raw
    .replace(/€/g, "")
    .replace(/%/g, "")
    .replace(/\s/g, "")
    .replace(/[^0-9,.-]/g, "");
  if (!cleaned) return 0;
  let normalized = cleaned;
  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");
  if (hasComma && hasDot) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = normalized.replace(",", ".");
  } else if (hasDot) {
    const dotParts = normalized.split(".");
    const lastPart = dotParts[dotParts.length - 1];
    if (lastPart.length === 3 && dotParts.length > 1) {
      normalized = normalized.replace(/\./g, "");
    }
  }
  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? Math.abs(number) : 0;
}

function euroText(value) {
  const number = parseNonNegativeNumber(value);
  if (!number) return null;
  return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Math.round(number))}`;
}

function percentText(value) {
  const number = Math.min(100, Math.max(0, parseNonNegativeNumber(value)));
  if (!number) return null;
  return String(number).replace(".", ",");
}

function cleanForField(field, value) {
  if (field === "lead_id") return value || null;
  if (["validity_date", "desired_transfer_date", "seller_work_deadline", "lease_end_date", "tenant_vacate_deadline"].includes(field)) return value || null;
  if (field === "proposal_variant") return clean(value, 40) || "Uitgebreid";
  if (field === "proposal_type") return clean(value, 80) || "Standaard aankoop";
  if ([
    "allow_kadaster_registration",
    "allow_abc_resale",
    "seller_cooperates_resale",
    "delivery_free_of_claims",
    "property_same_state",
    "seller_work_enabled",
    "resale_payment_enabled",
    "resale_deduct_courtage",
    "use_rental_enabled",
  ].includes(field)) {
    return Boolean(value);
  }
  if ([
    "conditions_text",
    "assumptions_text",
    "included_items",
    "short_comparison_text",
    "reservations_text",
    "next_steps_text",
    "bridge_explanation_text",
    "seller_work_description",
    "seller_work_conditions_text",
    "resale_explanation_text",
    "use_rental_notes_text",
    "nonbinding_text",
    "notes",
  ].includes(field)) {
    return clean(value, 3500) || null;
  }
  if (["seller_work_amount_text", "seller_work_base_price_text", "seller_work_total_price_text", "resale_threshold_text", "resale_cap_text"].includes(field)) {
    return euroText(value);
  }
  if (field === "resale_percentage_text") return percentText(value);
  if (field === "resale_period_months") {
    const months = Math.round(parseNonNegativeNumber(value));
    return months > 0 ? months : null;
  }
  return clean(value, 300) || null;
}


function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");
}

function formatMoney(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.includes("€")) return raw;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Number(digits))}`;
}

function formatAddress(proposal) {
  const explicit = clean(proposal.property_address, 300);
  if (explicit) return explicit.toUpperCase();
  return [proposal.property_postcode, proposal.property_house_number].filter(Boolean).join(" ").toUpperCase();
}

function formatDateShort(value) {
  return value ? formatDateNL(value, { fallback: "" }) : "";
}

async function ensurePublicToken(proposal) {
  if (proposal.public_token) return proposal.public_token;
  const updated = await queryOne(
    "update proposals set public_token = gen_random_uuid(), updated_at = now() where id = $1 returning public_token",
    [proposal.id]
  );
  return updated?.public_token;
}

async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }
  return null;
}

export async function GET(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "overview";

  try {
    if (action === "leads") {
      const leads = await listLeads({
        status: searchParams.get("status"),
        search: searchParams.get("search"),
        limit: Number(searchParams.get("limit") || 300),
        archive: searchParams.get("archive") || "active",
      });
      return NextResponse.json({ leads });
    }

    if (action === "lead") {
      const id = searchParams.get("id");
      const lead = await queryOne("select * from leads where id = $1", [id]);
      if (!lead) return NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });

      const [{ rows: tasks }, { rows: proposals }, { rows: mailLogs }, { rows: proposalEvents }] = await Promise.all([
        query("select * from tasks where lead_id = $1 order by due_date asc nulls last, created_at desc", [id]),
        query("select * from proposals where lead_id = $1 order by created_at desc", [id]),
        query("select * from mail_logs where lead_id = $1 order by created_at desc limit 100", [id]),
        query(`select e.*, p.amount_text, p.property_address, p.version_number
               from proposal_events e
               left join proposals p on p.id = e.proposal_id
               where e.lead_id = $1
               order by e.created_at desc
               limit 200`, [id]),
      ]);

      return NextResponse.json({ lead, tasks, proposals, mailLogs, proposalEvents });
    }

    if (action === "tasks") {
      const status = searchParams.get("status");
      const params = [];
      const where = [];
      if (status && status !== "Alle") {
        params.push(status);
        where.push(`status = $${params.length}`);
      }
      const { rows } = await query(
        `select * from tasks ${where.length ? `where ${where.join(" and ")}` : ""} order by due_date asc nulls last, created_at desc limit 300`,
        params
      );
      return NextResponse.json({ tasks: rows });
    }

    if (action === "proposals") {
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

    if (action === "proposal") {
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

    if (action === "mailLogs") {
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

    if (action === "report" || action === "overview") {
      const [kpis, byPage, bySource, byStatus, byMonth, recentTasks] = await Promise.all([
        queryOne(`
          select
            count(*) filter (where coalesce(status, 'Nieuw') <> all($1))::int as total_leads,
            count(*) filter (where created_at >= now() - interval '30 days' and coalesce(status, 'Nieuw') <> all($1))::int as leads_30d,
            count(*) filter (where coalesce(status, 'Nieuw') in ('Nieuw','Nieuwe aanvraag'))::int as new_leads,
            count(*) filter (where coalesce(status, 'Nieuw') = any($1))::int as archived_leads,
            (select count(*)::int from tasks where status <> 'Afgerond') as open_tasks,
            count(*) filter (where lead_priority = 'Hoog' and coalesce(status, 'Nieuw') <> all($1))::int as high_priority_leads,
            count(*) filter (where next_follow_up_at is not null and next_follow_up_at <= current_date and coalesce(status, 'Nieuw') <> all($1))::int as followups_due,
            count(*) filter (where status = 'Voorstel bekeken')::int as proposal_viewed_leads,
            (select count(*)::int from proposals where coalesce(status, 'Concept') <> all($2)) as total_proposals,
            (select count(*)::int from proposals where coalesce(status, 'Concept') = any($2)) as archived_proposals,
            (select count(*)::int from mail_logs where status = 'Verzonden') as sent_mails
          from leads
        `, [ARCHIVE_LEAD_STATUSES, ARCHIVE_PROPOSAL_STATUSES]),
        query(`
          select coalesce(nullif(pagina, ''), '/') as label, count(*)::int as total
          from leads where coalesce(status, 'Nieuw') <> all($1) group by 1 order by total desc, label asc limit 20
        `, [ARCHIVE_LEAD_STATUSES]),
        query(`
          select coalesce(nullif(bron, ''), 'onbekend') as label, count(*)::int as total
          from leads where coalesce(status, 'Nieuw') <> all($1) group by 1 order by total desc, label asc limit 20
        `, [ARCHIVE_LEAD_STATUSES]),
        query(`
          select coalesce(nullif(status, ''), 'Onbekend') as label, count(*)::int as total
          from leads where coalesce(status, 'Nieuw') <> all($1) group by 1 order by total desc, label asc
        `, [ARCHIVE_LEAD_STATUSES]),
        query(`
          select to_char(date_trunc('month', created_at), 'YYYY-MM') as label, count(*)::int as total
          from leads where coalesce(status, 'Nieuw') <> all($1) group by 1 order by label desc limit 12
        `, [ARCHIVE_LEAD_STATUSES]),
        query(`
          select * from tasks where status <> 'Afgerond' order by due_date asc nulls last, created_at desc limit 10
        `),
      ]);

      return NextResponse.json({
        kpis: kpis || {},
        byPage: byPage.rows,
        bySource: bySource.rows,
        byStatus: byStatus.rows,
        byMonth: byMonth.rows,
        recentTasks: recentTasks.rows,
      });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "updateLead") {
      if (body.email && !isValidEmail(body.email)) {
        return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
      }
      const allowed = ["status", "notitie", "last_contact_at", "naam", "email", "telefoon", "postcode", "huisnummer", "woningtype", "staat", "reden", "next_follow_up_at"];
      const updates = [];
      const params = [];

      for (const field of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          let value = body[field];
          if (field === "status" && value && !STATUSES.includes(value)) value = "Nieuwe aanvraag";
          params.push(value || null);
          if (field === "next_follow_up_at") {
            updates.push(`manual_follow_up_at = $${params.length}`);
            updates.push(`next_follow_up_at = $${params.length}`);
          } else {
            updates.push(`${field} = $${params.length}`);
          }
        }
      }

      if (!updates.length) {
        return NextResponse.json({ error: "Geen wijzigingen ontvangen." }, { status: 400 });
      }

      params.push(body.id);
      const lead = await queryOne(
        `update leads set ${updates.join(", ")}, updated_at = now() where id = $${params.length} returning *`,
        params
      );

      if (!lead) return NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });
      const automatedLead = await refreshLeadAutomation(lead);
      return NextResponse.json({ lead: automatedLead || lead });
    }

    if (action === "createTask") {
      const task = await queryOne(
        `insert into tasks (lead_id, lead_naam, title, due_date, status, note)
         values ($1,$2,$3,$4,'Open',$5) returning *`,
        [
          body.lead_id || null,
          clean(body.lead_naam, 160),
          clean(body.title, 220) || "Nieuwe taak",
          body.due_date || null,
          clean(body.note, 1000),
        ]
      );
      return NextResponse.json({ task });
    }

    if (action === "updateTask") {
      const allowed = ["title", "due_date", "status", "note"];
      const updates = [];
      const params = [];
      for (const field of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          params.push(body[field] || null);
          updates.push(`${field} = $${params.length}`);
        }
      }
      if (!updates.length) return NextResponse.json({ error: "Geen taakwijziging ontvangen." }, { status: 400 });
      params.push(body.id);
      const task = await queryOne(
        `update tasks set ${updates.join(", ")}, updated_at = now() where id = $${params.length} returning *`,
        params
      );
      if (!task) return NextResponse.json({ error: "Taak niet gevonden." }, { status: 404 });
      return NextResponse.json({ task });
    }

    if (action === "createProposal") {
      const columns = PROPOSAL_FIELDS;
      const proposalBody = { ...body };
      if (proposalBody.seller_work_enabled) {
        const base = parseNonNegativeNumber(proposalBody.seller_work_base_price_text);
        const work = parseNonNegativeNumber(proposalBody.seller_work_amount_text);
        proposalBody.seller_work_total_price_text = base || work ? euroText(base + work) : null;
      }
      const params = columns.map((field) => cleanForField(field, proposalBody[field]));
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(",");
      const proposal = await queryOne(
        `insert into proposals (${columns.join(",")}, status) values (${placeholders}, 'Concept') returning *`,
        params
      );
      return NextResponse.json({ proposal });
    }

    if (action === "updateProposal") {
      if (body.seller_work_enabled) {
        const base = parseNonNegativeNumber(body.seller_work_base_price_text);
        const work = parseNonNegativeNumber(body.seller_work_amount_text);
        body.seller_work_total_price_text = base || work ? euroText(base + work) : null;
      }
      const updates = [];
      const params = [];
      for (const field of PROPOSAL_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          params.push(cleanForField(field, body[field]));
          updates.push(`${field} = $${params.length}`);
        }
      }

      if (!updates.length) {
        return NextResponse.json({ error: "Geen voorstelwijziging ontvangen." }, { status: 400 });
      }

      params.push(body.id);
      const proposal = await queryOne(
        `update proposals set ${updates.join(", ")}, updated_at = now() where id = $${params.length} returning *`,
        params
      );
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      return NextResponse.json({ proposal });
    }


    if (action === "updateProposalStatus") {
      const status = PROPOSAL_STATUSES.includes(body.status) ? body.status : "Concept";
      const proposal = await queryOne(
        "update proposals set status = $1, updated_at = now() where id = $2 returning *",
        [status, body.id]
      );
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      return NextResponse.json({ proposal });
    }

    if (action === "cloneProposalVersion") {
      const source = await queryOne("select * from proposals where id = $1", [body.id]);
      if (!source) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });

      const rootId = source.parent_proposal_id || source.id;
      const versionRow = await queryOne(
        `select coalesce(max(version_number), 1)::int + 1 as next_version
         from proposals
         where id = $1 or parent_proposal_id = $1`,
        [rootId]
      );
      const nextVersion = Number(versionRow?.next_version || 2);

      const columns = PROPOSAL_FIELDS;
      const values = columns.map((field) => cleanForField(field, source[field]));
      const placeholders = values.map((_, index) => `$${index + 1}`).join(",");
      values.push(rootId, nextVersion);
      const proposal = await queryOne(
        `insert into proposals (${columns.join(",")}, status, parent_proposal_id, version_number)
         values (${placeholders}, 'Concept', $${values.length - 1}, $${values.length})
         returning *`,
        values
      );

      return NextResponse.json({ proposal });
    }

    if (action === "sendProposalEmail") {
      let proposal = await queryOne("select * from proposals where id = $1", [body.id]);
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      const recipientOverride = clean(body.lead_email || "", 300);
      if (recipientOverride) {
        if (!isValidEmail(recipientOverride)) return NextResponse.json({ error: "Ongeldig e-mailadres voor verzending." }, { status: 400 });
        proposal = await queryOne("update proposals set lead_email = $1, updated_at = now() where id = $2 returning *", [recipientOverride, proposal.id]);
      }
      if (!proposal.lead_email || !isValidEmail(proposal.lead_email)) return NextResponse.json({ error: "Geen geldig e-mailadres bekend." }, { status: 400 });

      const token = await ensurePublicToken(proposal);
      proposal = { ...proposal, public_token: token };

      const publicUrl = `${siteUrl()}/voorstel/${token}`;
      const address = formatAddress(proposal);
      const validity = formatDateShort(proposal.validity_date);
      const subject = address && address !== "-"
        ? `Uw verkoopvoorstel voor ${address} staat klaar`
        : "Uw verkoopvoorstel staat klaar";

      const previewText = address && address !== "-"
        ? `Wij hebben uw vrijblijvende verkoopvoorstel voor ${address} klaargezet. U kunt het rustig bekijken via uw persoonlijke voorstelpagina.`
        : "Wij hebben uw vrijblijvende verkoopvoorstel klaargezet. U kunt het rustig bekijken via uw persoonlijke voorstelpagina.";
      const safePreviewText = escapeHtml(previewText);
      const safeLeadName = escapeHtml(proposal.lead_naam || "heer/mevrouw");
      const safeAddress = escapeHtml(address || "-");
      const safeValidity = escapeHtml(validity || "");
      const safePublicUrl = escapeHtml(publicUrl);
      const safeNonbinding = escapeHtml(proposal.nonbinding_text || "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid. Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.");

      const html = `
<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <style>
      :root { color-scheme: light; supported-color-schemes: light; }
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      table { border-collapse: collapse !important; }
      img { border: 0; outline: none; text-decoration: none; height: auto; }
      .email-shell { width: 100%; background: #f5f2ec !important; }
      .email-card { width: 100%; max-width: 680px; background: #fffdf9 !important; }
      .mobile-pad { padding-left: 28px !important; padding-right: 28px !important; }
      .mobile-title { font-size: 30px !important; line-height: 1.12 !important; }
      .body-copy { font-size: 15px !important; line-height: 1.55 !important; }
      @media only screen and (max-width: 600px) {
        .outer-pad { padding: 10px 8px !important; }
        .mobile-pad { padding-left: 18px !important; padding-right: 18px !important; }
        .hero-pad { padding-top: 22px !important; padding-bottom: 22px !important; }
        .body-pad { padding-top: 20px !important; padding-bottom: 20px !important; }
        .footer-pad { padding-top: 18px !important; padding-bottom: 18px !important; }
        .mobile-title { font-size: 27px !important; line-height: 1.12 !important; }
        .body-copy { font-size: 15px !important; line-height: 1.48 !important; }
        .compact-box { padding: 16px !important; }
        .compact-row { padding: 12px 13px !important; }
        .email-logo { max-width: 190px !important; }
        .legal-copy { font-size: 10.5px !important; line-height: 1.4 !important; }
      }
      @media (prefers-color-scheme: dark) {
        .email-shell { background: #f5f2ec !important; }
        .email-card, .content-bg, .white-box { background: #fffdf9 !important; }
        .hero-bg, .footer-bg { background: #071f3a !important; }
        .text-dark { color: #071f3a !important; }
        .text-body { color: #48586b !important; }
        .text-muted { color: #5f7083 !important; }
        .text-light { color: #d9e6f5 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f5f2ec !important;color:#071f3a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${safePreviewText}</div>

    <table role="presentation" width="100%" class="email-shell" bgcolor="#f5f2ec" style="width:100%;background:#f5f2ec !important;">
      <tr>
        <td align="center" class="outer-pad" style="padding:20px 12px;">
          <table role="presentation" width="680" class="email-card" bgcolor="#fffdf9" style="width:100%;max-width:680px;background:#fffdf9 !important;border:1px solid #e8e3db;border-radius:22px;overflow:hidden;">
            <tr>
              <td class="hero-bg mobile-pad hero-pad" bgcolor="#071f3a" style="background:#071f3a !important;padding:26px 28px;color:#ffffff;">
                <img class="email-logo" src="${siteUrl()}/logo.png" alt="Vastgoed Direct Nederland" width="205" style="display:block;width:205px;max-width:100%;height:auto;background:#ffffff;border-radius:12px;padding:7px;">
                <div style="margin-top:20px;font-size:11px;line-height:1.2;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;color:#d9e6f5;">
                  Vrijblijvend verkoopvoorstel
                </div>
                <h1 class="mobile-title" style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.12;color:#ffffff;letter-spacing:-.02em;">
                  Uw verkoopvoorstel staat klaar
                </h1>
                <p class="body-copy text-light" style="margin:11px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#d9e6f5;">
                  Bekijk uw voorstel rustig via uw persoonlijke voorstelpagina. U zit nergens aan vast door het voorstel te openen.
                </p>
              </td>
            </tr>

            <tr>
              <td class="content-bg mobile-pad body-pad" bgcolor="#fffdf9" style="background:#fffdf9 !important;padding:24px 28px;">
                <p class="body-copy text-body" style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#48586b;">
                  Beste ${safeLeadName},
                </p>

                <p class="body-copy text-body" style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#48586b;">
                  Naar aanleiding van uw aanvraag staat uw vrijblijvende verkoopvoorstel klaar. Daarin vindt u het voorgestelde bedrag, de belangrijkste uitgangspunten, planning, voorwaarden en vervolgstappen.
                </p>

                <table role="presentation" width="100%" bgcolor="#F7F2EC" style="width:100%;background:#F7F2EC !important;border:1px solid #F2B885;border-radius:17px;margin:16px 0;">
                  <tr>
                    <td class="compact-box" style="padding:18px;">
                      <div style="font-size:11px;color:#B85216;text-transform:uppercase;font-weight:bold;letter-spacing:.07em;">Woning</div>
                      <div class="text-dark" style="font-size:18px;font-weight:bold;margin-top:5px;color:#071f3a;line-height:1.3;">${safeAddress}</div>
                      ${validity ? `<div class="text-body" style="font-size:13px;color:#48586b;margin-top:8px;">Geldig tot: ${safeValidity}</div>` : ""}
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" style="width:100%;margin:14px 0 18px;">
                  <tr>
                    <td class="compact-row white-box" bgcolor="#ffffff" style="background:#ffffff !important;border:1px solid #e8e3db;border-radius:13px;padding:12px 14px;">
                      <strong class="text-dark" style="display:block;color:#071f3a;font-size:14px;">Rustig bekijken</strong>
                      <span class="text-muted" style="display:block;color:#5f7083;font-size:13px;line-height:1.42;margin-top:3px;">Bekijk bedrag, planning en voorwaarden op uw gemak.</span>
                    </td>
                  </tr>
                  <tr><td height="8" style="font-size:0;line-height:0;">&nbsp;</td></tr>
                  <tr>
                    <td class="compact-row white-box" bgcolor="#ffffff" style="background:#ffffff !important;border:1px solid #e8e3db;border-radius:13px;padding:12px 14px;">
                      <strong class="text-dark" style="display:block;color:#071f3a;font-size:14px;">Vragen? Wij lichten het toe</strong>
                      <span class="text-muted" style="display:block;color:#5f7083;font-size:13px;line-height:1.42;margin-top:3px;">Reageer op deze e-mail of neem telefonisch contact op.</span>
                    </td>
                  </tr>
                </table>

                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
                  <tr>
                    <td bgcolor="#D96A1C" style="background:#D96A1C;border-radius:999px;">
                      <a href="${safePublicUrl}" style="display:inline-block;background:#D96A1C;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px;font-size:15px;line-height:1.1;font-weight:bold;text-align:center;">
                        Verkoopvoorstel inzien
                      </a>
                    </td>
                  </tr>
                </table>

                <p class="body-copy text-body" style="margin:0 0 10px;font-size:15px;line-height:1.55;color:#48586b;">
                  Wilt u het voorstel bespreken? Reageer gerust op deze e-mail of bel/WhatsApp <strong>06 12 23 80 51</strong>.
                </p>

                <p class="body-copy text-body" style="margin:0;font-size:15px;line-height:1.55;color:#48586b;">
                  Definitieve afspraken worden pas vastgelegd nadat alle voorwaarden zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend.
                </p>
              </td>
            </tr>

            <tr>
              <td class="footer-bg mobile-pad footer-pad" bgcolor="#071f3a" style="background:#071f3a !important;padding:18px 28px;color:#d9e6f5;font-size:13px;line-height:1.5;">
                <strong style="display:block;color:#ffffff;margin-bottom:3px;">Vastgoed Direct Nederland</strong>
                <span class="text-light" style="color:#d9e6f5;">info@vastgoeddirectnederland.nl · 06 12 23 80 51 · vastgoeddirectnederland.nl</span>
              </td>
            </tr>
          </table>

          <p class="legal-copy" style="max-width:680px;margin:10px auto 0;padding:0 8px;font-size:11px;line-height:1.42;color:#7a8797;text-align:center;">
            ${safeNonbinding}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
      `;

      const mailResult = await sendResendMail({
        to: proposal.lead_email,
        subject,
        html,
        replyTo: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
      });

      await logMailEventSafe({
        lead_id: proposal.lead_id,
        proposal_id: proposal.id,
        type: "verkoopvoorstel",
        recipient: proposal.lead_email,
        subject,
        status: mailResult?.skipped ? "Overgeslagen" : "Verzonden",
        provider_id: mailResult?.id,
        error: mailResult?.reason,
      });

      if (!mailResult?.skipped) {
        await query(
          `update proposals
           set status = 'Verzonden',
               emailed_at = now(),
               sent_to_email = $2,
               last_emailed_subject = $3,
               mail_message = $4,
               updated_at = now()
           where id = $1`,
          [proposal.id, proposal.lead_email, subject, publicUrl]
        );

        if (proposal.lead_id) {
          await query(
            "update leads set status = 'Voorstel verzonden', automation_follow_up_at = current_date + 2, next_follow_up_at = coalesce(manual_follow_up_at, current_date + 2), updated_at = now() where id = $1 and status not in ('Akkoord','Afgewezen','Afgewezen / vervallen','Afgerond','Gearchiveerd')",
            [proposal.lead_id]
          );
          await markProposalSentAutomation(proposal);
        }
      }

      return NextResponse.json({ ok: true, skipped: Boolean(mailResult?.skipped), publicUrl, subject, mail: mailResult });
    }

    if (action === "runAutomation") {
      const result = await refreshAllLeadAutomation(body.limit || 300);
      return NextResponse.json({ ok: true, ...result });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Interne serverfout." }, { status: 500 });
  }
}
