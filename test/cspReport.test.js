import test from "node:test";
import assert from "node:assert/strict";

import { sentryCspReportUrl, sentryIngestOrigin } from "../app/lib/cspReport.js";

// SEC-01: zonder meldadres verschenen CSP-overtredingen alleen in de console
// van de bezoeker. Het adres wordt uit de Sentry-DSN afgeleid.
const DSN = "https://36c03d7e64fc696798120d00c8fcc563@o4512047000977408.ingest.de.sentry.io/4512047034662992";

test("de CSP-meldurl volgt het security-endpoint van Sentry", () => {
  assert.equal(
    sentryCspReportUrl(DSN),
    "https://o4512047000977408.ingest.de.sentry.io/api/4512047034662992/security/?sentry_key=36c03d7e64fc696798120d00c8fcc563"
  );
});

test("zonder of met een ongeldige DSN is er geen meldurl", () => {
  assert.equal(sentryCspReportUrl(""), "");
  assert.equal(sentryCspReportUrl(undefined), "");
  assert.equal(sentryCspReportUrl("geen-url"), "");
  assert.equal(sentryCspReportUrl("http://key@o1.ingest.sentry.io/1"), "", "alleen https");
  assert.equal(sentryCspReportUrl("https://o1.ingest.sentry.io/1"), "", "zonder sleutel");
});

test("de ingest-host komt in connect-src", () => {
  assert.equal(sentryIngestOrigin(DSN), "https://o4512047000977408.ingest.de.sentry.io");
  assert.equal(sentryIngestOrigin(""), "");
});
