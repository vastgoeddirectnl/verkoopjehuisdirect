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
// Laatst gecontroleerd: 3 oktober 2026 (Google-bedrijfsprofiel: 5,0 uit 2 reviews).

export const reviewData = {
  rating: "5,0",
  count: "2 reviews",
  source: "Google",
  // Het Google-bedrijfsprofiel zelf (via de CID), niet langer een algemene
  // zoekopdracht waarin ook andere bedrijven opdoken.
  url: "https://maps.google.com/?cid=8485707078036114537",
  // Directe "Review schrijven"-link uit het Google-bedrijfsprofiel
  // (Bedrijfsprofiel → "Om reviews vragen" → link kopiëren, vorm
  // https://g.page/r/.../review). Leeg = de knop in de admin gebruikt de
  // profiellink hierboven, waar de klant zelf op "Een review schrijven" klikt.
  writeReviewUrl: "https://g.page/r/CWlMXNagScN1EAE/review",
  // Datum van de laatste handmatige controle, als "2026-09-07". Leeg = nooit
  // gecontroleerd sinds deze regel bestaat.
  checkedOn: "2026-10-03",
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

/** Link die een klant krijgt bij het verzoek om een review (zie writeReviewUrl). */
export function reviewRequestUrl(data = reviewData) {
  return String(data?.writeReviewUrl || "").trim() || data?.url || "";
}
