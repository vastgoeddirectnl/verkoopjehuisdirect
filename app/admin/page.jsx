"use client";

import { useEffect, useMemo, useState } from "react";
import { addDaysAmsterdam, formatDateTimeNL, todayAmsterdam } from "../lib/date";

const STATUSES = [
  "Nieuwe aanvraag",
  "In behandeling",
  "Eerste bod gedaan",
  "Beoordeling gepland",
  "Voorstel opgesteld",
  "Voorstel verzonden",
  "Voorstel bekeken",
  "In onderhandeling",
  "Akkoord",
  "Afgewezen / vervallen",
  "Afgerond",
  "Gearchiveerd",
];
const LEGACY_STATUS_LABELS = {
  "Nieuw": "Nieuwe aanvraag",
  "Contact opgenomen": "In behandeling",
  "In beoordeling": "Beoordeling gepland",
  "Afgewezen": "Afgewezen / vervallen",
};
const ARCHIVE_STATUSES = ["Akkoord", "Afgewezen", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];
const TASK_STATUSES = ["Open", "In behandeling", "Afgerond"];

function todayPlus(days) { return addDaysAmsterdam(days); }

function fmt(value) { return formatDateTimeNL(value); }


function displayStatus(status) {
  return LEGACY_STATUS_LABELS[status] || status || "Nieuwe aanvraag";
}

function selectStatusValue(status) {
  const label = displayStatus(status);
  return STATUSES.includes(label) ? label : "Nieuwe aanvraag";
}

function statusClass(status) {
  return `status-${displayStatus(status).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function PipelineButtons({ value, onChange }) {
  const active = displayStatus(value);
  return (
    <div className="pipeline-buttons" aria-label="Pipeline status">
      {STATUSES.filter((status) => !["Afgerond", "Gearchiveerd"].includes(status)).map((status) => (
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

function parseLeadSourceDetails(lead) {
  const bron = String(lead?.bron || "");
  const pagina = String(lead?.pagina || "");
  const params = {};

  bron.split("|").map((part) => part.trim()).forEach((part) => {
    const index = part.indexOf("=");
    if (index > 0) {
      params[part.slice(0, index).trim()] = part.slice(index + 1).trim();
    }
  });

  const pageParts = pagina.split(" · ");
  const pagePath = pageParts[0] || pagina;
  const pageTitle = pageParts.slice(1).join(" · ");

  return {
    pagePath,
    pageTitle,
    source: params.utm_source || params.source || (bron === "direct" ? "direct" : ""),
    medium: params.utm_medium || "",
    campaign: params.utm_campaign || "",
    term: params.utm_term || "",
    content: params.utm_content || "",
    clickId: params.gclid || params.gbraid || params.wbraid || "",
    referrer: params.referrer || "",
  };
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

        const interestStatus = String(lead.interest_status || "").trim().toLowerCase();
        const lastContactMs = lead.last_contact_at ? new Date(lead.last_contact_at).getTime() : NaN;
        const lastInterestMs = lead.last_interest_at ? new Date(lead.last_interest_at).getTime() : NaN;
        const customerActionHandled = Number.isFinite(lastContactMs) && Number.isFinite(lastInterestMs) && lastContactMs >= lastInterestMs;

        if (!customerActionHandled && interestStatus === "positief" && interestAgeHours <= 24) {
          priority = 100;
          reason = "Klant gaf in de afgelopen 24 uur aan verder te willen";
        } else if (!customerActionHandled && interestStatus === "bespreken" && interestAgeHours <= 72) {
          priority = 98;
          reason = "Klant wil het voorstel bespreken — opvolgen";
        } else if (!customerActionHandled && interestStatus === "vraag" && interestAgeHours <= 72) {
          priority = 96;
          reason = "Klant heeft een vraag over het voorstel — opvolgen";
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
        } else if (lastActivityAgeHours > 72 && !ARCHIVE_STATUSES.includes(lead.status || "")) {
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
    const isArchived = ARCHIVE_STATUSES.includes(data.lead.status || "");
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
  }, []);

  useEffect(() => {
    if (loggedIn) loadTasks({ status: taskFilter });
  }, [taskFilter]);

  useEffect(() => {
    if (loggedIn && view === "archive") loadArchive();
  }, [view, loggedIn]);

  if (checking) {
    return <main className="admin-shell"><style>{styles}</style><section className="login-card"><img src="/logo.png" alt="Vastgoed Direct Nederland" /><p>Dashboard laden...</p></section></main>;
  }

  if (!loggedIn) {
    return (
      <main className="admin-shell login-bg">
        <style>{styles}</style>
        <section className="login-card">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
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
      <style>{styles}</style>
      <aside className="sidebar">
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
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
                  {STATUSES.map((status) => <option key={status}>{status}</option>)}
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

                  <label className="field">Status<select value={selectStatusValue(selected.status)} onChange={(event) => updateLead(selected.id, { status: event.target.value })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
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

const styles = `.action-center{grid-column:1/-1}.action-list{display:grid;gap:10px}.action-list>button{width:100%;border:1px solid var(--line);background:#fff;border-radius:18px;padding:14px 16px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:14px;text-align:left;color:var(--navy);cursor:pointer}.action-list>button:hover{border-color:#e57a25;box-shadow:0 8px 24px rgba(217,106,28,.1)}.action-list div{display:grid;gap:3px}.action-list span{font-size:13px;color:var(--muted)}.action-list em{font-style:normal;background:#fff1e6;color:#a94612;border-radius:999px;padding:7px 10px;font-size:12px;font-weight:900}.action-list b{font-size:13px}.kanban-panel{margin-bottom:18px}.kanban-board{display:grid;grid-template-columns:repeat(6,minmax(190px,1fr));gap:12px;overflow-x:auto;padding-bottom:4px}.kanban-column{background:#f7f4ee;transition:.16s ease;border:1px solid var(--line);border-radius:20px;padding:10px;min-height:120px}.kanban-title{display:flex;justify-content:space-between;align-items:center;padding:4px 4px 9px}.kanban-title span{background:#fff;border:1px solid var(--line);border-radius:999px;padding:3px 8px;font-size:12px}.kanban-column>button{display:grid;gap:4px;width:100%;border:1px solid var(--line);background:#fff;border-radius:14px;padding:11px;margin-bottom:8px;text-align:left;color:var(--navy);cursor:pointer}.kanban-column>button[draggable="true"]{cursor:grab}.kanban-column>button[draggable="true"]:active{cursor:grabbing;opacity:.72}.kanban-column small{color:var(--muted)}.kanban-column em{font-style:normal;color:#b85216;font-size:11px;font-weight:900}@media(max-width:900px){.action-list>button{grid-template-columns:1fr}.action-list em{justify-self:start}.kanban-board{grid-template-columns:repeat(6,230px)}}

:root{--navy:#071f3a;--navy2:#0d3159;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--orange:#D96A1C;--green:#3E8F5E;--shadow:0 22px 70px rgba(7,31,58,.12)}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--navy);font-family:Inter,Arial,Helvetica,sans-serif}.admin-shell{min-height:100vh;background:radial-gradient(circle at top right,#FFF1E6,transparent 38%),var(--bg);display:flex}.login-bg{align-items:center;justify-content:center}.login-card{width:min(460px,calc(100% - 32px));background:rgba(255,253,249,.92);border:1px solid rgba(232,227,219,.9);border-radius:32px;padding:34px;box-shadow:var(--shadow);backdrop-filter:blur(10px)}.login-card img{width:220px;max-width:100%;margin-bottom:24px}.login-card h1,.topbar h1{margin:4px 0 8px;font-size:38px;letter-spacing:-.04em}.login-card p{color:var(--muted);line-height:1.55}.login-card form{display:grid;gap:12px;margin-top:24px}.login-card input,.filters input,.filters select,.field select,.field input,.field textarea,.sub-panel input,.sub-panel textarea,.panel-head select{width:100%;border:1px solid var(--line);border-radius:16px;padding:14px 16px;font:inherit;background:#fff}.login-card button,.filters button,.sub-panel button,.quick-actions a,.quick-actions button,.export,.automation-btn,.panel-head button,.row-actions a,.row-actions button{border:0;border-radius:999px;background:var(--orange);color:white;text-decoration:none;padding:13px 18px;font-weight:900;cursor:pointer}.eyebrow{display:inline-flex;align-items:center;border:1px solid #F2B885;background:#FFF1E6;color:#B85216;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.sidebar{width:286px;background:#061b32;color:#fff;padding:28px;display:flex;flex-direction:column;gap:28px;position:sticky;top:0;height:100vh}.sidebar img{width:205px;background:#fff;border-radius:18px;padding:12px}.sidebar nav{display:grid;gap:10px}.sidebar button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;border-radius:16px;padding:14px 16px;text-align:left;font-weight:850;cursor:pointer}.sidebar button.active,.sidebar button:hover{background:#fff;color:var(--navy)}.sidebar .logout{margin-top:auto;background:rgba(217,106,28,.14);border-color:rgba(217,106,28,.45)}.workspace{flex:1;padding:34px;min-width:0}.topbar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}.topbar-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.global-search{min-width:240px;border:1px solid var(--line);background:#fff;border-radius:999px;padding:12px 15px;font:inherit;color:var(--navy)}.export{background:var(--navy)}.automation-btn{background:#fff;color:var(--navy);border:1px solid var(--line);box-shadow:none}.automation-btn:disabled{opacity:.65;cursor:not-allowed}.add-lead{border:0;border-radius:999px;background:var(--orange);color:#fff;text-decoration:none;padding:13px 18px;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}.kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:22px}.kpi-card,.panel,.detail-panel{background:var(--card);border:1px solid var(--line);border-radius:26px;box-shadow:0 12px 42px rgba(7,31,58,.08)}.kpi-card{padding:22px}.kpi-card span,.info-card span,.bar-row span,.proposal-list small,.task-list span,.history-item span,.history-item small{color:var(--muted);font-size:13px}.kpi-card strong{display:block;font-size:34px;letter-spacing:-.04em;margin:8px 0}.dashboard-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:18px}.panel{padding:22px}.panel.wide{grid-row:span 2}.panel-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:16px}.panel h2,.detail-panel h2{margin:0 0 14px;font-size:24px;letter-spacing:-.03em}.lead-layout{display:grid;grid-template-columns:minmax(420px,.9fr) minmax(520px,1.1fr);gap:18px;align-items:start}.filters{display:grid;grid-template-columns:1fr 170px auto;gap:10px;margin-bottom:16px}.lead-table{display:grid;gap:9px;max-height:72vh;overflow:auto;padding-right:4px}.lead-table button{border:1px solid var(--line);background:#fff;border-radius:18px;padding:14px;display:grid;grid-template-columns:1.2fr .85fr .8fr .7fr .85fr;gap:10px;align-items:center;text-align:left;color:var(--navy);cursor:pointer}.lead-table.compact button{grid-template-columns:1.2fr .8fr .7fr .8fr}.lead-table button.selected,.lead-table button:hover{border-color:#E57A25;box-shadow:0 10px 26px rgba(217,106,28,.12)}.lead-table em{font-style:normal;background:#eef4ff;border-radius:999px;padding:6px 10px;text-align:center;font-weight:850;color:#164575}.detail-panel{padding:24px;position:sticky;top:24px}.detail-title{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:20px}.detail-title h2{font-size:32px;margin:6px 0 4px}.detail-title a{color:var(--orange);font-weight:900}.info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.info-card{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.source-detail-box{margin:18px 0;background:#fff;border:1px solid var(--line);border-radius:22px;padding:16px}.source-detail-box h3{margin:0 0 12px;font-size:18px}.info-card strong{display:block;margin-top:6px;word-break:break-word}.quick-actions{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}.quick-actions a,.quick-actions button{background:var(--navy)}.quick-actions a.green{background:var(--green)}.quick-actions button.secondary,.row-actions button.secondary{background:#e9f1fb;color:var(--navy)}.quick-actions button.muted-btn{background:#f2eee7;color:var(--navy);border:1px solid var(--line)}.field{display:grid;gap:8px;font-weight:900;margin:12px 0}.field textarea{min-height:110px;resize:vertical}.split,.history-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.sub-panel{background:#f8f5ef;border:1px solid var(--line);border-radius:22px;padding:16px;display:grid;gap:10px}.sub-panel h3,.history-grid h3{margin:0 0 4px}.sub-panel textarea{min-height:86px;resize:vertical}.history-grid article{background:#fff;border:1px solid var(--line);border-radius:20px;padding:14px}.history-item,.task-mini{border-bottom:1px solid var(--line);padding:10px 0}.history-item:last-child,.task-mini:last-child{border-bottom:0}.history-item strong,.history-item span,.history-item small,.task-mini strong,.task-mini span{display:block}.task-list,.proposal-list,.archive-list{display:grid;gap:12px}.task-list article,.proposal-list article,.archive-list article{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px;display:flex;align-items:center;justify-content:space-between;gap:18px}.task-list article.done{opacity:.62}.task-list p{margin:6px 0 0;color:var(--muted)}.proposal-list strong,.task-list strong,.archive-list strong{display:block;font-size:17px}.proposal-list span,.archive-list span{display:block;color:var(--muted);margin:6px 0}.archive-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.panel-intro{color:var(--muted);line-height:1.55;margin:-4px 0 18px}.empty-state{color:var(--muted);background:#fff;border:1px dashed var(--line);border-radius:18px;padding:16px}.row-actions{display:flex;gap:8px;white-space:nowrap;flex-wrap:wrap}.row-actions a{background:var(--navy)}.bar-row{display:grid;gap:8px;margin:14px 0}.bar-row div{display:flex;justify-content:space-between;gap:16px}.bar-row em{height:10px;background:#eee8df;border-radius:999px;overflow:hidden}.bar-row i{display:block;height:100%;background:linear-gradient(90deg,var(--orange),#E57A25);border-radius:999px}.pipeline-panel{background:#fff;border:1px solid var(--line);border-radius:20px;padding:14px;margin:12px 0}
.pipeline-panel>strong{display:block;margin-bottom:10px;color:var(--navy)}
.pipeline-buttons{display:flex;flex-wrap:wrap;gap:7px}
.pipeline-buttons button{border:1px solid var(--line);background:#fff;color:var(--navy);border-radius:999px;padding:9px 11px;font-size:12px;font-weight:900;cursor:pointer}
.pipeline-buttons button.active{background:var(--orange);color:#fff;border-color:var(--orange)}
.pipeline-summary{display:grid;gap:8px}
.pipeline-summary div{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--line);border-radius:15px;padding:10px 12px}
.pipeline-summary span{color:var(--muted);font-weight:850;font-size:13px}
.pipeline-summary strong{font-size:20px;color:var(--navy)}
em[class^="status-"]{background:#eef4ff;color:#164575}
.status-akkoord{background:#eaf7ef!important;color:#23643f!important}.status-afgewezen-vervallen,.status-afgewezen{background:#f8eeee!important;color:#8a2d2d!important}.status-voorstel-bekeken,.status-in-onderhandeling{background:#fff1e6!important;color:#b85216!important}.status-gearchiveerd,.status-afgerond{background:#f2eee7!important;color:#617184!important}
.error{background:#F8EEE9;color:#7C2D20;border:1px solid #E8C7BC;border-radius:16px;padding:12px 14px;margin-top:14px}.error.floating{margin:0 0 16px;display:flex;justify-content:space-between;gap:12px}.error button{border:0;background:transparent;font-size:20px;color:inherit;cursor:pointer}@media(max-width:1100px){.admin-shell{display:block}.sidebar{position:relative;width:auto;height:auto}.sidebar nav{grid-template-columns:repeat(3,1fr)}.kpi-grid{grid-template-columns:repeat(2,1fr)}.lead-layout,.dashboard-grid,.archive-grid{grid-template-columns:1fr}.detail-panel{position:relative;top:0}}@media(max-width:700px){.workspace{padding:18px}.filters,.split,.history-grid,.info-grid,.kpi-grid{grid-template-columns:1fr}.lead-table button{grid-template-columns:1fr}.topbar{display:grid}.topbar-actions{justify-content:flex-start}.add-lead,.export{width:auto}.sidebar nav{grid-template-columns:1fr}}
`;
