// Adrescontrole via de PDOK Locatieserver (het officiële adressenregister) en
// het werkgebied. Gebruikt door /api/address (formulier op de homepage) en,
// sinds 5.7.0, door de server bij élke aanvraag: dan staan plaats, gemeente en
// provincie bij de lead, ook als die via een landingspagina binnenkwam.

// Het werkgebied. Flevoland hoort er sinds 5.7.0 bij.
export const WERKGEBIED_PROVINCIES = ["Groningen", "Friesland", "Drenthe", "Overijssel", "Flevoland"];

const PDOK_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";

/** PDOK schrijft "Fryslân"; overal elders heet de provincie Friesland. */
export function normalizeProvince(name = "") {
  const value = String(name || "").trim();
  if (/^frysl[aâ]n$/i.test(value)) return "Friesland";
  return value;
}

/**
 * true/false als de provincie bekend is, null als dat niet zo is (dan valt er
 * niets te zeggen en mag de score er niet op afrekenen).
 */
export function isInWerkgebied(provincie) {
  const value = normalizeProvince(provincie);
  if (!value) return null;
  return WERKGEBIED_PROVINCIES.some((name) => name.toLowerCase() === value.toLowerCase());
}

/** Zet één PDOK-document om naar ons adresformaat. Puur, voor de tests. */
export function addressFromPdokDoc(doc, { postcode = "", huisnummer = "" } = {}) {
  if (!doc) return null;
  const house = [doc.huisnummer, doc.huisletter, doc.huisnummertoevoeging].filter(Boolean).join("");
  return {
    street: doc.straatnaam || "",
    houseNumber: house || huisnummer,
    postcode: doc.postcode || postcode,
    city: doc.woonplaatsnaam || "",
    municipality: doc.gemeentenaam || "",
    province: normalizeProvince(doc.provincienaam),
    display:
      doc.weergavenaam ||
      [doc.straatnaam, house, doc.postcode, doc.woonplaatsnaam].filter(Boolean).join(" "),
  };
}

/**
 * Zoekt een adres op. Geeft null terug als het niet gevonden wordt of PDOK
 * niet (op tijd) antwoordt: een adrescontrole mag nooit een aanvraag kosten.
 */
export async function lookupAddress(postcode, huisnummer, { timeoutMs = 3000, revalidate = 86400 } = {}) {
  const pc = String(postcode || "").toUpperCase().replace(/\s+/g, "");
  const nr = String(huisnummer || "").trim().slice(0, 20);
  if (!/^\d{4}[A-Z]{2}$/.test(pc) || !nr) return null;

  const url = new URL(PDOK_URL);
  url.searchParams.set("q", `${pc} ${nr}`);
  url.searchParams.set("fq", "type:adres");
  url.searchParams.set("rows", "1");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      next: { revalidate },
    });
    if (!response.ok) return null;
    const data = await response.json().catch(() => ({}));
    return addressFromPdokDoc(data?.response?.docs?.[0], { postcode: pc, huisnummer: nr });
  } catch (error) {
    console.warn("Adrescontrole overgeslagen:", error.message);
    return null;
  }
}
