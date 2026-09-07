// Foutmelding zonder externe dienst.
//
// De achtergrond: alle catch-blokken schreven naar console.error of
// console.warn. Dat landt in de Vercel-logs, en daar kijkt in de praktijk
// niemand naar. Gevolg: als de mailkoppeling omvalt of de automatisering
// faalt, hoor je dat van een klant die belt dat hij niets heeft ontvangen.
//
// Wat dit bestand doet:
//  1. Altijd een gestructureerde regel naar stdout, zodat je in de Vercel-logs
//     op `[vdn-error]` en op een scope kunt zoeken in plaats van op losse
//     zinnen.
//  2. Bij severity "critical" ook een e-mail naar LEAD_TO_EMAIL, via de Resend
//     REST-API die we toch al gebruiken. Geen nieuwe dependency.
//
// Sinds 5.5.0 (MON-01) ook naar Sentry, als SENTRY_DSN is gezet. De import
// blijft dynamisch en achter die check: zonder DSN — zoals lokaal en in de
// CI-tests — wordt @sentry/nextjs nooit geladen, en blijft dit bestand onder
// gewone `node --test` net zo licht als voorheen.

import { sendResendMail, escapeHtml, hasMailConfig } from "./mail.js";

const ALERT_THROTTLE_MS = 1000 * 60 * 30;

// Per lambda-instance. Dat is geen sluitende ontdubbeling — bij veel verkeer
// draaien er meerdere instances naast elkaar — maar het scheelt het verschil
// tussen "één mail per half uur per instance" en "een mail per mislukte
// request". Bij dit volume is dat voldoende; een sluitende variant zou een
// tabel en dus een migratie vragen.
const laatsteMelding = new Map();

function mag(sleutel, nu = Date.now()) {
  const vorige = laatsteMelding.get(sleutel);
  if (vorige && nu - vorige < ALERT_THROTTLE_MS) return false;
  laatsteMelding.set(sleutel, nu);
  return true;
}

let sentryModulePromise;

function laadSentry() {
  if (!process.env.SENTRY_DSN) return null;
  if (!sentryModulePromise) sentryModulePromise = import("@sentry/nextjs").catch(() => null);
  return sentryModulePromise;
}

async function meldAanSentry(report, error) {
  const Sentry = await laadSentry();
  if (!Sentry) return;

  const sentryError = error instanceof Error ? error : new Error(report.message || "onbekende fout");
  Sentry.captureException(sentryError, {
    level: report.severity === "critical" ? "error" : "warning",
    tags: { scope: report.scope },
    extra: report.context,
  });
}

function foutTekst(error) {
  // Alles hier kan gooien: een Error-subklasse met een getter op `message`,
  // een proxy, een object met een kapotte toString. De foutmelder mag nooit
  // zelf de fout worden.
  try {
    if (!error) return "";
    if (typeof error === "string") return error;
    const message = error.message;
    if (typeof message === "string" && message) return message;
    return String(error);
  } catch {
    return "onleesbare fout";
  }
}

/**
 * Bouwt de logregel. Apart exporteerbaar zodat de vorm te testen is zonder
 * naar stdout te schrijven.
 */
export function buildErrorReport({ scope, error, severity = "warning", context = {} } = {}) {
  return {
    tag: "[vdn-error]",
    scope: String(scope || "onbekend"),
    severity: severity === "critical" ? "critical" : "warning",
    message: foutTekst(error),
    // Alleen niet-persoonlijke context: een lead-id mag, naam of telefoon niet.
    context: Object.fromEntries(
      Object.entries(context).filter(([, waarde]) => waarde !== undefined && waarde !== null)
    ),
    at: new Date().toISOString(),
  };
}

async function stuurMelding(report) {
  if (!hasMailConfig()) return { skipped: true, reason: "Geen mailconfiguratie." };

  const onderwerp = `[VDN storing] ${report.scope}`;
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#0b2341;line-height:1.5;">
      <h2 style="margin:0 0 12px;">Er ging iets mis op de site</h2>
      <p style="margin:0 0 16px;">Deze melding komt uit de foutafhandeling. Er is
      maximaal één melding per half uur per soort fout.</p>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px;">
        <tr><td><strong>Onderdeel</strong></td><td>${escapeHtml(report.scope)}</td></tr>
        <tr><td><strong>Melding</strong></td><td>${escapeHtml(report.message)}</td></tr>
        <tr><td><strong>Tijdstip</strong></td><td>${escapeHtml(report.at)}</td></tr>
        ${Object.entries(report.context).map(([k, v]) =>
          `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(String(v))}</td></tr>`
        ).join("")}
      </table>
    </div>
  `;

  return sendResendMail({
    to: process.env.LEAD_TO_EMAIL || "info@vastgoeddirectnederland.nl",
    subject: onderwerp,
    html,
  });
}

/**
 * Meldt een fout. Gooit nooit zelf — foutafhandeling die zelf faalt is erger
 * dan de oorspronkelijke fout.
 *
 * severity "critical" stuurt daarnaast een e-mail. Gebruik dat alleen als er
 * iets kapot is dat je diezelfde dag wilt weten: een lead die niet is
 * opgeslagen, mail die er niet uit gaat, de adminroute die omvalt.
 */
export async function reportError({ scope, error, severity = "warning", context = {} } = {}) {
  let report;
  try {
    report = buildErrorReport({ scope, error, severity, context });
  } catch {
    // Laatste vangnet: liever een kale melding dan een omgevallen request.
    report = buildErrorReport({ scope: "onbekend", error: "onleesbare fout", severity });
  }

  try {
    const regel = JSON.stringify(report);
    if (report.severity === "critical") console.error(report.tag, regel);
    else console.warn(report.tag, regel);
  } catch {
    // Als zelfs loggen faalt, is er niets zinnigs meer te doen.
  }

  try {
    await meldAanSentry(report, error);
  } catch {
    // Een falende Sentry-aanroep mag de request niet raken.
  }

  if (report.severity !== "critical") return report;
  if (!mag(report.scope)) return report;

  try {
    await stuurMelding(report);
  } catch {
    // Een mislukte storingsmail mag de request niet raken.
  }

  return report;
}

/** Alleen voor tests: de throttle terugzetten. */
export function resetErrorThrottle() {
  laatsteMelding.clear();
}
