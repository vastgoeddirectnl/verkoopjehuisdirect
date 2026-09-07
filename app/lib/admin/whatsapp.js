// Gedeelde WhatsApp-flow voor de adminomgeving.
//
// De volgorde is bewust: eerst de actie vastleggen, dan pas WhatsApp openen.
// Anders staat er in de tijdlijn een gat zodra iemand het tabblad meteen weer
// sluit, of raakt de fetch onderbroken doordat de browser naar het nieuwe
// tabblad springt. Op de voorstelbeheerpagina gebeurde dat laatste: die riep
// de logactie aan zonder erop te wachten.
//
// Terminologie (bewust gescheiden):
// - "voorbereid" / "geopend": de admin heeft het bericht klaargezet.
// - "verzonden": alleen als de admin dat zelf handmatig markeert. WhatsApp
//   geeft ons geen bevestiging, dus dat mogen we nooit zelf concluderen.

export const WHATSAPP_PREPARED = "prepared";
export const WHATSAPP_SENT = "sent";

export const WHATSAPP_NOTICES = {
  [WHATSAPP_PREPARED]: "WhatsApp-bericht voorbereid en geopend.",
  [WHATSAPP_SENT]: "WhatsApp-bericht is handmatig als verzonden gemarkeerd.",
};

export const WHATSAPP_LABELS = {
  prepare: "WhatsApp klant: voorstel staat klaar",
  markSent: "Markeer als handmatig verzonden",
};

function openInNieuwTabblad(url) {
  if (typeof window === "undefined") return false;
  const venster = window.open(url, "_blank", "noopener,noreferrer");
  if (venster) return true;
  // Popupblokkering: val terug op hetzelfde tabblad, zodat de admin niet met
  // een knop achterblijft die niets lijkt te doen.
  window.location.href = url;
  return true;
}

/**
 * Legt de WhatsApp-actie vast en opent daarna pas het bericht.
 *
 * Een mislukte logactie blokkeert het openen niet — de admin moet de klant
 * kunnen bereiken, ook als de tijdlijn even niet bereikbaar is. De aanroeper
 * krijgt terug of het loggen is gelukt, zodat die dat kan tonen.
 *
 * `open` is injecteerbaar zodat de volgorde te testen is zonder browser.
 */
export async function prepareWhatsapp({ url, log, open = openInNieuwTabblad }) {
  if (!url) return { opened: false, logged: false };

  let logged = false;
  let error = null;
  try {
    await log?.();
    logged = true;
  } catch (caught) {
    error = caught;
  }

  const opened = open(url);
  return { opened, logged, error };
}
