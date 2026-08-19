"use client";

import { useRef, useState } from "react";
import { trackAnalyticsEvent, trackGoogleAdsConversion } from "../lib/googleAds";

const situaties = [
  "Snel duidelijkheid gewenst",
  "Woning in huidige staat verkopen",
  "Achterstallig onderhoud",
  "Woning staat leeg",
  "Woning staat nog vol spullen",
  "Zonder makelaar verkopen",
  "Verkoop aan opkoper overwegen",
  "Erfenis / nalatenschap",
  "Scheiding",
  "Dubbele lasten",
  "Anders",
];


const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
];

function compactParts(parts, maxLength = 300) {
  const result = [];
  let length = 0;

  for (const part of parts.filter(Boolean)) {
    const nextLength = length + (result.length ? 3 : 0) + part.length;
    if (nextLength > maxLength) break;
    result.push(part);
    length = nextLength;
  }

  return result.join(" | ");
}

function getAttributionFromUrl(pageTitle, fallbackSlug) {
  if (typeof window === "undefined") {
    return {
      pagePath: fallbackSlug || "/",
      pageLabel: `${fallbackSlug || "/"} · ${pageTitle}`.slice(0, 260),
      sourceLabel: "direct",
    };
  }

  const params = new URLSearchParams(window.location.search || "");
  const pagePath = `${window.location.pathname || fallbackSlug || "/"}${window.location.search || ""}`;
  const trackingParts = TRACKING_PARAMS
    .map((key) => {
      const value = params.get(key);
      return value ? `${key}=${value}` : "";
    })
    .filter(Boolean);

  const referrer = document.referrer ? `referrer=${document.referrer}` : "";
  const sourceLabel = compactParts(
    trackingParts.length ? trackingParts : [params.get("source") ? `source=${params.get("source")}` : "", referrer, "direct"],
    300
  );

  return {
    pagePath,
    pageLabel: compactParts([pagePath, pageTitle], 260),
    sourceLabel,
  };
}

export default function AdsLeadMiniForm({
  pageTitle = "Advertentiepagina",
  pageSlug = "/",
  defaultSituation = "",
  submitLabel = "Ontvang een vrijblijvend verkoopvoorstel",
  successTitle = "Bedankt, uw aanvraag is ontvangen.",
  successText = "Wij bekijken de woninggegevens en nemen doorgaans binnen één werkdag contact met u op. Waar mogelijk ontvangt u daarna een eerste vrijblijvende inschatting of verkoopvoorstel.",
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
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitLead = async (event) => {
    event.preventDefault();
    trackFormStart();
    setError("");

    if (!form.naam || !form.telefoon || !form.postcode || !form.huisnummer) {
      setError("Vul de verplichte velden in: naam, telefoonnummer, postcode en huisnummer.");
      return;
    }

    setSubmitting(true);

    try {
      const attribution = getAttributionFromUrl(pageTitle, pageSlug);
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
