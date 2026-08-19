"use client";

import { useState } from "react";

export default function ProposalActions({ token, phone = "31612238051", isActive = true }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function send(action) {
    setState("sending");
    setErrorMessage("");
    const response = await fetch(`/api/proposal/${token}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, message }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setErrorMessage(data?.error || "Dit lukte niet. Neem telefonisch of via WhatsApp contact met ons op.");
      setState("error");
      return;
    }
    setState(action);
  }

  if (!isActive) {
    return (
      <div className="proposal-action-success proposal-action-inactive" role="status">
        <strong>Online reageren is voor dit voorstel niet beschikbaar.</strong>
        <span>Het voorstel is mogelijk nog niet verzonden, verlopen of niet meer actief. Neem contact met ons op om de actuele mogelijkheden te bespreken.</span>
      </div>
    );
  }

  if (["interested", "discuss", "question"].includes(state)) {
    return (
      <div className="proposal-action-success" role="status">
        <strong>Dank u — uw reactie is ontvangen.</strong>
        <span>Dit is nog geen definitief akkoord of getekende koopovereenkomst. Wij nemen contact met u op om de vervolgstappen en voorwaarden te bespreken.</span>
      </div>
    );
  }

  return (
    <section className="proposal-actions" aria-label="Reageren op voorstel">
      <div>
        <span className="proposal-actions-kicker">Wat wilt u doen?</span>
        <h2>Uw volgende stap</h2>
        <p>U zit nergens aan vast. Laat eenvoudig weten of u positief bent of het voorstel eerst wilt bespreken.</p>
      </div>
      <div className="proposal-action-buttons">
        <button disabled={state === "sending"} onClick={() => send("interested")} className="proposal-primary">
          Ik ben positief over dit voorstel
        </button>
        <button disabled={state === "sending"} onClick={() => send("discuss")} className="proposal-secondary">
          Ik wil dit voorstel bespreken
        </button>
        <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hallo, ik heb een vraag over mijn verkoopvoorstel.")}`} target="_blank" rel="noopener noreferrer">
          Vraag stellen via WhatsApp
        </a>
      </div>
      {state === "error" ? <p className="proposal-action-error">{errorMessage || "Dit lukte niet. Neem telefonisch of via WhatsApp contact met ons op."}</p> : null}
    </section>
  );
}
