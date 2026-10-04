# Codereview-backlog

Alle zeventien bevindingen uit de codereview van 5.1.1 zijn opgelost: elf in
5.2.0, drie in 5.2.3 en de laatste drie structurele in 5.3.0 en 5.3.1.
LINT-01, MON-01 en TEST-01 zijn in 5.5.0 opgelost (zie CHANGELOG.md); dat
gold ook voor het gedeelde `ADMIN_PASSWORD` zonder tweede factor, met TOTP
erbovenop. De review van oktober 2026 is in 5.6.0 verwerkt (DATA-01, TASK-01,
SRC-01, ARCH-07, ADM-01, UI-01, VST-01, SEO-02, SEC-01, CRON-01). Wat hieronder
staat zijn de punten die daarna nog openstaan.

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
- `app/lib/neonDb.js` geeft `date`-kolommen terug als "YYYY-MM-DD" (DATA-01).
  Vergelijk datums als zodanig; maak er geen `new Date()` van om te vergelijken.
  "Vandaag" in SQL is `SQL_TODAY_NL`, niet `current_date` (dat is UTC).
- Automatische taken sluiten via `AUTOMATION_TASK_CLOSE_RULES` in
  `app/lib/automation.js` (TASK-01). Handmatige taken (zonder
  `automation_key`) blijven altijd met rust. Een nieuw soort automatische taak
  hoort daar een sluitregel bij te krijgen.
- `leadChannel()` in `app/lib/sourceParser.js` is de enige vertaling van het
  ruwe bronveld naar een kanaal (SRC-01). Testverkeer (Tag Assistant,
  previews) telt bewust niet mee in de rapportage.
- `app/lib/sitePages.js` is de enige lijst van publieke pagina's (SEO-02).
  Een nieuwe pagina hoort daar ook in; `test/sitePages.test.js` faalt anders.
- `/api/cron/daily` weigert zonder `CRON_SECRET` (CRON-01). Niet "tijdelijk"
  openzetten: dan kan iedereen de ochtendmail laten versturen.

---

## CONTENT-01 · Naam, foto en KvK-nummer

Wacht op materiaal. Zodra er een KvK-nummer is:

- in de footer (`app/components/MarketingChrome.jsx`), de privacyverklaring
  (sectie "Wie zijn wij?") en de LocalBusiness-data in
  `app/components/HomeClient.jsx` (`identifier`, en `address` als er een
  vestigingsadres is). Volgens de KvK hoort het nummer op de website te staan.
- Op `/over-ons` de sectie "Achtergrond" aanvullen met naam en foto; de site
  belooft "één vast contactpersoon" maar noemt die nergens.

## CONTENT-02 · Eigen foto's

De landingspagina's hebben geen enkele afbeelding en de homepage gebruikt een
stockfoto. Eigen foto's (van aangekochte woningen, met toestemming, of van de
regio) maken vooral de regiopagina's herkenbaarder.

## SEO-03 · Verder samenvoegen na Search Console

In 5.6.0 zijn alleen de zeven pagina's samengevoegd die geen aanvragen
opleverden en dezelfde zoekintentie hadden. Of bijvoorbeeld
"binnen-24-uur"/"binnen-1-week" en "bij-erfenis"/"na-overlijden" ook samen
moeten, hangt af van wat er per pagina in Google Search Console binnenkomt.
Een nieuwe samenvoeging is één regel in `MERGED_PAGES`.

## Ook opgemerkt, jouw keuze

- De CSP in `next.config.mjs` staat in report-only. Sinds 5.6.0 komen de
  meldingen in Sentry binnen. Zet hem om naar `Content-Security-Policy`
  zodra daar enkele weken geen meldingen meer verschijnen, en pas de hostlijst
  aan op wat je in die periode daadwerkelijk hebt zien blokkeren.
- Krijgt de Facebookpagina een gebruikersnaam, pas dan de `sameAs`-URL in
  `app/components/HomeClient.jsx` aan (nu `profile.php?id=61590760926991`).
