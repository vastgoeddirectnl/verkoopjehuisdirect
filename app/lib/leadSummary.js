// Korte samenvatting van een lead voor meldingen (onderwerpregel en kop van de
// interne mail). Puur, zodat het testbaar is; mail.js en leadFlow.js gebruiken
// dezelfde functie, zodat de mail en het mail-log hetzelfde onderwerp tonen.

import { leadChannel } from "./sourceParser.js";
import { isInWerkgebied, normalizeProvince } from "./address.js";

const NIETSZEGGEND = ["", "geen bijzonderheden", "niet ingevuld", "anders"];

export function werkgebiedLabel(lead) {
  const binnen = isInWerkgebied(lead?.provincie);
  if (binnen === null) return "";
  return binnen ? "binnen werkgebied" : `buiten werkgebied (${normalizeProvince(lead.provincie)})`;
}

export function internalLeadSubject(lead = {}) {
  const plek = lead.plaats || lead.postcode || "";
  const buiten = isInWerkgebied(lead.provincie) === false ? " (buiten werkgebied)" : "";
  const situatie = NIETSZEGGEND.includes(String(lead.staat || "").trim().toLowerCase()) ? "" : String(lead.staat).trim();
  const kanaal = leadChannel(lead);

  return [
    `Nieuwe aanvraag${plek ? `: ${plek}${buiten}` : ""}`,
    situatie,
    kanaal && kanaal !== "Onbekend" ? `via ${kanaal}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
