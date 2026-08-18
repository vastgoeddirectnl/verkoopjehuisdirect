"use client";

import { useEffect, useMemo, useState } from "react";
import { parseLeadSourceDetails, sourceChannelLabel } from "../../../lib/sourceParser";

const STATUSES = ["Nieuwe aanvraag", "In behandeling", "Eerste bod gedaan", "Beoordeling gepland", "Voorstel opgesteld", "Voorstel verzonden", "Voorstel bekeken", "In onderhandeling", "Akkoord", "Afgewezen / vervallen", "Afgerond", "Gearchiveerd"];
const LEGACY_STATUS_LABELS = { "Nieuw": "Nieuwe aanvraag", "Contact opgenomen": "In behandeling", "In beoordeling": "Beoordeling gepland", "Afgewezen": "Afgewezen / vervallen" };
function selectStatusValue(status){ const label = LEGACY_STATUS_LABELS[status] || status || "Nieuwe aanvraag"; return STATUSES.includes(label) ? label : "Nieuwe aanvraag"; }
const TASK_STATUSES = ["Open", "In behandeling", "Afgerond"];

const PROPOSAL_TYPES = [
  "Standaard aankoop",
  "Uitgestelde levering",
  "Overbruggingsoplossing",
  "ABC-doorverkoop mogelijk",
];

const DEFAULT_NONBINDING_TEXT = "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid. Als partijen na akkoord op dit voorstel een koopovereenkomst willen uitwerken, geldt als uitgangspunt dat koper koopt zonder financieringsvoorbehoud, bouwkundig voorbehoud, verkoopvoorbehoud of andere ontbindende voorbehouden, tenzij koper en verkoper schriftelijk anders overeenkomen.";

const SPECIAL_PROPOSAL_TYPES = ["Uitgestelde levering", "Overbruggingsoplossing", "ABC-doorverkoop mogelijk"];
const OBJECT_USAGE_TYPES = ["Woning", "Winkelruimte", "Bedrijfsruimte", "Woon-winkelpand", "Gemengd object", "Anders"];
const OCCUPANCY_STATUSES = ["Eigen gebruik", "Verhuurd", "Deels verhuurd", "Leegstaand", "Onbekend"];
const DELIVERY_OCCUPANCY_STATUSES = ["Vrij van huur en gebruik", "Met huurder", "Deels vrij / deels verhuurd", "Nader te bepalen"];
const YES_NO_UNKNOWN = ["Ja", "Nee", "Onbekend"];
const TENANT_COOPERATION_STATUSES = ["Ja", "Nee", "In overleg", "Onbekend"];


function isSpecialProposalType(type) {
  return SPECIAL_PROPOSAL_TYPES.includes(type);
}

function todayPlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function fmt(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function proposalViewedAfterEmail(item) {
  if (!item?.emailed_at || !item?.public_viewed_at) return false;
  const emailedAt = new Date(item.emailed_at).getTime();
  const viewedAt = new Date(item.public_viewed_at).getTime();
  return Number.isFinite(emailedAt) && Number.isFinite(viewedAt) && viewedAt >= emailedAt;
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "");
}

function isValidEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sameEmail(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

function SourceDetails({ lead }) {
  const details = parseLeadSourceDetails(lead);
  const hasDetails = [details.pagePath, details.pageTitle, details.source, details.medium, details.campaign, details.term, details.content, details.clickId, details.referrer].some(Boolean);
  if (!hasDetails) return null;
  const channel = sourceChannelLabel(details);

  return (
    <div className="source-detail-box">
      <div className="source-head">
        <div>
          <h3>Bron en campagne</h3>
          <p>Leesbare samenvatting van de herkomst van deze aanvraag.</p>
        </div>
        <span className="source-pill">{channel}</span>
      </div>
      <div className="source-summary-row">
        <span>Campagne: {details.campaign || "niet meegegeven"}</span>
        <span>Zoekterm: {details.term || "niet meegegeven"}</span>
        <span>Click ID: {details.clickId ? "aanwezig" : "niet meegegeven"}</span>
      </div>
      <div className="info-grid">
        <Info label="Landingspagina" value={details.pagePath} />
        <Info label="Paginatitel" value={details.pageTitle} />
        <Info label="UTM source" value={details.source} />
        <Info label="UTM medium" value={details.medium} />
        <Info label="Campagne" value={details.campaign} />
        <Info label="Zoekterm / keyword" value={details.term} />
        <Info label="Advertentie-inhoud" value={details.content} />
        <Info label="Click ID" value={details.clickId} />
        <Info label="Referrer" value={details.referrer} />
      </div>
    </div>
  );
}


function parseMoney(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;
  const cleaned = raw
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/[^0-9,.-]/g, "");

  if (!cleaned) return 0;

  let normalized = cleaned;
  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");

  if (hasComma && hasDot) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = normalized.replace(",", ".");
  } else if (hasDot) {
    const dotParts = normalized.split(".");
    const lastPart = dotParts[dotParts.length - 1];
    if (lastPart.length === 3 && dotParts.length > 1) {
      normalized = normalized.replace(/\./g, "");
    }
  }

  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? Math.abs(number) : 0;
}

function formatMoney(value, negative = false) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0) return "";
  const formatted = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(number));
  return negative ? `- ${formatted}` : formatted;
}

function parsePercentage(value) {
  const number = parseMoney(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(100, Math.max(0, number));
}

function formatPercent(value) {
  const number = parsePercentage(value);
  if (!number) return "";
  return String(number).replace(".", ",");
}

function applyAdditionalAgreementDefaults(current = {}) {
  return {
    ...current,
    seller_work_enabled: Boolean(current.seller_work_enabled),
    seller_work_description: current.seller_work_description || "",
    seller_work_deadline: current.seller_work_deadline || "",
    seller_work_amount_text: current.seller_work_amount_text || "€ 5.700",
    seller_work_base_price_text: current.seller_work_base_price_text || current.amount_text || "€ 300.000",
    seller_work_total_price_text: current.seller_work_total_price_text || "€ 305.700",
    seller_work_conditions_text: current.seller_work_conditions_text || "Wanneer de werkzaamheden niet, niet volledig of niet deugdelijk zijn uitgevoerd, kan de aanvullende koopprijs worden verminderd met de redelijkerwijs benodigde kosten om de werkzaamheden alsnog te voltooien of te herstellen.",
    resale_payment_enabled: Boolean(current.resale_payment_enabled),
    resale_threshold_text: current.resale_threshold_text || "€ 350.000",
    resale_percentage_text: current.resale_percentage_text || "20",
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

function calculateSellerWorkTotal(proposal) {
  const base = parseMoney(proposal?.seller_work_base_price_text);
  const work = parseMoney(proposal?.seller_work_amount_text);
  return base || work ? formatMoney(base + work) : "";
}

function calculateResaleExample(proposal) {
  const salePrice = 400000;
  const courtage = proposal?.resale_deduct_courtage ? 4000 : 0;
  const threshold = parseMoney(proposal?.resale_threshold_text) || 350000;
  const percentage = parsePercentage(proposal?.resale_percentage_text) || 20;
  const netResale = salePrice - courtage;
  const surplus = Math.max(0, netResale - threshold);
  const payment = surplus * (percentage / 100);
  return { salePrice, courtage, netResale, surplus, percentage, payment };
}

function normalizeProposalForForm(item, lead) {
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

function calculateNetComparison(proposal) {
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

function buildCalculatedProposalPayload(proposal) {
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

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value || "-"}</strong></div>;
}

function Field({ label, children }) {
  return <label><span>{label}</span>{children}</label>;
}

function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function ProposalListItem({ item, lead, saving, sendProposal, useProposalAsBase, updateProposalEmail }) {
  const [email, setEmail] = useState(item.lead_email || lead?.email || "");
  const proposalEmail = String(item.lead_email || "").trim();
  const leadEmail = String(lead?.email || "").trim();
  const differs = proposalEmail && leadEmail && !sameEmail(proposalEmail, leadEmail);
  const emailChanged = !sameEmail(email, proposalEmail);
  const valid = isValidEmail(email);

  async function saveEmail() {
    await updateProposalEmail(item.id, email);
  }

  return (
    <div className="item proposal-item">
      <div className="proposal-item-head">
        <div>
          <strong>{item.amount_text || "Voorstel"}</strong>
          <span>{item.status} · {fmt(item.created_at)}</span>
        </div>
        {proposalViewedAfterEmail(item) ? <span className="status-pill green">Bekeken</span> : item.emailed_at ? <span className="status-pill">Verzonden</span> : <span className="status-pill muted">Concept</span>}
      </div>

      <div className="proposal-recipient-box">
        <strong>Verzenden naar klant</strong>
        <small>Controleer het e-mailadres voordat u het voorstel verstuurt.</small>
        <Field label="E-mailadres ontvanger">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="klant@example.nl"
          />
        </Field>
        <div className="recipient-meta">
          <span>Voorstel: {proposalEmail || "geen e-mailadres"}</span>
          <span>Lead: {leadEmail || "geen e-mailadres"}</span>
        </div>
        {differs ? <div className="warning-line">Let op: het e-mailadres op dit voorstel wijkt af van het e-mailadres op de lead.</div> : null}
        {email && !valid ? <div className="warning-line">Voer een geldig e-mailadres in voordat u verzendt.</div> : null}
        <div className="proposal-mail-actions">
          <button className="small secondary-small" disabled={saving || !emailChanged || !valid} onClick={saveEmail}>E-mailadres bijwerken</button>
          <button className="small" disabled={saving || !valid} onClick={() => sendProposal(item.id, email)}>Voorstel verzenden</button>
        </div>
      </div>

      <a href={`/admin/voorstellen/${item.id}/print`} target="_blank">Interne print/PDF</a>
      {item.public_token ? <a href={`/voorstel/${item.public_token}?admin_preview=1`} target="_blank">Klantversie bekijken</a> : null}
      <button className="small secondary-small" onClick={() => useProposalAsBase(item)}>Gebruik als basis</button>
      {item.emailed_at ? <small>Laatst gemaild: {fmt(item.emailed_at)}{item.sent_to_email ? ` · naar ${item.sent_to_email}` : ""}</small> : null}
      {proposalViewedAfterEmail(item) ? <small>Bekeken door klant: {fmt(item.public_viewed_at)}</small> : null}
    </div>
  );
}

function defaultProposalForLead(lead) {
  const propertyAddress = [lead?.postcode, lead?.huisnummer].filter(Boolean).join(" ").toUpperCase();
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
    deposit_text: "In overleg bespreekbaar",
    conditions_text: "Dit voorstel is vrijblijvend en bedoeld om duidelijkheid te geven over een mogelijke verkoop. Definitieve afspraken worden pas schriftelijk en notarieel vastgelegd. Als een koopovereenkomst wordt uitgewerkt, geldt als uitgangspunt dat koper koopt zonder financieringsvoorbehoud, bouwkundig voorbehoud, verkoopvoorbehoud of andere ontbindende voorbehouden, tenzij schriftelijk anders overeengekomen.",
    assumptions_text: "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken, beperkte toegang tot documenten of aanvullende kosten kunnen invloed hebben op de definitieve afspraken.",
    included_items: "Heldere communicatie\nGeen makelaarskosten\nGeen openbare bezichtigingen nodig\nVerkoop in huidige staat bespreekbaar\nFlexibele overdrachtsdatum\nNotariële afwikkeling\nVerkoopoplossing op maat\nVrijblijvend voorstel",
    traditional_price_text: "",
    agent_costs_text: "",
    notary_costs_text: "",
    renovation_costs_text: "",
    other_costs_text: "",
    traditional_net_text: "",
    direct_net_text: "",
    short_comparison_text: "De netto-opbrengstvergelijking is indicatief. Bij verhuurde, leeg te leveren of gemengde objecten kan de traditionele vergelijkingswaarde mede worden benaderd vanuit huurwaarde, leegstand, verhuurrisico, verkoopbaarheid en kosten. Een direct voorstel kan lager zijn dan een optimistische marktwaarde, maar geeft meer duidelijkheid over voorwaarden, planning en afwikkeling.",
    reservations_text: "Controle woninggegevens\nControle eigendomssituatie\nControle beschikbare documenten\nControle eventuele huur-, gebruiks- of beslaggegevens\nNotariële toetsing\nAkkoord op voorwaarden\nGeen bijzondere belemmeringen\nDefinitieve schriftelijke vastlegging",
    next_steps_text: "U beoordeelt het voorstel rustig.\nWij bespreken eventuele vragen, bijzonderheden en voorwaarden.\nIndien gewenst verzamelen wij aanvullende gegevens over de woning.\nBij akkoord worden de afspraken schriftelijk bevestigd.\nDe overdracht en betaling verlopen via de notaris.",
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
    seller_work_amount_text: "€ 5.700",
    seller_work_base_price_text: "€ 300.000",
    seller_work_total_price_text: "€ 305.700",
    seller_work_conditions_text: "Wanneer de werkzaamheden niet, niet volledig of niet deugdelijk zijn uitgevoerd, kan de aanvullende koopprijs worden verminderd met de redelijkerwijs benodigde kosten om de werkzaamheden alsnog te voltooien of te herstellen.",
    resale_payment_enabled: false,
    resale_threshold_text: "€ 350.000",
    resale_percentage_text: "20",
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

export default function LeadDetailPage({ params }) {
  const [leadId, setLeadId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [task, setTask] = useState({ title: "", due_date: todayPlus(1), note: "" });
  const [proposal, setProposal] = useState(null);
  const [contactForm, setContactForm] = useState({ naam: "", email: "", telefoon: "" });

  useEffect(() => {
    Promise.resolve(params).then((resolved) => setLeadId(resolved.id));
  }, [params]);

  async function load(id = leadId) {
    if (!id) return;
    const res = await fetch(`/api/admin/v2?action=lead&id=${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Lead ophalen mislukt. Log eventueel opnieuw in via /admin.");
      return;
    }
    setData(json);
    if (json.lead) setProposal(applyAdditionalAgreementDefaults(defaultProposalForLead(json.lead)));
  }

  async function post(body) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Opslaan mislukt.");
        return null;
      }
      await load();
      return json;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { if (leadId) load(leadId); }, [leadId]);

  const lead = data?.lead;

  useEffect(() => {
    if (!lead) return;
    setContactForm({
      naam: lead.naam || "",
      email: lead.email || "",
      telefoon: lead.telefoon || "",
    });
  }, [lead?.id, lead?.naam, lead?.email, lead?.telefoon]);

  const latestProposal = useMemo(() => {
    return (data?.proposals || [])[0] || null;
  }, [data?.proposals]);

  const netComparison = useMemo(() => {
    return calculateNetComparison(proposal || {});
  }, [proposal]);

  const sellerWorkTotal = useMemo(() => calculateSellerWorkTotal(proposal || {}), [proposal]);
  const resaleExample = useMemo(() => calculateResaleExample(proposal || {}), [proposal]);

  function setProposalField(field, value) {
    setProposal((current) => {
      const next = { ...(current || {}), [field]: value };
      if (["seller_work_base_price_text", "seller_work_amount_text", "seller_work_enabled"].includes(field)) {
        if (field === "seller_work_enabled" && value) {
          next.seller_work_base_price_text = next.seller_work_base_price_text || next.amount_text || "€ 300.000";
          next.seller_work_amount_text = next.seller_work_amount_text || "€ 5.700";
        }
        next.seller_work_total_price_text = calculateSellerWorkTotal(next);
      }
      if (field === "resale_payment_enabled" && value) {
        next.resale_threshold_text = next.resale_threshold_text || "€ 350.000";
        next.resale_percentage_text = next.resale_percentage_text || "20";
        next.resale_period_months = next.resale_period_months || 12;
        next.resale_deduct_courtage = next.resale_deduct_courtage === undefined || next.resale_deduct_courtage === null ? true : next.resale_deduct_courtage;
      }
      if (field === "resale_percentage_text") {
        next.resale_percentage_text = formatPercent(value) || value;
      }
      return next;
    });
  }

  const specialProposalType = isSpecialProposalType(proposal?.proposal_type);

  function handleProposalTypeChange(type) {
    setProposal((current) => {
      const base = { ...(current || {}), proposal_type: type };
      if (!isSpecialProposalType(type)) {
        return base;
      }

      return {
        ...base,
        delivery_term_text: base.delivery_term_text || "Uiterlijk binnen 6 maanden",
        transfer_date_text: base.transfer_date_text && base.transfer_date_text !== "In overleg" ? base.transfer_date_text : "Uiterlijk binnen 6 maanden",
        buyer_text: base.buyer_text || "Vastgoed Direct Nederland of nader te noemen meester",
        // Juridisch relevante keuzes niet automatisch aanvinken.
        // Alleen ABC wordt logisch gekoppeld aan het voorsteltype; overige punten moeten bewust worden aangevinkt.
        allow_kadaster_registration: Boolean(base.allow_kadaster_registration),
        allow_abc_resale: type === "ABC-doorverkoop mogelijk" ? true : Boolean(base.allow_abc_resale),
        seller_cooperates_resale: Boolean(base.seller_cooperates_resale),
        delivery_free_of_claims: Boolean(base.delivery_free_of_claims),
        property_same_state: Boolean(base.property_same_state),
        bridge_goal_text: type === "Overbruggingsoplossing" && !base.bridge_goal_text
          ? "De verkoop is bedoeld om de lopende overbrugging af te lossen en de huidige woonsituatie te behouden."
          : base.bridge_goal_text,
        bridge_explanation_text: type === "Overbruggingsoplossing" && !base.bridge_explanation_text
          ? "Dit voorstel geeft verkoper duidelijkheid over de verkoop van de oude woning. De definitieve afspraken worden vastgelegd in een koopovereenkomst."
          : base.bridge_explanation_text,
      };
    });
  }

  async function createProposal() {
    if (!proposal) return;
    const calculatedProposal = buildCalculatedProposalPayload(applyAdditionalAgreementDefaults(proposal));
    const result = await post({ action: "createProposal", ...calculatedProposal });
    if (result?.proposal?.id) {
      setNotice("Voorstel is aangemaakt. Controleer de print/PDF-versie voordat u het voorstel mailt.");
      window.open(`/admin/voorstellen/${result.proposal.id}/print`, "_blank", "noopener,noreferrer");
    }
  }

  async function saveContactDetails() {
    if (contactForm.email && !isValidEmail(contactForm.email)) {
      setError("Voer een geldig e-mailadres in voordat u de contactgegevens opslaat.");
      return;
    }
    const result = await post({
      action: "updateLead",
      id: lead.id,
      naam: contactForm.naam,
      email: contactForm.email,
      telefoon: contactForm.telefoon,
    });
    if (result?.lead) setNotice("Contactgegevens zijn bijgewerkt.");
  }

  async function updateProposalEmail(id, email) {
    if (!isValidEmail(email)) {
      setError("Voer een geldig e-mailadres in voordat u het voorstel bijwerkt.");
      return;
    }
    const result = await post({ action: "updateProposal", id, lead_email: email });
    if (result?.proposal) setNotice("E-mailadres van het voorstel is bijgewerkt.");
  }

  async function sendProposal(id, recipientEmail) {
    const targetEmail = String(recipientEmail || "").trim();
    if (!isValidEmail(targetEmail)) {
      setError("Voorstel kan niet worden verzonden: e-mailadres ontbreekt of is ongeldig.");
      return;
    }
    const confirmed = window.confirm(`Dit voorstel wordt verzonden naar ${targetEmail}. Klopt dit e-mailadres?`);
    if (!confirmed) return;
    const result = await post({ action: "sendProposalEmail", id, lead_email: targetEmail });
    if (result?.ok) {
      setNotice(result.skipped
        ? "Mail is overgeslagen omdat Resend niet actief is ingesteld. De persoonlijke voorstelpagina is wel beschikbaar."
        : `Voorstel is naar ${targetEmail} gemaild en vastgelegd in de mailhistorie.`);
    }
  }

  function useProposalAsBase(item) {
    setProposal(normalizeProposalForForm(item, lead));
    setNotice("Bestaand voorstel is geladen als basis. Controleer de velden en maak daarna een nieuw voorstel aan.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="detail-page">
      <style>{styles}</style>
      <header>
        <a href="/admin">← Dashboard</a>
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
      </header>

      {error ? <div className="error">{error}</div> : null}
      {notice ? <div className="notice-top">{notice}</div> : null}
      {!lead ? <section className="card"><p>Lead laden...</p></section> : (
        <>
          <section className="hero card">
            <div>
              <span>Lead detail</span>
              <h1>{lead.naam || "Naam onbekend"}</h1>
              <p>{lead.postcode || "-"} {lead.huisnummer || ""}</p>
            </div>
            <div className="actions">
              {lead.telefoon ? <a href={`tel:${cleanPhone(lead.telefoon)}`}>Bellen</a> : null}
              {lead.email ? <a href={`mailto:${lead.email}`}>Mailen</a> : null}
              <button disabled={saving} onClick={() => post({ action: "updateLead", id: lead.id, last_contact_at: new Date().toISOString(), status: ["Nieuw", "Nieuwe aanvraag"].includes(lead.status) ? "In behandeling" : lead.status })}>Contact gehad</button>
            </div>
          </section>

          <nav className="admin-quick-nav" aria-label="Admin snelnavigatie">
            <a href="#contact">Contact</a>
            <a href="#woning">Woning en aanvraag</a>
            <a href="#bron">Bron</a>
            <a href="#voorstel-maken">Voorstel maken</a>
            <a href="#taken">Taken</a>
            <a href="#voorstellen">Voorstellen</a>
          </nav>

          <section className="grid">
            <article className="card" id="contact">
              <h2>Contactgegevens</h2>
              <div className="form-grid compact-two">
                <Field label="Naam">
                  <input value={contactForm.naam} onChange={(e) => setContactForm({ ...contactForm, naam: e.target.value })} />
                </Field>
                <Field label="E-mail">
                  <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </Field>
                <Field label="Telefoon">
                  <input type="tel" value={contactForm.telefoon} onChange={(e) => setContactForm({ ...contactForm, telefoon: e.target.value })} />
                </Field>
                <div className="contact-save-box">
                  <button disabled={saving || (contactForm.email && !isValidEmail(contactForm.email))} onClick={saveContactDetails}>Contactgegevens opslaan</button>
                  {contactForm.email && !isValidEmail(contactForm.email) ? <small>Ongeldig e-mailadres.</small> : <small>Deze gegevens worden gebruikt bij opvolging en nieuwe voorstellen.</small>}
                </div>
              </div>

              <h2 className="subheading" id="woning">Aanvraag</h2>
              <div className="info-grid">
                <Info label="Woningtype" value={lead.woningtype} />
                <Info label="Staat" value={lead.staat} />
                <Info label="Reden" value={lead.reden} />
                <Info label="Pagina" value={lead.pagina} />
                <Info label="Bron" value={lead.bron} />
                <Info label="Aangemaakt" value={fmt(lead.created_at)} />
              </div>
              <div id="bron"><SourceDetails lead={lead} /></div>
              <Field label="Status">
                <select value={selectStatusValue(lead.status)} onChange={(e) => post({ action: "updateLead", id: lead.id, status: e.target.value })}>
                  {STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Notitie">
                <textarea defaultValue={lead.notitie || ""} onBlur={(e) => post({ action: "updateLead", id: lead.id, notitie: e.target.value })} />
              </Field>
            </article>

            <article className="card">
              <h2>Nieuwe taak</h2>
              <input placeholder="Bijv. klant nabellen" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              <input type="date" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} />
              <textarea placeholder="Toelichting" value={task.note} onChange={(e) => setTask({ ...task, note: e.target.value })} />
              <button disabled={saving} onClick={async () => { await post({ action: "createTask", lead_id: lead.id, lead_naam: lead.naam, ...task }); setTask({ title: "", due_date: todayPlus(1), note: "" }); }}>Taak opslaan</button>
            </article>
          </section>

          <section className="admin-checklist card">
            <h2>Snelle controle</h2>
            <div className="checklist-grid">
              <span className={lead.email ? "ok" : "warn"}>{lead.email ? "E-mailadres aanwezig" : "E-mailadres ontbreekt"}</span>
              <span className={lead.telefoon ? "ok" : "warn"}>{lead.telefoon ? "Telefoonnummer aanwezig" : "Telefoonnummer ontbreekt"}</span>
              <span className={latestProposal ? "ok" : "muted"}>{latestProposal ? "Voorstel aanwezig" : "Nog geen voorstel"}</span>
              <span className={latestProposal?.emailed_at ? "ok" : "muted"}>{latestProposal?.emailed_at ? "Voorstel gemaild" : "Nog niet gemaild"}</span>
            </div>
          </section>

          <section className="card proposal-card" id="voorstel-maken">
            <div className="section-head">
              <div>
                <span>Premium voorstel</span>
                <h2>Uitgebreid verkoopvoorstel maken</h2>
                <p>Maak een voorstel met voorblad, woninggegevens, uitgangspunten, netto-opbrengstvergelijking, voorwaarden en vervolgstappen.</p>
              </div>
              {latestProposal ? <a className="secondary-link" href={`/admin/voorstellen/${latestProposal.id}/print`} target="_blank">Laatste voorstel openen</a> : null}
            </div>

            {proposal ? (
              <div className="proposal-form">
                <div className="form-section">
                  <h3>1. Basis</h3>
                  <div className="form-grid">
                    <Field label="Naam klant"><input value={proposal.lead_naam} onChange={(e) => setProposalField("lead_naam", e.target.value)} /></Field>
                    <Field label="E-mail klant"><input value={proposal.lead_email} onChange={(e) => setProposalField("lead_email", e.target.value)} /></Field>
                    <Field label="Telefoon klant"><input value={proposal.lead_telefoon} onChange={(e) => setProposalField("lead_telefoon", e.target.value)} /></Field>
                    <Field label="Contactpersoon"><input value={proposal.contact_person} onChange={(e) => setProposalField("contact_person", e.target.value)} /></Field>
                    <Field label="Voorgesteld bedrag"><input placeholder="Bijv. € 190.000" value={proposal.amount_text} onChange={(e) => setProposalField("amount_text", e.target.value)} /></Field>
                    <Field label="Geldig tot"><input type="date" value={proposal.validity_date} onChange={(e) => setProposalField("validity_date", e.target.value)} /></Field>
                    <Field label="Oplevering"><input value={proposal.transfer_date_text} onChange={(e) => setProposalField("transfer_date_text", e.target.value)} /></Field>
                    <Field label="Aanbetaling / voorschot"><input value={proposal.deposit_text} onChange={(e) => setProposalField("deposit_text", e.target.value)} /></Field>
                  </div>
                </div>

                <div className="form-section">
                  <h3>2. Woninggegevens</h3>
                  <div className="form-grid">
                    <Field label="Adres / woning"><input value={proposal.property_address} onChange={(e) => setProposalField("property_address", e.target.value)} /></Field>
                    <Field label="Postcode"><input value={proposal.property_postcode} onChange={(e) => setProposalField("property_postcode", e.target.value.toUpperCase())} /></Field>
                    <Field label="Huisnummer"><input value={proposal.property_house_number} onChange={(e) => setProposalField("property_house_number", e.target.value)} /></Field>
                    <Field label="Type woning"><input value={proposal.property_type} onChange={(e) => setProposalField("property_type", e.target.value)} /></Field>
                    <Field label="Woonoppervlakte"><input placeholder="Bijv. 178 m²" value={proposal.living_area_text} onChange={(e) => setProposalField("living_area_text", e.target.value)} /></Field>
                    <Field label="Perceeloppervlakte"><input placeholder="Bijv. 970 m²" value={proposal.plot_area_text} onChange={(e) => setProposalField("plot_area_text", e.target.value)} /></Field>
                    <Field label="Bouwjaar"><input value={proposal.build_year_text} onChange={(e) => setProposalField("build_year_text", e.target.value)} /></Field>
                    <Field label="Huidige situatie"><input value={proposal.current_situation} onChange={(e) => setProposalField("current_situation", e.target.value)} /></Field>
                  </div>
                </div>

                <div className="form-section">
                  <h3>3. Netto-opbrengstvergelijking</h3>
                  <p className="calc-help">Vul de traditionele verkoopprijs als indicatieve vergelijkingswaarde in. Bij verhuurde, leeg te leveren of gemengde objecten mag deze waarde ook rendementsmatig worden benaderd op basis van huurwaarde, leegstand, verhuurrisico en kosten. Vul makelaarskosten en overige verkoopkosten exclusief btw in; het adminportaal rekent automatisch 21% btw door. Vul afwikkelingskosten alleen in als deze normaal voor verkoper komen en VDN ze in dit voorstel overneemt.</p>
                  <div className="form-grid">
                    <Field label="Traditionele verkoopprijs"><input inputMode="decimal" placeholder="Bijv. € 240.000" value={proposal.traditional_price_text} onChange={(e) => setProposalField("traditional_price_text", e.target.value)} /></Field>
                    <Field label="Makelaarskosten excl. btw"><input inputMode="decimal" placeholder="Bijv. € 3.600" value={proposal.agent_costs_text} onChange={(e) => setProposalField("agent_costs_text", e.target.value)} /></Field>
                    <Field label="Door VDN overgenomen afwikkelingskosten verkoper"><input inputMode="decimal" placeholder="Bijv. € 750" value={proposal.notary_costs_text} onChange={(e) => setProposalField("notary_costs_text", e.target.value)} /></Field>
                    <Field label="Herstel-/renovatiekosten"><input inputMode="decimal" placeholder="Bijv. € 45.000" value={proposal.renovation_costs_text} onChange={(e) => setProposalField("renovation_costs_text", e.target.value)} /></Field>
                    <Field label="Overige verkoopkosten excl. btw"><input inputMode="decimal" placeholder="Bijv. € 950" value={proposal.other_costs_text} onChange={(e) => setProposalField("other_costs_text", e.target.value)} /></Field>
                    <Field label="Netto Vastgoed Direct"><input inputMode="decimal" placeholder="Automatisch uit voorgesteld bedrag" value={proposal.direct_net_text} onChange={(e) => setProposalField("direct_net_text", e.target.value)} /></Field>
                  </div>


                  <p className="calc-help small">Onder door VDN overgenomen afwikkelingskosten verkoper vallen alleen vooraf afgesproken kosten aan verkoperszijde, zoals volmachtskosten, royement/doorhaling van hypotheekinschrijvingen of bijzondere afwikkelingskosten. Kosten die normaal voor koper zijn bij kosten koper worden hier niet als verkoperskosten meegenomen. Neem deze post alleen op als VDN deze kosten in het voorstel of de koopovereenkomst voor haar rekening neemt.</p>

                  <div className="calc-summary">
                    <div><span>Makelaarskosten incl. 21% btw</span><strong>{formatMoney(netComparison.agentInclVat, true) || "-"}</strong></div>
                    <div><span>Overige verkoopkosten incl. 21% btw</span><strong>{formatMoney(netComparison.otherInclVat, true) || "-"}</strong></div>
                    <div><span>Netto traditioneel</span><strong>{formatMoney(netComparison.traditionalNet) || "-"}</strong></div>
                    <div><span>Netto Vastgoed Direct</span><strong>{formatMoney(netComparison.directNet) || "-"}</strong></div>
                    <div className={netComparison.difference >= 0 ? "positive" : "negative"}><span>Verschil netto</span><strong>{netComparison.directNet && netComparison.traditionalNet ? formatMoney(Math.abs(netComparison.difference), netComparison.difference < 0) : "-"}</strong></div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>4. Levering & constructie</h3>
                  <div className="form-grid">
                    <Field label="Type voorstel">
                      <select value={proposal.proposal_type || "Standaard aankoop"} onChange={(e) => handleProposalTypeChange(e.target.value)}>
                        {PROPOSAL_TYPES.map((type) => <option key={type}>{type}</option>)}
                      </select>
                    </Field>
                    {specialProposalType ? (
                      <>
                        <Field label="Passeertermijn"><input value={proposal.delivery_term_text} onChange={(e) => setProposalField("delivery_term_text", e.target.value)} /></Field>
                        <Field label="Gewenste leverdatum"><input type="date" value={proposal.desired_transfer_date || ""} onChange={(e) => setProposalField("desired_transfer_date", e.target.value)} /></Field>
                        <Field label="Koper"><input value={proposal.buyer_text} onChange={(e) => setProposalField("buyer_text", e.target.value)} /></Field>
                      </>
                    ) : null}
                  </div>
                  {specialProposalType ? (
                    <div className="checkbox-grid">
                      <label className="checkbox-label"><input type="checkbox" checked={Boolean(proposal.allow_kadaster_registration)} onChange={(e) => setProposalField("allow_kadaster_registration", e.target.checked)} /><span>Koopovereenkomst mag worden ingeschreven bij het Kadaster</span></label>
                      <label className="checkbox-label"><input type="checkbox" checked={Boolean(proposal.allow_abc_resale)} onChange={(e) => setProposalField("allow_abc_resale", e.target.checked)} /><span>ABC-doorverkoop mogelijk</span></label>
                      <label className="checkbox-label"><input type="checkbox" checked={Boolean(proposal.seller_cooperates_resale)} onChange={(e) => setProposalField("seller_cooperates_resale", e.target.checked)} /><span>Verkoper werkt mee aan taxatie, bezichtiging en voorbereiding doorverkoop</span></label>
                      <label className="checkbox-label"><input type="checkbox" checked={Boolean(proposal.delivery_free_of_claims)} onChange={(e) => setProposalField("delivery_free_of_claims", e.target.checked)} /><span>Levering vrij van huur, gebruik, beslagen en hypotheken</span></label>
                      <label className="checkbox-label"><input type="checkbox" checked={Boolean(proposal.property_same_state)} onChange={(e) => setProposalField("property_same_state", e.target.checked)} /><span>Woning blijft tot levering in huidige staat</span></label>
                    </div>
                  ) : (
                    <p className="calc-help">Kies uitgestelde levering, overbruggingsoplossing of ABC-doorverkoop om aanvullende constructievelden te tonen.</p>
                  )}
                </div>

                {specialProposalType ? (
                  <div className="form-section">
                    <h3>5. Overbruggingssituatie</h3>
                    <div className="form-grid">
                      <Field label="Huidige woning klant"><input placeholder="Bijv. Tivoliweg 22, 4561 HL Hulst" value={proposal.bridge_current_home} onChange={(e) => setProposalField("bridge_current_home", e.target.value)} /></Field>
                      <Field label="Oude woning / te verkopen woning"><input placeholder="Bijv. Achtereindstraat 26, 4569 AZ Graauw" value={proposal.bridge_old_home} onChange={(e) => setProposalField("bridge_old_home", e.target.value)} /></Field>
                      <Field label="Doel van de constructie"><input value={proposal.bridge_goal_text} onChange={(e) => setProposalField("bridge_goal_text", e.target.value)} /></Field>
                    </div>
                    <Field label="Toelichting voor in het voorstel">
                      <textarea value={proposal.bridge_explanation_text} onChange={(e) => setProposalField("bridge_explanation_text", e.target.value)} />
                    </Field>
                  </div>
                ) : null}

                <div className="form-section additional-agreements-section">
                  <h3>6. Aanvullende afspraken</h3>
                  <p className="calc-help">Schakel alleen de afspraken in die in dit voorstel moeten worden opgenomen. Uitgeschakelde onderdelen verschijnen niet in de klantversie of PDF.</p>

                  <div className="agreement-block">
                    <label className="checkbox-label wide-check"><input type="checkbox" checked={Boolean(proposal.seller_work_enabled)} onChange={(e) => setProposalField("seller_work_enabled", e.target.checked)} /><span>Werkzaamheden door verkoper opnemen</span></label>
                    {proposal.seller_work_enabled ? (
                      <>
                        <div className="form-grid">
                          <Field label="Basiskoopprijs"><input inputMode="decimal" value={proposal.seller_work_base_price_text || ""} onChange={(e) => setProposalField("seller_work_base_price_text", e.target.value)} /></Field>
                          <Field label="Bedrag werkzaamheden"><input inputMode="decimal" value={proposal.seller_work_amount_text || ""} onChange={(e) => setProposalField("seller_work_amount_text", e.target.value)} /></Field>
                          <Field label="Totale koopprijs na uitvoering"><input value={sellerWorkTotal || proposal.seller_work_total_price_text || ""} readOnly /></Field>
                          <Field label="Uiterste uitvoeringsdatum"><input type="date" value={proposal.seller_work_deadline || ""} onChange={(e) => setProposalField("seller_work_deadline", e.target.value)} /></Field>
                        </div>
                        <Field label="Omschrijving werkzaamheden">
                          <textarea placeholder="Omschrijf concreet welke herstelwerkzaamheden verkoper uitvoert." value={proposal.seller_work_description || ""} onChange={(e) => setProposalField("seller_work_description", e.target.value)} />
                        </Field>
                        <Field label="Aanvullende voorwaarden/opmerkingen werkzaamheden">
                          <textarea value={proposal.seller_work_conditions_text || ""} onChange={(e) => setProposalField("seller_work_conditions_text", e.target.value)} />
                        </Field>
                        <div className="agreement-preview">
                          <strong>Voorsteltekst</strong>
                          <p>Verkoper zal vóór de juridische levering de in dit voorstel omschreven herstelwerkzaamheden uitvoeren. Wanneer deze werkzaamheden volledig en deugdelijk zijn uitgevoerd en door koper zijn goedgekeurd, wordt de basiskoopprijs verhoogd met {formatMoney(parseMoney(proposal.seller_work_amount_text)) || "het ingevulde bedrag"}. De totale koopprijs bedraagt in dat geval {sellerWorkTotal || "het berekende totaalbedrag"} kosten koper.</p>
                          <small>Let op: dit wordt als mogelijke verhoging van de koopsom bij notariële levering weergegeven, niet als losse betaling vóór levering.</small>
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="agreement-block">
                    <label className="checkbox-label wide-check"><input type="checkbox" checked={Boolean(proposal.resale_payment_enabled)} onChange={(e) => setProposalField("resale_payment_enabled", e.target.checked)} /><span>Aanvullende betaling bij doorverkoop opnemen</span></label>
                    {proposal.resale_payment_enabled ? (
                      <>
                        <div className="form-grid">
                          <Field label="Drempelbedrag doorverkoop"><input inputMode="decimal" value={proposal.resale_threshold_text || ""} onChange={(e) => setProposalField("resale_threshold_text", e.target.value)} /></Field>
                          <Field label="Percentage meeropbrengst"><input inputMode="decimal" min="0" max="100" value={proposal.resale_percentage_text || ""} onChange={(e) => setProposalField("resale_percentage_text", e.target.value)} /></Field>
                          <Field label="Periode in maanden"><input inputMode="numeric" min="1" type="number" value={proposal.resale_period_months || ""} onChange={(e) => setProposalField("resale_period_months", e.target.value)} /></Field>
                          <Field label="Maximumbedrag optioneel"><input inputMode="decimal" placeholder="Leeg laten als er geen maximum is" value={proposal.resale_cap_text || ""} onChange={(e) => setProposalField("resale_cap_text", e.target.value)} /></Field>
                        </div>
                        <div className="checkbox-grid single">
                          <label className="checkbox-label"><input type="checkbox" checked={Boolean(proposal.resale_deduct_courtage)} onChange={(e) => setProposalField("resale_deduct_courtage", e.target.checked)} /><span>Makelaarscourtage van de latere doorverkoop aftrekken</span></label>
                        </div>
                        <Field label="Aanvullende toelichting">
                          <textarea value={proposal.resale_explanation_text || ""} onChange={(e) => setProposalField("resale_explanation_text", e.target.value)} />
                        </Field>
                        <div className="agreement-preview">
                          <strong>Rekenvoorbeeld admin</strong>
                          <p>Doorverkoopprijs {formatMoney(resaleExample.salePrice)} · courtage {formatMoney(resaleExample.courtage) || "€ 0"} · netto doorverkoopprijs {formatMoney(resaleExample.netResale)} · meeropbrengst {formatMoney(resaleExample.surplus) || "€ 0"} · aanvullende betaling {formatMoney(resaleExample.payment) || "€ 0"}.</p>
                          <small>Alleen de courtage van de latere doorverkoop wordt afgetrokken. De courtage van de huidige verkoopmakelaar van verkoper wordt niet afgetrokken.</small>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="form-section use-rental-section">
                  <h3>7. Gebruik, verhuur en oplevering</h3>
                  <p className="calc-help">Gebruik deze optionele sectie bij verhuurde woningen, bedrijfsruimtes, woon-winkelpanden en gemengde objecten. Alleen zichtbaar in voorstel/PDF wanneer ingeschakeld.</p>
                  <label className="checkbox-label wide-check"><input type="checkbox" checked={Boolean(proposal.use_rental_enabled)} onChange={(e) => setProposalField("use_rental_enabled", e.target.checked)} /><span>Gebruik, verhuur en oplevering opnemen</span></label>
                  {proposal.use_rental_enabled ? (
                    <>
                      <div className="form-grid">
                        <SelectField label="Objecttype" value={proposal.object_usage_type} onChange={(value) => setProposalField("object_usage_type", value)} options={OBJECT_USAGE_TYPES} />
                        <SelectField label="Huidig gebruik" value={proposal.current_occupancy_status} onChange={(value) => setProposalField("current_occupancy_status", value)} options={OCCUPANCY_STATUSES} />
                        <SelectField label="Wordt geleverd" value={proposal.delivery_occupancy_status} onChange={(value) => setProposalField("delivery_occupancy_status", value)} options={DELIVERY_OCCUPANCY_STATUSES} />
                        <SelectField label="Huurovereenkomst aanwezig" value={proposal.lease_agreement_available} onChange={(value) => setProposalField("lease_agreement_available", value)} options={YES_NO_UNKNOWN} />
                        <Field label="Einddatum huur"><input type="date" value={proposal.lease_end_date || ""} onChange={(e) => setProposalField("lease_end_date", e.target.value)} /></Field>
                        <Field label="Uiterste ontruiming"><input type="date" value={proposal.tenant_vacate_deadline || ""} onChange={(e) => setProposalField("tenant_vacate_deadline", e.target.value)} /></Field>
                        <SelectField label="Huurder werkt mee" value={proposal.tenant_cooperation_status} onChange={(value) => setProposalField("tenant_cooperation_status", value)} options={TENANT_COOPERATION_STATUSES} />
                        <Field label="Actuele huur"><input inputMode="decimal" placeholder="Bijv. € 1.500 p.m." value={proposal.current_rent_text || ""} onChange={(e) => setProposalField("current_rent_text", e.target.value)} /></Field>
                        <SelectField label="Waarborgsom aanwezig" value={proposal.deposit_present} onChange={(value) => setProposalField("deposit_present", value)} options={YES_NO_UNKNOWN} />
                        <SelectField label="Huurachterstand/geschil" value={proposal.rent_arrears_or_dispute} onChange={(value) => setProposalField("rent_arrears_or_dispute", value)} options={YES_NO_UNKNOWN} />
                        <Field label="Winkel-/bedrijfsruimte"><input placeholder="Bijv. 165 m²" value={proposal.commercial_area_text || ""} onChange={(e) => setProposalField("commercial_area_text", e.target.value)} /></Field>
                        <Field label="Woonruimte"><input placeholder="Bijv. 60-65 m²" value={proposal.residential_area_text || ""} onChange={(e) => setProposalField("residential_area_text", e.target.value)} /></Field>
                        <SelectField label="Aparte entree bovenwoning" value={proposal.separate_entrance_status} onChange={(value) => setProposalField("separate_entrance_status", value)} options={YES_NO_UNKNOWN} />
                        <SelectField label="Zelfstandige woonruimte" value={proposal.independent_residence_status} onChange={(value) => setProposalField("independent_residence_status", value)} options={YES_NO_UNKNOWN} />
                        <SelectField label="Bestemming/vergunningen gecontroleerd" value={proposal.zoning_permits_checked} onChange={(value) => setProposalField("zoning_permits_checked", value)} options={YES_NO_UNKNOWN} />
                        <SelectField label="Splitsingsmogelijkheid relevant" value={proposal.split_potential_status} onChange={(value) => setProposalField("split_potential_status", value)} options={YES_NO_UNKNOWN} />
                        <SelectField label="Brandveiligheid/gebruiksvereisten" value={proposal.fire_safety_check_status} onChange={(value) => setProposalField("fire_safety_check_status", value)} options={YES_NO_UNKNOWN} />
                      </div>
                      <Field label="Aanvullende toelichting gebruik/verhuur">
                        <textarea placeholder="Bijv. winkelruimte is nu verhuurd, maar uitgangspunt is levering vrij van huur en gebruik." value={proposal.use_rental_notes_text || ""} onChange={(e) => setProposalField("use_rental_notes_text", e.target.value)} />
                      </Field>
                      <div className="agreement-preview">
                        <strong>Voorsteltekst</strong>
                        <p>Uitgangspunt van dit voorstel is dat het object bij juridische levering {String(proposal.delivery_occupancy_status || "vrij van huur en gebruik").toLowerCase()} wordt geleverd, tenzij schriftelijk anders overeengekomen. Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming en eventuele vergunningen vóór definitieve vastlegging gecontroleerd.</p>
                        <p><strong>Gevolg voor het voorstel:</strong> als het object niet volgens deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan het voorstel worden herbeoordeeld, aangepast of ingetrokken.</p>
                        <small>Deze sectie is bedoeld voor verhuurde woningen, bedrijfsruimtes, woon-winkelpanden en gemengde objecten. De financiële vergelijking blijft apart staan, maar wordt gelezen vanuit dit leveringsuitgangspunt.</small>
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="form-section">
                  <h3>8. Teksten en voorwaarden</h3>
                  <Field label="Uitgangspunten van dit voorstel">
                    <textarea value={proposal.assumptions_text} onChange={(e) => setProposalField("assumptions_text", e.target.value)} />
                  </Field>
                  <Field label="Wat is inbegrepen — één regel per punt">
                    <textarea value={proposal.included_items} onChange={(e) => setProposalField("included_items", e.target.value)} />
                  </Field>
                  <Field label="Voorwaarden">
                    <textarea value={proposal.conditions_text} onChange={(e) => setProposalField("conditions_text", e.target.value)} />
                  </Field>
                  <Field label="Voorbehoud en totstandkoming">
                    <textarea value={proposal.nonbinding_text || ""} onChange={(e) => setProposalField("nonbinding_text", e.target.value)} />
                  </Field>
                  <Field label="Korte vergelijking / toelichting">
                    <textarea value={proposal.short_comparison_text} onChange={(e) => setProposalField("short_comparison_text", e.target.value)} />
                  </Field>
                  <Field label="Voorbehouden — één regel per punt">
                    <textarea value={proposal.reservations_text} onChange={(e) => setProposalField("reservations_text", e.target.value)} />
                  </Field>
                  <Field label="Vervolgstappen — één regel per stap">
                    <textarea value={proposal.next_steps_text} onChange={(e) => setProposalField("next_steps_text", e.target.value)} />
                  </Field>
                  <Field label="Aanvullende opmerkingen">
                    <textarea value={proposal.notes} onChange={(e) => setProposalField("notes", e.target.value)} />
                  </Field>
                </div>

                <div className="proposal-actions">
                  <button disabled={saving || !proposal.amount_text} onClick={createProposal}>Voorstel maken en openen</button>
                  <button type="button" className="ghost" onClick={() => setProposal(applyAdditionalAgreementDefaults(defaultProposalForLead(lead)))}>Velden herstellen</button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid three">
            <article className="card" id="taken"><h2>Taken</h2>{(data.tasks || []).map((item) => <div className="item" key={item.id}><strong>{item.title}</strong><span>{item.status} · {item.due_date || "geen datum"}</span><select value={item.status || "Open"} onChange={(e) => post({ action: "updateTask", id: item.id, status: e.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>)}</article>
            <article className="card" id="voorstellen"><h2>Voorstellen</h2>{(data.proposals || []).map((item) => <ProposalListItem key={item.id} item={item} lead={lead} saving={saving} sendProposal={sendProposal} useProposalAsBase={useProposalAsBase} updateProposalEmail={updateProposalEmail} />)}</article>
            <article className="card"><h2>Mailhistorie</h2>{(data.mailLogs || []).map((item) => <div className="item" key={item.id}><strong>{item.type}</strong><span>{item.status} · {item.recipient}</span><small>{fmt(item.created_at)}</small></div>)}</article>
          </section>
        </>
      )}
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--orange:#D96A1C;--green:#3E8F5E;--shadow:0 22px 70px rgba(7,31,58,.12)}body{margin:0;background:radial-gradient(circle at top right,#FFF1E6,transparent 34%),var(--bg);color:var(--navy);font-family:Inter,Arial,Helvetica,sans-serif}.detail-page{max-width:1280px;margin:0 auto;padding:28px}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}header a{color:var(--navy);font-weight:900;text-decoration:none}header img{width:220px;background:#fff;border-radius:18px;padding:10px}.card{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:24px;box-shadow:var(--shadow)}.hero{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:18px}.hero span,.section-head span{color:#B85216;background:#FFF1E6;border:1px solid #F2B885;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900;text-transform:uppercase}.hero h1{font-size:42px;letter-spacing:-.04em;margin:12px 0 6px}.hero p,.section-head p{color:var(--muted);font-size:18px}.actions,.proposal-actions{display:flex;gap:10px;flex-wrap:wrap}.actions a,.actions button,.card button,.item a,.secondary-link{border:0;background:var(--orange);color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-weight:900;cursor:pointer;display:inline-block;margin-right:8px;margin-top:8px}.actions a:first-child{background:var(--navy)}.grid{display:grid;grid-template-columns:1.3fr .7fr;gap:18px;margin-bottom:18px}.grid.three{grid-template-columns:repeat(3,1fr)}h2{margin:0 0 18px;font-size:24px;letter-spacing:-.03em}h3{margin:0 0 16px;font-size:20px}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px}.info{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.source-detail-box{margin:18px 0;background:#fff;border:1px solid var(--line);border-radius:22px;padding:16px}.source-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}.source-head h3{margin:0 0 4px}.source-head p{margin:0;color:var(--muted);font-size:13px}.source-pill{background:#071f3a;color:#fff;border-radius:999px;padding:7px 10px;font-size:12px;font-weight:900;white-space:nowrap}.source-summary-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.source-summary-row span{background:#f8f5ef;border:1px solid var(--line);border-radius:999px;padding:6px 9px;color:var(--muted);font-size:12px;font-weight:800}.admin-quick-nav{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.admin-quick-nav a{background:#fffdf9;border:1px solid var(--line);color:var(--navy);border-radius:999px;padding:10px 13px;text-decoration:none;font-weight:900;box-shadow:0 8px 24px rgba(7,31,58,.05)}.admin-checklist{margin-bottom:18px}.checklist-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.checklist-grid span{border-radius:16px;border:1px solid var(--line);background:#f8f5ef;padding:12px;font-weight:900;font-size:13px}.checklist-grid .ok{background:#f0fff6;border-color:#bff3d0;color:#075c2a}.checklist-grid .warn{background:#fff5f1;border-color:#ffd5c4;color:#7c2d20}.checklist-grid .muted{color:var(--muted)}.source-detail-box h3{margin:0 0 12px;font-size:18px}.info span,.item span,.item small,label span{display:block;color:var(--muted);font-size:13px}.info strong{display:block;margin-top:6px;word-break:break-word}label{display:grid;gap:8px;font-weight:900;margin-top:12px}input,select,textarea{width:100%;border:1px solid var(--line);border-radius:16px;padding:13px 14px;font:inherit;background:#fff}textarea{min-height:110px;resize:vertical}.item{border-bottom:1px solid var(--line);padding:12px 0}.item:last-child{border-bottom:0}.item strong{display:block}.item a{margin-top:8px;background:var(--navy)}.item button.small{margin-top:8px;margin-left:8px;padding:9px 12px;font-size:13px}.error,.notice-top{border-radius:16px;padding:12px 14px;margin-bottom:16px}.error{background:#F8EEE9;color:#7C2D20;border:1px solid #E8C7BC}.notice-top{background:#f0fff6;color:#075c2a;border:1px solid #bff3d0}.proposal-card{margin:18px 0}.section-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.section-head h2{font-size:34px;margin:12px 0 8px}.secondary-link{background:var(--navy);white-space:nowrap}.proposal-form{display:grid;gap:20px}.form-section{border:1px solid var(--line);border-radius:24px;background:#fff;padding:20px}.form-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.form-section textarea{min-height:96px}.calc-help{margin:14px 0 0;color:var(--muted);font-weight:700}.checkbox-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:14px}.checkbox-label{display:flex;align-items:flex-start;gap:10px;margin:0;background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:13px 14px;font-weight:900}.checkbox-label input{width:auto;margin-top:2px;accent-color:var(--orange)}.checkbox-label span{display:block;color:var(--navy);font-size:13px;line-height:1.35}.calc-summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:16px}.calc-summary div{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.calc-summary span{display:block;color:var(--muted);font-size:12px;font-weight:900}.calc-summary strong{display:block;margin-top:6px;font-size:18px}.calc-summary .positive{background:#f0fff6;border-color:#bff3d0}.calc-summary .negative{background:#fff5f1;border-color:#ffd5c4}.proposal-actions button{padding:14px 20px}.proposal-actions .ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}.agreement-block{border:1px solid var(--line);border-radius:22px;background:#fffdf9;padding:16px;margin-top:14px}.wide-check{margin:0 0 12px}.checkbox-grid.single{grid-template-columns:1fr}.agreement-preview{margin-top:14px;background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.agreement-preview strong{display:block;margin-bottom:6px}.agreement-preview p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}.agreement-preview small{display:block;color:#7b8795;margin-top:8px;font-weight:700}.secondary-small{background:#fff!important;color:var(--navy)!important;border:1px solid var(--line)!important}.subheading{margin-top:24px}.compact-two{grid-template-columns:repeat(2,1fr)}.contact-save-box{align-self:end}.contact-save-box small{display:block;margin-top:8px;color:var(--muted);font-size:12px;font-weight:700}.proposal-item-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.status-pill{border-radius:999px;background:#fff1e6;color:#9a4314;border:1px solid #f2b885;padding:5px 9px;font-size:12px;font-weight:900}.status-pill.green{background:#f0fff6;color:#075c2a;border-color:#bff3d0}.status-pill.muted{background:#f8f5ef;color:var(--muted);border-color:var(--line)}.proposal-recipient-box{margin:12px 0;background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.recipient-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.recipient-meta span{background:#fff;border:1px solid var(--line);border-radius:999px;padding:5px 8px;font-size:12px;color:var(--muted);font-weight:800}.warning-line{margin-top:8px;border-radius:12px;background:#fff5f1;border:1px solid #ffd5c4;color:#7c2d20;padding:8px 10px;font-size:12px;font-weight:800}.proposal-mail-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}@media(max-width:1100px){.form-grid{grid-template-columns:repeat(2,1fr)}.grid.three{grid-template-columns:1fr}.calc-summary{grid-template-columns:repeat(2,1fr)}.checkbox-grid{grid-template-columns:1fr}.checklist-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:900px){.grid,.hero,.section-head{grid-template-columns:1fr;display:grid}.info-grid,.form-grid,.calc-summary,.checklist-grid{grid-template-columns:1fr}.detail-page{padding:18px}.admin-quick-nav{position:static}.source-head{display:grid}.source-pill{justify-self:start}}
`;
