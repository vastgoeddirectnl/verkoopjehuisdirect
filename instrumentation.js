// MON-01: Next.js roept register() zelf aan bij het opstarten van elke
// runtime. Server- en edge-config worden hier bewust dynamisch geïmporteerd
// in plaats van automatisch geladen — dat is sinds @sentry/nextjs 8 de
// vereiste vorm voor de App Router.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config.js");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config.js");
  }
}

export async function onRequestError(...args) {
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
}
