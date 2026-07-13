"use client";

import { useState } from "react";
import { trackGoogleAdsConversion } from "../lib/googleAds";

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

export default function AdsLeadMiniForm({ pageTitle = "Advertentiepagina", pageSlug = "/", defaultSituation = "" }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    naam: "",
    telefoon: "",
    email: "",
    postcode: "",
    huisnummer: "",
    situatie: defaultSituation || "",
  });

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitLead = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.naam || !form.telefoon || !form.postcode || !form.huisnummer) {
      setError("Vul naam, telefoonnummer, postcode en huisnummer in.");
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams(window.location.search);
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
        pagina: window.location.pathname || pageSlug,
        bron: params.get("utm_source") || params.get("source") || document.referrer || "direct",
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

      trackGoogleAdsConversion("lead", {
        value: 1,
        currency: "EUR",
        transactionId: result?.lead?.id ? `lead-${result.lead.id}` : undefined,
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
        <strong>Bedankt, uw aanvraag is ontvangen.</strong>
        <p>Wij bekijken uw gegevens en sturen waar mogelijk een eerste vrijblijvende inschatting of voorstel. Als er nog iets nodig is, nemen wij kort contact op.</p>
      </div>
    );
  }

  return (
    <form className="ad-mini-form" onSubmit={submitLead}>
      <div className="ad-mini-form-row two">
        <label>
          <span>Postcode</span>
          <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Bijv. 9501 AB" autoComplete="postal-code" required />
        </label>
        <label>
          <span>Huisnr.</span>
          <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="12" autoComplete="address-line2" required />
        </label>
      </div>

      <label>
        <span>Wat speelt er?</span>
        <select name="situatie" value={form.situatie} onChange={updateForm}>
          <option value="">Kies wat het beste past</option>
          {situaties.map((situatie) => (
            <option value={situatie} key={situatie}>{situatie}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Naam</span>
        <input name="naam" value={form.naam} onChange={updateForm} placeholder="Uw naam" autoComplete="name" required />
      </label>

      <label>
        <span>Telefoonnummer</span>
        <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="06 ..." autoComplete="tel" required />
      </label>

      <label>
        <span>E-mail optioneel</span>
        <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="naam@email.nl" autoComplete="email" />
      </label>

      {error && <p className="ad-mini-error">{error}</p>}

      <button type="submit" className="btn btn-orange ad-mini-submit" disabled={submitting}>
        {submitting ? "Aanvraag verzenden..." : "Vraag vrijblijvend voorstel aan"}
      </button>

      <p className="ad-mini-note">Vrijblijvend. U zit nergens aan vast.</p>
    </form>
  );
}
