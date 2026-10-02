// Schrijfacties rond verkoopvoorstellen (POST /api/admin/v2). Zie shared.js.

import { NextResponse } from "next/server";
import { query, queryOne, SQL_TODAY_NL } from "../../neonDb";
import { sendResendMail } from "../../mail";
import { buildProposalEmail } from "./proposalEmail";
import { logMailEventSafe } from "../../mailLog";
import { markProposalSentAutomation } from "../../automation";
import { isValidEmail } from "../validators";
import { proposalValidationIssues } from "../../proposalValidation";
import { parseMoney } from "../../money.js";
import {
  PROPOSAL_FIELDS,
  PROPOSAL_STATUSES,
  clean,
  cleanForField,
  euroText,
  siteUrl,
  ensurePublicToken,
} from "./shared";

export async function createProposal({ body }) {
  const columns = PROPOSAL_FIELDS;
  const proposalBody = { ...body };
  if (proposalBody.seller_work_enabled) {
    const base = parseMoney(proposalBody.seller_work_base_price_text);
    const work = parseMoney(proposalBody.seller_work_amount_text);
    proposalBody.seller_work_total_price_text = base || work ? euroText(base + work) : null;
  }
  const proposalIssues = proposalValidationIssues(proposalBody);
  if (proposalIssues.length) {
    return NextResponse.json({ error: proposalIssues.join(" "), issues: proposalIssues }, { status: 400 });
  }
  const params = columns.map((field) => cleanForField(field, proposalBody[field]));
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(",");
  const proposal = await queryOne(
    `insert into proposals (${columns.join(",")}, status) values (${placeholders}, 'Concept') returning *`,
    params
  );
  return NextResponse.json({ proposal });
}

export async function updateProposal({ body }) {
  if (body.seller_work_enabled) {
    const base = parseMoney(body.seller_work_base_price_text);
    const work = parseMoney(body.seller_work_amount_text);
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

export async function updateProposalStatus({ body }) {
  const status = PROPOSAL_STATUSES.includes(body.status) ? body.status : "Concept";
  const proposal = await queryOne(
    "update proposals set status = $1, updated_at = now() where id = $2 returning *",
    [status, body.id]
  );
  if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
  return NextResponse.json({ proposal });
}

export async function cloneProposalVersion({ body }) {
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

export async function recordProposalWhatsapp({ body }) {
  const proposal = await queryOne(
    "select id, lead_id, lead_naam, lead_telefoon, property_address, amount_text, version_number from proposals where id = $1",
    [body.id]
  );
  if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });

  const mode = clean(body.mode, 30) === "sent" ? "sent" : "prepared";
  const eventType = mode === "sent" ? "admin_whatsapp_sent" : "admin_whatsapp_prepared";
  const message = mode === "sent"
    ? "WhatsApp-bericht dat het voorstel klaarstaat is handmatig als verzonden gemarkeerd."
    : "WhatsApp-bericht dat het voorstel klaarstaat is voorbereid/geopend vanuit de adminomgeving.";

  await query(
    `insert into proposal_events (proposal_id, lead_id, event_type, message, metadata)
     values ($1,$2,$3,$4,$5::jsonb)`,
    [
      proposal.id,
      proposal.lead_id || null,
      eventType,
      message,
      JSON.stringify({
        source: "admin",
        mode,
        public_url: clean(body.public_url || "", 600) || undefined,
      }),
    ]
  );

  if (mode === "sent" && proposal.lead_id) {
    await query(
      `update leads
       set last_contact_at = now(),
           updated_at = now()
       where id = $1`,
      [proposal.lead_id]
    );
  }

  return NextResponse.json({ ok: true, event_type: eventType });
}

export async function sendProposalEmail({ body }) {
  let proposal = await queryOne("select * from proposals where id = $1", [body.id]);
  if (!proposal) return NextResponse.json({ error: "Voorstel niet gevonden." }, { status: 404 });
  const recipientOverride = clean(body.lead_email || "", 300);
  if (recipientOverride) {
    if (!isValidEmail(recipientOverride)) return NextResponse.json({ error: "Ongeldig e-mailadres voor verzending." }, { status: 400 });
    proposal = await queryOne("update proposals set lead_email = $1, updated_at = now() where id = $2 returning *", [recipientOverride, proposal.id]);
  }
  if (!proposal.lead_email || !isValidEmail(proposal.lead_email)) return NextResponse.json({ error: "Geen geldig e-mailadres bekend." }, { status: 400 });

  const proposalIssues = proposalValidationIssues(proposal, { forSending: true });
  if (proposalIssues.length) {
    return NextResponse.json({
      error: `Het voorstel is nog niet verzendklaar. ${proposalIssues.join(" ")}`,
      issues: proposalIssues,
    }, { status: 400 });
  }

  const token = await ensurePublicToken(proposal);
  proposal = { ...proposal, public_token: token };

  const publicUrl = `${siteUrl()}/voorstel/${token}`;
  const { subject, html } = buildProposalEmail({ proposal, publicUrl });

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
        `update leads set status = 'Voorstel verzonden', automation_follow_up_at = ${SQL_TODAY_NL} + 2, next_follow_up_at = coalesce(manual_follow_up_at, ${SQL_TODAY_NL} + 2), updated_at = now() where id = $1 and status not in ('Akkoord','Afgewezen','Afgewezen / vervallen','Afgerond','Gearchiveerd')`,
        [proposal.lead_id]
      );
      await markProposalSentAutomation(proposal);
    }
  }

  return NextResponse.json({ ok: true, skipped: Boolean(mailResult?.skipped), publicUrl, subject, mail: mailResult });
}
