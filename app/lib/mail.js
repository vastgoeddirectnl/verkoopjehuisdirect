import { Resend } from "resend";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFromEmail() {
  return process.env.FROM_EMAIL || "Vastgoed Direct Nederland <info@verkoopjehuisdirect.nl>";
}

export async function sendLeadEmails(lead) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY ontbreekt." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safe = {
    naam: escapeHtml(lead.naam),
    email: escapeHtml(lead.email),
    telefoon: escapeHtml(lead.telefoon),
    postcode: escapeHtml(lead.postcode),
    huisnummer: escapeHtml(lead.huisnummer),
    woningtype: escapeHtml(lead.woningtype),
    staat: escapeHtml(lead.staat),
    reden: escapeHtml(lead.reden),
    pagina: escapeHtml(lead.pagina),
    bron: escapeHtml(lead.bron),
  };

  await resend.emails.send({
    from: getFromEmail(),
    to: ["info@verkoopjehuisdirect.nl"],
    subject: "Nieuwe woningaanvraag via verkoopjehuisdirect.nl",
    html: `
      <h2>Nieuwe woningaanvraag</h2>
      <p><strong>Naam:</strong> ${safe.naam}</p>
      <p><strong>E-mail:</strong> ${safe.email}</p>
      <p><strong>Telefoon:</strong> ${safe.telefoon}</p>
      <p><strong>Adres:</strong> ${safe.postcode} ${safe.huisnummer}</p>
      <p><strong>Type woning:</strong> ${safe.woningtype}</p>
      <p><strong>Staat woning:</strong> ${safe.staat}</p>
      <p><strong>Reden verkoop:</strong> ${safe.reden}</p>
      <hr />
      <p><strong>Pagina:</strong> ${safe.pagina}</p>
      <p><strong>Bron:</strong> ${safe.bron}</p>
      <p><strong>Actie:</strong> bel deze lead zo snel mogelijk.</p>
    `,
  });

  if (lead.email) {
    await resend.emails.send({
      from: getFromEmail(),
      to: [lead.email],
      subject: "Uw aanvraag is ontvangen",
      html: `
        <h2>Uw aanvraag is ontvangen</h2>
        <p>Beste ${safe.naam || "heer/mevrouw"},</p>
        <p>Bedankt voor uw aanvraag via verkoopjehuisdirect.nl.</p>
        <p>Wij nemen zo snel mogelijk contact met u op voor een vrijblijvend verkoopvoorstel.</p>
        <p>Met vriendelijke groet,</p>
        <p><strong>Vastgoed Direct Nederland</strong></p>
        <p>info@verkoopjehuisdirect.nl<br />06 12 23 80 51</p>
      `,
    });
  }

  return { sent: true };
}
