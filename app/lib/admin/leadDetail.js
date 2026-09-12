// Pure logica en constanten voor de lead-detailpagina (ARCH-05). Voorheen
// stond dit allemaal boven aan het 1293-regels-lange
// app/admin/leads/[id]/page.jsx; nu gedeeld door dat bestand en de eruit
// gelichte componenten (LeadHeader, LeadContactForm, ProposalForm,
// TaskPanel, MailHistory).

import { addDaysAmsterdam, formatDateTimeNL } from "../date.js";
import { formatEuro, parseMoney } from "../money.js";

// Her-export onder de naam die de admincomponenten al gebruiken. Het parsen
// zelf staat centraal in app/lib/money.js (ARCH-02).
export { parseMoney };

export const TASK_STATUSES = ["Open", "In behandeling", "Afgerond"];

export const PROPOSAL_TYPES = [
  "Standaard aankoop",
  "Uitgestelde levering",
  "Overbruggingsoplossing",
  "ABC-doorverkoop mogelijk",
];

export const DEFAULT_NONBINDING_TEXT = "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid. Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.";

export const SPECIAL_PROPOSAL_TYPES = ["Uitgestelde levering", "Overbruggingsoplossing", "ABC-doorverkoop mogelijk"];
export const OBJECT_USAGE_TYPES = ["Woning", "Winkelruimte", "Bedrijfsruimte", "Woon-winkelpand", "Gemengd object", "Anders"];
export const OCCUPANCY_STATUSES = ["Eigen gebruik", "Verhuurd", "Deels verhuurd", "Leegstaand", "Onbekend"];
export const DELIVERY_OCCUPANCY_STATUSES = ["Vrij van huur en gebruik", "Met huurder", "Deels vrij / deels verhuurd", "Nader te bepalen"];
export const YES_NO_UNKNOWN = ["Ja", "Nee", "Onbekend"];
export const TENANT_COOPERATION_STATUSES = ["Ja", "Nee", "In overleg", "Onbekend"];

export function isSpecialProposalType(type) {
  return SPECIAL_PROPOSAL_TYPES.includes(type);
}

export function todayPlus(days) { return addDaysAmsterdam(days); }

export function fmt(value) { return formatDateTimeNL(value); }

export function proposalViewedAfterEmail(item) {
  if (!item?.emailed_at || !item?.public_viewed_at) return false;
  const emailedAt = new Date(item.emailed_at).getTime();
  const viewedAt = new Date(item.public_viewed_at).getTime();
  return Number.isFinite(emailedAt) && Number.isFinite(viewedAt) && viewedAt >= emailedAt;
}

export function cleanPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

export function whatsappPhone(value) {
  let phone = String(value || "").replace(/\D/g, "");
  if (phone.startsWith("00")) phone = phone.slice(2);
  if (phone.startsWith("0")) phone = `31${phone.slice(1)}`;
  return phone;
}

export function proposalPublicUrlFromToken(tokenOrUrl) {
  const value = String(tokenOrUrl || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.vastgoeddirectnederland.nl";
  return `${origin}/voorstel/${value}`;
}

export function buildProposalWhatsappText({ name, publicUrl }) {
  const customerName = String(name || "").trim();
  const greeting = customerName ? `Goedemiddag ${customerName},` : "Goedemiddag,";
  return [
    greeting,
    "",
    "Het verkoopvoorstel van Vastgoed Direct Nederland staat voor u klaar.",
    "",
    "U kunt het voorstel hier rustig bekijken:",
    publicUrl,
    "",
    "Het bekijken van het voorstel betekent niet dat u ergens aan vastzit. Heeft u vragen of wilt u het voorstel bespreken, dan hoor ik het graag.",
    "",
    "Met vriendelijke groet,",
    "Rob",
    "Vastgoed Direct Nederland",
  ].join("\n");
}

export function proposalWhatsappUrl({ phone, name, publicUrl }) {
  const targetPhone = whatsappPhone(phone);
  const targetUrl = String(publicUrl || "").trim();
  if (!targetPhone || !targetUrl) return "";
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(buildProposalWhatsappText({ name, publicUrl: targetUrl }))}`;
}

export function sameEmail(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

// Klantactie-helpers staan in ./customerActions.js, zodat het dashboard, de
// tijdlijn en de leaddetailpagina dezelfde regel gebruiken. Hier
// her-geëxporteerd omdat de admincomponenten ze via dit bestand importeren.
export {
  CUSTOMER_PROPOSAL_ACTION_TYPES,
  customerActionCopy,
  isCustomerActionHandled,
  latestCustomerProposalAction,
  sortedCustomerProposalActions,
  timestampMs,
} from "./customerActions.js";

// Naamswrapper met de positionele signatuur die de admincomponenten gebruiken;
// het formatteren zelf staat in app/lib/money.js (ARCH-02).
export function formatMoney(value, negative = false) {
  return formatEuro(value, { negative });
}

export function parsePercentage(value) {
  const number = parseMoney(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(100, Math.max(0, number));
}

export function formatPercent(value) {
  const number = parsePercentage(value);
  if (!number) return "";
  return String(number).replace(".", ",");
}

export function calculateSellerWorkTotal(proposal) {
  const base = parseMoney(proposal?.seller_work_base_price_text);
  const work = parseMoney(proposal?.seller_work_amount_text);
  return base || work ? formatMoney(base + work) : "";
}

export function calculateResaleExample(proposal) {
  const salePrice = 400000;
  const courtage = proposal?.resale_deduct_courtage ? 4000 : 0;
  const threshold = parseMoney(proposal?.resale_threshold_text) || 350000;
  const percentage = parsePercentage(proposal?.resale_percentage_text) || 20;
  const netResale = salePrice - courtage;
  const surplus = Math.max(0, netResale - threshold);
  const payment = surplus * (percentage / 100);
  return { salePrice, courtage, netResale, surplus, percentage, payment };
}

export function calculateNetComparison(proposal) {
  const traditionalPrice = parseMoney(proposal?.traditional_price_text);
  const agentExVat = parseMoney(proposal?.agent_costs_text);
  const agentInclVat = agentExVat * 1.21;
  const notaryCosts = parseMoney(proposal?.notary_costs_text);
  const renovationCosts = parseMoney(proposal?.renovation_costs_text);
  const otherExVat = parseMoney(proposal?.other_costs_text);
  const otherInclVat = otherExVat * 1.21;
  const directNet = parseMoney(proposal?.direct_net_text) || parseMoney(proposal?.amount_text);
  const traditionalNet = traditionalPrice - agentInclVat - notaryCosts - renovationCosts - otherInclVat;
  const difference = directNet - traditionalNet;

  return {
    traditionalPrice,
    agentExVat,
    agentInclVat,
    notaryCosts,
    renovationCosts,
    otherExVat,
    otherInclVat,
    traditionalNet: traditionalNet > 0 ? traditionalNet : 0,
    directNet,
    difference,
  };
}

export function buildCalculatedProposalPayload(proposal) {
  const calc = calculateNetComparison(proposal);
  const sellerWorkTotal = calculateSellerWorkTotal(proposal);
  return {
    ...proposal,
    seller_work_total_price_text: sellerWorkTotal || proposal.seller_work_total_price_text,
    resale_percentage_text: formatPercent(proposal.resale_percentage_text) || proposal.resale_percentage_text,
    traditional_price_text: formatMoney(calc.traditionalPrice) || proposal.traditional_price_text,
    agent_costs_text: formatMoney(calc.agentExVat, true) || proposal.agent_costs_text,
    notary_costs_text: formatMoney(calc.notaryCosts, true) || proposal.notary_costs_text,
    renovation_costs_text: formatMoney(calc.renovationCosts, true) || proposal.renovation_costs_text,
    other_costs_text: formatMoney(calc.otherExVat, true) || proposal.other_costs_text,
    traditional_net_text: formatMoney(calc.traditionalNet) || proposal.traditional_net_text,
    direct_net_text: formatMoney(calc.directNet) || proposal.direct_net_text || proposal.amount_text,
  };
}

export function applyAdditionalAgreementDefaults(current = {}) {
  const sellerWorkEnabled = Boolean(current.seller_work_enabled);
  const sellerWorkBase = current.seller_work_base_price_text || (sellerWorkEnabled ? current.amount_text || "" : "");
  const sellerWorkAmount = current.seller_work_amount_text || "";
  const sellerWorkTotal = current.seller_work_total_price_text || calculateSellerWorkTotal({
    seller_work_base_price_text: sellerWorkBase,
    seller_work_amount_text: sellerWorkAmount,
  });

  return {
    ...current,
    seller_work_enabled: sellerWorkEnabled,
    seller_work_description: current.seller_work_description || "",
    seller_work_deadline: current.seller_work_deadline || "",
    seller_work_amount_text: sellerWorkAmount,
    seller_work_base_price_text: sellerWorkBase,
    seller_work_total_price_text: sellerWorkTotal,
    seller_work_conditions_text: current.seller_work_conditions_text || "",
    resale_payment_enabled: Boolean(current.resale_payment_enabled),
    resale_threshold_text: current.resale_threshold_text || "",
    resale_percentage_text: current.resale_percentage_text || "",
    resale_deduct_courtage: current.resale_deduct_courtage === undefined || current.resale_deduct_courtage === null ? true : Boolean(current.resale_deduct_courtage),
    resale_period_months: current.resale_period_months || 12,
    resale_cap_text: current.resale_cap_text || "",
    resale_explanation_text: current.resale_explanation_text || "",
    use_rental_enabled: Boolean(current.use_rental_enabled),
    object_usage_type: current.object_usage_type || "Woon-winkelpand",
    current_occupancy_status: current.current_occupancy_status || "Verhuurd",
    delivery_occupancy_status: current.delivery_occupancy_status || "Vrij van huur en gebruik",
    lease_agreement_available: current.lease_agreement_available || "Onbekend",
    lease_end_date: current.lease_end_date || "",
    tenant_vacate_deadline: current.tenant_vacate_deadline || "",
    tenant_cooperation_status: current.tenant_cooperation_status || "Onbekend",
    current_rent_text: current.current_rent_text || "",
    deposit_present: current.deposit_present || "Onbekend",
    rent_arrears_or_dispute: current.rent_arrears_or_dispute || "Onbekend",
    commercial_area_text: current.commercial_area_text || "",
    residential_area_text: current.residential_area_text || "",
    separate_entrance_status: current.separate_entrance_status || "Onbekend",
    independent_residence_status: current.independent_residence_status || "Onbekend",
    zoning_permits_checked: current.zoning_permits_checked || "Onbekend",
    split_potential_status: current.split_potential_status || "Onbekend",
    fire_safety_check_status: current.fire_safety_check_status || "Onbekend",
    use_rental_notes_text: current.use_rental_notes_text || "",
    nonbinding_text: current.nonbinding_text || DEFAULT_NONBINDING_TEXT,
  };
}

/**
 * Adresveld zoals het eruitziet vóórdat de PDOK-adrescontrole is teruggekomen:
 * alleen postcode + huisnummer. Ook de waarde waarmee wordt vergeleken om te
 * bepalen of de gebruiker het veld al handmatig heeft aangepast — zie
 * addressSuggestionFromLookup() en de aanroep ervan op de leaddetailpagina.
 */
export function defaultPropertyAddress(lead) {
  return [lead?.postcode, lead?.huisnummer].filter(Boolean).join(" ").toUpperCase();
}

/**
 * Zet een /api/address-resultaat (dezelfde PDOK-lookup als op het publieke
 * formulier) om naar de weergavetekst voor "Adres / woning of object":
 * straatnaam + huisnummer, plaats. Puur, zodat het netwerkverkeer zelf in de
 * pagina blijft en dit apart testbaar is.
 */
export function addressSuggestionFromLookup(address) {
  if (!address) return "";
  const streetLine = [address.street, address.houseNumber].filter(Boolean).join(" ");
  return [streetLine, address.city].filter(Boolean).join(", ");
}

export function defaultProposalForLead(lead) {
  const propertyAddress = defaultPropertyAddress(lead);
  return {
    proposal_variant: "Uitgebreid",
    lead_id: lead?.id || "",
    lead_naam: lead?.naam || "",
    lead_email: lead?.email || "",
    lead_telefoon: lead?.telefoon || "",
    property_address: propertyAddress,
    property_postcode: String(lead?.postcode || "").toUpperCase(),
    property_house_number: lead?.huisnummer || "",
    property_type: lead?.woningtype || "",
    living_area_text: "",
    plot_area_text: "",
    build_year_text: "",
    current_situation: lead?.staat || lead?.reden || "",
    amount_text: "",
    validity_date: todayPlus(14),
    transfer_date_text: "In overleg",
    deposit_text: "",
    conditions_text: "Dit voorstel is vrijblijvend en bedoeld om duidelijkheid te geven over een mogelijke verkoop. Definitieve afspraken worden pas schriftelijk en notarieel vastgelegd. Als een koopovereenkomst wordt uitgewerkt, geldt als uitgangspunt dat koper koopt zonder financieringsvoorbehoud, bouwkundig voorbehoud, verkoopvoorbehoud of andere ontbindende voorbehouden, tenzij schriftelijk anders overeengekomen.",
    assumptions_text: "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woning- of objectinformatie en de huidige bekende staat van de woning of het object. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken, beperkte toegang tot documenten of aanvullende kosten kunnen invloed hebben op de definitieve afspraken.",
    included_items: "Heldere communicatie\nGeen makelaarskosten\nGeen openbare bezichtigingen nodig\nVerkoop in huidige staat bespreekbaar\nFlexibele overdrachtsdatum\nNotariële afwikkeling\nMeer zekerheid na overeenstemming\nVerkoopoplossing op maat\nVrijblijvend voorstel",
    traditional_price_text: "",
    agent_costs_text: "",
    notary_costs_text: "",
    renovation_costs_text: "",
    other_costs_text: "",
    traditional_net_text: "",
    direct_net_text: "",
    short_comparison_text: "De netto-opbrengstvergelijking is indicatief. Bij verhuurde, leeg te leveren of gemengde objecten kan de traditionele vergelijkingswaarde mede worden benaderd vanuit huurwaarde, leegstand, verhuurrisico, verkoopbaarheid en kosten. Een direct voorstel kan lager zijn dan een optimistische marktwaarde, maar geeft meer duidelijkheid over voorwaarden, planning, afwikkeling en zekerheid bij overeenstemming.",
    reservations_text: "Controle woninggegevens\nControle eigendomssituatie\nControle beschikbare documenten\nControle eventuele huur-, gebruiks- of beslaggegevens\nNotariële toetsing\nOvereenstemming over voorwaarden\nGeen bijzondere belemmeringen\nDefinitieve schriftelijke vastlegging",
    next_steps_text: "U beoordeelt het voorstel rustig.\nWij bespreken eventuele vragen, bijzonderheden en voorwaarden.\nIndien gewenst verzamelen wij aanvullende gegevens over de woning of het object.\nAls u verder wilt, werken wij de afspraken uit in een koopovereenkomst.\nDe overdracht en betaling verlopen via de notaris.",
    contact_person: "Rob Schiphuis",
    proposal_type: "Standaard aankoop",
    delivery_term_text: "Uiterlijk binnen 6 maanden",
    desired_transfer_date: "",
    buyer_text: "Vastgoed Direct Nederland of nader te noemen meester",
    allow_kadaster_registration: false,
    allow_abc_resale: false,
    seller_cooperates_resale: false,
    delivery_free_of_claims: false,
    property_same_state: false,
    bridge_current_home: "",
    bridge_old_home: "",
    bridge_goal_text: "",
    bridge_explanation_text: "",
    seller_work_enabled: false,
    seller_work_description: "",
    seller_work_deadline: "",
    seller_work_amount_text: "",
    seller_work_base_price_text: "",
    seller_work_total_price_text: "",
    seller_work_conditions_text: "",
    resale_payment_enabled: false,
    resale_threshold_text: "",
    resale_percentage_text: "",
    resale_deduct_courtage: true,
    resale_period_months: 12,
    resale_cap_text: "",
    resale_explanation_text: "",
    use_rental_enabled: false,
    object_usage_type: "Woon-winkelpand",
    current_occupancy_status: "Verhuurd",
    delivery_occupancy_status: "Vrij van huur en gebruik",
    lease_agreement_available: "Onbekend",
    lease_end_date: "",
    tenant_vacate_deadline: "",
    tenant_cooperation_status: "Onbekend",
    current_rent_text: "",
    deposit_present: "Onbekend",
    rent_arrears_or_dispute: "Onbekend",
    commercial_area_text: "",
    residential_area_text: "",
    separate_entrance_status: "Onbekend",
    independent_residence_status: "Onbekend",
    zoning_permits_checked: "Onbekend",
    split_potential_status: "Onbekend",
    fire_safety_check_status: "Onbekend",
    use_rental_notes_text: "",
    nonbinding_text: DEFAULT_NONBINDING_TEXT,
    notes: "",
  };
}

export function normalizeProposalForForm(item, lead) {
  const base = { ...defaultProposalForLead(lead), ...(item || {}) };
  return applyAdditionalAgreementDefaults({
    ...base,
    lead_id: lead?.id || base.lead_id || "",
    validity_date: base.validity_date ? String(base.validity_date).slice(0, 10) : todayPlus(14),
    desired_transfer_date: base.desired_transfer_date ? String(base.desired_transfer_date).slice(0, 10) : "",
    seller_work_deadline: base.seller_work_deadline ? String(base.seller_work_deadline).slice(0, 10) : "",
    lease_end_date: base.lease_end_date ? String(base.lease_end_date).slice(0, 10) : "",
    tenant_vacate_deadline: base.tenant_vacate_deadline ? String(base.tenant_vacate_deadline).slice(0, 10) : "",
  });
}
