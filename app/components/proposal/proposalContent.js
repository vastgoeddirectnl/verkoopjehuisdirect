// Inhoudelijke/tekstuele helpers die het publieke voorstel en de admin-
// printversie delen (ARCH-01). Zie proposalFormat.js voor de bedrag- en
// getalopmaak.

import { daysUntilAmsterdam, formatDateNL } from "../../lib/date.js";

export function formatDate(dateValue) {
  return formatDateNL(dateValue, { fallback: "-" });
}

export function daysUntil(dateValue) {
  return daysUntilAmsterdam(dateValue);
}

// Beide pagina's riepen dit altijd al aan met een al-berekend aantal dagen
// (nooit met de ruwe datumwaarde), dus de simpelere vorm van de printpagina
// is hier de gedeelde implementatie.
export function validityStatusText(days) {
  if (days === null) return null;
  if (days < 0) return "Dit voorstel is verlopen";
  if (days === 0) return "Loopt vandaag af";
  return `Nog ${days} dag${days === 1 ? "" : "en"} geldig`;
}

// Alleen door de publieke pagina gebruikt (styling van het geldigheidsbadge).
export function validityStatusClass(days) {
  if (days === null) return "";
  if (days < 0) return " is-expired";
  if (days <= 3) return " is-urgent";
  return "";
}

const DEFAULT_NONBINDING_TEXT = "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid. Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.";

export const NO_BUYER_CONDITIONS_NOTICE_TITLE = "Meer zekerheid bij overeenstemming";
// Bewust kort en klantgericht: de precieze juridische formulering staat één
// keer in de slotbepaling (DEFAULT_NONBINDING_TEXT). Dit blok herhaalde die
// zin eerder woordelijk, waardoor de klant hem twee keer las.
export const NO_BUYER_CONDITIONS_NOTICE_TEXT = "Uw verkoop hangt dan niet af van financiering, keuringen of een andere verkoop die eerst rond moet komen. Wij kopen in beginsel zonder ontbindende voorbehouden aan onze kant; de precieze formulering staat in de slotbepaling onderaan dit voorstel.";

// Toelichting bij de kostenregels in de vergelijking. Stond in twee varianten
// in de code: een korte op de klantpagina en een langere in de print. Nu één
// tekst, zodat wat de klant online leest gelijk is aan wat er wordt afgedrukt.
export const COST_VAT_NOTE = "Makelaarskosten en overige verkoopkosten staan inclusief 21% btw, omdat ze ook zo in de netto-opbrengst zijn verwerkt. Onder afwikkelingskosten vallen alleen vooraf afgesproken kosten aan verkoperszijde, zoals volmacht of doorhaling van een hypotheekinschrijving. Kosten die bij kosten koper voor de koper zijn, staan er niet in.";

// De kern van de vergelijking, in één zin in plaats van drie.
export const COMPARISON_BASIS_NOTE = "De traditionele verkoopprijs is een indicatieve vergelijkingswaarde. Kosten voor herstel of voorbereiding staan er alleen in als ze nodig zijn om die prijs te halen.";
const INCLUDED_ASSURANCE_ITEM = "Meer zekerheid na overeenstemming";

export function ensureIncludedAssurance(items) {
  const list = (Array.isArray(items) ? items : []).map((item) => String(item || "").replace(/meer\s+zekerheid\s+na\s+akkoord/gi, INCLUDED_ASSURANCE_ITEM));
  const alreadyIncluded = list.some((item) => /meer\s+zekerheid\s+na\s+(?:akkoord|overeenstemming)|zonder\s+ontbindende\s+voorbehouden/i.test(String(item || "")));
  return alreadyIncluded ? list : [...list, INCLUDED_ASSURANCE_ITEM];
}

export function additionalSellerWorkCondition(rawValue) {
  const raw = String(rawValue || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  const standard = "Wanneer de werkzaamheden niet, niet volledig of niet deugdelijk zijn uitgevoerd, kan de aanvullende koopprijs worden verminderd met de redelijkerwijs benodigde kosten om de werkzaamheden alsnog te voltooien of te herstellen.";
  return raw.toLowerCase() === standard.toLowerCase() ? "" : raw;
}

export function cleanUseRentalNotes(rawValue) {
  let text = String(rawValue || "").replace(/\s+/g, " ").trim();
  if (!text) return "";

  text = text
    .replace(/Uitgangspunt van dit voorstel is dat het object bij juridische levering[^.]*wordt geleverd, tenzij schriftelijk anders overeengekomen\.\s*/gi, "")
    .replace(/Gevolg voor het voorstel:\s*Dit voorstel is gebaseerd op (?:de hierboven genoemde|deze) wijze van levering\.\s*Indien het object niet overeenkomstig deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan koper het voorstel herbeoordelen, aanpassen of laten vervallen\.\s*/gi, "")
    .replace(/Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming(?:, vergunningen, brandveiligheid en eventuele splitsingsmogelijkheden| en eventuele vergunningen)? vóór definitieve vastlegging gecontroleerd\.\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export function withNoBuyerConditionsText(rawValue) {
  const raw = String(rawValue || DEFAULT_NONBINDING_TEXT).replace(/\s+/g, " ").trim();
  const required = "Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.";
  if (/zonder\s+ontbindende\s+voorbehouden\s+aan\s+koperszijde/i.test(raw)) return raw;
  return `${raw} ${required}`.trim();
}

const SPECIAL_PROPOSAL_TYPES = ["Uitgestelde levering", "Overbruggingsoplossing", "ABC-doorverkoop mogelijk"];

export function isSpecialProposalType(type) {
  return SPECIAL_PROPOSAL_TYPES.includes(String(type || "").trim());
}

// De publieke tekst was ooit net iets anders dan de printtekst ("in de
// huidige staat" vs "in huidige staat"); dat kleine verschil bestond al
// vóór deze samenvoeging en blijft via `sameStateText` per variant behouden.
export function constructieChecks(proposal, { sameStateText = "Woning blijft tot levering in de huidige staat" } = {}) {
  const checks = [];
  if (proposal.allow_kadaster_registration) checks.push("Koopovereenkomst mag worden ingeschreven bij het Kadaster");
  if (proposal.allow_abc_resale) checks.push("ABC-doorverkoop mogelijk");
  if (proposal.seller_cooperates_resale) checks.push("Verkoper werkt mee aan taxatie, bezichtiging en voorbereiding doorverkoop");
  if (proposal.delivery_free_of_claims) checks.push("Levering vrij van huur, gebruik, beslagen en hypotheken");
  if (proposal.property_same_state) checks.push(sameStateText);
  return checks;
}

export function isObjectProposal(proposal) {
  const text = [
    proposal?.object_usage_type,
    proposal?.property_type,
    proposal?.current_situation,
  ].filter(Boolean).join(" ").toLowerCase();

  return /(woon\s*-?\s*winkelpand|gemengd|bedrijfspand|bedrijfsruimte|winkelruimte|winkelpand|kantoor|horeca|beleggingspand|object)/i.test(text);
}

// `gegevens` verschilt tekstueel per variant ("Objectgegevens" op de publieke
// pagina, "Gegevens object" op de printversie) — verder identiek.
export function objectTerms(proposal, variant = "public") {
  const objectProposal = isObjectProposal(proposal);
  const isPrint = variant === "print";
  return {
    lower: objectProposal ? "object" : "woning",
    lowerArticle: objectProposal ? "het object" : "de woning",
    possessive: objectProposal ? "uw object" : "uw woning",
    cap: objectProposal ? "Object" : "Woning",
    gegevens: isPrint
      ? (objectProposal ? "Gegevens object" : "Gegevens woning")
      : (objectProposal ? "Objectgegevens" : "Woninggegevens"),
    uitgangspunt: objectProposal ? "Uitgangspunt object" : "Uitgangspunt woning",
    addressLabel: objectProposal ? "Adres / object" : "Adres / woning",
    typeLabel: objectProposal ? "Type object" : "Type woning",
    areaLabel: objectProposal ? "Gebruiks-/woonoppervlakte" : "Woonoppervlakte",
    verkoopText: objectProposal ? "Bij verkoop van een object" : "Bij een woningverkoop",
    intro: objectProposal
      ? "Professioneel en vrijblijvend voorstel voor verkoop van uw object."
      : "Professioneel en vrijblijvend voorstel voor uw woningverkoop.",
  };
}

export function objectAwareText(text, proposal) {
  const raw = String(text || "")
    .replace(/^Bij akkoord worden de afspraken schriftelijk bevestigd\.$/i, "Als u verder wilt, werken wij de afspraken uit in een koopovereenkomst.")
    .replace(/^Akkoord op voorwaarden$/i, "Overeenstemming over voorwaarden")
    .replace(/zekerheid na akkoord/gi, "zekerheid bij overeenstemming");
  if (!isObjectProposal(proposal)) return raw;
  return raw
    .replace(/de woning of het object/gi, "het object")
    .replace(/openbare woninginformatie/gi, "openbare objectinformatie")
    .replace(/huidige bekende staat van de woning of het object/gi, "huidige bekende staat van het object")
    .replace(/huidige bekende staat van de woning/gi, "huidige bekende staat van het object")
    .replace(/woning-\/objectinformatie/gi, "objectinformatie")
    .replace(/woning of het object/gi, "object")
    .replace(/verkoopklaar maken van de woning/gi, "verkoopklaar maken van het object")
    .replace(/woningverkoop/gi, "objectverkoop")
    .replace(/Woning blijft/gi, "Object blijft")
    .replace(/woninggegevens/gi, "objectgegevens")
    .replace(/Controle woninggegevens/gi, "Controle objectgegevens")
    .replace(/over de woning/gi, "over het object")
    .replace(/van de woning/gi, "van het object")
    .replace(/de woning binnen/gi, "het object binnen")
    .replace(/uw woning/gi, "uw object");
}

// Alleen de publieke pagina begroet de klant.
export function salutationName(name) {
  const raw = String(name || "").replace(/\s+/g, " ").trim();
  return raw || "heer/mevrouw";
}

// Alleen de publieke pagina bepaalt of de klant nog online kan reageren.
export function canRespondToProposal(proposal) {
  const status = String(proposal?.status || "").trim().toLowerCase();
  const activeStatus = ["verzonden", "bekeken"].includes(status);
  const days = daysUntil(proposal?.validity_date);
  const expired = days !== null && days < 0;
  return activeStatus && !expired;
}

// Alleen de printversie toont een voorstelnummer.
export function proposalNumber(proposal) {
  const raw = String(proposal?.id || proposal?.public_token || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  const year = proposal?.created_at ? new Date(proposal.created_at).getFullYear() : new Date().getFullYear();
  return raw ? `VDN-${year}-${raw}` : `VDN-${year}`;
}
