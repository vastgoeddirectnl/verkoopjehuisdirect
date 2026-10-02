"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readAdsConsent, writeAdsConsent } from "../lib/adsConsent";
import { COOKIE_PREFERENCES_EVENT } from "./CookiePreferencesLink";

export default function CookieConsent() {
  const pathname = usePathname();
  const showConsent = !pathname.startsWith("/admin") && !pathname.startsWith("/voorstel");
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!showConsent) {
      setReady(true);
      return;
    }

    setOpen(!readAdsConsent());
    setReady(true);
  }, [showConsent]);

  // De keuze is later te wijzigen via de link "Cookievoorkeuren" in de
  // footer (en op de privacyverklaring), niet meer via een zwevende knop.
  useEffect(() => {
    if (!showConsent) return undefined;
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, reopen);
  }, [showConsent]);

  function choose(status) {
    writeAdsConsent(status);
    setOpen(false);
  }

  if (!ready || !showConsent || !open) return null;

  return (
    <section className="cookie-consent" role="region" aria-labelledby="cookie-consent-title">
      <div className="cookie-consent-copy">
        <strong id="cookie-consent-title">Uw privacykeuze</strong>
        <p>
          Met uw toestemming gebruiken wij Google Ads en Meta om websitebezoek en aanvragen te
          meten. Alleen Google kan na een geslaagde aanvraag uw e-mailadres en telefoonnummer
          gehasht verwerken. Meta ontvangt van ons geen contact- of woninggegevens. Weigeren heeft
          geen gevolgen voor het gebruik van de website of uw aanvraag.
        </p>
        <a href="/privacyverklaring">Lees de privacyverklaring</a>
      </div>
      <div className="cookie-consent-actions">
        <button type="button" className="button button-secondary" onClick={() => choose("denied")}>
          Weigeren
        </button>
        <button type="button" className="button button-primary" onClick={() => choose("granted")}>
          Accepteren
        </button>
      </div>
    </section>
  );
}
