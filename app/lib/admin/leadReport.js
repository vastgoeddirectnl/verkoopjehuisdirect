// Marketingrapportage voor het admin-dashboard (SRC-01).
//
// Voorheen telde de rapportage per ruw `bron`- en `pagina`-veld in SQL. Elke
// advertentieklik heeft een eigen gclid en elke landings-URL eigen
// trackingparameters, dus vrijwel elke lead stond op een eigen regel en
// testaanvragen (Google Tag Assistant) telden gewoon mee. Hier wordt per kanaal
// en per schoon landingspad geteld, testverkeer apart gehouden. Puur, zodat het
// zonder database te testen is.

import { leadChannel, cleanLandingPath, LEAD_CHANNELS } from "../sourceParser.js";

// Een lead met deze status heeft tot een deal geleid. Bewust zonder
// "Afgerond": de knop "Afgerond archiveren" wordt gebruikt om afgehandelde
// leads op te ruimen, ook zonder voorstel of contact.
const WON_STATUSES = ["Akkoord"];

function monthKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 7);
}

function sortedCounts(map, limit) {
  return [...map.entries()]
    .map(([label, counts]) => ({ label, ...counts }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label, "nl"))
    .slice(0, limit);
}

export function aggregateLeadMarketing(leads = []) {
  const byChannel = new Map();
  const byPage = new Map();
  const byMonth = new Map();
  let testCount = 0;
  let total = 0;

  for (const lead of leads) {
    const channel = leadChannel(lead);
    if (channel === LEAD_CHANNELS.test) {
      testCount += 1;
      continue;
    }
    total += 1;
    const won = WON_STATUSES.includes(String(lead.status || "")) ? 1 : 0;

    const channelRow = byChannel.get(channel) || { total: 0, won: 0 };
    channelRow.total += 1;
    channelRow.won += won;
    byChannel.set(channel, channelRow);

    const path = cleanLandingPath(lead.pagina);
    const pageRow = byPage.get(path) || { total: 0, won: 0 };
    pageRow.total += 1;
    pageRow.won += won;
    byPage.set(path, pageRow);

    const month = monthKey(lead.created_at);
    if (month) {
      const monthRow = byMonth.get(month) || { total: 0, won: 0 };
      monthRow.total += 1;
      monthRow.won += won;
      byMonth.set(month, monthRow);
    }
  }

  return {
    total,
    testCount,
    byChannel: sortedCounts(byChannel, 20),
    byPage: sortedCounts(byPage, 15),
    byMonth: [...byMonth.entries()]
      .map(([label, counts]) => ({ label, ...counts }))
      .sort((a, b) => b.label.localeCompare(a.label))
      .slice(0, 12),
  };
}
