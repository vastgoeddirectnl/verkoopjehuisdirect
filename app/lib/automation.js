import { query, queryOne, SQL_TODAY_NL } from "./neonDb.js";
import { addDaysAmsterdam } from "./date.js";
import { ARCHIVE_LEAD_STATUSES as INACTIVE_LEAD_STATUSES } from "./leadStatus.js";
import { isInWerkgebied, normalizeProvince } from "./address.js";

// Woorden die alleen meetellen als de klant ze zelf invulde (situatie, termijn,
// toelichting, notitie). Tot 5.7.0 werd ook het bron- en paginaveld doorzocht;
// daar staat bijna altijd "direct" (geen bekende bron, of /huis-direct-verkopen)
// en dat leverde iedere lead "duidelijke behoefte aan snelheid" op.
const SPEED_WORDS = ["snel", "zo snel mogelijk", "binnen 24", "binnen 1 week", "binnen 1 maand", "spoed", "duidelijkheid"];
const MOTIVATION_WORDS = ["leegstand", "leegstaand", "staat leeg", "erfenis", "nalatenschap", "scheiding", "financieel", "financiële", "financiele", "dubbele lasten", "verhuurd", "huur"];
const CONDITION_WORDS = ["achterstallig", "onderhoud", "opknap", "renovatie", "schade", "slechte staat", "niet verkoopklaar", "vol spullen", "leeggehaald"];
const ORIENTING_WORDS = ["oriënteer", "orienteer", "later dit jaar"];

// Alleen als terugval wanneer de provincie (nog) onbekend is.
const WERKGEBIED_WORDS = [
  "groningen", "drenthe", "friesland", "fryslân", "overijssel", "flevoland",
  "borger", "stadskanaal", "assen", "emmen", "veendam", "winschoten", "musselkanaal",
  "almere", "lelystad", "dronten", "zeewolde", "emmeloord", "urk",
];

const RELEVANT_CHANNEL_WORDS = ["google", "huis-direct", "huis-snel", "zonder-makelaar", "achterstallig", "leegstaand", "erfenis", "scheiding"];

// Opvolging (5.7.0). Tot nu toe rekende de opvolgdatum vanaf vandaag en werd
// hij elke ochtend opnieuw berekend: "Voorstel bekeken" stond daardoor
// maandenlang dagelijks op vandaag, en "Voorstel verzonden" (+2) of "In
// behandeling" (+1) schoof elke dag mee en kwam nooit aan de beurt. Nu telt
// de datum vanaf het laatste contact of de laatste keer dat de klant het
// voorstel bekeek. Zonder enige activiteit in 30 dagen is een lead
// "stilgevallen": geen dagelijkse opvolging meer, maar één taak om te beslissen.
export const STALE_AFTER_DAYS = 30;

const NEW_STATUSES = ["Nieuw", "Nieuwe aanvraag"];
const WORKING_STATUSES = ["Contact opgenomen", "In behandeling", "In beoordeling", "Eerste bod gedaan", "Beoordeling gepland", "Voorstel opgesteld"];
const PROPOSAL_STATUSES = ["Voorstel verzonden", "Voorstel bekeken", "In onderhandeling"];

function todayPlus(days = 0) {
  return addDaysAmsterdam(days);
}

function clean(value) {
  return String(value || "").trim();
}

function containsAny(text, words) {
  const haystack = clean(text).toLowerCase();
  return words.some((word) => haystack.includes(word));
}

/** Wat de klant zelf heeft ingevuld, zonder de technische delen van `reden`. */
function customerText(lead = {}) {
  const reden = clean(lead.reden)
    .split(" | ")
    .filter((part) => !/^(Campagne landingspagina|Adrescontrole):/i.test(part.trim()))
    .join(" ");
  return [lead.woningtype, lead.staat, reden, lead.notitie].filter(Boolean).join(" ").toLowerCase();
}

function channelText(lead = {}) {
  return [lead.pagina, lead.bron].filter(Boolean).join(" ").toLowerCase();
}

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function latest(...values) {
  const dates = values.map(toDate).filter(Boolean);
  return dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;
}

/**
 * Wanneer moet deze lead weer opgevolgd worden? Een datum in het verleden is
 * bewust: die blijft "vandaag of eerder" tot er contact is vastgelegd.
 */
export function followUpPlan(lead = {}, { now = new Date(), priority = "Normaal" } = {}) {
  const status = clean(lead.status) || "Nieuw";
  if (INACTIVE_LEAD_STATUSES.includes(status)) return { nextFollowUpAt: null, stale: false, lastActivity: null };

  const created = toDate(lead.created_at) || now;
  const contact = toDate(lead.last_contact_at);
  const view = latest(lead.last_proposal_view_at, lead.proposal_viewed_at);
  // Een reactie op de voorstelpagina (akkoord, bespreken, vraag) is ook activiteit.
  const reaction = toDate(lead.last_customer_reaction_at);
  const lastActivity = latest(created, contact, view, reaction) || now;
  const silentDays = (now.getTime() - lastActivity.getTime()) / 86_400_000;

  if (NEW_STATUSES.includes(status)) {
    return { nextFollowUpAt: addDaysAmsterdam(0, created), stale: false, lastActivity };
  }

  if ((WORKING_STATUSES.includes(status) || PROPOSAL_STATUSES.includes(status)) && silentDays > STALE_AFTER_DAYS) {
    return { nextFollowUpAt: null, stale: true, lastActivity };
  }

  if (status === "Voorstel bekeken") {
    // Opnieuw bekeken na het laatste contact: dat is het moment om te bellen.
    if (view && (!contact || view > contact)) return { nextFollowUpAt: addDaysAmsterdam(0, view), stale: false, lastActivity };
    return { nextFollowUpAt: addDaysAmsterdam(3, contact || created), stale: false, lastActivity };
  }

  if (status === "Voorstel verzonden" || status === "In onderhandeling") {
    return { nextFollowUpAt: addDaysAmsterdam(2, lastActivity), stale: false, lastActivity };
  }

  if (WORKING_STATUSES.includes(status)) {
    return { nextFollowUpAt: addDaysAmsterdam(1, latest(created, contact)), stale: false, lastActivity };
  }

  if (priority === "Hoog") {
    return { nextFollowUpAt: addDaysAmsterdam(0, lastActivity), stale: false, lastActivity };
  }

  return { nextFollowUpAt: null, stale: false, lastActivity };
}

export function calculateLeadAutomation(lead = {}, { now = new Date() } = {}) {
  const klant = customerText(lead);
  const kanaal = channelText(lead);
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

  if (containsAny(klant, SPEED_WORDS)) {
    score += 3;
    reasons.push("duidelijke behoefte aan snelheid/duidelijkheid");
  }

  if (containsAny(klant, MOTIVATION_WORDS)) {
    score += 3;
    reasons.push("situatie met verhoogde verkoopmotivatie");
  }

  if (containsAny(klant, CONDITION_WORDS)) {
    score += 2;
    reasons.push("woning mogelijk passend voor directe verkoopoplossing");
  }

  if (containsAny(klant, ORIENTING_WORDS)) {
    score -= 1;
    reasons.push("oriënteert zich nog");
  }

  const werkgebied = isInWerkgebied(lead.provincie);
  if (werkgebied === true) {
    score += 1;
    reasons.push(`woning ligt in het werkgebied (${normalizeProvince(lead.provincie)})`);
  } else if (werkgebied === false) {
    score -= 2;
    reasons.push(`woning ligt buiten het werkgebied (${normalizeProvince(lead.provincie)})`);
  } else if (containsAny(`${klant} ${kanaal}`, WERKGEBIED_WORDS)) {
    score += 1;
    reasons.push("regio sluit goed aan bij werkgebied");
  }

  if (containsAny(kanaal, RELEVANT_CHANNEL_WORDS)) {
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

  const plan = followUpPlan(lead, { now, priority });
  if (plan.stale) reasons.push(`stilgevallen: ${STALE_AFTER_DAYS}+ dagen geen contact of activiteit`);

  return {
    score,
    priority,
    reasons,
    note: reasons.length ? reasons.join(" · ") : "Geen automatische signalen.",
    nextFollowUpAt: plan.nextFollowUpAt,
    stale: plan.stale,
    lastActivity: plan.lastActivity || null,
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

/**
 * TASK-01. Wanneer een automatische taak vanzelf af hoort te zijn.
 *
 * In 5.5.0 stonden er 147 open taken, waarvan 146 over tijd en 65 op leads
 * die al gearchiveerd waren: automatische taken werden aangemaakt maar nooit
 * gesloten. De lijst was daardoor ruis. Dezelfde regel als bij klantacties
 * (app/lib/admin/customerActions.js) geldt nu voor alle automatische taken:
 * een vastgelegd contactmoment ná het aanmaken van de taak handelt hem af.
 *
 * Handmatige taken (zonder automation_key) blijven altijd met rust.
 */
export const AUTOMATION_TASK_CLOSE_RULES = [
  {
    key: "gearchiveerd",
    reason: "de lead is gearchiveerd of afgerond",
    where: (p) => `coalesce(l.status, 'Nieuw') = any($${p.push(INACTIVE_LEAD_STATUSES)})`,
  },
  {
    key: "contact",
    reason: "er is contact geweest na het aanmaken van deze taak",
    where: () => "l.last_contact_at is not null and l.last_contact_at >= t.created_at",
  },
  {
    key: "vervallen-type",
    reason: "taaktype vervallen, samengevoegd met 'Nieuwe aanvraag opvolgen'",
    where: () => "t.automation_key = 'auto-high-priority'",
  },
  {
    key: "niet-meer-nieuw",
    reason: "de aanvraag is niet meer nieuw",
    where: () => "t.automation_key = 'auto-new-lead' and coalesce(l.status, 'Nieuw') not in ('Nieuw','Nieuwe aanvraag')",
  },
  {
    key: "weer-actief",
    reason: "de klant heeft het voorstel opnieuw bekeken of erop gereageerd",
    where: () => `t.automation_key like 'auto-stilgevallen-%'
      and exists (
        select 1 from proposals p
        where p.lead_id = t.lead_id
          and (p.public_last_viewed_at >= t.created_at or p.interest_at >= t.created_at)
      )`,
  },
  {
    // Eén beslistaak in plaats van een stapel oude "nabellen"-taken.
    key: "vervangen-door-stilgevallen",
    reason: "de lead is stilgevallen; zie de taak 'Stilgevallen: nog interesse?'",
    where: () => `t.automation_key not like 'auto-stilgevallen-%'
      and exists (
        select 1 from tasks s
        where s.lead_id = t.lead_id
          and s.automation_key like 'auto-stilgevallen-%'
          and s.status <> 'Afgerond'
          and s.created_at > t.created_at
      )`,
  },
  {
    key: "voorstel-bekeken",
    reason: "de klant heeft het voorstel inmiddels bekeken",
    where: () => `t.automation_key like 'auto-proposal-sent-%'
      and exists (
        select 1 from tasks t2
        where t2.lead_id = t.lead_id
          and t2.automation_key = 'auto-proposal-viewed-' || substr(t.automation_key, ${"auto-proposal-sent-".length + 1})
      )`,
  },
];

/** Bouwt per regel de update-query. Apart, zodat de parameternummering te testen is. */
export function buildCloseTaskQueries({ leadId = null } = {}) {
  return AUTOMATION_TASK_CLOSE_RULES.map((rule) => {
    const params = [];
    const condition = rule.where(params);
    const reasonIndex = params.push(`Automatisch afgesloten: ${rule.reason}.`);
    const leadFilter = leadId ? `and t.lead_id = $${params.push(leadId)}` : "";
    const sql = `update tasks t
       set status = 'Afgerond',
           note = trim(both from coalesce(t.note, '') || E'\\n\\n' || $${reasonIndex}),
           updated_at = now()
       from leads l
       where l.id = t.lead_id
         and t.automation_key is not null
         and t.status <> 'Afgerond'
         and (${condition})
         ${leadFilter}
       returning t.id`;
    return { key: rule.key, sql, params };
  });
}

/**
 * Sluit automatische taken die volgens de regels hierboven af zijn. Met
 * leadId alleen voor die lead (na elke wijziging), zonder leadId voor alles
 * (bij de dagelijkse run). Gooit nooit: een mislukte opschoning mag een
 * leadwijziging niet tegenhouden.
 */
export async function closeResolvedAutomationTasks({ leadId = null } = {}) {
  const closed = {};
  for (const { key, sql, params } of buildCloseTaskQueries({ leadId })) {
    try {
      const { rows } = await query(sql, params);
      if (rows.length) closed[key] = rows.length;
    } catch (error) {
      console.warn(`Taken opschonen (${key}) overgeslagen:`, error.message);
    }
  }
  return closed;
}

export async function refreshLeadAutomation(inputLead) {
  if (!inputLead?.id) return inputLead;

  try {
    const fresh = await queryOne("select * from leads where id = $1", [inputLead.id]);
    if (!fresh) return inputLead;

    // De laatste keer dat de klant een voorstel bekeek of erop reageerde; dat
    // staat niet op de lead zelf (proposal_viewed_at is alleen de eerste keer).
    const viewRow = await queryOne(
      "select max(public_last_viewed_at) as last_view, max(interest_at) as last_reaction from proposals where lead_id = $1",
      [fresh.id]
    ).catch(() => null);
    const automation = calculateLeadAutomation({
      ...fresh,
      last_proposal_view_at: viewRow?.last_view || null,
      last_customer_reaction_at: viewRow?.last_reaction || null,
    });

    let lead = await queryOne(
      `update leads
       set lead_score = $2,
           lead_priority = $3,
           automation_note = $4,
           automation_follow_up_at = $5,
           next_follow_up_at = coalesce(manual_follow_up_at, $5::date),
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

    // Eén taak per nieuwe aanvraag. Voorheen kwam er bij een hoge leadscore
    // een tweede taak "Kansrijke lead snel bellen" naast, met dezelfde
    // betekenis — en die bleef ook na het eerste contact open staan.
    if (status === "Nieuw" || status === "Nieuwe aanvraag") {
      const kansrijk = automation.priority === "Hoog";
      await upsertAutomationTask({
        lead,
        key: "auto-new-lead",
        title: kansrijk ? "Kansrijke nieuwe aanvraag: vandaag bellen" : "Nieuwe aanvraag opvolgen",
        dueDate: todayPlus(0),
        note: `Automatisch aangemaakt. Leadscore ${automation.score}/12. ${automation.note}`,
      });
    }

    // Stilgevallen: geen dagelijkse opvolging meer, wel één taak om te
    // beslissen. De sleutel bevat de datum van de laatste activiteit, zodat een
    // lead die later opnieuw stilvalt weer een nieuwe taak krijgt.
    if (automation.stale && automation.lastActivity) {
      const sinds = addDaysAmsterdam(0, automation.lastActivity);
      await upsertAutomationTask({
        lead,
        key: `auto-stilgevallen-${sinds}`,
        title: "Stilgevallen: nog interesse? Bellen of archiveren",
        dueDate: addDaysAmsterdam(STALE_AFTER_DAYS, automation.lastActivity),
        note: `Automatisch aangemaakt. Sinds ${sinds} geen contact of activiteit. Bel nog één keer of zet de lead op Afgerond / Gearchiveerd; daarna verdwijnt hij uit de dagelijkse opvolging.`,
      });
    }

    await closeResolvedAutomationTasks({ leadId: lead.id });

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
           public_last_viewed_at = now(),
           public_view_count = coalesce(public_view_count, 0) + 1,
           status = case when status = 'Verzonden' then 'Bekeken' else status end,
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
             automation_follow_up_at = ${SQL_TODAY_NL},
             next_follow_up_at = coalesce(manual_follow_up_at, ${SQL_TODAY_NL}),
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

/**
 * Herberekent de automatisering voor een blok leads.
 *
 * Elke lead kost een handvol queries, dus een onbegrensde loop tikt op Vercel
 * de functielimiet af en je weet dan niet welk deel wel is verwerkt. Daarom:
 * - alleen actieve leads (gearchiveerde hoeven niet opnieuw berekend te worden);
 * - oudste `last_automation_at` eerst, zodat elke volgende run vanzelf de rest
 *   oppakt en het geheel zelf-vervolgend is;
 * - een tijdsbudget dat ruim onder de functielimiet blijft.
 */
export async function refreshAllLeadAutomation(limit = 200, budgetMs = 20000) {
  const started = Date.now();

  // Eerst set-gewijs opschonen over alle leads, ook de gearchiveerde: die
  // worden hieronder niet meer herberekend, maar hun open taken moeten wel weg.
  const closedTasks = await closeResolvedAutomationTasks();

  try {
    const { rows } = await query(
      `select id from leads
        where coalesce(status, 'Nieuw') <> all($1)
        order by last_automation_at asc nulls first
        limit $2`,
      [INACTIVE_LEAD_STATUSES, Math.min(Number(limit) || 200, 200)]
    );

    let processed = 0;
    for (const row of rows) {
      if (Date.now() - started > budgetMs) break;
      await refreshLeadAutomation(row);
      processed += 1;
    }

    return { processed, remaining: rows.length - processed, closedTasks };
  } catch (error) {
    console.error("Bulk-automatisering overgeslagen:", error.message);
    return { processed: 0, remaining: 0, closedTasks, error: error.message };
  }
}
