// De volgorde van het leadpad, los van database en mail.
//
// Dit is het pad waar een fout je direct een aanvraag kost, en het was tot nu
// toe het enige belangrijke stuk zonder test: de validatie was getest, de
// query was getest, de bedragen waren getest — maar niet de kéten.
//
// Alles wat naar buiten praat komt als functie binnen (`deps`). Daardoor is de
// volgorde hier te testen zonder database of mailserver, en staat de
// bedrijfsregel in één leesbaar blok in plaats van verspreid door
// app/lib/leads.js. Dat bestand levert de echte implementaties aan.

import { normalizeLead, validateLead } from "./leadValidation.js";

/**
 * Valideren → dubbele aanvraag afvangen → opslaan → automatisering →
 * (optioneel) mailen.
 *
 * deps:
 *  - findDuplicate(lead)   → bestaande lead binnen de dubbelklikvenster, of null
 *  - insertLead(lead)      → de opgeslagen rij
 *  - refreshAutomation(row)→ de bijgewerkte rij, of iets falsy
 *  - sendMails(lead)       → resultaatobject van de mailpoging
 */
export async function runCreateLead(input = {}, deps = {}, { sendMail = true } = {}) {
  const { findDuplicate, insertLead, refreshAutomation, sendMails } = deps;

  const lead = normalizeLead(input);
  const validation = validateLead(lead);

  if (!validation.ok) {
    const error = new Error(validation.error);
    error.status = 400;
    throw error;
  }

  // Dubbelklikken en netwerk-retries mogen geen tweede lead opleveren, en
  // vooral geen tweede mail naar dezelfde klant.
  const duplicate = await findDuplicate(lead);
  if (duplicate) {
    return { lead: duplicate, mail: { duplicate: true } };
  }

  const saved = await insertLead(lead);

  // De automatisering mag het opslaan nooit ongedaan maken: als die faalt,
  // valt de flow terug op de rij zoals hij is opgeslagen.
  const automated = await refreshAutomation(saved);
  const finalLead = automated || saved || lead;

  if (!sendMail) {
    return { lead: finalLead, mail: { deferred: true } };
  }

  return { lead: finalLead, mail: await sendMails(finalLead) };
}

/**
 * De twee mails na een nieuwe aanvraag. Ze worden onafhankelijk van elkaar
 * verstuurd: een mislukte interne melding mag de ontvangstbevestiging aan de
 * klant niet tegenhouden, en andersom.
 *
 * deps:
 *  - sendInternal(lead) / sendApplicant(lead) → resultaat van de mailpoging
 *  - logMail(entry)                           → schrijft naar mail_logs
 *  - onError({ scope, error, lead })          → meldt een storing
 */
export async function runSendLeadMails(lead, deps = {}) {
  const { sendInternal, sendApplicant, logMail, onError, internalRecipient } = deps;

  const mail = {
    internal: { skipped: true },
    applicant: { skipped: true },
  };

  const onderwerpIntern = `Nieuwe aanvraag verkoopvoorstel${lead?.postcode ? ` - ${lead.postcode}` : ""}`;

  try {
    mail.internal = await sendInternal(lead);
    await logMail({
      lead_id: lead?.id,
      type: "interne melding",
      recipient: internalRecipient,
      subject: onderwerpIntern,
      status: mail.internal?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: mail.internal?.id,
      error: mail.internal?.reason,
    });
  } catch (error) {
    mail.internal = { skipped: false, error: error.message };
    await onError({ scope: "lead/interne-melding", error, lead });
    await logMail({
      lead_id: lead?.id,
      type: "interne melding",
      recipient: internalRecipient,
      subject: onderwerpIntern,
      status: "Fout",
      error: error.message,
    });
  }

  try {
    mail.applicant = await sendApplicant(lead);
    await logMail({
      lead_id: lead?.id,
      type: "ontvangstbevestiging",
      recipient: lead?.email,
      subject: "Wij hebben uw aanvraag ontvangen",
      status: mail.applicant?.skipped ? "Overgeslagen" : "Verzonden",
      provider_id: mail.applicant?.id,
      error: mail.applicant?.reason,
    });
  } catch (error) {
    mail.applicant = { skipped: false, error: error.message };
    await onError({ scope: "lead/ontvangstbevestiging", error, lead });
    await logMail({
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
