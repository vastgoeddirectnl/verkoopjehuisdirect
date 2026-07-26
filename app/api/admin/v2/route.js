import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { query, queryOne } from "../../../lib/neonDb";
import { listLeads } from "../../../lib/leads";
import { sendResendMail } from "../../../lib/mail";
import { logMailEventSafe } from "../../../lib/mailLog";
import { markProposalSentAutomation, refreshLeadAutomation, refreshAllLeadAutomation } from "../../../lib/automation";

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
  if (["validity_date", "desired_transfer_date", "seller_work_deadline"].includes(field)) return value || null;
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
  if (!value) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
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

      const [{ rows: tasks }, { rows: proposals }, { rows: mailLogs }] = await Promise.all([
        query("select * from tasks where lead_id = $1 order by due_date asc nulls last, created_at desc", [id]),
        query("select * from proposals where lead_id = $1 order by created_at desc", [id]),
        query("select * from mail_logs where lead_id = $1 order by created_at desc limit 100", [id]),
      ]);

      return NextResponse.json({ lead, tasks, proposals, mailLogs });
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
      return NextResponse.json({ proposal });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "updateLead") {
      const allowed = ["status", "notitie", "last_contact_at", "naam", "email", "telefoon", "postcode", "huisnummer", "woningtype", "staat", "reden", "next_follow_up_at"];
      const updates = [];
      const params = [];

      for (const field of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          let value = body[field];
          if (field === "status" && value && !STATUSES.includes(value)) value = "Nieuwe aanvraag";
          params.push(value || null);
          updates.push(`${field} = $${params.length}`);
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

    if (action === "sendProposalEmail") {
      let proposal = await queryOne("select * from proposals where id = $1", [body.id]);
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      if (!proposal.lead_email) return NextResponse.json({ error: "Geen e-mailadres bekend." }, { status: 400 });

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

      const html = `
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${previewText}</div>
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f2ec;padding:28px;color:#071f3a;">
          <div style="max-width:720px;margin:0 auto;background:#fffdf9;border:1px solid #e8e3db;border-radius:28px;overflow:hidden;box-shadow:0 22px 70px rgba(7,31,58,.12);">
            <div style="background:#071f3a;padding:30px 32px;color:#fff;position:relative;">
              <img src="${siteUrl()}/logo.png" alt="Vastgoed Direct Nederland" style="max-width:220px;height:auto;background:#fff;border-radius:16px;padding:8px;">
              <div style="margin-top:26px;display:inline-block;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.24);border-radius:999px;padding:8px 12px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;">
                Vrijblijvend verkoopvoorstel
              </div>
              <h1 style="margin:16px 0 0;font-size:34px;line-height:1.08;color:#fff;letter-spacing:-.03em;">
                Uw verkoopvoorstel staat klaar
              </h1>
              <p style="margin:14px 0 0;font-size:16px;line-height:1.65;color:#d9e6f5;">
                Wij hebben uw vrijblijvende verkoopvoorstel overzichtelijk klaargezet. U bekijkt het voorstel via uw persoonlijke voorstelpagina. Het bekijken van het voorstel betekent niet dat u ergens aan vastzit.
              </p>
            </div>

            <div style="padding:30px 32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#48586b;">Beste ${proposal.lead_naam || "heer/mevrouw"},</p>

              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#48586b;">
                Naar aanleiding van uw aanvraag hebben wij een vrijblijvend verkoopvoorstel voor uw woning klaargezet.
                In het voorstel leest u onder andere het voorgestelde bedrag, de uitgangspunten, de mogelijke planning, de voorwaarden en de vervolgstappen.
              </p>

              <div style="background:#F7F2EC;border:1px solid #F2B885;border-radius:22px;padding:22px;margin:22px 0;">
                <div style="font-size:12px;color:#B85216;text-transform:uppercase;font-weight:bold;letter-spacing:.07em;">Woning</div>
                <div style="font-size:20px;font-weight:bold;margin-top:6px;color:#071f3a;line-height:1.3;">${address || "-"}</div>
                <div style="font-size:15px;line-height:1.6;margin-top:12px;color:#48586b;">U bekijkt het voorstel via uw persoonlijke voorstelpagina. Zo blijft de inhoud overzichtelijk bij elkaar.</div>
                ${validity ? `<div style="font-size:14px;color:#48586b;margin-top:10px;">Geldig tot: ${validity}</div>` : ""}
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;margin:18px 0 24px;">
                <tr>
                  <td style="background:#ffffff;border:1px solid #e8e3db;border-radius:16px;padding:15px;">
                    <strong style="display:block;color:#071f3a;font-size:15px;">Rustig bekijken</strong>
                    <span style="display:block;color:#5f7083;font-size:14px;line-height:1.5;margin-top:4px;">U kunt het voorstel op uw gemak doornemen.</span>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffffff;border:1px solid #e8e3db;border-radius:16px;padding:15px;">
                    <strong style="display:block;color:#071f3a;font-size:15px;">Vragen bespreken</strong>
                    <span style="display:block;color:#5f7083;font-size:14px;line-height:1.5;margin-top:4px;">Wij lichten het voorstel graag telefonisch of per e-mail toe.</span>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffffff;border:1px solid #e8e3db;border-radius:16px;padding:15px;">
                    <strong style="display:block;color:#071f3a;font-size:15px;">Vrijblijvend bekijken</strong>
                    <span style="display:block;color:#5f7083;font-size:14px;line-height:1.5;margin-top:4px;">Het bekijken van het voorstel betekent niet dat u ergens aan vastzit.</span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 26px;">
                <a href="${publicUrl}" style="display:block;width:100%;max-width:320px;box-sizing:border-box;background:#D96A1C;color:#fff;text-decoration:none;border-radius:999px;padding:15px 24px;font-weight:bold;text-align:center;box-shadow:0 12px 26px rgba(217,106,28,.18);">
                  Verkoopvoorstel inzien
                </a>
              </p>

              <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#48586b;">
                Heeft u vragen of wilt u het voorstel bespreken? Reageer gerust op deze e-mail of neem contact met ons op via telefoon of WhatsApp: <strong>06 12 23 80 51</strong>.
              </p>

              <p style="margin:0;font-size:15px;line-height:1.65;color:#48586b;">
                Als het voorstel voor u interessant is, bespreken we samen eventuele vragen en vervolgstappen. Definitieve afspraken worden pas vastgelegd nadat alle voorwaarden zijn uitgewerkt en een koopovereenkomst door koper en verkoper is ondertekend.
              </p>
            </div>

            <div style="padding:22px 32px;background:#071f3a;color:#d9e6f5;font-size:14px;line-height:1.55;">
              <strong style="display:block;color:#fff;margin-bottom:5px;">Vastgoed Direct Nederland</strong>
              info@vastgoeddirectnederland.nl · 06 12 23 80 51 · vastgoeddirectnederland.nl
            </div>
          </div>

          <p style="max-width:720px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#7a8797;text-align:center;">
            ${proposal.nonbinding_text || "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid."}
          </p>
        </div>
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
            "update leads set status = 'Voorstel verzonden', next_follow_up_at = current_date + interval '2 days', updated_at = now() where id = $1 and status not in ('Akkoord','Afgewezen','Afgewezen / vervallen','Afgerond','Gearchiveerd')",
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
