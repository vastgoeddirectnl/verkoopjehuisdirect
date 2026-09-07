// Klantacties vanaf de openbare voorstelpagina: wanneer is er iets te doen,
// en wanneer is het afgehandeld?
//
// Deze regel stond op drie plekken los gedefinieerd — in leadDetail.js, in
// LeadTimeline.jsx en inline in het actiecentrum op app/admin/page.jsx — met
// telkens dezelfde bedoeling maar een eigen implementatie. Nu één bron, zodat
// het dashboard, de tijdlijn en het leaddetail niet uit elkaar kunnen lopen.
//
// De regel zelf: een klantactie is afgehandeld zodra er een contactmoment is
// vastgelegd op of ná die actie. Het contactmoment is dus de bevestiging, niet
// het openen van het voorstel of het versturen van een mail.

export const CUSTOMER_PROPOSAL_ACTION_TYPES = ["interested", "discuss", "question"];

// De labels zoals ze uit proposals.interest_status komen (kleine letters).
const INTEREST_STATUS_COPY = {
  positief: {
    priority: 100,
    maxAgeHours: 24,
    reason: "Klant gaf in de afgelopen 24 uur aan verder te willen",
  },
  bespreken: {
    priority: 98,
    maxAgeHours: 72,
    reason: "Klant wil het voorstel bespreken — opvolgen",
  },
  vraag: {
    priority: 96,
    maxAgeHours: 72,
    reason: "Klant heeft een vraag over het voorstel — opvolgen",
  },
};

export function timestampMs(value) {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isFinite(time) ? time : null;
}

export function isCustomerAction(event) {
  return CUSTOMER_PROPOSAL_ACTION_TYPES.includes(event?.event_type);
}

/** De kale regel: is er ná `actionAt` contact vastgelegd? */
export function isHandledAt(actionAt, contactAt) {
  const actie = timestampMs(actionAt);
  const contact = timestampMs(contactAt);
  return Boolean(actie && contact && contact >= actie);
}

/** Voor een concrete gebeurtenis uit proposal_events. */
export function isCustomerActionHandled(event, lead) {
  return isHandledAt(event?.created_at, lead?.last_contact_at);
}

/**
 * Voor een rij uit het leadoverzicht, dat geen losse events kent maar wel
 * last_interest_at (de meest recente klantactie over alle voorstellen heen).
 */
export function isLeadCustomerActionHandled(lead) {
  return isHandledAt(lead?.last_interest_at, lead?.last_contact_at);
}

export function sortedCustomerProposalActions(events = []) {
  return [...events]
    .filter(isCustomerAction)
    .sort((a, b) => (timestampMs(b.created_at) || 0) - (timestampMs(a.created_at) || 0));
}

export function latestCustomerProposalAction(events = [], lead, { includeHandled = false } = {}) {
  const actions = sortedCustomerProposalActions(events);
  if (includeHandled) return actions[0] || null;
  return actions.find((event) => !isCustomerActionHandled(event, lead)) || null;
}

/**
 * Prioriteit en reden voor het actiecentrum op het dashboard. Geeft null
 * terug zodra de actie is afgehandeld of te lang geleden is, zodat een
 * afgehandelde klantactie nooit opnieuw als openstaand bovenaan komt.
 */
export function leadCustomerActionPriority(lead, ageHours) {
  if (isLeadCustomerActionHandled(lead)) return null;
  const status = String(lead?.interest_status || "").trim().toLowerCase();
  const copy = INTEREST_STATUS_COPY[status];
  if (!copy) return null;
  if (!(ageHours <= copy.maxAgeHours)) return null;
  return { priority: copy.priority, reason: copy.reason };
}

export function customerActionCopy(event) {
  if (!event) return null;
  if (event.event_type === "interested") {
    return {
      tone: "positive",
      badge: "Klantactie",
      title: "Klant wil verder met het voorstel",
      detail: "Deze klant heeft via de voorstelpagina aangegeven verder te willen. Volg dit direct op en bespreek de vervolgstappen richting koopovereenkomst.",
    };
  }
  if (event.event_type === "discuss") {
    return {
      tone: "discuss",
      badge: "Klantactie",
      title: "Klant wil het voorstel bespreken",
      detail: "Deze klant heeft via de voorstelpagina gevraagd om het voorstel te bespreken. Behandel dit als actieve opvolging, niet alleen als logregel.",
    };
  }
  return {
    tone: "question",
    badge: "Klantactie",
    title: "Klant heeft een vraag over het voorstel",
    detail: "Deze klant heeft via de voorstelpagina een vraag of opmerking ingestuurd. Neem contact op en leg het contactmoment vast.",
  };
}

/** Prefix voor de tijdlijn: historisch compleet, maar wel met de status erbij. */
export function timelinePrefix(event, lead) {
  if (!isCustomerAction(event)) return "";
  return isCustomerActionHandled(event, lead) ? "Afgehandeld: " : "Actie nodig: ";
}
