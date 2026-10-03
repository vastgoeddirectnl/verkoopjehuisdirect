// SEC-01. Waar de browser CSP-overtredingen naartoe stuurt.
//
// De Content Security Policy staat in report-only, met als plan "omzetten zodra
// er een paar weken geen meldingen meer komen". Maar er was geen meldadres:
// overtredingen verschenen alleen in de console van de bezoeker, dus dat
// moment kon nooit worden vastgesteld. Sentry ontvangt CSP-meldingen op een
// eigen endpoint, af te leiden uit de DSN.
//
// DSN:      https://<key>@o<org>.ingest.de.sentry.io/<project>
// Endpoint: https://o<org>.ingest.de.sentry.io/api/<project>/security/?sentry_key=<key>

export function sentryCspReportUrl(dsn) {
  try {
    const url = new URL(String(dsn || ""));
    const key = url.username;
    const project = url.pathname.replace(/^\/+|\/+$/g, "");
    if (url.protocol !== "https:" || !key || !/^\d+$/.test(project)) return "";
    return `https://${url.host}/api/${project}/security/?sentry_key=${encodeURIComponent(key)}`;
  } catch {
    return "";
  }
}

/** De ingest-host uit een DSN, voor connect-src (de Sentry-browser-SDK post daarheen). */
export function sentryIngestOrigin(dsn) {
  try {
    const url = new URL(String(dsn || ""));
    return url.protocol === "https:" && url.host ? `https://${url.host}` : "";
  } catch {
    return "";
  }
}
