const DEFAULT_GOOGLE_ADS_ID = "AW-18145688218";
const DEFAULT_LEAD_LABEL = "dgG6COuixMwcEJr1xMxD";

function getGoogleAdsId() {
  return process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || DEFAULT_GOOGLE_ADS_ID;
}

function getGoogleAdsLabel(type) {
  const labels = {
    lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || DEFAULT_LEAD_LABEL,
    call: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL,
    whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL,
  };

  return labels[type];
}

function recentlyTracked(type) {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  window.__vdnGoogleAdsLastTracked = window.__vdnGoogleAdsLastTracked || {};
  const lastTrackedAt = window.__vdnGoogleAdsLastTracked[type] || 0;

  if (now - lastTrackedAt < 1500) {
    return true;
  }

  window.__vdnGoogleAdsLastTracked[type] = now;
  return false;
}

export function trackGoogleAdsConversion(type, options = {}) {
  if (typeof window === "undefined") return false;

  const googleAdsId = getGoogleAdsId();
  const label = getGoogleAdsLabel(type);

  if (!googleAdsId || !label) return false;
  if (typeof window.gtag !== "function") return false;
  if (recentlyTracked(type)) return false;

  const eventData = {
    send_to: `${googleAdsId}/${label}`,
  };

  if (typeof options.value === "number") {
    eventData.value = options.value;
    eventData.currency = options.currency || "EUR";
  }

  if (options.transactionId) {
    eventData.transaction_id = String(options.transactionId);
  }

  window.gtag("event", "conversion", eventData);
  return true;
}

export function trackAnalyticsEvent(eventName, params = {}) {
  if (typeof window === "undefined") return false;
  if (!eventName || typeof window.gtag !== "function") return false;

  const safeParams = {
    event_category: params.event_category || "engagement",
    page_path: window.location?.pathname || undefined,
  };

  if (params.link_type) safeParams.link_type = params.link_type;
  if (params.component) safeParams.component = params.component;
  if (params.form_name) safeParams.form_name = params.form_name;

  window.gtag("event", eventName, safeParams);
  return true;
}
