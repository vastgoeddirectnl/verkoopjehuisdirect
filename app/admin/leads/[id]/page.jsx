"use client";

import { useEffect, useMemo, useState } from "react";

const STATUSES = ["Nieuw", "Contact opgenomen", "In beoordeling", "Voorstel verzonden", "Akkoord", "Afgewezen"];
const TASK_STATUSES = ["Open", "In behandeling", "Afgerond"];

function todayPlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function fmt(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value || "-"}</strong></div>;
}

function Field({ label, children }) {
  return <label><span>{label}</span>{children}</label>;
}

function defaultProposalForLead(lead) {
  const propertyAddress = [lead?.postcode, lead?.huisnummer].filter(Boolean).join(" ");
  return {
    proposal_variant: "Uitgebreid",
    lead_id: lead?.id || "",
    lead_naam: lead?.naam || "",
    lead_email: lead?.email || "",
    lead_telefoon: lead?.telefoon || "",
    property_address: propertyAddress,
    property_postcode: lead?.postcode || "",
    property_house_number: lead?.huisnummer || "",
    property_type: lead?.woningtype || "",
    living_area_text: "",
    plot_area_text: "",
    build_year_text: "",
    current_situation: lead?.staat || lead?.reden || "",
    amount_text: "",
    validity_date: todayPlus(14),
    transfer_date_text: "In overleg",
    deposit_text: "In overleg bespreekbaar",
    conditions_text: "Vrijblijvend voorstel onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging.",
    assumptions_text: "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken of aanvullende kosten kunnen invloed hebben op de definitieve afspraken.",
    included_items: "Heldere communicatie\nGeen makelaarskosten\nGeen openbare bezichtigingen nodig\nNotariële afwikkeling\nVerkoopoplossing op maat\nVrijblijvend voorstel",
    traditional_price_text: "",
    agent_costs_text: "",
    notary_costs_text: "",
    renovation_costs_text: "",
    other_costs_text: "",
    traditional_net_text: "",
    direct_net_text: "",
    short_comparison_text: "Bij een directe verkoop wordt niet alleen gekeken naar de verkoopprijs, maar ook naar snelheid, zekerheid, kosten, benodigde werkzaamheden, risico’s en de gewenste overdrachtsdatum.",
    reservations_text: "Controle woninggegevens\nControle eigendomssituatie\nControle beschikbare documenten\nNotariële toetsing\nAkkoord op voorwaarden\nGeen bijzondere belemmeringen",
    next_steps_text: "U beoordeelt het voorstel rustig.\nWij bespreken vragen, bijzonderheden en eventuele voorwaarden.\nBij akkoord worden afspraken juridisch en notarieel vastgelegd.\nDe overdracht vindt plaats via de notaris.",
    contact_person: "Rob Schiphuis",
    notes: "",
  };
}

export default function LeadDetailPage({ params }) {
  const [leadId, setLeadId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState({ title: "", due_date: todayPlus(1), note: "" });
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    Promise.resolve(params).then((resolved) => setLeadId(resolved.id));
  }, [params]);

  async function load(id = leadId) {
    if (!id) return;
    const res = await fetch(`/api/admin/v2?action=lead&id=${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Lead ophalen mislukt. Log eventueel opnieuw in via /admin.");
      return;
    }
    setData(json);
    if (json.lead) setProposal(defaultProposalForLead(json.lead));
  }

  async function post(body) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Opslaan mislukt.");
        return null;
      }
      await load();
      return json;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { if (leadId) load(leadId); }, [leadId]);

  const lead = data?.lead;

  const latestProposal = useMemo(() => {
    return (data?.proposals || [])[0] || null;
  }, [data?.proposals]);

  function setProposalField(field, value) {
    setProposal((current) => ({ ...(current || {}), [field]: value }));
  }

  async function createProposal() {
    if (!proposal) return;
    const result = await post({ action: "createProposal", ...proposal });
    if (result?.proposal?.id) {
      window.open(`/admin/voorstellen/${result.proposal.id}/print`, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <main className="detail-page">
      <style>{styles}</style>
      <header>
        <a href="/admin">← Dashboard</a>
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
      </header>

      {error ? <div className="error">{error}</div> : null}
      {!lead ? <section className="card"><p>Lead laden...</p></section> : (
        <>
          <section className="hero card">
            <div>
              <span>Lead detail</span>
              <h1>{lead.naam || "Naam onbekend"}</h1>
              <p>{lead.postcode || "-"} {lead.huisnummer || ""}</p>
            </div>
            <div className="actions">
              {lead.telefoon ? <a href={`tel:${cleanPhone(lead.telefoon)}`}>Bellen</a> : null}
              {lead.email ? <a href={`mailto:${lead.email}`}>Mailen</a> : null}
              <button disabled={saving} onClick={() => post({ action: "updateLead", id: lead.id, last_contact_at: new Date().toISOString(), status: lead.status === "Nieuw" ? "Contact opgenomen" : lead.status })}>Contact gehad</button>
            </div>
          </section>

          <section className="grid">
            <article className="card">
              <h2>Contact & aanvraag</h2>
              <div className="info-grid">
                <Info label="Telefoon" value={lead.telefoon} />
                <Info label="E-mail" value={lead.email} />
                <Info label="Woningtype" value={lead.woningtype} />
                <Info label="Staat" value={lead.staat} />
                <Info label="Reden" value={lead.reden} />
                <Info label="Pagina" value={lead.pagina} />
                <Info label="Bron" value={lead.bron} />
                <Info label="Aangemaakt" value={fmt(lead.created_at)} />
              </div>
              <Field label="Status">
                <select value={lead.status || "Nieuw"} onChange={(e) => post({ action: "updateLead", id: lead.id, status: e.target.value })}>
                  {STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Notitie">
                <textarea defaultValue={lead.notitie || ""} onBlur={(e) => post({ action: "updateLead", id: lead.id, notitie: e.target.value })} />
              </Field>
            </article>

            <article className="card">
              <h2>Nieuwe taak</h2>
              <input placeholder="Bijv. klant nabellen" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              <input type="date" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} />
              <textarea placeholder="Toelichting" value={task.note} onChange={(e) => setTask({ ...task, note: e.target.value })} />
              <button disabled={saving} onClick={async () => { await post({ action: "createTask", lead_id: lead.id, lead_naam: lead.naam, ...task }); setTask({ title: "", due_date: todayPlus(1), note: "" }); }}>Taak opslaan</button>
            </article>
          </section>

          <section className="card proposal-card">
            <div className="section-head">
              <div>
                <span>Premium voorstel</span>
                <h2>Uitgebreid verkoopvoorstel maken</h2>
                <p>Maak een voorstel met voorblad, woninggegevens, uitgangspunten, netto-opbrengstvergelijking, voorwaarden en vervolgstappen.</p>
              </div>
              {latestProposal ? <a className="secondary-link" href={`/admin/voorstellen/${latestProposal.id}/print`} target="_blank">Laatste voorstel openen</a> : null}
            </div>

            {proposal ? (
              <div className="proposal-form">
                <div className="form-section">
                  <h3>1. Basis</h3>
                  <div className="form-grid">
                    <Field label="Naam klant"><input value={proposal.lead_naam} onChange={(e) => setProposalField("lead_naam", e.target.value)} /></Field>
                    <Field label="E-mail klant"><input value={proposal.lead_email} onChange={(e) => setProposalField("lead_email", e.target.value)} /></Field>
                    <Field label="Telefoon klant"><input value={proposal.lead_telefoon} onChange={(e) => setProposalField("lead_telefoon", e.target.value)} /></Field>
                    <Field label="Contactpersoon"><input value={proposal.contact_person} onChange={(e) => setProposalField("contact_person", e.target.value)} /></Field>
                    <Field label="Voorgesteld bedrag"><input placeholder="Bijv. € 190.000" value={proposal.amount_text} onChange={(e) => setProposalField("amount_text", e.target.value)} /></Field>
                    <Field label="Geldig tot"><input type="date" value={proposal.validity_date} onChange={(e) => setProposalField("validity_date", e.target.value)} /></Field>
                    <Field label="Oplevering"><input value={proposal.transfer_date_text} onChange={(e) => setProposalField("transfer_date_text", e.target.value)} /></Field>
                    <Field label="Aanbetaling / voorschot"><input value={proposal.deposit_text} onChange={(e) => setProposalField("deposit_text", e.target.value)} /></Field>
                  </div>
                </div>

                <div className="form-section">
                  <h3>2. Woninggegevens</h3>
                  <div className="form-grid">
                    <Field label="Adres / woning"><input value={proposal.property_address} onChange={(e) => setProposalField("property_address", e.target.value)} /></Field>
                    <Field label="Postcode"><input value={proposal.property_postcode} onChange={(e) => setProposalField("property_postcode", e.target.value)} /></Field>
                    <Field label="Huisnummer"><input value={proposal.property_house_number} onChange={(e) => setProposalField("property_house_number", e.target.value)} /></Field>
                    <Field label="Type woning"><input value={proposal.property_type} onChange={(e) => setProposalField("property_type", e.target.value)} /></Field>
                    <Field label="Woonoppervlakte"><input placeholder="Bijv. 178 m²" value={proposal.living_area_text} onChange={(e) => setProposalField("living_area_text", e.target.value)} /></Field>
                    <Field label="Perceeloppervlakte"><input placeholder="Bijv. 970 m²" value={proposal.plot_area_text} onChange={(e) => setProposalField("plot_area_text", e.target.value)} /></Field>
                    <Field label="Bouwjaar"><input value={proposal.build_year_text} onChange={(e) => setProposalField("build_year_text", e.target.value)} /></Field>
                    <Field label="Huidige situatie"><input value={proposal.current_situation} onChange={(e) => setProposalField("current_situation", e.target.value)} /></Field>
                  </div>
                </div>

                <div className="form-section">
                  <h3>3. Netto-opbrengstvergelijking</h3>
                  <div className="form-grid">
                    <Field label="Traditionele verkoopprijs"><input placeholder="Bijv. € 240.000" value={proposal.traditional_price_text} onChange={(e) => setProposalField("traditional_price_text", e.target.value)} /></Field>
                    <Field label="Makelaarskosten"><input placeholder="Bijv. - € 4.356" value={proposal.agent_costs_text} onChange={(e) => setProposalField("agent_costs_text", e.target.value)} /></Field>
                    <Field label="Notariskosten levering"><input placeholder="Bijv. - € 1.600" value={proposal.notary_costs_text} onChange={(e) => setProposalField("notary_costs_text", e.target.value)} /></Field>
                    <Field label="Herstel-/renovatiekosten"><input placeholder="Bijv. - € 45.000" value={proposal.renovation_costs_text} onChange={(e) => setProposalField("renovation_costs_text", e.target.value)} /></Field>
                    <Field label="Overige verkoopkosten"><input placeholder="Bijv. - € 1.150" value={proposal.other_costs_text} onChange={(e) => setProposalField("other_costs_text", e.target.value)} /></Field>
                    <Field label="Netto traditioneel"><input placeholder="Bijv. € 187.894" value={proposal.traditional_net_text} onChange={(e) => setProposalField("traditional_net_text", e.target.value)} /></Field>
                    <Field label="Netto Vastgoed Direct"><input placeholder="Bijv. € 190.000" value={proposal.direct_net_text} onChange={(e) => setProposalField("direct_net_text", e.target.value)} /></Field>
                  </div>
                </div>

                <div className="form-section">
                  <h3>4. Teksten en voorwaarden</h3>
                  <Field label="Uitgangspunten van dit voorstel">
                    <textarea value={proposal.assumptions_text} onChange={(e) => setProposalField("assumptions_text", e.target.value)} />
                  </Field>
                  <Field label="Wat is inbegrepen — één regel per punt">
                    <textarea value={proposal.included_items} onChange={(e) => setProposalField("included_items", e.target.value)} />
                  </Field>
                  <Field label="Voorwaarden">
                    <textarea value={proposal.conditions_text} onChange={(e) => setProposalField("conditions_text", e.target.value)} />
                  </Field>
                  <Field label="Korte vergelijking / toelichting">
                    <textarea value={proposal.short_comparison_text} onChange={(e) => setProposalField("short_comparison_text", e.target.value)} />
                  </Field>
                  <Field label="Voorbehouden — één regel per punt">
                    <textarea value={proposal.reservations_text} onChange={(e) => setProposalField("reservations_text", e.target.value)} />
                  </Field>
                  <Field label="Vervolgstappen — één regel per stap">
                    <textarea value={proposal.next_steps_text} onChange={(e) => setProposalField("next_steps_text", e.target.value)} />
                  </Field>
                  <Field label="Aanvullende opmerkingen">
                    <textarea value={proposal.notes} onChange={(e) => setProposalField("notes", e.target.value)} />
                  </Field>
                </div>

                <div className="proposal-actions">
                  <button disabled={saving || !proposal.amount_text} onClick={createProposal}>Voorstel maken en openen</button>
                  <button type="button" className="ghost" onClick={() => setProposal(defaultProposalForLead(lead))}>Velden herstellen</button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid three">
            <article className="card"><h2>Taken</h2>{(data.tasks || []).map((item) => <div className="item" key={item.id}><strong>{item.title}</strong><span>{item.status} · {item.due_date || "geen datum"}</span><select value={item.status || "Open"} onChange={(e) => post({ action: "updateTask", id: item.id, status: e.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>)}</article>
            <article className="card"><h2>Voorstellen</h2>{(data.proposals || []).map((item) => <div className="item" key={item.id}><strong>{item.amount_text || "Voorstel"}</strong><span>{item.status} · {fmt(item.created_at)}</span><a href={`/admin/voorstellen/${item.id}/print`} target="_blank">Print/PDF</a><button className="small" onClick={() => post({ action: "sendProposalEmail", id: item.id })}>Mail voorstel</button></div>)}</article>
            <article className="card"><h2>Mailhistorie</h2>{(data.mailLogs || []).map((item) => <div className="item" key={item.id}><strong>{item.type}</strong><span>{item.status} · {item.recipient}</span><small>{fmt(item.created_at)}</small></div>)}</article>
          </section>
        </>
      )}
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--orange:#ff6a00;--green:#20c768;--shadow:0 22px 70px rgba(7,31,58,.12)}body{margin:0;background:radial-gradient(circle at top right,#fff3e7,transparent 34%),var(--bg);color:var(--navy);font-family:Inter,Arial,Helvetica,sans-serif}.detail-page{max-width:1280px;margin:0 auto;padding:28px}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}header a{color:var(--navy);font-weight:900;text-decoration:none}header img{width:220px;background:#fff;border-radius:18px;padding:10px}.card{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:24px;box-shadow:var(--shadow)}.hero{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:18px}.hero span,.section-head span{color:#a64200;background:#fff3e7;border:1px solid #ffd5b6;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900;text-transform:uppercase}.hero h1{font-size:42px;letter-spacing:-.04em;margin:12px 0 6px}.hero p,.section-head p{color:var(--muted);font-size:18px}.actions,.proposal-actions{display:flex;gap:10px;flex-wrap:wrap}.actions a,.actions button,.card button,.item a,.secondary-link{border:0;background:var(--orange);color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-weight:900;cursor:pointer;display:inline-block}.actions a:first-child{background:var(--navy)}.grid{display:grid;grid-template-columns:1.3fr .7fr;gap:18px;margin-bottom:18px}.grid.three{grid-template-columns:repeat(3,1fr)}h2{margin:0 0 18px;font-size:24px;letter-spacing:-.03em}h3{margin:0 0 16px;font-size:20px}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px}.info{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.info span,.item span,.item small,label span{display:block;color:var(--muted);font-size:13px}.info strong{display:block;margin-top:6px;word-break:break-word}label{display:grid;gap:8px;font-weight:900;margin-top:12px}input,select,textarea{width:100%;border:1px solid var(--line);border-radius:16px;padding:13px 14px;font:inherit;background:#fff}textarea{min-height:110px;resize:vertical}.item{border-bottom:1px solid var(--line);padding:12px 0}.item:last-child{border-bottom:0}.item strong{display:block}.item a{margin-top:8px;background:var(--navy)}.item button.small{margin-top:8px;margin-left:8px;padding:9px 12px;font-size:13px}.error{background:#fff3f0;color:#9b1c00;border:1px solid #ffd1c4;border-radius:16px;padding:12px 14px;margin-bottom:16px}.proposal-card{margin:18px 0}.section-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.section-head h2{font-size:34px;margin:12px 0 8px}.secondary-link{background:var(--navy);white-space:nowrap}.proposal-form{display:grid;gap:20px}.form-section{border:1px solid var(--line);border-radius:24px;background:#fff;padding:20px}.form-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.form-section textarea{min-height:96px}.proposal-actions button{padding:14px 20px}.proposal-actions .ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}@media(max-width:1100px){.form-grid{grid-template-columns:repeat(2,1fr)}.grid.three{grid-template-columns:1fr}}@media(max-width:900px){.grid,.hero,.section-head{grid-template-columns:1fr;display:grid}.info-grid,.form-grid{grid-template-columns:1fr}.detail-page{padding:18px}}
`;
