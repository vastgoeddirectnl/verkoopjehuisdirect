// MON-01: server-runtime initialisatie. Wordt geladen vanuit instrumentation.js
// (NEXT_RUNTIME === "nodejs"), niet automatisch door Next.js zelf.
//
// Zonder SENTRY_DSN doet de SDK niets: geen events, geen netwerkverkeer. Dat
// houdt lokale ontwikkeling en de CI-build ongewijzigd werkend zonder dat er
// ergens een aparte "is Sentry aan"-vlag nodig is.

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
});
