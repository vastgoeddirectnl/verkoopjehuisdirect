import test from "node:test";
import assert from "node:assert/strict";

import { runCreateLead, runSendLeadMails } from "../app/lib/leadFlow.js";

/**
 * Het kritieke pad: een ingevuld formulier hoort in de database te belanden en
 * daarna pas mail op te leveren. Dit was tot 5.4.0 het enige belangrijke stuk
 * zonder test — de validatie, de query en de bedragen waren gedekt, de keten
 * zelf niet.
 */

const geldig = {
  naam: "Rob Schiphuis",
  telefoon: "06 12 23 80 51",
  postcode: "9501 ab",
  huisnummer: "14",
  email: "rob@example.nl",
};

/** Bouwt deps die vastleggen wat er in welke volgorde is aangeroepen. */
function maakDeps(overschrijf = {}) {
  const volgorde = [];
  const deps = {
    findDuplicate: async (lead) => {
      volgorde.push(`findDuplicate:${lead.postcode}`);
      return null;
    },
    insertLead: async (lead) => {
      volgorde.push("insertLead");
      return { id: "lead-1", ...lead };
    },
    refreshAutomation: async (rij) => {
      volgorde.push("refreshAutomation");
      return { ...rij, lead_score: 7 };
    },
    sendMails: async () => {
      volgorde.push("sendMails");
      return { internal: { id: "m1" }, applicant: { id: "m2" } };
    },
    ...overschrijf,
  };
  return { deps, volgorde };
}

// ---------- de keten ----------

test("een geldige aanvraag doorloopt de stappen in de juiste volgorde", async () => {
  const { deps, volgorde } = maakDeps();
  const result = await runCreateLead(geldig, deps);

  assert.deepEqual(volgorde, ["findDuplicate:9501AB", "insertLead", "refreshAutomation", "sendMails"]);
  assert.equal(result.lead.id, "lead-1");
  assert.equal(result.lead.lead_score, 7, "de automatiseringsuitkomst wint van de ruwe rij");
});

test("de invoer wordt genormaliseerd vóór het opslaan", async () => {
  let opgeslagen = null;
  const { deps } = maakDeps({ insertLead: async (lead) => { opgeslagen = lead; return { id: "x", ...lead }; } });
  await runCreateLead({ ...geldig, email: "  ROB@Example.NL ", postcode: "9501 ab" }, deps);

  assert.equal(opgeslagen.postcode, "9501AB");
  assert.equal(opgeslagen.email, "rob@example.nl");
  assert.equal(opgeslagen.pagina, "/", "standaardwaarden worden ingevuld");
  assert.equal(opgeslagen.bron, "direct");
});

test("een ongeldige aanvraag wordt niet opgeslagen en niet gemaild", async () => {
  const { deps, volgorde } = maakDeps();
  await assert.rejects(
    () => runCreateLead({ naam: "R" }, deps),
    (err) => err.status === 400 && /Verplichte velden/.test(err.message)
  );
  assert.deepEqual(volgorde, [], "er mag niets naar de database of de mail");
});

test("een dubbele aanvraag levert geen tweede rij en geen tweede mail op", async () => {
  const bestaand = { id: "bestaand-1", naam: "Rob Schiphuis" };
  const { deps, volgorde } = maakDeps({ findDuplicate: async () => bestaand });

  const result = await runCreateLead(geldig, deps);

  assert.equal(result.lead, bestaand);
  assert.equal(result.mail.duplicate, true);
  assert.deepEqual(volgorde, [], "na een duplicaat stopt de keten");
});

test("met sendMail=false wordt de lead wel opgeslagen maar niet gemaild", async () => {
  const { deps, volgorde } = maakDeps();
  const result = await runCreateLead(geldig, deps, { sendMail: false });

  assert.deepEqual(volgorde, ["findDuplicate:9501AB", "insertLead", "refreshAutomation"]);
  assert.equal(result.mail.deferred, true);
  assert.equal(result.lead.id, "lead-1");
});

test("een falende automatisering kost de lead niet", async () => {
  const { deps } = maakDeps({ refreshAutomation: async () => null });
  const result = await runCreateLead(geldig, deps);

  assert.equal(result.lead.id, "lead-1", "de opgeslagen rij blijft het resultaat");
});

test("een falende database laat de fout door, zodat de route een 500 kan geven", async () => {
  const { deps } = maakDeps({ insertLead: async () => { throw new Error("connectie weg"); } });
  await assert.rejects(() => runCreateLead(geldig, deps), /connectie weg/);
});

// ---------- de twee mails ----------

function maakMailDeps(overschrijf = {}) {
  const logs = [];
  const fouten = [];
  const deps = {
    sendInternal: async () => ({ id: "intern-1" }),
    sendApplicant: async () => ({ id: "klant-1" }),
    logMail: async (entry) => { logs.push(entry); },
    onError: async (info) => { fouten.push(info.scope); },
    internalRecipient: "info@vastgoeddirectnederland.nl",
    ...overschrijf,
  };
  return { deps, logs, fouten };
}

const lead = { id: "lead-1", postcode: "9501AB", email: "rob@example.nl" };

test("beide mails worden verstuurd en gelogd", async () => {
  const { deps, logs, fouten } = maakMailDeps();
  const mail = await runSendLeadMails(lead, deps);

  assert.equal(mail.internal.id, "intern-1");
  assert.equal(mail.applicant.id, "klant-1");
  assert.deepEqual(logs.map((l) => [l.type, l.status]), [
    ["interne melding", "Verzonden"],
    ["ontvangstbevestiging", "Verzonden"],
  ]);
  assert.deepEqual(fouten, []);
  assert.match(logs[0].subject, /9501AB/, "de postcode staat in het onderwerp");
});

test("een mislukte interne melding houdt de bevestiging aan de klant niet tegen", async () => {
  const { deps, logs, fouten } = maakMailDeps({
    sendInternal: async () => { throw new Error("Resend down"); },
  });
  const mail = await runSendLeadMails(lead, deps);

  assert.match(mail.internal.error, /Resend down/);
  assert.equal(mail.applicant.id, "klant-1", "de klant krijgt zijn bevestiging alsnog");
  assert.deepEqual(fouten, ["lead/interne-melding"], "de storing wordt gemeld");
  assert.deepEqual(logs.map((l) => l.status), ["Fout", "Verzonden"]);
});

test("een mislukte bevestiging aan de klant blokkeert de interne melding niet", async () => {
  const { deps, logs, fouten } = maakMailDeps({
    sendApplicant: async () => { throw new Error("ongeldig adres"); },
  });
  const mail = await runSendLeadMails(lead, deps);

  assert.equal(mail.internal.id, "intern-1");
  assert.match(mail.applicant.error, /ongeldig adres/);
  assert.deepEqual(fouten, ["lead/ontvangstbevestiging"]);
  assert.deepEqual(logs.map((l) => l.status), ["Verzonden", "Fout"]);
});

test("als beide mails falen wordt er twee keer gemeld en twee keer gelogd", async () => {
  const { deps, logs, fouten } = maakMailDeps({
    sendInternal: async () => { throw new Error("a"); },
    sendApplicant: async () => { throw new Error("b"); },
  });
  await runSendLeadMails(lead, deps);

  assert.deepEqual(fouten, ["lead/interne-melding", "lead/ontvangstbevestiging"]);
  assert.deepEqual(logs.map((l) => l.status), ["Fout", "Fout"]);
});

test("een overgeslagen mail wordt als overgeslagen gelogd, niet als fout", async () => {
  const { deps, logs, fouten } = maakMailDeps({
    sendApplicant: async () => ({ skipped: true, reason: "Geen e-mailadres" }),
  });
  await runSendLeadMails(lead, deps);

  assert.deepEqual(logs.map((l) => l.status), ["Verzonden", "Overgeslagen"]);
  assert.equal(logs[1].error, "Geen e-mailadres");
  assert.deepEqual(fouten, [], "overslaan is geen storing");
});
