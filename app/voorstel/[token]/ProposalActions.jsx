"use client";

import { useState } from "react";

export default function ProposalActions({ token, phone = "31612238051", isActive = true, previewMode = false, validityText = "" }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function send(action) {
    if (previewMode) return;

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

  if (!isActive && !previewMode) {
    return (
      <div id="voorstel-actie" className="proposal-action-success proposal-action-inactive" role="status">
        <strong>Online akkoord geven of reageren is voor dit voorstel niet beschikbaar.</strong>
        <span>Het voorstel is mogelijk nog niet verzonden, verlopen of niet meer actief. Neem contact met ons op om de actuele mogelijkheden te bespreken.</span>
      </div>
    );
  }

  if (["interested", "discuss", "question"].includes(state)) {
    return (
      <div id="voorstel-actie" className="proposal-action-success" role="status">
        <strong>Dank u — uw reactie is ontvangen.</strong>
        <span>Dit is nog geen definitief akkoord of getekende koopovereenkomst. Wij nemen contact met u op om de vervolgstappen en voorwaarden te bespreken.</span>
      </div>
    );
  }

  return (
    <section id="voorstel-actie" className="proposal-actions" aria-label="Akkoord geven of reageren op voorstel">
      <div>
        <span className="proposal-actions-kicker">Akkoord of bespreken</span>
        <h2>Wilt u verder met dit voorstel?</h2>
        <p>Geef aan dat u akkoord bent met dit voorstel of dat u het eerst wilt bespreken. U zit nog nergens definitief aan vast.</p>
        {validityText ? <p className="proposal-action-note">{validityText}</p> : null}
        {previewMode ? <p className="proposal-action-preview-note">Admin-preview: zo ziet de klant de akkoordknoppen. De knoppen zijn in preview uitgeschakeld.</p> : null}
      </div>
      <div className="proposal-action-buttons">
        <button disabled={state === "sending" || previewMode} onClick={() => send("interested")} className="proposal-primary">
          Akkoord met voorstel
        </button>
        <button disabled={state === "sending" || previewMode} onClick={() => send("discuss")} className="proposal-secondary">
          Eerst bespreken
        </button>
        <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hallo, ik heb een vraag over mijn verkoopvoorstel.")}`} target="_blank" rel="noopener noreferrer">
          Vraag via WhatsApp
        </a>
      </div>
      <p className="proposal-action-note">Met “Akkoord met voorstel” geeft u aan dat u de vervolgstap wilt zetten. De definitieve afspraken worden daarna schriftelijk uitgewerkt in de koopovereenkomst.</p>
      {state === "error" ? <p className="proposal-action-error">{errorMessage || "Dit lukte niet. Neem telefonisch of via WhatsApp contact met ons op."}</p> : null}
    </section>
  );
}
