/**
 * Domeinmigratie Vastgoed Direct Nederland
 * Oude domeinen worden permanent doorgestuurd naar het nieuwe hoofddomein.
 */

import { withSentryConfig } from "@sentry/nextjs/config";
import { MERGED_PAGES } from "./app/lib/sitePages.js";
import { sentryCspReportUrl, sentryIngestOrigin } from "./app/lib/cspReport.js";

// SEC-01: meldadres voor CSP-overtredingen en de Sentry-ingest-host, beide uit
// de publieke DSN (die staat toch al in de browserbundel).
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || "";
const cspReportUrl = sentryCspReportUrl(sentryDsn);
const sentryOrigin = sentryIngestOrigin(sentryDsn);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * Content Security Policy staat bewust in report-only.
 *
 * Google Ads (gtag) en de Meta Pixel injecteren inline scripts. Een harde
 * policy breekt daarmee de conversiemeting. Laat dit een aantal weken
 * meelopen, bekijk de meldingen in Sentry (Issues, filter op "csp"), en zet
 * hem daarna pas om naar "Content-Security-Policy" als er niets meer wordt
 * geblokkeerd. Zonder Sentry-DSN is er geen meldadres en blijft report-uri weg.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  // Conversiepixels van Google en Meta worden als afbeelding geladen.
  "img-src 'self' data: https://www.googletagmanager.com https://www.google.com https://www.google.nl https://www.facebook.com",
  // api.pdok.nl staat hier bewust NIET: de adrescontrole loopt via /api/address,
  // dus de browser praat alleen met onze eigen server.
  `connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.facebook.com${sentryOrigin ? ` ${sentryOrigin}` : ""}`,
  // default-src geldt ook als frame-src; de Meta-pixel en conversion linking
  // gebruiken een iframe, dus die hosts staan hier expliciet.
  "frame-src https://www.facebook.com https://td.doubleclick.net",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(cspReportUrl ? [`report-uri ${cspReportUrl}`, "report-to csp"] : []),
].join("; ");

const nextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy,
          },
          ...(cspReportUrl ? [{ key: "Reporting-Endpoints", value: `csp="${cspReportUrl}"` }] : []),
        ],
      },
    ];
  },

  async redirects() {
    return [
      // SEO-02: samengevoegde pagina's (zie app/lib/sitePages.js).
      ...Object.entries(MERGED_PAGES).map(([source, destination]) => ({ source, destination, permanent: true })),
      {
        source: "/huis-verkopen-zonder-bezichtigingen-uitleg",
        destination: "/huis-verkopen-zonder-bezichtigingen",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "verkoopjehuisdirect.nl" }],
        destination: "https://www.vastgoeddirectnederland.nl/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.verkoopjehuisdirect.nl" }],
        destination: "https://www.vastgoeddirectnederland.nl/:path*",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Zonder SENTRY_ORG/SENTRY_PROJECT/SENTRY_AUTH_TOKEN (env vars, door de
  // Sentry-plugin zelf gelezen) slaat de build het uploaden van source maps
  // stilletjes over — de rest van de build blijft ongewijzigd werken.
  silent: !process.env.CI,
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});
