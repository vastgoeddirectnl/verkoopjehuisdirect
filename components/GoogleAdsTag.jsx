"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ADS_CONSENT_EVENT, readAdsConsent } from "../lib/adsConsent";

const DEFAULT_GOOGLE_ADS_ID = "AW-18145688218";

export default function GoogleAdsTag() {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || DEFAULT_GOOGLE_ADS_ID;
  const pathname = usePathname();
  const allowTracking = !pathname.startsWith("/admin") && !pathname.startsWith("/voorstel");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!allowTracking) {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
      setEnabled(false);
      return;
    }

    function ensureGtag() {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    }

    function updateConsent(status) {
      const granted = status === "granted";

      if (granted) {
        ensureGtag();
        window.gtag("consent", "default", {
          ad_storage: "denied",
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          wait_for_update: 500,
        });
        window.gtag("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "denied",
        });
      } else if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }

      setEnabled(granted);
    }

    updateConsent(readAdsConsent());

    function handleConsent(event) {
      updateConsent(event.detail?.status);
    }

    window.addEventListener(ADS_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(ADS_CONSENT_EVENT, handleConsent);
  }, [allowTracking]);

  if (!googleAdsId || !enabled || !allowTracking) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${googleAdsId}', { allow_ad_personalization_signals: false });
        `}
      </Script>
    </>
  );
}
