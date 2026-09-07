# vastgoeddirectnederland.nl

Versie: 5.5.0

Next.js 15 (App Router) met Neon Postgres en Resend, gedeployd via GitHub naar
Vercel. De publieke site vangt aanvragen op; de adminomgeving op `/admin` bevat
leads, opvolging, verkoopvoorstellen en rapportage.

## Installatie

```bash
npm ci
npm run dev
```

Zet in Vercel bij Environment Variables minimaal:

```txt
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=zelf-kiezen
ADMIN_SESSION_SECRET=lange-willekeurige-tekst
ADMIN_TOTP_SECRET=via-npm-run-totp-generate
NEXT_PUBLIC_SITE_URL=https://www.vastgoeddirectnederland.nl
```

Optioneel:

```txt
RESEND_API_KEY=re_...
FROM_EMAIL=Vastgoed Direct Nederland <info@vastgoeddirectnederland.nl>
LEAD_TO_EMAIL=info@vastgoeddirectnederland.nl
RATE_LIMIT_SECRET=eigen-salt-voor-rate-limiting
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-...
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=...
NEXT_PUBLIC_META_PIXEL_ID=...
SENTRY_DSN=https://...@...ingest.sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@...ingest.sentry.io/...
```

`RATE_LIMIT_SECRET` valt terug op `ADMIN_SESSION_SECRET` als hij niet is gezet.
Zonder één van de twee draait de site door, maar zonder rate limiting; dat wordt
als fout gelogd.

## Database

Voor een **nieuwe** database: voer `neon/v3_2_full_setup.sql` in één keer uit in
Neon Console → SQL Editor. Voor een bestaande database: gebruik de losse
migraties in `neon/` in volgorde. Staat de live database al op V3.2, dan is voor
deze versie geen extra migratie nodig.

## Commando's

```bash
npm run dev            # lokale ontwikkelserver
npm test               # unit-tests (Node testrunner)
npm run lint           # ESLint (flat config)
npm run build          # productiebuild
npm run check          # test + lint + build achter elkaar
npm run totp:generate  # nieuw ADMIN_TOTP_SECRET genereren
```

ESLint draait sinds 5.5.0 (LINT-01) op flat config (`eslint.config.mjs`,
via `FlatCompat` rond `next/core-web-vitals`). `npm run lint` zit weer in
`npm run check` en blokkeert de CI.

## Tests

De tests in `test/` dekken de logica waar een fout direct geld of vertrouwen
kost: datumberekening rond de zomertijdgrens, het parsen van bedragen, de
voorstelvalidatie, de leadvalidatie, het sessietoken en de bron-attributie.

Ze draaien op de ingebouwde testrunner van Node, zonder extra dependencies.
Daarvoor staat `"type": "module"` in `package.json`. Let op: Node's eigen
ESM-loader eist bestandsextensies in relatieve imports, terwijl de Next-bundler
dat niet doet. Een module met extensieloze relatieve imports is daardoor niet
rechtstreeks te testen — vandaar dat `app/lib/leadValidation.js` los staat van
`app/lib/leads.js`.

## Foutmelding

Fouten lopen via `reportError()` in `app/lib/reportError.js`. Elke melding gaat
als JSON naar de logs met de tag `[vdn-error]`, zodat je in Vercel op die tag of
op een scope kunt filteren. Bij `severity: "critical"` gaat er daarnaast een
e-mail naar `LEAD_TO_EMAIL`, met maximaal één melding per half uur per soort
fout.

Kritiek zijn: een aanvraag die niet is opgeslagen, mail die niet is verzonden,
een omgevallen adminroute, en uitgeschakelde rate limiting. De rest is
waarschuwing en blijft in de logs.

Zoek bij een storing eerst op `[vdn-error]` in de Vercel-logs.

Sinds 5.5.0 (MON-01) gaat elke melding ook naar Sentry, als `SENTRY_DSN` is
gezet (`sentry.server.config.js`, `sentry.edge.config.js`, geladen vanuit
`instrumentation.js`; `instrumentation-client.js` gebruikt daarnaast
`NEXT_PUBLIC_SENTRY_DSN` voor fouten in de browser, en `app/global-error.jsx`
vangt React-renderfouten). Zonder DSN blijft dit ongewijzigd: geen import,
geen netwerkverkeer. De e-mailmelding bij `severity: "critical"` blijft
daarnaast bestaan.

## Beveiliging

- `/admin` en `/api/admin/*` gaan door `middleware.js`, die controleert of het
  sessiecookie bestaat. De echte HMAC-verificatie zit in `isAdminAuthenticated()`
  per pagina en per route — middleware draait op de edge runtime, waar
  `node:crypto` niet beschikbaar is.
- Het sessietoken bevat een vingerafdruk van `ADMIN_PASSWORD`. Wijzig je dat
  wachtwoord in Vercel, dan vervallen alle lopende sessies.
- Sinds 5.5.0 vraagt `/admin` naast het wachtwoord ook een TOTP-verificatiecode
  (`ADMIN_TOTP_SECRET`, `app/lib/totp.js`). Genereer een secret met
  `npm run totp:generate`, zet het als `ADMIN_TOTP_SECRET` in Vercel en voer
  het handmatig in bij een authenticator-app (Google Authenticator, Authy,
  1Password, ...). Zonder `ADMIN_TOTP_SECRET` geeft de inlogroute een 503,
  net als nu al gebeurt zonder `ADMIN_PASSWORD` of `ADMIN_SESSION_SECRET` —
  dit secret moet dus gezet zijn vóór je naar 5.5.0 deployt. Eén gedeeld
  secret, geen aparte accounts, zelfde model als het wachtwoord zelf; bij een
  tweede gebruiker zijn nog steeds echte accounts nodig (zie
  `docs/codereview-backlog.md`, historisch).
- De Content Security Policy in `next.config.mjs` staat bewust in **report-only**,
  omdat Google Ads en de Meta Pixel inline scripts injecteren. Zet hem pas om
  naar de harde variant als er enkele weken geen meldingen meer komen.

## Documentatie

- `CHANGELOG.md` — wijzigingen per versie.
- `docs/codereview-backlog.md` — de openstaande punten uit de codereview, met
  bestandslocatie en voorgestelde fix.
- `docs/changelog/` — de losse patchbestanden van vóór 5.2.0.
