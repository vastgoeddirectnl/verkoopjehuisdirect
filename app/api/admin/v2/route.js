import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../lib/adminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

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

  const db = supabaseAdmin();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "leads";

  try {
    if (action === "leads") {
      const status = searchParams.get("status");
      const search = searchParams.get("search");
      let q = db.from("leads").select("*").order("created_at", { ascending: false }).limit(300);
      if (status && status !== "Alle") q = q.eq("status", status);
      if (search) q = q.or(`naam.ilike.%${search}%,email.ilike.%${search}%,telefoon.ilike.%${search}%,postcode.ilike.%${search}%,pagina.ilike.%${search}%,bron.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return NextResponse.json({ leads: data || [] });
    }

    if (action === "proposals") {
      const { data, error } = await db.from("proposals").select("*").order("created_at", { ascending: false }).limit(250);
      if (error) throw error;
      return NextResponse.json({ proposals: data || [] });
    }

    if (action === "proposal") {
      const id = searchParams.get("id");
      const { data, error } = await db.from("proposals").select("*").eq("id", id).single();
      if (error) throw error;
      return NextResponse.json({ proposal: data });
    }

    if (action === "tasks") {
      const { data, error } = await db.from("tasks").select("*").order("due_date", { ascending: true }).limit(300);
      if (error) throw error;
      return NextResponse.json({ tasks: data || [] });
    }

    if (action === "report") {
      const { data, error } = await db.from("leads").select("created_at,pagina,bron,status").order("created_at", { ascending: false }).limit(1000);
      if (error) throw error;
      const byPage = {}, bySource = {}, byStatus = {}, byMonth = {};
      for (const lead of data || []) {
        inc(byPage, lead.pagina);
        inc(bySource, lead.bron);
        inc(byStatus, lead.status || "Nieuw");
        const d = lead.created_at ? new Date(lead.created_at) : null;
        inc(byMonth, d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : "Onbekend");
      }
      return NextResponse.json({ total: data?.length || 0, byPage, bySource, byStatus, byMonth });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = supabaseAdmin();
  const body = await request.json();
  const action = body.action;

  try {
    if (action === "updateLead") {
      const updates = {};
      for (const key of ["status", "notitie", "last_contact_at"]) {
        if (Object.prototype.hasOwnProperty.call(body, key)) updates[key] = body[key];
      }
      updates.updated_at = new Date().toISOString();
      const { data, error } = await db.from("leads").update(updates).eq("id", body.id).select("*").single();
      if (error) throw error;
      return NextResponse.json({ lead: data });
    }

    if (action === "createProposal") {
      const insert = {
        lead_id: String(body.lead_id || ""),
        lead_naam: body.lead_naam || "",
        lead_email: body.lead_email || "",
        lead_telefoon: body.lead_telefoon || "",
        property_address: body.property_address || "",
        amount_text: body.amount_text || "",
        validity_date: body.validity_date || null,
        transfer_date_text: body.transfer_date_text || "",
        deposit_text: body.deposit_text || "",
        conditions_text: body.conditions_text || "",
        notes: body.notes || "",
        status: "Concept",
      };
      const { data, error } = await db.from("proposals").insert([insert]).select("*").single();
      if (error) throw error;
      return NextResponse.json({ proposal: data });
    }

    if (action === "createTask") {
      const { data, error } = await db.from("tasks").insert([{
        lead_id: body.lead_id ? String(body.lead_id) : null,
        lead_naam: body.lead_naam || "",
        title: body.title || "Nieuwe taak",
        due_date: body.due_date || null,
        status: body.status || "Open",
        note: body.note || "",
      }]).select("*").single();
      if (error) throw error;
      return NextResponse.json({ task: data });
    }

    if (action === "updateTask") {
      const { data, error } = await db.from("tasks").update({
        status: body.status,
        updated_at: new Date().toISOString(),
      }).eq("id", body.id).select("*").single();
      if (error) throw error;
      return NextResponse.json({ task: data });
    }

    if (action === "sendProposalEmail") {
      if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
        return NextResponse.json({ error: "RESEND_API_KEY en/of FROM_EMAIL ontbreekt." }, { status: 500 });
      }
      const { data: proposal, error } = await db.from("proposals").select("*").eq("id", body.id).single();
      if (error) throw error;
      if (!proposal.lead_email) return NextResponse.json({ error: "Geen e-mailadres bekend." }, { status: 400 });

      const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.verkoopjehuisdirect.nl";
      const url = `${site}/admin/voorstellen/${proposal.id}/print`;
      const html = `<p>Beste ${proposal.lead_naam || "heer/mevrouw"},</p><p>Uw vrijblijvende verkoopvoorstel staat klaar:</p><p><a href="${url}">${url}</a></p><p>Met vriendelijke groet,<br>Vastgoed Direct Nederland<br>06 12 23 80 51</p>`;

      const mail = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.FROM_EMAIL, to: proposal.lead_email, subject: "Vrijblijvend verkoopvoorstel Vastgoed Direct Nederland", html }),
      });

      const mailResult = await mail.json().catch(() => ({}));
      if (!mail.ok) return NextResponse.json({ error: mailResult.message || "E-mail verzenden mislukt." }, { status: 500 });

      await db.from("proposals").update({ status: "Verzonden", emailed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", body.id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Onbekende actie." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
