import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { query, queryOne } from "../../../lib/neonDb";
import { listLeads } from "../../../lib/leads";
import { sendResendMail } from "../../../lib/mail";
import { logMailEventSafe } from "../../../lib/mailLog";

export const runtime = "nodejs";

const STATUSES = ["Nieuw", "Contact opgenomen", "In beoordeling", "Voorstel verzonden", "Akkoord", "Afgewezen"];

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
  "notes",
];

function clean(value, max = 1500) {
  return String(value || "").trim().slice(0, max);
}

function cleanForField(field, value) {
  if (field === "lead_id") return value || null;
  if (field === "validity_date") return value || null;
  if (field === "proposal_variant") return clean(value, 40) || "Uitgebreid";
  if (["conditions_text", "assumptions_text", "included_items", "short_comparison_text", "reservations_text", "next_steps_text", "notes"].includes(field)) {
    return clean(value, 2500) || null;
  }
  return clean(value, 300) || null;
}


function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.verkoopjehuisdirect.nl").replace(/\/$/, "");
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
      const { rows } = await query("select * from proposals order by created_at desc limit 300");
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
            count(*)::int as total_leads,
            count(*) filter (where created_at >= now() - interval '30 days')::int as leads_30d,
            count(*) filter (where status = 'Nieuw')::int as new_leads,
            (select count(*)::int from tasks where status <> 'Afgerond') as open_tasks,
            (select count(*)::int from proposals) as total_proposals,
            (select count(*)::int from mail_logs where status = 'Verzonden') as sent_mails
          from leads
        `),
        query(`
          select coalesce(nullif(pagina, ''), '/') as label, count(*)::int as total
          from leads group by 1 order by total desc, label asc limit 20
        `),
        query(`
          select coalesce(nullif(bron, ''), 'onbekend') as label, count(*)::int as total
          from leads group by 1 order by total desc, label asc limit 20
        `),
        query(`
          select coalesce(nullif(status, ''), 'Onbekend') as label, count(*)::int as total
          from leads group by 1 order by total desc, label asc
        `),
        query(`
          select to_char(date_trunc('month', created_at), 'YYYY-MM') as label, count(*)::int as total
          from leads group by 1 order by label desc limit 12
        `),
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
      const allowed = ["status", "notitie", "last_contact_at", "naam", "email", "telefoon", "postcode", "huisnummer", "woningtype", "staat", "reden"];
      const updates = [];
      const params = [];

      for (const field of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          let value = body[field];
          if (field === "status" && value && !STATUSES.includes(value)) value = "Nieuw";
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
      return NextResponse.json({ lead });
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
      const params = columns.map((field) => cleanForField(field, body[field]));
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(",");
      const proposal = await queryOne(
        `insert into proposals (${columns.join(",")}, status) values (${placeholders}, 'Concept') returning *`,
        params
      );
      return NextResponse.json({ proposal });
    }

    if (action === "updateProposal") {
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

    if (action === "sendProposalEmail") {
      let proposal = await queryOne("select * from proposals where id = $1", [body.id]);
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      if (!proposal.lead_email) return NextResponse.json({ error: "Geen e-mailadres bekend." }, { status: 400 });

      const token = await ensurePublicToken(proposal);
      proposal = { ...proposal, public_token: token };

      const publicUrl = `${siteUrl()}/voorstel/${token}`;
      const address = formatAddress(proposal);
      const offerAmount = formatMoney(proposal.amount_text);
      const validity = formatDateShort(proposal.validity_date);
      const subject = address && address !== "-"
        ? `Vrijblijvend verkoopvoorstel voor ${address}`
        : "Uw vrijblijvende verkoopvoorstel van Vastgoed Direct Nederland";

      const previewText = address && offerAmount
        ? `Wij hebben een vrijblijvend verkoopvoorstel klaargezet voor ${address}: ${offerAmount}.`
        : "Wij hebben uw vrijblijvende verkoopvoorstel klaargezet.";

      const html = `
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${previewText}</div>
        <div style="font-family:Arial,sans-serif;background:#f5f2ec;padding:24px;color:#0b2341;">
          <div style="max-width:680px;margin:0 auto;background:#fffdf9;border:1px solid #e8e3db;border-radius:24px;overflow:hidden;">
            <div style="padding:26px 28px;border-bottom:1px solid #e8e3db;">
              <img src="${siteUrl()}/logo.png" alt="Vastgoed Direct Nederland" style="max-width:220px;height:auto;">
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 14px;font-size:16px;line-height:1.55;">Beste ${proposal.lead_naam || "heer/mevrouw"},</p>
              <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;color:#071f3a;">Uw vrijblijvende verkoopvoorstel staat klaar</h1>
              <p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:#48586b;">
                Naar aanleiding van uw aanvraag hebben wij een helder en vrijblijvend verkoopvoorstel voor u klaargezet.
                In het voorstel vindt u het voorgestelde bedrag, de uitgangspunten, voorwaarden en vervolgstappen.
              </p>
              <div style="background:#fff7ef;border:1px solid #ffd5b6;border-radius:18px;padding:18px;margin:20px 0;">
                <div style="font-size:13px;color:#7c4a24;text-transform:uppercase;font-weight:bold;letter-spacing:.06em;">Woning</div>
                <div style="font-size:20px;font-weight:bold;margin-top:4px;color:#071f3a;">${address || "-"}</div>
                <div style="font-size:30px;font-weight:bold;margin-top:8px;color:#ff6a00;">${offerAmount || "In overleg"}</div>
                ${validity ? `<div style="font-size:14px;color:#48586b;margin-top:8px;">Geldig tot: ${validity}</div>` : ""}
              </div>
              <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#48586b;">
                U kunt het voorstel rustig bekijken. Heeft u vragen, wilt u iets aanvullen of wilt u het voorstel bespreken?
                Dan kunt u direct reageren op deze e-mail of bellen/WhatsAppen via <strong>06 12 23 80 51</strong>.
              </p>
              <p style="margin:0 0 24px;">
                <a href="${publicUrl}" style="display:inline-block;background:#ff6a00;color:#fff;text-decoration:none;border-radius:999px;padding:14px 22px;font-weight:bold;">Voorstel bekijken</a>
              </p>
              <p style="margin:0;font-size:14px;line-height:1.55;color:#6a7788;">
                Dit voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging.
              </p>
            </div>
            <div style="padding:20px 28px;background:#071f3a;color:#fff;font-size:14px;">
              Vastgoed Direct Nederland · info@verkoopjehuisdirect.nl · 06 12 23 80 51
            </div>
          </div>
        </div>
      `;

      const mailResult = await sendResendMail({
        to: proposal.lead_email,
        subject,
        html,
        replyTo: process.env.LEAD_TO_EMAIL || "info@verkoopjehuisdirect.nl",
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
            "update leads set status = 'Voorstel verzonden', updated_at = now() where id = $1 and status <> 'Akkoord'",
            [proposal.lead_id]
          );
        }
      }

      return NextResponse.json({ ok: true, skipped: Boolean(mailResult?.skipped), publicUrl, subject, mail: mailResult });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
