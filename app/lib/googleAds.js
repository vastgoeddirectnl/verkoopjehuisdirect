export function trackGoogleAdsConversion(type) {
  if (typeof window === "undefined") return;

  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  const labels = {
    lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
    call: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL,
    whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL,
  };

  const label = labels[type];

  if (!googleAdsId || !label) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: `${googleAdsId}/${label}`,
  });
}
