/**
 * Domeinmigratie Vastgoed Direct Nederland
 * Oude domeinen worden permanent doorgestuurd naar het nieuwe hoofddomein.
 */

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
 * meelopen, bekijk de meldingen in de browserconsole, en zet hem daarna pas
 * om naar "Content-Security-Policy" als er niets meer wordt geblokkeerd.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  // Conversiepixels van Google en Meta worden als afbeelding geladen.
  "img-src 'self' data: https://www.googletagmanager.com https://www.google.com https://www.google.nl https://www.facebook.com",
  // api.pdok.nl staat hier bewust NIET: de adrescontrole loopt via /api/address,
  // dus de browser praat alleen met onze eigen server.
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.facebook.com",
  // default-src geldt ook als frame-src; de Meta-pixel en conversion linking
  // gebruiken een iframe, dus die hosts staan hier expliciet.
  "frame-src https://www.facebook.com https://td.doubleclick.net",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
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
        ],
      },
    ];
  },

  async redirects() {
    return [
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

export default nextConfig;
