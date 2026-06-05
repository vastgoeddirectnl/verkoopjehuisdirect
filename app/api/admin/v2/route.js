import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { query, queryOne } from "../../../lib/neonDb";
import { listLeads } from "../../../lib/leads";
import { sendResendMail } from "../../../lib/mail";

export const runtime = "nodejs";

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  return null;
}

function inc(obj, key) {
  const k = key || "Onbekend";
  obj[k] = (obj[k] || 0) + 1;
}

export async function GET(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "leads";

  try {
    if (action === "leads") {
      const leads = await listLeads({
        status: searchParams.get("status"),
        search: searchParams.get("search"),
        limit: 300,
      });
      return NextResponse.json({ leads });
    }

    if (action === "proposals") {
      const { rows } = await query(
        "select * from proposals order by created_at desc limit 250"
      );
      return NextResponse.json({ proposals: rows });
    }

    if (action === "proposal") {
      const id = searchParams.get("id");
      const proposal = await queryOne("select * from proposals where id = $1", [id]);
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      return NextResponse.json({ proposal });
    }

    if (action === "tasks") {
      const { rows } = await query(
        "select * from tasks order by due_date asc nulls last, created_at desc limit 300"
      );
      return NextResponse.json({ tasks: rows });
    }

    if (action === "report") {
      const { rows } = await query(
        "select created_at, pagina, bron, status from leads order by created_at desc limit 1000"
      );
      const byPage = {}, bySource = {}, byStatus = {}, byMonth = {};
      for (const lead of rows) {
        inc(byPage, lead.pagina);
        inc(bySource, lead.bron);
        inc(byStatus, lead.status || "Nieuw");
        const d = lead.created_at ? new Date(lead.created_at) : null;
        inc(byMonth, d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : "Onbekend");
      }
      return NextResponse.json({ total: rows.length, byPage, bySource, byStatus, byMonth });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const action = body.action;

  try {
    if (action === "updateLead") {
      const allowedFields = ["status", "notitie", "last_contact_at"];
      const updates = [];
      const params = [];

      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          params.push(body[field] || null);
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

    if (action === "createProposal") {
      const proposal = await queryOne(
        `insert into proposals (
          lead_id, lead_naam, lead_email, lead_telefoon, property_address,
          amount_text, validity_date, transfer_date_text, deposit_text, conditions_text, notes, status
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'Concept') returning *`,
        [
          body.lead_id ? String(body.lead_id) : null,
          body.lead_naam || "",
          body.lead_email || "",
          body.lead_telefoon || "",
          body.property_address || "",
          body.amount_text || "",
          body.validity_date || null,
          body.transfer_date_text || "",
          body.deposit_text || "",
          body.conditions_text || "",
          body.notes || "",
        ]
      );
      return NextResponse.json({ proposal });
    }

    if (action === "createTask") {
      const task = await queryOne(
        `insert into tasks (lead_id, lead_naam, title, due_date, status, note)
         values ($1,$2,$3,$4,$5,$6) returning *`,
        [
          body.lead_id ? String(body.lead_id) : null,
          body.lead_naam || "",
          body.title || "Nieuwe taak",
          body.due_date || null,
          body.status || "Open",
          body.note || "",
        ]
      );
      return NextResponse.json({ task });
    }

    if (action === "updateTask") {
      const task = await queryOne(
        "update tasks set status = $1, updated_at = now() where id = $2 returning *",
        [body.status || "Open", body.id]
      );
      if (!task) return NextResponse.json({ error: "Taak niet gevonden." }, { status: 404 });
      return NextResponse.json({ task });
    }

    if (action === "sendProposalEmail") {
      const proposal = await queryOne("select * from proposals where id = $1", [body.id]);
      if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
      if (!proposal.lead_email) return NextResponse.json({ error: "Geen e-mailadres bekend." }, { status: 400 });

      const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.verkoopjehuisdirect.nl";
      const url = `${site}/admin/voorstellen/${proposal.id}/print`;
      const html = `<p>Beste ${proposal.lead_naam || "heer/mevrouw"},</p><p>Uw vrijblijvende verkoopvoorstel staat klaar:</p><p><a href="${url}">${url}</a></p><p>Met vriendelijke groet,<br>Vastgoed Direct Nederland<br>06 12 23 80 51</p>`;

      await sendResendMail({
        to: proposal.lead_email,
        subject: "Vrijblijvend verkoopvoorstel Vastgoed Direct Nederland",
        html,
      });

      await query(
        "update proposals set status = 'Verzonden', emailed_at = now(), updated_at = now() where id = $1",
        [body.id]
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
