"use client";

// Contactgegevens- en aanvraagkaart op de lead-detailpagina (ARCH-05).

import { parseLeadSourceDetails, sourceChannelLabel } from "../../lib/sourceParser";
import { isValidEmail } from "../../lib/admin/validators";
import { LEAD_STATUSES, selectStatusValue } from "../../lib/leadStatus.js";
import { fmt } from "../../lib/admin/leadDetail";
import { Field, Info } from "./LeadDetailFields";

function SourceDetails({ lead }) {
  const details = parseLeadSourceDetails(lead);
  const hasDetails = [details.pagePath, details.pageTitle, details.source, details.medium, details.campaign, details.term, details.content, details.clickId, details.referrer].some(Boolean);
  if (!hasDetails) return null;
  const channel = sourceChannelLabel(details);

  return (
    <div className="source-detail-box">
      <div className="source-head">
        <div>
          <h3>Bron en campagne</h3>
          <p>Leesbare samenvatting van de herkomst van deze aanvraag.</p>
        </div>
        <span className="source-pill">{channel}</span>
      </div>
      <div className="source-summary-row">
        <span>Campagne: {details.campaign || "niet meegegeven"}</span>
        <span>Zoekterm: {details.term || "niet meegegeven"}</span>
        <span>Click ID: {details.clickId ? "aanwezig" : "niet meegegeven"}</span>
      </div>
      <div className="info-grid">
        <Info label="Landingspagina" value={details.pagePath} />
        <Info label="Paginatitel" value={details.pageTitle} />
        <Info label="UTM source" value={details.source} />
        <Info label="UTM medium" value={details.medium} />
        <Info label="Campagne" value={details.campaign} />
        <Info label="Zoekterm / keyword" value={details.term} />
        <Info label="Advertentie-inhoud" value={details.content} />
        <Info label="Click ID" value={details.clickId} />
        <Info label="Referrer" value={details.referrer} />
      </div>
    </div>
  );
}

export default function LeadContactForm({ lead, contactForm, setContactForm, saving, onSaveContact, post }) {
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
        <Info label="Pagina" value={lead.pagina} />
        <Info label="Bron" value={lead.bron} />
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
          value={lead.manual_follow_up_at || ""}
          onChange={(e) => post({ action: "updateLead", id: lead.id, next_follow_up_at: e.target.value })}
        />
        <small>{lead.manual_follow_up_at ? "Handmatig ingesteld — deze datum krijgt voorrang op automatisering." : `Automatisch voorstel: ${lead.automation_follow_up_at || lead.next_follow_up_at || "geen"}`}</small>
      </Field>
      <Field label="Notitie">
        <textarea defaultValue={lead.notitie || ""} onBlur={(e) => post({ action: "updateLead", id: lead.id, notitie: e.target.value })} />
      </Field>
    </article>
  );
}
