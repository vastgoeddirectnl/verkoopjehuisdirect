"use client";

// Mailhistorie-kaart op de lead-detailpagina (ARCH-05).

import { fmt } from "../../lib/admin/leadDetail";

export default function MailHistory({ mailLogs }) {
  return (
    <article className="card">
      <h2>Mailhistorie</h2>
      {(mailLogs || []).map((item) => (
        <div className="item" key={item.id}>
          <strong>{item.type}</strong>
          <span>{item.status} · {item.recipient}</span>
          <small>{fmt(item.created_at)}</small>
        </div>
      ))}
    </article>
  );
}
