"use client";

// Taken op de lead-detailpagina (ARCH-05): het "Nieuwe taak"-kaartje
// (NewTaskCard) en de takenlijst (TaskPanel, default export — komt overeen
// met het id="taken"-anker in de snelnavigatie). De concepttaak (title/
// due_date/note) leefde voorheen als losse state in de pagina zelf, maar
// werd nergens anders gebruikt dan hier — die state staat nu lokaal in
// NewTaskCard.

import { useState } from "react";
import { TASK_STATUSES, todayPlus } from "../../lib/admin/leadDetail";

const CUSTOMER_ACTION_TASK_PATTERN = /voorstel bespreken|klant wil voorstel bespreken|akkoord op voorstel|klant geeft akkoord|klant heeft vraag/i;

export function NewTaskCard({ lead, saving, post }) {
  const [task, setTask] = useState({ title: "", due_date: todayPlus(1), note: "" });

  async function createTask() {
    await post({ action: "createTask", lead_id: lead.id, lead_naam: lead.naam, ...task });
    setTask({ title: "", due_date: todayPlus(1), note: "" });
  }

  return (
    <article className="card">
      <h2>Nieuwe taak</h2>
      <input placeholder="Bijv. klant nabellen" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
      <input type="date" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} />
      <textarea placeholder="Toelichting" value={task.note} onChange={(e) => setTask({ ...task, note: e.target.value })} />
      <button disabled={saving} onClick={createTask}>Taak opslaan</button>
    </article>
  );
}

export default function TaskPanel({ tasks, post }) {
  return (
    <article className="card" id="taken">
      <h2>Taken</h2>
      {(tasks || []).map((item) => {
        const isCustomerActionTask = CUSTOMER_ACTION_TASK_PATTERN.test(item.title || "");
        return (
          <div className={`item ${isCustomerActionTask && item.status !== "Afgerond" ? "customer-action-task" : ""}`} key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.status} · {item.due_date || "geen datum"}</span>
            {item.note ? <small>{item.note}</small> : null}
            <select value={item.status || "Open"} onChange={(e) => post({ action: "updateTask", id: item.id, status: e.target.value })}>
              {TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        );
      })}
    </article>
  );
}
