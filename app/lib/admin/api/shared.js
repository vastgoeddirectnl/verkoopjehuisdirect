// Gedeelde constanten en helpers voor de admin-API (ARCH-07). Voorheen stond
// dit samen met alle acties in één app/api/admin/v2/route.js van ruim 900
// regels; de route is nu alleen nog de toegangscontrole en de verdeling over
// reads.js, leadActions.js en proposalActions.js.

import { queryOne } from "../../neonDb";
import { formatDateNL } from "../../date";
import { parseMoney, parsePercent } from "../../money.js";
import { LEAD_STATUSES, LEGACY_STATUS_LABELS } from "../../leadStatus.js";

// De admin-UI toont en zet alleen LEAD_STATUSES, maar accepteert bij het
// updaten ook nog binnenkomende legacy-waarden (bv. uit oude e-mails/links).
export const ACCEPTED_LEAD_STATUSES = [...LEAD_STATUSES, ...Object.keys(LEGACY_STATUS_LABELS)];
export const ARCHIVE_PROPOSAL_STATUSES = ["Akkoord", "Gearchiveerd", "Afgewezen", "Verlopen"];
export const PROPOSAL_STATUSES = ["Concept", "Verzonden", "Bekeken", "Akkoord", "Afgewezen", "Verlopen", "Gearchiveerd"];

export const PROPOSAL_FIELDS = [
  "proposal_variant",
  "lead_id",
  "lead_naam",
  "lead_email",
  "lead_telefoon",
  "property_address",
  "property_postcode",
  "property_house_number",
  "property_type",
  "living_area_text",
  "plot_area_text",
  "build_year_text",
  "current_situation",
  "amount_text",
  "validity_date",
  "transfer_date_text",
  "deposit_text",
  "conditions_text",
  "assumptions_text",
  "included_items",
  "traditional_price_text",
  "agent_costs_text",
  "notary_costs_text",
  "renovation_costs_text",
  "other_costs_text",
  "traditional_net_text",
  "direct_net_text",
  "short_comparison_text",
  "reservations_text",
  "next_steps_text",
  "contact_person",
  "proposal_type",
  "delivery_term_text",
  "desired_transfer_date",
  "buyer_text",
  "allow_kadaster_registration",
  "allow_abc_resale",
  "seller_cooperates_resale",
  "delivery_free_of_claims",
  "property_same_state",
  "bridge_current_home",
  "bridge_old_home",
  "bridge_goal_text",
  "bridge_explanation_text",
  "seller_work_enabled",
  "seller_work_description",
  "seller_work_deadline",
  "seller_work_amount_text",
  "seller_work_base_price_text",
  "seller_work_total_price_text",
  "seller_work_conditions_text",
  "resale_payment_enabled",
  "resale_threshold_text",
  "resale_percentage_text",
  "resale_deduct_courtage",
  "resale_period_months",
  "resale_cap_text",
  "resale_explanation_text",
  "use_rental_enabled",
  "object_usage_type",
  "current_occupancy_status",
  "delivery_occupancy_status",
  "lease_agreement_available",
  "lease_end_date",
  "tenant_vacate_deadline",
  "tenant_cooperation_status",
  "current_rent_text",
  "deposit_present",
  "rent_arrears_or_dispute",
  "commercial_area_text",
  "residential_area_text",
  "separate_entrance_status",
  "independent_residence_status",
  "zoning_permits_checked",
  "split_potential_status",
  "fire_safety_check_status",
  "use_rental_notes_text",
  "nonbinding_text",
  "notes",
];

export function clean(value, max = 1500) {
  return String(value || "").trim().slice(0, max);
}

export function euroText(value) {
  const number = parseMoney(value);
  if (!number) return null;
  // Bewust dezelfde "€ 1.234"-opmaak (spatie, geen valuta-stijl) als amount()
  // in app/components/proposal/proposalFormat.js — niet formatEuro(), die
  // gebruikt Intl's currency-stijl voor de netto-opbrengstvergelijking.
  return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Math.round(number))}`;
}

export function percentText(value) {
  const number = Math.min(100, Math.max(0, parsePercent(value)));
  if (!number) return null;
  return String(number).replace(".", ",");
}

export function cleanForField(field, value) {
  if (field === "lead_id") return value || null;
  if (["validity_date", "desired_transfer_date", "seller_work_deadline", "lease_end_date", "tenant_vacate_deadline"].includes(field)) return value || null;
  if (field === "proposal_variant") return clean(value, 40) || "Uitgebreid";
  if (field === "proposal_type") return clean(value, 80) || "Standaard aankoop";
  if ([
    "allow_kadaster_registration",
    "allow_abc_resale",
    "seller_cooperates_resale",
    "delivery_free_of_claims",
    "property_same_state",
    "seller_work_enabled",
    "resale_payment_enabled",
    "resale_deduct_courtage",
    "use_rental_enabled",
  ].includes(field)) {
    return Boolean(value);
  }
  if ([
    "conditions_text",
    "assumptions_text",
    "included_items",
    "short_comparison_text",
    "reservations_text",
    "next_steps_text",
    "bridge_explanation_text",
    "seller_work_description",
    "seller_work_conditions_text",
    "resale_explanation_text",
    "use_rental_notes_text",
    "nonbinding_text",
    "notes",
  ].includes(field)) {
    return clean(value, 3500) || null;
  }
  if (["seller_work_amount_text", "seller_work_base_price_text", "seller_work_total_price_text", "resale_threshold_text", "resale_cap_text"].includes(field)) {
    return euroText(value);
  }
  if (field === "resale_percentage_text") return percentText(value);
  if (field === "resale_period_months") {
    const months = Math.round(parseMoney(value));
    return months > 0 ? months : null;
  }
  return clean(value, 300) || null;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vastgoeddirectnederland.nl").replace(/\/$/, "");
}

export function formatAddress(proposal) {
  const explicit = clean(proposal.property_address, 300);
  if (explicit) return explicit.toUpperCase();
  return [proposal.property_postcode, proposal.property_house_number].filter(Boolean).join(" ").toUpperCase();
}

export function isObjectProposal(proposal) {
  const text = [
    proposal?.object_usage_type,
    proposal?.property_type,
    proposal?.current_situation,
  ].filter(Boolean).join(" ").toLowerCase();
  return /(woon\s*-?\s*winkelpand|gemengd|bedrijfspand|bedrijfsruimte|winkelruimte|winkelpand|kantoor|horeca|beleggingspand|object)/i.test(text);
}

export function emailObjectLabel(proposal) {
  return isObjectProposal(proposal) ? "Object" : "Woning";
}

export function formatDateShort(value) {
  return value ? formatDateNL(value, { fallback: "" }) : "";
}

export async function ensurePublicToken(proposal) {
  if (proposal.public_token) return proposal.public_token;
  const updated = await queryOne(
    "update proposals set public_token = gen_random_uuid(), updated_at = now() where id = $1 returning public_token",
    [proposal.id]
  );
  return updated?.public_token;
}
