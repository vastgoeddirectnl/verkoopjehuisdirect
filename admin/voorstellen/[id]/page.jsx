"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTimeNL } from "../../../lib/date";
import { proposalReviewWarnings, proposalValidationIssues } from "../../../lib/proposalValidation";
import { WHATSAPP_NOTICES, WHATSAPP_PREPARED, WHATSAPP_SENT, prepareWhatsapp } from "../../../lib/admin/whatsapp.js";

const EDITABLE_FIELDS = [
  ["lead_naam", "Naam klant", "text"],
  ["lead_email", "E-mail klant", "email"],
  ["lead_telefoon", "Telefoon klant", "tel"],
  ["property_address", "Adres", "text"],
  ["property_postcode", "Postcode", "text"],
  ["property_house_number", "Huisnummer", "text"],
  ["property_type", "Type woning/object", "text"],
  ["amount_text", "Voorgesteld bedrag", "text"],
  ["validity_date", "Geldig tot", "date"],
  ["transfer_date_text", "Oplevering", "text"],
  ["deposit_text", "Aanbetaling / voorschot (alleen indien afgesproken)", "text"],
];

const EVENT_LABELS = {
  view: "Voorstel bekeken",
  interested: "Klant wil verder",
  discuss: "Klant wil bespreken",
  question: "Vraag van klant",
  whatsapp: "WhatsApp geopend",
  admin_whatsapp_prepared: "WhatsApp voorstelbericht voorbereid",
  admin_whatsapp_sent: "WhatsApp voorstelbericht verzonden gemarkeerd",
  print: "Print/PDF geopend",
  pdf: "PDF geopend",
  legacy_interest: "Historische reactie",
};

function publicUrl(proposal) {
  return proposal?.public_token ? `/voorstel/${proposal.public_token}` : "";
}

function absolutePublicUrl(proposal) {
  const path = publicUrl(proposal);
  if (!path) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.vastgoeddirectnederland.nl";
  return `${origin}${path}`;
}

function whatsappPhone(value) {
  let phone = String(value || "").replace(/\D/g, "");
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (phone.startsWith("0")) phone = `31${phone.slice(1)}`;
  return phone;
}

function buildProposalWhatsappText(proposal) {
  const customerName = String(proposal?.lead_naam || "").trim();
  const greeting = customerName ? `Goedemiddag ${customerName},` : "Goedemiddag,";
  const proposalUrl = absolutePublicUrl(proposal);
  return [
    greeting,
    "",
    "Het verkoopvoorstel van Vastgoed Direct Nederland staat voor u klaar.",
    "",
    "U kunt het voorstel hier rustig bekijken:",
    proposalUrl,
    "",
    "Het bekijken van het voorstel betekent niet dat u ergens aan vastzit. Heeft u vragen of wilt u het voorstel bespreken, dan hoor ik het graag.",
    "",
    "Met vriendelijke groet,",
    "Rob",
    "Vastgoed Direct Nederland",
  ].join("\n");
}

function proposalWhatsappUrl(proposal) {
  const phone = whatsappPhone(proposal?.lead_telefoon);
  const proposalUrl = absolutePublicUrl(proposal);
  if (!phone || !proposalUrl) return "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildProposalWhatsappText(proposal))}`;
}

export default function ProposalAdminPage({ params }) {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve(params).then((value) => setId(value.id));
  }, [params]);

  async function load(target = id) {
    if (!target) return;
    setError("");
    const response = await fetch(`/api/admin/v2?action=proposal&id=${target}`, { cache: "no-store" });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(json.error || "Voorstel laden mislukt.");
      return;
    }
    setData(json);
    setForm({
      ...json.proposal,
      validity_date: json.proposal?.validity_date ? String(json.proposal.validity_date).slice(0, 10) : "",
    });
  }

  // load() is een gewone functie die bij elke render opnieuw wordt aangemaakt;
  // in de deps opnemen zou dit effect bij elke render laten herhalen (load()
  // ververst data, wat weer een render triggert, enzovoort). Alleen bij een
  // echte wijziging van id opnieuw laden is hier bewust zo.
  useEffect(() => {
    if (id) load(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function post(body) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(json.error || "Opslaan mislukt.");
        return null;
      }
      return json;
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    const result = await post({ action: "updateProposal", id, ...form });
    if (result?.proposal) {
      setNotice("Voorstel opgeslagen.");
      await load();
    }
  }

  async function send() {
    if (!form?.lead_email) {
      setError("Vul eerst een geldig e-mailadres in.");
      return;
    }
    if (!window.confirm(`Voorstel verzenden naar ${form.lead_email}?`)) return;
    const issues = proposalValidationIssues(form, { forSending: true });
    if (issues.length) {
      setError(`Het voorstel is nog niet verzendklaar. ${issues.join(" ")}`);
      return;
    }
    const saved = await post({ action: "updateProposal", id, ...form });
    if (!saved?.proposal) return;
    const result = await post({ action: "sendProposalEmail", id, lead_email: form.lead_email });
    if (result?.ok) {
      setNotice(result.skipped ? "Mailconfiguratie is niet actief; de voorstelpagina is wel aangemaakt. U kunt daarna eventueel de WhatsApp-knop gebruiken." : "Voorstel is verzonden. Gebruik eventueel de WhatsApp-knop om de klant direct te laten weten dat het voorstel klaarstaat.");
      await load();
    }
  }

  async function recordProposalWhatsApp(mode) {
    const result = await post({
      action: "recordProposalWhatsapp",
      id,
      mode,
      public_url: absolutePublicUrl(proposal),
    });
    if (result?.ok) {
      setNotice(WHATSAPP_NOTICES[mode] || WHATSAPP_NOTICES[WHATSAPP_PREPARED]);
      await load();
    }
    return result;
  }

  // Eerst vastleggen, dan pas WhatsApp openen. Zie app/lib/admin/whatsapp.js.
  async function openWhatsApp(event) {
    event.preventDefault();
    await prepareWhatsapp({
      url: whatsappLink,
      log: () => recordProposalWhatsApp(WHATSAPP_PREPARED),
    });
  }

  async function cloneVersion() {
    if (!window.confirm("Een nieuwe conceptversie maken op basis van dit voorstel?")) return;
    const result = await post({ action: "cloneProposalVersion", id });
    if (result?.proposal?.id) {
      window.location.href = `/admin/voorstellen/${result.proposal.id}`;
    }
  }

  async function archive() {
    if (!window.confirm("Dit voorstel archiveren?")) return;
    const result = await post({ action: "updateProposalStatus", id, status: "Gearchiveerd" });
    if (result?.proposal) {
      setNotice("Voorstel gearchiveerd.");
      await load();
    }
  }

  const proposal = data?.proposal;
  // Zonder deze eigen useMemo is `data?.proposalEvents || []` bij elke render
  // een nieuwe array-referentie wanneer proposalEvents ontbreekt, waardoor de
  // useMemo hieronder zijn geheugen niet vasthoudt.
  const events = useMemo(() => data?.proposalEvents || [], [data?.proposalEvents]);
  const versions = data?.versions || [];
  const viewCount = useMemo(() => events.filter((event) => event.event_type === "view").length, [events]);
  const whatsappLink = proposalWhatsappUrl(proposal);
  const proposalIssues = useMemo(() => proposalValidationIssues(form || {}, { forSending: true }), [form]);
  const proposalWarnings = useMemo(() => proposalReviewWarnings(form || {}), [form]);

  if (!form) {
    return (
      <main className="proposal-admin">
        <a href="/admin">← Dashboard</a>
        <section className="panel"><p>{error || "Voorstel laden..."}</p></section>
      </main>
    );
  }

  return (
    <main className="proposal-admin">
      <header className="admin-head">
        <div>
          <a href={proposal?.lead_id ? `/admin/leads/${proposal.lead_id}` : "/admin"}>← Terug naar lead</a>
          <span className="eyebrow">Voorstelbeheer</span>
          <h1>Voorstel v{proposal?.version_number || 1}</h1>
          <p>{proposal?.property_address || proposal?.property_postcode || "Adres nog niet ingevuld"} · {proposal?.amount_text || "Bedrag nog niet ingevuld"}</p>
        </div>
        <div className="status-box">
          <span>Status</span>
          <strong>{proposal?.status || "Concept"}</strong>
          <small>{viewCount} echte views</small>
        </div>
      </header>

      {notice ? <div className="notice">{notice}</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {proposalIssues.length ? (
        <div className="validation-panel" role="alert">
          <strong>Nog controleren vóór verzending</strong>
          <ul>{proposalIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
          {proposal?.lead_id ? <a href={`/admin/leads/${proposal.lead_id}#voorstel-maken`}>Maak via de lead een gecorrigeerde versie</a> : null}
        </div>
      ) : (
        <div className="validation-panel ready"><strong>Voorstel is inhoudelijk gereed voor verzending.</strong></div>
      )}

      {proposalWarnings.length ? (
        <div className="review-panel">
          <strong>Advies voor een overtuigender voorstel</strong>
          <ul>{proposalWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
        </div>
      ) : null}

      <nav className="actionbar">
        <button disabled={saving} onClick={save}>Opslaan</button>
        <button disabled={saving || proposalIssues.length > 0} onClick={send}>Opslaan en mailen</button>
        {whatsappLink ? <a className="green" href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={openWhatsApp}>WhatsApp klant</a> : null}
        {whatsappLink ? <button className="secondary" disabled={saving} onClick={() => recordProposalWhatsApp(WHATSAPP_SENT)}>Markeer als handmatig verzonden</button> : null}
        {publicUrl(proposal) ? <a href={`${publicUrl(proposal)}?admin_preview=1`} target="_blank" rel="noopener noreferrer">Preview klant</a> : null}
        <a href={`/admin/voorstellen/${id}/print`} target="_blank" rel="noopener noreferrer">Print/PDF</a>
        <button className="secondary" disabled={saving} onClick={cloneVersion}>Nieuwe versie</button>
        <button className="muted" disabled={saving} onClick={archive}>Archiveren</button>
      </nav>

      <section className="overview-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Basisgegevens</span>
              <h2>Voorstel bewerken</h2>
            </div>
            <span>Laatste wijziging {formatDateTimeNL(proposal?.updated_at)}</span>
          </div>

          <div className="form-grid">
            {EDITABLE_FIELDS.map(([field, label, type]) => (
              <label key={field}>
                <span>{label}</span>
                <input
                  type={type}
                  value={form?.[field] || ""}
                  onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                />
              </label>
            ))}
          </div>

          <label className="wide-field">
            <span>Voorwaarden</span>
            <textarea value={form.conditions_text || ""} onChange={(event) => setForm({ ...form, conditions_text: event.target.value })} />
          </label>
          <label className="wide-field">
            <span>Uitgangspunten</span>
            <textarea value={form.assumptions_text || ""} onChange={(event) => setForm({ ...form, assumptions_text: event.target.value })} />
          </label>
          <label className="wide-field">
            <span>Interne notities — nooit zichtbaar voor de klant</span>
            <textarea value={form.notes || ""} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </label>
        </article>

        <aside className="side-stack">
          <article className="panel signal-panel">
            <span className="eyebrow">Klantactiviteit</span>
            <div className="metric"><strong>{proposal?.public_view_count || viewCount || 0}</strong><span>geregistreerde views</span></div>
            <div className="signal-row"><span>Eerste view</span><strong>{formatDateTimeNL(proposal?.public_viewed_at)}</strong></div>
            <div className="signal-row"><span>Laatste view</span><strong>{formatDateTimeNL(proposal?.public_last_viewed_at || proposal?.public_viewed_at)}</strong></div>
            <div className="signal-row"><span>Reactie</span><strong>{proposal?.interest_status || "Nog geen"}</strong></div>
            <div className="signal-row"><span>Reactietijd</span><strong>{formatDateTimeNL(proposal?.interest_at)}</strong></div>
          </article>

          <article className="panel">
            <span className="eyebrow">Versies</span>
            <div className="version-list">
              {versions.map((version) => (
                <a key={version.id} className={version.id === id ? "active" : ""} href={`/admin/voorstellen/${version.id}`}>
                  <strong>Versie {version.version_number || 1}</strong>
                  <span>{version.status} · {version.amount_text || "geen bedrag"}</span>
                  <small>{formatDateTimeNL(version.created_at)}</small>
                </a>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="panel events-panel">
        <div className="panel-head">
          <div>
            <span className="eyebrow">Historie</span>
            <h2>Voorstelactiviteit</h2>
          </div>
          <span>{events.length} events</span>
        </div>
        <div className="event-list">
          {events.map((event) => (
            <article key={event.id}>
              <i className={`dot event-${event.event_type}`} />
              <div>
                <time>{formatDateTimeNL(event.created_at)}</time>
                <strong>{EVENT_LABELS[event.event_type] || event.event_type}</strong>
                {event.message ? <p>{event.message}</p> : null}
              </div>
            </article>
          ))}
          {!events.length ? <p>Nog geen klantactiviteit vastgelegd.</p> : null}
        </div>
      </section>

      <div className="mobile-actions">
        <button onClick={save} disabled={saving}>Opslaan</button>
        <button onClick={send} disabled={saving || proposalIssues.length > 0}>Opslaan en mailen</button>
        {whatsappLink ? <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={openWhatsApp}>WhatsApp</a> : null}
        {publicUrl(proposal) ? <a href={`${publicUrl(proposal)}?admin_preview=1`} target="_blank" rel="noopener noreferrer">Preview</a> : null}
      </div>
    </main>
  );
}
