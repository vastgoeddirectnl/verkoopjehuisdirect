// MON-01: edge-runtime initialisatie (o.a. middleware.js draait hier).
// Geladen vanuit instrumentation.js (NEXT_RUNTIME === "edge").

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
});
