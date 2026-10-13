import { query, queryOne } from "./neonDb";
import { sendApplicantConfirmation, sendLeadNotification } from "./mail";
import { logMailEventSafe } from "./mailLog";
import { refreshLeadAutomation } from "./automation";
import { normalizeLead, validateLead } from "./leadValidation.js";
import { buildListLeadsQuery } from "./leadsQuery.js";
import { runCreateLead, runSendLeadMails } from "./leadFlow.js";
import { reportError } from "./reportError.js";
import { lookupAddress } from "./address.js";

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

/**
 * Plaats, gemeente en provincie via PDOK bij de lead zetten (5.7.0). Draait
 * na het opslaan, buiten de request van de bezoeker. Gooit nooit: zonder
 * adresgegevens is de lead er nog steeds.
 *
 * Staan de kolommen er nog niet (migratie neon/v5_7_upgrade.sql niet
 * gedraaid), dan gaat de update mis maar krijgt de rest van de stroom (score,
 * melding) de gegevens toch mee via het teruggegeven object.
 */
export async function enrichLeadAddress(lead) {
  if (!lead?.id || !lead.postcode || !lead.huisnummer) return lead;

  const address = await lookupAddress(lead.postcode, lead.huisnummer);
  if (!address) return lead;

  const extra = {
    plaats: address.city || null,
    gemeente: address.municipality || null,
    provincie: address.province || null,
  };

  try {
    const updated = await queryOne(
      `update leads
       set plaats = $2, gemeente = $3, provincie = $4, address_lookup_at = now(), updated_at = now()
       where id = $1
       returning *`,
      [lead.id, extra.plaats, extra.gemeente, extra.provincie]
    );
    return { ...lead, ...extra, ...(updated || {}) };
  } catch (error) {
    console.warn("Adresgegevens niet opgeslagen (is neon/v5_7_upgrade.sql gedraaid?):", error.message);
    return { ...lead, ...extra };
  }
}

/**
 * Alles wat na een nieuwe aanvraag gebeurt en niet op de bezoeker hoeft te
 * wachten: adres verrijken, score opnieuw berekenen (nu mét provincie) en de
 * twee mails versturen. De route roept dit aan via after().
 */
export async function processNewLead(lead) {
  const enriched = await enrichLeadAddress(lead).catch(() => lead);
  const refreshed = await refreshLeadAutomation(enriched);
  // refreshLeadAutomation leest de rij opnieuw uit de database; zonder
  // migratie ontbreken daar plaats en provincie, dus die gaan er weer overheen.
  return sendLeadMails({ ...enriched, ...(refreshed || {}), ...pickAddress(enriched) });
}

function pickAddress(lead) {
  const out = {};
  for (const key of ["plaats", "gemeente", "provincie"]) {
    if (lead?.[key]) out[key] = lead[key];
  }
  return out;
}

/**
 * Vult plaats en provincie aan voor oudere leads, een paar per dagelijkse run.
 * Zo worden ook de leads van vóór 5.7.0 vanzelf compleet.
 */
export async function backfillLeadAddresses(limit = 25) {
  try {
    const { rows } = await query(
      `select id, postcode, huisnummer
       from leads
       where provincie is null and coalesce(postcode, '') <> '' and coalesce(huisnummer, '') <> ''
         and coalesce(address_lookup_at, 'epoch') < now() - interval '30 days'
       order by created_at desc
       limit $1`,
      [limit]
    );
    let filled = 0;
    for (const row of rows) {
      const result = await enrichLeadAddress(row);
      if (result?.provincie) filled += 1;
      // Ook bij "niet gevonden" niet elke dag opnieuw proberen.
      await query("update leads set address_lookup_at = now() where id = $1", [row.id]).catch(() => {});
    }
    return { checked: rows.length, filled };
  } catch (error) {
    // Kolommen bestaan nog niet: dan is er niets aan te vullen.
    return { checked: 0, filled: 0, skipped: error.message };
  }
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
