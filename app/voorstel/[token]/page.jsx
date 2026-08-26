import { notFound } from "next/navigation";
import { queryOne } from "../../lib/neonDb";
import { isUuid } from "../../lib/requestSecurity";
import { daysUntilAmsterdam, formatDateNL, validityStatus } from "../../lib/date";
import PrintButton from "./PrintButton";
import ProposalActions from "./ProposalActions";
import ProposalViewTracker from "./ProposalViewTracker";


export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = "force-dynamic";

const DEFAULT_NONBINDING_TEXT = "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid. Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.";


const NO_BUYER_CONDITIONS_NOTICE_TITLE = "Meer zekerheid bij akkoord";
const NO_BUYER_CONDITIONS_NOTICE_TEXT = "Bij overeenstemming wordt de koopovereenkomst in beginsel opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen. Daarmee is het traject minder afhankelijk van financiering, keuringen of verkoop van een andere woning.";
const INCLUDED_ASSURANCE_ITEM = "Meer zekerheid na akkoord";

function ensureIncludedAssurance(items) {
  const list = Array.isArray(items) ? items : [];
  const alreadyIncluded = list.some((item) => /meer\s+zekerheid\s+na\s+akkoord|zonder\s+ontbindende\s+voorbehouden/i.test(String(item || "")));
  return alreadyIncluded ? list : [...list, INCLUDED_ASSURANCE_ITEM];
}

function formatDate(value) {
  return formatDateNL(value, { fallback: "-" });
}

function daysUntil(value) {
  return daysUntilAmsterdam(value);
}

function validityStatusText(daysOrValue) {
  const days = typeof daysOrValue === "number" || daysOrValue === null
    ? daysOrValue
    : daysUntil(daysOrValue);
  if (days === null) return null;
  if (days < 0) return "Dit voorstel is verlopen";
  if (days === 0) return "Loopt vandaag af";
  return `Nog ${days} dag${days === 1 ? "" : "en"} geldig`;
}

function validityStatusClass(days) {
  if (days === null) return "";
  if (days < 0) return " is-expired";
  if (days <= 3) return " is-urgent";
  return "";
}

function amount(value, fallback = "In overleg") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (raw.includes("€")) return raw;
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return raw;
  return `€ ${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(Number(digits))}`;
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

function costInclVatValue(value, fallback = "-") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  const parsed = parseMoney(raw);
  if (!parsed) return raw;
  return formatMoney(parsed * 1.21, true) || raw;
}

function value(value, fallback = "-") {
  return String(value || "").trim() || fallback;
}

function areaValue(value, fallback = "Nog te controleren") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (/m²|m2|㎡/i.test(raw)) return raw.replace(/m2/i, "m²");
  if (/^\d+(?:[,.]\d+)?$/.test(raw)) return `${raw} m²`;
  return raw;
}

function monthlyRentValue(value, fallback = "Niet ingevuld") {
  const raw = String(value || "").replace(/\s+/g, " ").trim();
  if (!raw) return fallback;

  const periodPattern = /per\s*maand|p\.?\s*\/?\s*m\.?|maandelijks/i;
  const amountPart = raw.replace(periodPattern, "").trim();
  const hasOnlyAmountAndPeriod = /^[€\s\d.,-]+$/.test(amountPart);

  if (hasOnlyAmountAndPeriod) {
    const formatted = amount(amountPart, "");
    if (formatted) return `${formatted} per maand`;
  }

  return raw;
}

function cleanUseRentalNotes(value) {
  let text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";

  text = text
    .replace(/Uitgangspunt van dit voorstel is dat het object bij juridische levering[^.]*wordt geleverd, tenzij schriftelijk anders overeengekomen\.\s*/gi, "")
    .replace(/Gevolg voor het voorstel:\s*Dit voorstel is gebaseerd op de hierboven genoemde wijze van levering\.\s*Indien het object niet overeenkomstig deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan koper het voorstel herbeoordelen, aanpassen of laten vervallen\.\s*/gi, "")
    .replace(/Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming(?:, vergunningen, brandveiligheid en eventuele splitsingsmogelijkheden| en eventuele vergunningen)? vóór definitieve vastlegging gecontroleerd\.\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

function withNoBuyerConditionsText(value) {
  const raw = String(value || DEFAULT_NONBINDING_TEXT).replace(/\s+/g, " ").trim();
  const required = "Indien partijen overeenstemming bereiken, wordt de koopovereenkomst opgesteld zonder ontbindende voorbehouden aan koperszijde, zoals financieringsvoorbehoud, bouwkundig voorbehoud of verkoopvoorbehoud, tenzij koper en verkoper schriftelijk anders overeenkomen.";
  if (/zonder\s+ontbindende\s+voorbehouden\s+aan\s+koperszijde/i.test(raw)) return raw;
  return `${raw} ${required}`.trim();
}

function lines(value, fallback = []) {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatAddress(proposal) {
  if (proposal.property_address) return String(proposal.property_address).trim().toUpperCase();
  return [proposal.property_postcode, proposal.property_house_number].filter(Boolean).join(" ").toUpperCase() || "-";
}

function salutationName(name) {
  const raw = String(name || "").replace(/\s+/g, " ").trim();
  return raw || "heer/mevrouw";
}

const SPECIAL_PROPOSAL_TYPES = ["Uitgestelde levering", "Overbruggingsoplossing", "ABC-doorverkoop mogelijk"];

function isSpecialProposalType(type) {
  return SPECIAL_PROPOSAL_TYPES.includes(String(type || "").trim());
}

function constructieChecks(proposal) {
  const checks = [];
  if (proposal.allow_kadaster_registration) checks.push("Koopovereenkomst mag worden ingeschreven bij het Kadaster");
  if (proposal.allow_abc_resale) checks.push("ABC-doorverkoop mogelijk");
  if (proposal.seller_cooperates_resale) checks.push("Verkoper werkt mee aan taxatie, bezichtiging en voorbereiding doorverkoop");
  if (proposal.delivery_free_of_claims) checks.push("Levering vrij van huur, gebruik, beslagen en hypotheken");
  if (proposal.property_same_state) checks.push("Woning blijft tot levering in huidige staat");
  return checks;
}

function percent(value) {
  const raw = String(value || "").trim();
  if (!raw) return "-";
  return raw.includes("%") ? raw : `${raw}%`;
}

function months(value, fallback = "-") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  return `${raw} maanden`;
}

function isObjectProposal(proposal) {
  const text = [
    proposal?.object_usage_type,
    proposal?.property_type,
    proposal?.current_situation,
  ].filter(Boolean).join(" ").toLowerCase();

  return /(woon\s*-?\s*winkelpand|gemengd|bedrijfspand|bedrijfsruimte|winkelruimte|winkelpand|kantoor|horeca|beleggingspand|object)/i.test(text);
}

function objectTerms(proposal) {
  const objectProposal = isObjectProposal(proposal);
  return {
    lower: objectProposal ? "object" : "woning",
    lowerArticle: objectProposal ? "het object" : "de woning",
    possessive: objectProposal ? "uw object" : "uw woning",
    cap: objectProposal ? "Object" : "Woning",
    gegevens: objectProposal ? "Objectgegevens" : "Woninggegevens",
    uitgangspunt: objectProposal ? "Uitgangspunt object" : "Uitgangspunt woning",
    addressLabel: objectProposal ? "Adres / object" : "Adres / woning",
    typeLabel: objectProposal ? "Type object" : "Type woning",
    areaLabel: objectProposal ? "Gebruiks-/woonoppervlakte" : "Woonoppervlakte",
    verkoopText: objectProposal ? "Bij verkoop van een object" : "Bij een woningverkoop",
  };
}

function objectAwareText(text, proposal) {
  const raw = String(text || "");
  if (!isObjectProposal(proposal)) return raw;
  return raw
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

function canRespondToProposal(proposal) {
  const status = String(proposal?.status || "").trim().toLowerCase();
  const activeStatus = ["verzonden", "bekeken"].includes(status);
  const expired = daysUntil(proposal?.validity_date) !== null && daysUntil(proposal?.validity_date) < 0;
  return activeStatus && !expired;
}

export default async function PublicProposalPage({ params, searchParams }) {
  const { token } = await params;
  if (!isUuid(token)) notFound();

  const query = searchParams ? await searchParams : {};
  const isAdminPreview = query?.admin_preview === "1" || query?.preview === "admin";
  const proposal = await queryOne("select * from proposals where public_token = $1::uuid", [token]);

  if (!proposal) notFound();

  const address = formatAddress(proposal);
  const offerAmount = amount(proposal.amount_text);
  const validity = formatDate(proposal.validity_date);
  const validityDays = daysUntil(proposal.validity_date);
  const transfer = value(proposal.transfer_date_text, "In overleg");
  const deposit = amount(proposal.deposit_text, "In overleg bespreekbaar");
  const terms = objectTerms(proposal);

  const assumptions = objectAwareText(value(
    proposal.assumptions_text,
    "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Voor definitieve vastlegging controleren wij de juridische, bouwkundige en notariële uitgangspunten."
  ), proposal);

  const conditions = objectAwareText(value(
    proposal.conditions_text,
    "Het voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en notariële vastlegging."
  ), proposal);

  const included = ensureIncludedAssurance(lines(proposal.included_items, [
    "Een helder en concreet verkoopvoorstel",
    "Geen makelaarskosten voor een traditioneel verkooptraject",
    "Geen openbare bezichtigingsrondes nodig",
    "Afstemming over een passende overdrachtsdatum",
    "Notariële afwikkeling van de verkoop",
    "Eén vast aanspreekpunt tijdens het proces",
  ]));

  const reservations = lines(proposal.reservations_text, [
    "Controle van eigendomssituatie en kadastrale gegevens",
    "Controle van beschikbare woninginformatie en eventuele bijzonderheden",
    "Controle van eventuele huur-, gebruiks- of beslag-/beperkingssituaties",
    "Akkoord over oplevering, roerende zaken en overdrachtsdatum",
    "Definitieve vastlegging via de notaris",
  ]).map((item) => objectAwareText(item, proposal));

  const nextSteps = lines(proposal.next_steps_text, [
    "U bekijkt het voorstel rustig en noteert eventuele vragen.",
    "Wij bespreken het voorstel telefonisch of per e-mail met u door.",
    "Als het voorstel passend is, leggen wij de afspraken helder vast.",
    "De juridische en notariële afwikkeling wordt opgestart.",
    "De overdracht vindt plaats op de afgesproken datum via de notaris.",
    "Bij akkoord werken wij de afspraken uit in een koopovereenkomst. De definitieve overdracht en betaling verlopen via de notaris.",
  ]).map((item) => objectAwareText(item, proposal));

  const shortComparison = lines(proposal.short_comparison_text, [
    "Geen verkoopklaar maken van de woning noodzakelijk voordat wij kunnen meedenken.",
    "Geen open huis of meerdere bezichtigingsmomenten nodig.",
    "Meer duidelijkheid over voorwaarden, planning en afwikkeling.",
    "Een verkooproute die vooral gericht is op rust, snelheid en overzicht.",
  ]).map((item) => objectAwareText(item, proposal));

  const proposalType = value(proposal.proposal_type, proposal.proposal_variant || "Standaard aankoop");
  const specialProposal = isSpecialProposalType(proposalType);
  const checks = constructieChecks(proposal).map((item) => objectAwareText(item, proposal));
  const hasDeliveryData = Boolean(
    proposal.delivery_term_text ||
    proposal.desired_transfer_date ||
    proposal.buyer_text ||
    checks.length
  );
  const hasBridgeData = Boolean(
    proposal.bridge_current_home ||
    proposal.bridge_old_home ||
    proposal.bridge_goal_text ||
    proposal.bridge_explanation_text
  );
  const showDeliveryConstructie = specialProposal || hasDeliveryData;
  const showBridge = proposalType === "Overbruggingsoplossing" || hasBridgeData;
  const showSellerWork = Boolean(proposal.seller_work_enabled);
  const showResalePayment = Boolean(proposal.resale_payment_enabled);
  const showUseRental = Boolean(proposal.use_rental_enabled);
  const nonbindingText = withNoBuyerConditionsText(proposal.nonbinding_text);
  const actionActive = canRespondToProposal(proposal);

  return (
    <main className="proposal-page">
      <style>{styles}</style>
      <ProposalViewTracker token={token} enabled={!isAdminPreview && actionActive} />

      <header className="topbar">
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
        <div className="top-actions">
          <span>Persoonlijk verkoopvoorstel</span>
          <PrintButton token={token} />
        </div>
      </header>

      <section className="cover">
        <div className="cover-copy">
          <span className="label">Vrijblijvend & persoonlijk</span>
          <h1>Verkoopvoorstel voor {terms.possessive}</h1>
          <p>
            Beste {salutationName(proposal.lead_naam)}, op basis van de beschikbare informatie hebben wij
            een concreet en overzichtelijk voorstel uitgewerkt. Het doel: duidelijkheid over bedrag,
            voorwaarden en vervolgstappen zonder onnodige verkoopdruk.
          </p>
        </div>

        <aside className="offer-panel">
          <span>Voorgesteld bedrag</span>
          <strong>{offerAmount}</strong>
          <small>{address}</small>
          <div className="micro-grid">
            <div>
              <em>Geldig tot</em>
              <b>{validity}</b>
              {validityDays !== null ? <i className={`validity-pill${validityStatusClass(validityDays)}`}>{validityStatusText(validityDays)}</i> : null}
            </div>
            <div>
              <em>Oplevering</em>
              <b>{transfer}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="executive-summary">
        <div>
          <span className="section-kicker">Samenvatting</span>
          <h2>De kern van dit voorstel</h2>
          <p>
            Dit voorstel geeft u direct inzicht in de mogelijke verkooproute via Vastgoed Direct Nederland.
            U ziet niet alleen het voorgestelde bedrag, maar ook welke kosten, inspanningen en onzekerheden
            u hiermee mogelijk voorkomt ten opzichte van een traditioneel verkooptraject.
          </p>
        </div>
        <div className="summary-list">
          <div><strong>{offerAmount}</strong><span>voorgesteld bedrag</span></div>
          <div><strong>{transfer}</strong><span>mogelijke overdracht</span></div>
          <div><strong>{deposit}</strong><span>aanbetaling / voorschot</span></div>
        </div>
      </section>

      <ProposalActions token={token} amountText={offerAmount} isActive={actionActive} previewMode={isAdminPreview} validityText={validityStatusText(validityDays)} />

      {showDeliveryConstructie ? (
        <section className="card special-card">
          <span className="section-kicker">Levering & constructie</span>
          <h2>{proposalType}</h2>
          <div className="construct-grid">
            <div><strong>Passeertermijn</strong><span>{value(proposal.delivery_term_text, transfer)}</span></div>
            <div><strong>Gewenste leverdatum</strong><span>{formatDate(proposal.desired_transfer_date)}</span></div>
            <div><strong>Koper</strong><span>{value(proposal.buyer_text, "Vastgoed Direct Nederland of nader te noemen meester")}</span></div>
          </div>
          {checks.length ? (
            <div className="mini-checks">
              {checks.map((item) => <div key={item}><span>✓</span>{item}</div>)}
            </div>
          ) : null}
        </section>
      ) : null}

      {showBridge ? (
        <section className="card special-card">
          <span className="section-kicker">Overbruggingssituatie</span>
          <h2>Verkooproute met overbrugging</h2>
          <div className="construct-grid">
            <div><strong>Huidige woning klant</strong><span>{value(proposal.bridge_current_home, "In overleg / niet ingevuld")}</span></div>
            <div><strong>Oude woning / te verkopen woning</strong><span>{value(proposal.bridge_old_home, "In overleg / niet ingevuld")}</span></div>
            <div><strong>Doel constructie</strong><span>{value(proposal.bridge_goal_text, "Duidelijkheid over verkoop, planning en aflossing van de overbruggingssituatie.")}</span></div>
          </div>
          {proposal.bridge_explanation_text ? <p className="bridge-copy">{proposal.bridge_explanation_text}</p> : null}
        </section>
      ) : null}

      {showUseRental ? (
        <section className="card special-card">
          <span className="section-kicker">Gebruik, verhuur en oplevering</span>
          <h2>Uitgangspunt gebruikssituatie</h2>
          <div className="construct-grid">
            <div><strong>Objecttype</strong><span>{value(proposal.object_usage_type, "Nog te controleren")}</span></div>
            <div><strong>Huidig gebruik</strong><span>{value(proposal.current_occupancy_status, "Nog te controleren")}</span></div>
            <div><strong>Wordt geleverd</strong><span>{value(proposal.delivery_occupancy_status, "Vrij van huur en gebruik")}</span></div>
            <div><strong>Huurovereenkomst aanwezig</strong><span>{value(proposal.lease_agreement_available, "Onbekend")}</span></div>
            <div><strong>Einddatum huur</strong><span>{formatDate(proposal.lease_end_date)}</span></div>
            <div><strong>Uiterste ontruiming</strong><span>{formatDate(proposal.tenant_vacate_deadline)}</span></div>
            <div><strong>Actuele huur</strong><span>{monthlyRentValue(proposal.current_rent_text)}</span></div>
            <div><strong>Huurachterstand/geschil</strong><span>{value(proposal.rent_arrears_or_dispute, "Onbekend")}</span></div>
          </div>
          <p className="bridge-copy">Uitgangspunt van dit voorstel is dat het object bij juridische levering {String(value(proposal.delivery_occupancy_status, "vrij van huur en gebruik")).toLowerCase()} wordt geleverd, tenzij schriftelijk anders overeengekomen.</p>
          <p className="bridge-copy"><strong>Gevolg voor het voorstel:</strong> Dit voorstel is gebaseerd op de hierboven genoemde wijze van levering. Indien het object niet overeenkomstig deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan koper het voorstel herbeoordelen, aanpassen of laten vervallen.</p>
          {(proposal.commercial_area_text || proposal.residential_area_text || proposal.separate_entrance_status || proposal.independent_residence_status) ? (
            <div className="construct-grid compact-grid">
              <div><strong>Winkel-/bedrijfsruimte</strong><span>{areaValue(proposal.commercial_area_text, "Nog te controleren")}</span></div>
              <div><strong>Woonruimte</strong><span>{areaValue(proposal.residential_area_text, "Nog te controleren")}</span></div>
              <div><strong>Aparte entree</strong><span>{value(proposal.separate_entrance_status, "Onbekend")}</span></div>
              <div><strong>Zelfstandige woonruimte</strong><span>{value(proposal.independent_residence_status, "Onbekend")}</span></div>
            </div>
          ) : null}
          <p className="bridge-copy">Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming, vergunningen, brandveiligheid en eventuele splitsingsmogelijkheden vóór definitieve vastlegging gecontroleerd.</p>
          {cleanUseRentalNotes(proposal.use_rental_notes_text) ? <p className="bridge-copy">{cleanUseRentalNotes(proposal.use_rental_notes_text)}</p> : null}
        </section>
      ) : null}

      <section className="proposal-assurance">
        <article>
          <strong>Rustig beoordelen</strong>
          <span>U hoeft niet direct te beslissen. Het voorstel is bedoeld om helderheid te geven.</span>
        </article>
        <article>
          <strong>Vragen bespreken</strong>
          <span>Wij lichten bedragen, uitgangspunten en planning graag persoonlijk toe.</span>
        </article>
        <article>
          <strong>Vrijblijvend</strong>
          <span>Pas bij akkoord worden afspraken definitief vastgelegd via de notaris.</span>
        </article>
      </section>

      <section className="card">
        <span className="section-kicker">{terms.gegevens}</span>
        <h2>{terms.uitgangspunt}</h2>
        <div className="facts">
          <div><strong>{terms.addressLabel}</strong><span>{address}</span></div>
          <div><strong>{terms.typeLabel}</strong><span>{value(proposal.property_type, "Nog te controleren")}</span></div>
          <div><strong>{terms.areaLabel}</strong><span>{areaValue(proposal.living_area_text)}</span></div>
          <div><strong>Perceel</strong><span>{areaValue(proposal.plot_area_text)}</span></div>
          <div><strong>Bouwjaar</strong><span>{value(proposal.build_year_text, "Nog te controleren")}</span></div>
          <div><strong>Huidige situatie</strong><span>{value(proposal.current_situation, "Op basis van uw aanvraag te beoordelen")}</span></div>
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Waarom deze route</span>
        <h2>Wat dit voorstel vooral oplevert</h2>
        <div className="benefits">
          <article>
            <strong>Duidelijkheid vooraf</strong>
            <p>U weet waar u aan toe bent voordat u vervolgstappen zet.</p>
          </article>
          <article>
            <strong>Minder verkoopgedoe</strong>
            <p>Geen standaard verkooptraject met veel losse bezichtigingen of open huis.</p>
          </article>
          <article>
            <strong>Rustige afwikkeling</strong>
            <p>Afspraken worden helder vastgelegd en de overdracht loopt via de notaris.</p>
          </article>
          <article>
            <strong>Passend bij de situatie</strong>
            <p>Ook geschikt als snelheid, privacy, onderhoud of een bijzondere situatie meespeelt.</p>
          </article>
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Financieel overzicht</span>
        <h2>Netto-opbrengst in perspectief</h2>
        <p className="intro">
          {terms.verkoopText} gaat het niet alleen om de verkoopprijs, maar ook om kosten, voorbereiding,
          doorlooptijd en zekerheid. Onderstaand overzicht helpt om het voorstel naast een regulier traject te leggen.
        </p>
        <p className="bridge-copy"><strong>Let op:</strong> de traditionele verkoopprijs is een indicatieve vergelijkingswaarde. Bij verhuurde, leeg te leveren of gemengde objecten kan deze waarde mede zijn gebaseerd op huurwaarde, leegstand, verhuurrisico, verkoopbaarheid en kosten.</p>
        {showUseRental ? (
          <p className="bridge-copy"><strong>Uitgangspunt vergelijking:</strong> Deze financiële vergelijking is gebaseerd op de hierboven genoemde wijze van levering. Wanneer uitgangspunt is dat het object vrij van huur en gebruik wordt geleverd, is de vergelijking daarop gebaseerd. Als het object toch geheel of gedeeltelijk verhuurd of in gebruik geleverd wordt, kan dit invloed hebben op waarde, voorwaarden en haalbaarheid van het voorstel.</p>
        ) : null}
        <div className="assurance-notice">
          <strong>{NO_BUYER_CONDITIONS_NOTICE_TITLE}</strong>
          <p>{NO_BUYER_CONDITIONS_NOTICE_TEXT}</p>
        </div>
        <div className="decision-inline">
          <strong>Wilt u verder met dit voorstel?</strong>
          <span>Geef eenvoudig aan dat u akkoord bent met het voorstel of dat u het eerst wilt bespreken. Een klik is nog geen getekende koopovereenkomst.</span>
          <a href="#voorstel-actie">Akkoord geven of bespreken</a>
        </div>
        <div className="comparison comparison-desktop" aria-label="Vergelijking netto-opbrengst">
          <div className="head">Onderdeel</div>
          <div className="head">Traditionele verkoop</div>
          <div className="head orange">Vastgoed Direct Nederland</div>

          <div>Bod / verkoopprijs</div>
          <div>{amount(proposal.traditional_price_text, "Nog onbekend")}</div>
          <div>{offerAmount}</div>

          <div>Makelaarskosten incl. 21% btw</div>
          <div>{costInclVatValue(proposal.agent_costs_text, "Gebruikelijk van toepassing")}</div>
          <div>€ 0</div>

          <div>Afwikkelingskosten verkoper</div>
          <div>{value(proposal.notary_costs_text, "Afhankelijk van situatie")}</div>
          <div>Door VDN overgenomen indien afgesproken</div>

          <div>Herstel-/renovatiekosten vooraf</div>
          <div>{value(proposal.renovation_costs_text, "Afhankelijk van verkoopstrategie")}</div>
          <div>Niet noodzakelijk vooraf</div>

          <div>Overige verkoopkosten incl. 21% btw</div>
          <div>{costInclVatValue(proposal.other_costs_text, "Afhankelijk van situatie")}</div>
          <div>In overleg en vooraf helder</div>

          <div className="total">Verwachte netto-opbrengst</div>
          <div className="total">{amount(proposal.traditional_net_text, "Nog te bepalen")}</div>
          <div className="total accent">{amount(proposal.direct_net_text || proposal.amount_text)}</div>
        </div>

        <div className="comparison-mobile" aria-label="Vergelijking netto-opbrengst mobiel">
          {[
            ["Bod / verkoopprijs", amount(proposal.traditional_price_text, "Nog onbekend"), offerAmount],
            ["Makelaarskosten incl. 21% btw", costInclVatValue(proposal.agent_costs_text, "Gebruikelijk van toepassing"), "€ 0"],
            ["Afwikkelingskosten verkoper", value(proposal.notary_costs_text, "Afhankelijk van situatie"), "Door VDN overgenomen indien afgesproken"],
            ["Herstel-/renovatiekosten vooraf", value(proposal.renovation_costs_text, "Afhankelijk van verkoopstrategie"), "Niet noodzakelijk vooraf"],
            ["Overige verkoopkosten incl. 21% btw", costInclVatValue(proposal.other_costs_text, "Afhankelijk van situatie"), "In overleg en vooraf helder"],
            ["Verwachte netto-opbrengst", amount(proposal.traditional_net_text, "Nog te bepalen"), amount(proposal.direct_net_text || proposal.amount_text), true],
          ].map(([label, traditional, direct, isTotal]) => (
            <article className={isTotal ? "mobile-compare-card total" : "mobile-compare-card"} key={label}>
              <h3>{label}</h3>
              <div className="mobile-compare-values">
                <div>
                  <span>Traditionele verkoop</span>
                  <strong>{traditional}</strong>
                </div>
                <div className="direct">
                  <span>Vastgoed Direct Nederland</span>
                  <strong>{direct}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="bridge-copy">
          Makelaarskosten en overige verkoopkosten worden in deze vergelijking inclusief 21% btw getoond, omdat deze kosten ook zo in de netto-opbrengst zijn verwerkt. Onder afwikkelingskosten verkoper vallen alleen vooraf afgesproken kosten aan verkoperszijde, zoals volmachtskosten, royement/doorhaling van hypotheekinschrijvingen of bijzondere afwikkelingskosten. Kosten die normaal voor koper zijn bij kosten koper worden niet als verkoperskosten meegenomen.
        </p>
      </section>

      <section className="card">
        <span className="section-kicker">Inbegrepen</span>
        <h2>Wat u van ons mag verwachten</h2>
        <div className="checks">
          {included.map((item) => <div key={item}><span>✓</span>{item}</div>)}
        </div>
      </section>

      {showSellerWork ? (
        <section className="card special-card agreement-card">
          <span className="section-kicker">Werkzaamheden door verkoper</span>
          <h2>Werkzaamheden en koopprijsverhoging</h2>
          <div className="construct-grid">
            <div><strong>Basiskoopprijs</strong><span>{amount(proposal.seller_work_base_price_text)}</span></div>
            <div><strong>Bedrag werkzaamheden</strong><span>{amount(proposal.seller_work_amount_text)}</span></div>
            <div><strong>Totale koopprijs na uitvoering</strong><span>{amount(proposal.seller_work_total_price_text)}</span></div>
            <div><strong>Uiterste uitvoeringsdatum</strong><span>{formatDate(proposal.seller_work_deadline)}</span></div>
          </div>
          {proposal.seller_work_description ? <p className="bridge-copy"><strong>Omschrijving werkzaamheden:</strong><br />{proposal.seller_work_description}</p> : null}
          <p className="bridge-copy">
            Verkoper zal vóór de juridische levering de in dit voorstel omschreven herstelwerkzaamheden uitvoeren.
            Wanneer deze werkzaamheden volledig en deugdelijk zijn uitgevoerd en door koper zijn goedgekeurd, wordt de basiskoopprijs verhoogd met {amount(proposal.seller_work_amount_text)}.
            De totale koopprijs bedraagt in dat geval {amount(proposal.seller_work_total_price_text)} kosten koper.
          </p>
          <p className="bridge-copy">
            Wanneer de werkzaamheden niet, niet volledig of niet deugdelijk zijn uitgevoerd, kan de aanvullende koopprijs worden verminderd met de redelijkerwijs benodigde kosten om de werkzaamheden alsnog te voltooien of te herstellen.
            Het bedrag voor de werkzaamheden wordt niet als losse betaling vóór levering weergegeven, maar als mogelijke verhoging van de koopsom bij de notariële levering.
          </p>
          {proposal.seller_work_conditions_text ? <p className="bridge-copy">{proposal.seller_work_conditions_text}</p> : null}
        </section>
      ) : null}

      {showResalePayment ? (
        <section className="card special-card agreement-card">
          <span className="section-kicker">Aanvullende betaling bij doorverkoop</span>
          <h2>Regeling bij latere doorverkoop</h2>
          <div className="construct-grid">
            <div><strong>Drempelbedrag</strong><span>{amount(proposal.resale_threshold_text)}</span></div>
            <div><strong>Percentage meeropbrengst</strong><span>{percent(proposal.resale_percentage_text)}</span></div>
            <div><strong>Periode</strong><span>{months(proposal.resale_period_months)}</span></div>
            <div><strong>Courtage aftrekken</strong><span>{proposal.resale_deduct_courtage ? "Ja, alleen latere doorverkoopcourtage" : "Nee"}</span></div>
            {proposal.resale_cap_text ? <div><strong>Maximumbedrag</strong><span>{amount(proposal.resale_cap_text)}</span></div> : null}
          </div>
          <p className="bridge-copy">
            Indien {terms.lowerArticle} binnen {months(proposal.resale_period_months, "de afgesproken periode")} wordt doorverkocht tegen een netto doorverkoopprijs van meer dan {amount(proposal.resale_threshold_text)}, ontvangt verkoper een aanvullende betaling ter grootte van {percent(proposal.resale_percentage_text)} van het gedeelte van de netto doorverkoopprijs boven {amount(proposal.resale_threshold_text)}.
          </p>
          <p className="bridge-copy">
            Onder netto doorverkoopprijs wordt verstaan de overeengekomen verkoopprijs aan de opvolgende koper, verminderd met de door koper daadwerkelijk verschuldigde makelaarscourtage voor de doorverkoop, inclusief btw. Andere aankoop-, verbouwings-, financierings-, notaris- of verkoopkosten worden niet in mindering gebracht. De courtage van de huidige verkoopmakelaar van verkoper wordt niet afgetrokken.
          </p>
          <p className="bridge-copy">
            Deze regeling geldt ook bij een ABC-transactie, AB-BC-transactie, levering aan een nader te noemen meester of rechtstreekse levering aan een eindkoper.
          </p>
          {proposal.resale_explanation_text ? <p className="bridge-copy">{proposal.resale_explanation_text}</p> : null}
        </section>
      ) : null}

      <section className="two-columns">
        <section className="card">
          <span className="section-kicker">Uitgangspunten</span>
          <h2>Waar dit voorstel op is gebaseerd</h2>
          <p>{assumptions}</p>
          <p>{conditions}</p>
        </section>

        <section className="card">
          <span className="section-kicker">Vergelijking</span>
          <h2>Kort samengevat</h2>
          <ul className="clean-list">
            {shortComparison.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </section>

      {proposal.notes ? (
        <section className="card notes-card">
          <span className="section-kicker">Aanvullend</span>
          <h2>Aanvullende opmerkingen</h2>
          <p className="notes-copy">{proposal.notes}</p>
        </section>
      ) : null}

      <section className="card">
        <span className="section-kicker">Controlepunten</span>
        <h2>Controlepunten vóór definitieve vastlegging</h2>
        <div className="reservations">
          {reservations.map((item) => <div key={item}><span>□</span>{item}</div>)}
        </div>
      </section>

      <section className="card timeline-card">
        <span className="section-kicker">Proces</span>
        <h2>Vervolgstappen</h2>
        <div className="timeline">
          {nextSteps.map((item, index) => (
            <div key={item} className="timeline-step">
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="signature">
        <div>
          <span className="section-kicker">Contact</span>
          <h2>Voorstel bespreken?</h2>
          <p>
            Wij lichten het voorstel graag toe en kunnen samen bekijken of deze verkooproute aansluit
            bij uw situatie en planning.
          </p>
        </div>
        <div className="contact-block">
          <strong>Vastgoed Direct Nederland</strong>
          <span>06 12 23 80 51</span>
          <span>info@vastgoeddirectnederland.nl</span>
          <span>vastgoeddirectnederland.nl</span>

          <div className="contact-actions">
            <a href="#voorstel-actie">Akkoord geven</a>
            <a href="tel:0612238051">Bel direct</a>
            <a href="mailto:info@vastgoeddirectnederland.nl">Stel een vraag</a>
            <a href="https://wa.me/31612238051" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="disclaimer">
        <strong>Voorbehoud en totstandkoming:</strong> {nonbindingText}
      </section>
    </main>
  );
}

const styles = `.proposal-actions{width:100%;margin:0 0 18px;background:#fff;border:1px solid #e6dfd5;border-radius:26px;padding:24px;display:grid;grid-template-columns:1fr 1.15fr;gap:24px;align-items:center;box-shadow:0 18px 50px rgba(7,31,58,.09);scroll-margin-top:24px}.proposal-actions h2{margin:5px 0 8px}.proposal-actions p{margin:0;color:#617184;line-height:1.55}.proposal-actions-kicker{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#b85216}.proposal-action-buttons{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.proposal-action-buttons button,.proposal-action-buttons a{border:0;border-radius:999px;padding:13px 17px;font:inherit;font-weight:900;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}.proposal-action-buttons button:disabled{cursor:not-allowed;opacity:.7}.proposal-primary{background:#d96a1c;color:#fff;box-shadow:0 14px 30px rgba(217,106,28,.22)}.proposal-secondary,.proposal-action-buttons a{background:#f4f1eb;color:#071f3a}.proposal-action-note{font-size:13px!important;color:#617184!important;margin-top:10px!important}.proposal-action-preview-note{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:16px;padding:10px 12px;font-weight:800;font-size:13px}.proposal-action-success{width:100%;margin:0 0 18px;background:#eff8f2;border:1px solid #b9dec5;border-radius:22px;padding:18px 22px;display:grid;gap:4px}.proposal-action-success span{color:#446553}.proposal-action-inactive{background:#fff5f1;border-color:#ffd5c4}.proposal-action-inactive span{color:#7c2d20}.proposal-action-error{color:#9a3412!important;width:100%;text-align:right}.offer-panel i.validity-pill{display:inline-flex;font-style:normal;font-size:12px;margin-top:8px;color:#9a4b12;background:#fff1e6;border:1px solid #f2b885;border-radius:999px;padding:5px 9px;font-weight:900}.offer-panel i.validity-pill.is-urgent{background:#fff7ed;color:#b45309;border-color:#fdba74}.offer-panel i.validity-pill.is-expired{background:#fee2e2;color:#991b1b;border-color:#fecaca}.decision-inline{display:grid;grid-template-columns:1fr auto;gap:8px 16px;align-items:center;background:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:17px 18px;margin:14px 0 0}.decision-inline strong{font-size:20px;color:#071f3a}.decision-inline span{color:#5f7083;line-height:1.5}.decision-inline a{grid-row:1 / span 2;grid-column:2;background:#d96a1c;color:#fff;text-decoration:none;font-weight:900;border-radius:999px;padding:12px 16px;white-space:nowrap}@media(max-width:760px){.proposal-actions{grid-template-columns:1fr}.proposal-action-buttons{justify-content:stretch}.proposal-action-buttons>*{width:100%;text-align:center}.decision-inline{grid-template-columns:1fr}.decision-inline a{grid-row:auto;grid-column:auto;text-align:center}}

*{box-sizing:border-box}
:root{--navy:#071f3a;--navy2:#0d2d52;--orange:#D96A1C;--cream:#f5f2ec;--card:#fffdf9;--line:#e8e3db;--muted:#5f7083;--soft:#FFF1E6;--shadow:0 22px 70px rgba(7,31,58,.12)}
body{margin:0;background:radial-gradient(circle at 82% 0,#FFF1E6 0,transparent 34%),linear-gradient(180deg,#f7f3ec 0,#f1ede6 100%);color:var(--navy);font-family:Arial,Helvetica,sans-serif}
.proposal-page{max-width:1080px;margin:0 auto;padding:26px}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px}
.topbar img{width:235px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:10px;box-shadow:0 12px 36px rgba(7,31,58,.08)}
.top-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
.top-actions span{font-size:13px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
.topbar button{border:0;background:var(--orange);color:#fff;border-radius:999px;padding:13px 18px;font-weight:900;box-shadow:0 14px 30px rgba(217,106,28,.20)}
.cover{display:grid;grid-template-columns:1.25fr .85fr;gap:22px;background:linear-gradient(135deg,var(--navy) 0,var(--navy2) 64%,#123a67 100%);color:#fff;border-radius:34px;padding:38px;box-shadow:var(--shadow);position:relative;overflow:hidden;margin-bottom:20px}
.cover:after{content:"";position:absolute;right:-110px;top:-120px;width:320px;height:320px;border-radius:999px;background:rgba(217,106,28,.18)}
.cover:before{content:"";position:absolute;right:88px;bottom:-160px;width:280px;height:280px;border-radius:999px;border:42px solid rgba(255,255,255,.08)}
.cover-copy,.offer-panel{position:relative;z-index:1}
.label,.section-kicker{display:inline-flex;align-items:center;width:max-content;background:var(--soft);border:1px solid #F2B885;color:#B85216;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
.cover .label{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.24);color:#fff}
.cover h1{font-size:58px;line-height:.98;letter-spacing:-.06em;margin:18px 0 16px;max-width:640px}
.cover p{font-size:18px;line-height:1.65;color:#dbe8f5;margin:0;max-width:690px}
.offer-panel{background:#fff;color:var(--navy);border-radius:28px;padding:26px;align-self:stretch;box-shadow:0 24px 55px rgba(0,0,0,.20)}
.offer-panel>span{display:block;color:var(--muted);font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
.offer-panel strong{display:block;color:var(--orange);font-size:48px;line-height:1;margin:12px 0 10px;letter-spacing:-.055em}
.offer-panel small{display:block;color:var(--navy);font-weight:900;text-transform:uppercase;line-height:1.35}
.micro-grid{display:grid;grid-template-columns:1fr;gap:10px;margin-top:20px}
.micro-grid div{background:#f8f5ef;border:1px solid var(--line);border-radius:18px;padding:14px}
.micro-grid em,.micro-grid b{display:block;font-style:normal}
.micro-grid em{font-size:12px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.06em}
.micro-grid b{font-size:16px;margin-top:4px}

.proposal-assurance{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.proposal-assurance article{background:#fffdf9;border:1px solid var(--line);border-radius:24px;padding:20px;box-shadow:0 14px 40px rgba(7,31,58,.07)}
.proposal-assurance article:before{content:"";display:block;width:42px;height:5px;border-radius:999px;background:var(--orange);margin-bottom:14px}
.proposal-assurance strong,.proposal-assurance span{display:block}
.proposal-assurance strong{font-size:17px;color:var(--navy);margin-bottom:8px}
.proposal-assurance span{font-size:14.5px;line-height:1.5;color:var(--muted)}
.contact-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.contact-actions a{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--orange);color:#fff;text-decoration:none;font-weight:900;padding:11px 14px;font-size:14px}
.contact-actions a:nth-child(2),.contact-actions a:nth-child(3){background:#fff;color:var(--navy);border:1px solid rgba(255,255,255,.25)}
.contact-actions a:nth-child(4){background:#3E8F5E}

.executive-summary,.card,.signature,.disclaimer{background:var(--card);border:1px solid var(--line);border-radius:30px;padding:28px;box-shadow:var(--shadow);margin-bottom:18px}
.executive-summary{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:center}
h2{font-size:34px;line-height:1.05;letter-spacing:-.045em;margin:14px 0 14px}
p,.intro,li{font-size:16.5px;line-height:1.68;color:var(--muted)}
.summary-list{display:grid;gap:10px}
.summary-list div{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px}
.summary-list strong,.summary-list span{display:block}
.summary-list strong{font-size:24px;color:var(--navy)}
.summary-list span{color:var(--muted);margin-top:5px}
.special-card{background:linear-gradient(135deg,#fffdf9 0,#F7F2EC 100%)}.construct-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.construct-grid div{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px}.construct-grid strong,.construct-grid span{display:block}.construct-grid strong{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.construct-grid span{margin-top:6px;color:var(--navy);font-weight:800;line-height:1.35}.mini-checks{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px}.mini-checks div{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px;font-weight:800;line-height:1.4}.mini-checks span{color:var(--orange);font-weight:900}.bridge-copy{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0 0}.assurance-notice{background:linear-gradient(135deg,#071f3a 0,#0b2f56 100%);color:#fff;border-radius:20px;padding:18px 20px;margin:14px 0 0;box-shadow:0 16px 34px rgba(7,31,58,.16)}.assurance-notice strong{display:block;font-size:20px;letter-spacing:-.02em}.assurance-notice p{margin:8px 0 0;color:#d9e6f5;font-size:15.5px;line-height:1.55}
.notes-card{background:linear-gradient(135deg,#fffdf9 0,#F7F2EC 100%)}.notes-copy{white-space:pre-line;background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0 0;color:var(--navy);font-weight:700}
.facts{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:22px;overflow:hidden;background:#fff}
.facts div{padding:17px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);min-height:92px}
.facts div:nth-child(3n){border-right:0}
.facts strong,.facts span{display:block}
.facts strong{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.facts span{font-size:16px;color:var(--navy);font-weight:800;margin-top:7px;line-height:1.35}
.benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}
.benefits article{background:#fff;border:1px solid var(--line);border-radius:22px;padding:18px;min-height:160px}
.benefits article:before{content:"";display:block;width:38px;height:5px;border-radius:999px;background:var(--orange);margin-bottom:16px}
.benefits strong{display:block;font-size:18px}
.benefits p{font-size:15px;margin:9px 0 0}
.comparison{display:grid;grid-template-columns:1.18fr 1fr 1.12fr;border:1px solid var(--line);border-radius:22px;overflow:hidden;background:#fff;margin-top:18px}
.comparison>div{padding:15px 16px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);color:var(--muted);line-height:1.35}
.comparison>div:nth-child(3n){border-right:0}
.comparison .head{background:var(--navy);color:#fff;font-weight:900;text-align:center}
.comparison .orange{background:var(--orange)}
.comparison .total{background:#F7F2EC;font-weight:900;color:var(--navy)}
.comparison .accent{color:var(--orange);font-size:18px}
.comparison-mobile{display:none}
.checks{display:grid;grid-template-columns:repeat(2,1fr);gap:11px}
.checks div,.reservations div{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:18px;padding:15px;font-weight:800;line-height:1.4}
.checks span{color:var(--orange);font-weight:900}
.two-columns{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.clean-list{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:10px}
.clean-list li{background:#fff;border:1px solid var(--line);border-radius:16px;padding:13px 14px}
.reservations{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.reservations span{color:var(--orange);font-weight:900}
.timeline{display:grid;gap:12px}
.timeline-step{display:grid;grid-template-columns:70px 1fr;align-items:center;background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden}
.timeline-step strong{height:100%;display:flex;align-items:center;justify-content:center;background:var(--navy);color:#fff;font-size:18px}
.timeline-step span{padding:16px;color:var(--muted);line-height:1.55}
.signature{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;background:linear-gradient(135deg,#fffdf9 0,#F7F2EC 100%)}
.contact-block{background:var(--navy);color:#fff;border-radius:24px;padding:22px;align-self:center}
.contact-block strong,.contact-block span{display:block}
.contact-block strong{font-size:20px;margin-bottom:10px}
.contact-block span{color:#d9e6f5;margin-top:6px}
.disclaimer{background:#F7F2EC;color:#415168;line-height:1.65;font-size:14px;box-shadow:none}
@media(max-width:900px){.cover,.executive-summary,.two-columns,.signature,.proposal-assurance{grid-template-columns:1fr}.benefits{grid-template-columns:1fr 1fr}.facts{grid-template-columns:1fr 1fr}.facts div:nth-child(3n){border-right:1px solid var(--line)}.facts div:nth-child(2n){border-right:0}.comparison-desktop{display:none}.comparison-mobile{display:grid;gap:12px;margin-top:18px}.mobile-compare-card{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 10px 28px rgba(7,31,58,.045)}.mobile-compare-card h3{margin:0;padding:14px 16px;background:#F7F2EC;border-bottom:1px solid var(--line);font-size:18px;line-height:1.2;letter-spacing:-.02em;color:var(--navy)}.mobile-compare-values{display:grid;grid-template-columns:1fr 1fr}.mobile-compare-values div{padding:14px 16px;min-width:0}.mobile-compare-values div:first-child{border-right:1px solid var(--line)}.mobile-compare-values span{display:block;font-size:11px;line-height:1.25;text-transform:uppercase;letter-spacing:.055em;color:var(--muted);font-weight:900;margin-bottom:7px}.mobile-compare-values strong{display:block;font-size:18px;line-height:1.28;color:var(--navy);overflow-wrap:anywhere}.mobile-compare-values .direct strong{color:var(--orange)}.mobile-compare-card.total{border-color:#ead4c0;background:#fffaf4}.mobile-compare-card.total h3{background:#fff1e6}.mobile-compare-card.total strong{font-size:20px}.checks,.reservations,.construct-grid,.mini-checks{grid-template-columns:1fr}}
@media(max-width:640px){.proposal-page{padding:12px}.topbar{display:grid}.top-actions{justify-content:stretch}.top-actions span{display:none}.topbar img{width:215px}.topbar button{width:100%}.cover,.executive-summary,.card,.signature,.disclaimer{border-radius:24px;padding:20px}.cover h1{font-size:39px}.cover p{font-size:16px}.offer-panel strong{font-size:36px}.benefits,.facts{grid-template-columns:1fr}.facts div{border-right:0!important}.timeline-step{grid-template-columns:54px 1fr}.section-kicker{font-size:11px}h2{font-size:28px}.mobile-compare-card h3{font-size:17px;padding:13px 14px}.mobile-compare-values div{padding:12px 13px}.mobile-compare-values strong{font-size:16px}.mobile-compare-card.total strong{font-size:18px}}
@media(max-width:420px){.mobile-compare-values{grid-template-columns:1fr}.mobile-compare-values div:first-child{border-right:0;border-bottom:1px solid var(--line)}.mobile-compare-values div{padding:12px 14px}.mobile-compare-values span{font-size:10.5px}.mobile-compare-values strong{font-size:17px}.mobile-compare-card.total strong{font-size:19px}}
@media print{body{background:#fff}.proposal-page{max-width:none;padding:0}.topbar button,.top-actions span{display:none}.topbar img{box-shadow:none}.cover,.executive-summary,.card,.signature,.disclaimer{box-shadow:none;page-break-inside:avoid;border-radius:18px}.cover{background:#071f3a!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.offer-panel{box-shadow:none}.comparison .head,.timeline-step strong,.contact-block{background:#071f3a!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.comparison .orange{background:#D96A1C!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;
