"use client";

import { useEffect, useRef, useState } from "react";
import { getLeadAttribution } from "../lib/attribution";
import { trackAnalyticsEvent, trackGoogleAdsConversion } from "../lib/googleAds";
import { trackMetaLead } from "../lib/metaAds";

const whatsappLink =
  "https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F";

const woningTypes = [
  "Tussenwoning","Hoekwoning","Twee-onder-een-kapwoning","Vrijstaande woning","Appartement",
  "Benedenwoning","Bovenwoning","Maisonette","Woonboerderij","Bungalow","Recreatiewoning","Chalet",
  "Anders / weet ik niet zeker",
];

const verkoopSituaties = [
  "Geen bijzonderheden","Achterstallig onderhoud","Leegstand","Verhuurde woning","Erfenis / nalatenschap",
  "Scheiding","Dubbele lasten","Financiële druk","Geen zin in bezichtigingen","Behoefte aan privacy",
  "Woning staat nog vol spullen","Woning is niet verkoopklaar","Woning moet nog leeggehaald worden",
  "Snel duidelijkheid gewenst","Anders",
];

const termijnen = [
  "Zo snel mogelijk","Binnen 1 maand","Binnen 3 maanden","Binnen 6 maanden",
  "Later dit jaar","Ik oriënteer mij alleen","Anders",
];

export default function HomeLeadForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [addressResult, setAddressResult] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const formStarted = useRef(false);
  const [form, setForm] = useState({
    postcode: "", huisnummer: "", woningtype: "", situatie: "", termijn: "",
    toelichting: "", naam: "", email: "", telefoon: "", _website: "",
  });

  useEffect(() => {
    trackAnalyticsEvent("lead_form_view", { form_name: "homepage_main_form" });
  }, []);

  useEffect(() => {
    if (!/^\d{4}[A-Z]{2}$/.test(form.postcode) || !form.huisnummer.trim()) {
      setAddressResult(null);
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setAddressLoading(true);
      try {
        const params = new URLSearchParams({ postcode: form.postcode, huisnummer: form.huisnummer });
        const response = await fetch(`/api/address?${params.toString()}`, { signal: controller.signal });
        const data = await response.json().catch(() => ({}));
        setAddressResult(response.ok && data?.found ? data.address : null);
      } catch (error) {
        if (error?.name !== "AbortError") setAddressResult(null);
      } finally {
        setAddressLoading(false);
      }
    }, 450);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [form.postcode, form.huisnummer]);

  function trackFormStart() {
    if (formStarted.current) return;
    formStarted.current = true;
    trackAnalyticsEvent("lead_form_start", { form_name: "homepage_main_form" });
  }

  function updateForm(event) {
    trackFormStart();
    const { name, value } = event.target;
    const normalized = name === "postcode" ? value.toUpperCase().replace(/\s+/g, "").slice(0, 6) : value;
    setForm((current) => ({ ...current, [name]: normalized }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  }

  function nextStep() {
    trackFormStart();
    setFormError("");
    const errors = {};
    if (step === 1) {
      if (!/^\d{4}[A-Z]{2}$/.test(form.postcode)) errors.postcode = "Vul een Nederlandse postcode in, bijvoorbeeld 9723 AB.";
      if (!form.huisnummer.trim()) errors.huisnummer = "Vul het huisnummer in.";
      if (!form.woningtype) errors.woningtype = "Kies het type woning.";
    }
    if (step === 2 && !form.situatie) errors.situatie = "Kies kort welke situatie het beste past.";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError("Controleer de gemarkeerde velden.");
      trackAnalyticsEvent("lead_form_error", { form_name: "homepage_main_form", step });
      return;
    }
    trackAnalyticsEvent(`lead_form_step_${step}_complete`, { form_name: "homepage_main_form" });
    setStep((current) => Math.min(current + 1, 3));
  }

  async function submitLead(event) {
    event.preventDefault();
    trackFormStart();
    setFormError("");
    const errors = {};
    if (!form.naam.trim()) errors.naam = "Vul uw naam in.";
    if (form.telefoon.replace(/\D/g, "").length < 8) errors.telefoon = "Controleer het telefoonnummer.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Controleer het e-mailadres.";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setFormError("Controleer de gemarkeerde velden.");
      trackAnalyticsEvent("lead_form_error", { form_name: "homepage_main_form", step: 3 });
      return;
    }

    setSubmitting(true);
    const attribution = getLeadAttribution({ pageTitle: "Homepage", fallbackPath: "/" });
    const lead = {
      naam: form.naam,
      email: form.email,
      telefoon: form.telefoon,
      postcode: form.postcode,
      huisnummer: form.huisnummer,
      woningtype: form.woningtype,
      staat: form.situatie,
      reden: [
        form.termijn ? `Termijn: ${form.termijn}` : "",
        form.toelichting ? `Toelichting: ${form.toelichting}` : "",
        addressResult?.display ? `Adrescontrole: ${addressResult.display}` : "",
      ].filter(Boolean).join(" | "),
      pagina: attribution.pageLabel,
      bron: attribution.sourceLabel,
      _website: form._website,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Aanvraag verzenden mislukt.");

      trackAnalyticsEvent("lead_form_step_3_complete", { form_name: "homepage_main_form" });
      trackAnalyticsEvent("lead_form_submit", { form_name: "homepage_main_form" });
      const transactionId = result?.reference ? `lead-${result.reference}` : undefined;
      trackGoogleAdsConversion("lead", {
        value: 1,
        currency: "EUR",
        transactionId,
        userData: {
          email: form.email,
          phone: form.telefoon,
        },
      });
      trackMetaLead({ value: 1, currency: "EUR", transactionId });
      setSubmitted(true);
    } catch (error) {
      setFormError("Er ging iets mis. Probeer opnieuw of neem contact op via WhatsApp.");
      trackAnalyticsEvent("lead_form_error", { form_name: "homepage_main_form", step: 3, type: "submit" });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="aanvraag" className="form-card">
      <div className="form-logo-wrap">
        <img src="/logo.png" alt="Vastgoed Direct Nederland" className="form-logo" />
      </div>

      {!submitted ? (
        <form onSubmit={submitLead} onFocusCapture={trackFormStart}>
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label>Website<input name="_website" value={form._website} onChange={updateForm} tabIndex={-1} autoComplete="off" /></label>
          </div>
          <p className="step-label">Stap {step} van 3</p>
          <div className="form-progress" aria-hidden="true"><span style={{ width: `${(step / 3) * 100}%` }} /></div>
          {formError ? <div className="form-inline-error" role="alert">{formError}</div> : null}
          <h2 className="form-title">Vertel kort om welke woning het gaat</h2>
          <p className="form-sub form-sub-desktop">Vul uw adres en situatie in. Wij beoordelen de mogelijkheden en laten u weten welke vervolgstap past.</p>
          <p className="form-sub form-sub-mobile">Adres en situatie zijn genoeg voor een eerste beoordeling.</p>

          {step === 1 ? (
            <div className="form-stack">
              <div className="form-part"><span>1</span> Uw woning</div>
              <label className="input-group">
                <span>Postcode</span>
                <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Bijv. 9723 AB" className={`field${fieldErrors.postcode ? " has-error" : ""}`} autoComplete="postal-code" aria-invalid={Boolean(fieldErrors.postcode)} required />
                {fieldErrors.postcode ? <small className="field-error">{fieldErrors.postcode}</small> : null}
              </label>
              <label className="input-group">
                <span>Huisnummer</span>
                <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Bijv. 14" className={`field${fieldErrors.huisnummer ? " has-error" : ""}`} autoComplete="address-line2" inputMode="numeric" aria-invalid={Boolean(fieldErrors.huisnummer)} required />
                {fieldErrors.huisnummer ? <small className="field-error">{fieldErrors.huisnummer}</small> : null}
              </label>
              {addressLoading ? <div className="address-feedback loading">Adres controleren…</div> : null}
              {addressResult ? <div className="address-feedback"><strong>✓ Adres gevonden</strong><span>{addressResult.street} {addressResult.houseNumber}, {addressResult.postcode} {addressResult.city}</span></div> : null}
              <label className="input-group">
                <span>Type woning</span>
                <select name="woningtype" value={form.woningtype} onChange={updateForm} className={`field${fieldErrors.woningtype ? " has-error" : ""}`} aria-invalid={Boolean(fieldErrors.woningtype)} required>
                  <option value="">Type woning</option>
                  {woningTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
                {fieldErrors.woningtype ? <small className="field-error">{fieldErrors.woningtype}</small> : null}
              </label>
              <button type="button" onClick={nextStep} className="btn btn-blue">Volgende stap</button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="form-stack">
              <div className="form-part"><span>2</span> Uw situatie</div>
              <label className="input-group">
                <span>Uw situatie</span>
                <select name="situatie" value={form.situatie} onChange={updateForm} className={`field${fieldErrors.situatie ? " has-error" : ""}`} aria-invalid={Boolean(fieldErrors.situatie)} required>
                  <option value="">Kies wat het beste past</option>
                  {verkoopSituaties.map((situatie) => <option key={situatie}>{situatie}</option>)}
                </select>
                {fieldErrors.situatie ? <small className="field-error">{fieldErrors.situatie}</small> : null}
              </label>
              <select name="termijn" value={form.termijn} onChange={updateForm} className="field">
                <option value="">Gewenste termijn (optioneel)</option>
                {termijnen.map((termijn) => <option key={termijn}>{termijn}</option>)}
              </select>
              <textarea name="toelichting" value={form.toelichting} onChange={updateForm} placeholder="Korte toelichting (optioneel)" className="field" />
              <div className="form-actions">
                <button type="button" onClick={() => setStep(1)} className="btn btn-light">Terug</button>
                <button type="button" onClick={nextStep} className="btn btn-blue">Naar laatste stap</button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="form-stack">
              <div className="form-part"><span>3</span> Contactgegevens</div>
              <label className="input-group">
                <span>Naam</span>
                <input name="naam" value={form.naam} onChange={updateForm} placeholder="Uw naam" className={`field${fieldErrors.naam ? " has-error" : ""}`} autoComplete="name" aria-invalid={Boolean(fieldErrors.naam)} required />
                {fieldErrors.naam ? <small className="field-error">{fieldErrors.naam}</small> : null}
              </label>
              <label className="input-group">
                <span>Telefoonnummer</span>
                <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="06 12 34 56 78" className={`field${fieldErrors.telefoon ? " has-error" : ""}`} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={Boolean(fieldErrors.telefoon)} required />
                {fieldErrors.telefoon ? <small className="field-error">{fieldErrors.telefoon}</small> : null}
              </label>
              <label className="input-group">
                <span>E-mailadres <small>(optioneel)</small></span>
                <input name="email" value={form.email} onChange={updateForm} placeholder="naam@voorbeeld.nl" type="email" className={`field${fieldErrors.email ? " has-error" : ""}`} inputMode="email" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} />
                {fieldErrors.email ? <small className="field-error">{fieldErrors.email}</small> : null}
              </label>
              <div className="form-actions">
                <button type="button" onClick={() => setStep(2)} className="btn btn-light">Terug</button>
                <button type="submit" className="btn btn-orange" disabled={submitting}>{submitting ? "Aanvraag verzenden…" : "Vraag vrijblijvend een voorstel aan"}</button>
              </div>
              <p className="small-note">Wij gebruiken uw gegevens alleen om uw aanvraag te beoordelen en hierover contact op te nemen.</p>
            </div>
          ) : null}
        </form>
      ) : (
        <div className="success">
          <div className="success-icon">✓</div>
          <h2 className="form-title">Aanvraag ontvangen</h2>
          <p className="form-sub">Wij beoordelen uw aanvraag en nemen persoonlijk contact met u op. Als directe verkoop passend is, ontvangt u een vrijblijvend verkoopvoorstel.</p>
          <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer" className="btn btn-green">Aanvullen via WhatsApp</a>
        </div>
      )}
    </section>
  );
}
