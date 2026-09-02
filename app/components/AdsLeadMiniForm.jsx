"use client";

import { useRef, useState } from "react";
import { trackAnalyticsEvent, trackGoogleAdsConversion } from "../lib/googleAds";
import { getLeadAttribution } from "../lib/attribution";

const situaties = [
  "Snel duidelijkheid gewenst",
  "Woning in de huidige staat verkopen",
  "Achterstallig onderhoud",
  "Woning staat leeg",
  "Woning staat nog vol spullen",
  "Zonder makelaar verkopen",
  "Verkoop aan een opkoper overwegen",
  "Erfenis / nalatenschap",
  "Scheiding",
  "Dubbele lasten",
  "Anders",
];


export default function AdsLeadMiniForm({
  pageTitle = "Advertentiepagina",
  pageSlug = "/",
  defaultSituation = "",
  submitLabel = "Ontvang een vrijblijvend verkoopvoorstel",
  successTitle = "Bedankt, uw aanvraag is ontvangen.",
  successText = "Wij bekijken de woninggegevens en nemen doorgaans binnen één werkdag contact met u op. Als directe verkoop passend is, ontvangt u daarna een vrijblijvend verkoopvoorstel.",
  privacyNote = "Vrijblijvend. Uw gegevens worden alleen gebruikt om uw aanvraag te beoordelen en contact met u op te nemen.",
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasTrackedStart = useRef(false);
  const [form, setForm] = useState({
    naam: "",
    telefoon: "",
    email: "",
    postcode: "",
    huisnummer: "",
    situatie: defaultSituation || "",
    _website: "",
  });

  const trackFormStart = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackAnalyticsEvent("lead_form_start", {
      form_name: "seo_ads_mini_form",
      component: pageSlug,
    });
  };

  const updateForm = (event) => {
    trackFormStart();
    const { name, value } = event.target;
    const normalized = name === "postcode"
      ? value.toUpperCase().replace(/\s+/g, "").slice(0, 6)
      : value;
    setForm((current) => ({ ...current, [name]: normalized }));
    setError("");
  };

  const submitLead = async (event) => {
    event.preventDefault();
    trackFormStart();
    setError("");

    if (!form.naam.trim() || !form.telefoon.trim() || !form.postcode || !form.huisnummer.trim()) {
      setError("Vul de verplichte velden in: naam, telefoonnummer, postcode en huisnummer.");
      return;
    }
    if (!/^\d{4}[A-Z]{2}$/.test(form.postcode)) {
      setError("Controleer de postcode, bijvoorbeeld 9501 AB.");
      return;
    }
    if (form.telefoon.replace(/\D/g, "").length < 8) {
      setError("Controleer het telefoonnummer.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Controleer het e-mailadres.");
      return;
    }

    setSubmitting(true);

    try {
      const attribution = getLeadAttribution({ pageTitle, fallbackPath: pageSlug });
      const lead = {
        naam: form.naam,
        email: form.email,
        telefoon: form.telefoon,
        postcode: form.postcode,
        huisnummer: form.huisnummer,
        woningtype: "Nog te bespreken",
        staat: form.situatie || "Niet ingevuld",
        reden: [
          `Campagne landingspagina: ${pageTitle}`,
          form.situatie ? `Situatie: ${form.situatie}` : "",
        ].filter(Boolean).join(" | "),
        pagina: attribution.pageLabel,
        bron: attribution.sourceLabel,
        _website: form._website,
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Aanvraag verzenden mislukt.");
      }

      trackAnalyticsEvent("lead_form_submit", {
        form_name: "seo_ads_mini_form",
        component: pageSlug,
      });

      trackGoogleAdsConversion("lead", {
        value: 1,
        currency: "EUR",
        transactionId: result?.reference ? `lead-${result.reference}` : undefined,
        userData: {
          email: form.email,
          phone: form.telefoon,
        },
      });

      setSubmitted(true);
    } catch (err) {
      setError("Er ging iets mis. Probeer opnieuw of neem contact op via WhatsApp.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="ad-mini-success" role="status">
        <strong>{successTitle}</strong>
        <p>{successText}</p>
      </div>
    );
  }

  return (
    <form className="ad-mini-form" onSubmit={submitLead} onFocusCapture={trackFormStart}>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input name="_website" value={form._website} onChange={updateForm} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="ad-mini-section">
        <div className="ad-mini-section-title">Woning</div>
        <div className="ad-mini-form-row two">
          <label>
            <span>Postcode</span>
            <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Bijv. 9501 AB" autoComplete="postal-code" inputMode="text" required />
          </label>
          <label>
            <span>Nr.</span>
            <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="12" autoComplete="address-line2" inputMode="numeric" required />
          </label>
        </div>

        <label>
          <span>Situatie</span>
          <select name="situatie" value={form.situatie} onChange={updateForm}>
            <option value="">Kies wat het beste past</option>
            {situaties.map((situatie) => (
              <option value={situatie} key={situatie}>{situatie}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="ad-mini-section">
        <div className="ad-mini-section-title">Contact</div>
        <label>
          <span>Naam</span>
          <input name="naam" value={form.naam} onChange={updateForm} placeholder="Uw naam" autoComplete="name" required />
        </label>

        <label>
          <span>Telefoonnummer</span>
          <input name="telefoon" type="tel" value={form.telefoon} onChange={updateForm} placeholder="06 ..." autoComplete="tel" inputMode="tel" required />
        </label>

        <label>
          <span>E-mail (optioneel)</span>
          <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="naam@email.nl" autoComplete="email" inputMode="email" />
        </label>
      </div>

      {error && <p className="ad-mini-error">{error}</p>}

      <button type="submit" className="btn btn-orange ad-mini-submit" disabled={submitting}>
        {submitting ? "Aanvraag verzenden..." : submitLabel}
      </button>

      <p className="ad-mini-note">{privacyNote}</p>
    </form>
  );
}
