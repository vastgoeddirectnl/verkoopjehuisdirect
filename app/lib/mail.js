const DEFAULT_TO = "info@vastgoeddirectnederland.nl";

export function escapeHtml(value = "") {
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
    return {
      skipped: true,
      reason: "RESEND_API_KEY en/of FROM_EMAIL ontbreekt.",
    };
  }

  if (!to) {
    return {
      skipped: true,
      reason: "Geen ontvanger opgegeven.",
    };
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
    signal: AbortSignal.timeout(10_000),
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
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#0b2341;line-height:1.5;">
      <h2>Nieuwe aanvraag via vastgoeddirectnederland.nl</h2>
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
      <p>Bekijk de lead in het interne dashboard: <a href="https://www.vastgoeddirectnederland.nl/admin">/admin</a></p>
    </div>
  `;

  return sendResendMail({ to, subject, html, replyTo: lead.email || undefined });
}

export async function sendApplicantConfirmation(lead) {
  if (!lead.email) {
    return {
      skipped: true,
      reason: "Geen e-mailadres van aanvrager ontvangen.",
    };
  }

  const subject = "Wij hebben uw aanvraag ontvangen";
  const name = lead.naam ? escapeHtml(lead.naam) : "";
  const address = escapeHtml(`${lead.postcode || ""} ${lead.huisnummer || ""}`.trim());

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:16px;color:#0b2341;line-height:1.55;max-width:620px;">
      <p>Beste ${name || "heer/mevrouw"},</p>

      <p>Bedankt voor uw aanvraag via <strong>Vastgoed Direct Nederland</strong>.</p>

      <p>Wij hebben uw gegevens ontvangen${address ? ` voor <strong>${address}</strong>` : ""}. Wij bekijken uw aanvraag zorgvuldig en nemen zo snel mogelijk contact met u op om uw situatie rustig te bespreken.</p>

      <p>Uw aanvraag is vrijblijvend en verplicht u tot niets.</p>

      <p>
        Wilt u sneller contact? Dan kunt u ons ook bereiken via WhatsApp of telefonisch op<br />
        <strong>06 12 23 80 51</strong>.
      </p>

      <p>Met vriendelijke groet,</p>

      <p>
        <strong>Vastgoed Direct Nederland</strong><br />
        <a href="https://www.vastgoeddirectnederland.nl">www.vastgoeddirectnederland.nl</a><br />
        <a href="mailto:info@vastgoeddirectnederland.nl">info@vastgoeddirectnederland.nl</a>
      </p>
    </div>
  `;

  return sendResendMail({
    to: lead.email,
    subject,
    html,
    replyTo: process.env.LEAD_TO_EMAIL || DEFAULT_TO,
  });
}
