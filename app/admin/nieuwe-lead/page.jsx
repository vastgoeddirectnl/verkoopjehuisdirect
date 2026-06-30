"use client";

import { useState } from "react";

const STATUSES = ["Nieuw", "Contact opgenomen", "In beoordeling", "Voorstel verzonden", "Akkoord", "Afgewezen"];
const woningtypes = ["", "Vrijstaand", "Twee-onder-een-kap", "Hoekwoning", "Tussenwoning", "Appartement", "Benedenwoning", "Bovenwoning", "Woonboerderij", "Anders"];
const situaties = ["", "Normale verkoop", "Leegstaand", "Opknapwoning", "Achterstallig onderhoud", "Verhuurde woning", "Erfenis", "Scheiding", "Snelle verkoop gewenst", "Financiële situatie", "Anders"];

function initialForm() {
  return {
    naam: "",
    email: "",
    telefoon: "",
    postcode: "",
    huisnummer: "",
    woningtype: "",
    staat: "",
    reden: "",
    status: "Contact opgenomen",
    bron: "Telefonisch",
    pagina: "Handmatig ingevoerd",
    notitie: "",
  };
}

export default function NieuweLeadPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdLead, setCreatedLead] = useState(null);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setCreatedLead(null);

    try {
      const res = await fetch("/api/admin/manual-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error || "Klant aanmaken mislukt.");
        return;
      }

      setCreatedLead(json.lead);
      setForm(initialForm());
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="manual-page">
      <style>{styles}</style>

      <header className="topbar">
        <a href="/admin">← Terug naar dashboard</a>
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
      </header>

      <section className="hero">
        <span>Admin</span>
        <h1>Klant handmatig invoeren</h1>
        <p>
          Gebruik dit formulier voor telefonische aanvragen, WhatsApp-contacten,
          netwerkleads of klanten die niet via het websiteformulier binnenkomen.
        </p>
      </section>

      {error ? <div className="error">{error}</div> : null}

      {createdLead ? (
        <section className="success">
          <div>
            <strong>Klant is aangemaakt</strong>
            <span>{createdLead.naam || createdLead.telefoon || createdLead.email}</span>
          </div>
          <a href={`/admin/leads/${createdLead.id}`}>Open lead</a>
        </section>
      ) : null}

      <form className="card" onSubmit={submit}>
        <div className="section-title"><span>1</span><strong>Contactgegevens</strong></div>

        <div className="grid">
          <label><span>Naam klant</span><input value={form.naam} onChange={(e) => setField("naam", e.target.value)} placeholder="Bijv. Jan Jansen" /></label>
          <label><span>Telefoonnummer</span><input value={form.telefoon} onChange={(e) => setField("telefoon", e.target.value)} placeholder="Bijv. 06 12 34 56 78" /></label>
          <label><span>E-mailadres</span><input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="naam@email.nl" /></label>
          <label><span>Status</span><select value={form.status} onChange={(e) => setField("status", e.target.value)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
        </div>

        <div className="section-title"><span>2</span><strong>Woninggegevens</strong></div>

        <div className="grid">
          <label><span>Postcode</span><input value={form.postcode} onChange={(e) => setField("postcode", e.target.value.toUpperCase())} placeholder="Bijv. 9501 AA" /></label>
          <label><span>Huisnummer</span><input value={form.huisnummer} onChange={(e) => setField("huisnummer", e.target.value)} placeholder="Bijv. 12" /></label>
          <label><span>Type woning</span><select value={form.woningtype} onChange={(e) => setField("woningtype", e.target.value)}>{woningtypes.map((type) => <option key={type} value={type}>{type || "Kies type woning"}</option>)}</select></label>
          <label><span>Situatie woning</span><select value={form.staat} onChange={(e) => setField("staat", e.target.value)}>{situaties.map((situatie) => <option key={situatie} value={situatie}>{situatie || "Kies situatie"}</option>)}</select></label>
        </div>

        <div className="section-title"><span>3</span><strong>Aanvraag & opvolging</strong></div>

        <div className="grid three">
          <label><span>Reden contact</span><input value={form.reden} onChange={(e) => setField("reden", e.target.value)} placeholder="Bijv. wil snel duidelijkheid over verkoop" /></label>
          <label><span>Bron</span><input value={form.bron} onChange={(e) => setField("bron", e.target.value)} placeholder="Telefonisch" /></label>
          <label><span>Pagina / kanaal</span><input value={form.pagina} onChange={(e) => setField("pagina", e.target.value)} placeholder="Handmatig ingevoerd" /></label>
        </div>

        <label className="wide">
          <span>Gespreksnotitie</span>
          <textarea value={form.notitie} onChange={(e) => setField("notitie", e.target.value)} placeholder="Noteer hier kort wat de klant heeft verteld, gewenste overdrachtsdatum, bijzonderheden en vervolgstap." />
        </label>

        <div className="actions">
          <button type="submit" disabled={saving}>{saving ? "Opslaan..." : "Klant opslaan"}</button>
          <button type="button" className="secondary" onClick={() => setForm(initialForm())}>Leegmaken</button>
        </div>
      </form>

      <section className="tip">
        <strong>Tip:</strong> vul bij telefonische leads altijd minimaal het telefoonnummer en een korte gespreksnotitie in. Daarna kunt u vanuit de lead-detailpagina direct een taak of verkoopvoorstel aanmaken.
      </section>
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--orange:#9A5A2E;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--shadow:0 22px 70px rgba(7,31,58,.12)}body{margin:0;background:radial-gradient(circle at top right,#F3E8DD,transparent 34%),var(--bg);font-family:Inter,Arial,Helvetica,sans-serif;color:var(--navy)}.manual-page{max-width:1120px;margin:0 auto;padding:28px}.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}.topbar a{color:var(--navy);font-weight:900;text-decoration:none}.topbar img{width:220px;background:#fff;border-radius:18px;padding:10px}.hero,.card,.success,.tip{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:26px;box-shadow:var(--shadow);margin-bottom:18px}.hero span{display:inline-block;background:#F3E8DD;border:1px solid #E2C7AF;color:#7C4727;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.hero h1{font-size:44px;line-height:1;margin:14px 0 10px;letter-spacing:-.05em}.hero p{font-size:18px;color:var(--muted);line-height:1.55;max-width:720px}.section-title{display:grid;grid-template-columns:56px 1fr;align-items:center;margin:24px 0 16px;background:var(--navy);color:#fff;border-radius:18px;overflow:hidden;text-transform:uppercase;font-weight:900}.section-title:first-child{margin-top:0}.section-title span{background:var(--orange);padding:13px;text-align:center}.section-title strong{padding:13px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.grid.three{grid-template-columns:repeat(3,1fr)}label{display:grid;gap:8px;font-weight:900}label span{font-size:13px;color:var(--muted)}input,select,textarea{width:100%;border:1px solid var(--line);border-radius:16px;padding:13px 14px;background:#fff;font:inherit;color:var(--navy)}textarea{min-height:140px;resize:vertical}.wide{margin-top:14px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}button,.success a{border:0;background:var(--orange);color:#fff;border-radius:999px;padding:14px 20px;font-weight:900;text-decoration:none;cursor:pointer}button.secondary{background:#fff;color:var(--navy);border:1px solid var(--line)}button:disabled{opacity:.65;cursor:not-allowed}.success{display:flex;justify-content:space-between;gap:16px;align-items:center;background:#f0fff6;border-color:#bff3d0}.success strong,.success span{display:block}.success span{margin-top:4px;color:var(--muted)}.error{background:#F8EEE9;color:#7C2D20;border:1px solid #E8C7BC;border-radius:16px;padding:12px 14px;margin-bottom:16px}.tip{background:#F7F2EC;color:#415168;line-height:1.55}@media(max-width:1000px){.grid,.grid.three{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.manual-page{padding:16px}.topbar{display:grid;gap:12px}.topbar img{width:200px}.hero h1{font-size:34px}.grid,.grid.three{grid-template-columns:1fr}.success{display:grid}.section-title{grid-template-columns:48px 1fr}}
`;
