// Schrijfacties rond leads en taken (POST /api/admin/v2). Zie shared.js.

import { NextResponse } from "next/server";
import { query, queryOne, SQL_TODAY_NL } from "../../neonDb";
import { refreshLeadAutomation, refreshAllLeadAutomation } from "../../automation";
import { isValidEmail } from "../validators";
import { ACCEPTED_LEAD_STATUSES, clean } from "./shared";

export async function updateLead({ body }) {
  if (body.email && !isValidEmail(body.email)) {
    return NextResponse.json({ error: "Ongeldig e-mailadres." }, { status: 400 });
  }
  const allowed = ["status", "notitie", "last_contact_at", "naam", "email", "telefoon", "postcode", "huisnummer", "woningtype", "staat", "reden", "next_follow_up_at"];
  const updates = [];
  const params = [];

  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      let value = body[field];
      if (field === "status" && value && !ACCEPTED_LEAD_STATUSES.includes(value)) value = "Nieuwe aanvraag";
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

export async function createTask({ body }) {
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

export async function updateTask({ body }) {
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

export async function resolveCustomerAction({ body }) {
  const leadId = clean(body.lead_id, 80);
  if (!leadId) return NextResponse.json({ error: "Lead ontbreekt." }, { status: 400 });

  const eventParams = [leadId];
  let eventWhere = "e.lead_id = $1 and e.event_type in ('interested','discuss','question')";
  if (body.event_id) {
    eventParams.push(clean(body.event_id, 80));
    eventWhere += ` and e.id = $${eventParams.length}`;
  }
  if (body.proposal_id) {
    eventParams.push(clean(body.proposal_id, 80));
    eventWhere += ` and e.proposal_id = $${eventParams.length}`;
  }

  const customerEvent = await queryOne(
    `select e.*, p.lead_naam
     from proposal_events e
     left join proposals p on p.id = e.proposal_id
     where ${eventWhere}
     order by e.created_at desc
     limit 1`,
    eventParams
  );
  if (!customerEvent) return NextResponse.json({ error: "Klantactie niet gevonden." }, { status: 404 });

  const lead = await queryOne(
    `update leads
     set last_contact_at = now(),
         status = case
           when status in ('Nieuw','Nieuwe aanvraag') then 'In behandeling'
           else status
         end,
         automation_follow_up_at = null,
         next_follow_up_at = case
           when manual_follow_up_at is not null and manual_follow_up_at > ${SQL_TODAY_NL} then manual_follow_up_at
           else null
         end,
         updated_at = now()
     where id = $1
     returning *`,
    [leadId]
  );
  if (!lead) return NextResponse.json({ error: "Lead niet gevonden." }, { status: 404 });

  const automationKey = customerEvent.proposal_id ? `proposal-interest-${customerEvent.proposal_id}` : null;
  if (automationKey) {
    await query(
      `update tasks
       set status = 'Afgerond',
           note = trim(coalesce(note, '') || E'\n\nAfgehandeld: contactmoment vastgelegd na klantactie in voorstel.'),
           updated_at = now()
       where lead_id = $1
         and automation_key = $2
         and status <> 'Afgerond'`,
      [leadId, automationKey]
    );
  }

  await query(
    `insert into proposal_events (proposal_id, lead_id, event_type, message, metadata)
     values ($1,$2,'admin_customer_action_resolved',$3,$4::jsonb)`,
    [
      customerEvent.proposal_id,
      leadId,
      "Klantactie is afgehandeld; contactmoment is vastgelegd in de adminomgeving.",
      JSON.stringify({ source: "admin", resolved_event_id: customerEvent.id }),
    ]
  );

  return NextResponse.json({ ok: true, lead });
}

export async function runAutomation({ body }) {
  const result = await refreshAllLeadAutomation(body.limit || 200);
  return NextResponse.json({ ok: true, ...result });
}
