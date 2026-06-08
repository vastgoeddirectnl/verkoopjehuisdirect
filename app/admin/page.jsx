import Link from "next/link";
import { isAdminAuthenticated } from "../lib/adminAuth";
import { redirect } from "next/navigation";
import { query } from "../lib/neonDb";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function getDashboardData() {
  const [leadsResult, statsResult, tasksResult, pageResult, sourceResult] = await Promise.all([
    query("select * from leads order by created_at desc limit 100"),
    query(`
      select
        count(*)::int as total,
        count(*) filter (where created_at >= now() - interval '30 days')::int as last_30_days,
        count(*) filter (where status = 'Nieuw')::int as nieuw,
        count(*) filter (where status = 'Voorstel verzonden')::int as voorstel_verzonden
      from leads
    `),
    query(`
      select * from tasks
      where status is distinct from 'Afgerond'
      order by due_date asc nulls last, created_at desc
      limit 8
    `),
    query(`
      select coalesce(nullif(pagina, ''), '/') as pagina, count(*)::int as totaal
      from leads
      group by 1
      order by totaal desc, pagina asc
      limit 8
    `),
    query(`
      select coalesce(nullif(bron, ''), 'onbekend') as bron, count(*)::int as totaal
      from leads
      group by 1
      order by totaal desc, bron asc
      limit 8
    `),
  ]);

  return {
    leads: leadsResult.rows || [],
    stats: statsResult.rows?.[0] || {},
    tasks: tasksResult.rows || [],
    pages: pageResult.rows || [],
    sources: sourceResult.rows || [],
  };
}

export default async function AdminPage({ searchParams }) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const search = String(params?.search || "").trim().toLowerCase();
  const status = String(params?.status || "Alle");

  const data = await getDashboardData();

  const filteredLeads = data.leads.filter((lead) => {
    const matchesStatus = status === "Alle" || lead.status === status;
    const haystack = [
      lead.naam,
      lead.email,
      lead.telefoon,
      lead.postcode,
      lead.huisnummer,
      lead.pagina,
      lead.bron,
      lead.status,
    ].filter(Boolean).join(" ").toLowerCase();

    const matchesSearch = !search || haystack.includes(search);
    return matchesStatus && matchesSearch;
  });

  const statuses = ["Alle", "Nieuw", "Contact opgenomen", "In beoordeling", "Voorstel verzonden", "Akkoord", "Afgewezen"];

  return (
    <main className="admin-page">
      <style>{styles}</style>

      <header className="topbar">
        <div>
          <span className="eyebrow">Vastgoed Direct Nederland</span>
          <h1>Admin dashboard</h1>
          <p>Beheer aanvragen, telefonische leads, taken, voorstellen en opvolging.</p>
        </div>
        <div className="top-actions">
          <Link className="primary-action" href="/admin/nieuwe-lead">+ Nieuwe klant invoeren</Link>
          <Link className="secondary-action" href="/api/admin/export">CSV export</Link>
          <Link className="secondary-action" href="/admin/logout">Uitloggen</Link>
        </div>
      </header>

      <section className="quick-create">
        <div>
          <strong>Telefonische aanvraag of WhatsApp-contact?</strong>
          <span>Voer de klant direct handmatig in en maak daarna vanuit de lead een taak of verkoopvoorstel.</span>
        </div>
        <Link href="/admin/nieuwe-lead">Klant handmatig invoeren</Link>
      </section>

      <section className="stats-grid">
        <article><span>Totaal leads</span><strong>{data.stats.total || 0}</strong></article>
        <article><span>Laatste 30 dagen</span><strong>{data.stats.last_30_days || 0}</strong></article>
        <article><span>Nieuw</span><strong>{data.stats.nieuw || 0}</strong></article>
        <article><span>Voorstel verzonden</span><strong>{data.stats.voorstel_verzonden || 0}</strong></article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Leads</h2>
            <p>Zoek, filter en open een lead voor detail, taken en voorstellen.</p>
          </div>
          <Link className="primary-action small" href="/admin/nieuwe-lead">+ Nieuwe klant</Link>
        </div>

        <form className="filters">
          <input name="search" defaultValue={search} placeholder="Zoeken op naam, telefoon, e-mail, postcode, pagina of bron" />
          <select name="status" defaultValue={status}>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="submit">Filteren</button>
          <Link href="/admin">Reset</Link>
        </form>

        <div className="table">
          <div className="row head">
            <span>Datum</span>
            <span>Klant</span>
            <span>Woning</span>
            <span>Status</span>
            <span>Bron</span>
            <span></span>
          </div>

          {filteredLeads.map((lead) => (
            <div className="row" key={lead.id}>
              <span>{formatDate(lead.created_at)}</span>
              <span>
                <strong>{lead.naam || "Onbekend"}</strong>
                <small>{lead.telefoon || lead.email || "-"}</small>
              </span>
              <span>{[lead.postcode, lead.huisnummer].filter(Boolean).join(" ") || "-"}</span>
              <span><em>{lead.status || "Nieuw"}</em></span>
              <span>{lead.bron || "onbekend"}</span>
              <span><Link href={`/admin/leads/${lead.id}`}>Open</Link></span>
            </div>
          ))}

          {!filteredLeads.length ? (
            <div className="empty">Geen leads gevonden met deze filters.</div>
          ) : null}
        </div>
      </section>

      <section className="bottom-grid">
        <article className="panel">
          <h2>Open taken</h2>
          {data.tasks.map((task) => (
            <div className="mini-item" key={task.id}>
              <strong>{task.title}</strong>
              <span>{task.lead_naam || "Geen naam"} · {task.due_date || "geen datum"}</span>
            </div>
          ))}
          {!data.tasks.length ? <p>Geen open taken.</p> : null}
        </article>

        <article className="panel">
          <h2>Leads per pagina</h2>
          {data.pages.map((item) => (
            <div className="mini-item" key={item.pagina}>
              <strong>{item.pagina}</strong>
              <span>{item.totaal} leads</span>
            </div>
          ))}
        </article>

        <article className="panel">
          <h2>Leads per bron</h2>
          {data.sources.map((item) => (
            <div className="mini-item" key={item.bron}>
              <strong>{item.bron}</strong>
              <span>{item.totaal} leads</span>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--orange:#ff6a00;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--shadow:0 22px 70px rgba(7,31,58,.12)}body{margin:0;background:radial-gradient(circle at top right,#fff3e7,transparent 34%),var(--bg);font-family:Inter,Arial,Helvetica,sans-serif;color:var(--navy)}.admin-page{max-width:1280px;margin:0 auto;padding:28px}.topbar{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:18px}.eyebrow{display:inline-block;background:#fff3e7;border:1px solid #ffd5b6;color:#a64200;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}h1{font-size:46px;line-height:1;margin:14px 0 10px;letter-spacing:-.055em}h2{font-size:26px;margin:0 0 8px;letter-spacing:-.035em}p{color:var(--muted);line-height:1.55}.top-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.primary-action,.secondary-action,.quick-create a,.filters button,.filters a,.row a{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:13px 17px;text-decoration:none;font-weight:900;border:0;cursor:pointer}.primary-action,.quick-create a,.filters button{background:var(--orange);color:#fff}.secondary-action,.filters a{background:#fff;color:var(--navy);border:1px solid var(--line)}.primary-action.small{padding:10px 14px}.quick-create,.panel,.stats-grid article{background:var(--card);border:1px solid var(--line);border-radius:28px;box-shadow:var(--shadow)}.quick-create{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 22px;margin-bottom:18px}.quick-create strong,.quick-create span{display:block}.quick-create span{color:var(--muted);margin-top:4px}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:18px}.stats-grid article{padding:22px}.stats-grid span{display:block;color:var(--muted);font-size:13px}.stats-grid strong{display:block;font-size:38px;margin-top:8px;letter-spacing:-.04em}.panel{padding:22px;margin-bottom:18px}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.filters{display:grid;grid-template-columns:1fr 220px auto auto;gap:10px;margin:18px 0}.filters input,.filters select{border:1px solid var(--line);border-radius:16px;padding:13px 14px;font:inherit;background:#fff}.table{border:1px solid var(--line);border-radius:20px;overflow:hidden;background:#fff}.row{display:grid;grid-template-columns:170px 1.3fr 1fr 170px 150px 90px;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line)}.row:last-child{border-bottom:0}.row.head{background:var(--navy);color:#fff;font-weight:900}.row strong,.row small{display:block}.row small{color:var(--muted);margin-top:4px}.row em{font-style:normal;background:#fff3e7;color:#a64200;border:1px solid #ffd5b6;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:900}.row a{background:var(--navy);color:#fff;padding:9px 12px}.empty{padding:18px;color:var(--muted)}.bottom-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.mini-item{border-bottom:1px solid var(--line);padding:12px 0}.mini-item:last-child{border-bottom:0}.mini-item strong,.mini-item span{display:block}.mini-item span{color:var(--muted);margin-top:4px;font-size:14px}@media(max-width:1100px){.stats-grid,.bottom-grid{grid-template-columns:repeat(2,1fr)}.row{grid-template-columns:1fr 1fr}.row.head{display:none}.filters{grid-template-columns:1fr 1fr}.topbar{display:grid}.top-actions{justify-content:flex-start}}@media(max-width:720px){.admin-page{padding:16px}h1{font-size:36px}.stats-grid,.bottom-grid,.filters{grid-template-columns:1fr}.quick-create{display:grid}.row{grid-template-columns:1fr;padding:16px}.panel-head{display:grid}}
`;
