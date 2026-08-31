"use client";

import { useRef, useState } from "react";

async function trackEvent(token, event) {
  try {
    await fetch(`/api/proposal/${token}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ event }),
    });
  } catch {
    // Eventtracking mag de klantactie niet blokkeren.
  }
}

export default function ProposalActions({
  token,
  amountText = "",
  phone = "31612238051",
  isActive = true,
  previewMode = false,
  validityText = "",
}) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const actionSectionRef = useRef(null);
  const discussTextareaRef = useRef(null);

  async function send(action) {
    if (previewMode) return;

    setState("sending");
    setErrorMessage("");
    try {
      const response = await fetch(`/api/proposal/${token}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, message }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorMessage(data?.error || "Dit lukte niet. Neem telefonisch of via WhatsApp contact met ons op.");
        setState("error");
        return;
      }
      setConfirming(false);
      setShowMessage(false);
      setState(action);
    } catch {
      setErrorMessage("Dit lukte niet. Neem telefonisch of via WhatsApp contact met ons op.");
      setState("error");
    }
  }

  function startInterested() {
    if (previewMode) return;
    setErrorMessage("");
    setConfirming(true);
  }

  function startDiscuss({ scrollToAction = false } = {}) {
    if (previewMode) return;
    setErrorMessage("");
    setShowMessage(true);

    if (scrollToAction) {
      window.setTimeout(() => {
        actionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      window.setTimeout(() => {
        discussTextareaRef.current?.focus();
      }, 450);
    }
  }

  function whatsappUrl() {
    return `https://wa.me/${phone}?text=${encodeURIComponent("Hallo, ik heb een vraag over mijn verkoopvoorstel.")}`;
  }

  if (!isActive && !previewMode) {
    return (
      <div id="voorstel-actie" className="proposal-action-success proposal-action-inactive" role="status">
        <strong>Online reageren is voor dit voorstel niet beschikbaar.</strong>
        <span>Het voorstel is mogelijk nog niet verzonden, verlopen of niet meer actief. Neem contact met ons op om de actuele mogelijkheden te bespreken.</span>
      </div>
    );
  }

  if (["interested", "discuss", "question"].includes(state)) {
    return (
      <div id="voorstel-actie" className="proposal-action-success" role="status">
        <strong>Dank u — uw reactie is ontvangen.</strong>
        <span>
          {state === "interested"
            ? "Wij nemen contact met u op om de vervolgstappen en voorwaarden uit te werken. Uw online bevestiging is nog geen getekende koopovereenkomst."
            : "Wij nemen contact met u op om uw vraag of het voorstel rustig door te spreken."}
        </span>
      </div>
    );
  }

  return (
    <>
      <section ref={actionSectionRef} id="voorstel-actie" className="proposal-actions-v32" aria-label="Akkoord geven of reageren op voorstel">
        <div className="proposal-actions-copy">
          <span className="proposal-actions-kicker">Uw volgende stap</span>
          <h2>Wilt u verder met dit voorstel?</h2>
          <p>U kunt aangeven dat u verder wilt, het voorstel eerst bespreken of direct een vraag stellen. De definitieve afspraken worden daarna schriftelijk uitgewerkt.</p>
          {validityText ? <p className="validity-note">{validityText}</p> : null}
          {previewMode ? <p className="preview-note">Admin-preview: klantacties zijn uitgeschakeld.</p> : null}
        </div>

        <div className="proposal-action-buttons-v32">
          <button disabled={state === "sending" || previewMode} onClick={startInterested} className="primary-action">
            Akkoord met voorstel
          </button>
          <button disabled={state === "sending" || previewMode} onClick={startDiscuss} className="secondary-action">
            Eerst bespreken
          </button>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(token, "whatsapp")}
          >
            Vraag via WhatsApp
          </a>
        </div>

        {showMessage ? (
          <div className="message-box">
            <label htmlFor="proposal-message">Wat wilt u bespreken? <span>(optioneel)</span></label>
            <textarea
              ref={discussTextareaRef}
              id="proposal-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={800}
              placeholder="Bijvoorbeeld een vraag over de overdrachtsdatum, voorwaarden of het bedrag."
            />
            <div>
              <button disabled={state === "sending"} onClick={() => send("discuss")}>
                {state === "sending" ? "Versturen..." : "Verzoek tot bespreken versturen"}
              </button>
              <button className="text-button" onClick={() => setShowMessage(false)}>Annuleren</button>
            </div>
          </div>
        ) : null}

        <p className="legal-note">Met “Akkoord met voorstel” geeft u aan dat u met dit voorstel verder wilt. Een koopovereenkomst komt pas tot stand nadat de definitieve afspraken schriftelijk zijn uitgewerkt en door de betrokken partijen zijn ondertekend.</p>
        {state === "error" ? <p className="action-error">{errorMessage}</p> : null}
      </section>

      {confirming ? (
        <div className="confirm-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setConfirming(false);
        }}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <span className="proposal-actions-kicker">Bevestiging</span>
            <h2 id="confirm-title">Bevestig dat u verder wilt</h2>
            {amountText ? <strong className="confirm-amount">{amountText}</strong> : null}
            <p>U geeft hiermee aan dat u met dit voorstel verder wilt. Wij nemen daarna contact met u op om de vervolgstappen en voorwaarden te bespreken en schriftelijk vast te leggen.</p>
            <label htmlFor="interest-message">Opmerking <span>(optioneel)</span></label>
            <textarea
              id="interest-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={800}
              placeholder="Eventuele vraag of opmerking voor ons."
            />
            <div className="confirm-buttons">
              <button disabled={state === "sending"} className="primary-action" onClick={() => send("interested")}>
                {state === "sending" ? "Bevestigen..." : "Ja, ik wil verder"}
              </button>
              <button disabled={state === "sending"} className="secondary-action" onClick={() => setConfirming(false)}>
                Terug
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isActive ? (
        <div className="proposal-mobile-bar" aria-label="Snelle voorstelactie">
          <div>
            {amountText ? <strong>{amountText}</strong> : null}
            {validityText ? <span>{validityText}</span> : null}
          </div>
          <button disabled={previewMode} onClick={startInterested}>Akkoord</button>
          <button disabled={previewMode} onClick={() => startDiscuss({ scrollToAction: true })}>Bespreken</button>
        </div>
      ) : null}

      <style jsx>{`
        .proposal-actions-v32 {
          margin: 28px auto;
          max-width: 1180px;
          padding: 28px;
          border-radius: 28px;
          background: linear-gradient(135deg, #071f3a, #0d3159);
          color: #fff;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          box-shadow: 0 22px 60px rgba(7,31,58,.16);
        }
        .proposal-actions-copy h2 { margin: 8px 0 10px; font-size: clamp(25px, 3vw, 36px); }
        .proposal-actions-copy p { margin: 0; color: #d9e6f5; line-height: 1.65; max-width: 720px; }
        .proposal-actions-kicker { display:inline-flex; text-transform:uppercase; letter-spacing:.08em; font-size:12px; font-weight:900; color:#ffd5b5; }
        .validity-note { margin-top:12px!important; color:#fff!important; font-weight:900; }
        .preview-note { margin-top:10px!important; color:#ffd5b5!important; }
        .proposal-action-buttons-v32 { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:10px; }
        .proposal-action-buttons-v32 button, .proposal-action-buttons-v32 a, .confirm-buttons button, .message-box button {
          border:0; border-radius:999px; padding:13px 18px; font:inherit; font-weight:900; cursor:pointer; text-decoration:none;
        }
        .primary-action { background:#D96A1C; color:#fff; box-shadow:0 10px 26px rgba(217,106,28,.22); }
        .secondary-action { background:#fff; color:#071f3a; }
        .proposal-action-buttons-v32 a { background:rgba(255,255,255,.12); color:#fff; border:1px solid rgba(255,255,255,.22); }
        button:disabled { opacity:.55; cursor:not-allowed; }
        .legal-note { grid-column:1/-1; margin:0!important; padding-top:4px; color:#b9c9dc!important; font-size:13px; }
        .action-error { grid-column:1/-1; background:#fff1ee; color:#8a2d2d!important; padding:12px 14px; border-radius:14px; }
        .message-box { grid-column:1/-1; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.18); border-radius:20px; padding:16px; display:grid; gap:10px; }
        .message-box label, .confirm-dialog label { font-weight:900; }
        .message-box label span, .confirm-dialog label span { font-weight:500; opacity:.7; }
        textarea { width:100%; min-height:96px; resize:vertical; border:1px solid #d9dfe6; border-radius:14px; padding:12px 14px; font:inherit; }
        .message-box textarea { border-color:rgba(255,255,255,.28); }
        .message-box>div { display:flex; gap:10px; flex-wrap:wrap; }
        .text-button { background:transparent!important; color:#fff!important; border:1px solid rgba(255,255,255,.24)!important; }
        .confirm-backdrop { position:fixed; inset:0; z-index:1000; background:rgba(2,13,26,.68); padding:20px; display:grid; place-items:center; }
        .confirm-dialog { width:min(560px,100%); background:#fffdf9; color:#071f3a; border-radius:28px; padding:28px; box-shadow:0 28px 90px rgba(0,0,0,.28); display:grid; gap:14px; }
        .confirm-dialog h2 { margin:0; font-size:30px; }
        .confirm-dialog p { margin:0; line-height:1.65; color:#4e6073; }
        .confirm-dialog .proposal-actions-kicker { color:#B85216; }
        .confirm-amount { font-size:28px; color:#D96A1C; }
        .confirm-buttons { display:flex; gap:10px; flex-wrap:wrap; margin-top:4px; }
        .confirm-buttons .secondary-action { border:1px solid #d9dfe6; }
        .proposal-mobile-bar { display:none; }
        @media (max-width: 760px) {
          .proposal-actions-v32 { grid-template-columns:1fr; padding:22px 18px; border-radius:22px; margin-bottom:94px; }
          .proposal-action-buttons-v32 { justify-content:stretch; }
          .proposal-action-buttons-v32 button, .proposal-action-buttons-v32 a { width:100%; text-align:center; }
          .proposal-mobile-bar {
            position:fixed; left:10px; right:10px; bottom:10px; z-index:900;
            display:grid; grid-template-columns:1fr auto auto; gap:8px; align-items:center;
            background:rgba(7,31,58,.96); color:#fff; padding:10px; border-radius:18px;
            box-shadow:0 16px 40px rgba(7,31,58,.28); backdrop-filter:blur(12px);
          }
          .proposal-mobile-bar>div { display:grid; gap:1px; min-width:0; }
          .proposal-mobile-bar strong { font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
          .proposal-mobile-bar span { font-size:11px; color:#d9e6f5; }
          .proposal-mobile-bar button { border:0; border-radius:999px; padding:11px 12px; font-weight:900; cursor:pointer; }
          .proposal-mobile-bar button:first-of-type { background:#D96A1C; color:#fff; }
          .proposal-mobile-bar button:last-of-type { background:#fff; color:#071f3a; }
        }
      `}</style>
    </>
  );
}
