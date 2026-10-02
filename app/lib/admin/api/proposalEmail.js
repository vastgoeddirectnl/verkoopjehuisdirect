// HTML-mail "Uw verkoopvoorstel staat klaar" (ARCH-07). Los van de handler,
// zodat de opmaak en het escapen van klantgegevens te testen zijn zonder
// database of mailprovider.

import { escapeHtml } from "../../mail";
import { formatAddress, emailObjectLabel, formatDateShort, siteUrl } from "./shared";

/**
 * Bouwt onderwerp en HTML voor het mailen van een voorstel.
 * Alle klantinvoer gaat door escapeHtml voordat hij in de HTML belandt.
 */
export function buildProposalEmail({ proposal, publicUrl }) {
  const address = formatAddress(proposal);
  const validity = formatDateShort(proposal.validity_date);
  const subject = address && address !== "-"
    ? `Uw verkoopvoorstel voor ${address} staat klaar`
    : "Uw verkoopvoorstel staat klaar";

  const previewText = address && address !== "-"
    ? `Wij hebben uw vrijblijvende verkoopvoorstel voor ${address} klaargezet. U kunt het rustig bekijken via uw persoonlijke voorstelpagina.`
    : "Wij hebben uw vrijblijvende verkoopvoorstel klaargezet. U kunt het rustig bekijken via uw persoonlijke voorstelpagina.";
  const safePreviewText = escapeHtml(previewText);
  const safeLeadName = escapeHtml(proposal.lead_naam || "heer/mevrouw");
  const safeAddress = escapeHtml(address || "-");
  const safeObjectLabel = escapeHtml(emailObjectLabel(proposal));
  const safeValidity = escapeHtml(validity || "");
  const safePublicUrl = escapeHtml(publicUrl);
  const safeNonbinding = escapeHtml(proposal.nonbinding_text || "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid. Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.");

  const html = `
<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
  :root { color-scheme: light; supported-color-schemes: light; }
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  table { border-collapse: collapse !important; }
  img { border: 0; outline: none; text-decoration: none; height: auto; }
  .email-shell { width: 100%; background: #f5f2ec !important; }
  .email-card { width: 100%; max-width: 680px; background: #fffdf9 !important; }
  .mobile-pad { padding-left: 28px !important; padding-right: 28px !important; }
  .mobile-title { font-size: 30px !important; line-height: 1.12 !important; }
  .body-copy { font-size: 15px !important; line-height: 1.55 !important; }
  @media only screen and (max-width: 600px) {
    .outer-pad { padding: 10px 8px !important; }
    .mobile-pad { padding-left: 18px !important; padding-right: 18px !important; }
    .hero-pad { padding-top: 22px !important; padding-bottom: 22px !important; }
    .body-pad { padding-top: 20px !important; padding-bottom: 20px !important; }
    .footer-pad { padding-top: 18px !important; padding-bottom: 18px !important; }
    .mobile-title { font-size: 27px !important; line-height: 1.12 !important; }
    .body-copy { font-size: 15px !important; line-height: 1.48 !important; }
    .compact-box { padding: 16px !important; }
    .compact-row { padding: 12px 13px !important; }
    .email-logo { max-width: 190px !important; }
    .legal-copy { font-size: 10.5px !important; line-height: 1.4 !important; }
  }
  @media (prefers-color-scheme: dark) {
    .email-shell { background: #f5f2ec !important; }
    .email-card, .content-bg, .white-box { background: #fffdf9 !important; }
    .hero-bg, .footer-bg { background: #071f3a !important; }
    .text-dark { color: #071f3a !important; }
    .text-body { color: #48586b !important; }
    .text-muted { color: #5f7083 !important; }
    .text-light { color: #d9e6f5 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f5f2ec !important;color:#071f3a;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${safePreviewText}</div>

<table role="presentation" width="100%" class="email-shell" bgcolor="#f5f2ec" style="width:100%;background:#f5f2ec !important;">
  <tr>
    <td align="center" class="outer-pad" style="padding:20px 12px;">
      <table role="presentation" width="680" class="email-card" bgcolor="#fffdf9" style="width:100%;max-width:680px;background:#fffdf9 !important;border:1px solid #e8e3db;border-radius:22px;overflow:hidden;">
        <tr>
          <td class="hero-bg mobile-pad hero-pad" bgcolor="#071f3a" style="background:#071f3a !important;padding:26px 28px;color:#ffffff;">
            <img class="email-logo" src="${siteUrl()}/logo.png" alt="Vastgoed Direct Nederland" width="205" style="display:block;width:205px;max-width:100%;height:auto;background:#ffffff;border-radius:12px;padding:7px;">
            <div style="margin-top:20px;font-size:11px;line-height:1.2;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;color:#d9e6f5;">
              Vrijblijvend verkoopvoorstel
            </div>
            <h1 class="mobile-title" style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.12;color:#ffffff;letter-spacing:-.02em;">
              Uw verkoopvoorstel staat klaar
            </h1>
            <p class="body-copy text-light" style="margin:11px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#d9e6f5;">
              Bekijk uw voorstel rustig via uw persoonlijke voorstelpagina. U zit nergens aan vast door het voorstel te openen.
            </p>
          </td>
        </tr>

        <tr>
          <td class="content-bg mobile-pad body-pad" bgcolor="#fffdf9" style="background:#fffdf9 !important;padding:24px 28px;">
            <p class="body-copy text-body" style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#48586b;">
              Beste ${safeLeadName},
            </p>

            <p class="body-copy text-body" style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#48586b;">
              Naar aanleiding van uw aanvraag staat uw vrijblijvende verkoopvoorstel klaar. Daarin vindt u het voorgestelde bedrag, de belangrijkste uitgangspunten, planning, voorwaarden en vervolgstappen.
            </p>

            <table role="presentation" width="100%" bgcolor="#F7F2EC" style="width:100%;background:#F7F2EC !important;border:1px solid #F2B885;border-radius:17px;margin:16px 0;">
              <tr>
                <td class="compact-box" style="padding:18px;">
                  <div style="font-size:11px;color:#A94612;text-transform:uppercase;font-weight:bold;letter-spacing:.07em;">${safeObjectLabel}</div>
                  <div class="text-dark" style="font-size:18px;font-weight:bold;margin-top:5px;color:#071f3a;line-height:1.3;">${safeAddress}</div>
                  ${validity ? `<div class="text-body" style="font-size:13px;color:#48586b;margin-top:8px;">Geldig tot: ${safeValidity}</div>` : ""}
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" style="width:100%;margin:14px 0 18px;">
              <tr>
                <td class="compact-row white-box" bgcolor="#ffffff" style="background:#ffffff !important;border:1px solid #e8e3db;border-radius:13px;padding:12px 14px;">
                  <strong class="text-dark" style="display:block;color:#071f3a;font-size:14px;">Rustig bekijken</strong>
                  <span class="text-muted" style="display:block;color:#5f7083;font-size:13px;line-height:1.42;margin-top:3px;">Bekijk bedrag, planning en voorwaarden op uw gemak.</span>
                </td>
              </tr>
              <tr><td height="8" style="font-size:0;line-height:0;">&nbsp;</td></tr>
              <tr>
                <td class="compact-row white-box" bgcolor="#ffffff" style="background:#ffffff !important;border:1px solid #e8e3db;border-radius:13px;padding:12px 14px;">
                  <strong class="text-dark" style="display:block;color:#071f3a;font-size:14px;">Vragen? Wij lichten het toe</strong>
                  <span class="text-muted" style="display:block;color:#5f7083;font-size:13px;line-height:1.42;margin-top:3px;">Reageer op deze e-mail of neem telefonisch contact op.</span>
                </td>
              </tr>
            </table>

            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
              <tr>
                <td bgcolor="#B24E15" style="background:#B24E15;border-radius:999px;">
                  <a href="${safePublicUrl}" style="display:inline-block;background:#B24E15;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px;font-size:15px;line-height:1.1;font-weight:bold;text-align:center;">
                    Verkoopvoorstel inzien
                  </a>
                </td>
              </tr>
            </table>

            <p class="body-copy text-body" style="margin:0 0 10px;font-size:15px;line-height:1.55;color:#48586b;">
              Wilt u het voorstel bespreken? Reageer gerust op deze e-mail of bel/WhatsApp <strong>06 12 23 80 51</strong>.
            </p>

            <p class="body-copy text-body" style="margin:0;font-size:15px;line-height:1.55;color:#48586b;">
              Definitieve afspraken worden pas vastgelegd nadat alle voorwaarden zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend.
            </p>
          </td>
        </tr>

        <tr>
          <td class="footer-bg mobile-pad footer-pad" bgcolor="#071f3a" style="background:#071f3a !important;padding:18px 28px;color:#d9e6f5;font-size:13px;line-height:1.5;">
            <strong style="display:block;color:#ffffff;margin-bottom:3px;">Vastgoed Direct Nederland</strong>
            <span class="text-light" style="color:#d9e6f5;">info@vastgoeddirectnederland.nl · 06 12 23 80 51 · vastgoeddirectnederland.nl</span>
          </td>
        </tr>
      </table>

      <p class="legal-copy" style="max-width:680px;margin:10px auto 0;padding:0 8px;font-size:11px;line-height:1.42;color:#7a8797;text-align:center;">
        ${safeNonbinding}
      </p>
    </td>
  </tr>
</table>
</body>
</html>
  `;

  return { subject, html };
}
