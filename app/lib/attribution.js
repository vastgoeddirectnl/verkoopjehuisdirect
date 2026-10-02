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

function compactParts(parts, maxLength = 300) {
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

export function getLeadAttribution({ pageTitle = "", fallbackPath = "/" } = {}) {
  if (typeof window === "undefined") {
    return {
      pagePath: fallbackPath,
      pageLabel: compactParts([fallbackPath, pageTitle], 260),
      sourceLabel: "direct",
    };
  }

  const params = new URLSearchParams(window.location.search || "");
  // Alleen het pad: de trackingparameters staan al in sourceLabel, en met de
  // volledige querystring werd elke advertentieklik een eigen "pagina".
  const pagePath = window.location.pathname || fallbackPath;
  const trackingParts = TRACKING_PARAMS.map((key) => {
    const value = params.get(key);
    return value ? `${key}=${value}` : "";
  }).filter(Boolean);

  const source = params.get("source") ? `source=${params.get("source")}` : "";
  const referrer = document.referrer ? `referrer=${document.referrer}` : "";
  const sourceLabel = compactParts(
    trackingParts.length ? [...trackingParts, referrer] : [source, referrer, "direct"],
    300
  );

  return {
    pagePath,
    pageLabel: compactParts([pagePath, pageTitle], 260),
    sourceLabel: sourceLabel || "direct",
  };
}

export function trackingParamsFromLocation() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search || "");
  return Object.fromEntries(TRACKING_PARAMS.map((key) => [key, params.get(key) || ""]));
}
