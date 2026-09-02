export const ADS_CONSENT_STORAGE_KEY = "vdn_google_ads_consent_v1";
export const ADS_CONSENT_EVENT = "vdn:google-ads-consent";

export function readAdsConsent() {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(ADS_CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function hasGoogleAdsConsent() {
  return readAdsConsent() === "granted";
}

export function writeAdsConsent(status) {
  if (typeof window === "undefined") return;
  if (status !== "granted" && status !== "denied") return;

  window.localStorage.setItem(ADS_CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(ADS_CONSENT_EVENT, { detail: { status } }));
}
