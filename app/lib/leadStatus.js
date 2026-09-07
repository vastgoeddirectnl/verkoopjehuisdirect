// Statuslijsten en -labels voor leads (ARCH-03). Stonden eerder los
// gedefinieerd — met dezelfde waarden, maar niet altijd dezelfde naam — in
// app/lib/leads.js, app/lib/automation.js, app/api/admin/v2/route.js,
// app/admin/page.jsx en app/admin/leads/[id]/page.jsx.

// De statussen zoals de admin-UI ze toont en aanbiedt in het statusmenu.
export const LEAD_STATUSES = [
  "Nieuwe aanvraag",
  "In behandeling",
  "Eerste bod gedaan",
  "Beoordeling gepland",
  "Voorstel opgesteld",
  "Voorstel verzonden",
  "Voorstel bekeken",
  "In onderhandeling",
  "Akkoord",
  "Afgewezen / vervallen",
  "Afgerond",
  "Gearchiveerd",
];

// Statussen die een lead als "klaar" beschouwen: die tellen niet meer mee in
// het actieve overzicht, krijgen geen automatisering meer, en worden apart
// getoond onder "Archief".
export const ARCHIVE_LEAD_STATUSES = ["Akkoord", "Afgewezen", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];

// Oudere statuswaarden die nog in de database kunnen staan (van vóór een
// naamswijziging), met hun huidige equivalent in LEAD_STATUSES.
export const LEGACY_STATUS_LABELS = {
  "Nieuw": "Nieuwe aanvraag",
  "Contact opgenomen": "In behandeling",
  "In beoordeling": "Beoordeling gepland",
  "Afgewezen": "Afgewezen / vervallen",
};

export function displayStatus(status) {
  return LEGACY_STATUS_LABELS[status] || status || "Nieuwe aanvraag";
}

// Voor een <select>: de huidige (evt. legacy) status omgezet naar een geldige
// waarde uit LEAD_STATUSES, met "Nieuwe aanvraag" als vangnet.
export function selectStatusValue(status) {
  const label = displayStatus(status);
  return LEAD_STATUSES.includes(label) ? label : "Nieuwe aanvraag";
}
