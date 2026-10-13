// Directe melding als een klant op het voorstel reageert (5.7.0).
//
// Een klik op "akkoord", "bespreken" of "vraag" op de voorstelpagina maakte
// alleen een taak aan; je hoorde het pas in de ochtendmail van de volgende dag.
// Voor een klant die "ja" zegt is dat te laat. Hetzelfde geldt, iets minder
// urgent, voor de eerste keer dat de klant het voorstel opent.
//
// De opbouw van de mail staat in app/lib/proposalAlertContent.js (puur en
// getest); hier alleen het versturen en loggen, dat nooit gooit.

import { hasMailConfig, sendResendMail } from "./mail.js";
import { KINDS, proposalAlertContent } from "./proposalAlertContent.js";
import { logMailEventSafe } from "./mailLog.js";
import { queryOne } from "./neonDb.js";
import { reportError } from "./reportError.js";

const DEFAULT_TO = "info@vastgoeddirectnederland.nl";

/**
 * Stuurt de melding naar het interne adres en logt hem bij de lead. Gooit
 * nooit: een mislukte melding mag de reactie van de klant niet kosten.
 */
export async function sendProposalAlert({ kind, proposalId, message = "" } = {}) {
  if (!KINDS[kind] || !proposalId) return { skipped: true, reason: "Onbekende melding." };
  if (!hasMailConfig()) return { skipped: true, reason: "Geen mailconfiguratie." };

  const to = process.env.LEAD_TO_EMAIL || DEFAULT_TO;
  let content = null;
  let proposal = null;

  try {
    proposal = await queryOne(
      `select p.id, p.lead_id, p.lead_naam, p.property_address,
              l.naam, l.telefoon, l.email, l.postcode, l.huisnummer, l.plaats
       from proposals p
       left join leads l on l.id = p.lead_id
       where p.id = $1`,
      [proposalId]
    ).catch(async () =>
      // Zonder de kolom plaats (migratie v5_7 nog niet gedraaid).
      queryOne(
        `select p.id, p.lead_id, p.lead_naam, p.property_address,
                l.naam, l.telefoon, l.email, l.postcode, l.huisnummer
         from proposals p
         left join leads l on l.id = p.lead_id
         where p.id = $1`,
        [proposalId]
      )
    );
    if (!proposal) return { skipped: true, reason: "Voorstel niet gevonden." };

    content = proposalAlertContent({ kind, lead: proposal, proposal, message });
    const result = await sendResendMail({ to, subject: content.subject, html: content.html, replyTo: proposal.email || undefined });

    await logMailEventSafe({
      lead_id: proposal.lead_id,
      proposal_id: proposal.id,
      type: "melding klantreactie",
      recipient: to,
      subject: content.subject,
      status: result?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: result?.id,
      error: result?.reason,
    });
    return result;
  } catch (error) {
    await reportError({
      scope: "voorstel/melding-klantreactie",
      error,
      severity: kind === "interested" ? "critical" : "warning",
      context: { proposal_id: proposalId, kind },
    });
    await logMailEventSafe({
      lead_id: proposal?.lead_id,
      proposal_id: proposalId,
      type: "melding klantreactie",
      recipient: to,
      subject: content?.subject || KINDS[kind].subject,
      status: "Fout",
      error: error.message,
    });
    return { skipped: false, error: error.message };
  }
}
