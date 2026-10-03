// Ochtendmail "vandaag opvolgen" (CRON-01). Puur: krijgt de gegevens binnen en
// geeft onderwerp en HTML terug, zodat de opbouw zonder database of
// mailprovider te testen is. De cron-route (app/api/cron/daily) haalt de
// gegevens op en verstuurt.

import { escapeHtml } from "../mail.js";
import { formatDateNL } from "../date.js";

const EVENT_LABELS = {
  interested: "wil verder met het voorstel",
  discuss: "wil het voorstel bespreken",
  question: "heeft een vraag over het voorstel",
};

function leadLink(siteUrl, id, label) {
  return `<a href="${escapeHtml(`${siteUrl}/admin/leads/${id}`)}" style="color:#071f3a;font-weight:bold;">${escapeHtml(label || "Naam onbekend")}</a>`;
}

function section(title, rows) {
  if (!rows.length) return "";
  return `
    <h2 style="margin:22px 0 8px;font-family:Georgia,serif;font-size:19px;color:#071f3a;">${escapeHtml(title)}</h2>
    <table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px;">
      ${rows.map((row) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e3db;color:#48586b;line-height:1.45;">${row}</td></tr>`).join("")}
    </table>`;
}

export function buildDailyDigest({ siteUrl, today, customerActions = [], viewedProposals = [], newLeads = [], followUps = [] }) {
  const actionRows = customerActions.map((event) =>
    `${leadLink(siteUrl, event.lead_id, event.lead_naam)} ${escapeHtml(EVENT_LABELS[event.event_type] || "reageerde op het voorstel")}${event.message ? `<br><span style="color:#5f7083;">“${escapeHtml(String(event.message).slice(0, 200))}”</span>` : ""}`
  );
  const viewedRows = viewedProposals.map((proposal) =>
    `${leadLink(siteUrl, proposal.lead_id, proposal.lead_naam)} bekeek het voorstel${proposal.property_address ? ` voor ${escapeHtml(proposal.property_address)}` : ""} (${Number(proposal.public_view_count || 1)}×)`
  );
  const newRows = newLeads.map((lead) =>
    `${leadLink(siteUrl, lead.id, lead.naam)} · ${escapeHtml([lead.postcode, lead.huisnummer].filter(Boolean).join(" ") || "adres onbekend")}${lead.channel ? ` · ${escapeHtml(lead.channel)}` : ""}`
  );
  const followRows = followUps.map((lead) => {
    const due = String(lead.next_follow_up_at || "").slice(0, 10);
    const when = due && due < today ? `over tijd sinds ${formatDateNL(due, { day: "numeric", month: "short" })}` : "vandaag";
    return `${leadLink(siteUrl, lead.id, lead.naam)} · ${escapeHtml(lead.status || "Nieuw")} · opvolging ${when}`;
  });

  const total = actionRows.length + viewedRows.length + newRows.length + followRows.length;
  const parts = [
    actionRows.length ? `${actionRows.length} klantreactie${actionRows.length === 1 ? "" : "s"}` : "",
    followRows.length ? `${followRows.length} opvolging${followRows.length === 1 ? "" : "en"}` : "",
    newRows.length ? `${newRows.length} nieuwe aanvra${newRows.length === 1 ? "ag" : "gen"}` : "",
  ].filter(Boolean);

  const subject = total
    ? `Vandaag: ${parts.join(", ") || `${viewedRows.length} bekeken voorstel(len)`}`
    : "Vandaag: geen openstaande acties";

  const html = `<!doctype html>
<html lang="nl"><body style="margin:0;padding:20px;background:#f5f2ec;font-family:Arial,Helvetica,sans-serif;color:#071f3a;">
  <div style="max-width:640px;margin:0 auto;background:#fffdf9;border:1px solid #e8e3db;border-radius:18px;padding:24px;">
    <div style="font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;color:#A94612;">Ochtendoverzicht · ${escapeHtml(formatDateNL(today))}</div>
    <h1 style="margin:8px 0 4px;font-family:Georgia,serif;font-size:26px;">Wat er vandaag aandacht vraagt</h1>
    ${total ? "" : `<p style="color:#48586b;">Geen klantreacties, opvolgingen of nieuwe aanvragen. De automatisering is wel gedraaid.</p>`}
    ${section("Klantreacties (laatste 24 uur)", actionRows)}
    ${section("Voorstel bekeken (laatste 24 uur)", viewedRows)}
    ${section("Opvolgen", followRows)}
    ${section("Nieuwe aanvragen (laatste 24 uur)", newRows)}
    <p style="margin:24px 0 0;"><a href="${escapeHtml(`${siteUrl}/admin`)}" style="display:inline-block;background:#B24E15;color:#fff;text-decoration:none;font-weight:bold;border-radius:999px;padding:12px 18px;">Open het dashboard</a></p>
  </div>
</body></html>`;

  return { subject, html, total };
}
