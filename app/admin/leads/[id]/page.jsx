"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { isValidEmail } from "../../../lib/admin/validators";
import LeadTimeline from "../../../components/admin/LeadTimeline";
import LeadHeader from "../../../components/admin/LeadHeader";
import LeadContactForm from "../../../components/admin/LeadContactForm";
import ProposalForm from "../../../components/admin/ProposalForm";
import TaskPanel, { NewTaskCard } from "../../../components/admin/TaskPanel";
import MailHistory from "../../../components/admin/MailHistory";
import {
  isSpecialProposalType,
  fmt,
  proposalViewedAfterEmail,
  proposalPublicUrlFromToken,
  proposalWhatsappUrl,
  sameEmail,
  isCustomerActionHandled,
  latestCustomerProposalAction,
  parseMoney,
  applyAdditionalAgreementDefaults,
  calculateSellerWorkTotal,
  calculateResaleExample,
  normalizeProposalForForm,
  calculateNetComparison,
  buildCalculatedProposalPayload,
  defaultProposalForLead,
  defaultPropertyAddress,
  addressSuggestionFromLookup,
  formatPercent,
} from "../../../lib/admin/leadDetail";
import { WHATSAPP_NOTICES, WHATSAPP_SENT, prepareWhatsapp } from "../../../lib/admin/whatsapp.js";
import { proposalReviewWarnings, proposalValidationIssues } from "../../../lib/proposalValidation";
import { Field } from "../../../components/admin/LeadDetailFields";

function ProposalWhatsAppFollowUp({ item, lead, saving, onPrepared, onSent }) {
  const publicUrl = proposalPublicUrlFromToken(item?.public_token || item?.mail_message);
  const phone = lead?.telefoon || item?.lead_telefoon || "";
  const url = proposalWhatsappUrl({
    phone,
    name: lead?.naam || item?.lead_naam || "",
    publicUrl,
  });
  const showBox = Boolean(item?.emailed_at || item?.status === "Verzonden" || item?.status === "Bekeken" || publicUrl);

  if (!showBox) return null;

  return (
    <div className="proposal-whatsapp-box">
      <div>
        <strong>WhatsApp na verzending</strong>
        <small>Open een vooraf ingevuld bericht dat het voorstel klaarstaat. U verzendt het bericht daarna zelf in WhatsApp.</small>
      </div>
      {!phone ? <div className="warning-line">Geen telefoonnummer bekend. Vul eerst het telefoonnummer van de klant aan.</div> : null}
      {!publicUrl ? <div className="warning-line">Er is nog geen openbare voorstelpagina beschikbaar. Verstuur het voorstel eerst per mail.</div> : null}
      <div className="proposal-whatsapp-actions">
        {url ? (
          <a
            className="small whatsapp-small"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (event) => {
              event.preventDefault();
              await prepareWhatsapp({ url, log: () => onPrepared(item.id, publicUrl) });
            }}
          >
            WhatsApp klant: voorstel staat klaar
          </a>
        ) : null}
        {url ? (
          <button className="small secondary-small" disabled={saving} onClick={() => onSent(item.id, publicUrl)}>
            Markeer als handmatig verzonden
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ProposalSentWhatsAppNotice({ details, saving, onPrepared, onSent, onClose }) {
  if (!details) return null;
  const url = proposalWhatsappUrl(details);

  return (
    <section className="whatsapp-after-send">
      <div>
        <span>Voorstel verzonden</span>
        <h2>WhatsApp klant direct na</h2>
        <p>Open een vooraf ingevuld WhatsApp-bericht. Het bericht wordt niet automatisch verzonden; u controleert en verzendt het zelf in WhatsApp.</p>
      </div>
      <div className="whatsapp-after-actions">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (event) => {
              event.preventDefault();
              await prepareWhatsapp({ url, log: () => onPrepared(details.proposalId, details.publicUrl) });
            }}
          >
            WhatsApp klant
          </a>
        ) : <small>Geen telefoonnummer beschikbaar.</small>}
        <button disabled={saving || !url} onClick={() => onSent(details.proposalId, details.publicUrl)}>Markeer als handmatig verzonden</button>
        <button className="secondary" onClick={onClose}>Sluiten</button>
      </div>
    </section>
  );
}

function ProposalListItem({ item, lead, saving, sendProposal, applyProposalAsBase, updateProposalEmail, recordProposalWhatsApp }) {
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
          <button className="small" disabled={saving || !valid} onClick={() => sendProposal(item, email)}>Voorstel verzenden</button>
        </div>
      </div>

      <ProposalWhatsAppFollowUp
        item={item}
        lead={lead}
        saving={saving}
        onPrepared={(proposalId, publicUrl) => recordProposalWhatsApp(proposalId, "prepared", publicUrl)}
        onSent={(proposalId, publicUrl) => recordProposalWhatsApp(proposalId, "sent", publicUrl)}
      />

      <a href={`/admin/voorstellen/${item.id}/print`} target="_blank">Interne print/PDF</a>
      {item.public_token ? <a href={`/voorstel/${item.public_token}?admin_preview=1`} target="_blank">Klantversie bekijken</a> : null}
      <button className="small secondary-small" onClick={() => applyProposalAsBase(item)}>Gebruik als basis</button>
      {item.emailed_at ? <small>Laatst gemaild: {fmt(item.emailed_at)}{item.sent_to_email ? ` · naar ${item.sent_to_email}` : ""}</small> : null}
      {proposalViewedAfterEmail(item) ? <small>Bekeken door klant: {fmt(item.public_viewed_at)}</small> : null}
    </div>
  );
}

export default function LeadDetailPage({ params }) {
  const [leadId, setLeadId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [proposal, setProposal] = useState(null);
  const [contactForm, setContactForm] = useState({ naam: "", email: "", telefoon: "" });
  const [whatsappAfterSend, setWhatsappAfterSend] = useState(null);

  useEffect(() => {
    Promise.resolve(params).then((resolved) => setLeadId(resolved.id));
  }, [params]);

  // Vult "Adres / woning of object" aan met de echte straatnaam en plaats via
  // dezelfde PDOK-adrescontrole als het publieke formulier (/api/address).
  // Overschrijft nooit een al aangepast adres: zolang het veld nog op de
  // automatische postcode+huisnummer-waarde staat mag dit bijwerken, zodra de
  // gebruiker zelf iets heeft ingevuld blijft dat staan.
  async function suggestPropertyAddress(targetLead) {
    const postcode = String(targetLead?.postcode || "").toUpperCase().replace(/\s+/g, "");
    const huisnummer = String(targetLead?.huisnummer || "").trim();
    if (!/^\d{4}[A-Z]{2}$/.test(postcode) || !huisnummer) return;

    try {
      const params = new URLSearchParams({ postcode, huisnummer });
      const response = await fetch(`/api/address?${params.toString()}`);
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json?.found) return;

      const suggestion = addressSuggestionFromLookup(json.address);
      if (!suggestion) return;

      const fallback = defaultPropertyAddress(targetLead);
      setProposal((current) => {
        if (!current || (current.property_address && current.property_address !== fallback)) return current;
        return { ...current, property_address: suggestion };
      });
    } catch {
      // Stille val: het adresveld blijft dan gewoon op postcode + huisnummer staan.
    }
  }

  async function load(id = leadId) {
    if (!id) return;
    const res = await fetch(`/api/admin/v2?action=lead&id=${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Lead ophalen mislukt. Log eventueel opnieuw in via /admin.");
      return;
    }
    setData(json);
    if (json.lead) {
      setProposal(applyAdditionalAgreementDefaults(defaultProposalForLead(json.lead)));
      suggestPropertyAddress(json.lead);
    }
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

  // load() is een gewone functie die bij elke render opnieuw wordt aangemaakt;
  // in de deps opnemen zou dit effect bij elke render laten herhalen. Alleen
  // bij een echte wijziging van leadId opnieuw laden is hier bewust zo.
  useEffect(() => {
    if (leadId) load(leadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const lead = data?.lead;

  // Bewust smal: alleen id/naam/email/telefoon, niet het hele lead-object.
  // load() zet bij elke ververste data een nieuw lead-object, ook als deze
  // vier velden niet zijn gewijzigd; met `lead` zelf in de deps zou het
  // contactformulier bij elke ververste data de eventuele onopgeslagen
  // invoer van de gebruiker overschrijven.
  useEffect(() => {
    if (!lead) return;
    setContactForm({
      naam: lead.naam || "",
      email: lead.email || "",
      telefoon: lead.telefoon || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id, lead?.naam, lead?.email, lead?.telefoon]);

  const latestProposal = useMemo(() => {
    return (data?.proposals || [])[0] || null;
  }, [data?.proposals]);

  // Bewust smal: deze berekening kijkt alleen naar last_contact_at van de
  // lead, niet naar het hele object — zo herberekent dit niet onnodig bij
  // bijvoorbeeld een naamswijziging.
  const latestOpenCustomerAction = useMemo(() => {
    return latestCustomerProposalAction(data?.proposalEvents || [], lead);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.proposalEvents, lead?.last_contact_at]);

  const latestHandledCustomerAction = useMemo(() => {
    const latest = latestCustomerProposalAction(data?.proposalEvents || [], lead, { includeHandled: true });
    return latest && isCustomerActionHandled(latest, lead) ? latest : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.proposalEvents, lead?.last_contact_at]);

  const netComparison = useMemo(() => {
    return calculateNetComparison(proposal || {});
  }, [proposal]);

  const sellerWorkTotal = useMemo(() => calculateSellerWorkTotal(proposal || {}), [proposal]);
  const resaleExample = useMemo(() => calculateResaleExample(proposal || {}), [proposal]);
  const proposalIssues = useMemo(() => proposalValidationIssues(buildCalculatedProposalPayload(proposal || {})), [proposal]);
  const proposalWarnings = useMemo(() => proposalReviewWarnings(buildCalculatedProposalPayload(proposal || {})), [proposal]);

  function setProposalField(field, value) {
    setProposal((current) => {
      const next = { ...(current || {}), [field]: value };
      if (field === "amount_text" && current?.seller_work_enabled) {
        const currentAmount = parseMoney(current.amount_text);
        const currentBase = parseMoney(current.seller_work_base_price_text);
        if (!currentBase || currentBase === currentAmount) next.seller_work_base_price_text = value;
      }
      if (["seller_work_base_price_text", "seller_work_amount_text", "seller_work_enabled"].includes(field)) {
        if (field === "seller_work_enabled" && value) {
          next.seller_work_base_price_text = next.amount_text || "";
        }
        next.seller_work_total_price_text = calculateSellerWorkTotal(next);
      }
      if (field === "amount_text" && next.seller_work_enabled) {
        next.seller_work_total_price_text = calculateSellerWorkTotal(next);
      }
      if (field === "resale_payment_enabled" && value) {
        next.resale_threshold_text = next.resale_threshold_text || next.amount_text || "";
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
        // Passeertermijn (juridische levering) staat los van de feitelijke
        // oplevering: de 6 maanden hier is de wettelijke geldigheidsduur van
        // de inschrijving van de koopovereenkomst (Vormerkung, art. 7:3 BW),
        // niet een streefdatum voor de oplevering zelf.
        delivery_term_text: base.delivery_term_text || "Uiterlijk binnen 6 maanden",
        // Bij deze voorsteltypes kan de verkoper na de juridische levering nog
        // in de woning blijven wonen — de oplevering hoort daarom niet aan
        // dezelfde 6 maanden vast te zitten als de passeertermijn hierboven.
        transfer_date_text: base.transfer_date_text && base.transfer_date_text !== "In overleg" ? base.transfer_date_text : "In overleg, na de juridische levering",
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
    const issues = proposalValidationIssues(calculatedProposal);
    if (issues.length) {
      setError(`Controleer het voorstel: ${issues.join(" ")}`);
      return;
    }
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

  async function recordProposalWhatsApp(id, mode, publicUrl = "") {
    if (!id) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recordProposalWhatsapp", id, mode, public_url: publicUrl }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(json.error || "WhatsApp-actie kon niet worden vastgelegd.");
        return;
      }
      if (mode === "sent") {
        setNotice(WHATSAPP_NOTICES[WHATSAPP_SENT]);
        await load();
      }
    } catch (error) {
      setError("WhatsApp-actie kon niet worden vastgelegd.");
    } finally {
      setSaving(false);
    }
  }

  async function resolveCustomerAction(event) {
    if (!lead?.id || !event?.id) return;
    const result = await post({
      action: "resolveCustomerAction",
      lead_id: lead.id,
      event_id: event.id,
      proposal_id: event.proposal_id,
    });
    if (result?.ok) {
      setNotice("Klantactie is afgehandeld. Het contactmoment is vastgelegd en de bijbehorende opvolgtaak is afgerond.");
    }
  }

  async function sendProposal(item, recipientEmail) {
    const proposalItem = typeof item === "object" ? item : (data?.proposals || []).find((candidate) => candidate.id === item);
    const id = proposalItem?.id || item;
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
      setWhatsappAfterSend({
        proposalId: id,
        publicUrl: result.publicUrl || proposalPublicUrlFromToken(proposalItem?.public_token),
        phone: lead?.telefoon || proposalItem?.lead_telefoon || "",
        name: lead?.naam || proposalItem?.lead_naam || "",
      });
    }
  }

  function applyProposalAsBase(item) {
    setProposal(normalizeProposalForForm(item, lead));
    setNotice("Bestaand voorstel is geladen als basis. Controleer de velden en maak daarna een nieuw voorstel aan.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="detail-page">
      <header>
        <a href="/admin">← Dashboard</a>
        <Image src="/logo.png" alt="Vastgoed Direct Nederland" width={1774} height={887} />
      </header>

      {error ? <div className="error">{error}</div> : null}
      {notice ? <div className="notice-top">{notice}</div> : null}
      <ProposalSentWhatsAppNotice
        details={whatsappAfterSend}
        saving={saving}
        onPrepared={(proposalId, publicUrl) => recordProposalWhatsApp(proposalId, "prepared", publicUrl)}
        onSent={(proposalId, publicUrl) => recordProposalWhatsApp(proposalId, "sent", publicUrl)}
        onClose={() => setWhatsappAfterSend(null)}
      />
      {!lead ? <section className="card"><p>Lead laden...</p></section> : (
        <>
          <LeadHeader
            lead={lead}
            saving={saving}
            latestOpenCustomerAction={latestOpenCustomerAction}
            latestHandledCustomerAction={latestHandledCustomerAction}
            onContactGehad={() => latestOpenCustomerAction
              ? resolveCustomerAction(latestOpenCustomerAction)
              : post({ action: "updateLead", id: lead.id, last_contact_at: new Date().toISOString(), status: ["Nieuw", "Nieuwe aanvraag"].includes(lead.status) ? "In behandeling" : lead.status })}
            onResolveCustomerAction={resolveCustomerAction}
          />

          <section className="grid">
            <LeadContactForm
              lead={lead}
              contactForm={contactForm}
              setContactForm={setContactForm}
              saving={saving}
              onSaveContact={saveContactDetails}
              post={post}
            />
            <NewTaskCard lead={lead} saving={saving} post={post} />
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
          <div id="tijdlijn">
            <LeadTimeline
              lead={lead}
              tasks={data?.tasks || []}
              proposals={data?.proposals || []}
              mailLogs={data?.mailLogs || []}
              proposalEvents={data?.proposalEvents || []}
            />
          </div>

          <ProposalForm
            proposal={proposal}
            setProposalField={setProposalField}
            lead={lead}
            latestProposal={latestProposal}
            saving={saving}
            netComparison={netComparison}
            sellerWorkTotal={sellerWorkTotal}
            resaleExample={resaleExample}
            proposalIssues={proposalIssues}
            proposalWarnings={proposalWarnings}
            specialProposalType={specialProposalType}
            onProposalTypeChange={handleProposalTypeChange}
            onCreateProposal={createProposal}
            onResetProposal={() => {
              setProposal(applyAdditionalAgreementDefaults(defaultProposalForLead(lead)));
              suggestPropertyAddress(lead);
            }}
          />

          <section className="grid three">
            <TaskPanel tasks={data.tasks || []} post={post} />
            <article className="card" id="voorstellen"><h2>Voorstellen</h2>{(data.proposals || []).map((item) => <ProposalListItem key={item.id} item={item} lead={lead} saving={saving} sendProposal={sendProposal} applyProposalAsBase={applyProposalAsBase} updateProposalEmail={updateProposalEmail} recordProposalWhatsApp={recordProposalWhatsApp} />)}</article>
            <MailHistory mailLogs={data.mailLogs || []} />
          </section>
        </>
      )}
    </main>
  );
}
