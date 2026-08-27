import { formatDateTimeNL } from "../../lib/date";

const EVENT_LABELS = {
  view: "Voorstel bekeken",
  interested: "Klant wil verder met voorstel",
  discuss: "Klant wil voorstel bespreken",
  question: "Klant stelde een vraag",
  whatsapp: "WhatsApp vanuit voorstel geopend",
  admin_whatsapp_prepared: "WhatsApp voorstelbericht voorbereid",
  admin_whatsapp_sent: "WhatsApp voorstelbericht verzonden gemarkeerd",
  print: "Voorstel geprint / PDF geopend",
  pdf: "Voorstel als PDF geopend",
  legacy_interest: "Historische voorstelreactie",
};

function eventDescription(event) {
  const label = EVENT_LABELS[event.event_type] || event.event_type || "Voorstelactiviteit";
  const prefix = ["interested", "discuss", "question"].includes(event.event_type) ? "Actie nodig: " : "";
  const suffix = event.message ? ` — ${event.message}` : "";
  return `${prefix}${label}${suffix}`;
}

function buildItems({ lead, tasks = [], proposals = [], mailLogs = [], proposalEvents = [] }) {
  const items = [];

  if (lead?.created_at) {
    items.push({
      id: `lead-created-${lead.id}`,
      at: lead.created_at,
      kind: "lead",
      title: "Aanvraag ontvangen",
      detail: [lead.postcode, lead.huisnummer, lead.woningtype].filter(Boolean).join(" · "),
    });
  }

  if (lead?.last_contact_at) {
    items.push({
      id: `last-contact-${lead.id}`,
      at: lead.last_contact_at,
      kind: "contact",
      title: "Contact geregistreerd",
      detail: "Laatste contactmoment volgens de lead.",
    });
  }

  for (const proposal of proposals) {
    items.push({
      id: `proposal-${proposal.id}`,
      at: proposal.created_at,
      kind: "proposal",
      title: `Voorstel v${proposal.version_number || 1} aangemaakt`,
      detail: [proposal.amount_text, proposal.property_address, proposal.status].filter(Boolean).join(" · "),
    });
    if (proposal.emailed_at) {
      items.push({
        id: `proposal-mail-${proposal.id}`,
        at: proposal.emailed_at,
        kind: "mail",
        title: `Voorstel v${proposal.version_number || 1} verzonden`,
        detail: proposal.sent_to_email || proposal.lead_email || "",
      });
    }
  }

  for (const event of proposalEvents) {
    items.push({
      id: `event-${event.id}`,
      at: event.created_at,
      kind: ["interested", "discuss", "question"].includes(event.event_type) ? "hot" : "event",
      title: eventDescription(event),
      detail: [event.amount_text, event.property_address].filter(Boolean).join(" · "),
    });
  }

  for (const task of tasks) {
    items.push({
      id: `task-${task.id}`,
      at: task.updated_at || task.created_at,
      kind: task.status === "Afgerond" ? "done" : "task",
      title: task.status === "Afgerond" ? `Taak afgerond: ${task.title}` : `Taak: ${task.title}`,
      detail: [task.due_date ? `Datum ${task.due_date}` : "", task.note].filter(Boolean).join(" · "),
    });
  }

  for (const mail of mailLogs) {
    if (mail.proposal_id && String(mail.type || "").toLowerCase().includes("voorstel")) continue;
    items.push({
      id: `mail-${mail.id}`,
      at: mail.created_at,
      kind: "mail",
      title: `${mail.type || "E-mail"}: ${mail.status || "Onbekend"}`,
      detail: [mail.recipient, mail.subject].filter(Boolean).join(" · "),
    });
  }

  return items
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export default function LeadTimeline(props) {
  const items = buildItems(props).slice(0, 40);

  return (
    <section className="lead-timeline" aria-label="Lead tijdlijn">
      <div className="timeline-head">
        <div>
          <span>Chronologisch overzicht</span>
          <h2>Tijdlijn</h2>
        </div>
        <strong>{items.length} recente gebeurtenissen</strong>
      </div>

      <div className="timeline-list">
        {items.map((item) => (
          <article key={item.id} className={`timeline-item kind-${item.kind}`}>
            <div className="timeline-dot" aria-hidden="true" />
            <div>
              <time>{formatDateTimeNL(item.at)}</time>
              <strong>{item.title}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
            </div>
          </article>
        ))}
        {!items.length ? <p className="timeline-empty">Nog geen gebeurtenissen beschikbaar.</p> : null}
      </div>

      <style jsx>{`
        .lead-timeline{background:#fffdf9;border:1px solid #e8e3db;border-radius:26px;padding:22px;box-shadow:0 12px 42px rgba(7,31,58,.07)}
        .timeline-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px}
        .timeline-head span{display:block;color:#b85216;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}
        .timeline-head h2{margin:5px 0 0;font-size:26px;color:#071f3a}
        .timeline-head>strong{font-size:12px;color:#617184;background:#f7f4ee;border-radius:999px;padding:8px 10px}
        .timeline-list{display:grid}
        .timeline-item{position:relative;display:grid;grid-template-columns:18px 1fr;gap:12px;padding:0 0 18px}
        .timeline-item:not(:last-child):before{content:"";position:absolute;left:6px;top:14px;bottom:0;width:2px;background:#e8e3db}
        .timeline-dot{width:14px;height:14px;border-radius:999px;background:#8ca1b8;border:3px solid #edf2f7;margin-top:4px;z-index:1}
        .kind-hot{background:#fff7ef;border-radius:18px;padding:12px 12px 18px}.kind-hot .timeline-dot{background:#d96a1c;border-color:#fff1e6}
        .kind-contact .timeline-dot{background:#3e8f5e;border-color:#eaf7ef}
        .kind-mail .timeline-dot{background:#326aa5;border-color:#edf4fb}
        .kind-done .timeline-dot{background:#789181;border-color:#edf5ef}
        .timeline-item time{display:block;color:#7a8797;font-size:12px;margin-bottom:3px}
        .timeline-item strong{display:block;color:#071f3a;font-size:15px}
        .timeline-item p{margin:4px 0 0;color:#617184;font-size:13px;line-height:1.5}
        .timeline-empty{margin:0;color:#617184}
        @media(max-width:700px){.timeline-head{display:grid}.timeline-head>strong{justify-self:start}}
      `}</style>
    </section>
  );
}
