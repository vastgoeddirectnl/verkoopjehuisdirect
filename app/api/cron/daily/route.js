import { NextResponse } from "next/server";
import crypto from "crypto";
import { query, SQL_TODAY_NL } from "../../../lib/neonDb";
import { refreshAllLeadAutomation } from "../../../lib/automation";
import { sendResendMail, hasMailConfig } from "../../../lib/mail";
import { reportError } from "../../../lib/reportError.js";
import { buildDailyDigest } from "../../../lib/admin/dailyDigest.js";
import { leadChannel, isTestLead } from "../../../lib/sourceParser.js";
import { ARCHIVE_LEAD_STATUSES } from "../../../lib/leadStatus.js";
import { todayAmsterdam } from "../../../lib/date.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// CRON-01: elke ochtend (zie vercel.json). Herberekent opvolgdatums, sluit
// afgehandelde automatische taken en mailt een overzicht van wat er die dag
// aandacht vraagt. Voorheen draaide de automatisering alleen bij een nieuwe
// aanvraag of als iemand in de admin op de knop drukte.
//
// Vercel stuurt bij een cron-aanroep "Authorization: Bearer <CRON_SECRET>"
// mee. Zonder CRON_SECRET weigert de route; dan zou iedereen hem kunnen
// aanroepen en de mail laten versturen.

function authorized(request) {
  const secret = process.env.CRON_SECRET || "";
  if (!secret) return false;
  const given = Buffer.from(String(request.headers.get("authorization") || ""));
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");
}

export async function GET(request) {
  if (!process.env.CRON_SECRET) {
    await reportError({ scope: "cron/daily", error: "CRON_SECRET ontbreekt; dagelijkse automatisering draait niet.", severity: "critical" });
    return NextResponse.json({ error: "Niet geconfigureerd." }, { status: 503 });
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }

  try {
    const automation = await refreshAllLeadAutomation(200, 30000);

    const [followUps, newLeads, viewedProposals, customerActions] = await Promise.all([
      query(
        `select id, naam, status, next_follow_up_at
         from leads
         where next_follow_up_at is not null
           and next_follow_up_at <= ${SQL_TODAY_NL}
           and coalesce(status, 'Nieuw') <> all($1)
         order by next_follow_up_at asc, created_at desc
         limit 30`,
        [ARCHIVE_LEAD_STATUSES]
      ),
      query(
        `select id, naam, postcode, huisnummer, bron, pagina
         from leads
         where created_at >= now() - interval '24 hours'
         order by created_at desc
         limit 30`
      ),
      query(
        `select id, lead_id, lead_naam, property_address, public_view_count
         from proposals
         where public_last_viewed_at >= now() - interval '24 hours'
         order by public_last_viewed_at desc
         limit 20`
      ),
      query(
        `select e.lead_id, e.event_type, e.message, p.lead_naam
         from proposal_events e
         left join proposals p on p.id = e.proposal_id
         where e.event_type in ('interested','discuss','question')
           and e.created_at >= now() - interval '24 hours'
         order by e.created_at desc
         limit 20`
      ),
    ]);

    const digest = buildDailyDigest({
      siteUrl: siteUrl(),
      today: todayAmsterdam(),
      followUps: followUps.rows,
      newLeads: newLeads.rows.filter((lead) => !isTestLead(lead)).map((lead) => ({ ...lead, channel: leadChannel(lead) })),
      viewedProposals: viewedProposals.rows,
      customerActions: customerActions.rows,
    });

    let mail = { skipped: true, reason: "Geen mailconfiguratie." };
    if (hasMailConfig()) {
      mail = await sendResendMail({
        to: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
        subject: digest.subject,
        html: digest.html,
      });
    }

    return NextResponse.json({ ok: true, automation, digestItems: digest.total, mailSkipped: Boolean(mail?.skipped) });
  } catch (error) {
    await reportError({ scope: "cron/daily", error, severity: "critical" });
    return NextResponse.json({ error: "Dagelijkse run mislukt." }, { status: 500 });
  }
}
