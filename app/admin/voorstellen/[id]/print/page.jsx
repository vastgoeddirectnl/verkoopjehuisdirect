import { notFound } from "next/navigation";
import { queryOne } from "../../../../lib/neonDb";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

const DEFAULT_NONBINDING_TEXT = "Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid.";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatPostal(value) {
  return String(value || "").trim().toUpperCase();
}

function amount(value, fallback = "In overleg") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (raw.includes("€")) return raw;

  const cleaned = raw.replace(/\s/g, "");
  const numberLike = cleaned.replace(/[^\d]/g, "");

  if (!numberLike) return raw;

  if (/^\d+$/.test(cleaned.replace(/\./g, "").replace(/,/g, ""))) {
    const formatted = new Intl.NumberFormat("nl-NL", {
      maximumFractionDigits: 0,
    }).format(Number(numberLike));
    return `€ ${formatted}`;
  }

  return raw;
}

function value(value, fallback = "-") {
  const raw = String(value || "").trim();
  return raw || fallback;
}

function areaValue(value, fallback = "-") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (/m²|m2|㎡/i.test(raw)) return raw.replace(/m2/i, "m²");
  if (/^\d+(?:[,.]\d+)?$/.test(raw)) return `${raw} m²`;
  return raw;
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
  if (proposal.property_address) return formatPostal(proposal.property_address);
  const parts = [proposal.property_postcode, proposal.property_house_number].filter(Boolean);
  return formatPostal(parts.join(" ")) || "-";
}

function proposalNumber(proposal) {
  const raw = String(proposal?.id || proposal?.public_token || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  const year = proposal?.created_at ? new Date(proposal.created_at).getFullYear() : new Date().getFullYear();
  return raw ? `VDN-${year}-${raw}` : `VDN-${year}`;
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

export default async function ProposalPrintPage({ params }) {
  const { id } = await params;
  const proposal = await queryOne("select * from proposals where id = $1", [id]);

  if (!proposal) notFound();

  const included = lines(proposal.included_items, [
    "Heldere communicatie",
    "Geen makelaarskosten",
    "Geen openbare bezichtigingen nodig",
    "Notariële afwikkeling",
    "Verkoopoplossing op maat",
    "Vrijblijvend voorstel",
  ]);

  const assumptions = value(
    proposal.assumptions_text,
    "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken of aanvullende kosten kunnen invloed hebben op de definitieve afspraken."
  );

  const reservations = lines(proposal.reservations_text, [
    "Controle woninggegevens",
    "Controle eigendomssituatie",
    "Controle beschikbare documenten",
    "Notariële toetsing",
    "Akkoord op voorwaarden",
    "Geen bijzondere belemmeringen",
  ]);

  const nextSteps = lines(proposal.next_steps_text, [
    "U beoordeelt het voorstel rustig.",
    "Wij bespreken vragen, bijzonderheden en eventuele voorwaarden.",
    "Bij akkoord worden afspraken juridisch en notarieel vastgelegd.",
    "De overdracht vindt plaats via de notaris.",
    "Bij akkoord werken wij de afspraken uit in een koopovereenkomst; de definitieve overdracht en betaling verlopen via de notaris.",
  ]);

  const proposalType = value(proposal.proposal_type, proposal.proposal_variant || "Standaard aankoop");
  const specialProposal = isSpecialProposalType(proposalType);
  const checks = constructieChecks(proposal);
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
  const showAdditionalAgreements = showSellerWork || showResalePayment;
  const deliverySectionNumber = showDeliveryConstructie ? 4 : null;
  const bridgeSectionNumber = showBridge ? 4 + (showDeliveryConstructie ? 1 : 0) : null;
  const useRentalSectionNumber = showUseRental ? 4 + (showDeliveryConstructie ? 1 : 0) + (showBridge ? 1 : 0) : null;
  const additionalAgreementsSectionNumber = showAdditionalAgreements ? 4 + (showDeliveryConstructie ? 1 : 0) + (showBridge ? 1 : 0) + (showUseRental ? 1 : 0) : null;
  const offset = (showDeliveryConstructie ? 1 : 0) + (showBridge ? 1 : 0) + (showUseRental ? 1 : 0) + (showAdditionalAgreements ? 1 : 0);
  const netSectionNumber = String(4 + offset);
  const comparisonSectionNumber = String(5 + offset);
  const reservationsSectionNumber = String(6 + offset);
  const nextStepsSectionNumber = String(7 + offset);
  const contactSectionNumber = String(8 + offset);
  const nonbindingText = value(proposal.nonbinding_text, DEFAULT_NONBINDING_TEXT);

  return (
    <main className="print-root">
      <style>{styles}</style>
      <div className="print-actions">
        <PrintButton />
      </div>

      <article className="page cover">
        <div className="cover-logo">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
        </div>

        <div className="mobile-curve" aria-hidden="true" />

        <div className="cover-content">
          <span className="eyebrow">Vrijblijvend voorstel</span>
          <h1>Vrijblijvend verkoopvoorstel</h1>
          <p>Professioneel en vrijblijvend voorstel voor uw woningverkoop.</p>
          <div className="cover-card">
            <strong>{formatAddress(proposal)}</strong>
            <span>{amount(proposal.amount_text)}</span>
          </div>
        </div>

        <div className="cover-footer">
          <span>www.vastgoeddirectnederland.nl</span>
          <span>06 12 23 80 51</span>
        </div>
      </article>

      <article className="page">
        <header className="doc-header">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>{value(proposal.status, "Concept")} voorstel</strong>
            <span>Voorstelnummer: {proposalNumber(proposal)}</span>
            <span>Datum: {formatDate(proposal.created_at)}</span>
            <span>Geldig tot: {formatDate(proposal.validity_date)}</span>
          </div>
        </header>

        <h1>Vrijblijvend verkoopvoorstel</h1>
        <p className="lead">
          Beste {proposal.lead_naam || "heer/mevrouw"}, naar aanleiding van uw aanvraag ontvangt u hierbij een helder en vrijblijvend verkoopvoorstel.
          Dit voorstel is bedoeld om snel duidelijkheid te geven over de mogelijke verkooproute, voorwaarden en vervolgstappen.
        </p>
        <p className="subtle">
          Vergelijk niet alleen het bodbedrag, maar vooral de netto-opbrengst, voorwaarden, snelheid en zekerheid van de verkoop.
        </p>

        <section className="section">
          <div className="section-title orange"><span>1</span><strong>Voorgesteld bod</strong></div>
          <div className="offer-grid">
            <div className="offer-amount">
              <span>Voorgesteld bedrag</span>
              <strong>{amount(proposal.amount_text)}</strong>
            </div>
            <div className="facts">
              <div><span>Overdrachtsdatum / oplevering</span><strong>{value(proposal.transfer_date_text, "In overleg")}</strong></div>
              <div><span>Geldigheid voorstel</span><strong>{formatDate(proposal.validity_date)}</strong></div>
              <div><span>Aanbetaling / voorschot</span><strong>{amount(proposal.deposit_text, "In overleg bespreekbaar")}</strong></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>2</span><strong>Gegevens woning</strong></div>
          <div className="table two">
            <div><strong>Adres / woning</strong><span>{formatAddress(proposal)}</span></div>
            <div><strong>Postcode / huisnummer</strong><span>{value([formatPostal(proposal.property_postcode), proposal.property_house_number].filter(Boolean).join(" "))}</span></div>
            <div><strong>Type woning</strong><span>{value(proposal.property_type)}</span></div>
            <div><strong>Woonoppervlakte</strong><span>{areaValue(proposal.living_area_text)}</span></div>
            <div><strong>Perceeloppervlakte</strong><span>{areaValue(proposal.plot_area_text)}</span></div>
            <div><strong>Bouwjaar</strong><span>{value(proposal.build_year_text)}</span></div>
            <div className="wide"><strong>Huidige situatie</strong><span>{value(proposal.current_situation)}</span></div>
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>3</span><strong>Wat is inbegrepen</strong></div>
          <div className="checks">
            {included.map((item) => <div key={item}>✓ {item}</div>)}
          </div>
        </section>

        {showDeliveryConstructie ? (
          <section className="section">
            <div className="section-title navy"><span>{deliverySectionNumber}</span><strong>Levering & constructie</strong></div>
            <div className="table two">
              <div><strong>Type voorstel</strong><span>{proposalType}</span></div>
              <div><strong>Passeertermijn</strong><span>{value(proposal.delivery_term_text, value(proposal.transfer_date_text, "In overleg"))}</span></div>
              <div><strong>Gewenste leverdatum</strong><span>{formatDate(proposal.desired_transfer_date)}</span></div>
              <div><strong>Koper</strong><span>{value(proposal.buyer_text, "Vastgoed Direct Nederland of nader te noemen meester")}</span></div>
            </div>
            {checks.length ? (
              <div className="checks compact-checks">
                {checks.map((item) => <div key={item}>✓ {item}</div>)}
              </div>
            ) : null}
          </section>
        ) : null}

        {showBridge ? (
          <section className="section">
            <div className="section-title navy"><span>{bridgeSectionNumber}</span><strong>Overbruggingssituatie</strong></div>
            <div className="table two">
              <div className="wide"><strong>Huidige woning klant</strong><span>{value(proposal.bridge_current_home, "In overleg / niet ingevuld")}</span></div>
              <div className="wide"><strong>Oude woning / te verkopen woning</strong><span>{value(proposal.bridge_old_home, "In overleg / niet ingevuld")}</span></div>
              <div className="wide"><strong>Doel van de constructie</strong><span>{value(proposal.bridge_goal_text, "Duidelijkheid over verkoop, planning en aflossing van de overbruggingssituatie.")}</span></div>
            </div>
            {proposal.bridge_explanation_text ? <p className="notice"><strong>Toelichting:</strong> {proposal.bridge_explanation_text}</p> : null}
          </section>
        ) : null}

        {showUseRental ? (
          <section className="section">
            <div className="section-title navy"><span>{useRentalSectionNumber}</span><strong>Gebruik, verhuur en oplevering</strong></div>
            <div className="table two">
              <div><strong>Objecttype</strong><span>{value(proposal.object_usage_type, "Nog te controleren")}</span></div>
              <div><strong>Huidig gebruik</strong><span>{value(proposal.current_occupancy_status, "Nog te controleren")}</span></div>
              <div><strong>Wordt geleverd</strong><span>{value(proposal.delivery_occupancy_status, "Vrij van huur en gebruik")}</span></div>
              <div><strong>Huurovereenkomst aanwezig</strong><span>{value(proposal.lease_agreement_available, "Onbekend")}</span></div>
              <div><strong>Einddatum huur</strong><span>{formatDate(proposal.lease_end_date)}</span></div>
              <div><strong>Uiterste ontruiming</strong><span>{formatDate(proposal.tenant_vacate_deadline)}</span></div>
              <div><strong>Huurder werkt mee</strong><span>{value(proposal.tenant_cooperation_status, "Onbekend")}</span></div>
              <div><strong>Actuele huur</strong><span>{value(proposal.current_rent_text, "Niet ingevuld")}</span></div>
              <div><strong>Waarborgsom</strong><span>{value(proposal.deposit_present, "Onbekend")}</span></div>
              <div><strong>Huurachterstand/geschil</strong><span>{value(proposal.rent_arrears_or_dispute, "Onbekend")}</span></div>
              <div><strong>Winkel-/bedrijfsruimte</strong><span>{areaValue(proposal.commercial_area_text)}</span></div>
              <div><strong>Woonruimte</strong><span>{areaValue(proposal.residential_area_text)}</span></div>
              <div><strong>Aparte entree bovenwoning</strong><span>{value(proposal.separate_entrance_status, "Onbekend")}</span></div>
              <div><strong>Zelfstandige woonruimte</strong><span>{value(proposal.independent_residence_status, "Onbekend")}</span></div>
              <div><strong>Bestemming/vergunningen</strong><span>{value(proposal.zoning_permits_checked, "Onbekend")}</span></div>
              <div><strong>Splitsingsmogelijkheid</strong><span>{value(proposal.split_potential_status, "Onbekend")}</span></div>
              <div><strong>Brandveiligheid/gebruiksvereisten</strong><span>{value(proposal.fire_safety_check_status, "Onbekend")}</span></div>
            </div>
            <p className="notice">Uitgangspunt van dit voorstel is dat het object bij juridische levering {String(value(proposal.delivery_occupancy_status, "vrij van huur en gebruik")).toLowerCase()} wordt geleverd, tenzij schriftelijk anders overeengekomen. Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming, vergunningen, brandveiligheid en eventuele splitsingsmogelijkheden vóór definitieve vastlegging gecontroleerd.</p>
            {proposal.use_rental_notes_text ? <p className="notice">{proposal.use_rental_notes_text}</p> : null}
          </section>
        ) : null}

        {showAdditionalAgreements ? (
          <section className="section">
            <div className="section-title navy"><span>{additionalAgreementsSectionNumber}</span><strong>Aanvullende afspraken</strong></div>

            {showSellerWork ? (
              <div className="agreement-print-block">
                <h2>Werkzaamheden door verkoper</h2>
                <div className="table two">
                  <div><strong>Basiskoopprijs</strong><span>{amount(proposal.seller_work_base_price_text)}</span></div>
                  <div><strong>Bedrag werkzaamheden</strong><span>{amount(proposal.seller_work_amount_text)}</span></div>
                  <div><strong>Totale koopprijs na uitvoering</strong><span>{amount(proposal.seller_work_total_price_text)}</span></div>
                  <div><strong>Uiterste uitvoeringsdatum</strong><span>{formatDate(proposal.seller_work_deadline)}</span></div>
                  {proposal.seller_work_description ? <div className="wide"><strong>Omschrijving werkzaamheden</strong><span>{proposal.seller_work_description}</span></div> : null}
                </div>
                <p className="notice">Verkoper zal vóór de juridische levering de in dit voorstel omschreven herstelwerkzaamheden uitvoeren. Wanneer deze werkzaamheden volledig en deugdelijk zijn uitgevoerd en door koper zijn goedgekeurd, wordt de basiskoopprijs verhoogd met {amount(proposal.seller_work_amount_text)}. De totale koopprijs bedraagt in dat geval {amount(proposal.seller_work_total_price_text)} kosten koper.</p>
                <p className="notice">Wanneer de werkzaamheden niet, niet volledig of niet deugdelijk zijn uitgevoerd, kan de aanvullende koopprijs worden verminderd met de redelijkerwijs benodigde kosten om de werkzaamheden alsnog te voltooien of te herstellen. Het bedrag voor de werkzaamheden wordt niet als losse betaling vóór levering weergegeven, maar als mogelijke verhoging van de koopsom bij de notariële levering.</p>
                {proposal.seller_work_conditions_text ? <p className="notice">{proposal.seller_work_conditions_text}</p> : null}
              </div>
            ) : null}

            {showResalePayment ? (
              <div className="agreement-print-block">
                <h2>Aanvullende betaling bij doorverkoop</h2>
                <div className="table two">
                  <div><strong>Drempelbedrag</strong><span>{amount(proposal.resale_threshold_text)}</span></div>
                  <div><strong>Percentage meeropbrengst</strong><span>{percent(proposal.resale_percentage_text)}</span></div>
                  <div><strong>Periode</strong><span>{months(proposal.resale_period_months)}</span></div>
                  <div><strong>Courtage aftrekken</strong><span>{proposal.resale_deduct_courtage ? "Ja, alleen latere doorverkoopcourtage" : "Nee"}</span></div>
                  {proposal.resale_cap_text ? <div><strong>Maximumbedrag</strong><span>{amount(proposal.resale_cap_text)}</span></div> : null}
                </div>
                <p className="notice">Indien de woning binnen {months(proposal.resale_period_months, "de afgesproken periode")} wordt doorverkocht tegen een netto doorverkoopprijs van meer dan {amount(proposal.resale_threshold_text)}, ontvangt verkoper een aanvullende betaling ter grootte van {percent(proposal.resale_percentage_text)} van het gedeelte van de netto doorverkoopprijs boven {amount(proposal.resale_threshold_text)}.</p>
                <p className="notice">Onder netto doorverkoopprijs wordt verstaan de overeengekomen verkoopprijs aan de opvolgende koper, verminderd met de door koper daadwerkelijk verschuldigde makelaarscourtage voor de doorverkoop, inclusief btw. Andere aankoop-, verbouwings-, financierings-, notaris- of verkoopkosten worden niet in mindering gebracht. De courtage van de huidige verkoopmakelaar van verkoper wordt niet afgetrokken.</p>
                <p className="notice">Deze regeling geldt ook bij een ABC-transactie, AB-BC-transactie, levering aan een nader te noemen meester of rechtstreekse levering aan een eindkoper.</p>
                {proposal.resale_explanation_text ? <p className="notice">{proposal.resale_explanation_text}</p> : null}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="notice">
          <strong>Uitgangspunten:</strong> {assumptions}
        </section>
      </article>

      <article className="page">
        <header className="doc-header small">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Geldig tot: {formatDate(proposal.validity_date)}</span>
          </div>
        </header>

        <h1>Vergelijking en netto-opbrengst</h1>
        <p className="subtle">
          Gebruik dit overzicht om niet alleen het bod, maar vooral de netto-opbrengst en voorwaarden te vergelijken.
        </p>

        <section className="section">
          <div className="section-title orange"><span>{netSectionNumber}</span><strong>Netto-opbrengst vergelijken</strong></div>
          <div className="comparison">
            <div className="head">Onderdeel</div>
            <div className="head">Traditionele verkoop</div>
            <div className="head orange-head">Vastgoed Direct Nederland</div>

            <div><strong>Bod / verkoopprijs</strong></div>
            <div>{amount(proposal.traditional_price_text, "-")}</div>
            <div>{amount(proposal.amount_text)}</div>

            <div><strong>Makelaarskosten</strong></div>
            <div>{value(proposal.agent_costs_text, "-")}</div>
            <div>€ 0</div>

            <div><strong>Notariskosten levering</strong></div>
            <div>{value(proposal.notary_costs_text, "-")}</div>
            <div>Standaard voor onze rekening*</div>

            <div><strong>Herstel- of renovatiekosten</strong></div>
            <div>{value(proposal.renovation_costs_text, "-")}</div>
            <div>Niet noodzakelijk vooraf</div>

            <div><strong>Overige verkoopkosten</strong></div>
            <div>{value(proposal.other_costs_text, "-")}</div>
            <div>In overleg / niet standaard nodig</div>

            <div className="total"><strong>Verwachte netto-opbrengst</strong></div>
            <div className="total">{amount(proposal.traditional_net_text, "-")}</div>
            <div className="total accent">{amount(proposal.direct_net_text || proposal.amount_text)}</div>
          </div>
          <p className="footnote">* Eventuele afwijkende kosten of bijzondere afspraken worden vooraf besproken.</p>
        </section>

        <section className="section">
          <div className="section-title navy"><span>{comparisonSectionNumber}</span><strong>Korte vergelijking</strong></div>
          <div className="mini-table">
            <div><strong>Bezichtigingen</strong><span>Vaak meerdere</span><em>Niet standaard nodig</em></div>
            <div><strong>Verkoopklaar maken</strong><span>Vaak gewenst</span><em>Niet noodzakelijk vooraf</em></div>
            <div><strong>Opleverdatum</strong><span>Afhankelijk van koper</span><em>In overleg bespreekbaar</em></div>
            <div><strong>Snelheid</strong><span>Kan weken/maanden duren</span><em>Snelle duidelijkheid mogelijk</em></div>
            <div><strong>Privacy</strong><span>Openbare presentatie</span><em>Vertrouwelijk traject</em></div>
          </div>
          {proposal.short_comparison_text ? <p className="notice">{proposal.short_comparison_text}</p> : null}
        </section>
      </article>

      <article className="page">
        <header className="doc-header small">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Geldig tot: {formatDate(proposal.validity_date)}</span>
          </div>
        </header>

        <h1>Voorbehouden en vervolgstappen</h1>
        <p className="subtle">De exacte voorwaarden worden vooraf besproken en bij akkoord schriftelijk en notarieel vastgelegd.</p>

        <section className="section">
          <div className="section-title orange"><span>{reservationsSectionNumber}</span><strong>Voorbehouden</strong></div>
          <div className="reservations">
            {reservations.map((item) => <div key={item}>☐ {item}</div>)}
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>{nextStepsSectionNumber}</span><strong>Vervolgstappen</strong></div>
          <ol className="steps">
            {nextSteps.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </section>

        <section className="section">
          <div className="section-title navy"><span>{contactSectionNumber}</span><strong>Contact</strong></div>
          <div className="contact-grid">
            <div>
              <strong>Vastgoed Direct Nederland</strong>
              <span>info@vastgoeddirectnederland.nl</span>
              <span>06 12 23 80 51</span>
              <span>www.vastgoeddirectnederland.nl</span>
            </div>
            <div>
              <strong>Contactpersoon: {proposal.contact_person || "Rob Schiphuis"}</strong>
              <span>Datum: {formatDate(proposal.created_at)}</span>
              <span>Bespreeknotitie: ________________________________</span>
            </div>
          </div>
        </section>

        {proposal.notes ? (
          <section className="notice">
            <strong>Aanvullende opmerkingen:</strong> {proposal.notes}
          </section>
        ) : null}

        <section className="disclaimer">
          <strong>Voorbehoud en totstandkoming:</strong> {nonbindingText}
        </section>
      </article>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}body{margin:0;background:#f5f2ec;color:#071f3a;font-family:Arial,Helvetica,sans-serif}.print-root{padding:24px}.print-actions{width:min(980px,100%);margin:0 auto 18px;text-align:right}.print-actions button{border:0;background:#D96A1C;color:#fff;border-radius:999px;padding:14px 22px;font-weight:900;cursor:pointer;box-shadow:0 12px 28px rgba(217,106,28,.20)}.page{width:min(980px,100%);min-height:1320px;margin:0 auto 24px;background:#fffdf9;border:1px solid #e8e3db;padding:44px;box-shadow:0 22px 70px rgba(7,31,58,.12);position:relative;overflow:hidden}.cover{display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 78% 62%,rgba(217,106,28,.14),transparent 28%),linear-gradient(135deg,#fffdf9 0%,#fff 54%,#f5f9ff 100%)}.cover:after{content:"";position:absolute;right:-260px;bottom:-260px;width:700px;height:700px;border-radius:50%;background:#071f3a;box-shadow:-26px -26px 0 #D96A1C;z-index:0}.mobile-curve{display:none}.cover-logo,.cover-content,.cover-footer{position:relative;z-index:1}.cover-logo{text-align:center}.cover-logo img{width:260px;height:auto}.eyebrow{display:inline-block;margin-top:80px;background:#FFF1E6;border:1px solid #F2B885;color:#B85216;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.cover h1{font-size:76px;line-height:.95;margin:22px 0;letter-spacing:-.06em;max-width:720px}.cover p{font-size:24px;line-height:1.35;color:#415168;max-width:520px}.cover-card{margin-top:36px;background:#fff;border:1px solid #e8e3db;border-radius:28px;padding:22px;width:min(520px,100%);box-shadow:0 18px 50px rgba(7,31,58,.12)}.cover-card strong,.cover-card span{display:block}.cover-card strong{font-size:21px;text-transform:uppercase}.cover-card span{margin-top:6px;font-size:32px;color:#D96A1C;font-weight:900}.cover-footer{display:flex;gap:26px;font-weight:900}.doc-header{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #e8e3db;padding-bottom:22px;margin-bottom:32px}.doc-header img{width:210px;background:#fff;border-radius:16px;padding:8px}.doc-header div{text-align:right}.doc-header strong{display:block;color:#D96A1C;font-size:19px}.doc-header span{display:block;color:#536273;margin-top:4px}.doc-header.small{padding-bottom:14px;margin-bottom:28px}.doc-header.small img{width:170px}h1{font-size:44px;line-height:1.06;letter-spacing:-.04em;margin:0 0 12px}.lead,.subtle,p,li{font-size:17px;line-height:1.55;color:#536273}.subtle{margin-top:0}.section{margin-top:28px}.section-title{display:grid;grid-template-columns:80px 1fr;align-items:center;color:#fff;text-transform:uppercase;font-weight:900;letter-spacing:.02em}.section-title span{text-align:center;padding:12px}.section-title strong{padding:12px;text-align:center}.section-title.orange{background:#D96A1C}.section-title.navy{background:#071f3a}.offer-grid{display:grid;grid-template-columns:.9fr 1.4fr;border:1px solid #e8e3db;border-top:0}.offer-amount{background:#FFF1E6;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center}.offer-amount span{font-weight:900}.offer-amount strong{font-size:44px;color:#D96A1C;margin-top:10px}.facts div,.table div{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e8e3db}.facts div:last-child{border-bottom:0}.facts span,.facts strong,.table strong,.table span{padding:14px}.facts span,.table strong{font-weight:900}.facts strong,.table span{color:#536273}.table{border:1px solid #e8e3db;border-top:0}.table .wide{grid-column:1/-1}.checks{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #e8e3db;border-top:0}.checks.compact-checks{grid-template-columns:repeat(2,1fr);margin-top:0}.checks div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;font-weight:900}.checks div:nth-child(3n){border-right:0}.notice{background:#F7F2EC;border:1px solid #F2B885;border-radius:0;padding:14px 16px;color:#415168;line-height:1.55}.comparison{display:grid;grid-template-columns:1.15fr 1fr 1.15fr;border:1px solid #e8e3db;border-top:0}.comparison>div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;color:#536273}.comparison .head{background:#071f3a;color:#fff;text-align:center;font-weight:900}.comparison .orange-head{background:#D96A1C}.comparison .total{background:#F7F2EC;font-weight:900;color:#071f3a}.comparison .accent{color:#D96A1C;font-size:20px}.footnote{font-size:13px;margin:8px 0 0}.mini-table{border:1px solid #e8e3db;border-top:0}.mini-table div{display:grid;grid-template-columns:1fr 1fr 1.2fr;border-bottom:1px solid #e8e3db}.mini-table div:last-child{border-bottom:0}.mini-table strong,.mini-table span,.mini-table em{padding:14px;font-style:normal}.mini-table strong{font-weight:900}.mini-table span{color:#536273}.mini-table em{color:#071f3a;font-weight:900}.reservations{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e8e3db;border-top:0}.reservations div{padding:16px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db}.reservations div:nth-child(2n){border-right:0}.steps{counter-reset:step;list-style:none;margin:0;border:1px solid #e8e3db;border-top:0;padding:0}.steps li{position:relative;color:#071f3a;font-weight:900;padding:18px 18px 18px 74px;border-bottom:1px solid #e8e3db}.steps li:last-child{border-bottom:0}.steps li:before{counter-increment:step;content:counter(step);position:absolute;left:24px;color:#D96A1C;font-size:22px}.contact-grid{display:grid;grid-template-columns:1fr 1.55fr;border:1px solid #e8e3db;border-top:0}.contact-grid>div{padding:18px;border-right:1px solid #e8e3db}.contact-grid>div:last-child{border-right:0}.contact-grid span{display:block;color:#536273;margin-top:6px}.agreement-print-block{border:1px solid #e8e3db;border-top:0;padding:18px}.agreement-print-block h2{font-size:25px;margin:0 0 12px}.agreement-print-block+.agreement-print-block{border-top:1px solid #e8e3db;margin-top:18px}.disclaimer{margin-top:28px;background:#F7F2EC;border:1px solid #F2B885;padding:16px;color:#415168;line-height:1.55}@media print{body{background:#fff}.print-root{padding:0}.print-actions{display:none}.page{width:100%;min-height:0;height:auto;margin:0;box-shadow:none;border:0;page-break-after:always;padding:28px}.page:last-child{page-break-after:auto}.cover{min-height:100vh}.cover h1{font-size:64px}.cover:after{display:block;opacity:.96}}@media(max-width:760px){body{background:#f5f2ec}.print-root{padding:10px}.print-actions{text-align:center;margin-bottom:10px}.print-actions button{width:100%;padding:12px 15px}.page{width:100%;min-height:auto;margin:0 auto 14px;padding:20px;border-radius:20px;box-shadow:0 12px 38px rgba(7,31,58,.10);overflow:hidden}.cover{min-height:auto;display:block;background:#fffdf9;padding:0}.cover:after{display:none}.mobile-curve{display:block;height:82px;margin:14px -20px 0;background:linear-gradient(135deg,#D96A1C 0 40%,#071f3a 41% 100%);border-radius:0 0 24px 24px}.cover-logo{padding:20px 16px 4px}.cover-logo img{width:min(250px,72vw)}.cover-content{padding:20px}.eyebrow{margin-top:0;font-size:10px;padding:7px 10px;letter-spacing:.07em}.cover h1{font-size:36px;line-height:1.01;letter-spacing:-.055em;margin:14px 0 10px;color:#071f3a;max-width:100%}.cover p{font-size:16px;line-height:1.4;color:#536273;max-width:100%;margin:0}.cover-card{margin-top:18px;border-radius:20px;padding:16px;width:100%;box-shadow:0 10px 28px rgba(7,31,58,.11)}.cover-card strong{font-size:17px}.cover-card span{font-size:32px}.cover-footer{padding:0 20px 22px;display:grid;gap:3px;font-size:13px}.doc-header{display:grid;gap:12px}.doc-header img{width:180px}.doc-header div{text-align:left}h1{font-size:34px}.offer-grid,.checks,.comparison,.mini-table div,.reservations,.contact-grid{grid-template-columns:1fr}.section-title{grid-template-columns:54px 1fr}.comparison .head{text-align:left}.comparison>div{border-right:0}.facts div,.table div{grid-template-columns:1fr}.offer-amount strong{font-size:36px}.checks div,.reservations div{border-right:0}.mini-table strong,.mini-table span,.mini-table em{padding:10px 12px}.steps li{padding-left:56px}.lead,.subtle,p,li{font-size:16px}}
`;
