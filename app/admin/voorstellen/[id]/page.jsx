"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTimeNL } from "../../../lib/date";
import { proposalValidationIssues } from "../../../lib/proposalValidation";

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
    setForm(json.proposal);
  }

  useEffect(() => {
    if (id) load(id);
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
      setNotice(mode === "sent" ? "WhatsApp-bericht is handmatig als verzonden gemarkeerd." : "WhatsApp-bericht is voorbereid/geopend.");
      await load();
    }
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
  const events = data?.proposalEvents || [];
  const versions = data?.versions || [];
  const viewCount = useMemo(() => events.filter((event) => event.event_type === "view").length, [events]);
  const whatsappLink = proposalWhatsappUrl(proposal);
  const proposalIssues = useMemo(() => proposalValidationIssues(form || {}, { forSending: true }), [form]);

  if (!form) {
    return (
      <main className="proposal-admin">
        <style>{styles}</style>
        <a href="/admin">← Dashboard</a>
        <section className="panel"><p>{error || "Voorstel laden..."}</p></section>
      </main>
    );
  }

  return (
    <main className="proposal-admin">
      <style>{styles}</style>
      <style>{`.validation-panel{margin:0 0 16px;border:1px solid #ffd5c4;background:#fff5f1;color:#7c2d20;border-radius:18px;padding:14px 16px}.validation-panel strong{display:block}.validation-panel ul{margin:7px 0 0;padding-left:20px}.validation-panel.ready{background:#f0fff6;border-color:#bff3d0;color:#075c2a}`}</style>

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
        </div>
      ) : (
        <div className="validation-panel ready"><strong>Voorstel is inhoudelijk gereed voor verzending.</strong></div>
      )}

      <nav className="actionbar">
        <button disabled={saving} onClick={save}>Opslaan</button>
        <button disabled={saving || proposalIssues.length > 0} onClick={send}>Opslaan en mailen</button>
        {whatsappLink ? <a className="green" href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => recordProposalWhatsApp("prepared")}>WhatsApp klant</a> : null}
        {whatsappLink ? <button className="secondary" disabled={saving} onClick={() => recordProposalWhatsApp("sent")}>Markeer WhatsApp verzonden</button> : null}
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
        {whatsappLink ? <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => recordProposalWhatsApp("prepared")}>WhatsApp</a> : null}
        {publicUrl(proposal) ? <a href={`${publicUrl(proposal)}?admin_preview=1`} target="_blank" rel="noopener noreferrer">Preview</a> : null}
      </div>
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--orange:#D96A1C;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9}
*{box-sizing:border-box}body{margin:0;background:var(--bg);font-family:Inter,Arial,Helvetica,sans-serif;color:var(--navy)}
a{color:inherit}.proposal-admin{width:min(1240px,calc(100% - 36px));margin:0 auto;padding:30px 0 80px}
.admin-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:20px}.admin-head a{display:inline-block;margin-bottom:18px;color:var(--orange);font-weight:900;text-decoration:none}.admin-head h1{font-size:42px;margin:8px 0 6px;letter-spacing:-.04em}.admin-head p{margin:0;color:var(--muted)}
.eyebrow{display:inline-flex;background:#fff1e6;border:1px solid #f2b885;color:#b85216;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}
.status-box{background:var(--navy);color:#fff;border-radius:22px;padding:18px;min-width:180px;display:grid;gap:5px}.status-box span,.status-box small{color:#c7d5e5}.status-box strong{font-size:22px}
.actionbar{position:sticky;top:10px;z-index:20;background:rgba(255,253,249,.94);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:22px;padding:10px;display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;box-shadow:0 12px 36px rgba(7,31,58,.08)}
.actionbar button,.actionbar a,.mobile-actions button,.mobile-actions a{border:0;border-radius:999px;background:var(--orange);color:#fff;padding:12px 16px;font:inherit;font-weight:900;text-decoration:none;cursor:pointer}.actionbar .secondary{background:var(--navy)}.actionbar .green{background:#3e8f5e;color:#fff}.actionbar .muted{background:#e9e4dc;color:var(--navy)}
.notice,.error{border-radius:16px;padding:12px 14px;margin-bottom:14px;font-weight:800}.notice{background:#eaf7ef;color:#23643f;border:1px solid #c8e7d4}.error{background:#f8eeee;color:#8a2d2d;border:1px solid #eccaca}
.overview-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,.65fr);gap:18px}.side-stack{display:grid;gap:18px;align-content:start}.panel{background:var(--card);border:1px solid var(--line);border-radius:26px;padding:22px;box-shadow:0 12px 42px rgba(7,31,58,.07)}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.panel-head h2{margin:7px 0 0}.panel-head>span{font-size:12px;color:var(--muted)}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.form-grid label,.wide-field{display:grid;gap:7px;font-weight:900;font-size:13px}.form-grid input,.wide-field textarea{width:100%;border:1px solid var(--line);background:#fff;border-radius:14px;padding:12px 13px;font:inherit}.wide-field{margin-top:14px}.wide-field textarea{min-height:110px;resize:vertical}
.signal-panel{display:grid;gap:13px}.metric{display:flex;align-items:baseline;gap:10px;background:#fff1e6;border-radius:18px;padding:14px}.metric strong{font-size:36px;color:#b85216}.metric span{color:#617184}.signal-row{display:grid;gap:4px;border-bottom:1px solid var(--line);padding-bottom:10px}.signal-row:last-child{border-bottom:0}.signal-row span{font-size:12px;color:var(--muted)}.signal-row strong{font-size:14px}
.version-list{display:grid;gap:8px;margin-top:14px}.version-list a{display:grid;gap:3px;padding:11px;border:1px solid var(--line);background:#fff;border-radius:14px;text-decoration:none}.version-list a.active{border-color:#D96A1C;background:#fff8f2}.version-list span,.version-list small{font-size:12px;color:var(--muted)}
.events-panel{margin-top:18px}.event-list{display:grid}.event-list article{display:grid;grid-template-columns:16px 1fr;gap:11px;padding:0 0 18px;position:relative}.event-list article:not(:last-child):before{content:"";position:absolute;left:6px;top:14px;bottom:0;width:2px;background:var(--line)}.dot{width:14px;height:14px;border-radius:50%;background:#8ca1b8;border:3px solid #edf2f7;margin-top:4px;z-index:1}.event-interested{background:#D96A1C;border-color:#fff1e6}.event-view{background:#3E8F5E;border-color:#eaf7ef}.event-list time{display:block;font-size:12px;color:var(--muted);margin-bottom:3px}.event-list strong{display:block}.event-list p{margin:4px 0 0;color:var(--muted)}
.mobile-actions{display:none}
@media(max-width:850px){.overview-grid{grid-template-columns:1fr}.admin-head{display:grid}.status-box{justify-self:start}.form-grid{grid-template-columns:1fr}.actionbar{position:relative;top:auto}}
@media(max-width:650px){.proposal-admin{width:min(100% - 24px,1240px);padding-bottom:100px}.admin-head h1{font-size:34px}.actionbar{display:none}.mobile-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;position:fixed;left:10px;right:10px;bottom:10px;z-index:50;background:rgba(7,31,58,.96);padding:10px;border-radius:18px;box-shadow:0 16px 42px rgba(7,31,58,.25)}.mobile-actions button,.mobile-actions a{padding:11px 8px;text-align:center;font-size:12px}.mobile-actions a{background:#fff;color:var(--navy)}}
`;
