// MON-01: initialisatie in de browser. Next.js laadt dit bestand automatisch
// als het op de rootlocatie staat (App Router, sinds @sentry/nextjs 8/9) —
// in tegenstelling tot de server- en edge-config, die via instrumentation.js
// lopen.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
