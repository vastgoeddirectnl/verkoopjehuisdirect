"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { readAdsConsent, writeAdsConsent } from "../lib/adsConsent";

export default function CookieConsent() {
  const pathname = usePathname();
  const showConsent = !pathname.startsWith("/admin") && !pathname.startsWith("/voorstel");
  const [decision, setDecision] = useState(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!showConsent) {
      setReady(true);
      return;
    }

    const storedDecision = readAdsConsent();
    setDecision(storedDecision);
    setOpen(!storedDecision);
    setReady(true);
  }, [showConsent]);

  function choose(status) {
    writeAdsConsent(status);
    setDecision(status);
    setOpen(false);
  }

  if (!ready || !showConsent) return null;

  return (
    <>
      {open ? (
        <section className="cookie-consent" role="region" aria-labelledby="cookie-consent-title">
          <div className="cookie-consent-copy">
            <strong id="cookie-consent-title">Uw privacykeuze</strong>
            <p>
              Met uw toestemming gebruiken wij Google Ads om aanvragen te meten. Na een geslaagde
              aanvraag kan de Google-tag uw e-mailadres en telefoonnummer gehasht verwerken. Weigeren
              heeft geen gevolgen voor het gebruik van de website of uw aanvraag.
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
      ) : (
        <button
          type="button"
          className="cookie-preferences-button"
          onClick={() => setOpen(true)}
          aria-label={`Cookievoorkeuren wijzigen. Huidige keuze: ${decision === "granted" ? "geaccepteerd" : "geweigerd"}.`}
        >
          Cookievoorkeuren
        </button>
      )}
    </>
  );
}
