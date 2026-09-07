# vastgoeddirectnederland.nl

Versie: 5.3.1

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
npm run dev      # lokale ontwikkelserver
npm test         # unit-tests (Node testrunner)
npm run build    # productiebuild
npm run check    # test + build achter elkaar
```

ESLint is ingericht via `.eslintrc.json` (`next/core-web-vitals`). `npm run lint`
werkt, maar is bewust geen onderdeel van `npm run check` en blokkeert de CI niet:
`next lint` is in Next 15.5 afgeschreven en `.eslintrc.json` is het oudere
formaat. In de CI draait linten als informatieve stap. Zie
`docs/codereview-backlog.md` voor wat de overstap naar flat config vraagt.

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

## Beveiliging

- `/admin` en `/api/admin/*` gaan door `middleware.js`, die controleert of het
  sessiecookie bestaat. De echte HMAC-verificatie zit in `isAdminAuthenticated()`
  per pagina en per route — middleware draait op de edge runtime, waar
  `node:crypto` niet beschikbaar is.
- Het sessietoken bevat een vingerafdruk van `ADMIN_PASSWORD`. Wijzig je dat
  wachtwoord in Vercel, dan vervallen alle lopende sessies.
- De Content Security Policy in `next.config.mjs` staat bewust in **report-only**,
  omdat Google Ads en de Meta Pixel inline scripts injecteren. Zet hem pas om
  naar de harde variant als er enkele weken geen meldingen meer komen.

## Documentatie

- `CHANGELOG.md` — wijzigingen per versie.
- `docs/codereview-backlog.md` — de openstaande punten uit de codereview, met
  bestandslocatie en voorgestelde fix.
- `docs/changelog/` — de losse patchbestanden van vóór 5.2.0.
