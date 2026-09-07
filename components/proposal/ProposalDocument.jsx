// Eén gedeelde opmaak voor het voorstel (ARCH-01). Voorheen stonden hier twee
// bijna-identieke React-bestanden: app/voorstel/[token]/page.jsx (publiek,
// 847 regels) en app/admin/voorstellen/[id]/print/page.jsx (adminprint, 673
// regels), met 24 letterlijk dubbele helperfuncties en ~750 vrijwel gelijke
// regels opmaak. Beide pagina's zijn nu dun: ze halen het voorstel op en
// renderen <ProposalDocument variant="public" | "print" />.
//
// De twee documenten blijven visueel verschillend (een doorlopende webpagina
// vs. een gepagineerde printversie), dus de opmaak (JSX + CSS) staat hieronder
// nog steeds als twee aparte returns — maar alle logica komt nu uit
// proposalFormat.js en proposalContent.js, in plaats van dubbel gedefinieerd
// te zijn.
//
// De logo's hieronder blijven bewust <img>, niet next/image: dit document
// wordt ook als print/PDF gebruikt (window.print()), en next/image's
// standaard lazy-loading + srcset-varianten passen slecht bij een
// printcontext (een nog niet geladen afbeelding print leeg). De publieke
// en admin-marketingpagina's gebruiken next/image wél.

import PrintButton from "./PrintButton";
import ProposalActions from "../../voorstel/[token]/ProposalActions";
import ProposalViewTracker from "../../voorstel/[token]/ProposalViewTracker";
import { isSellerWorkComplete } from "../../lib/proposalValidation";
import {
  amount,
  parseMoney,
  costInclVatValue,
  percent,
  months,
  value,
  hasText,
  hasMeaningfulDeposit,
  lines,
  areaValue,
  monthlyRentValue,
  formatAddress,
  formatPostal,
} from "./proposalFormat";
import {
  formatDate,
  daysUntil,
  validityStatusText,
  validityStatusClass,
  ensureIncludedAssurance,
  additionalSellerWorkCondition,
  cleanUseRentalNotes,
  withNoBuyerConditionsText,
  isSpecialProposalType,
  constructieChecks,
  objectTerms,
  objectAwareText,
  salutationName,
  canRespondToProposal,
  proposalNumber,
  NO_BUYER_CONDITIONS_NOTICE_TITLE,
  NO_BUYER_CONDITIONS_NOTICE_TEXT,
  COST_VAT_NOTE,
  COMPARISON_BASIS_NOTE,
} from "./proposalContent";

export default function ProposalDocument({ proposal, variant, token, isAdminPreview = false }) {
  if (variant === "print") return <PrintProposal proposal={proposal} />;
  return <PublicProposal proposal={proposal} token={token} isAdminPreview={isAdminPreview} />;
}

function PublicProposal({ proposal, token, isAdminPreview }) {
  const address = formatAddress(proposal);
  const offerAmount = amount(proposal.amount_text);
  const validity = formatDate(proposal.validity_date);
  const validityDays = daysUntil(proposal.validity_date);
  const transfer = value(proposal.transfer_date_text, "In overleg");
  const deposit = hasMeaningfulDeposit(proposal.deposit_text) ? amount(proposal.deposit_text, "") : "";
  const terms = objectTerms(proposal, "public");

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
    "Als u verder wilt, werken wij de afspraken uit in een koopovereenkomst.",
    "Na ondertekening wordt de notariële afwikkeling opgestart.",
    "De overdracht vindt plaats op de afgesproken datum via de notaris.",
  ]).map((item) => objectAwareText(item, proposal));

  const comparisonNote = objectAwareText(String(proposal.short_comparison_text || "").trim(), proposal);

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
  const sellerWorkRequested = Boolean(proposal.seller_work_enabled);
  const showSellerWork = isSellerWorkComplete(proposal);
  const sellerWorkInvalid = sellerWorkRequested && !showSellerWork;
  const resalePaymentRequested = Boolean(proposal.resale_payment_enabled);
  const showResalePayment = Boolean(
    resalePaymentRequested &&
    parseMoney(proposal.resale_threshold_text) &&
    parseMoney(proposal.resale_percentage_text) &&
    Number(proposal.resale_period_months || 0) > 0
  );
  const resalePaymentInvalid = resalePaymentRequested && !showResalePayment;
  const showUseRental = Boolean(proposal.use_rental_enabled);
  const nonbindingText = withNoBuyerConditionsText(proposal.nonbinding_text);
  const actionActive = canRespondToProposal(proposal);

  return (
    <main className="proposal-page">
      <style>{publicStyles}</style>
      <ProposalViewTracker token={token} enabled={!isAdminPreview && actionActive} />

      <header className="topbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vastgoed Direct Nederland" />
        <div className="top-actions">
          <span>Persoonlijk verkoopvoorstel</span>
          <a className="top-response-link" href="#voorstel-actie">Naar uw reactie</a>
          <PrintButton token={token} />
        </div>
      </header>

      <section className="cover">
        <div className="cover-copy">
          <span className="label">Vrijblijvend & persoonlijk</span>
          <h1>Een helder voorstel voor {terms.possessive}</h1>
          <p>
            Beste {salutationName(proposal.lead_naam)}, op basis van de beschikbare informatie hebben wij
            een persoonlijk verkoopvoorstel uitgewerkt. U leest hieronder het bedrag, de afspraken,
            de financiële vergelijking en de vervolgstappen. Bekijk alles rustig; u zit nergens direct aan vast.
          </p>
        </div>

        <aside className="offer-panel">
          <span>Ons voorgestelde bedrag</span>
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
            Bij dit voorstel kijken we verder dan alleen het bod. U ziet ook de mogelijke overdrachtsdatum,
            welke afspraken gelden en welke kosten en voorbereidingen u mogelijk voorkomt ten opzichte van
            een regulier verkooptraject.
          </p>
        </div>
        <div className="summary-list">
          <div><strong>{offerAmount}</strong><span>voorgesteld bedrag</span></div>
          <div><strong>{transfer}</strong><span>overdracht / oplevering</span></div>
          {deposit ? <div><strong>{deposit}</strong><span>aanbetaling / voorschot</span></div> : null}
        </div>
      </section>

      {showDeliveryConstructie ? (
        <section className="card special-card">
          <span className="section-kicker">Hoofdafspraken</span>
          <h2>Levering en verkooproute</h2>
          <div className="construct-grid">
            <div><strong>Type voorstel</strong><span>{proposalType}</span></div>
            <div><strong>Passeertermijn</strong><span>{value(proposal.delivery_term_text, transfer)}</span></div>
            {hasText(proposal.desired_transfer_date) ? <div><strong>Gewenste leverdatum</strong><span>{formatDate(proposal.desired_transfer_date)}</span></div> : null}
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
          <p className="bridge-copy"><strong>Gevolg voor het voorstel:</strong> Dit voorstel is gebaseerd op deze wijze van levering. Indien het object niet overeenkomstig deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan koper het voorstel herbeoordelen, aanpassen of laten vervallen.</p>
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
          <span>Uw online reactie is geen koopovereenkomst. Definitieve afspraken worden eerst schriftelijk uitgewerkt.</span>
        </article>
      </section>

      <section className="card">
        <span className="section-kicker">{terms.gegevens}</span>
        <h2>{terms.uitgangspunt}</h2>
        <div className="facts">
          <div><strong>{terms.addressLabel}</strong><span>{address}</span></div>
          <div><strong>{terms.typeLabel}</strong><span>{value(proposal.property_type, "Nog te controleren")}</span></div>
          <div><strong>{terms.areaLabel}</strong><span>{areaValue(proposal.living_area_text, "Nog te controleren")}</span></div>
          <div><strong>Perceel</strong><span>{areaValue(proposal.plot_area_text, "Nog te controleren")}</span></div>
          <div><strong>Bouwjaar</strong><span>{value(proposal.build_year_text, "Nog te controleren")}</span></div>
          <div><strong>Huidige situatie</strong><span>{value(proposal.current_situation, "Op basis van uw aanvraag te beoordelen")}</span></div>
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Waarom deze route</span>
        <h2>Wat u met deze verkooproute wint</h2>
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
            <p>U heeft één aanspreekpunt en de overdracht en betaling lopen via de notaris.</p>
          </article>
          <article>
            <strong>Passend bij de situatie</strong>
            <p>Ook geschikt als snelheid, privacy, onderhoud of een bijzondere situatie meespeelt.</p>
          </article>
        </div>
        <h3 className="included-heading">Dit is bij het voorstel inbegrepen</h3>
        <div className="checks">
          {included.map((item) => <div key={item}><span>✓</span>{item}</div>)}
        </div>
      </section>

      <section className="card">
        <span className="section-kicker">Financieel overzicht</span>
        <h2>Netto-opbrengst in perspectief</h2>
        <p className="intro">
          {terms.verkoopText} is de verkoopprijs niet hetzelfde als wat u overhoudt. Dit overzicht laat zien
          welke kosten zijn meegerekend en welk bedrag naar verwachting resteert.
        </p>
        <p className="bridge-copy"><strong>Belangrijk:</strong> {COMPARISON_BASIS_NOTE}</p>
        {showUseRental ? (
          <p className="bridge-copy"><strong>Uitgangspunt vergelijking:</strong> Deze financiële vergelijking is gebaseerd op de genoemde wijze van levering. Als het object toch geheel of gedeeltelijk verhuurd of in gebruik wordt geleverd, kan dit invloed hebben op waarde, voorwaarden en haalbaarheid van het voorstel.</p>
        ) : null}
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
        <p className="bridge-copy">{COST_VAT_NOTE}</p>
        {comparisonNote ? <p className="comparison-note">{comparisonNote}</p> : null}
        <div className="assurance-notice">
          <strong>{NO_BUYER_CONDITIONS_NOTICE_TITLE}</strong>
          <p>{NO_BUYER_CONDITIONS_NOTICE_TEXT}</p>
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
          {additionalSellerWorkCondition(proposal.seller_work_conditions_text) ? <p className="bridge-copy">{additionalSellerWorkCondition(proposal.seller_work_conditions_text)}</p> : null}
        </section>
      ) : null}

      {isAdminPreview && sellerWorkInvalid ? (
        <section className="admin-preview-warning">
          <strong>Admincontrole: werkzaamheden zijn niet zichtbaar voor de klant</strong>
          <span>De basiskoopprijs, werkzaamheden, uitvoeringsdatum of totaalprijs ontbreken of sluiten niet aan op het voorgestelde bedrag. Corrigeer dit vóór verzending.</span>
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

      {isAdminPreview && resalePaymentInvalid ? (
        <section className="admin-preview-warning">
          <strong>Admincontrole: de doorverkoopregeling is niet zichtbaar voor de klant</strong>
          <span>Vul het drempelbedrag, percentage en de periode volledig in voordat u het voorstel verzendt.</span>
        </section>
      ) : null}

      <section className="two-columns">
        <section className="card">
          <span className="section-kicker">Uitgangspunten</span>
          <h2>Waar dit voorstel op is gebaseerd</h2>
          <p>{assumptions}</p>
        </section>

        <section className="card">
          <span className="section-kicker">Voorwaarden</span>
          <h2>Wat nog wordt uitgewerkt</h2>
          <p>{conditions}</p>
        </section>
      </section>

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

      <ProposalActions token={token} amountText={offerAmount} isActive={actionActive} previewMode={isAdminPreview} validityText={validityStatusText(validityDays)} />

      <section className="signature">
        <div>
          <span className="section-kicker">Contact</span>
          <h2>Heeft u nog een vraag?</h2>
          <p>
            Wij lichten het voorstel graag persoonlijk toe en bespreken samen of deze verkooproute
            aansluit bij uw situatie en planning.
          </p>
        </div>
        <div className="contact-block">
          <strong>Vastgoed Direct Nederland</strong>
          <span>06 12 23 80 51</span>
          <span>info@vastgoeddirectnederland.nl</span>
          <span>vastgoeddirectnederland.nl</span>

          <div className="contact-actions">
            <a href="#voorstel-actie">Ik wil verder</a>
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

function PrintProposal({ proposal }) {
  // De printpagina accepteert bewust geen bedragtekst met niet-numerieke
  // tekens ernaast (zie amount() in proposalFormat.js), vandaar `strict`.
  const amt = (rawValue, fallback) => amount(rawValue, fallback, { strict: true });

  const terms = objectTerms(proposal, "print");

  const included = ensureIncludedAssurance(lines(proposal.included_items, [
    "Heldere communicatie",
    "Geen makelaarskosten",
    "Geen openbare bezichtigingen nodig",
    "Notariële afwikkeling",
    "Verkoopoplossing op maat",
    "Vrijblijvend voorstel",
  ]));

  const assumptions = objectAwareText(value(
    proposal.assumptions_text,
    "Dit voorstel is gebaseerd op de door u verstrekte gegevens, openbare woninginformatie en de huidige bekende staat van de woning. Eventuele afwijkingen, bijzondere juridische situaties, verborgen gebreken of aanvullende kosten kunnen invloed hebben op de definitieve afspraken."
  ), proposal);

  const conditions = objectAwareText(value(
    proposal.conditions_text,
    "Het voorstel is vrijblijvend en onder voorbehoud van definitieve controle, akkoord van betrokken partijen en schriftelijke vastlegging."
  ), proposal);

  const reservations = lines(proposal.reservations_text, [
    "Controle woninggegevens",
    "Controle eigendomssituatie",
    "Controle beschikbare documenten",
    "Notariële toetsing",
    "Akkoord op voorwaarden",
    "Geen bijzondere belemmeringen",
  ]).map((item) => objectAwareText(item, proposal));

  const nextSteps = lines(proposal.next_steps_text, [
    "U beoordeelt het voorstel rustig.",
    "Wij bespreken vragen, bijzonderheden en eventuele voorwaarden.",
    "Als u verder wilt, werken wij de afspraken uit in een koopovereenkomst.",
    "Na ondertekening wordt de notariële afwikkeling opgestart.",
    "De overdracht en betaling vinden plaats via de notaris.",
  ]).map((item) => objectAwareText(item, proposal));

  const proposalType = value(proposal.proposal_type, proposal.proposal_variant || "Standaard aankoop");
  const specialProposal = isSpecialProposalType(proposalType);
  const checks = constructieChecks(proposal, { sameStateText: "Woning blijft tot levering in huidige staat" }).map((item) => objectAwareText(item, proposal));
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
  const showSellerWork = isSellerWorkComplete(proposal);
  const showResalePayment = Boolean(
    proposal.resale_payment_enabled &&
    parseMoney(proposal.resale_threshold_text) &&
    parseMoney(proposal.resale_percentage_text) &&
    Number(proposal.resale_period_months || 0) > 0
  );
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
  const nonbindingText = withNoBuyerConditionsText(proposal.nonbinding_text);
  const validityDays = daysUntil(proposal.validity_date);
  const validityText = validityStatusText(validityDays);

  return (
    <main className="print-root">
      <style>{printStyles}</style>
      <div className="print-actions">
        <PrintButton />
      </div>

      <article className="page cover">
        <div className="cover-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
        </div>

        <div className="mobile-curve" aria-hidden="true" />

        <div className="cover-content">
          <span className="eyebrow">Vrijblijvend voorstel</span>
          <h1>Vrijblijvend verkoopvoorstel</h1>
          <p>{terms.intro}</p>
          <div className="cover-card">
            <strong>{formatAddress(proposal)}</strong>
            <span>{amt(proposal.amount_text, "In overleg")}</span>
          </div>
        </div>

        <div className="cover-footer">
          <span>www.vastgoeddirectnederland.nl</span>
          <span>06 12 23 80 51</span>
        </div>
      </article>

      <article className="page">
        <header className="doc-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Persoonlijk verkoopvoorstel</strong>
            <span>Voorstelnummer: {proposalNumber(proposal)}</span>
            <span>Datum: {formatDate(proposal.created_at)}</span>
            <span>Geldig tot: {formatDate(proposal.validity_date)}{validityText ? ` · ${validityText}` : ""}</span>
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
              <strong>{amt(proposal.amount_text, "In overleg")}</strong>
            </div>
            <div className="facts">
              <div><span>Overdrachtsdatum / oplevering</span><strong>{value(proposal.transfer_date_text, "In overleg")}</strong></div>
              <div><span>Geldigheid voorstel</span><strong>{formatDate(proposal.validity_date)}</strong></div>
              {hasMeaningfulDeposit(proposal.deposit_text) ? <div><span>Aanbetaling / voorschot</span><strong>{amt(proposal.deposit_text, "")}</strong></div> : null}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title navy"><span>2</span><strong>{terms.gegevens}</strong></div>
          <div className="table two">
            <div><strong>{terms.addressLabel}</strong><span>{formatAddress(proposal)}</span></div>
            <div><strong>Postcode / huisnummer</strong><span>{value([formatPostal(proposal.property_postcode), proposal.property_house_number].filter(Boolean).join(" "))}</span></div>
            <div><strong>{terms.typeLabel}</strong><span>{value(proposal.property_type)}</span></div>
            <div><strong>{terms.areaLabel}</strong><span>{areaValue(proposal.living_area_text, "-")}</span></div>
            <div><strong>Perceeloppervlakte</strong><span>{areaValue(proposal.plot_area_text, "-")}</span></div>
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
              <div><strong>Actuele huur</strong><span>{monthlyRentValue(proposal.current_rent_text)}</span></div>
              <div><strong>Waarborgsom</strong><span>{value(proposal.deposit_present, "Onbekend")}</span></div>
              <div><strong>Huurachterstand/geschil</strong><span>{value(proposal.rent_arrears_or_dispute, "Onbekend")}</span></div>
              <div><strong>Winkel-/bedrijfsruimte</strong><span>{areaValue(proposal.commercial_area_text, "-")}</span></div>
              <div><strong>Woonruimte</strong><span>{areaValue(proposal.residential_area_text, "-")}</span></div>
              <div><strong>Aparte entree bovenwoning</strong><span>{value(proposal.separate_entrance_status, "Onbekend")}</span></div>
              <div><strong>Zelfstandige woonruimte</strong><span>{value(proposal.independent_residence_status, "Onbekend")}</span></div>
              <div><strong>Bestemming/vergunningen</strong><span>{value(proposal.zoning_permits_checked, "Onbekend")}</span></div>
              <div><strong>Splitsingsmogelijkheid</strong><span>{value(proposal.split_potential_status, "Onbekend")}</span></div>
              <div><strong>Brandveiligheid/gebruiksvereisten</strong><span>{value(proposal.fire_safety_check_status, "Onbekend")}</span></div>
            </div>
            <p className="notice">Uitgangspunt van dit voorstel is dat het object bij juridische levering {String(value(proposal.delivery_occupancy_status, "vrij van huur en gebruik")).toLowerCase()} wordt geleverd, tenzij schriftelijk anders overeengekomen.</p>
            <p className="notice">Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming, vergunningen, brandveiligheid en eventuele splitsingsmogelijkheden vóór definitieve vastlegging gecontroleerd.</p>
            <p className="notice"><strong>Gevolg voor het voorstel:</strong> Dit voorstel is gebaseerd op deze wijze van levering. Indien het object niet overeenkomstig deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan koper het voorstel herbeoordelen, aanpassen of laten vervallen.</p>
            {cleanUseRentalNotes(proposal.use_rental_notes_text) ? <p className="notice">{cleanUseRentalNotes(proposal.use_rental_notes_text)}</p> : null}
          </section>
        ) : null}

        {showAdditionalAgreements ? (
          <section className="section">
            <div className="section-title navy"><span>{additionalAgreementsSectionNumber}</span><strong>Aanvullende afspraken</strong></div>

            {showSellerWork ? (
              <div className="agreement-print-block">
                <h2>Werkzaamheden door verkoper</h2>
                <div className="table two">
                  <div><strong>Basiskoopprijs</strong><span>{amt(proposal.seller_work_base_price_text, "In overleg")}</span></div>
                  <div><strong>Bedrag werkzaamheden</strong><span>{amt(proposal.seller_work_amount_text, "In overleg")}</span></div>
                  <div><strong>Totale koopprijs na uitvoering</strong><span>{amt(proposal.seller_work_total_price_text, "In overleg")}</span></div>
                  <div><strong>Uiterste uitvoeringsdatum</strong><span>{formatDate(proposal.seller_work_deadline)}</span></div>
                  {proposal.seller_work_description ? <div className="wide"><strong>Omschrijving werkzaamheden</strong><span>{proposal.seller_work_description}</span></div> : null}
                </div>
                <p className="notice">Verkoper zal vóór de juridische levering de in dit voorstel omschreven herstelwerkzaamheden uitvoeren. Wanneer deze werkzaamheden volledig en deugdelijk zijn uitgevoerd en door koper zijn goedgekeurd, wordt de basiskoopprijs verhoogd met {amt(proposal.seller_work_amount_text, "In overleg")}. De totale koopprijs bedraagt in dat geval {amt(proposal.seller_work_total_price_text, "In overleg")} kosten koper.</p>
                <p className="notice">Wanneer de werkzaamheden niet, niet volledig of niet deugdelijk zijn uitgevoerd, kan de aanvullende koopprijs worden verminderd met de redelijkerwijs benodigde kosten om de werkzaamheden alsnog te voltooien of te herstellen. Het bedrag voor de werkzaamheden wordt niet als losse betaling vóór levering weergegeven, maar als mogelijke verhoging van de koopsom bij de notariële levering.</p>
                {additionalSellerWorkCondition(proposal.seller_work_conditions_text) ? <p className="notice">{additionalSellerWorkCondition(proposal.seller_work_conditions_text)}</p> : null}
              </div>
            ) : null}

            {showResalePayment ? (
              <div className="agreement-print-block">
                <h2>Aanvullende betaling bij doorverkoop</h2>
                <div className="table two">
                  <div><strong>Drempelbedrag</strong><span>{amt(proposal.resale_threshold_text, "In overleg")}</span></div>
                  <div><strong>Percentage meeropbrengst</strong><span>{percent(proposal.resale_percentage_text)}</span></div>
                  <div><strong>Periode</strong><span>{months(proposal.resale_period_months)}</span></div>
                  <div><strong>Courtage aftrekken</strong><span>{proposal.resale_deduct_courtage ? "Ja, alleen latere doorverkoopcourtage" : "Nee"}</span></div>
                  {proposal.resale_cap_text ? <div><strong>Maximumbedrag</strong><span>{amt(proposal.resale_cap_text, "In overleg")}</span></div> : null}
                </div>
                <p className="notice">Indien {terms.lowerArticle} binnen {months(proposal.resale_period_months, "de afgesproken periode")} wordt doorverkocht tegen een netto doorverkoopprijs van meer dan {amt(proposal.resale_threshold_text, "In overleg")}, ontvangt verkoper een aanvullende betaling ter grootte van {percent(proposal.resale_percentage_text)} van het gedeelte van de netto doorverkoopprijs boven {amt(proposal.resale_threshold_text, "In overleg")}.</p>
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
        <section className="notice">
          <strong>Voorwaarden:</strong> {conditions}
        </section>
      </article>

      <article className="page">
        <header className="doc-header small">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Geldig tot: {formatDate(proposal.validity_date)}{validityText ? ` · ${validityText}` : ""}</span>
          </div>
        </header>

        <h1>Vergelijking en netto-opbrengst</h1>
        <p className="subtle">
          Gebruik dit overzicht om niet alleen het bod, maar vooral de netto-opbrengst en voorwaarden te vergelijken.
        </p>
        <p className="notice"><strong>Belangrijk:</strong> de traditionele verkoopprijs is een indicatieve vergelijkingswaarde. Kosten voor herstel of voorbereiding zijn alleen opgenomen als deze naar verwachting nodig zijn om die waarde te behalen.</p>
        {showUseRental ? (
          <p className="notice"><strong>Uitgangspunt vergelijking:</strong> Deze financiële vergelijking is gebaseerd op de genoemde wijze van levering. Als het object toch geheel of gedeeltelijk verhuurd of in gebruik wordt geleverd, kan dit invloed hebben op waarde, voorwaarden en haalbaarheid van het voorstel.</p>
        ) : null}
        <section className="notice assurance-print">
          <strong>{NO_BUYER_CONDITIONS_NOTICE_TITLE}:</strong> {NO_BUYER_CONDITIONS_NOTICE_TEXT}
        </section>
        <section className="notice action-print">
          <strong>Verdergaan of bespreken:</strong> Via de persoonlijke voorstelpagina kunt u aangeven dat u verder wilt of het voorstel eerst wilt bespreken. Een online reactie is nog geen koopovereenkomst; de definitieve afspraken worden daarna schriftelijk uitgewerkt.
        </section>

        <section className="section">
          <div className="section-title orange"><span>{netSectionNumber}</span><strong>Netto-opbrengst vergelijken</strong></div>
          <div className="comparison">
            <div className="head">Onderdeel</div>
            <div className="head">Traditionele verkoop</div>
            <div className="head orange-head">Vastgoed Direct Nederland</div>

            <div><strong>Bod / verkoopprijs</strong></div>
            <div>{amt(proposal.traditional_price_text, "-")}</div>
            <div>{amt(proposal.amount_text, "In overleg")}</div>

            <div><strong>Makelaarskosten incl. 21% btw</strong></div>
            <div>{costInclVatValue(proposal.agent_costs_text, "-")}</div>
            <div>€ 0</div>

            <div><strong>Afwikkelingskosten verkoper</strong></div>
            <div>{value(proposal.notary_costs_text, "-")}</div>
            <div>Door VDN overgenomen indien afgesproken</div>

            <div><strong>Herstel- of renovatiekosten</strong></div>
            <div>{value(proposal.renovation_costs_text, "-")}</div>
            <div>Niet noodzakelijk vooraf</div>

            <div><strong>Overige verkoopkosten incl. 21% btw</strong></div>
            <div>{costInclVatValue(proposal.other_costs_text, "-")}</div>
            <div>In overleg / niet standaard nodig</div>

            <div className="total"><strong>Verwachte netto-opbrengst</strong></div>
            <div className="total">{amt(proposal.traditional_net_text, "-")}</div>
            <div className="total accent">{amt(proposal.direct_net_text || proposal.amount_text, "In overleg")}</div>
          </div>
          <p className="footnote">{COST_VAT_NOTE}</p>
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
          {proposal.short_comparison_text ? <p className="notice">{objectAwareText(proposal.short_comparison_text, proposal)}</p> : null}
        </section>
      </article>

      <article className="page">
        <header className="doc-header small">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vastgoed Direct Nederland" />
          <div>
            <strong>Vrijblijvend voorstel</strong>
            <span>Geldig tot: {formatDate(proposal.validity_date)}{validityText ? ` · ${validityText}` : ""}</span>
          </div>
        </header>

        <h1>Controlepunten en vervolgstappen</h1>
        <p className="subtle">De exacte voorwaarden worden vooraf besproken en bij akkoord schriftelijk en notarieel vastgelegd.</p>

        <section className="section">
          <div className="section-title orange"><span>{reservationsSectionNumber}</span><strong>Controlepunten vóór definitieve vastlegging</strong></div>
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

        <section className="disclaimer">
          <strong>Voorbehoud en totstandkoming:</strong> {nonbindingText}
        </section>
      </article>
    </main>
  );
}

const publicStyles = `.proposal-actions{width:100%;margin:0 0 18px;background:#fff;border:1px solid #e6dfd5;border-radius:26px;padding:24px;display:grid;grid-template-columns:1fr 1.15fr;gap:24px;align-items:center;box-shadow:0 18px 50px rgba(7,31,58,.09);scroll-margin-top:24px}.proposal-actions h2{margin:5px 0 8px}.proposal-actions p{margin:0;color:#617184;line-height:1.55}.proposal-actions-kicker{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#b85216}.proposal-action-buttons{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.proposal-action-buttons button,.proposal-action-buttons a{border:0;border-radius:999px;padding:13px 17px;font:inherit;font-weight:900;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}.proposal-action-buttons button:disabled{cursor:not-allowed;opacity:.7}.proposal-primary{background:#d96a1c;color:#fff;box-shadow:0 14px 30px rgba(217,106,28,.22)}.proposal-secondary,.proposal-action-buttons a{background:#f4f1eb;color:#071f3a}.proposal-action-note{font-size:13px!important;color:#617184!important;margin-top:10px!important}.proposal-action-preview-note{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:16px;padding:10px 12px;font-weight:800;font-size:13px}.proposal-action-success{width:100%;margin:0 0 18px;background:#eff8f2;border:1px solid #b9dec5;border-radius:22px;padding:18px 22px;display:grid;gap:4px}.proposal-action-success span{color:#446553}.proposal-action-inactive{background:#fff5f1;border-color:#ffd5c4}.proposal-action-inactive span{color:#7c2d20}.proposal-action-error{color:#9a3412!important;width:100%;text-align:right}.offer-panel i.validity-pill{display:inline-flex;font-style:normal;font-size:12px;margin-top:8px;color:#9a4b12;background:#fff1e6;border:1px solid #f2b885;border-radius:999px;padding:5px 9px;font-weight:900}.offer-panel i.validity-pill.is-urgent{background:#fff7ed;color:#b45309;border-color:#fdba74}.offer-panel i.validity-pill.is-expired{background:#fee2e2;color:#991b1b;border-color:#fecaca}.decision-inline{display:grid;grid-template-columns:1fr auto;gap:8px 16px;align-items:center;background:#fff7ed;border:1px solid #fed7aa;border-radius:20px;padding:17px 18px;margin:14px 0 0}.decision-inline strong{font-size:20px;color:#071f3a}.decision-inline span{color:#5f7083;line-height:1.5}.decision-inline a{grid-row:1 / span 2;grid-column:2;background:#d96a1c;color:#fff;text-decoration:none;font-weight:900;border-radius:999px;padding:12px 16px;white-space:nowrap}@media(max-width:760px){.proposal-actions{grid-template-columns:1fr}.proposal-action-buttons{justify-content:stretch}.proposal-action-buttons>*{width:100%;text-align:center}.decision-inline{grid-template-columns:1fr}.decision-inline a{grid-row:auto;grid-column:auto;text-align:center}}

*{box-sizing:border-box}
:root{--navy:#071f3a;--navy2:#0d2d52;--orange:#D96A1C;--cream:#f5f2ec;--card:#fffdf9;--line:#e8e3db;--muted:#5f7083;--soft:#FFF1E6;--shadow:0 22px 70px rgba(7,31,58,.12)}
body{margin:0;background:radial-gradient(circle at 82% 0,#FFF1E6 0,transparent 34%),linear-gradient(180deg,#f7f3ec 0,#f1ede6 100%);color:var(--navy);font-family:Arial,Helvetica,sans-serif}
.proposal-page{max-width:1080px;margin:0 auto;padding:26px}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px}
.topbar img{width:235px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:10px;box-shadow:0 12px 36px rgba(7,31,58,.08)}
.top-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
.top-actions span{font-size:13px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
.top-response-link{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);background:#fff;color:var(--navy);border-radius:999px;padding:12px 16px;font-weight:900;text-decoration:none}
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
.summary-list{display:grid;gap:10px;align-self:stretch}
.summary-list div{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px}
.summary-list strong,.summary-list span{display:block}
.summary-list strong{font-size:24px;color:var(--navy)}
.summary-list span{color:var(--muted);margin-top:5px}
.special-card{background:linear-gradient(135deg,#fffdf9 0,#F7F2EC 100%)}.construct-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.construct-grid div{background:#fff;border:1px solid var(--line);border-radius:20px;padding:16px}.construct-grid strong,.construct-grid span{display:block}.construct-grid strong{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.construct-grid span{margin-top:6px;color:var(--navy);font-weight:800;line-height:1.35}.mini-checks{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px}.mini-checks div{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px;font-weight:800;line-height:1.4}.mini-checks span{color:var(--orange);font-weight:900}.bridge-copy{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0 0}.assurance-notice{background:linear-gradient(135deg,#071f3a 0,#0b2f56 100%);color:#fff;border-radius:20px;padding:18px 20px;margin:14px 0 0;box-shadow:0 16px 34px rgba(7,31,58,.16)}.assurance-notice strong{display:block;font-size:20px;letter-spacing:-.02em}.assurance-notice p{margin:8px 0 0;color:#d9e6f5;font-size:15.5px;line-height:1.55}
.admin-preview-warning{background:#fff5f1;border:2px solid #ef9a78;color:#7c2d20;border-radius:22px;padding:18px 20px;margin-bottom:18px;display:grid;gap:5px}.admin-preview-warning strong{font-size:17px}.admin-preview-warning span{line-height:1.5}.comparison-note{background:#fffaf4;border:1px solid #f2b885;border-radius:18px;padding:16px;margin:12px 0 0;color:#415168}.included-heading{font-size:22px;margin:26px 0 14px;color:var(--navy)}
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
@media(max-width:640px){.proposal-page{padding:12px}.topbar{display:grid}.top-actions{justify-content:stretch}.top-actions span{display:none}.topbar img{width:215px}.topbar button,.top-response-link{width:100%}.cover,.executive-summary,.card,.signature,.disclaimer{border-radius:24px;padding:20px}.cover h1{font-size:39px}.cover p{font-size:16px}.offer-panel strong{font-size:36px}.benefits,.facts{grid-template-columns:1fr}.facts div{border-right:0!important}.timeline-step{grid-template-columns:54px 1fr}.section-kicker{font-size:11px}h2{font-size:28px}.mobile-compare-card h3{font-size:17px;padding:13px 14px}.mobile-compare-values div{padding:12px 13px}.mobile-compare-values strong{font-size:16px}.mobile-compare-card.total strong{font-size:18px}}
@media(max-width:420px){.mobile-compare-values{grid-template-columns:1fr}.mobile-compare-values div:first-child{border-right:0;border-bottom:1px solid var(--line)}.mobile-compare-values div{padding:12px 14px}.mobile-compare-values span{font-size:10.5px}.mobile-compare-values strong{font-size:17px}.mobile-compare-card.total strong{font-size:19px}}
@media print{body{background:#fff}.proposal-page{max-width:none;padding:0}.topbar button,.top-actions span,.top-response-link{display:none}.topbar img{box-shadow:none}.cover,.executive-summary,.card,.signature,.disclaimer{box-shadow:none;page-break-inside:avoid;border-radius:18px}.cover{background:#071f3a!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.offer-panel{box-shadow:none}.comparison .head,.timeline-step strong,.contact-block{background:#071f3a!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.comparison .orange{background:#D96A1C!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

const printStyles = `
*{box-sizing:border-box}body{margin:0;background:#f5f2ec;color:#071f3a;font-family:Arial,Helvetica,sans-serif}.print-root{padding:24px}.print-actions{width:min(980px,100%);margin:0 auto 18px;text-align:right}.print-actions button{border:0;background:#D96A1C;color:#fff;border-radius:999px;padding:14px 22px;font-weight:900;cursor:pointer;box-shadow:0 12px 28px rgba(217,106,28,.20)}.page{width:min(980px,100%);min-height:1320px;margin:0 auto 24px;background:#fffdf9;border:1px solid #e8e3db;padding:44px;box-shadow:0 22px 70px rgba(7,31,58,.12);position:relative;overflow:hidden}.cover{display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 78% 62%,rgba(217,106,28,.14),transparent 28%),linear-gradient(135deg,#fffdf9 0%,#fff 54%,#f5f9ff 100%)}.cover:after{content:"";position:absolute;right:-260px;bottom:-260px;width:700px;height:700px;border-radius:50%;background:#071f3a;box-shadow:-26px -26px 0 #D96A1C;z-index:0}.mobile-curve{display:none}.cover-logo,.cover-content,.cover-footer{position:relative;z-index:1}.cover-logo{text-align:center}.cover-logo img{width:260px;height:auto}.eyebrow{display:inline-block;margin-top:80px;background:#FFF1E6;border:1px solid #F2B885;color:#B85216;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.cover h1{font-size:76px;line-height:.95;margin:22px 0;letter-spacing:-.06em;max-width:720px}.cover p{font-size:24px;line-height:1.35;color:#415168;max-width:520px}.cover-card{margin-top:36px;background:#fff;border:1px solid #e8e3db;border-radius:28px;padding:22px;width:min(520px,100%);box-shadow:0 18px 50px rgba(7,31,58,.12)}.cover-card strong,.cover-card span{display:block}.cover-card strong{font-size:21px;text-transform:uppercase}.cover-card span{margin-top:6px;font-size:32px;color:#D96A1C;font-weight:900}.cover-footer{display:flex;gap:26px;font-weight:900}.doc-header{display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #e8e3db;padding-bottom:22px;margin-bottom:32px}.doc-header img{width:210px;background:#fff;border-radius:16px;padding:8px}.doc-header div{text-align:right}.doc-header strong{display:block;color:#D96A1C;font-size:19px}.doc-header span{display:block;color:#536273;margin-top:4px}.doc-header.small{padding-bottom:14px;margin-bottom:28px}.doc-header.small img{width:170px}h1{font-size:44px;line-height:1.06;letter-spacing:-.04em;margin:0 0 12px}.lead,.subtle,p,li{font-size:17px;line-height:1.55;color:#536273}.subtle{margin-top:0}.section{margin-top:28px}.section-title{display:grid;grid-template-columns:80px 1fr;align-items:center;color:#fff;text-transform:uppercase;font-weight:900;letter-spacing:.02em}.section-title span{text-align:center;padding:12px}.section-title strong{padding:12px;text-align:center}.section-title.orange{background:#D96A1C}.section-title.navy{background:#071f3a}.offer-grid{display:grid;grid-template-columns:.9fr 1.4fr;border:1px solid #e8e3db;border-top:0}.offer-amount{background:#FFF1E6;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center}.offer-amount span{font-weight:900}.offer-amount strong{font-size:44px;color:#D96A1C;margin-top:10px}.facts div,.table div{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e8e3db}.facts div:last-child{border-bottom:0}.facts span,.facts strong,.table strong,.table span{padding:14px}.facts span,.table strong{font-weight:900}.facts strong,.table span{color:#536273}.table{border:1px solid #e8e3db;border-top:0}.table .wide{grid-column:1/-1}.checks{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #e8e3db;border-top:0}.checks.compact-checks{grid-template-columns:repeat(2,1fr);margin-top:0}.checks div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;font-weight:900}.checks div:nth-child(3n){border-right:0}.notice{background:#F7F2EC;border:1px solid #F2B885;border-radius:0;padding:14px 16px;color:#415168;line-height:1.55}.assurance-print{background:#071f3a;color:#fff;border-color:#071f3a}.assurance-print strong{color:#fff}.assurance-print{line-height:1.55}.comparison{display:grid;grid-template-columns:1.15fr 1fr 1.15fr;border:1px solid #e8e3db;border-top:0}.comparison>div{padding:14px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db;color:#536273}.comparison .head{background:#071f3a;color:#fff;text-align:center;font-weight:900}.comparison .orange-head{background:#D96A1C}.comparison .total{background:#F7F2EC;font-weight:900;color:#071f3a}.comparison .accent{color:#D96A1C;font-size:20px}.footnote{font-size:13px;margin:8px 0 0}.mini-table{border:1px solid #e8e3db;border-top:0}.mini-table div{display:grid;grid-template-columns:1fr 1fr 1.2fr;border-bottom:1px solid #e8e3db}.mini-table div:last-child{border-bottom:0}.mini-table strong,.mini-table span,.mini-table em{padding:14px;font-style:normal}.mini-table strong{font-weight:900}.mini-table span{color:#536273}.mini-table em{color:#071f3a;font-weight:900}.reservations{display:grid;grid-template-columns:1fr 1fr;border:1px solid #e8e3db;border-top:0}.reservations div{padding:16px;border-right:1px solid #e8e3db;border-bottom:1px solid #e8e3db}.reservations div:nth-child(2n){border-right:0}.steps{counter-reset:step;list-style:none;margin:0;border:1px solid #e8e3db;border-top:0;padding:0}.steps li{position:relative;color:#071f3a;font-weight:900;padding:18px 18px 18px 74px;border-bottom:1px solid #e8e3db}.steps li:last-child{border-bottom:0}.steps li:before{counter-increment:step;content:counter(step);position:absolute;left:24px;color:#D96A1C;font-size:22px}.contact-grid{display:grid;grid-template-columns:1fr 1.55fr;border:1px solid #e8e3db;border-top:0}.contact-grid>div{padding:18px;border-right:1px solid #e8e3db}.contact-grid>div:last-child{border-right:0}.contact-grid span{display:block;color:#536273;margin-top:6px}.agreement-print-block{border:1px solid #e8e3db;border-top:0;padding:18px}.agreement-print-block h2{font-size:25px;margin:0 0 12px}.agreement-print-block+.agreement-print-block{border-top:1px solid #e8e3db;margin-top:18px}.disclaimer{margin-top:28px;background:#F7F2EC;border:1px solid #F2B885;padding:16px;color:#415168;line-height:1.55}@media print{body{background:#fff}.print-root{padding:0}.print-actions{display:none}.page{width:100%;min-height:0;height:auto;margin:0;box-shadow:none;border:0;page-break-after:always;padding:28px}.page:last-child{page-break-after:auto}.cover{min-height:100vh}.cover h1{font-size:64px}.cover:after{display:block;opacity:.96}}@media(max-width:760px){body{background:#f5f2ec}.print-root{padding:10px}.print-actions{text-align:center;margin-bottom:10px}.print-actions button{width:100%;padding:12px 15px}.page{width:100%;min-height:auto;margin:0 auto 14px;padding:20px;border-radius:20px;box-shadow:0 12px 38px rgba(7,31,58,.10);overflow:hidden}.cover{min-height:auto;display:block;background:#fffdf9;padding:0}.cover:after{display:none}.mobile-curve{display:block;height:82px;margin:14px -20px 0;background:linear-gradient(135deg,#D96A1C 0 40%,#071f3a 41% 100%);border-radius:0 0 24px 24px}.cover-logo{padding:20px 16px 4px}.cover-logo img{width:min(250px,72vw)}.cover-content{padding:20px}.eyebrow{margin-top:0;font-size:10px;padding:7px 10px;letter-spacing:.07em}.cover h1{font-size:36px;line-height:1.01;letter-spacing:-.055em;margin:14px 0 10px;color:#071f3a;max-width:100%}.cover p{font-size:16px;line-height:1.4;color:#536273;max-width:100%;margin:0}.cover-card{margin-top:18px;border-radius:20px;padding:16px;width:100%;box-shadow:0 10px 28px rgba(7,31,58,.11)}.cover-card strong{font-size:17px}.cover-card span{font-size:32px}.cover-footer{padding:0 20px 22px;display:grid;gap:3px;font-size:13px}.doc-header{display:grid;gap:12px}.doc-header img{width:180px}.doc-header div{text-align:left}h1{font-size:34px}.offer-grid,.checks,.comparison,.mini-table div,.reservations,.contact-grid{grid-template-columns:1fr}.section-title{grid-template-columns:54px 1fr}.comparison .head{text-align:left}.comparison>div{border-right:0}.facts div,.table div{grid-template-columns:1fr}.offer-amount strong{font-size:36px}.checks div,.reservations div{border-right:0}.mini-table strong,.mini-table span,.mini-table em{padding:10px 12px}.steps li{padding-left:56px}.lead,.subtle,p,li{font-size:16px}}
`;
