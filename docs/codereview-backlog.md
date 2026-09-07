# Codereview-backlog

Alle zeventien bevindingen uit de codereview van 5.1.1 zijn opgelost: elf in
5.2.0, drie in 5.2.3 en de laatste drie structurele in 5.3.0 en 5.3.1. Wat
hieronder staat zijn de punten die daarna zijn opgekomen.

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

---

## LINT-01 · ESLint naar flat config

`.eslintrc.json` is het oudere eslintrc-formaat en `"lint": "next lint"` is in
Next 15.5 afgeschreven (weg in 16). Linten draait daarom als informatieve,
niet-blokkerende stap in de CI en zit niet in `npm run check`.

Wat de overstap vraagt:

1. `@eslint/eslintrc` als **gedeclareerde** devDependency toevoegen. Die zit nu
   alleen als transitieve dependency van eslint in de lockfile; eruit importeren
   zonder declaratie is fragiel, en toevoegen aan `package.json` zonder de
   lockfile te regenereren breekt `npm ci`. Draai dus `npm install` en commit de
   nieuwe lockfile mee.
2. `eslint.config.mjs` schrijven met `FlatCompat` rond `eslint-config-next`.
3. `.eslintrc.json` verwijderen en `"lint"` op `eslint .` zetten.
4. Pas als dat lokaal groen draait: `continue-on-error` uit de CI-stap halen en
   lint terugzetten in `npm run check`.

## TEST-01 · Geen tests op de rekenfuncties in leadDetail

`calculateNetComparison`, `calculateSellerWorkTotal` en `calculateResaleExample`
hebben sinds 5.3.1 dekking in `test/proposalBerekening.test.js`, maar
`buildCalculatedProposalPayload`, `normalizeProposalForForm` en
`applyAdditionalAgreementDefaults` nog niet. Dat is de logica die bepaalt wat er
bij het opslaan van een voorstel in de database belandt.

## Ook opgemerkt, jouw keuze

- Eén gedeeld `ADMIN_PASSWORD` zonder accounts of tweestapsverificatie is de
  zwakste schakel in de adminomgeving. Werkbaar bij één gebruiker; zodra er een
  tweede bij komt, zijn echte accounts nodig. Dit is een productbeslissing,
  geen refactor — niet zelf inbouwen.
- De CSP in `next.config.mjs` staat in report-only. Zet hem om naar
  `Content-Security-Policy` zodra er enkele weken geen meldingen meer
  binnenkomen, en pas de hostlijst aan op wat je in die periode daadwerkelijk
  hebt zien blokkeren.

- `app/lib/admin/leadDetail.js` importeert `../date.js` en `../money.js` mét
  extensie en is daarmee los te testen onder `node --test`. Er staan nog geen
  tests op de rekenfuncties (`calculateNetComparison`,
  `calculateSellerWorkTotal`, `calculateResaleExample`) — dat is de logica
  achter de bedragen die de klant in het voorstel ziet.
