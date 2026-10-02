"use client";

// Opent de privacykeuze opnieuw. Vervangt de zwevende knop linksonder, die op
// mobiel over de inhoud en de actiebalk heen viel (UI-01). CookieConsent
// luistert naar dit event.
export const COOKIE_PREFERENCES_EVENT = "vdn:cookie-preferences";

export default function CookiePreferencesLink({ className = "", children = "Cookievoorkeuren" }) {
  return (
    <button
      type="button"
      className={`cookie-preferences-link ${className}`.trim()}
      onClick={() => window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))}
    >
      {children}
    </button>
  );
}
