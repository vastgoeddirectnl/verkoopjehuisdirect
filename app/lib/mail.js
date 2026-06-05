const DEFAULT_TO = "info@verkoopjehuisdirect.nl";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function hasMailConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

export async function sendResendMail({ to, subject, html, replyTo }) {
  if (!hasMailConfig()) {
    return { skipped: true, reason: "RESEND_API_KEY en/of FROM_EMAIL ontbreekt." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message || "E-mail verzenden via Resend is mislukt.");
  }
  return json;
}

export async function sendLeadNotification(lead) {
  const to = process.env.LEAD_TO_EMAIL || DEFAULT_TO;
  const subject = `Nieuwe aanvraag verkoopvoorstel${lead.postcode ? ` - ${lead.postcode}` : ""}`;
  const html = `
    <h2>Nieuwe aanvraag via verkoopjehuisdirect.nl</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px;">
      <tr><td><strong>Naam</strong></td><td>${escapeHtml(lead.naam)}</td></tr>
      <tr><td><strong>E-mail</strong></td><td>${escapeHtml(lead.email)}</td></tr>
      <tr><td><strong>Telefoon</strong></td><td>${escapeHtml(lead.telefoon)}</td></tr>
      <tr><td><strong>Adres</strong></td><td>${escapeHtml(`${lead.postcode || ""} ${lead.huisnummer || ""}`.trim())}</td></tr>
      <tr><td><strong>Woningtype</strong></td><td>${escapeHtml(lead.woningtype)}</td></tr>
      <tr><td><strong>Staat</strong></td><td>${escapeHtml(lead.staat)}</td></tr>
      <tr><td><strong>Reden</strong></td><td>${escapeHtml(lead.reden)}</td></tr>
      <tr><td><strong>Pagina</strong></td><td>${escapeHtml(lead.pagina)}</td></tr>
      <tr><td><strong>Bron</strong></td><td>${escapeHtml(lead.bron)}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;">Bekijk de lead in het interne dashboard: <a href="https://www.verkoopjehuisdirect.nl/admin">/admin</a></p>
  `;

  return sendResendMail({ to, subject, html, replyTo: lead.email || undefined });
}
