"use client";

// Contactgegevens- en aanvraagkaart op de lead-detailpagina (ARCH-05).

import { parseLeadSourceDetails, leadChannel } from "../../lib/sourceParser";
import { isValidEmail } from "../../lib/admin/validators";
import { LEAD_STATUSES, selectStatusValue } from "../../lib/leadStatus.js";
import { formatDateNL, normalizeDateOnly } from "../../lib/date.js";
import { fmt } from "../../lib/admin/leadDetail";
import { Field, Info } from "./LeadDetailFields";

function SourceDetails({ lead }) {
  const details = parseLeadSourceDetails(lead);
  const channel = leadChannel(lead);
  // De ruwe velden (klik-ID's, volledige URL's) zijn alleen nodig bij het
  // nakijken van een campagne; ze staan ingeklapt in plaats van bovenaan.
  const technical = [
    ["UTM source", details.source],
    ["UTM medium", details.medium],
    ["Zoekterm / keyword", details.term],
    ["Advertentie-inhoud", details.content],
    ["Klik-ID", details.clickId],
    ["Referrer", details.referrer],
    ["Bronveld (ruw)", lead.bron],
    ["Paginaveld (ruw)", lead.pagina],
  ].filter(([, value]) => value);

  return (
    <div className="source-detail-box">
      <div className="source-head">
        <div>
          <h3>Herkomst</h3>
          <p>Via welk kanaal en welke pagina deze aanvraag binnenkwam.</p>
        </div>
        <span className="source-pill">{channel}</span>
      </div>
      <div className="source-summary-row">
        <span>Landingspagina: {details.pagePath || "onbekend"}</span>
        {details.campaign ? <span>Campagne: {details.campaign}</span> : null}
        {details.term ? <span>Zoekterm: {details.term}</span> : null}
      </div>
      {technical.length ? (
        <details className="tech-details">
          <summary>Technische meetgegevens</summary>
          <div className="info-grid">
            {technical.map(([label, value]) => <Info key={label} label={label} value={value} />)}
          </div>
        </details>
      ) : null}
    </div>
  );
}

export default function LeadContactForm({ lead, contactForm, setContactForm, saving, onSaveContact, post }) {
  const automaticDate = lead.automation_follow_up_at || lead.next_follow_up_at;
  return (
    <article className="card" id="contact">
      <h2>Contactgegevens</h2>
      <div className="form-grid compact-two">
        <Field label="Naam">
          <input value={contactForm.naam} onChange={(e) => setContactForm({ ...contactForm, naam: e.target.value })} />
        </Field>
        <Field label="E-mail">
          <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
        </Field>
        <Field label="Telefoon">
          <input type="tel" value={contactForm.telefoon} onChange={(e) => setContactForm({ ...contactForm, telefoon: e.target.value })} />
        </Field>
        <div className="contact-save-box">
          <button disabled={saving || (contactForm.email && !isValidEmail(contactForm.email))} onClick={onSaveContact}>Contactgegevens opslaan</button>
          {contactForm.email && !isValidEmail(contactForm.email) ? <small>Ongeldig e-mailadres.</small> : <small>Deze gegevens worden gebruikt bij opvolging en nieuwe voorstellen.</small>}
        </div>
      </div>

      <h2 className="subheading" id="woning">Aanvraag</h2>
      <div className="info-grid">
        <Info label="Woningtype" value={lead.woningtype} />
        <Info label="Staat" value={lead.staat} />
        <Info label="Reden" value={lead.reden} />
        <Info label="Aangemaakt" value={fmt(lead.created_at)} />
      </div>
      <div id="bron"><SourceDetails lead={lead} /></div>
      <Field label="Status">
        <select value={selectStatusValue(lead.status)} onChange={(e) => post({ action: "updateLead", id: lead.id, status: e.target.value })}>
          {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
      </Field>
      <Field label="Volgende opvolging">
        <input
          type="date"
          value={normalizeDateOnly(lead.manual_follow_up_at) || ""}
          onChange={(e) => post({ action: "updateLead", id: lead.id, next_follow_up_at: e.target.value })}
        />
        <small>{lead.manual_follow_up_at ? "Handmatig ingesteld — deze datum krijgt voorrang op automatisering." : `Automatisch voorstel: ${automaticDate ? formatDateNL(automaticDate) : "geen"}`}</small>
      </Field>
      <Field label="Notitie">
        <textarea defaultValue={lead.notitie || ""} onBlur={(e) => post({ action: "updateLead", id: lead.id, notitie: e.target.value })} />
      </Field>
    </article>
  );
}
