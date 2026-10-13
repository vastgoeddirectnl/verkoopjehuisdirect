// Inhoud van de directe melding bij een reactie op het voorstel (5.7.0).
// Puur, zodat de tests zonder database draaien; het versturen staat in
// app/lib/customerAlerts.js.

import { escapeHtml } from "./mail.js";

export const KINDS = {
  interested: {
    subject: "Akkoord op voorstel",
    headline: "De klant gaat akkoord met het voorstel",
    hint: "Dit is nog geen getekende koopovereenkomst. Bel de klant vandaag om de afspraken door te nemen.",
  },
  discuss: {
    subject: "Klant wil voorstel bespreken",
    headline: "De klant wil het voorstel bespreken",
    hint: "Bel of app de klant om een moment af te spreken.",
  },
  question: {
    subject: "Vraag over voorstel",
    headline: "De klant heeft een vraag over het voorstel",
    hint: "Beantwoord de vraag zo snel mogelijk; de klant zit nu in het voorstel.",
  },
  first_view: {
    subject: "Voorstel geopend",
    headline: "De klant heeft het voorstel voor het eerst geopend",
    hint: "Een goed moment om binnenkort even te bellen.",
  },
};

export const PROPOSAL_ALERT_KINDS = Object.keys(KINDS);

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");
}

/** 0612345678 → 31612345678, voor een wa.me-link. */
export function whatsappNumber(phone = "") {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `31${digits.slice(1)}`;
  return digits.length >= 10 ? digits : "";
}

export function proposalAlertContent({ kind, lead = {}, proposal = {}, message = "", baseUrl = siteUrl() } = {}) {
  const config = KINDS[kind];
  if (!config) return null;

  const naam = lead.naam || proposal.lead_naam || "Onbekende klant";
  const adres = proposal.property_address || [lead.postcode, lead.huisnummer, lead.plaats].filter(Boolean).join(" ");
  const subject = `${config.subject}: ${naam}${adres ? ` (${adres})` : ""}`;

  const leadUrl = proposal.lead_id ? `${baseUrl}/admin/leads/${proposal.lead_id}` : `${baseUrl}/admin`;
  const wa = whatsappNumber(lead.telefoon);
  const contact = [
    lead.telefoon ? `<a href="tel:${escapeHtml(lead.telefoon)}">${escapeHtml(lead.telefoon)}</a>` : "",
    wa ? `<a href="https://wa.me/${wa}">WhatsApp</a>` : "",
    lead.email ? `<a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>` : "",
  ].filter(Boolean).join(" · ");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#0b2341;line-height:1.5;max-width:620px;">
      <h2 style="margin:0 0 8px;">${escapeHtml(config.headline)}</h2>
      <p style="margin:0 0 16px;"><strong>${escapeHtml(naam)}</strong>${adres ? ` · ${escapeHtml(adres)}` : ""}</p>
      ${message ? `<p style="margin:0 0 16px;padding:12px 14px;background:#f8f4ed;border-left:4px solid #c05617;">${escapeHtml(message)}</p>` : ""}
      ${contact ? `<p style="margin:0 0 16px;">${contact}</p>` : ""}
      <p style="margin:0 0 16px;">${escapeHtml(config.hint)}</p>
      <p><a href="${leadUrl}" style="display:inline-block;padding:10px 16px;background:#08233d;color:#fff;text-decoration:none;border-radius:6px;">Open de lead in het dashboard</a></p>
    </div>
  `;

  return { subject, html };
}
