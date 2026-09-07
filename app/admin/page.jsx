"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { addDaysAmsterdam, formatDateTimeNL, todayAmsterdam } from "../lib/date";
import { LEAD_STATUSES, ARCHIVE_LEAD_STATUSES, displayStatus, selectStatusValue } from "../lib/leadStatus.js";
import { isLeadCustomerActionHandled, leadCustomerActionPriority } from "../lib/admin/customerActions.js";
import { parseLeadSourceDetails } from "../lib/sourceParser.js";

const TASK_STATUSES = ["Open", "In behandeling", "Afgerond"];

function todayPlus(days) { return addDaysAmsterdam(days); }

function fmt(value) { return formatDateTimeNL(value); }

function statusClass(status) {
  return `status-${displayStatus(status).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function PipelineButtons({ value, onChange }) {
  const active = displayStatus(value);
  return (
    <div className="pipeline-buttons" aria-label="Pipeline status">
      {LEAD_STATUSES.filter((status) => !["Afgerond", "Gearchiveerd"].includes(status)).map((status) => (
        <button key={status} type="button" className={active === status ? "active" : ""} onClick={() => onChange(status)}>
          {status}
        </button>
      ))}
    </div>
  );
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function whatsappUrl(phone, name) {
  const cleaned = cleanPhone(phone).replace(/^0/, "31");
  const text = `Hallo ${name || ""}, bedankt voor uw aanvraag bij Vastgoed Direct Nederland. Ik neem graag contact met u op over uw woning.`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

function SourceDetails({ lead }) {
  const details = parseLeadSourceDetails(lead);
  const hasDetails = [details.pagePath, details.pageTitle, details.source, details.medium, details.campaign, details.term, details.content, details.clickId, details.referrer].some(Boolean);
  if (!hasDetails) return null;

  return (
    <div className="source-detail-box">
      <h3>Meetgegevens</h3>
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

function emptyProposal(days = 14) {
  return {
    amount_text: "",
    validity_date: todayPlus(days),
    transfer_date_text: "In overleg",
    deposit_text: "In overleg bespreekbaar",
    conditions_text:
      "Vrijblijvend voorstel onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging.",
    notes: "",
  };
}

function Kpi({ label, value, hint }) {
  return (
    <article className="kpi-card">
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
      {hint ? <small>{hint}</small> : null}
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-card">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function Bar({ label, value, max }) {
  const width = max ? Math.max(8, Math.round((Number(value) / max) * 100)) : 0;
  return (
    <div className="bar-row">
      <div>
        <strong>{label || "Onbekend"}</strong>
        <span>{value} lead{Number(value) === 1 ? "" : "s"}</span>
      </div>
      <em><i style={{ width: `${width}%` }} /></em>
    </div>
  );
}

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState("dashboard");
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [archivedLeads, setArchivedLeads] = useState([]);
  const [archivedProposals, setArchivedProposals] = useState([]);
  const [report, setReport] = useState({ kpis: {}, byPage: [], bySource: [], byStatus: [], byMonth: [], recentTasks: [] });
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [taskFilter, setTaskFilter] = useState("Alle");
  const [search, setSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [proposalForm, setProposalForm] = useState(emptyProposal());
  const [taskForm, setTaskForm] = useState({ title: "", due_date: todayPlus(1), note: "" });

  const maxPage = useMemo(() => Math.max(1, ...((report.byPage || []).map((r) => Number(r.total) || 0))), [report]);
  const maxSource = useMemo(() => Math.max(1, ...((report.bySource || []).map((r) => Number(r.total) || 0))), [report]);
  const actionLeads = useMemo(() => {
    const now = Date.now();
    const today = todayAmsterdam();
    const hoursSince = (value) => {
      const time = value ? new Date(value).getTime() : NaN;
      return Number.isFinite(time) ? (now - time) / 3600000 : Infinity;
    };

    return leads
      .map((lead) => {
        let priority = 0;
        let reason = "";
        const viewAgeHours = hoursSince(lead.last_proposal_viewed_at);
        const interestAgeHours = hoursSince(lead.last_interest_at);
        const createdAgeHours = hoursSince(lead.created_at);
        const lastActivityAgeHours = Math.min(
          hoursSince(lead.last_contact_at),
          viewAgeHours,
          interestAgeHours,
          createdAgeHours
        );

        const customerActionHandled = isLeadCustomerActionHandled(lead);
        const klantactie = leadCustomerActionPriority(lead, interestAgeHours);

        if (klantactie) {
          priority = klantactie.priority;
          reason = klantactie.reason;
        } else if (lead.last_proposal_viewed_at && viewAgeHours <= 24 && !customerActionHandled) {
          priority = 80 + Math.min(Number(lead.proposal_view_count || 0), 10);
          reason = `Voorstel vandaag/recent bekeken · ${lead.proposal_view_count || 1} sessie(s)`;
        } else if (lead.next_follow_up_at && lead.next_follow_up_at <= today) {
          priority = 70;
          reason = lead.manual_follow_up_at ? "Handmatige opvolging is vandaag of over tijd" : "Opvolging is vandaag of over tijd";
        } else if (["Nieuwe aanvraag", "Nieuw"].includes(lead.status) && createdAgeHours <= 4) {
          priority = 60;
          reason = "Nieuwe aanvraag van minder dan 4 uur geleden";
        } else if (["Nieuwe aanvraag", "Nieuw"].includes(lead.status)) {
          priority = 55;
          reason = "Nieuwe aanvraag nog opvolgen";
        } else if (lastActivityAgeHours > 72 && !ARCHIVE_LEAD_STATUSES.includes(lead.status || "")) {
          priority = 30;
          reason = "Meer dan 3 dagen geen recente activiteit";
        } else if (Number(lead.open_tasks || 0) > 0) {
          priority = 20;
          reason = `${lead.open_tasks} open taak/taken`;
        }

        return { ...lead, _priority: priority, _reason: reason };
      })
      .filter((lead) => lead._priority > 0)
      .sort((a, b) => b._priority - a._priority)
      .slice(0, 10);
  }, [leads]);

  const kanbanColumns = useMemo(() => [
    ["Nieuw", ["Nieuw", "Nieuwe aanvraag"], "Nieuwe aanvraag"],
    ["Contact", ["Contact opgenomen", "In behandeling"], "In behandeling"],
    ["Beoordeling", ["Eerste bod gedaan", "In beoordeling", "Beoordeling gepland"], "Beoordeling gepland"],
    ["Voorstel", ["Voorstel opgesteld", "Voorstel verzonden", "Voorstel bekeken"], "Voorstel opgesteld"],
    ["Onderhandeling", ["In onderhandeling"], "In onderhandeling"],
    ["Akkoord", ["Akkoord"], "Akkoord"],
  ], []);

  async function apiGet(action, params = {}) {
    const url = new URL(`/api/admin/v2`, window.location.origin);
    url.searchParams.set("action", action);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), { cache: "no-store" });
    const json = await response.json().catch(() => ({}));

    if (response.status === 401) {
      setLoggedIn(false);
      return null;
    }

    if (!response.ok) {
      setError(json.error || "Ophalen mislukt.");
      return null;
    }

    return json;
  }

  async function apiPost(body) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setLoggedIn(false);
        return null;
      }
      if (!response.ok) {
        setError(json.error || "Actie mislukt.");
        return null;
      }
      return json;
    } finally {
      setSaving(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) return setError(json.error || "Inloggen mislukt.");
    setPassword("");
    setLoggedIn(true);
    await loadAll();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setSelected(null);
    setDetail(null);
  }

  async function loadLeads(next = {}) {
    const data = await apiGet("leads", {
      status: next.status ?? statusFilter,
      search: next.search ?? search,
      limit: 300,
      archive: next.archive ?? "active",
    });
    if (data?.leads) setLeads(data.leads);
  }

  async function loadTasks(next = {}) {
    const data = await apiGet("tasks", { status: next.status ?? taskFilter });
    if (data?.tasks) setTasks(data.tasks);
  }

  async function loadProposals(next = {}) {
    const data = await apiGet("proposals", { archive: next.archive ?? "active" });
    if (data?.proposals) setProposals(data.proposals);
  }

  async function loadArchive() {
    const [leadData, proposalData] = await Promise.all([
      apiGet("leads", { archive: "archive", limit: 300 }),
      apiGet("proposals", { archive: "archive" }),
    ]);
    if (leadData?.leads) setArchivedLeads(leadData.leads);
    if (proposalData?.proposals) setArchivedProposals(proposalData.proposals);
  }

  async function loadReport() {
    const data = await apiGet("report");
    if (data) setReport(data);
  }

  async function loadLeadDetail(id) {
    const data = await apiGet("lead", { id });
    if (!data) return;
    setSelected(data.lead);
    setDetail(data);
    setProposalForm(emptyProposal());
    setTaskForm({ title: "", due_date: todayPlus(1), note: "" });
  }

  async function loadAll() {
    const [leadData, taskData, proposalData, reportData] = await Promise.all([
      apiGet("leads", { limit: 300 }),
      apiGet("tasks"),
      apiGet("proposals"),
      apiGet("report"),
    ]);
    if (leadData?.leads) setLeads(leadData.leads);
    if (taskData?.tasks) setTasks(taskData.tasks);
    if (proposalData?.proposals) setProposals(proposalData.proposals);
    if (reportData) setReport(reportData);
  }

  async function updateLead(id, updates) {
    const data = await apiPost({ action: "updateLead", id, ...updates });
    if (!data?.lead) return;
    const isArchived = ARCHIVE_LEAD_STATUSES.includes(data.lead.status || "");
    setLeads((items) => isArchived ? items.filter((lead) => lead.id !== id) : items.map((lead) => (lead.id === id ? { ...lead, ...data.lead } : lead)));
    setSelected(data.lead);
    if (detail?.lead?.id === id) setDetail((old) => ({ ...old, lead: data.lead }));
  }

  async function moveLeadToArchive(id, status = "Gearchiveerd") {
    const label = status === "Afgerond" ? "afgerond archiveren" : "naar het archief verplaatsen";
    if (!window.confirm(`Lead ${label}?`)) return;
    const data = await apiPost({ action: "updateLead", id, status });
    if (!data?.lead) return;
    if (selected?.id === id) {
      setSelected(data.lead);
      if (detail) setDetail((old) => ({ ...old, lead: data.lead }));
    }
    await Promise.all([loadLeads(), loadArchive(), loadReport()]);
    setView("archive");
  }

  async function restoreLeadFromArchive(id) {
    const data = await apiPost({ action: "updateLead", id, status: "In behandeling" });
    if (!data?.lead) return;
    await Promise.all([loadLeads(), loadArchive(), loadReport()]);
  }

  async function updateProposalStatus(id, status) {
    const data = await apiPost({ action: "updateProposalStatus", id, status });
    if (!data?.proposal) return;
    await Promise.all([loadProposals(), loadArchive(), selected?.id ? loadLeadDetail(selected.id) : Promise.resolve(), loadReport()]);
  }

  async function createTask() {
    if (!taskForm.title.trim()) return setError("Vul een taakomschrijving in.");
    const data = await apiPost({
      action: "createTask",
      lead_id: selected?.id,
      lead_naam: selected?.naam,
      ...taskForm,
    });
    if (!data?.task) return;
    setTaskForm({ title: "", due_date: todayPlus(1), note: "" });
    await Promise.all([loadTasks(), selected?.id ? loadLeadDetail(selected.id) : null, loadReport()]);
  }

  async function updateTask(id, updates) {
    const data = await apiPost({ action: "updateTask", id, ...updates });
    if (!data?.task) return;
    await Promise.all([loadTasks(), selected?.id ? loadLeadDetail(selected.id) : null, loadReport()]);
  }

  async function createProposal() {
    if (!selected) return setError("Selecteer eerst een lead.");
    const property_address = `${selected.postcode || ""} ${selected.huisnummer || ""}`.trim();
    const data = await apiPost({
      action: "createProposal",
      lead_id: selected.id,
      lead_naam: selected.naam,
      lead_email: selected.email,
      lead_telefoon: selected.telefoon,
      property_address,
      ...proposalForm,
    });
    if (!data?.proposal) return;
    await updateLead(selected.id, { status: "Voorstel opgesteld" });
    await Promise.all([loadProposals(), loadLeadDetail(selected.id), loadReport()]);
    setProposalForm(emptyProposal());
    setView("proposals");
  }


  async function runAutomation() {
    setSaving(true);
    setError("");
    const result = await apiPost({ action: "runAutomation", limit: 300 });
    setSaving(false);
    if (result?.ok) {
      await Promise.all([loadLeads(), loadReport(), loadTasks({ status: taskFilter })]);
      alert(`Automatisering uitgevoerd voor ${result.processed || 0} lead(s).`);
    }
  }

  async function sendProposalEmail(id) {
    if (!window.confirm("Verkoopvoorstel per e-mail verzenden?")) return;
    const data = await apiPost({ action: "sendProposalEmail", id });
    if (!data) return;
    if (data.skipped) {
      setError("E-mail is niet verzonden. Controleer RESEND_API_KEY en FROM_EMAIL in Vercel.");
    }
    await Promise.all([loadProposals(), selected?.id ? loadLeadDetail(selected.id) : null, loadReport()]);
  }

  // Bewust alleen bij mount: loadAll() is een gewone functie die bij elke
  // render opnieuw wordt aangemaakt en zou dit effect anders bij elke render
  // laten herhalen.
  useEffect(() => {
    async function boot() {
      const data = await apiGet("report");
      if (data) {
        setLoggedIn(true);
        setReport(data);
        await loadAll();
      }
      setChecking(false);
    }
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loadTasks is een gewone functie (idem als hierboven); loggedIn staat
  // bewust niet in de deps — bij het inloggen ververst boot() de taken al
  // via loadAll(), dus dit effect hoeft alleen te reageren op taskFilter.
  useEffect(() => {
    if (loggedIn) loadTasks({ status: taskFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskFilter]);

  // loadArchive is een gewone functie; view en loggedIn (de echte triggers)
  // staan wel in de deps.
  useEffect(() => {
    if (loggedIn && view === "archive") loadArchive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, loggedIn]);

  if (checking) {
    return <main className="admin-shell"><section className="login-card"><Image src="/logo.png" alt="Vastgoed Direct Nederland" width={1774} height={887} priority /><p>Dashboard laden...</p></section></main>;
  }

  if (!loggedIn) {
    return (
      <main className="admin-shell login-bg">
        <section className="login-card">
          <Image src="/logo.png" alt="Vastgoed Direct Nederland" width={1774} height={887} priority />
          <span className="eyebrow">Intern platform</span>
          <h1>Vastgoed Direct Nederland</h1>
          <p>Log in voor leads, opvolging, verkoopvoorstellen en rapportage.</p>
          <form onSubmit={login}>
            <input type="password" placeholder="Admin wachtwoord" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button>Inloggen</button>
          </form>
          {error ? <div className="error">{error}</div> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <Image src="/logo.png" alt="Vastgoed Direct Nederland" width={1774} height={887} />
        <nav>
          {[
            ["dashboard", "Overzicht"],
            ["leads", "Leads"],
            ["tasks", "Taken"],
            ["proposals", "Voorstellen"],
            ["archive", "Archief"],
            ["reports", "Rapportage"],
          ].map(([key, label]) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>{label}</button>
          ))}
        </nav>
        <button className="logout" onClick={logout}>Uitloggen</button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Lead management</span>
            <h1>{view === "dashboard" ? "Dashboard" : view === "leads" ? "Leads" : view === "tasks" ? "Taken & reminders" : view === "proposals" ? "Verkoopvoorstellen" : view === "archive" ? "Archief" : "Rapportage"}</h1>
          </div>
          <div className="topbar-actions">
            <input
              className="global-search"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Zoek klant, telefoon, postcode…"
              onKeyDown={async (event) => {
                if (event.key !== "Enter") return;
                setSearch(globalSearch);
                setView("leads");
                await loadLeads({ search: globalSearch });
              }}
              aria-label="Globaal zoeken in leads"
            />
            <a className="add-lead" href="/admin/nieuwe-lead">+ Klant toevoegen</a>
            <button className="automation-btn" disabled={saving} onClick={runAutomation}>Automatisering uitvoeren</button>
            <a className="export" href={`/api/admin/export?status=${encodeURIComponent(statusFilter)}&search=${encodeURIComponent(search)}`}>CSV export</a>
          </div>
        </header>

        {error ? <div className="error floating">{error}<button onClick={() => setError("")}>×</button></div> : null}

        <section className="kpi-grid">
          <Kpi label="Actieve leads" value={report.kpis?.total_leads} hint="Niet gearchiveerd" />
          <Kpi label="Laatste 30 dagen" value={report.kpis?.leads_30d} hint="Nieuwe aanvragen" />
          <Kpi label="Nieuwe aanvragen" value={report.kpis?.new_leads} hint="Nog opvolgen" />
          <Kpi label="Kansrijke leads" value={report.kpis?.high_priority_leads} hint="Automatische score hoog" />
          <Kpi label="Vandaag opvolgen" value={report.kpis?.followups_due} hint="Volgens opvolgdatum" />
          <Kpi label="Voorstellen bekeken" value={report.kpis?.proposal_viewed_leads} hint="Warme opvolging" />
          <Kpi label="Open taken" value={report.kpis?.open_tasks} hint="Actieve reminders" />
          <Kpi label="Archief leads" value={report.kpis?.archived_leads} hint="Afgerond of afgewezen" />
          <Kpi label="Archief voorstellen" value={report.kpis?.archived_proposals} hint="Niet actief" />
        </section>

        {view === "dashboard" ? (
          <section className="dashboard-grid">
            <article className="panel action-center wide">
              <div className="panel-head"><div><span className="eyebrow">Vandaag</span><h2>Actiecentrum</h2></div><button onClick={() => setView("tasks")}>Alle taken</button></div>
              <p className="panel-intro">De warmste leads en acties die nu aandacht vragen, automatisch op prioriteit gesorteerd.</p>
              <div className="action-list">
                {actionLeads.map((lead) => (
                  <button key={lead.id} onClick={() => { setView("leads"); loadLeadDetail(lead.id); }}>
                    <div><strong>{lead.naam || "Naam onbekend"}</strong><span>{lead.postcode || "-"} {lead.huisnummer || ""} · {displayStatus(lead.status)}</span></div>
                    <em>{lead._reason}</em>
                    <b>Open →</b>
                  </button>
                ))}
                {!actionLeads.length ? <p className="empty-state">Geen urgente acties. Alles is bijgewerkt.</p> : null}
              </div>
            </article>
            <article className="panel wide">
              <div className="panel-head"><h2>Nieuwste leads</h2><button onClick={() => setView("leads")}>Alle leads</button></div>
              <div className="lead-table compact">
                {leads.slice(0, 8).map((lead) => (
                  <button key={lead.id} onClick={() => { setView("leads"); loadLeadDetail(lead.id); }}>
                    <strong>{lead.naam || "Naam onbekend"}</strong>
                    <span>{lead.postcode || "-"} {lead.huisnummer || ""}</span>
                    <em className={statusClass(lead.status)}>{displayStatus(lead.status)}</em>
                    <small>{fmt(lead.created_at)}</small>
                  </button>
                ))}
              </div>
            </article>

            <article className="panel">
              <h2>Pipeline</h2>
              <div className="pipeline-summary">
                {(report.byStatus || []).map((row) => (
                  <div key={row.label}>
                    <span>{displayStatus(row.label)}</span>
                    <strong>{row.total}</strong>
                  </div>
                ))}
              </div>
            </article>
            <article className="panel"><h2>Leads per pagina</h2>{(report.byPage || []).slice(0, 8).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={maxPage} />)}</article>
            <article className="panel"><h2>Open taken</h2>{(report.recentTasks || []).map((task) => <div className="task-mini" key={task.id}><strong>{task.title}</strong><span>{task.lead_naam || "Algemeen"} · {task.due_date || "geen datum"}</span></div>)}</article>
          </section>
        ) : null}

        {view === "leads" ? (
          <>
          <section className="panel kanban-panel">
            <div className="panel-head"><div><span className="eyebrow">Pipeline</span><h2>Snelle pipeline</h2></div><span>{leads.length} actieve leads</span></div>
            <div className="kanban-board">
              {kanbanColumns.map(([label, statuses, targetStatus]) => {
                const items = leads.filter((lead) => statuses.includes(displayStatus(lead.status)));
                return (
                  <div
                    className="kanban-column"
                    key={label}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const id = event.dataTransfer.getData("text/lead-id");
                      if (id) updateLead(id, { status: targetStatus });
                    }}
                  >
                    <div className="kanban-title"><strong>{label}</strong><span>{items.length}</span></div>
                    {items.slice(0, 8).map((lead) => (
                      <button
                        key={lead.id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/lead-id", lead.id);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onClick={() => loadLeadDetail(lead.id)}
                        title="Sleep naar een andere kolom om de status te wijzigen"
                      >
                        <strong>{lead.naam || "Naam onbekend"}</strong>
                        <small>{lead.postcode || "-"} {lead.huisnummer || ""}</small>
                        {lead.last_proposal_viewed_at ? <em>🔥 {lead.proposal_view_count || 1}× bekeken</em> : null}
                        {lead.next_follow_up_at ? <small>Opvolging: {lead.next_follow_up_at}</small> : null}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
          <section className="lead-layout">
            <div className="panel lead-list-panel">
              <div className="filters">
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Zoek naam, telefoon, e-mail, postcode, pagina of bron" onKeyDown={(event) => { if (event.key === "Enter") loadLeads(); }} />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option>Alle</option>
                  {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
                <button onClick={() => loadLeads()}>Zoeken</button>
              </div>
              <div className="lead-table">
                {leads.map((lead) => (
                  <button key={lead.id} className={selected?.id === lead.id ? "selected" : ""} onClick={() => loadLeadDetail(lead.id)}>
                    <strong>{lead.naam || "Naam onbekend"}</strong>
                    <span>{lead.telefoon || "-"}</span>
                    <span>{lead.postcode || "-"} {lead.huisnummer || ""}</span>
                    <em className={statusClass(lead.status)}>{displayStatus(lead.status)}</em>
                    <small>{fmt(lead.created_at)}</small>
                  </button>
                ))}
              </div>
            </div>

            <aside className="panel detail-panel">
              {!selected ? <p>Selecteer een lead voor de detailweergave.</p> : (
                <>
                  <div className="detail-title">
                    <div><span className="eyebrow">Lead detail</span><h2>{selected.naam || "Naam onbekend"}</h2><p>{selected.postcode || "-"} {selected.huisnummer || ""}</p></div>
                    <a href={`/admin/leads/${selected.id}`}>Open detailpagina</a>
                  </div>

                  <div className="info-grid">
                    <Info label="Telefoon" value={selected.telefoon} />
                    <Info label="E-mail" value={selected.email} />
                    <Info label="Pagina" value={selected.pagina} />
                    <Info label="Bron" value={selected.bron} />
                    <Info label="Kansrijkheid" value={selected.lead_priority ? `${selected.lead_priority} (${selected.lead_score || 0}/12)` : "-"} />
                    <Info label="Volgende opvolging" value={selected.next_follow_up_at || "-"} />
                    <Info label="Woningtype" value={selected.woningtype} />
                    <Info label="Reden" value={selected.reden} />
                    <Info label="Automatisering" value={selected.automation_note} />
                  </div>
                  <SourceDetails lead={selected} />

                  <div className="quick-actions">
                    {selected.telefoon ? <a href={`tel:${cleanPhone(selected.telefoon)}`}>Bellen</a> : null}
                    {selected.telefoon ? <a className="green" href={whatsappUrl(selected.telefoon, selected.naam)} target="_blank">WhatsApp</a> : null}
                    {selected.email ? <a href={`mailto:${selected.email}`}>Mailen</a> : null}
                    <button onClick={() => updateLead(selected.id, { last_contact_at: new Date().toISOString(), status: ["Nieuw", "Nieuwe aanvraag"].includes(selected.status) ? "In behandeling" : selected.status })}>Contact gehad</button>
                    <button className="secondary" onClick={() => moveLeadToArchive(selected.id, "Afgerond")}>Afgerond archiveren</button>
                    <button className="muted-btn" onClick={() => moveLeadToArchive(selected.id, "Gearchiveerd")}>Naar archief</button>
                  </div>

                  <label className="field">Status<select value={selectStatusValue(selected.status)} onChange={(event) => updateLead(selected.id, { status: event.target.value })}>{LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
                  <div className="pipeline-panel"><strong>Pipeline</strong><PipelineButtons value={selected.status} onChange={(status) => updateLead(selected.id, { status })} /></div>
                  <label className="field">Handmatige opvolging<input type="date" value={selected.manual_follow_up_at || ""} onChange={(event) => updateLead(selected.id, { next_follow_up_at: event.target.value })} /><small>Handmatig ingesteld krijgt voorrang op de automatische datum.</small></label>
                  <label className="field">Notitie<textarea value={selected.notitie || ""} onChange={(event) => setSelected({ ...selected, notitie: event.target.value })} onBlur={(event) => updateLead(selected.id, { notitie: event.target.value })} placeholder="Interne notitie, bijzonderheden, afspraken..." /></label>

                  <div className="split">
                    <article className="sub-panel"><h3>Nieuwe taak</h3><input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="Bijv. klant nabellen" /><input type="date" value={taskForm.due_date} onChange={(event) => setTaskForm({ ...taskForm, due_date: event.target.value })} /><textarea value={taskForm.note} onChange={(event) => setTaskForm({ ...taskForm, note: event.target.value })} placeholder="Toelichting" /><button disabled={saving} onClick={createTask}>Taak opslaan</button></article>
                    <article className="sub-panel"><h3>Voorstel maken</h3><input value={proposalForm.amount_text} onChange={(event) => setProposalForm({ ...proposalForm, amount_text: event.target.value })} placeholder="Voorgesteld bedrag" /><input type="date" value={proposalForm.validity_date} onChange={(event) => setProposalForm({ ...proposalForm, validity_date: event.target.value })} /><input value={proposalForm.transfer_date_text} onChange={(event) => setProposalForm({ ...proposalForm, transfer_date_text: event.target.value })} placeholder="Oplevering" /><textarea value={proposalForm.conditions_text} onChange={(event) => setProposalForm({ ...proposalForm, conditions_text: event.target.value })} /><button disabled={saving} onClick={createProposal}>Voorstel genereren</button></article>
                  </div>

                  <div className="history-grid">
                    <article><h3>Taken</h3>{(detail?.tasks || []).map((task) => <div className="history-item" key={task.id}><strong>{task.title}</strong><span>{task.status} · {task.due_date || "geen datum"}</span></div>)}</article>
                    <article><h3>Mailhistorie</h3>{(detail?.mailLogs || []).map((mail) => <div className="history-item" key={mail.id}><strong>{mail.type}</strong><span>{mail.status} · {mail.recipient}</span><small>{fmt(mail.created_at)}</small></div>)}</article>
                  </div>
                </>
              )}
            </aside>
          </section>
          </>
        ) : null}

        {view === "tasks" ? (
          <section className="panel">
            <div className="panel-head"><h2>Taken & reminders</h2><select value={taskFilter} onChange={(event) => setTaskFilter(event.target.value)}><option>Alle</option>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
            <div className="task-list">
              {tasks.map((task) => (
                <article key={task.id} className={task.status === "Afgerond" ? "done" : ""}>
                  <div><strong>{task.title}</strong><span>{task.lead_naam || "Algemeen"} · deadline: {task.due_date || "geen datum"}</span>{task.note ? <p>{task.note}</p> : null}</div>
                  <select value={task.status || "Open"} onChange={(event) => updateTask(task.id, { status: event.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {view === "proposals" ? (
          <section className="panel">
            <div className="panel-head"><h2>Verkoopvoorstellen</h2><span>{proposals.length} voorstel(len)</span></div>
            <div className="proposal-list">
              {proposals.map((proposal) => (
                <article key={proposal.id}>
                  <div><strong>{proposal.lead_naam || "Naam onbekend"}</strong><span>{proposal.property_address || "Geen adres"} · {proposal.amount_text || "Geen bedrag"}</span><small>{proposal.status} · aangemaakt {fmt(proposal.created_at)}{proposal.public_view_count ? ` · ${proposal.public_view_count}× bekeken` : ""}{proposal.interest_status ? ` · reactie: ${proposal.interest_status}` : ""}</small></div>
                  <div className="row-actions"><a href={`/admin/voorstellen/${proposal.id}`}>Beheren</a><a href={`/admin/voorstellen/${proposal.id}/print`} target="_blank">Print/PDF</a>{proposal.lead_email ? <button onClick={() => sendProposalEmail(proposal.id)}>Mail voorstel</button> : null}<button className="secondary" onClick={() => updateProposalStatus(proposal.id, "Gearchiveerd")}>Archiveren</button></div>
                </article>
              ))}
            </div>
          </section>
        ) : null}


        {view === "archive" ? (
          <section className="archive-grid">
            <article className="panel">
              <div className="panel-head"><h2>Afgeronde en gearchiveerde leads</h2><span>{archivedLeads.length} lead(s)</span></div>
              <p className="panel-intro">Hier staan leads met status Akkoord, Afgewezen / vervallen, Afgerond of Gearchiveerd. Zo blijft de actieve leadlijst overzichtelijk.</p>
              <div className="archive-list">
                {archivedLeads.map((lead) => (
                  <article key={lead.id}>
                    <div>
                      <strong>{lead.naam || "Naam onbekend"}</strong>
                      <span>{lead.postcode || "-"} {lead.huisnummer || ""} · {lead.telefoon || "geen telefoon"}</span>
                      <small>{lead.status || "Gearchiveerd"} · aanvraag {fmt(lead.created_at)}</small>
                    </div>
                    <div className="row-actions">
                      <button onClick={() => { setView("leads"); loadLeadDetail(lead.id); }}>Openen</button>
                      <button className="secondary" onClick={() => restoreLeadFromArchive(lead.id)}>Terug actief</button>
                    </div>
                  </article>
                ))}
                {!archivedLeads.length ? <p className="empty-state">Nog geen leads in het archief.</p> : null}
              </div>
            </article>

            <article className="panel">
              <div className="panel-head"><h2>Gearchiveerde voorstellen</h2><span>{archivedProposals.length} voorstel(len)</span></div>
              <p className="panel-intro">Hier kun je voorstellen bewaren die zijn afgerond, afgewezen, verlopen of niet meer actief opgevolgd hoeven te worden.</p>
              <div className="archive-list">
                {archivedProposals.map((proposal) => (
                  <article key={proposal.id}>
                    <div>
                      <strong>{proposal.lead_naam || "Naam onbekend"}</strong>
                      <span>{proposal.property_address || "Geen adres"} · {proposal.amount_text || "Geen bedrag"}</span>
                      <small>{proposal.status || "Gearchiveerd"} · aangemaakt {fmt(proposal.created_at)}</small>
                    </div>
                    <div className="row-actions">
                      <a href={`/admin/voorstellen/${proposal.id}`}>Beheren</a><a href={`/admin/voorstellen/${proposal.id}/print`} target="_blank">Print/PDF</a>
                      <button className="secondary" onClick={() => updateProposalStatus(proposal.id, "Concept")}>Terug actief</button>
                    </div>
                  </article>
                ))}
                {!archivedProposals.length ? <p className="empty-state">Nog geen voorstellen in het archief.</p> : null}
              </div>
            </article>
          </section>
        ) : null}

        {view === "reports" ? (
          <section className="dashboard-grid">

            <article className="panel">
              <h2>Pipeline</h2>
              <div className="pipeline-summary">
                {(report.byStatus || []).map((row) => (
                  <div key={row.label}>
                    <span>{displayStatus(row.label)}</span>
                    <strong>{row.total}</strong>
                  </div>
                ))}
              </div>
            </article>
            <article className="panel"><h2>Leads per pagina</h2>{(report.byPage || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={maxPage} />)}</article>
            <article className="panel"><h2>Leads per bron</h2>{(report.bySource || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={maxSource} />)}</article>
            <article className="panel"><h2>Statusverdeling</h2>{(report.byStatus || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={Math.max(1, report.kpis?.total_leads || 1)} />)}</article>
            <article className="panel"><h2>Per maand</h2>{(report.byMonth || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={Math.max(1, ...(report.byMonth || []).map((r) => Number(r.total) || 0))} />)}</article>
          </section>
        ) : null}
      </section>
    </main>
  );
}
