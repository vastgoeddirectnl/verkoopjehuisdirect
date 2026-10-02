"use client";

// Kleine presentatieblokken voor het admin-dashboard (ARCH-07). Stonden eerder
// bovenin app/admin/page.jsx.

import { LEAD_STATUSES, displayStatus } from "../../../lib/leadStatus.js";
import { parseLeadSourceDetails, leadChannel } from "../../../lib/sourceParser.js";
import { formatDateNL, formatDateTimeNL } from "../../../lib/date.js";

export function fmt(value) {
  return formatDateTimeNL(value);
}

/** Datum zonder tijd ("2 okt. 2026"), voor opvolg- en taakdatums. */
export function fmtDay(value, fallback = "geen datum") {
  return formatDateNL(value, { fallback, day: "numeric", month: "short" });
}

export function statusClass(status) {
  return `status-${displayStatus(status).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function Kpi({ label, value, hint, tone = "" }) {
  return (
    <article className={`kpi-card ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
      {hint ? <small>{hint}</small> : null}
    </article>
  );
}

export function Info({ label, value }) {
  return (
    <div className="info-card">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export function Bar({ label, value, max, suffix }) {
  const width = max ? Math.max(8, Math.round((Number(value) / max) * 100)) : 0;
  return (
    <div className="bar-row">
      <div>
        <strong>{label || "Onbekend"}</strong>
        <span>{value} lead{Number(value) === 1 ? "" : "s"}{suffix ? ` · ${suffix}` : ""}</span>
      </div>
      <em><i style={{ width: `${width}%` }} /></em>
    </div>
  );
}

export function PipelineButtons({ value, onChange }) {
  const active = displayStatus(value);
  return (
    <div className="pipeline-buttons" aria-label="Pipeline status">
      {LEAD_STATUSES.filter((status) => !["Afgerond", "Gearchiveerd"].includes(status)).map((status) => (
        <button key={status} type="button" className={active === status ? "active" : ""} onClick={() => onChange(status)}>
          {status}
        </button>
      ))}
    </div>
  );
}

export function ChannelPill({ lead }) {
  return <span className="channel-pill">{leadChannel(lead)}</span>;
}

/**
 * Herkomst in het kort, met de ruwe meetgegevens ingeklapt eronder. Klik-ID's
 * en volledige URL's zijn alleen nodig bij het nakijken van een campagne.
 */
export function SourceDetails({ lead }) {
  const details = parseLeadSourceDetails(lead);
  const rows = [
    ["UTM source", details.source],
    ["UTM medium", details.medium],
    ["Campagne", details.campaign],
    ["Zoekterm / keyword", details.term],
    ["Advertentie-inhoud", details.content],
    ["Klik-ID", details.clickId],
    ["Referrer", details.referrer],
  ].filter(([, value]) => value);

  return (
    <div className="source-detail-box">
      <div className="source-head">
        <h3>Herkomst</h3>
        <ChannelPill lead={lead} />
      </div>
      <p className="source-line">Landingspagina: <strong>{details.pagePath || "-"}</strong>{details.pageTitle ? ` · ${details.pageTitle}` : ""}</p>
      {details.campaign ? <p className="source-line">Campagne: <strong>{details.campaign}</strong></p> : null}
      {rows.length ? (
        <details className="tech-details">
          <summary>Technische meetgegevens</summary>
          <div className="info-grid">
            {rows.map(([label, value]) => <Info key={label} label={label} value={value} />)}
          </div>
        </details>
      ) : null}
    </div>
  );
}

/** "9711AB|12" — sleutel om dubbele aanvragen op hetzelfde adres te herkennen. */
export function addressKey(lead) {
  const postcode = String(lead?.postcode || "").toUpperCase().replace(/\s+/g, "");
  const house = String(lead?.huisnummer || "").trim().toLowerCase();
  return postcode && house ? `${postcode}|${house}` : "";
}
