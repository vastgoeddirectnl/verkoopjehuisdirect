import { hasAdvertisingConsent } from "./adsConsent";

function isExcludedTrackingPath() {
  if (typeof window === "undefined") return true;

  const pathname = window.location?.pathname || "";
  return pathname.startsWith("/admin") || pathname.startsWith("/voorstel");
}

function recentlyTrackedLead() {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  const lastTrackedAt = window.__vdnMetaLeadLastTracked || 0;

  if (now - lastTrackedAt < 1500) return true;
  window.__vdnMetaLeadLastTracked = now;
  return false;
}

export function trackMetaLead(options = {}) {
  if (typeof window === "undefined") return false;
  if (isExcludedTrackingPath()) return false;
  if (!hasAdvertisingConsent()) return false;
  if (typeof window.fbq !== "function") return false;
  if (recentlyTrackedLead()) return false;

  const eventData = {
    content_name: "woningverkoop_aanvraag",
    value: typeof options.value === "number" ? options.value : 1,
    currency: options.currency || "EUR",
  };
  const eventOptions = options.transactionId
    ? { eventID: String(options.transactionId) }
    : undefined;

  window.fbq("track", "Lead", eventData, eventOptions);
  return true;
}
