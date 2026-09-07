// Centrale reviewgegevens. Niet automatisch opgehaald — Google levert deze
// cijfers niet zonder API-koppeling, dus ze staan hier handmatig.
//
// ⚠️ CONTROLEER DIT HANDMATIG voordat je een release deployt.
// Een score of aantal dat niet klopt met wat er op Google staat is een
// misleidende claim, ook als het verschil klein is. Bij twijfel: leeg laten.
// De ProofBar toont het reviewblok alleen als rating én count zijn ingevuld;
// een lege waarde laat het blok netjes weg in plaats van "0 reviews" of een
// lege sterrenbalk te tonen.
//
// Laatst gecontroleerd: nog niet vastgelegd — vul dit in bij de eerste controle.

export const reviewData = {
  rating: "5,0",
  count: "2 reviews",
  source: "Google",
  url: "https://www.google.com/search?q=reviews+voor+Vastgoed+Direct+Nederland",
  // Datum van de laatste handmatige controle, als "2026-09-07". Leeg = nooit
  // gecontroleerd sinds deze regel bestaat.
  checkedOn: "",
};

/**
 * Alleen tonen als er echt iets te tonen is. Zo verschijnt er nooit een
 * reviewclaim die niet is ingevuld of niet is onderbouwd.
 */
export function hasReviewData(data = reviewData) {
  return Boolean(String(data?.rating || "").trim() && String(data?.count || "").trim());
}

export function reviewDisplayText(data = reviewData) {
  if (!hasReviewData(data)) return "";
  return `${data.source} · ${data.count}`;
}
