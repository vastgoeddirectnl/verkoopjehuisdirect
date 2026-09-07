import test from "node:test";
import assert from "node:assert/strict";

import {
  customerActionCopy,
  isCustomerAction,
  isCustomerActionHandled,
  isLeadCustomerActionHandled,
  latestCustomerProposalAction,
  leadCustomerActionPriority,
  sortedCustomerProposalActions,
  timelinePrefix,
} from "../app/lib/admin/customerActions.js";

const uur = 3600000;
const nu = Date.parse("2026-09-07T12:00:00Z");
const op = (msGeleden) => new Date(nu - msGeleden).toISOString();

const actie = (type, msGeleden) => ({ event_type: type, created_at: op(msGeleden) });

test("alleen de drie klantacties tellen als klantactie", () => {
  for (const type of ["interested", "discuss", "question"]) {
    assert.equal(isCustomerAction({ event_type: type }), true, type);
  }
  for (const type of ["view", "print", "pdf", "admin_whatsapp_sent", "admin_customer_action_resolved", undefined]) {
    assert.equal(isCustomerAction({ event_type: type }), false, String(type));
  }
});

test("een klantactie zonder contactmoment staat open", () => {
  assert.equal(isCustomerActionHandled(actie("discuss", 2 * uur), { last_contact_at: null }), false);
});

test("contact ná de klantactie handelt die af", () => {
  const lead = { last_contact_at: op(1 * uur) };
  assert.equal(isCustomerActionHandled(actie("discuss", 2 * uur), lead), true);
});

test("contact vóór de klantactie handelt die niet af", () => {
  const lead = { last_contact_at: op(3 * uur) };
  assert.equal(isCustomerActionHandled(actie("discuss", 2 * uur), lead), false);
});

test("contact op exact hetzelfde moment telt als afgehandeld", () => {
  const moment = op(2 * uur);
  assert.equal(isCustomerActionHandled({ event_type: "question", created_at: moment }, { last_contact_at: moment }), true);
});

test("de leadvariant gebruikt last_interest_at", () => {
  assert.equal(isLeadCustomerActionHandled({ last_interest_at: op(2 * uur), last_contact_at: op(1 * uur) }), true);
  assert.equal(isLeadCustomerActionHandled({ last_interest_at: op(1 * uur), last_contact_at: op(2 * uur) }), false);
  assert.equal(isLeadCustomerActionHandled({ last_interest_at: null, last_contact_at: op(1 * uur) }), false);
  assert.equal(isLeadCustomerActionHandled({}), false);
});

test("de nieuwste openstaande klantactie wordt gekozen, niet de nieuwste überhaupt", () => {
  const lead = { last_contact_at: op(2 * uur) };
  const events = [actie("question", 1 * uur), actie("interested", 3 * uur), actie("discuss", 5 * uur)];

  // De actie van 3 en 5 uur geleden zijn afgehandeld (contact 2 uur geleden).
  assert.equal(latestCustomerProposalAction(events, lead).event_type, "question");
  assert.equal(latestCustomerProposalAction(events, lead, { includeHandled: true }).event_type, "question");

  // Zonder de recente actie blijft er niets open.
  const alleenOud = [actie("interested", 3 * uur), actie("discuss", 5 * uur)];
  assert.equal(latestCustomerProposalAction(alleenOud, lead), null);
  assert.equal(latestCustomerProposalAction(alleenOud, lead, { includeHandled: true }).event_type, "interested");
});

test("sorteren gaat nieuwste eerst en filtert niet-klantacties weg", () => {
  const events = [actie("view", 1 * uur), actie("discuss", 5 * uur), actie("question", 2 * uur)];
  const gesorteerd = sortedCustomerProposalActions(events);
  assert.deepEqual(gesorteerd.map((e) => e.event_type), ["question", "discuss"]);
});

test("het actiecentrum geeft een afgehandelde klantactie geen prioriteit meer", () => {
  const open = { interest_status: "Positief", last_interest_at: op(2 * uur), last_contact_at: null };
  const afgehandeld = { interest_status: "Positief", last_interest_at: op(2 * uur), last_contact_at: op(1 * uur) };

  assert.equal(leadCustomerActionPriority(open, 2).priority, 100);
  assert.equal(leadCustomerActionPriority(afgehandeld, 2), null);
});

test("elke klantactiesoort heeft zijn eigen prioriteit en venster", () => {
  const lead = (status) => ({ interest_status: status, last_interest_at: op(2 * uur), last_contact_at: null });

  assert.equal(leadCustomerActionPriority(lead("Positief"), 2).priority, 100);
  assert.equal(leadCustomerActionPriority(lead("Bespreken"), 2).priority, 98);
  assert.equal(leadCustomerActionPriority(lead("Vraag"), 2).priority, 96);

  // Buiten het venster: positief 24 uur, de andere twee 72 uur.
  assert.equal(leadCustomerActionPriority(lead("Positief"), 25), null);
  assert.equal(leadCustomerActionPriority(lead("Bespreken"), 25).priority, 98);
  assert.equal(leadCustomerActionPriority(lead("Bespreken"), 73), null);
});

test("een onbekende of lege interest_status geeft geen actie", () => {
  for (const status of ["", null, undefined, "Onbekend", "verzonden"]) {
    assert.equal(leadCustomerActionPriority({ interest_status: status, last_interest_at: op(1 * uur) }, 1), null);
  }
});

test("de tijdlijn benoemt open en afgehandelde acties verschillend", () => {
  const openLead = { last_contact_at: null };
  const geslotenLead = { last_contact_at: op(1 * uur) };

  assert.equal(timelinePrefix(actie("discuss", 2 * uur), openLead), "Actie nodig: ");
  assert.equal(timelinePrefix(actie("discuss", 2 * uur), geslotenLead), "Afgehandeld: ");
  // Niet-klantacties krijgen geen aanduiding.
  assert.equal(timelinePrefix(actie("view", 2 * uur), openLead), "");
});

test("elke klantactiesoort heeft eigen tekst voor de admin", () => {
  const teksten = ["interested", "discuss", "question"].map((t) => customerActionCopy({ event_type: t }));
  assert.equal(new Set(teksten.map((c) => c.title)).size, 3);
  for (const c of teksten) {
    assert.equal(c.badge, "Klantactie");
    assert.ok(c.detail.length > 40);
  }
  assert.equal(customerActionCopy(null), null);
});
