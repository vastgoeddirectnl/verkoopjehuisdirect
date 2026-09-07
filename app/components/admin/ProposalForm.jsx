"use client";

// Het grootste blok van de lead-detailpagina (ARCH-05): het formulier om een
// nieuw verkoopvoorstel samen te stellen (secties 1 t/m 8, validatie/advies
// en de actieknoppen).

import {
  PROPOSAL_TYPES,
  OBJECT_USAGE_TYPES,
  OCCUPANCY_STATUSES,
  DELIVERY_OCCUPANCY_STATUSES,
  YES_NO_UNKNOWN,
  TENANT_COOPERATION_STATUSES,
  parseMoney,
  formatMoney,
} from "../../lib/admin/leadDetail";
import { Field, SelectField } from "./LeadDetailFields";

export default function ProposalForm({
  proposal,
  setProposalField,
  latestProposal,
  saving,
  netComparison,
  sellerWorkTotal,
  resaleExample,
  proposalIssues,
  proposalWarnings,
  specialProposalType,
  onProposalTypeChange,
  onCreateProposal,
  onResetProposal,
}) {
  return (
    <section className="card proposal-card" id="voorstel-maken">
      <div className="section-head">
        <div>
          <span>Premium voorstel</span>
          <h2>Uitgebreid verkoopvoorstel maken</h2>
          <p>Maak een voorstel met voorblad, woning- of objectgegevens, uitgangspunten, netto-opbrengstvergelijking, voorwaarden en vervolgstappen.</p>
        </div>
        {latestProposal ? <a className="secondary-link" href={`/admin/voorstellen/${latestProposal.id}`}>Laatste voorstel beheren</a> : null}
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
              <Field label="Aanbetaling / voorschot (alleen indien afgesproken)"><input placeholder="Leeg laten als dit niet van toepassing is" value={proposal.deposit_text} onChange={(e) => setProposalField("deposit_text", e.target.value)} /></Field>
            </div>
          </div>

          <div className="form-section">
            <h3>2. Woning-/objectgegevens</h3>
            <div className="form-grid">
              <Field label="Adres / woning of object"><input value={proposal.property_address} onChange={(e) => setProposalField("property_address", e.target.value)} /></Field>
              <Field label="Postcode"><input value={proposal.property_postcode} onChange={(e) => setProposalField("property_postcode", e.target.value.toUpperCase())} /></Field>
              <Field label="Huisnummer"><input value={proposal.property_house_number} onChange={(e) => setProposalField("property_house_number", e.target.value)} /></Field>
              <Field label="Type woning/object"><input value={proposal.property_type} onChange={(e) => setProposalField("property_type", e.target.value)} /></Field>
              <Field label="Woonoppervlakte"><input placeholder="Bijv. 178 m²" value={proposal.living_area_text} onChange={(e) => setProposalField("living_area_text", e.target.value)} /></Field>
              <Field label="Perceeloppervlakte"><input placeholder="Bijv. 970 m²" value={proposal.plot_area_text} onChange={(e) => setProposalField("plot_area_text", e.target.value)} /></Field>
              <Field label="Bouwjaar"><input value={proposal.build_year_text} onChange={(e) => setProposalField("build_year_text", e.target.value)} /></Field>
              <Field label="Huidige situatie"><input value={proposal.current_situation} onChange={(e) => setProposalField("current_situation", e.target.value)} /></Field>
            </div>
          </div>

          <div className="form-section">
            <h3>3. Netto-opbrengstvergelijking</h3>
            <p className="calc-help">De traditionele verkoopprijs is een indicatieve vergelijkingswaarde. Kies één uitgangspunt: verkoop in huidige staat, of verkoop na noodzakelijke voorbereiding.</p>
            <ul className="calc-help-list">
              <li><strong>Herstel-/renovatiekosten</strong> alleen invullen als die nodig zijn om de genoemde verkoopprijs te halen. Gaat de prijs al uit van de huidige staat, zet dit dan op € 0 — anders telt het dubbel.</li>
              <li><strong>Makelaarskosten en overige verkoopkosten</strong> exclusief btw invullen; 21% wordt automatisch bijgeteld.</li>
              <li><strong>Afwikkelingskosten</strong> alleen als het vooraf afgesproken kosten aan verkoperszijde zijn, zoals volmacht of doorhaling van een hypotheekinschrijving. Kosten die bij kosten koper voor de koper zijn horen hier niet.</li>
              <li><strong>Verhuurde, leeg te leveren of gemengde objecten:</strong> de vergelijkingswaarde mag rendementsmatig worden benaderd, op basis van huurwaarde, leegstand, verhuurrisico en kosten.</li>
            </ul>
            <div className="form-grid">
              <Field label="Traditionele verkoopprijs"><input inputMode="decimal" placeholder="Bijv. € 240.000" value={proposal.traditional_price_text} onChange={(e) => setProposalField("traditional_price_text", e.target.value)} /></Field>
              <Field label="Makelaarskosten excl. btw"><input inputMode="decimal" placeholder="Bijv. € 3.600" value={proposal.agent_costs_text} onChange={(e) => setProposalField("agent_costs_text", e.target.value)} /></Field>
              <Field label="Afwikkelingskosten verkoper"><input inputMode="decimal" placeholder="Bijv. € 750" value={proposal.notary_costs_text} onChange={(e) => setProposalField("notary_costs_text", e.target.value)} /></Field>
              <Field label="Herstel-/renovatiekosten"><input inputMode="decimal" placeholder="Bijv. € 45.000" value={proposal.renovation_costs_text} onChange={(e) => setProposalField("renovation_costs_text", e.target.value)} /></Field>
              <Field label="Overige verkoopkosten excl. btw"><input inputMode="decimal" placeholder="Bijv. € 950" value={proposal.other_costs_text} onChange={(e) => setProposalField("other_costs_text", e.target.value)} /></Field>
              <Field label="Netto Vastgoed Direct"><input inputMode="decimal" placeholder="Automatisch uit voorgesteld bedrag" value={proposal.direct_net_text} onChange={(e) => setProposalField("direct_net_text", e.target.value)} /></Field>
            </div>

            <p className="calc-help small">In de klantversie staat dat VDN de afwikkelingskosten overneemt, als dat zo is afgesproken.</p>

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
                <select value={proposal.proposal_type || "Standaard aankoop"} onChange={(e) => onProposalTypeChange(e.target.value)}>
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
                  <p>Uitgangspunt van dit voorstel is dat het object bij juridische levering {String(proposal.delivery_occupancy_status || "vrij van huur en gebruik").toLowerCase()} wordt geleverd, tenzij schriftelijk anders overeengekomen.</p>
                  <p><strong>Gevolg voor het voorstel:</strong> Dit voorstel is gebaseerd op deze wijze van levering. Indien het object niet overeenkomstig deze uitgangspunten kan worden geleverd, bijvoorbeeld doordat huur of gebruik toch blijft bestaan, kan koper het voorstel herbeoordelen, aanpassen of laten vervallen.</p>
                  <p>Bij verhuur of gemengd gebruik worden huur, gebruik, ontruiming, bestemming, vergunningen, brandveiligheid en eventuele splitsingsmogelijkheden vóór definitieve vastlegging gecontroleerd.</p>
                  <small>De financiële vergelijking blijft apart staan, maar wordt gelezen vanuit dit leveringsuitgangspunt.</small>
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
            <Field label="Controlepunten — één regel per punt">
              <textarea value={proposal.reservations_text} onChange={(e) => setProposalField("reservations_text", e.target.value)} />
            </Field>
            <Field label="Vervolgstappen — één regel per stap">
              <textarea value={proposal.next_steps_text} onChange={(e) => setProposalField("next_steps_text", e.target.value)} />
            </Field>
            <Field label="Interne notities — niet zichtbaar voor de klant">
              <textarea value={proposal.notes} onChange={(e) => setProposalField("notes", e.target.value)} />
            </Field>
          </div>

          {proposalIssues.length ? (
            <div className="proposal-validation" role="alert">
              <strong>Nog controleren voordat u het voorstel maakt</strong>
              <ul>{proposalIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
            </div>
          ) : (
            <div className="proposal-validation ready"><strong>Voorstel is inhoudelijk gereed om aan te maken.</strong></div>
          )}

          {proposalWarnings.length ? (
            <div className="proposal-review">
              <strong>Advies voor een overtuigender voorstel</strong>
              <ul>{proposalWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
            </div>
          ) : null}

          <div className="proposal-actions">
            <button disabled={saving || proposalIssues.length > 0} onClick={onCreateProposal}>Voorstel maken en openen</button>
            <button type="button" className="ghost" onClick={onResetProposal}>Velden herstellen</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
