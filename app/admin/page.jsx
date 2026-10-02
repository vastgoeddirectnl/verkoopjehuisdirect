"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { addDaysAmsterdam, normalizeDateOnly, todayAmsterdam } from "../lib/date";
import { LEAD_STATUSES, ARCHIVE_LEAD_STATUSES, displayStatus, selectStatusValue } from "../lib/leadStatus.js";
import { isLeadCustomerActionHandled, leadCustomerActionPriority } from "../lib/admin/customerActions.js";
import { cleanPhone, whatsappPhone, TASK_STATUSES } from "../lib/admin/leadDetail";
import {
  fmt,
  fmtDay,
  statusClass,
  Kpi,
  Info,
  Bar,
  PipelineButtons,
  ChannelPill,
  SourceDetails,
  addressKey,
} from "../components/admin/dashboard/DashboardParts";

function todayPlus(days) { return addDaysAmsterdam(days); }

function whatsappUrl(phone, name) {
  const text = `Hallo ${name || ""}, bedankt voor uw aanvraag bij Vastgoed Direct Nederland. Ik neem graag contact met u op over uw woning.`;
  return `https://wa.me/${whatsappPhone(phone)}?text=${encodeURIComponent(text)}`;
}

const VIEWS = [
  ["dashboard", "Overzicht"],
  ["leads", "Leads"],
  ["tasks", "Taken"],
  ["proposals", "Voorstellen"],
  ["archive", "Archief"],
  ["reports", "Rapportage"],
];

const VIEW_TITLES = {
  dashboard: "Vandaag",
  leads: "Leads",
  tasks: "Taken & reminders",
  proposals: "Verkoopvoorstellen",
  archive: "Archief",
  reports: "Rapportage",
};

const EMPTY_REPORT = { kpis: {}, byChannel: [], byPage: [], byStatus: [], byMonth: [], recentTasks: [], testLeads: 0, marketingTotal: 0 };

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState("dashboard");
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [archivedLeads, setArchivedLeads] = useState([]);
  const [archivedProposals, setArchivedProposals] = useState([]);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [statusFilter, setStatusFilter] = useState("Alle");
  // Standaard alleen open taken: afgeronde taken zijn historie, die staan op
  // de leaddetailpagina en in de tijdlijn.
  const [taskFilter, setTaskFilter] = useState("Open");
  const [search, setSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", due_date: todayPlus(1), note: "" });

  const maxPage = useMemo(() => Math.max(1, ...((report.byPage || []).map((r) => Number(r.total) || 0))), [report]);
  const maxChannel = useMemo(() => Math.max(1, ...((report.byChannel || []).map((r) => Number(r.total) || 0))), [report]);

  // Adressen die bij meer dan één actieve lead voorkomen.
  const duplicateAddresses = useMemo(() => {
    const counts = new Map();
    for (const lead of leads) {
      const key = addressKey(lead);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    }
    return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key));
  }, [leads]);

  const isDuplicate = (lead) => duplicateAddresses.has(addressKey(lead));

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
        const followUp = normalizeDateOnly(lead.next_follow_up_at);
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
        } else if (followUp && followUp <= today) {
          // Datums komen sinds DATA-01 als "YYYY-MM-DD" binnen; voorheen als
          // tijdstempel, waardoor een opvolging van vandaag hier werd gemist.
          priority = 70;
          const label = followUp === today ? "vandaag" : `over tijd sinds ${fmtDay(followUp)}`;
          reason = lead.manual_follow_up_at ? `Handmatige opvolging ${label}` : `Opvolging ${label}`;
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
      .slice(0, 12);
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
      body: JSON.stringify({ password, code: totpCode }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) return setError(json.error || "Inloggen mislukt.");
    setPassword("");
    setTotpCode("");
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
    if (data) setReport({ ...EMPTY_REPORT, ...data });
  }

  async function loadLeadDetail(id) {
    const data = await apiGet("lead", { id });
    if (!data) return;
    setSelected(data.lead);
    setDetail(data);
    setTaskForm({ title: "", due_date: todayPlus(1), note: "" });
  }

  async function loadAll() {
    const [leadData, taskData, proposalData, reportData] = await Promise.all([
      apiGet("leads", { limit: 300 }),
      apiGet("tasks", { status: taskFilter }),
      apiGet("proposals"),
      apiGet("report"),
    ]);
    if (leadData?.leads) setLeads(leadData.leads);
    if (taskData?.tasks) setTasks(taskData.tasks);
    if (proposalData?.proposals) setProposals(proposalData.proposals);
    if (reportData) setReport({ ...EMPTY_REPORT, ...reportData });
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
    if (!window.confirm(`Lead ${label}? Open automatische taken voor deze lead worden daarbij gesloten.`)) return;
    const data = await apiPost({ action: "updateLead", id, status });
    if (!data?.lead) return;
    if (selected?.id === id) {
      setSelected(data.lead);
      if (detail) setDetail((old) => ({ ...old, lead: data.lead }));
    }
    await Promise.all([loadLeads(), loadArchive(), loadReport(), loadTasks()]);
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

  async function runAutomation() {
    setSaving(true);
    setError("");
    const result = await apiPost({ action: "runAutomation", limit: 300 });
    setSaving(false);
    if (result?.ok) {
      await Promise.all([loadLeads(), loadReport(), loadTasks({ status: taskFilter })]);
      const closed = Object.values(result.closedTasks || {}).reduce((sum, count) => sum + count, 0);
      alert(`Automatisering uitgevoerd voor ${result.processed || 0} lead(s).${closed ? ` ${closed} afgehandelde taak/taken gesloten.` : ""}`);
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

  function openLead(id) {
    setView("leads");
    loadLeadDetail(id);
  }

  // Bewust alleen bij mount: loadAll() is een gewone functie die bij elke
  // render opnieuw wordt aangemaakt en zou dit effect anders bij elke render
  // laten herhalen.
  useEffect(() => {
    async function boot() {
      const data = await apiGet("report");
      if (data) {
        setLoggedIn(true);
        setReport({ ...EMPTY_REPORT, ...data });
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
    return <main className="admin-shell login-bg"><section className="login-card"><Image src="/brand/logo.png" alt="Vastgoed Direct Nederland" width={900} height={179} sizes="220px" priority /><p>Dashboard laden...</p></section></main>;
  }

  if (!loggedIn) {
    return (
      <main className="admin-shell login-bg">
        <section className="login-card">
          <Image src="/brand/logo.png" alt="Vastgoed Direct Nederland" width={900} height={179} sizes="220px" priority />
          <span className="eyebrow">Intern platform</span>
          <h1>Vastgoed Direct Nederland</h1>
          <p>Log in voor leads, opvolging, verkoopvoorstellen en rapportage.</p>
          <form onSubmit={login}>
            <input type="password" placeholder="Admin wachtwoord" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Verificatiecode (6 cijfers)"
              value={totpCode}
              onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              autoComplete="one-time-code"
              required
            />
            <button>Inloggen</button>
          </form>
          {error ? <div className="error">{error}</div> : null}
        </section>
      </main>
    );
  }

  const kpis = report.kpis || {};
  const selectedRelated = (detail?.relatedLeads || []).filter((item) => item.id !== selected?.id);

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <Image src="/brand/logo-light.png" alt="Vastgoed Direct Nederland" width={900} height={179} sizes="190px" />
        <nav>
          {VIEWS.map(([key, label]) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
              {label}
              {key === "dashboard" && actionLeads.length ? <span className="nav-count">{actionLeads.length}</span> : null}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={logout}>Uitloggen</button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Lead management</span>
            <h1>{VIEW_TITLES[view] || "Dashboard"}</h1>
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
            <button className="automation-btn" disabled={saving} onClick={runAutomation} title="Herberekent opvolgdatums en sluit afgehandelde taken. Draait ook elke ochtend automatisch.">Automatisering nu draaien</button>
            <a className="export" href={`/api/admin/export?status=${encodeURIComponent(statusFilter)}&search=${encodeURIComponent(search)}`}>CSV export</a>
          </div>
        </header>

        {error ? <div className="error floating">{error}<button onClick={() => setError("")}>×</button></div> : null}

        {view === "dashboard" ? (
          <>
            <section className="panel action-center">
              <div className="panel-head">
                <div><h2>Actiecentrum</h2><p className="panel-intro">De leads die nu aandacht vragen, op prioriteit gesorteerd.</p></div>
                <button onClick={() => setView("tasks")}>Alle taken</button>
              </div>
              <div className="action-list">
                {actionLeads.map((lead) => (
                  <button key={lead.id} onClick={() => openLead(lead.id)}>
                    <div><strong>{lead.naam || "Naam onbekend"}</strong><span>{lead.postcode || "-"} {lead.huisnummer || ""} · {displayStatus(lead.status)}</span></div>
                    <em>{lead._reason}</em>
                    <b>Open →</b>
                  </button>
                ))}
                {!actionLeads.length ? <p className="empty-state">Geen urgente acties. Alles is bijgewerkt.</p> : null}
              </div>
            </section>

            <section className="kpi-grid">
              <Kpi label="Vandaag opvolgen" value={kpis.followups_due} hint="Opvolgdatum vandaag of eerder" tone="accent" />
              <Kpi label="Voorstel bekeken" value={kpis.proposal_viewed_leads} hint="Warm: nabellen" />
              <Kpi label="Nieuwe aanvragen" value={kpis.new_leads} hint="Nog geen contact" />
              <Kpi label="Open taken" value={kpis.open_tasks} hint="Automatisch + handmatig" />
            </section>
            <p className="stat-line">
              {kpis.total_leads ?? 0} actieve leads · {kpis.leads_30d ?? 0} nieuw in 30 dagen · {kpis.high_priority_leads ?? 0} kansrijk · archief: {kpis.archived_leads ?? 0} leads, {kpis.archived_proposals ?? 0} voorstellen
            </p>

            <section className="dashboard-grid">
              <article className="panel wide">
                <div className="panel-head"><h2>Nieuwste leads</h2><button onClick={() => setView("leads")}>Alle leads</button></div>
                <div className="lead-table compact">
                  {leads.slice(0, 8).map((lead) => (
                    <button key={lead.id} onClick={() => openLead(lead.id)}>
                      <strong>{lead.naam || "Naam onbekend"}</strong>
                      <span>{lead.postcode || "-"} {lead.huisnummer || ""}{isDuplicate(lead) ? <i className="dup-badge" title="Er is nog een actieve aanvraag op dit adres">dubbel</i> : null}</span>
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
              <article className="panel">
                <h2>Leads per kanaal</h2>
                {(report.byChannel || []).slice(0, 6).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={maxChannel} suffix={row.won ? `${row.won} deal${row.won === 1 ? "" : "s"}` : ""} />)}
                <small className="panel-note">Laatste 12 maanden{report.testLeads ? `, ${report.testLeads} testaanvraag/-aanvragen niet meegeteld` : ""}.</small>
              </article>
            </section>
          </>
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
                        {lead.next_follow_up_at ? <small>Opvolging: {fmtDay(lead.next_follow_up_at)}</small> : null}
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
                    <span>{lead.postcode || "-"} {lead.huisnummer || ""}{isDuplicate(lead) ? <i className="dup-badge" title="Er is nog een actieve aanvraag op dit adres">dubbel</i> : null}</span>
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
                    <div><span className="eyebrow">Lead detail</span><h2>{selected.naam || "Naam onbekend"}</h2><p>{selected.postcode || "-"} {selected.huisnummer || ""} · <ChannelPill lead={selected} /></p></div>
                    <a href={`/admin/leads/${selected.id}`}>Open detailpagina</a>
                  </div>

                  {selectedRelated.length ? (
                    <div className="related-leads">
                      <strong>Er {selectedRelated.length === 1 ? "is nog een aanvraag" : `zijn nog ${selectedRelated.length} aanvragen`} op dit adres</strong>
                      {selectedRelated.map((item) => (
                        <button key={item.id} type="button" onClick={() => loadLeadDetail(item.id)}>{item.naam || "Naam onbekend"} · {displayStatus(item.status)} · {fmt(item.created_at)}</button>
                      ))}
                    </div>
                  ) : null}

                  <div className="info-grid">
                    <Info label="Telefoon" value={selected.telefoon} />
                    <Info label="E-mail" value={selected.email} />
                    <Info label="Kansrijkheid" value={selected.lead_priority ? `${selected.lead_priority} (${selected.lead_score || 0}/12)` : "-"} />
                    <Info label="Volgende opvolging" value={selected.next_follow_up_at ? fmtDay(selected.next_follow_up_at) : "-"} />
                    <Info label="Woningtype" value={selected.woningtype} />
                    <Info label="Reden" value={selected.reden} />
                  </div>
                  <SourceDetails lead={selected} />

                  <div className="quick-actions">
                    {selected.telefoon ? <a href={`tel:${cleanPhone(selected.telefoon)}`}>Bellen</a> : null}
                    {selected.telefoon ? <a className="green" href={whatsappUrl(selected.telefoon, selected.naam)} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
                    {selected.email ? <a href={`mailto:${selected.email}`}>Mailen</a> : null}
                    <button onClick={() => updateLead(selected.id, { last_contact_at: new Date().toISOString(), status: ["Nieuw", "Nieuwe aanvraag"].includes(selected.status) ? "In behandeling" : selected.status })}>Contact gehad</button>
                    <a className="primary" href={`/admin/leads/${selected.id}#voorstel-maken`}>Voorstel maken</a>
                    <button className="secondary" onClick={() => moveLeadToArchive(selected.id, "Afgerond")}>Afgerond archiveren</button>
                    <button className="muted-btn" onClick={() => moveLeadToArchive(selected.id, "Gearchiveerd")}>Naar archief</button>
                  </div>

                  <label className="field">Status<select value={selectStatusValue(selected.status)} onChange={(event) => updateLead(selected.id, { status: event.target.value })}>{LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
                  <div className="pipeline-panel"><strong>Pipeline</strong><PipelineButtons value={selected.status} onChange={(status) => updateLead(selected.id, { status })} /></div>
                  <label className="field">Handmatige opvolging<input type="date" value={normalizeDateOnly(selected.manual_follow_up_at) || ""} onChange={(event) => updateLead(selected.id, { next_follow_up_at: event.target.value })} /><small>Handmatig ingesteld krijgt voorrang op de automatische datum.</small></label>
                  <label className="field">Notitie<textarea value={selected.notitie || ""} onChange={(event) => setSelected({ ...selected, notitie: event.target.value })} onBlur={(event) => updateLead(selected.id, { notitie: event.target.value })} placeholder="Interne notitie, bijzonderheden, afspraken..." /></label>

                  <div className="split">
                    <article className="sub-panel"><h3>Nieuwe taak</h3><input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="Bijv. klant nabellen" /><input type="date" value={taskForm.due_date} onChange={(event) => setTaskForm({ ...taskForm, due_date: event.target.value })} /><textarea value={taskForm.note} onChange={(event) => setTaskForm({ ...taskForm, note: event.target.value })} placeholder="Toelichting" /><button disabled={saving} onClick={createTask}>Taak opslaan</button></article>
                    <article className="sub-panel"><h3>Voorstel</h3><p className="panel-intro">Voorstellen maakt u op de detailpagina, met het volledige formulier, de netto-vergelijking en de controles vóór verzending.</p><a className="sub-link" href={`/admin/leads/${selected.id}#voorstel-maken`}>Voorstel maken →</a></article>
                  </div>

                  <div className="history-grid">
                    <article><h3>Taken</h3>{(detail?.tasks || []).filter((task) => task.status !== "Afgerond").map((task) => <div className="history-item" key={task.id}><strong>{task.title}</strong><span>{task.status} · {fmtDay(task.due_date)}</span></div>)}{!(detail?.tasks || []).some((task) => task.status !== "Afgerond") ? <small>Geen open taken.</small> : null}</article>
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
            <p className="panel-intro">Automatische taken sluiten vanzelf zodra er contact is vastgelegd of de lead is gearchiveerd.</p>
            <div className="task-list">
              {tasks.map((task) => {
                const due = normalizeDateOnly(task.due_date);
                const overdue = task.status !== "Afgerond" && due && due < todayAmsterdam();
                return (
                  <article key={task.id} className={`${task.status === "Afgerond" ? "done" : ""} ${overdue ? "overdue" : ""}`}>
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.lead_id ? <a href={`/admin/leads/${task.lead_id}`}>{task.lead_naam || "Lead"}</a> : (task.lead_naam || "Algemeen")} · {overdue ? `over tijd sinds ${fmtDay(due)}` : `deadline ${fmtDay(due)}`}{task.automation_key ? " · automatisch" : ""}</span>
                      {task.note ? <p>{task.note}</p> : null}
                    </div>
                    <select value={task.status || "Open"} onChange={(event) => updateTask(task.id, { status: event.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
                  </article>
                );
              })}
              {!tasks.length ? <p className="empty-state">Geen taken in deze selectie.</p> : null}
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
                  <div className="row-actions"><a href={`/admin/voorstellen/${proposal.id}`}>Beheren</a><a className="ghost" href={`/admin/voorstellen/${proposal.id}/print`} target="_blank" rel="noopener noreferrer">Print/PDF</a>{proposal.lead_email ? <button onClick={() => sendProposalEmail(proposal.id)}>Mail voorstel</button> : null}<button className="secondary" onClick={() => updateProposalStatus(proposal.id, "Gearchiveerd")}>Archiveren</button></div>
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
                      <small>{lead.status || "Gearchiveerd"} · aanvraag {fmt(lead.created_at)} · <ChannelPill lead={lead} /></small>
                    </div>
                    <div className="row-actions">
                      <button onClick={() => openLead(lead.id)}>Openen</button>
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
                      <a href={`/admin/voorstellen/${proposal.id}`}>Beheren</a><a className="ghost" href={`/admin/voorstellen/${proposal.id}/print`} target="_blank" rel="noopener noreferrer">Print/PDF</a>
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
          <>
          <p className="stat-line">
            Kanalen, pagina&apos;s en maanden: alle aanvragen van de laatste 12 maanden ({report.marketingTotal || 0}), ook afgehandelde.
            {report.testLeads ? ` ${report.testLeads} testaanvraag/-aanvragen (Tag Assistant, previews) niet meegeteld.` : ""}
          </p>
          <section className="dashboard-grid">
            <article className="panel">
              <h2>Leads per kanaal</h2>
              {(report.byChannel || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={maxChannel} suffix={row.won ? `${row.won} deal${row.won === 1 ? "" : "s"}` : ""} />)}
            </article>
            <article className="panel"><h2>Leads per landingspagina</h2>{(report.byPage || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={maxPage} suffix={row.won ? `${row.won} deal${row.won === 1 ? "" : "s"}` : ""} />)}</article>
            <article className="panel">
              <h2>Pipeline (actief)</h2>
              <div className="pipeline-summary">
                {(report.byStatus || []).map((row) => (
                  <div key={row.label}>
                    <span>{displayStatus(row.label)}</span>
                    <strong>{row.total}</strong>
                  </div>
                ))}
              </div>
            </article>
            <article className="panel"><h2>Per maand</h2>{(report.byMonth || []).map((row) => <Bar key={row.label} label={row.label} value={row.total} max={Math.max(1, ...(report.byMonth || []).map((r) => Number(r.total) || 0))} suffix={row.won ? `${row.won} deal${row.won === 1 ? "" : "s"}` : ""} />)}</article>
          </section>
          </>
        ) : null}
      </section>
    </main>
  );
}
