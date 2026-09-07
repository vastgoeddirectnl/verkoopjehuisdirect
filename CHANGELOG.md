# Changelog

Vanaf 5.2.0 wordt alles in dit ene bestand bijgehouden. De losse
`README_*`-bestanden van eerdere patches staan in `docs/changelog/`.


## 5.5.0

De rest van de codereview-backlog (LINT-01, MON-01, TEST-01) plus 2FA op
`/admin`. Geen migratie. Twee nieuwe dependencies: `@sentry/nextjs` en
`@eslint/eslintrc` (dev), beide met geregenereerde lockfile.

### Tweestapsverificatie op /admin

`ADMIN_PASSWORD` zonder tweede factor was de zwakste schakel in de
adminomgeving (zie de vorige versie van deze backlog). `/admin` vraagt nu ook
een 6-cijferige TOTP-code, naast het wachtwoord, in dezelfde inlogstap.

Nieuw: `app/lib/totp.js`, een eigen RFC 6238/4226-implementatie op
`node:crypto` — geen dependency, en rechtstreeks testbaar onder `node --test`
net als `app/lib/adminAuth.js`. `npm run totp:generate` genereert een nieuw
secret plus de otpauth-URL voor een authenticator-app. Zelfde model als
`ADMIN_PASSWORD`: één gedeeld secret via een env-variabele, geen aparte
accounts. `ADMIN_TOTP_SECRET` is nu verplicht — zonder die variabele geeft
`/api/admin/login` een 503, precies zoals nu al gebeurt zonder
`ADMIN_PASSWORD` of `ADMIN_SESSION_SECRET`. **Zet dit secret dus vóór het
deployen van deze versie**, anders is `/admin` niet meer bereikbaar.

### MON-01: Sentry naast de eigen foutmelding

`reportError()` blijft ongewijzigd de enige plek waar fouten worden gemeld;
met `SENTRY_DSN` gezet gaat elke melding er nu ook naartoe
(`Sentry.captureException`, met scope en context als tags/extra). Zonder DSN
wordt `@sentry/nextjs` niet eens geïmporteerd — lokaal en in de CI-tests
verandert er dus niets.

Voor de App Router (Next 15) is dat meer dan de oorspronkelijke aantekening
in de backlog beschreef: sinds `@sentry/nextjs` 8 is de auto-geladen
`sentry.client.config.js` vervangen door `instrumentation.js` (server/edge)
en `instrumentation-client.js` (browser, `NEXT_PUBLIC_SENTRY_DSN`), en is
`app/global-error.jsx` de aanbevolen vangnet voor React-renderfouten.
`next.config.mjs` is gewrapt in `withSentryConfig`; zonder
`SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN` slaat de build het
uploaden van source maps stilletjes over. De bestaande storingsmail bij
`severity: "critical"` blijft daarnaast bestaan.

### LINT-01: ESLint op flat config

`eslint.config.mjs` vervangt `.eslintrc.json`, via `FlatCompat` rond
`next/core-web-vitals` (`eslint-config-next` levert in deze versie nog geen
eigen flat config). `@eslint/eslintrc` is als devDependency toegevoegd.
`npm run lint` draait weer mee in `npm run check`, en de CI-stap blokkeert
nu net als de rest.

### TEST-01: dekking op wat er in het voorstel belandt

`buildCalculatedProposalPayload`, `normalizeProposalForForm` en
`applyAdditionalAgreementDefaults` (`app/lib/admin/leadDetail.js`) bepalen
wat er bij het opslaan van een voorstel echt in de database komt, en hadden
nog geen tests. Twintig tests in `test/proposalPayload.test.js` dekken onder
meer: een onherkenbaar bedrag wordt niet stilletjes leeggemaakt, een lang
ISO-tijdstip uit de database wordt afgekapt tot een formulierdatum, en het
meegegeven lead-object wint altijd van een `lead_id` dat al in een opgeslagen
voorstel stond.

## 5.4.0

De drie punten die na de live-controle overbleven. Geen migratie, geen nieuwe
dependency.

### Je merkt het nu als er iets stukgaat

Alle catch-blokken schreven naar `console.error` of `console.warn`. Dat landt in
de Vercel-logs waar in de praktijk niemand naar kijkt, dus je hoorde van een
klant dát er iets mis was.

Nieuw: `app/lib/reportError.js`. Elke melding gaat als JSON naar de logs met de
tag `[vdn-error]`, zodat je erop kunt filteren. Bij `severity: "critical"` gaat
er ook een e-mail naar `LEAD_TO_EMAIL`, met throttling van één melding per half
uur per soort fout — anders vult één kapotte query je inbox.

Als kritiek aangemerkt: een aanvraag die niet is opgeslagen (`api/leads`, alleen
bij 5xx — een 4xx is een invoerfout van de bezoeker), beide mails in de
leadketen, de adminroute, en uitgeschakelde rate limiting.

Bewust **geen Sentry**: dat vraagt `@sentry/nextjs` als dependency en dus een
geregenereerde lockfile. `reportError()` is het enige aanroeppunt, dus die
overstap raakt later alleen dat ene bestand. Zie MON-01 in de backlog.

### Het kritieke pad heeft eindelijk een test

De validatie was getest, de query was getest, de bedragen waren getest — maar
niet de kéten van formulier naar database naar mail. Precies het stuk waar een
fout je een aanvraag kost.

De volgorde staat nu in `app/lib/leadFlow.js`, los van database en mail: alles
wat naar buiten praat komt als functie binnen. `app/lib/leads.js` levert de
echte implementaties. Daarmee is de bedrijfsregel in één blok leesbaar én
testbaar zonder database. Twaalf tests dekken onder meer: een dubbele aanvraag
levert geen tweede mail op, een falende automatisering kost de lead niet, en een
mislukte interne melding houdt de bevestiging aan de klant niet tegen.

### Paginatitels (SEO-01)

33 van de 43 publieke pagina's kwamen boven de 60 tekens uit, tot 88 aan toe,
omdat de landingspagina's zelf al een titel als `"Huis verkopen in Groningen |
vrijblijvend verkoopvoorstel"` zetten waar de template nóg eens de merknaam
achter plakte. Google kapt rond de 60 af, dus juist de merknaam viel weg.

De generieke staart is eraf; de zoekwoorden staan vooraan. En de homepage — die
als enige géén merknaam had, omdat `title.template` niet geldt voor het segment
waarin de layout zelf staat — zet zijn titel nu met `absolute`.

`test/paginaTitels.test.js` bewaakt dit: elke publieke pagina heeft een titel,
geen enkele boven 60 tekens, de merknaam staat er precies één keer in, en geen
twee pagina's delen een titel.

### Tests

Van 124 naar 149, allemaal groen met `npm test`. Nieuw: `leadFlow` (12),
`reportError` (8), `paginaTitels` (5), plus de bestaande suites.

Eén bevinding uit het schrijven van die tests: `reportError` viel zelf om als het
foutobject een kapotte `toString` had. Foutafhandeling die zelf de fout wordt is
erger dan de oorspronkelijke fout, dus dat is afgeschermd.


## 5.3.2

Twee correcties op `/over-ons`, gevonden bij een controle van die pagina op de
live site. Alleen die ene pagina wijzigt; geen migratie, geen gedragswijziging
elders.

- **De paginatitel noemde het merk twee keer.** `app/layout.jsx` plakt
  `" | Vastgoed Direct Nederland"` achter elke titel, en de pagina zette daar
  zelf al "Over Vastgoed Direct Nederland" neer. In de browsertab stond
  "Over Vastgoed Direct Nederland | Vastgoed Direct Nederland" (58 tekens). De
  titel is nu "Over ons", wat via de template "Over ons | Vastgoed Direct
  Nederland" oplevert. De openGraph-titel valt buiten die template en noemt het
  merk wel voluit.

- **Eén opsommingsregel liep over twee regels en paste maar net.** De kaarten
  onder "Wanneer directe verkoop past" hebben `overflow: hidden`; gemeten op de
  live pagina was de inhoud 229px in een kaart van 231px. Twee pixels speling,
  dus bij een afwijkend lettertype of grotere standaardtekengrootte was die
  laatste regel stil weggevallen. De regel is ingekort tot één regel.

Verder is bij die controle vastgesteld dat de rest van 5.3.1 live doet wat het
moet: de middleware stuurt `/admin/nieuwe-lead` uitgelogd door naar het
inlogscherm, er laadt geen enkel Google- of Meta-script vóór toestemming, de
sitemap bevat 43 pagina's inclusief `/over-ons`, en de skip-link werkt met een
bestaand doel. Zie ook SEO-01 in `docs/codereview-backlog.md`: de titels van de
landingspagina's zijn structureel te lang.


## 5.3.1

Onderhoudsrelease: performance, tekstuele rust en consistentie. Geen nieuwe
functionaliteit en **geen database-migratie** — de bestaande indexen dekken de
nieuwe query's al.

### Adminactie-afhandeling aangescherpt

De regel "een klantactie is afgehandeld zodra er contact is vastgelegd" stond
op drie plekken los gedefinieerd: in `leadDetail.js`, in `LeadTimeline.jsx` en
inline in het actiecentrum. Nu één bron, `app/lib/admin/customerActions.js`.

Daarbij is een gat gedicht: bij een **tweede** klantactie op hetzelfde voorstel
werd de bestaande automatische taak hergebruikt zonder de aanmaakdatum te
verversen. Het overzicht vergelijkt `last_contact_at` met die datum, dus een
ouder contactmoment liet de nieuwe actie meteen als afgehandeld tellen: het
actiecentrum toonde "actie nodig", terwijl de takenteller op 0 bleef staan.
`app/api/proposal/[token]/action/route.js` zet nu `created_at` opnieuw.

### listLeads-performance verbeterd (ARCH-06)

De drie subquery's groepeerden eerst *alle* rijen in `tasks`, `proposals` en
`mail_logs` en joinden dat pas daarna aan de maximaal 300 getoonde leads. De
querybouw staat nu in `app/lib/leadsQuery.js` en bepaalt eerst de pagina leads
(CTE), waarna drie LATERAL-joins alleen voor die leads rekenen.

Gemeten op een lokale PostgreSQL 16 met het echte schema, oude versus nieuwe
query, snelste van vijf runs:

| Omvang                        | Oud    | Nieuw   |
|-------------------------------|--------|---------|
| 5.000 leads, 65k historie     | 45 ms  | 4,9 ms  |
| 5.000 leads, 260k historie    | 150 ms | 12,5 ms |
| 25.000 leads, 400k historie   | 291 ms | 13,2 ms |

Het punt is niet de factor maar de vorm: de oude query werd trager naarmate de
hele historie groeide, de nieuwe blijft vlak bij meer leads. Beide versies zijn
op acht filtercombinaties (archief, status, zoeken, limiet) rij voor rij
vergeleken en gaven identieke uitvoer.

### Tekstuele opschoning klantvoorstel

- Het blok "Meer zekerheid bij overeenstemming" herhaalde de juridische
  slotbepaling woordelijk. Het is nu kort en klantgericht en verwijst naar de
  slotbepaling, die de precieze formulering één keer bevat.
- De toelichting op btw en kosten stond in twee varianten in de code: een korte
  op de klantpagina en een langere in de print. Nu één gedeelde tekst, dus wat
  de klant online leest is gelijk aan wat er wordt afgedrukt.
- De inleiding op de netto-opbrengstvergelijking is ingekort.

Alle juridische kernpunten zijn behouden: vrijblijvend en niet-bindend, een
koopovereenkomst pas na uitwerking en ondertekening, in beginsel zonder
ontbindende voorbehouden aan koperszijde tenzij schriftelijk anders
overeengekomen, en het voorbehoud van juridische, fiscale en notariële
uitvoerbaarheid.

### Woning/object-consistentie

De vaste teksten in `proposalContent.js` gingen niet door `objectAwareText` en
noemden zelf "woning". Ze zijn nu termneutraal. Een test controleert dat geen
enkel label en geen enkele controleregel bij een woon-winkelpand nog "woning"
zegt, en dat een gewone woning niet wordt herschreven naar "object".

### WhatsApp-flow robuuster

De voorstelbeheerpagina riep de logactie aan zonder erop te wachten en opende
tegelijk het tabblad, waardoor de fetch kon sneuvelen. Beide plekken lopen nu
via `app/lib/admin/whatsapp.js`: eerst vastleggen, dan pas openen. Een mislukte
logactie blokkeert het openen niet, maar wordt wel gemeld.

Terminologie gelijkgetrokken: "voorbereid" en "geopend" voor het klaarzetten,
en "verzonden" uitsluitend als de admin dat zelf markeert — WhatsApp bevestigt
niets, dus dat mogen we nooit zelf concluderen. De knop heet nu overal
"Markeer als handmatig verzonden".

### Adminformulier rustiger

De helptekst bij de netto-opbrengstvergelijking was één alinea van 792 tekens,
gevolgd door twee alinea's die dezelfde regels herhaalden. Dat is nu een korte
inleiding met vier scanbare regels. De sectie "Gebruik, verhuur en oplevering"
herhaalde zijn eigen intro woordelijk in de slotregel. In totaal ging de
lopende helptekst van ongeveer 1.830 naar 854 tekens; geen enkel veld en geen
enkele juridische nuance is verdwenen.

### Extra tests

Van 59 naar 124 tests, allemaal groen met `npm test`:

- `leadsQuery` — kolommen, filters, parameternummering, limietklem
- `customerActions` — open versus afgehandeld, prioriteiten, tijdlijnaanduiding
- `whatsapp` — de volgorde loggen-dan-openen, en het gedrag bij een logfout
- `proposalBerekening` — btw, netto-opbrengst, herstelkosten op nul,
  huurnotatie, geldigheid in dagen, verlopen voorstel blokkeert de klantactie
- `objectTermen` — woning versus object in labels, lopende tekst en
  controleregels

### Overig

- Nieuwe pagina `/over-ons`, opgebouwd met bestaande klassen uit `globals.css`.
  Zonder teamfoto's, namen of stockbeelden die een team suggereren dat er niet
  is. Opgenomen in de sitemap en de footer.
- `app/lib/reviewData.js` heeft een expliciete controle-instructie en een
  `checkedOn`-veld. De ProofBar toont het reviewblok alleen als score én aantal
  zijn ingevuld, zodat er nooit een niet-onderbouwde claim verschijnt.
- `npm run check` draait weer `npm test && npm run build`, zonder lint. Linten
  staat in de CI als informatieve, niet-blokkerende stap: `next lint` is in
  Next 15.5 afgeschreven en `.eslintrc.json` is het oudere formaat. De
  overstap naar flat config vraagt `@eslint/eslintrc` als gedeclareerde
  devDependency en dus een nieuwe lockfile; dat staat in de backlog.
- CSP blijft report-only, admin en voorstelpagina's blijven noindex.


## 5.3.0

De structurele opruiming uit de codereview. Vijf van de zes openstaande punten
zijn opgelost. Geen database-migratie nodig, maar dit raakt vrijwel de hele
adminomgeving en de voorstelweergave — draai `npm run check` en klik het
voorstel- en leadscherm door voordat je deployt.

### Voorstelweergave ontdubbeld (ARCH-01)

`app/voorstel/[token]/page.jsx` en `app/admin/voorstellen/[id]/print/page.jsx`
deelden 24 identieke helperfuncties en ongeveer 750 gelijke regels opmaak. Alles
staat nu één keer in `app/components/proposal/`:

- `ProposalDocument.jsx` — de volledige opmaak, met `variant="public"` of
  `variant="print"`
- `proposalFormat.js` — bedragen, percentages, datums en oppervlaktes
- `proposalContent.js` — tekstopbouw, constructiechecks en objecttermen
- `PrintButton.jsx` — de twee kopieën samengevoegd

De pagina's zelf zijn nog 27 en 19 regels. De authenticatiecontrole op de
printpagina, de `isUuid`-controle, `noindex` en `force-dynamic` zijn ongewijzigd
meegegaan, net als de `admin_preview`-vlag.

### Eén geldparser (ARCH-02)

`app/lib/money.js` is de enige implementatie geworden. `parseProposalMoney`
(validatie), `parseMoney` (voorstelweergave), `parseNonNegativeNumber`
(v2-route) en de helpers in `app/lib/admin/leadDetail.js` verwijzen er nu
allemaal naar. `parsePercent` staat er bewust naast, zodat een percentageveld
niet per ongeluk als bedrag wordt gelezen. Er zijn tests bijgekomen in
`test/money.test.js`.

### Gedeelde statuslijsten (ARCH-03)

`app/lib/leadStatus.js` bevat nu de canonieke `LEAD_STATUSES`,
`ARCHIVE_LEAD_STATUSES` en `LEGACY_STATUS_LABELS`. De kopieën in
`app/admin/page.jsx`, `app/api/admin/v2/route.js`, `app/lib/leads.js` en
`app/lib/automation.js` zijn vervangen door imports.

### Adminscherm opgesplitst (ARCH-05)

`app/admin/leads/[id]/page.jsx` is van 1293 naar 529 regels gegaan. De rest zit
in `app/components/admin/` (`LeadHeader`, `LeadContactForm`, `LeadDetailFields`,
`ProposalForm`, `TaskPanel`, `MailHistory`) en in `app/lib/admin/leadDetail.js`.
De `<style>{styles}</style>`-blokken zijn verdwenen: alle adminstyling staat nu
in `app/admin/admin.css`, één keer geïmporteerd in `app/admin/layout.jsx`.

### E-mail blokkeert de aanvraag niet meer (OPS-02)

De interne melding en de ontvangstbevestiging gaan via `after()` uit
`next/server`, dus nadat de bezoeker zijn bevestiging heeft gezien. De lead
wordt nog steeds vóór de response opgeslagen.

### Testbaarheid en linten

- `isAdminAuthenticated()` importeert `next/headers` dynamisch in plaats van
  op moduleniveau. Daardoor zijn `createAdminToken`, `verifyAdminToken` en
  `safeEqualText` los te testen onder gewone `node --test`. Let op de keerzijde:
  waar een top-level import bij de build zou klagen als dit bestand in een
  client-component belandt, gebeurt dat nu pas op runtime.
- Relatieve imports in de nieuwe libs hebben een `.js`-extensie, zodat Node's
  ESM-loader ze kan laden.
- **ESLint is ingericht** (`.eslintrc.json` met `next/core-web-vitals`,
  `eslint` en `eslint-config-next` als devDependencies). Linten draait nu in
  `npm run check` én in de CI-workflow.
- Het aantal tests is van 49 naar 59 gegaan.

### Opgeruimd

- `.claude/` staat in `.gitignore` en zit niet meer in de release.

### Nog open

- **ARCH-06** — `listLeads` in `app/lib/leads.js` aggregeert nog steeds alle
  rijen in `tasks`, `proposals` en `mail_logs` voordat het resultaat aan de
  maximaal 300 getoonde leads wordt gekoppeld. Zie
  `docs/codereview-backlog.md`.
- De CSP staat nog in report-only. Zet hem om zodra je de meldingen een aantal
  weken hebt bekeken.


## 5.2.3

Drie kleine verbeteringen uit de codereview. Geen database-migratie nodig, maar
dit is wel de eerste 5.2.x met codewijzigingen: draai `npm run build` voordat je
deployt.

- **De Content Security Policy is nauwkeuriger.** `api.pdok.nl` stond in
  `connect-src`, terwijl de adrescontrole via `/api/address` loopt en de browser
  die host dus nooit aanroept. Die is eruit. Toegevoegd zijn de hosts die wél
  vanuit de browser worden geladen: `www.google.com` en `www.google.nl` voor de
  conversiepixels, `www.facebook.com` voor de Meta-pixel, en een expliciete
  `frame-src` — zonder die regel valt frame-laden terug op `default-src 'self'`
  en blokkeert de policy de iframes die beide pixels gebruiken.
  De header blijft in **report-only**. Wat er in die periode aan meldingen
  binnenkomt is de enige betrouwbare lijst; pas die aan voor je omzet naar de
  harde variant.

- **`/regios` en `/situaties` hebben nu openGraph-tags.** Beide hubpagina's
  hadden al een title, description en canonical, maar misten het og-blok dat de
  andere veertig publieke pagina's wel hebben. Bij delen op WhatsApp, LinkedIn of
  Facebook levert dat nu een nette kaart op in plaats van een kale link.

- **De privacyverklaring benoemt de verwerkers.** Paragraaf 5 noemde
  "technische dienstverleners" in algemene termen; Vercel (hosting), Neon
  (database) en Resend (e-mail) staan er nu bij naam in, met een zin over
  verwerking binnen de EER. **Laat deze tekst juridisch controleren** — hij is
  door een niet-jurist opgesteld, en de zin over de standaardcontract­bepalingen
  klopt alleen als je verwerkersovereenkomsten dat ook daadwerkelijk regelen.


## 5.2.2

Documentatiecorrectie. Geen codewijzigingen, geen database-migratie, geen
gedragsverandering — deploy is optioneel en risicoloos.

- **De README beschreef `npm run check` als "lint + test + build"**, terwijl het
  script sinds 5.2.1 alleen `npm test && npm run build` draait. Dat is
  rechtgezet, met de reden erbij waarom linten voorlopig uit zowel `check` als
  de CI-workflow is gehaald en waar het straks weer bij moet.
- **De motivatie voor het testcommando in 5.2.1 is aangescherpt.** Er stond dat
  Node de map `test/` als module zou proberen te laden; dat klopt niet, een
  mapargument werkt op Node 22 gewoon. De echte reden is voorspelbaarheid over
  Node-versies heen. De kanttekening over shell-globs onder Windows staat er
  weer bij.


## 5.2.1

Kleine CI-correctie op 5.2.0. Er is geen functionaliteit gewijzigd en er is geen database-migratie nodig.

- `npm test` gebruikt nu expliciet `node --test test/*.test.js` in plaats van
  `node --test test/`. Een mapargument werkt op Node 22 op zichzelf prima; het
  expliciete patroon is gekozen omdat het over Node-versies heen voorspelbaar
  hetzelfde doet. Let op dat dit een shell-glob is: lokaal, in GitHub Actions
  en op Vercel wordt die uitgebreid, onder Windows `cmd.exe` niet.
- `npm run check` draait voorlopig `npm test && npm run build`. De lint-stap is
  bewust uit `check` gehaald totdat ESLint daadwerkelijk is ingericht. De
  GitHub Action draaide al alleen tests en build.

## 5.2.0

Deze versie is het resultaat van een codereview. Er is geen functionaliteit
bijgekomen; het gaat om beveiliging, betrouwbaarheid en opruimen.

### Beveiliging

- **De print-pagina van een voorstel vraagt nu om een login.**
  `app/admin/voorstellen/[id]/print/page.jsx` was een server-component die
  klantgegevens (naam, e-mail, telefoon, adres, bedrag) uit de database
  renderde zonder authenticatiecontrole. Er staat nu een
  `isAdminAuthenticated()`-controle bovenaan die een 404 geeft in plaats van
  een 401, zodat niet te achterhalen is of een id bestaat.

- **Nieuwe `middleware.js`** die `/admin/:path+` en `/api/admin/:path*`
  afvangt. Die controleert alleen of het sessiecookie bestaat — middleware
  draait op de edge runtime, waar `node:crypto` niet beschikbaar is. De echte
  HMAC-verificatie blijft in `isAdminAuthenticated()` per pagina en per route.
  `/admin`, `/api/admin/login` en `/api/admin/logout` blijven open.

- **Een wachtwoordwijziging maakt lopende sessies nu ongeldig.** Het
  sessietoken bevat een korte vingerafdruk van `ADMIN_PASSWORD`. Gevolg bij
  deployen: alle bestaande adminsessies vervallen en iedereen moet één keer
  opnieuw inloggen. Dat is de bedoeling.

- **`Strict-Transport-Security` toegevoegd** en `poweredByHeader` uitgezet in
  `next.config.mjs`.

- **Content Security Policy toegevoegd in report-only.** Google Ads en de Meta
  Pixel injecteren inline scripts, dus een harde policy breekt de
  conversiemeting. Laat dit enkele weken meelopen, bekijk de meldingen in de
  browserconsole en zet de header daarna pas om naar
  `Content-Security-Policy`.

- **`.gitignore` toegevoegd.** Die ontbrak volledig. Controleer eenmalig met
  `git ls-files | grep -E "node_modules|\.next/|\.env"` of er niet al iets in
  de historie staat; zo ja, dan zijn de secrets in die bestanden gelekt en
  moeten ze geroteerd worden.

### Betrouwbaarheid

- **Een falende rate limiter kost geen lead meer.** `hashIdentity()` stond
  buiten de `try` in `enforceRateLimit` en gooide in productie als beide
  secrets ontbraken; `/api/leads` gaf dan een 500 terwijl de bezoeker dacht te
  hebben verzonden. De aanvraag gaat nu door en de fout gaat naar de logs.

- **De bulk-automatisering loopt niet meer over de tijdslimiet.**
  `refreshAllLeadAutomation` verwerkt maximaal 200 leads met een tijdsbudget
  van 20 seconden, slaat gearchiveerde leads over en werkt de oudste
  `last_automation_at` het eerst bij. Daardoor pakt elke volgende run vanzelf
  de rest op. De v2-route heeft `maxDuration = 60`.

- **De v2-route logt fouten.** Beide catch-blokken gaven een 500 zonder
  `console.error`, terwijl alle adminlogica daar doorheen loopt.

### Structuur en onderhoud

- **`app/lib/leadValidation.js` afgesplitst** van `app/lib/leads.js`.
  `normalizeLead` en `validateLead` staan nu in een bestand zonder imports en
  zijn daardoor los te testen. `leads.js` importeert en her-exporteert ze, dus
  bestaande imports blijven werken.

- **Tests toegevoegd** in `test/`, uit te voeren met `npm test`. Dekking:
  datumberekening rond de zomertijdgrens, het parsen van bedragen en de
  voorstelvalidatie, de leadvalidatie, het sessietoken en de
  bron-attributie. 49 tests.

- **`"type": "module"` in `package.json`.** Nodig om de tests met de ingebouwde
  testrunner van Node te draaien. De hele codebase was al ESM en er staat geen
  CommonJS in; Next bundelt zelf en is hier niet gevoelig voor. Wel het punt om
  bij deze release expliciet op te letten in de build.

- **GitHub Action toegevoegd** die op elke push `npm test` en `npm run build`
  draait. Linten staat er bewust nog niet in: `npm run lint` werkt pas nadat
  ESLint eenmalig is opgezet met `npx next lint`.

- **Toegankelijkheid**: skip-link naar de hoofdinhoud in de gedeelde header, en
  ondersteuning voor `prefers-reduced-motion`. Dat vangt onder meer de
  `scrollIntoView({ behavior: "smooth" })` in `ProposalActions` af.

### Verwijderd

Alles hieronder was aantoonbaar nergens meer naar verwezen.

- `app/api/admin/leads/[id]/route.js` — deed dezelfde update als de v2-route,
  maar zonder de status-whitelist en zonder e-mailvalidatie.
- `app/api/admin/leads/route.js` — ongebruikte GET-lijst.
- `app/api/lead-email/route.js` — ongebruikt.
- `app/components/ConversionLink.jsx` — ongebruikt.
- `app/components/seo/SeoReviewBand.jsx` — ongebruikt.
- `app/huis-verkopen-zonder-bezichtigingen-uitleg/` — al 301-doorgestuurd in
  `next.config.mjs`, stond niet in de sitemap en had geen interne links. De
  redirect blijft staan voor oude inkomende links.
- `verkoopjehuisdirect-seo-landingspagina-referentie.patch` (79 kB).
- 52 losse `README_*`- en `CHANGELOG_*`-bestanden verplaatst naar
  `docs/changelog/`.

`app/api/lead/route.js` is bewust blijven staan: die alias wordt in de code
niet meer gebruikt, maar een oude gecachte pagina kan er nog naartoe posten.

### Nog open uit de review

Deze punten zijn bewust niet meegenomen omdat ze een build- en testronde
vragen. Ze staan met codefragmenten beschreven in
`docs/codereview-backlog.md`.

- ARCH-01 — de voorstelweergave staat dubbel in `app/voorstel/[token]/page.jsx`
  en de admin-printpagina: 24 identieke helpers en ~750 gelijke regels.
- ARCH-02 — drie verschillende geldparsers.
- ARCH-03 — statuslijsten op meerdere plekken.
- ARCH-05 — client-component van 1293 regels en CSS in strings.
- ARCH-06 — `listLeads` aggregeert de hele database.
- OPS-02 — de twee e-mails bij een nieuwe lead blokkeren nog de response.

## Eerder

Zie `docs/changelog/` voor de losse patchbestanden tot en met 5.1.1.
