import { NextResponse } from "next/server";
import { queryOne, query } from "../../../../lib/neonDb";
import { isUuid } from "../../../../lib/requestSecurity";

export const runtime = "nodejs";

function clean(value, max = 800) {
  return String(value || "").trim().slice(0, max);
}

function isExpiredDate(value) {
  if (!value) return false;
  const expiry = new Date(`${String(value).slice(0, 10)}T23:59:59`);
  if (Number.isNaN(expiry.getTime())) return false;
  return expiry.getTime() < Date.now();
}

function canRecordProposalAction(proposal) {
  const status = String(proposal?.status || "").trim().toLowerCase();
  return ["verzonden", "bekeken"].includes(status) && !isExpiredDate(proposal?.validity_date);
}

export async function POST(request, { params }) {
  try {
    const { token } = await params;
    if (!isUuid(token)) return NextResponse.json({ error: "Ongeldig voorstel." }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const action = clean(body.action, 40);
    if (!["interested", "discuss", "question"].includes(action)) {
      return NextResponse.json({ error: "Ongeldige actie." }, { status: 400 });
    }

    const proposal = await queryOne(
      "select id, lead_id, lead_naam, status, validity_date from proposals where public_token = $1::uuid",
      [token]
    );
    if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
    if (!canRecordProposalAction(proposal)) {
      return NextResponse.json(
        { error: "Dit voorstel is niet meer actief voor online reactie. Neem contact met ons op om de actuele mogelijkheden te bespreken." },
        { status: 409 }
      );
    }

    const label = action === "interested" ? "Positief" : action === "discuss" ? "Bespreken" : "Vraag";
    const message = clean(body.message, 800);

    await query(
      `update proposals
       set interest_status = $2,
           interest_at = now(),
           interest_message = $3,
           updated_at = now()
       where id = $1`,
      [proposal.id, label, message || null]
    );

    if (proposal.lead_id) {
      await query(
        `update leads
         set status = case when $2 = 'Positief' and status not in ('Akkoord','Afgewezen','Afgewezen / vervallen','Afgerond','Gearchiveerd') then 'In onderhandeling' else status end,
             next_follow_up_at = current_date,
             updated_at = now()
         where id = $1`,
        [proposal.lead_id, label]
      );

      const automationKey = `proposal-interest-${proposal.id}`;
      const taskTitle = label === "Positief" ? "Klant is positief over voorstel - direct opvolgen" : "Klant wil voorstel bespreken";
      const taskNote = message || `Actie vanaf openbare voorstelpagina: ${label}.`;
      const existingTask = await queryOne(
        "select id from tasks where lead_id = $1 and automation_key = $2 limit 1",
        [proposal.lead_id, automationKey]
      );
      if (existingTask?.id) {
        await query(
          "update tasks set title = $2, due_date = current_date, status = 'Open', note = $3, updated_at = now() where id = $1",
          [existingTask.id, taskTitle, taskNote]
        );
      } else {
        await query(
          `insert into tasks (lead_id, lead_naam, title, due_date, status, note, automation_key)
           values ($1, $2, $3, current_date, 'Open', $4, $5)`,
          [proposal.lead_id, proposal.lead_naam, taskTitle, taskNote, automationKey]
        );
      }
    }

    return NextResponse.json({ ok: true, status: label });
  } catch (error) {
    console.error("proposal action failed", error);
    return NextResponse.json({ error: "Actie kon niet worden opgeslagen." }, { status: 500 });
  }
}
