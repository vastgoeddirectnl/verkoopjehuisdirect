import test from "node:test";
import assert from "node:assert/strict";

import {
  addDaysAmsterdam,
  daysUntilAmsterdam,
  formatDateNL,
  isExpiredAmsterdam,
  normalizeDateOnly,
  todayAmsterdam,
  validityStatus,
} from "../app/lib/date.js";

/**
 * De geldigheidsdatum van een voorstel wordt in Europe/Amsterdam gerekend.
 * De zomertijdgrens van 2026 valt op zondag 29 maart: om 02:00 lokale tijd
 * gaat de klok een uur vooruit. Die dag duurt 23 uur, en dat is precies waar
 * een naïeve millisecondenberekening een dag naast gaat zitten.
 */
const NACHT_VOOR_ZOMERTIJD = new Date("2026-03-28T23:30:00Z"); // = 29 maart 00:30 in Amsterdam

test("todayAmsterdam gebruikt de Amsterdamse kalenderdag, niet de UTC-dag", () => {
  assert.equal(todayAmsterdam(NACHT_VOOR_ZOMERTIJD), "2026-03-29");
  assert.equal(todayAmsterdam(new Date("2026-06-15T10:00:00Z")), "2026-06-15");
});

test("addDaysAmsterdam telt kalenderdagen op over de zomertijdgrens heen", () => {
  assert.equal(addDaysAmsterdam(0, NACHT_VOOR_ZOMERTIJD), "2026-03-29");
  assert.equal(addDaysAmsterdam(1, NACHT_VOOR_ZOMERTIJD), "2026-03-30");
  assert.equal(addDaysAmsterdam(2, NACHT_VOOR_ZOMERTIJD), "2026-03-31");
});

test("daysUntilAmsterdam telt hele dagen, ook als de dag 23 uur duurt", () => {
  assert.equal(daysUntilAmsterdam("2026-03-29", NACHT_VOOR_ZOMERTIJD), 0);
  assert.equal(daysUntilAmsterdam("2026-03-30", NACHT_VOOR_ZOMERTIJD), 1);
  assert.equal(daysUntilAmsterdam("2026-03-28", NACHT_VOOR_ZOMERTIJD), -1);
  assert.equal(daysUntilAmsterdam(null, NACHT_VOOR_ZOMERTIJD), null);
});

test("isExpiredAmsterdam is pas waar vanaf de dag ná de geldigheidsdatum", () => {
  assert.equal(isExpiredAmsterdam("2026-03-29", NACHT_VOOR_ZOMERTIJD), false);
  assert.equal(isExpiredAmsterdam("2026-03-28", NACHT_VOOR_ZOMERTIJD), true);
  assert.equal(isExpiredAmsterdam(null, NACHT_VOOR_ZOMERTIJD), false);
});

test("normalizeDateOnly accepteert ISO, Nederlands en lege invoer", () => {
  assert.equal(normalizeDateOnly("2026-03-29"), "2026-03-29");
  assert.equal(normalizeDateOnly("2026-03-29T10:00:00Z"), "2026-03-29");
  assert.equal(normalizeDateOnly("29-03-2026"), "2026-03-29");
  assert.equal(normalizeDateOnly("29/03/2026"), "2026-03-29");
  assert.equal(normalizeDateOnly("1-3-2026"), "2026-03-01");
  assert.equal(normalizeDateOnly(""), null);
  assert.equal(normalizeDateOnly("geen datum"), null);
});

test("formatDateNL geeft een Nederlandse datum en een instelbare fallback", () => {
  assert.equal(formatDateNL("2026-03-29"), "29 maart 2026");
  assert.equal(formatDateNL(""), "-");
  assert.equal(formatDateNL("", { fallback: "" }), "");
});

test("validityStatus benoemt vandaag, bijna verlopen en verlopen apart", () => {
  assert.deepEqual(validityStatus("2026-03-29", NACHT_VOOR_ZOMERTIJD), {
    days: 0,
    label: "Loopt vandaag af",
    state: "urgent",
  });

  const overDrieDagen = validityStatus("2026-04-01", NACHT_VOOR_ZOMERTIJD);
  assert.equal(overDrieDagen.days, 3);
  assert.equal(overDrieDagen.state, "urgent");
  assert.equal(overDrieDagen.label, "Nog 3 dagen geldig");

  const ruimGeldig = validityStatus("2026-04-12", NACHT_VOOR_ZOMERTIJD);
  assert.equal(ruimGeldig.state, "active");

  const verlopen = validityStatus("2026-03-20", NACHT_VOOR_ZOMERTIJD);
  assert.equal(verlopen.state, "expired");
  assert.equal(verlopen.label, "Dit voorstel is verlopen");

  assert.equal(validityStatus(null, NACHT_VOOR_ZOMERTIJD).state, "unknown");
});

test("enkelvoud en meervoud van 'dag' kloppen", () => {
  assert.equal(validityStatus("2026-03-30", NACHT_VOOR_ZOMERTIJD).label, "Nog 1 dag geldig");
  assert.equal(validityStatus("2026-03-31", NACHT_VOOR_ZOMERTIJD).label, "Nog 2 dagen geldig");
});
