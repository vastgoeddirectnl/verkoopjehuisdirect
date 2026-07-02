"use client";

import { useEffect, useMemo, useState } from "react";

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

const SPECIAL_PROPOSAL_TYPES = ["Uitgestelde levering", "Overbruggingsoplossing", "ABC-doorverkoop mogelijk"];

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
  return {
    ...proposal,
    traditional_price_text: formatMoney(calc.traditionalPrice) || proposal.traditional_price_text,
    agent_costs_text: formatMoney(calc.agentInclVat, true) || proposal.agent_costs_text,
    notary_costs_text: formatMoney(calc.notaryCosts, true) || proposal.notary_costs_text,
    renovation_costs_text: formatMoney(calc.renovationCosts, true) || proposal.renovation_costs_text,
    other_costs_text: formatMoney(calc.otherInclVat, true) || proposal.other_costs_text,
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
    conditions_text: "Dit voorstel is vrijblijvend en bedoeld om duidelijkheid te geven over een mogelijke verkoop. Definitieve afspraken worden pas schriftelijk en notarieel vastgelegd.",
    assumptions_text: "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken, beperkte toegang tot documenten of aanvullende kosten kunnen invloed hebben op de definitieve afspraken.",
    included_items: "Heldere communicatie\nGeen makelaarskosten\nGeen openbare bezichtigingen nodig\nVerkoop in huidige staat bespreekbaar\nFlexibele overdrachtsdatum\nNotariële afwikkeling\nVerkoopoplossing op maat\nVrijblijvend voorstel",
    traditional_price_text: "",
    agent_costs_text: "",
    notary_costs_text: "",
    renovation_costs_text: "",
    other_costs_text: "",
    traditional_net_text: "",
    direct_net_text: "",
    short_comparison_text: "Bij een directe verkoop wordt niet alleen gekeken naar de verkoopprijs, maar ook naar snelheid, zekerheid, verkoopkosten, benodigde werkzaamheden, privacy, risico’s en de gewenste overdrachtsdatum. Daardoor kan een direct voorstel lager lijken dan een verwachte verkoopprijs via de reguliere markt, terwijl de netto-opbrengst en zekerheid voor u gunstig kunnen uitpakken.",
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
    if (json.lead) setProposal(defaultProposalForLead(json.lead));
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

  const latestProposal = useMemo(() => {
    return (data?.proposals || [])[0] || null;
  }, [data?.proposals]);

  const netComparison = useMemo(() => {
    return calculateNetComparison(proposal || {});
  }, [proposal]);

  function setProposalField(field, value) {
    setProposal((current) => ({ ...(current || {}), [field]: value }));
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
    const calculatedProposal = buildCalculatedProposalPayload(proposal);
    const result = await post({ action: "createProposal", ...calculatedProposal });
    if (result?.proposal?.id) {
      setNotice("Voorstel is aangemaakt. Controleer de print/PDF-versie voordat u het voorstel mailt.");
      window.open(`/admin/voorstellen/${result.proposal.id}/print`, "_blank", "noopener,noreferrer");
    }
  }

  async function sendProposal(id) {
    const confirmed = window.confirm("Wilt u dit voorstel nu naar de klant mailen?");
    if (!confirmed) return;
    const result = await post({ action: "sendProposalEmail", id });
    if (result?.ok) {
      setNotice(result.skipped
        ? "Mail is overgeslagen omdat Resend niet actief is ingesteld. De klantlink is wel beschikbaar."
        : "Voorstel is naar de klant gemaild en vastgelegd in de mailhistorie.");
    }
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

          <section className="grid">
            <article className="card">
              <h2>Contact & aanvraag</h2>
              <div className="info-grid">
                <Info label="Telefoon" value={lead.telefoon} />
                <Info label="E-mail" value={lead.email} />
                <Info label="Woningtype" value={lead.woningtype} />
                <Info label="Staat" value={lead.staat} />
                <Info label="Reden" value={lead.reden} />
                <Info label="Pagina" value={lead.pagina} />
                <Info label="Bron" value={lead.bron} />
                <Info label="Aangemaakt" value={fmt(lead.created_at)} />
              </div>
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

          <section className="card proposal-card">
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
                  <p className="calc-help">Vul de makelaarskosten en overige verkoopkosten exclusief btw in. Het adminportaal rekent automatisch 21% btw door en berekent de netto-opbrengst.</p>
                  <div className="form-grid">
                    <Field label="Traditionele verkoopprijs"><input inputMode="decimal" placeholder="Bijv. € 240.000" value={proposal.traditional_price_text} onChange={(e) => setProposalField("traditional_price_text", e.target.value)} /></Field>
                    <Field label="Makelaarskosten excl. btw"><input inputMode="decimal" placeholder="Bijv. € 3.600" value={proposal.agent_costs_text} onChange={(e) => setProposalField("agent_costs_text", e.target.value)} /></Field>
                    <Field label="Notariskosten levering"><input inputMode="decimal" placeholder="Bijv. € 1.600" value={proposal.notary_costs_text} onChange={(e) => setProposalField("notary_costs_text", e.target.value)} /></Field>
                    <Field label="Herstel-/renovatiekosten"><input inputMode="decimal" placeholder="Bijv. € 45.000" value={proposal.renovation_costs_text} onChange={(e) => setProposalField("renovation_costs_text", e.target.value)} /></Field>
                    <Field label="Overige verkoopkosten excl. btw"><input inputMode="decimal" placeholder="Bijv. € 950" value={proposal.other_costs_text} onChange={(e) => setProposalField("other_costs_text", e.target.value)} /></Field>
                    <Field label="Netto Vastgoed Direct"><input inputMode="decimal" placeholder="Automatisch uit voorgesteld bedrag" value={proposal.direct_net_text} onChange={(e) => setProposalField("direct_net_text", e.target.value)} /></Field>
                  </div>

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

                <div className="form-section">
                  <h3>6. Teksten en voorwaarden</h3>
                  <Field label="Uitgangspunten van dit voorstel">
                    <textarea value={proposal.assumptions_text} onChange={(e) => setProposalField("assumptions_text", e.target.value)} />
                  </Field>
                  <Field label="Wat is inbegrepen — één regel per punt">
                    <textarea value={proposal.included_items} onChange={(e) => setProposalField("included_items", e.target.value)} />
                  </Field>
                  <Field label="Voorwaarden">
                    <textarea value={proposal.conditions_text} onChange={(e) => setProposalField("conditions_text", e.target.value)} />
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
                  <button type="button" className="ghost" onClick={() => setProposal(defaultProposalForLead(lead))}>Velden herstellen</button>
                </div>
              </div>
            ) : null}
          </section>

          <section className="grid three">
            <article className="card"><h2>Taken</h2>{(data.tasks || []).map((item) => <div className="item" key={item.id}><strong>{item.title}</strong><span>{item.status} · {item.due_date || "geen datum"}</span><select value={item.status || "Open"} onChange={(e) => post({ action: "updateTask", id: item.id, status: e.target.value })}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>)}</article>
            <article className="card"><h2>Voorstellen</h2>{(data.proposals || []).map((item) => <div className="item" key={item.id}><strong>{item.amount_text || "Voorstel"}</strong><span>{item.status} · {fmt(item.created_at)}</span><a href={`/admin/voorstellen/${item.id}/print`} target="_blank">Interne print/PDF</a>{item.public_token ? <a href={`/voorstel/${item.public_token}?admin_preview=1`} target="_blank">Klantversie bekijken</a> : null}<button className="small" onClick={() => sendProposal(item.id)}>Mail voorstel naar klant</button>{item.emailed_at ? <small>Laatst gemaild: {fmt(item.emailed_at)}</small> : null}{proposalViewedAfterEmail(item) ? <small>Bekeken door klant: {fmt(item.public_viewed_at)}</small> : null}</div>)}</article>
            <article className="card"><h2>Mailhistorie</h2>{(data.mailLogs || []).map((item) => <div className="item" key={item.id}><strong>{item.type}</strong><span>{item.status} · {item.recipient}</span><small>{fmt(item.created_at)}</small></div>)}</article>
          </section>
        </>
      )}
    </main>
  );
}

const styles = `
:root{--navy:#071f3a;--muted:#617184;--line:#e8e3db;--bg:#f5f2ec;--card:#fffdf9;--orange:#D96A1C;--green:#3E8F5E;--shadow:0 22px 70px rgba(7,31,58,.12)}body{margin:0;background:radial-gradient(circle at top right,#FFF1E6,transparent 34%),var(--bg);color:var(--navy);font-family:Inter,Arial,Helvetica,sans-serif}.detail-page{max-width:1280px;margin:0 auto;padding:28px}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}header a{color:var(--navy);font-weight:900;text-decoration:none}header img{width:220px;background:#fff;border-radius:18px;padding:10px}.card{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:24px;box-shadow:var(--shadow)}.hero{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:18px}.hero span,.section-head span{color:#B85216;background:#FFF1E6;border:1px solid #F2B885;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900;text-transform:uppercase}.hero h1{font-size:42px;letter-spacing:-.04em;margin:12px 0 6px}.hero p,.section-head p{color:var(--muted);font-size:18px}.actions,.proposal-actions{display:flex;gap:10px;flex-wrap:wrap}.actions a,.actions button,.card button,.item a,.secondary-link{border:0;background:var(--orange);color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-weight:900;cursor:pointer;display:inline-block;margin-right:8px;margin-top:8px}.actions a:first-child{background:var(--navy)}.grid{display:grid;grid-template-columns:1.3fr .7fr;gap:18px;margin-bottom:18px}.grid.three{grid-template-columns:repeat(3,1fr)}h2{margin:0 0 18px;font-size:24px;letter-spacing:-.03em}h3{margin:0 0 16px;font-size:20px}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px}.info{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.info span,.item span,.item small,label span{display:block;color:var(--muted);font-size:13px}.info strong{display:block;margin-top:6px;word-break:break-word}label{display:grid;gap:8px;font-weight:900;margin-top:12px}input,select,textarea{width:100%;border:1px solid var(--line);border-radius:16px;padding:13px 14px;font:inherit;background:#fff}textarea{min-height:110px;resize:vertical}.item{border-bottom:1px solid var(--line);padding:12px 0}.item:last-child{border-bottom:0}.item strong{display:block}.item a{margin-top:8px;background:var(--navy)}.item button.small{margin-top:8px;margin-left:8px;padding:9px 12px;font-size:13px}.error,.notice-top{border-radius:16px;padding:12px 14px;margin-bottom:16px}.error{background:#F8EEE9;color:#7C2D20;border:1px solid #E8C7BC}.notice-top{background:#f0fff6;color:#075c2a;border:1px solid #bff3d0}.proposal-card{margin:18px 0}.section-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.section-head h2{font-size:34px;margin:12px 0 8px}.secondary-link{background:var(--navy);white-space:nowrap}.proposal-form{display:grid;gap:20px}.form-section{border:1px solid var(--line);border-radius:24px;background:#fff;padding:20px}.form-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.form-section textarea{min-height:96px}.calc-help{margin:14px 0 0;color:var(--muted);font-weight:700}.checkbox-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:14px}.checkbox-label{display:flex;align-items:flex-start;gap:10px;margin:0;background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:13px 14px;font-weight:900}.checkbox-label input{width:auto;margin-top:2px;accent-color:var(--orange)}.checkbox-label span{display:block;color:var(--navy);font-size:13px;line-height:1.35}.calc-summary{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:16px}.calc-summary div{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}.calc-summary span{display:block;color:var(--muted);font-size:12px;font-weight:900}.calc-summary strong{display:block;margin-top:6px;font-size:18px}.calc-summary .positive{background:#f0fff6;border-color:#bff3d0}.calc-summary .negative{background:#fff5f1;border-color:#ffd5c4}.proposal-actions button{padding:14px 20px}.proposal-actions .ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}@media(max-width:1100px){.form-grid{grid-template-columns:repeat(2,1fr)}.grid.three{grid-template-columns:1fr}.calc-summary{grid-template-columns:repeat(2,1fr)}.checkbox-grid{grid-template-columns:1fr}}@media(max-width:900px){.grid,.hero,.section-head{grid-template-columns:1fr;display:grid}.info-grid,.form-grid,.calc-summary{grid-template-columns:1fr}.detail-page{padding:18px}}
`;
