"use client";

import { useEffect, useMemo, useState } from "react";

const STATUSES = [
  "Nieuw",
  "Contact opgenomen",
  "In beoordeling",
  "Voorstel verzonden",
  "Akkoord",
  "Afgewezen",
];

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function cleanPhone(phone) {
  if (!phone) return "";
  return phone.replace(/[^\d+]/g, "");
}

function whatsappUrl(phone, name) {
  const cleaned = cleanPhone(phone).replace(/^0/, "31");
  const text = encodeURIComponent(
    `Hallo ${name || ""}, bedankt voor uw aanvraag bij Vastgoed Direct Nederland. Ik neem graag contact met u op over uw woning.`
  );

  return `https://wa.me/${cleaned}?text=${text}`;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [dataError, setDataError] = useState("");

  const stats = useMemo(() => {
    return {
      total: leads.length,
      nieuw: leads.filter((lead) => (lead.status || "Nieuw") === "Nieuw").length,
      voorstel: leads.filter((lead) => lead.status === "Voorstel verzonden").length,
      akkoord: leads.filter((lead) => lead.status === "Akkoord").length,
    };
  }, [leads]);

  async function login(e) {
    e.preventDefault();
    setLoginError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setLoginError(result.error || "Inloggen mislukt.");
      return;
    }

    setLoggedIn(true);
    setPassword("");
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setLeads([]);
    setSelectedLead(null);
  }

  async function loadLeads() {
    setLoading(true);
    setDataError("");

    const params = new URLSearchParams();

    if (statusFilter !== "Alle") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());

    const response = await fetch(`/api/admin/leads?${params.toString()}`);

    if (response.status === 401) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setDataError(result.error || "Leads ophalen mislukt.");
      setLoading(false);
      return;
    }

    setLeads(result.leads || []);
    setLoading(false);
  }

  async function updateLead(id, updates) {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(result.error || "Opslaan mislukt.");
      return;
    }

    const updatedLead = result.lead;

    setLeads((current) =>
      current.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );

    setSelectedLead(updatedLead);
  }

  useEffect(() => {
    if (loggedIn) {
      loadLeads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <style jsx global>{styles}</style>

        <section className="login-card">
          <div className="brand">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          </div>

          <h1>Lead dashboard</h1>
          <p>
            Log in om woningaanvragen, bron, pagina en opvolging te bekijken.
          </p>

          <form onSubmit={login} className="login-form">
            <input
              type="password"
              placeholder="Admin wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Inloggen</button>
          </form>

          {loginError ? <div className="error">{loginError}</div> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page dashboard">
      <style jsx global>{styles}</style>

      <header className="admin-header">
        <div className="brand-row">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <h1>Lead dashboard</h1>
            <p>Nieuwe aanvragen en opvolging</p>
          </div>
        </div>

        <button className="ghost" onClick={logout}>Uitloggen</button>
      </header>

      <section className="stats-grid">
        <div className="stat">
          <span>Totaal</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat">
          <span>Nieuw</span>
          <strong>{stats.nieuw}</strong>
        </div>
        <div className="stat">
          <span>Voorstel verzonden</span>
          <strong>{stats.voorstel}</strong>
        </div>
        <div className="stat">
          <span>Akkoord</span>
          <strong>{stats.akkoord}</strong>
        </div>
      </section>

      <section className="toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek op naam, telefoon, postcode, bron of pagina"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>Alle</option>
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <button onClick={loadLeads}>
          {loading ? "Laden..." : "Vernieuwen"}
        </button>
      </section>

      {dataError ? <div className="error">{dataError}</div> : null}

      <section className="content-grid">
        <div className="lead-list">
          {leads.length === 0 ? (
            <div className="empty">Geen leads gevonden.</div>
          ) : (
            leads.map((lead) => (
              <button
                key={lead.id}
                className={`lead-card ${
                  selectedLead?.id === lead.id ? "active" : ""
                }`}
                onClick={() => setSelectedLead(lead)}
              >
                <div>
                  <strong>{lead.naam || "Naam onbekend"}</strong>
                  <span>{lead.telefoon || "Geen telefoonnummer"}</span>
                </div>

                <div>
                  <span>{lead.postcode || "-"} {lead.huisnummer || ""}</span>
                  <small>{formatDate(lead.created_at)}</small>
                </div>

                <em>{lead.status || "Nieuw"}</em>
              </button>
            ))
          )}
        </div>

        <aside className="lead-detail">
          {!selectedLead ? (
            <div className="empty">Selecteer een lead om details te bekijken.</div>
          ) : (
            <>
              <div className="detail-head">
                <div>
                  <h2>{selectedLead.naam || "Naam onbekend"}</h2>
                  <p>{selectedLead.postcode || "-"} {selectedLead.huisnummer || ""}</p>
                </div>

                <span className="pill">{selectedLead.status || "Nieuw"}</span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Telefoon</span>
                  <strong>{selectedLead.telefoon || "-"}</strong>
                </div>
                <div>
                  <span>E-mail</span>
                  <strong>{selectedLead.email || "-"}</strong>
                </div>
                <div>
                  <span>Woningtype</span>
                  <strong>{selectedLead.woningtype || "-"}</strong>
                </div>
                <div>
                  <span>Reden</span>
                  <strong>{selectedLead.reden || "-"}</strong>
                </div>
                <div>
                  <span>Pagina</span>
                  <strong>{selectedLead.pagina || "-"}</strong>
                </div>
                <div>
                  <span>Bron</span>
                  <strong>{selectedLead.bron || "-"}</strong>
                </div>
                <div>
                  <span>Aangemaakt</span>
                  <strong>{formatDate(selectedLead.created_at)}</strong>
                </div>
                <div>
                  <span>Laatst contact</span>
                  <strong>{formatDate(selectedLead.last_contact_at)}</strong>
                </div>
              </div>

              <div className="actions">
                {selectedLead.telefoon ? (
                  <>
                    <a href={`tel:${cleanPhone(selectedLead.telefoon)}`}>
                      Bellen
                    </a>
                    <a
                      href={whatsappUrl(selectedLead.telefoon, selectedLead.naam)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </>
                ) : null}

                {selectedLead.email ? (
                  <a href={`mailto:${selectedLead.email}`}>Mailen</a>
                ) : null}
              </div>

              <label className="field-label">
                Status
                <select
                  value={selectedLead.status || "Nieuw"}
                  onChange={(e) =>
                    updateLead(selectedLead.id, { status: e.target.value })
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="field-label">
                Notitie
                <textarea
                  value={selectedLead.notitie || ""}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, notitie: e.target.value })
                  }
                  onBlur={(e) =>
                    updateLead(selectedLead.id, { notitie: e.target.value })
                  }
                  placeholder="Bijvoorbeeld: terugbellen, voorstel voorbereiden, bijzonderheden woning..."
                />
              </label>

              <button
                className="save-contact"
                onClick={() =>
                  updateLead(selectedLead.id, {
                    last_contact_at: new Date().toISOString(),
                  })
                }
              >
                Markeer als contact gehad
              </button>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #f7f5f0;
    color: #0a2540;
  }

  .admin-page {
    min-height: 100vh;
    padding: 28px;
  }

  .login-card {
    width: min(460px, 100%);
    margin: 8vh auto;
    background: #fff;
    border: 1px solid #e6e2db;
    border-radius: 28px;
    padding: 34px;
    box-shadow: 0 22px 60px rgba(10, 37, 64, .12);
  }

  .brand {
    display: flex;
    justify-content: center;
    margin-bottom: 22px;
  }

  .brand img,
  .brand-row img {
    width: 220px;
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }

  .login-card h1,
  .admin-header h1 {
    margin: 0;
    letter-spacing: -1px;
  }

  .login-card p,
  .admin-header p {
    color: #647386;
    line-height: 1.55;
  }

  .login-form {
    display: grid;
    gap: 12px;
    margin-top: 24px;
  }

  input,
  select,
  textarea {
    width: 100%;
    border: 1px solid #d9d5ce;
    border-radius: 16px;
    padding: 14px 16px;
    font-size: 15px;
    outline: none;
    background: #fff;
  }

  textarea {
    min-height: 130px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #0a2540;
  }

  button,
  .actions a {
    border: none;
    border-radius: 999px;
    background: #ff6a00;
    color: #fff;
    font-weight: 900;
    padding: 14px 18px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
  }

  .ghost {
    background: #0a2540;
  }

  .error {
    margin-top: 14px;
    background: #fff2e8;
    border: 1px solid #ffd5b8;
    color: #9a3412;
    padding: 12px 14px;
    border-radius: 14px;
    font-weight: 800;
  }

  .admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background: #fff;
    border: 1px solid #e6e2db;
    border-radius: 26px;
    padding: 20px 24px;
    box-shadow: 0 16px 40px rgba(10, 37, 64, .08);
  }

  .brand-row {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  .brand-row img {
    width: 190px;
    background: #fff;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin: 22px 0;
  }

  .stat {
    background: #fff;
    border: 1px solid #e6e2db;
    border-radius: 22px;
    padding: 22px;
  }

  .stat span {
    display: block;
    color: #647386;
    font-weight: 800;
  }

  .stat strong {
    display: block;
    margin-top: 6px;
    font-size: 34px;
  }

  .toolbar {
    display: grid;
    grid-template-columns: 1fr 230px 150px;
    gap: 12px;
    margin-bottom: 18px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: minmax(340px, .85fr) minmax(420px, 1.15fr);
    gap: 18px;
    align-items: start;
  }

  .lead-list,
  .lead-detail {
    background: #fff;
    border: 1px solid #e6e2db;
    border-radius: 26px;
    padding: 18px;
    box-shadow: 0 16px 40px rgba(10, 37, 64, .08);
  }

  .lead-list {
    display: grid;
    gap: 12px;
    max-height: calc(100vh - 250px);
    overflow: auto;
  }

  .lead-card {
    display: grid;
    gap: 8px;
    width: 100%;
    background: #f7f5f0;
    color: #0a2540;
    border: 1px solid #e6e2db;
    border-radius: 18px;
    padding: 16px;
    text-align: left;
  }

  .lead-card.active {
    border-color: #ff6a00;
    box-shadow: 0 0 0 3px rgba(255, 106, 0, .14);
  }

  .lead-card div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .lead-card span,
  .lead-card small {
    color: #647386;
    font-style: normal;
  }

  .lead-card em,
  .pill {
    display: inline-flex;
    justify-self: start;
    background: #0a2540;
    color: #fff;
    border-radius: 999px;
    padding: 7px 11px;
    font-style: normal;
    font-size: 12px;
    font-weight: 900;
  }

  .detail-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: start;
    border-bottom: 1px solid #eee9e2;
    padding-bottom: 18px;
    margin-bottom: 18px;
  }

  .detail-head h2 {
    margin: 0 0 4px;
    font-size: 30px;
  }

  .detail-head p {
    margin: 0;
    color: #647386;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .detail-grid div {
    background: #f7f5f0;
    border-radius: 16px;
    padding: 14px;
    min-width: 0;
  }

  .detail-grid span {
    display: block;
    color: #647386;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .detail-grid strong {
    overflow-wrap: anywhere;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 18px 0;
  }

  .actions a:nth-child(2) {
    background: #25d366;
  }

  .field-label {
    display: grid;
    gap: 8px;
    margin-top: 16px;
    font-weight: 900;
  }

  .save-contact {
    width: 100%;
    background: #0a2540;
    margin-top: 16px;
  }

  .empty {
    color: #647386;
    padding: 24px;
    text-align: center;
  }

  @media (max-width: 900px) {
    .admin-page {
      padding: 14px;
    }

    .admin-header,
    .brand-row {
      align-items: flex-start;
      flex-direction: column;
    }

    .stats-grid,
    .toolbar,
    .content-grid,
    .detail-grid {
      grid-template-columns: 1fr;
    }

    .lead-list {
      max-height: none;
    }
  }
`;
