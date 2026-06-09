# Automatisering fase 1 — Vastgoed Direct Nederland

Deze patch voegt de eerste slimme automatisering toe aan het dashboard.

## Vervangt / voegt toe

Vervangt:
- app/admin/page.jsx
- app/api/admin/v2/route.js
- app/lib/leads.js
- app/api/admin/manual-lead/route.js
- app/voorstel/[token]/page.jsx
- app/voorstel/[token]/PrintButton.jsx

Voegt toe:
- app/lib/automation.js
- neon/automation_phase1.sql

## Wat wordt geautomatiseerd?

### 1. Leadscore en kansrijkheid
Iedere lead krijgt automatisch:
- leadscore 0 t/m 12;
- kansrijkheid: Laag, Normaal of Hoog;
- automatische toelichting;
- volgende opvolgdatum.

Score wordt gebaseerd op onder andere:
- telefoonnummer bekend;
- adresgegevens aanwezig;
- snelle verkoop / directe duidelijkheid;
- erfenis, scheiding, leegstand, verhuur of financiële situatie;
- achterstallig onderhoud / opknapwoning;
- regio die aansluit bij het werkgebied;
- relevante SEO-pagina of bron.

### 2. Automatische taken
Bij nieuwe en kansrijke leads worden automatisch taken aangemaakt, zoals:
- Nieuwe aanvraag opvolgen;
- Kansrijke lead snel bellen;
- Voorstel nabellen;
- Voorstel bekeken - klant nabellen.

Taken worden niet steeds dubbel aangemaakt door een `automation_key`.

### 3. Voorstel bekeken = warm signaal
Als de klant de openbare voorstel-link opent:
- public_view_count wordt verhoogd;
- lead krijgt `proposal_viewed_at`;
- status gaat van `Voorstel verzonden` naar `Voorstel bekeken`;
- er komt een taak om de klant na te bellen.

### 4. Extra dashboard-KPI's
Toegevoegd:
- Kansrijke leads;
- Vandaag opvolgen;
- Voorstel bekeken.

### 5. Handmatige knop
In het dashboard staat een knop:
- `Automatisering uitvoeren`

Deze rekent bestaande leads opnieuw door.

## Installatie

1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat de bestanden vervangen/toevoegen.
4. Run in Neon SQL Editor de inhoud van:

`neon/automation_phase1.sql`

5. Wacht op Vercel.
6. Open `/admin`.
7. Klik één keer op `Automatisering uitvoeren`.

## Test

Test daarna:
1. Nieuwe aanvraag via homepage.
2. Controleer leadscore/kansrijkheid in lead-detail.
3. Controleer of automatische taak is aangemaakt.
4. Mail een voorstel naar jezelf.
5. Open de klantlink `/voorstel/...`.
6. Controleer of status `Voorstel bekeken` wordt en taak voor nabellen verschijnt.

## Belangrijk

Deze patch bepaalt geen bod en stuurt geen verkoopvoorstel zonder jouw akkoord.
De commerciële/juridische beslissingen blijven handmatig.
