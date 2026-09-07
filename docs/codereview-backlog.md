# Codereview-backlog

Alle zeventien bevindingen uit de codereview van 5.1.1 zijn opgelost: elf in
5.2.0, drie in 5.2.3 en de laatste drie structurele in 5.3.0 en 5.3.1.
LINT-01, MON-01 en TEST-01 zijn in 5.5.0 opgelost (zie CHANGELOG.md); dat
gold ook voor het gedeelde `ADMIN_PASSWORD` zonder tweede factor, met TOTP
erbovenop. Wat hieronder staat zijn de punten die daarna zijn opgekomen.

## Werkafspraken

1. Draai `npm ci && npm run check` voordat je begint en na elke afgeronde
   wijziging.
2. Grep altijd eerst of iets nog gebruikt wordt voordat je het verwijdert.
3. Eén onderwerp per commit, met de code (ARCH-06, …) in de message.
4. Werk `CHANGELOG.md` bij onder een nieuwe versiekop en haal het punt hier weg
   als het klaar is.
5. Alle code, comments en UI-teksten zijn Nederlands. Houd dat zo.

## Niet aankomen — dit is bewust zo gebouwd

- Alle queries zijn geparameteriseerd. Nooit string-concatenatie in SQL.
- `safeEqualText` / `crypto.timingSafeEqual` in `app/lib/adminAuth.js`, en de
  wachtwoordvingerafdruk in het sessietoken.
- De authenticatiecontrole bovenaan `app/admin/voorstellen/[id]/print/page.jsx`
  en de cookiecontrole in `middleware.js`.
- De veld-whitelists met `Object.prototype.hasOwnProperty.call` bij lead- en
  voorstelupdates.
- Rate limiting slaat een **gehashte** IP op, geen ruw IP-adres (AVG), en het
  vangnet in `enforceRateLimit` dat voorkomt dat een falende limiter een lead
  kost.
- De honeypot in `app/api/leads/route.js` geeft bewust `200 ok` terug.
- De consent-opzet: geen script laadt vóór toestemming, Consent Mode v2 staat
  default op denied, `ad_personalization` blijft altijd geweigerd, en tracking
  is uitgesloten op `/admin` en `/voorstel`.
- `app/lib/date.js` rekent in Europe/Amsterdam met een UTC-middag-normalisatie.
  Dat ziet er omslachtig uit maar voorkomt off-by-one rond de zomertijd; er
  staan tests op in `test/date.test.js`.
- De duplicaatcontrole in `createLead` (3 minuten op telefoon + postcode +
  huisnummer).
- Het onderscheid tussen `proposalValidationIssues` (blokkeert) en
  `proposalReviewWarnings` (adviseert).
- `app/lib/money.js` is sinds 5.3.0 de enige geldparser, en
  `app/lib/admin/customerActions.js` sinds 5.3.1 de enige plek waar staat
  wanneer een klantactie is afgehandeld. Introduceer daar geen tweede van;
  importeer eruit.
- `app/lib/admin/whatsapp.js` bepaalt de volgorde: eerst loggen, dan openen.
  Roep de logactie nooit los aan naast een `<a target="_blank">`.
- `app/lib/leadsQuery.js` bouwt de overzichtsquery met LATERAL op een vooraf
  begrensde set leads. Zet de limiet niet buiten de CTE — dan rekent Postgres
  weer voor alle leads.
- `app/lib/totp.js` is een eigen RFC 6238/4226-implementatie, bewust zonder
  dependency. Timing-safe vergelijking via `crypto.timingSafeEqual`, ±1
  tijdstap speling voor kloktikverschil. De testvector in `test/totp.test.js`
  komt uit RFC 4226 bijlage D — raak die niet aan zonder een andere vector.
- `app/lib/reportError.js` importeert `@sentry/nextjs` alleen dynamisch, en
  alleen als `SENTRY_DSN` is gezet. Daardoor blijft dit bestand onder gewone
  `node --test` net zo licht als vóór 5.5.0. Geen top-level import hiervan.

---

## Ook opgemerkt, jouw keuze

- De CSP in `next.config.mjs` staat in report-only. Zet hem om naar
  `Content-Security-Policy` zodra er enkele weken geen meldingen meer
  binnenkomen, en pas de hostlijst aan op wat je in die periode daadwerkelijk
  hebt zien blokkeren.
