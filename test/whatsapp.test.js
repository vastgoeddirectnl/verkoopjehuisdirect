import test from "node:test";
import assert from "node:assert/strict";

import {
  WHATSAPP_NOTICES,
  WHATSAPP_PREPARED,
  WHATSAPP_SENT,
  prepareWhatsapp,
} from "../app/lib/admin/whatsapp.js";

/**
 * De volgorde is de hele reden dat deze helper bestaat: de
 * voorstelbeheerpagina vuurde de logactie af zonder erop te wachten en opende
 * tegelijk het tabblad, waardoor de fetch kon sneuvelen.
 */

test("de actie wordt gelogd vóórdat WhatsApp opent", async () => {
  const volgorde = [];
  await prepareWhatsapp({
    url: "https://wa.me/31612238051?text=hoi",
    log: async () => {
      volgorde.push("log-start");
      await new Promise((r) => setTimeout(r, 5));
      volgorde.push("log-klaar");
    },
    open: () => {
      volgorde.push("open");
      return true;
    },
  });

  assert.deepEqual(volgorde, ["log-start", "log-klaar", "open"]);
});

test("de opgegeven url wordt ongewijzigd geopend", async () => {
  const url = "https://wa.me/31612238051?text=Hallo%20Rob";
  let geopend = null;
  await prepareWhatsapp({ url, log: async () => {}, open: (u) => { geopend = u; return true; } });
  assert.equal(geopend, url);
});

test("zonder url gebeurt er niets", async () => {
  let gelogd = false;
  let geopend = false;
  for (const url of ["", null, undefined]) {
    const result = await prepareWhatsapp({
      url,
      log: async () => { gelogd = true; },
      open: () => { geopend = true; return true; },
    });
    assert.deepEqual(result, { opened: false, logged: false });
  }
  assert.equal(gelogd, false, "er mag niet gelogd worden zonder bericht");
  assert.equal(geopend, false);
});

test("een mislukte logactie blokkeert het openen niet, maar wordt wel gemeld", async () => {
  let geopend = false;
  const result = await prepareWhatsapp({
    url: "https://wa.me/31612238051",
    log: async () => { throw new Error("netwerk weg"); },
    open: () => { geopend = true; return true; },
  });

  assert.equal(geopend, true, "de admin moet de klant kunnen bereiken");
  assert.equal(result.logged, false);
  assert.equal(result.opened, true);
  assert.match(result.error.message, /netwerk weg/);
});

test("een ontbrekende logfunctie is toegestaan", async () => {
  const result = await prepareWhatsapp({ url: "https://wa.me/31", open: () => true });
  assert.equal(result.logged, true);
  assert.equal(result.opened, true);
});

test("voorbereiden en verzenden hebben eigen, niet uitwisselbare teksten", () => {
  assert.match(WHATSAPP_NOTICES[WHATSAPP_PREPARED], /voorbereid/i);
  assert.doesNotMatch(
    WHATSAPP_NOTICES[WHATSAPP_PREPARED],
    /is verzonden|verzonden\./i,
    "voorbereiden mag nooit als verzonden worden gemeld"
  );
  assert.match(WHATSAPP_NOTICES[WHATSAPP_SENT], /handmatig/i);
  assert.match(WHATSAPP_NOTICES[WHATSAPP_SENT], /verzonden/i);
});
