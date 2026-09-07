"use client";

import { useState } from "react";
import Image from "next/image";

const STATUSES = ["Nieuwe aanvraag", "In behandeling", "Eerste bod gedaan", "Beoordeling gepland", "Voorstel opgesteld", "Voorstel verzonden", "Voorstel bekeken", "In onderhandeling", "Akkoord", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];
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
    status: "In behandeling",
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
      <header className="topbar">
        <a href="/admin">← Terug naar dashboard</a>
        <Image src="/logo.png" alt="Vastgoed Direct Nederland" width={1774} height={887} />
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
