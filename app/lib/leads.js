import { query, queryOne } from "./neonDb";
import { sendApplicantConfirmation, sendLeadNotification } from "./mail";
import { logMailEventSafe } from "./mailLog";
import { refreshLeadAutomation } from "./automation";
import { normalizeLead, validateLead } from "./leadValidation.js";
import { buildListLeadsQuery } from "./leadsQuery.js";

// Her-export zodat bestaande imports uit dit bestand blijven werken.
export { normalizeLead, validateLead };


// Verstuurt de interne melding en de ontvangstbevestiging voor een net
// aangemaakte lead. Losgetrokken van createLead (OPS-02) zodat de aanroeper
// dit via after() kan draaien, ná de response — elke Resend-call heeft een
// timeout van 10 seconden, en de bezoeker hoeft daar niet op te wachten
// terwijl de lead al in de database staat.
export async function sendLeadMails(lead) {
  const mail = {
    internal: { skipped: true },
    applicant: { skipped: true },
  };

  try {
    mail.internal = await sendLeadNotification(lead);
    await logMailEventSafe({
      lead_id: lead?.id,
      type: "interne melding",
      recipient: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
      subject: `Nieuwe aanvraag verkoopvoorstel${lead?.postcode ? ` - ${lead.postcode}` : ""}`,
      status: mail.internal?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: mail.internal?.id,
      error: mail.internal?.reason,
    });
  } catch (error) {
    console.warn("Lead opgeslagen, maar interne e-mailmelding is niet verzonden:", error.message);
    mail.internal = { skipped: false, error: error.message };
    await logMailEventSafe({
      lead_id: lead?.id,
      type: "interne melding",
      recipient: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
      subject: "Nieuwe aanvraag verkoopvoorstel",
      status: "Fout",
      error: error.message,
    });
  }

  try {
    mail.applicant = await sendApplicantConfirmation(lead);
    await logMailEventSafe({
      lead_id: lead?.id,
      type: "ontvangstbevestiging",
      recipient: lead?.email,
      subject: "Wij hebben uw aanvraag ontvangen",
      status: mail.applicant?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: mail.applicant?.id,
      error: mail.applicant?.reason,
    });
  } catch (error) {
    console.warn("Lead opgeslagen, maar ontvangstbevestiging is niet verzonden:", error.message);
    mail.applicant = { skipped: false, error: error.message };
    await logMailEventSafe({
      lead_id: lead?.id,
      type: "ontvangstbevestiging",
      recipient: lead?.email,
      subject: "Wij hebben uw aanvraag ontvangen",
      status: "Fout",
      error: error.message,
    });
  }

  return mail;
}

export async function createLead(input = {}, { sendMail = true } = {}) {
  const lead = normalizeLead(input);
  const validation = validateLead(lead);

  if (!validation.ok) {
    const error = new Error(validation.error);
    error.status = 400;
    throw error;
  }

  // Voorkom dubbele records door dubbelklikken/netwerk-retries binnen enkele minuten.
  const duplicate = await queryOne(
    `select *
     from leads
     where regexp_replace(coalesce(telefoon, ''), '\\D', '', 'g') = $1
       and upper(replace(coalesce(postcode, ''), ' ', '')) = $2
       and lower(trim(coalesce(huisnummer, ''))) = lower($3)
       and created_at >= now() - interval '3 minutes'
     order by created_at desc
     limit 1`,
    [
      lead.telefoon.replace(/\D/g, ""),
      lead.postcode,
      lead.huisnummer,
    ]
  );

  if (duplicate) {
    return { lead: duplicate, mail: { duplicate: true } };
  }

  const saved = await queryOne(
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
  );

  const automatedLead = await refreshLeadAutomation(saved);
  const finalLead = automatedLead || saved || lead;

  if (!sendMail) {
    return { lead: finalLead, mail: { deferred: true } };
  }

  const mail = await sendLeadMails(finalLead);
  return { lead: finalLead, mail };
}

export async function listLeads(options = {}) {
  const { sql, params } = buildListLeadsQuery(options);
  const { rows } = await query(sql, params);
  return rows;
}
