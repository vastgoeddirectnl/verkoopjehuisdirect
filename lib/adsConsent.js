// Keep the existing storage key so returning visitors do not have to make the
// same privacy choice again now Meta advertising measurement is added.
export const AD_MEASUREMENT_CONSENT_STORAGE_KEY = "vdn_google_ads_consent_v1";
export const AD_MEASUREMENT_CONSENT_EVENT = "vdn:ad-measurement-consent";

// Backwards-compatible names for the existing Google Ads integration.
export const ADS_CONSENT_STORAGE_KEY = AD_MEASUREMENT_CONSENT_STORAGE_KEY;
export const ADS_CONSENT_EVENT = AD_MEASUREMENT_CONSENT_EVENT;

export function readAdsConsent() {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(AD_MEASUREMENT_CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function hasAdvertisingConsent() {
  return readAdsConsent() === "granted";
}

export function hasGoogleAdsConsent() {
  return hasAdvertisingConsent();
}

export function writeAdsConsent(status) {
  if (typeof window === "undefined") return;
  if (status !== "granted" && status !== "denied") return;

  window.localStorage.setItem(AD_MEASUREMENT_CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(AD_MEASUREMENT_CONSENT_EVENT, { detail: { status } }));
}
