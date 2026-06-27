# vastgoeddirectnederland.nl — Neon-versie

Deze versie is gecontroleerd voor de overstap naar Neon Postgres.

## Belangrijkste wijzigingen

- Formulier op de website verstuurt naar `/api/leads`.
- Leads worden opgeslagen in Neon via `DATABASE_URL`.
- Adminomgeving blijft intern beschikbaar via `/admin`.
- Adminomgeving is uitgesloten van indexatie via metadata en robots.
- Oude database-imports zijn verwijderd en vervangen door Neon-code.
- `package.json` gebruikt vaste versies, zodat Vercel-builds minder snel breken door updates van `latest`.

## Installatie

1. Pak deze zip uit.
2. Upload de inhoud naar de hoofdmap van de GitHub repository.
3. Voer `neon/schema.sql` uit in Neon Console > SQL Editor.
4. Zet in Vercel bij Environment Variables minimaal:

```txt
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=zelf-kiezen
ADMIN_SESSION_SECRET=lange-willekeurige-tekst
NEXT_PUBLIC_SITE_URL=https://www.vastgoeddirectnederland.nl
```

Optioneel voor e-mail via Resend:

```txt
RESEND_API_KEY=re_...
FROM_EMAIL=Vastgoed Direct Nederland <info@vastgoeddirectnederland.nl>
LEAD_TO_EMAIL=info@vastgoeddirectnederland.nl
```

## Controle na deploy

1. Open de website.
2. Vul een testaanvraag in.
3. Controleer of de lead zichtbaar is in `/admin`.
4. Controleer in Vercel of de build zonder module-fouten doorloopt.

## Let op

GitHub upload verwijdert geen oude bestanden. Als er nog een oude losse map `/lib` in de hoofdmap staat door eerdere uploads, mag die worden verwijderd. De juiste map is `app/lib`.


## Opgeloste Vercel npm-timeout

In een eerdere versie verwees `package-lock.json` naar een interne npm-registry. Deze versie gebruikt publieke npm-resolved URLs en bevat ook `.npmrc` met `registry=https://registry.npmjs.org/`. Upload ook `package-lock.json` opnieuw zodat de oude lockfile wordt overschreven.
