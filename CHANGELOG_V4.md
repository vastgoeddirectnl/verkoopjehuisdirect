# Changelog V4

Deze versie bundelt de V3.2-code en de latere voorstelcorrecties tot één complete GitHub-versie.

## Belangrijkste onderdelen

- Publieke klantvoorstelpagina met duidelijke geldigheid: "Nog X dagen geldig".
- Duidelijke klantacties: "Akkoord met voorstel" en "Eerst bespreken".
- Bevestigingsstap bij akkoord, zodat één klik nog geen getekende koopovereenkomst is.
- Mobiele sticky CTA voor akkoord/bespreken.
- Meer zekerheid bij akkoord zichtbaar bij de netto-opbrengstvergelijking.
- Tekst over kopen zonder ontbindende voorbehouden aan koperszijde, tenzij schriftelijk anders overeengekomen.
- Netto-opbrengstvergelijking met neutrale rijtitel "Afwikkelingskosten verkoper".
- VDN-kolom: "Door VDN overgenomen indien afgesproken".
- Actuele huur wordt netjes geformatteerd, bijvoorbeeld "€ 2.500 per maand".
- Woning/object-terminologie wordt dynamisch aangepast voor woon-winkelpanden, gemengde objecten en bedrijfspanden.
- Voorstel-events voor bekijken, akkoord, bespreken, WhatsApp en print/PDF.
- Reacties op verlopen of niet-actieve voorstellen worden geblokkeerd.
- `/api/lead/route` gebruikt een directe `runtime = "nodejs"` export om de Vercel-waarschuwing te voorkomen.
- Persoonlijke voorstelpagina's zijn noindex/nofollow.

## Database

Voor een bestaande V3.1.1/V3.2-omgeving:

1. Controleer of `neon/v3_upgrade.sql` al is uitgevoerd.
2. Controleer of `neon/v3_2_upgrade.sql` al is uitgevoerd.
3. Is de database al op V3.2, dan is voor deze V4 geen extra migratie nodig.

Voor een nieuwe database kan `neon/v3_2_full_setup.sql` als complete setup worden gebruikt.

## Vercel environment variables

Minimaal nodig:

```txt
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
NEXT_PUBLIC_SITE_URL=https://www.vastgoeddirectnederland.nl
```

Aanbevolen/afhankelijk van gebruik:

```txt
RATE_LIMIT_SECRET=...
RESEND_API_KEY=...
FROM_EMAIL=Vastgoed Direct Nederland <info@vastgoeddirectnederland.nl>
LEAD_TO_EMAIL=info@vastgoeddirectnederland.nl
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18145688218
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=dgG6COuixMwcEJr1xMxD
```

## Test na deploy

- Homepageformulier invullen.
- SEO/Ads-formulier invullen.
- Admin-login testen.
- Lead-detail en tijdlijn controleren.
- Nieuw voorstel maken.
- Publieke voorstelpagina openen.
- Geldigheid en akkoordknoppen controleren.
- "Akkoord met voorstel" en "Eerst bespreken" testen.
- Print/PDF controleren.
- E-mail verzenden controleren.
