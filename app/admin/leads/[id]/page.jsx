"use client";

import { useEffect, useState } from "react";

const STATUSES = ["Nieuw", "Contact opgenomen", "In beoordeling", "Voorstel verzonden", "Akkoord", "Afgewezen"];
const TASK_STATUSES = ["Open", "In behandeling", "Afgerond"];

function todayPlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function fmt(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value || "-"}</strong></div>;
}

export default function LeadDetailPage({ params }) {
  const [leadId, setLeadId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState({ title: "", due_date: todayPlus(1), note: "" });

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
  }

  async function post(body) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/v2", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error || "Opslaan mislukt.");
      await load();
      return json;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { if (leadId) load(leadId); }, [leadId]);

  const lead = data?.lead;

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
              <label>Status<select value={lead.status || "Nieuw"} onChange={(e) => post({ action: "updateLead", id: lead.id, status: e.target.value })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label>Notitie<textarea defaultValue={lead.notitie || ""} onBlur={(e) => post({ action: "updateLead", id: lead.id, notitie: e.target.value })} /></label>
            </article>

            <article className="card">
              <h2>Nieuwe taak</h2>
              <input placeholder="Bijv. klant nabellen" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              <input type="date" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} />
              <textarea placeholder="Toelichting" value={task.note} onChange={(e) => setTask({ ...task, note: e.target.value })} />
              <button disabled={saving} onClick={async () => { await post({ action: "createTask", lead_id: lead.id, lead_naam: lead.naam, ...task }); setTask({ title: "", due_date: todayPlus(1), note: "" }); }}>Taak opslaan</button>
            </article>
          </section>

          <section className="grid three">
            <article className="card"><h2>Taken</h2>{(data.tasks || []).map((item) => <div className="item" key={item.id}><strong>{item.title}</strong><span>{item.status} · {item.due_date || "geen datum"}</span><select value={item.status || "Open"} onChange={(e) => post({ action: "updateTask", id: item.id, status: e.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>)}</article>
            <article className="card"><h2>Voorstellen</h2>{(data.proposals || []).map((item) => <div className="item" key={item.id}><strong>{item.amount_text || "Voorstel"}</strong><span>{item.status} · {fmt(item.created_at)}</span><a href={`/admin/voorstellen/${item.id}/print`} target="_blank">Print/PDF</a></div>)}</article>
            <article className="card"><h2>Mailhistorie</h2>{(data.mailLogs || []).map((item) => <div className="item" key={item.id}><strong>{item.type}</strong><span>{item.status} · {item.recipient}</span><small>{fmt(item.created_at)}</small></div>)}</article>
          </section>
        </>
      )}
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--orange:#ff6a00;--green:#20c768;--shadow:0 22px 70px rgba(7,31,58,.12)}body{margin:0;background:radial-gradient(circle at top right,#fff3e7,transparent 34%),var(--bg);color:var(--navy);font-family:Inter,Arial,Helvetica,sans-serif}.detail-page{max-width:1220px;margin:0 auto;padding:28px}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}header a{color:var(--navy);font-weight:900;text-decoration:none}header img{width:220px;background:#fff;border-radius:18px;padding:10px}.card{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:24px;box-shadow:var(--shadow)}.hero{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:18px}.hero span{color:#a64200;background:#fff3e7;border:1px solid #ffd5b6;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900;text-transform:uppercase}.hero h1{font-size:42px;letter-spacing:-.04em;margin:12px 0 6px}.hero p{color:var(--muted);font-size:18px}.actions{display:flex;gap:10px;flex-wrap:wrap}.actions a,.actions button,.card button,.item a{border:0;background:var(--orange);color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-weight:900;cursor:pointer}.actions a:first-child{background:var(--navy)}.grid{display:grid;grid-template-columns:1.3fr .7fr;gap:18px;margin-bottom:18px}.grid.three{grid-template-columns:repeat(3,1fr)}h2{margin:0 0 18px;font-size:24px;letter-spacing:-.03em}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px}.info{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.info span,.item span,.item small{display:block;color:var(--muted);font-size:13px}.info strong{display:block;margin-top:6px;word-break:break-word}label{display:grid;gap:8px;font-weight:900;margin-top:12px}input,select,textarea{width:100%;border:1px solid var(--line);border-radius:16px;padding:13px 14px;font:inherit;background:#fff}textarea{min-height:110px;resize:vertical}.item{border-bottom:1px solid var(--line);padding:12px 0}.item:last-child{border-bottom:0}.item strong{display:block}.item a{display:inline-block;margin-top:8px;background:var(--navy)}.error{background:#fff3f0;color:#9b1c00;border:1px solid #ffd1c4;border-radius:16px;padding:12px 14px;margin-bottom:16px}@media(max-width:900px){.grid,.grid.three,.hero{grid-template-columns:1fr;display:grid}.info-grid{grid-template-columns:1fr}.detail-page{padding:18px}}
`;
