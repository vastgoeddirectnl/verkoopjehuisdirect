"use client";

// MON-01: React-renderfouten in de App Router lopen niet via reportError()
// (dat is server-side), maar via deze speciale grens. Sentry raadt dit
// bestand expliciet aan naast instrumentation.js/instrumentation-client.js.
// Zonder SENTRY_DSN is captureException een no-op, dus dit bestand verandert
// niets aan de lokale/CI-omgeving.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="nl">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "24px",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1>Er ging iets mis</h1>
          <p>Deze fout is automatisch gemeld. Probeer de pagina opnieuw te laden.</p>
          <button type="button" onClick={() => reset()} style={{ padding: "8px 16px", cursor: "pointer" }}>
            Opnieuw proberen
          </button>
        </main>
      </body>
    </html>
  );
}
