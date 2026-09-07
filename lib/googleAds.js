import { hasGoogleAdsConsent } from "./adsConsent";

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

function isExcludedTrackingPath() {
  if (typeof window === "undefined") return true;

  const pathname = window.location?.pathname || "";
  return pathname.startsWith("/admin") || pathname.startsWith("/voorstel");
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

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function normalizeDutchPhone(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  let phone = raw.replace(/[^\d+]/g, "");
  if (phone.startsWith("00")) phone = `+${phone.slice(2)}`;
  if (phone.startsWith("0")) phone = `+31${phone.slice(1)}`;
  if (phone.startsWith("31")) phone = `+${phone}`;

  return /^\+\d{10,14}$/.test(phone) ? phone : "";
}

function getEnhancedConversionData(userData = {}) {
  const email = normalizeEmail(userData.email);
  if (!email) return null;

  const phone = normalizeDutchPhone(userData.phone);
  return phone ? { email, phone_number: phone } : { email };
}

export function trackGoogleAdsConversion(type, options = {}) {
  if (typeof window === "undefined") return false;
  if (isExcludedTrackingPath()) return false;
  if (!hasGoogleAdsConsent()) return false;

  const googleAdsId = getGoogleAdsId();
  const label = getGoogleAdsLabel(type);

  if (!googleAdsId || !label) return false;
  if (typeof window.gtag !== "function") return false;
  if (recentlyTracked(type)) return false;

  const enhancedConversionData = type === "lead" ? getEnhancedConversionData(options.userData) : null;
  if (enhancedConversionData) {
    window.gtag("set", "user_data", enhancedConversionData);
  }

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
  if (isExcludedTrackingPath()) return false;
  if (!hasGoogleAdsConsent()) return false;
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
