import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req) {
  try {
    const body = await req.json();

    const lead = {
      naam: escapeHtml(body.naam),
      email: escapeHtml(body.email),
      telefoon: escapeHtml(body.telefoon),
      postcode: escapeHtml(body.postcode),
      huisnummer: escapeHtml(body.huisnummer),
      woningtype: escapeHtml(body.woningtype),
      staat: escapeHtml(body.staat),
      reden: escapeHtml(body.reden),
    };

    await resend.emails.send({
      from: "Vastgoed Direct Nederland <onboarding@resend.dev>",
      to: ["info@verkoopjehuisdirect.nl"],
      subject: "Nieuwe woningaanvraag via verkoopjehuisdirect.nl",
      html: `
        <h2>Nieuwe woningaanvraag</h2>
        <p><strong>Naam:</strong> ${lead.naam}</p>
        <p><strong>E-mail:</strong> ${lead.email}</p>
        <p><strong>Telefoon:</strong> ${lead.telefoon}</p>
        <p><strong>Adres:</strong> ${lead.postcode} ${lead.huisnummer}</p>
        <p><strong>Type woning:</strong> ${lead.woningtype}</p>
        <p><strong>Staat woning:</strong> ${lead.staat}</p>
        <p><strong>Reden verkoop:</strong> ${lead.reden}</p>
        <hr />
        <p><strong>Actie:</strong> bel deze lead zo snel mogelijk.</p>
      `,
    });

    if (body.email) {
      await resend.emails.send({
        from: "Vastgoed Direct Nederland <onboarding@resend.dev>",
        to: [body.email],
        subject: "Uw aanvraag is ontvangen",
        html: `
          <h2>Uw aanvraag is ontvangen</h2>
          <p>Beste ${lead.naam || "heer/mevrouw"},</p>
          <p>Bedankt voor uw aanvraag via verkoopjehuisdirect.nl.</p>
          <p>Wij nemen zo snel mogelijk contact met u op voor een vrijblijvend verkoopvoorstel.</p>
          <p>Met vriendelijke groet,</p>
          <p><strong>Vastgoed Direct Nederland</strong></p>
          <p>info@verkoopjehuisdirect.nl<br />06 81 15 80 03</p>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    return Response.json({ success: false, error: "Mail failed" }, { status: 500 });
  }
}
