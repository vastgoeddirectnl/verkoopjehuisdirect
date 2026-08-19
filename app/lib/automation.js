import { query, queryOne } from "./neonDb";

const HIGH_VALUE_REGIONS = ["groningen", "drenthe", "friesland", "overijssel", "borger", "stadskanaal", "assen", "emmen", "veendam", "winschoten", "musselkanaal"];
const INACTIVE_LEAD_STATUSES = ["Akkoord", "Afgewezen", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];

function clean(value) {
  return String(value || "").trim();
}

function todayPlus(days = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const date = new Date(Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day) + Number(days || 0)
  ));

  return date.toISOString().slice(0, 10);
}

function containsAny(text, words) {
  const haystack = clean(text).toLowerCase();
  return words.some((word) => haystack.includes(word));
}

function leadText(lead = {}) {
  return [
    lead.naam,
    lead.email,
    lead.telefoon,
    lead.postcode,
    lead.huisnummer,
    lead.woningtype,
    lead.staat,
    lead.reden,
    lead.pagina,
    lead.bron,
    lead.notitie,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function calculateLeadAutomation(lead = {}) {
  const text = leadText(lead);
  const reasons = [];
  let score = 0;

  if (lead.telefoon) {
    score += 2;
    reasons.push("telefoonnummer bekend");
  }

  if (lead.email) {
    score += 1;
    reasons.push("e-mailadres bekend");
  }

  if (lead.postcode && lead.huisnummer) {
    score += 2;
    reasons.push("adresgegevens aanwezig");
  }

  if (containsAny(text, ["snel", "direct", "binnen 24", "binnen 1 week", "spoed", "duidelijkheid"])) {
    score += 3;
    reasons.push("duidelijke behoefte aan snelheid/duidelijkheid");
  }

  if (containsAny(text, ["leegstand", "leegstaand", "erfenis", "scheiding", "financieel", "financiële", "financiele", "verhuurd", "huur"])) {
    score += 3;
    reasons.push("situatie met verhoogde verkoopmotivatie");
  }

  if (containsAny(text, ["achterstallig", "onderhoud", "opknap", "renovatie", "schade", "slechte staat"])) {
    score += 2;
    reasons.push("woning mogelijk passend voor directe verkoopoplossing");
  }

  if (containsAny(text, HIGH_VALUE_REGIONS)) {
    score += 1;
    reasons.push("regio sluit goed aan bij werkgebied");
  }

  if (containsAny(text, ["google", "seo", "huis-direct", "huis-snel", "zonder-makelaar", "achterstallig", "leegstaand"])) {
    score += 1;
    reasons.push("binnengekomen via relevante pagina/bron");
  }

  if (!lead.telefoon && !lead.email) {
    score -= 3;
    reasons.push("contactgegevens beperkt");
  }

  score = Math.max(0, Math.min(12, score));

  let priority = "Normaal";
  if (score >= 8) priority = "Hoog";
  if (score <= 3) priority = "Laag";

  let nextFollowUpAt = null;
  const status = clean(lead.status) || "Nieuw";

  if (status === "Nieuw" || status === "Nieuwe aanvraag") nextFollowUpAt = todayPlus(0);
  else if (["Contact opgenomen", "In behandeling", "In beoordeling", "Eerste bod gedaan", "Beoordeling gepland", "Voorstel opgesteld"].includes(status)) nextFollowUpAt = todayPlus(1);
  else if (status === "Voorstel bekeken") nextFollowUpAt = todayPlus(0);
  else if (status === "Voorstel verzonden" || status === "In onderhandeling") nextFollowUpAt = todayPlus(2);
  else if (priority === "Hoog" && !INACTIVE_LEAD_STATUSES.includes(status)) nextFollowUpAt = todayPlus(0);

  return {
    score,
    priority,
    reasons,
    note: reasons.length ? reasons.join(" · ") : "Geen automatische signalen.",
    nextFollowUpAt,
  };
}

async function upsertAutomationTask({ lead, key, title, dueDate, note }) {
  if (!lead?.id || !key) return null;

  try {
    const existing = await queryOne(
      "select * from tasks where lead_id = $1 and automation_key = $2 limit 1",
      [lead.id, key]
    );

    if (existing) {
      if (existing.status === "Afgerond") return existing;

      return await queryOne(
        `update tasks
         set title = $3,
             due_date = $4,
             note = $5,
             updated_at = now()
         where id = $1 and lead_id = $2
         returning *`,
        [existing.id, lead.id, title, dueDate || null, note || null]
      );
    }

    return await queryOne(
      `insert into tasks (lead_id, lead_naam, title, due_date, status, note, automation_key)
       values ($1,$2,$3,$4,'Open',$5,$6)
       returning *`,
      [
        lead.id,
        lead.naam || null,
        title,
        dueDate || null,
        note || null,
        key,
      ]
    );
  } catch (error) {
    console.warn("Automatische taak kon niet worden aangemaakt:", error.message);
    return null;
  }
}

export async function refreshLeadAutomation(inputLead) {
  if (!inputLead?.id) return inputLead;

  try {
    const fresh = await queryOne("select * from leads where id = $1", [inputLead.id]);
    if (!fresh) return inputLead;

    const automation = calculateLeadAutomation(fresh);

    let lead = await queryOne(
      `update leads
       set lead_score = $2,
           lead_priority = $3,
           automation_note = $4,
           next_follow_up_at = $5,
           last_automation_at = now(),
           updated_at = now()
       where id = $1
       returning *`,
      [
        fresh.id,
        automation.score,
        automation.priority,
        automation.note,
        automation.nextFollowUpAt,
      ]
    );

    const status = lead.status || "Nieuw";

    if (status === "Nieuw" || status === "Nieuwe aanvraag") {
      await upsertAutomationTask({
        lead,
        key: "auto-new-lead",
        title: "Nieuwe aanvraag opvolgen",
        dueDate: todayPlus(0),
        note: `Automatisch aangemaakt. Leadscore ${automation.score}/12. ${automation.note}`,
      });
    }

    if (automation.priority === "Hoog" && !INACTIVE_LEAD_STATUSES.includes(status)) {
      await upsertAutomationTask({
        lead,
        key: "auto-high-priority",
        title: "Kansrijke lead snel bellen",
        dueDate: todayPlus(0),
        note: `Hoge leadscore ${automation.score}/12. ${automation.note}`,
      });
    }

    return lead;
  } catch (error) {
    console.warn("Lead-automatisering overgeslagen:", error.message);
    return inputLead;
  }
}

export async function markProposalSentAutomation(proposal) {
  if (!proposal?.lead_id) return null;

  try {
    const lead = await queryOne("select * from leads where id = $1", [proposal.lead_id]);
    if (!lead) return null;

    await upsertAutomationTask({
      lead,
      key: `auto-proposal-sent-${proposal.id}`,
      title: "Voorstel nabellen",
      dueDate: todayPlus(2),
      note: "Automatisch aangemaakt nadat het verkoopvoorstel naar de klant is gemaild.",
    });

    return await refreshLeadAutomation({ id: proposal.lead_id });
  } catch (error) {
    console.warn("Automatisering na voorstelmail overgeslagen:", error.message);
    return null;
  }
}

export async function markProposalViewed(proposal) {
  if (!proposal?.id) return null;

  try {
    await query(
      `update proposals
       set public_viewed_at = coalesce(public_viewed_at, now()),
           public_view_count = coalesce(public_view_count, 0) + 1,
           updated_at = now()
       where id = $1`,
      [proposal.id]
    );

    if (!proposal.lead_id) return null;

    const lead = await queryOne("select * from leads where id = $1", [proposal.lead_id]);
    if (!lead) return null;

    if (!INACTIVE_LEAD_STATUSES.includes(lead.status || "")) {
      await query(
        `update leads
         set status = case when status in ('Voorstel verzonden','Voorstel opgesteld') then 'Voorstel bekeken' else status end,
             proposal_viewed_at = coalesce(proposal_viewed_at, now()),
             next_follow_up_at = current_date,
             updated_at = now()
         where id = $1`,
        [lead.id]
      );
    }

    await upsertAutomationTask({
      lead,
      key: `auto-proposal-viewed-${proposal.id}`,
      title: "Voorstel bekeken - klant nabellen",
      dueDate: todayPlus(0),
      note: "De klant heeft het verkoopvoorstel geopend. Dit is een warm opvolgmoment.",
    });

    return await refreshLeadAutomation({ id: lead.id });
  } catch (error) {
    console.warn("Automatisering na bekijken voorstel overgeslagen:", error.message);
    return null;
  }
}

export async function refreshAllLeadAutomation(limit = 300) {
  try {
    const { rows } = await query(
      "select id from leads order by created_at desc limit $1",
      [Math.min(Number(limit) || 300, 1000)]
    );

    let processed = 0;
    for (const row of rows) {
      await refreshLeadAutomation(row);
      processed += 1;
    }

    return { processed };
  } catch (error) {
    console.warn("Bulk-automatisering overgeslagen:", error.message);
    return { processed: 0, error: error.message };
  }
}
