"use client";

// Hero-kop + klantactie-meldingen + snelnavigatie op de lead-detailpagina
// (ARCH-05). Verschijnt zodra de lead geladen is (de "Lead laden..."-val
// en de buitenste <header>/foutmelding/notice blijven in de paginashell
// staan, want die renderen ook al vóórdat de lead binnen is).

import { cleanPhone, whatsappPhone, fmt, customerActionCopy, isCustomerActionHandled } from "../../lib/admin/leadDetail";

function CustomerProposalActionAlert({ event, lead, saving, onContactDone }) {
  const copy = customerActionCopy(event);
  if (!copy) return null;
  const message = String(event.message || "").trim();
  const proposalMeta = [event.amount_text, event.property_address, event.version_number ? `voorstel v${event.version_number}` : ""].filter(Boolean).join(" · ");

  return (
    <section className={`customer-action-alert ${copy.tone}`} aria-label="Klantactie voorstel">
      <div>
        <span>{copy.badge}</span>
        <h2>{copy.title}</h2>
        <p>{copy.detail}</p>
        {message ? <blockquote>{message}</blockquote> : null}
        <small>{[fmt(event.created_at), proposalMeta].filter(Boolean).join(" · ")}</small>
      </div>
      <div className="customer-action-buttons">
        {lead?.telefoon ? <a href={`tel:${cleanPhone(lead.telefoon)}`}>Bel klant</a> : null}
        {lead?.telefoon ? <a className="green" href={`https://wa.me/${whatsappPhone(lead.telefoon)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
        {lead?.email ? <a className="secondary" href={`mailto:${lead.email}`}>Mail</a> : null}
        <button disabled={saving} onClick={onContactDone}>Contact vastleggen</button>
      </div>
    </section>
  );
}

function CustomerProposalActionHandledNotice({ event, lead }) {
  if (!event || !isCustomerActionHandled(event, lead)) return null;
  const copy = customerActionCopy(event);
  if (!copy) return null;
  return (
    <section className="customer-action-handled" aria-label="Afgehandelde klantactie">
      <div>
        <span>Afgehandeld</span>
        <strong>{copy.title}</strong>
        <small>Klantactie van {fmt(event.created_at)} is opgevolgd. Laatste contact: {fmt(lead?.last_contact_at)}.</small>
      </div>
    </section>
  );
}

export default function LeadHeader({
  lead,
  saving,
  latestOpenCustomerAction,
  latestHandledCustomerAction,
  onContactGehad,
  onResolveCustomerAction,
}) {
  return (
    <>
      <section className="hero card">
        <div>
          <span>Lead detail</span>
          <h1>{lead.naam || "Naam onbekend"}</h1>
          <p>{lead.postcode || "-"} {lead.huisnummer || ""}</p>
        </div>
        <div className="actions">
          {lead.telefoon ? <a href={`tel:${cleanPhone(lead.telefoon)}`}>Bellen</a> : null}
          {lead.telefoon ? <a href={`https://wa.me/${whatsappPhone(lead.telefoon)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
          {lead.email ? <a href={`mailto:${lead.email}`}>Mailen</a> : null}
          <button disabled={saving} onClick={onContactGehad}>Contact gehad</button>
        </div>
      </section>

      <CustomerProposalActionAlert
        event={latestOpenCustomerAction}
        lead={lead}
        saving={saving}
        onContactDone={() => onResolveCustomerAction(latestOpenCustomerAction)}
      />
      {!latestOpenCustomerAction ? <CustomerProposalActionHandledNotice event={latestHandledCustomerAction} lead={lead} /> : null}

      <nav className="admin-quick-nav" aria-label="Admin snelnavigatie">
        <a href="#contact">Contact</a>
        <a href="#woning">Woning en aanvraag</a>
        <a href="#bron">Bron</a>
        <a href="#tijdlijn">Tijdlijn</a>
        <a href="#voorstel-maken">Voorstel maken</a>
        <a href="#taken">Taken</a>
        <a href="#voorstellen">Voorstellen</a>
      </nav>
    </>
  );
}
