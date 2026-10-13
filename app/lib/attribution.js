const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  // Google Ads zet bij auto-tagging ook gad_source/gad_campaignid; Meta en
  // Microsoft hun eigen klik-ID. Ze horen in het bronveld, niet in de pagina.
  "gad_source",
  "gad_campaignid",
  "fbclid",
  "msclkid",
];

// Herkomst per bezoek. Tot 5.7.0 keek het formulier pas bij het versturen
// naar de URL en de verwijzer. Wie via Google of een advertentie binnenkwam en
// daarna doorklikte, telde dan als "Direct": de trackingparameters stonden
// niet meer in de URL en de verwijzer was de eigen site. Nu wordt bij het
// eerste bezoek onthouden waar iemand vandaan kwam, alleen in sessionStorage
// (weg zodra het tabblad sluit) en alleen meegestuurd bij een aanvraag.
const LANDING_KEY = "vdn_herkomst_v1";
const OWN_HOSTS = ["vastgoeddirectnederland.nl", "verkoopjehuisdirect.nl"];
const EXCLUDED_PATHS = ["/admin", "/voorstel"];

const BRON_MAX = 600;

function compactParts(parts, maxLength = BRON_MAX) {
  const result = [];
  let length = 0;
  for (const part of parts.filter(Boolean)) {
    const nextLength = length + (result.length ? 3 : 0) + part.length;
    if (nextLength > maxLength) break;
    result.push(part);
    length = nextLength;
  }
  return result.join(" | ");
}

export function trackingPartsFromSearch(search = "") {
  const params = new URLSearchParams(search || "");
  return TRACKING_PARAMS.map((key) => {
    const value = params.get(key);
    return value ? `${key}=${value}` : "";
  }).filter(Boolean);
}

/** De verwijzer, maar alleen als die van buiten de eigen site komt. */
export function externalReferrer(referrer = "") {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return OWN_HOSTS.some((own) => host === own || host.endsWith(`.${own}`)) ? "" : referrer;
  } catch {
    return "";
  }
}

/**
 * Bepaalt wat er onthouden moet worden bij het laden van een pagina, of null
 * als de bestaande herkomst blijft staan. Puur, zodat de regels testbaar zijn:
 * - een nieuwe advertentieklik (trackingparameters) vervangt altijd;
 * - een nieuwe externe verwijzer vervangt een eerdere "direct"-binnenkomst;
 * - verder blijft de eerste binnenkomst van het bezoek staan.
 */
export function nextLandingRecord({ stored = null, search = "", referrer = "", path = "/", now = Date.now() } = {}) {
  const tracking = trackingPartsFromSearch(search);
  const external = externalReferrer(referrer);
  const record = { tracking, referrer: external, landingPath: path || "/", at: now };

  if (tracking.length) return record;
  if (!stored) return record;
  if (external && !stored.tracking?.length && !stored.referrer) return record;
  return null;
}

/**
 * Bouwt het bronveld. Trackingparameters op de huidige pagina gaan voor; anders
 * die van de binnenkomst. De landingspagina komt erbij als die anders is dan
 * de pagina waar het formulier staat.
 */
export function buildSourceLabel({ currentSearch = "", currentReferrer = "", stored = null, pagePath = "/" } = {}) {
  const currentTracking = trackingPartsFromSearch(currentSearch);
  const tracking = currentTracking.length ? currentTracking : stored?.tracking || [];
  const referrer = externalReferrer(currentReferrer) || stored?.referrer || "";
  const legacySource = new URLSearchParams(currentSearch || "").get("source");
  const landing = stored?.landingPath && stored.landingPath !== pagePath ? `landing=${stored.landingPath}` : "";

  const parts = tracking.length
    ? [...tracking, referrer ? `referrer=${referrer}` : "", landing]
    : [
        legacySource ? `source=${legacySource}` : "",
        referrer ? `referrer=${referrer}` : "",
        landing,
        legacySource || referrer ? "" : "direct",
      ];

  return compactParts(parts) || "direct";
}

function readStored() {
  try {
    const raw = window.sessionStorage.getItem(LANDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Aanroepen bij elke volledige paginalading (zie LandingAttribution in de layout). */
export function captureLandingAttribution() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname || "/";
  if (EXCLUDED_PATHS.some((prefix) => path.startsWith(prefix))) return;

  const record = nextLandingRecord({
    stored: readStored(),
    search: window.location.search,
    referrer: document.referrer,
    path,
  });
  if (!record) return;

  try {
    window.sessionStorage.setItem(LANDING_KEY, JSON.stringify(record));
  } catch {
    // Privémodus of geblokkeerde opslag: dan valt het formulier terug op de
    // huidige URL en verwijzer, zoals vóór 5.7.0.
  }
}

export function getLeadAttribution({ pageTitle = "", fallbackPath = "/" } = {}) {
  if (typeof window === "undefined") {
    return {
      pagePath: fallbackPath,
      pageLabel: compactParts([fallbackPath, pageTitle], 260),
      sourceLabel: "direct",
    };
  }

  // Alleen het pad: de trackingparameters staan al in sourceLabel, en met de
  // volledige querystring werd elke advertentieklik een eigen "pagina".
  const pagePath = window.location.pathname || fallbackPath;

  return {
    pagePath,
    pageLabel: compactParts([pagePath, pageTitle], 260),
    sourceLabel: buildSourceLabel({
      currentSearch: window.location.search,
      currentReferrer: document.referrer,
      stored: readStored(),
      pagePath,
    }),
  };
}
