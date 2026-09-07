import { query, queryOne } from "./neonDb";
import { sendApplicantConfirmation, sendLeadNotification } from "./mail";
import { logMailEventSafe } from "./mailLog";
import { refreshLeadAutomation } from "./automation";
import { normalizeLead, validateLead } from "./leadValidation.js";
import { buildListLeadsQuery } from "./leadsQuery.js";
import { runCreateLead, runSendLeadMails } from "./leadFlow.js";
import { reportError } from "./reportError.js";

// Her-export zodat bestaande imports uit dit bestand blijven werken.
export { normalizeLead, validateLead };

const DEFAULT_LEAD_TO = "info@vastgoeddirectnederland.nl";

function internalRecipient() {
  return process.env.LEAD_TO_EMAIL || DEFAULT_LEAD_TO;
}

// De volgorde van beide stromen staat in app/lib/leadFlow.js, zodat die
// testbaar is zonder database of mailserver. Dit bestand levert alleen de
// echte implementaties.

/**
 * Verstuurt de interne melding en de ontvangstbevestiging voor een net
 * aangemaakte lead. Losgetrokken van createLead (OPS-02) zodat de aanroeper
 * dit via after() kan draaien, ná de response — elke Resend-call heeft een
 * timeout van 10 seconden, en de bezoeker hoeft daar niet op te wachten
 * terwijl de lead al in de database staat.
 */
export async function sendLeadMails(lead) {
  return runSendLeadMails(lead, {
    sendInternal: sendLeadNotification,
    sendApplicant: sendApplicantConfirmation,
    logMail: logMailEventSafe,
    internalRecipient: internalRecipient(),
    // Kritiek: de lead staat er wel, maar niemand weet ervan.
    onError: ({ scope, error, lead: betrokkenLead }) =>
      reportError({
        scope,
        error,
        severity: "critical",
        context: { lead_id: betrokkenLead?.id },
      }),
  });
}

export async function createLead(input = {}, { sendMail = true } = {}) {
  return runCreateLead(
    input,
    {
      findDuplicate: (lead) =>
        queryOne(
          `select *
           from leads
           where regexp_replace(coalesce(telefoon, ''), '\\D', '', 'g') = $1
             and upper(replace(coalesce(postcode, ''), ' ', '')) = $2
             and lower(trim(coalesce(huisnummer, ''))) = lower($3)
             and created_at >= now() - interval '3 minutes'
           order by created_at desc
           limit 1`,
          [lead.telefoon.replace(/\D/g, ""), lead.postcode, lead.huisnummer]
        ),

      insertLead: (lead) =>
        queryOne(
          `insert into leads (
            naam, email, telefoon, postcode, huisnummer, woningtype, staat, reden, pagina, bron, status
          ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Nieuwe aanvraag') returning *`,
          [
            lead.naam,
            lead.email || null,
            lead.telefoon,
            lead.postcode,
            lead.huisnummer,
            lead.woningtype || null,
            lead.staat || null,
            lead.reden || null,
            lead.pagina,
            lead.bron,
          ]
        ),

      refreshAutomation: refreshLeadAutomation,
      sendMails: sendLeadMails,
    },
    { sendMail }
  );
}

export async function listLeads(options = {}) {
  const { sql, params } = buildListLeadsQuery(options);
  const { rows } = await query(sql, params);
  return rows;
}
