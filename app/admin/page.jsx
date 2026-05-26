"use client";

import { useEffect, useMemo, useState } from "react";

const STATUSES = ["Nieuw", "Contact opgenomen", "In beoordeling", "Voorstel verzonden", "Akkoord", "Afgewezen"];
const todayPlus = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
const fmt = (v) => v ? new Intl.DateTimeFormat("nl-NL", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }).format(new Date(v)) : "-";
const cleanPhone = (p) => (p || "").replace(/[^\d+]/g, "");
const wa = (p, n) => `https://wa.me/${cleanPhone(p).replace(/^0/, "31")}?text=${encodeURIComponent(`Hallo ${n || ""}, bedankt voor uw aanvraag bij Vastgoed Direct Nederland. Ik neem graag contact met u op over uw woning.`)}`;

export default function AdminDashboardV2() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("Leads");
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("Alle");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [proposalForm, setProposalForm] = useState({
    amount_text: "",
    validity_date: todayPlus(14),
    transfer_date_text: "In overleg",
    deposit_text: "In overleg bespreekbaar",
    conditions_text: "Vrijblijvend voorstel onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging.",
    notes: "",
  });
  const [taskForm, setTaskForm] = useState({ title: "", due_date: todayPlus(1), note: "" });

  const stats = useMemo(() => ({
    total: leads.length,
    nieuw: leads.filter(l => (l.status || "Nieuw") === "Nieuw").length,
    voorstellen: proposals.length,
    openTaken: tasks.filter(t => (t.status || "Open") === "Open").length,
  }), [leads, proposals, tasks]);

  async function login(e) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/login", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ password }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setError(j.error || "Inloggen mislukt.");
    setLoggedIn(true);
    setPassword("");
    loadAll();
  }

  async function apiGet(action, extra = "") {
    const r = await fetch(`/api/admin/v2?action=${action}${extra}`);
    if (r.status === 401) { setLoggedIn(false); return null; }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setError(j.error || "Actie mislukt."); return null; }
    return j;
  }

  async function apiPost(body) {
    const r = await fetch("/api/admin/v2", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { alert(j.error || "Actie mislukt."); return null; }
    return j;
  }

  async function loadLeads() {
    const q = `&status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`;
    const j = await apiGet("leads", q);
    if (j) setLeads(j.leads || []);
  }
  async function loadAll() {
    const [l, p, t, r] = await Promise.all([apiGet("leads"), apiGet("proposals"), apiGet("tasks"), apiGet("report")]);
    if (l) setLeads(l.leads || []);
    if (p) setProposals(p.proposals || []);
    if (t) setTasks(t.tasks || []);
    if (r) setReport(r);
  }
  async function updateLead(id, updates) {
    const j = await apiPost({ action:"updateLead", id, ...updates });
    if (!j) return;
    setLeads(leads.map(l => l.id === j.lead.id ? j.lead : l));
    setSelectedLead(j.lead);
  }
  async function createProposal() {
    if (!selectedLead) return alert("Selecteer eerst een lead.");
    const property_address = `${selectedLead.postcode || ""} ${selectedLead.huisnummer || ""}`.trim();
    const j = await apiPost({ action:"createProposal", lead_id:selectedLead.id, lead_naam:selectedLead.naam, lead_email:selectedLead.email, lead_telefoon:selectedLead.telefoon, property_address, ...proposalForm });
    if (!j) return;
    await updateLead(selectedLead.id, { status:"Voorstel verzonden" });
    const p = await apiGet("proposals"); if (p) setProposals(p.proposals || []);
    setTab("Voorstellen");
  }
  async function createTask() {
    if (!taskForm.title.trim()) return alert("Vul een taak in.");
    const j = await apiPost({ action:"createTask", lead_id:selectedLead?.id, lead_naam:selectedLead?.naam, ...taskForm });
    if (!j) return;
    setTaskForm({ title:"", due_date:todayPlus(1), note:"" });
    const t = await apiGet("tasks"); if (t) setTasks(t.tasks || []);
    setTab("Taken");
  }
  async function updateTask(id, newStatus) {
    const j = await apiPost({ action:"updateTask", id, status:newStatus });
    if (!j) return;
    const t = await apiGet("tasks"); if (t) setTasks(t.tasks || []);
  }
  async function sendProposalEmail(id) {
    if (!confirm("Verkoopvoorstel per e-mail verzenden?")) return;
    const j = await apiPost({ action:"sendProposalEmail", id });
    if (j) alert("E-mail verzonden.");
    const p = await apiGet("proposals"); if (p) setProposals(p.proposals || []);
  }

  useEffect(() => { if (loggedIn) loadLeads(); }, [status]);

  if (!loggedIn) {
    return <main className="admin-page"><style jsx global>{styles}</style><section className="login-card"><img src="/logo.png" alt="Vastgoed Direct Nederland" /><h1>Lead dashboard v2</h1><p>Log in voor leads, voorstellen, taken en rapportage.</p><form onSubmit={login}><input type="password" placeholder="Admin wachtwoord" value={password} onChange={e=>setPassword(e.target.value)} required/><button>Inloggen</button></form>{error && <div className="error">{error}</div>}</section></main>;
  }

  return (
    <main className="admin-page"><style jsx global>{styles}</style>
      <header className="admin-header"><div><img src="/logo.png" alt="Vastgoed Direct Nederland"/><div><h1>Lead dashboard v2</h1><p>Leads, voorstellen, taken en SEO-rapportage</p></div></div><button onClick={async()=>{await fetch("/api/admin/logout",{method:"POST"});setLoggedIn(false);}}>Uitloggen</button></header>
      <nav className="tabs">{["Leads","Voorstellen","Taken","Rapportage"].map(x=><button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</nav>
      <section className="stats"><Card t="Totaal leads" v={stats.total}/><Card t="Nieuwe leads" v={stats.nieuw}/><Card t="Voorstellen" v={stats.voorstellen}/><Card t="Open taken" v={stats.openTaken}/></section>

      {tab==="Leads" && <>
        <section className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Zoek naam, telefoon, postcode, bron of pagina"/><select value={status} onChange={e=>setStatus(e.target.value)}><option>Alle</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select><button onClick={loadLeads}>Zoeken</button></section>
        <section className="grid">
          <div className="list">{leads.map(l=><button key={l.id} onClick={()=>setSelectedLead(l)} className={selectedLead?.id===l.id?"lead active":"lead"}><strong>{l.naam||"Naam onbekend"}</strong><span>{l.telefoon||"-"}</span><small>{l.postcode||"-"} {l.huisnummer||""} · {fmt(l.created_at)}</small><em>{l.status||"Nieuw"}</em></button>)}</div>
          <aside className="detail">{!selectedLead ? <p>Selecteer een lead.</p> : <>
            <h2>{selectedLead.naam||"Naam onbekend"}</h2><p>{selectedLead.postcode||"-"} {selectedLead.huisnummer||""}</p>
            <div className="detailgrid"><Info t="Telefoon" v={selectedLead.telefoon}/><Info t="E-mail" v={selectedLead.email}/><Info t="Pagina" v={selectedLead.pagina}/><Info t="Bron" v={selectedLead.bron}/><Info t="Woningtype" v={selectedLead.woningtype}/><Info t="Reden" v={selectedLead.reden}/></div>
            <div className="actions">{selectedLead.telefoon && <><a href={`tel:${cleanPhone(selectedLead.telefoon)}`}>Bellen</a><a className="green" href={wa(selectedLead.telefoon, selectedLead.naam)} target="_blank">WhatsApp</a></>}{selectedLead.email && <a href={`mailto:${selectedLead.email}`}>Mailen</a>}</div>
            <label>Status<select value={selectedLead.status||"Nieuw"} onChange={e=>updateLead(selectedLead.id,{status:e.target.value})}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></label>
            <label>Notitie<textarea value={selectedLead.notitie||""} onChange={e=>setSelectedLead({...selectedLead,notitie:e.target.value})} onBlur={e=>updateLead(selectedLead.id,{notitie:e.target.value})}/></label>
            <button onClick={()=>updateLead(selectedLead.id,{last_contact_at:new Date().toISOString()})}>Markeer als contact gehad</button>
            <div className="panel"><h3>Verkoopvoorstel genereren</h3><input placeholder="Voorgesteld bedrag" value={proposalForm.amount_text} onChange={e=>setProposalForm({...proposalForm,amount_text:e.target.value})}/><input type="date" value={proposalForm.validity_date} onChange={e=>setProposalForm({...proposalForm,validity_date:e.target.value})}/><input placeholder="Oplevering" value={proposalForm.transfer_date_text} onChange={e=>setProposalForm({...proposalForm,transfer_date_text:e.target.value})}/><input placeholder="Aanbetaling" value={proposalForm.deposit_text} onChange={e=>setProposalForm({...proposalForm,deposit_text:e.target.value})}/><textarea value={proposalForm.conditions_text} onChange={e=>setProposalForm({...proposalForm,conditions_text:e.target.value})}/><button onClick={createProposal}>Voorstel maken</button></div>
            <div className="panel"><h3>Taak/reminder</h3><input placeholder="Taak" value={taskForm.title} onChange={e=>setTaskForm({...taskForm,title:e.target.value})}/><input type="date" value={taskForm.due_date} onChange={e=>setTaskForm({...taskForm,due_date:e.target.value})}/><textarea placeholder="Notitie" value={taskForm.note} onChange={e=>setTaskForm({...taskForm,note:e.target.value})}/><button onClick={createTask}>Taak aanmaken</button></div>
          </>}</aside>
        </section>
      </>}

      {tab==="Voorstellen" && <Table title="Verkoopvoorstellen" rows={proposals} send={sendProposalEmail}/>}
      {tab==="Taken" && <section className="cards">{tasks.map(t=><div className="task" key={t.id}><strong>{t.title}</strong><span>{t.lead_naam||"Algemeen"} · {t.due_date||"Geen datum"}</span><p>{t.note}</p><select value={t.status||"Open"} onChange={e=>updateTask(t.id,e.target.value)}><option>Open</option><option>Gedaan</option></select></div>)}</section>}
      {tab==="Rapportage" && <section className="reports"><Report title="Leads per SEO-pagina" data={report?.byPage}/><Report title="Leads per bron" data={report?.bySource}/><Report title="Leads per status" data={report?.byStatus}/><Report title="Leads per maand" data={report?.byMonth}/></section>}
    </main>
  );
}

function Card({t,v}){return <div className="stat"><span>{t}</span><strong>{v}</strong></div>}
function Info({t,v}){return <div><span>{t}</span><strong>{v||"-"}</strong></div>}
function Report({title,data}){const rows=Object.entries(data||{}).sort((a,b)=>b[1]-a[1]);return <div className="box"><h2>{title}</h2>{rows.map(([k,v])=><p key={k}><span>{k}</span><strong>{v}</strong></p>)}</div>}
function Table({title,rows,send}){return <section className="box"><h2>{title}</h2><div className="tablewrap"><table><thead><tr><th>Naam</th><th>Adres</th><th>Bedrag</th><th>Status</th><th>Acties</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.lead_naam}</td><td>{r.property_address}</td><td>{r.amount_text}</td><td>{r.status}</td><td><a href={`/admin/voorstellen/${r.id}/print`} target="_blank">PDF/print</a><button onClick={()=>send(r.id)}>Mailen</button></td></tr>)}</tbody></table></div></section>}

const styles = `
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f7f5f0;color:#0a2540}a{text-decoration:none;color:inherit}.admin-page{min-height:100vh;padding:28px}.login-card,.box,.detail,.list,.stat,.task{background:#fff;border:1px solid #e6e2db;border-radius:24px;box-shadow:0 16px 40px rgba(10,37,64,.08)}.login-card{width:min(460px,100%);margin:8vh auto;padding:34px;display:grid;gap:14px}.login-card img{width:230px;margin:auto}.admin-header{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #e6e2db;border-radius:26px;padding:20px 24px}.admin-header>div{display:flex;align-items:center;gap:22px}.admin-header img{width:190px}.admin-header h1{margin:0}.admin-header p{margin:4px 0;color:#647386}.tabs{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.tabs button{background:#fff;color:#0a2540;border:1px solid #e6e2db}.tabs .active{background:#0a2540;color:#fff}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}.stat{padding:22px}.stat span,.detailgrid span{color:#647386;font-weight:800}.stat strong{display:block;font-size:34px;margin-top:6px}.toolbar{display:grid;grid-template-columns:1fr 230px 150px;gap:12px;margin-bottom:18px}.grid{display:grid;grid-template-columns:minmax(330px,.85fr) minmax(420px,1.15fr);gap:18px}.list{display:grid;gap:12px;padding:18px;max-height:calc(100vh - 280px);overflow:auto}.lead{text-align:left;background:#f7f5f0;color:#0a2540;border:1px solid #e6e2db;border-radius:18px;padding:16px;display:grid;gap:6px}.lead.active{border-color:#ff6a00;box-shadow:0 0 0 3px rgba(255,106,0,.14)}.lead span,.lead small{color:#647386}.lead em{justify-self:start;background:#0a2540;color:#fff;border-radius:999px;padding:6px 10px;font-style:normal;font-size:12px;font-weight:900}.detail{padding:22px}.detail h2{margin:0}.detailgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:18px 0}.detailgrid div{background:#f7f5f0;border-radius:16px;padding:14px;min-width:0}.detailgrid strong{overflow-wrap:anywhere}.actions{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}.actions a,button,td a{border:none;border-radius:999px;background:#ff6a00;color:#fff;font-weight:900;padding:12px 16px;cursor:pointer;display:inline-flex;justify-content:center}.actions .green{background:#25d366}input,select,textarea{width:100%;border:1px solid #d9d5ce;border-radius:16px;padding:14px 16px;font-size:15px;background:#fff}textarea{min-height:105px}label,.panel{display:grid;gap:9px;margin-top:16px;font-weight:900}.panel{border-top:1px solid #eee9e2;padding-top:18px}.box{padding:22px}.tablewrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #eee9e2;text-align:left;padding:13px;vertical-align:top}td button,td a{margin:4px}.cards,.reports{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.task{padding:18px;display:grid;gap:8px}.task span,.task p{color:#647386}.box p{display:grid;grid-template-columns:1fr auto;gap:14px;border-bottom:1px solid #eee9e2;padding:10px 0}.box p span{overflow-wrap:anywhere;color:#647386}@media(max-width:900px){.admin-page{padding:14px}.admin-header,.admin-header>div{align-items:flex-start;flex-direction:column}.stats,.toolbar,.grid,.detailgrid,.cards,.reports{grid-template-columns:1fr}.list{max-height:none}}
`;
