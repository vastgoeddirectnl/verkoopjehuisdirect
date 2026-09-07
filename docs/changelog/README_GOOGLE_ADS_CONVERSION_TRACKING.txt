# Google Ads conversiemeting patch

Deze patch voegt Google Ads conversietracking toe.

## Vervangt / voegt toe

Vervangt:
- app/layout.jsx
- app/components/HomeClient.jsx

Voegt toe:
- app/components/GoogleAdsTag.jsx
- app/lib/googleAds.js

## Conversies die worden gemeten

1. Leadformulier succesvol verzonden
2. Klik op telefoonnummer
3. Klik op WhatsApp

## Belangrijk: eerst conversieacties maken in Google Ads

Maak in Google Ads drie websiteconversies aan:

### Hoofdconversie
Naam:
Leadformulier verzonden

Categorie:
Submit lead form / Leadformulier verzonden

Gebruik:
Primaire conversie

### Secundaire conversies
Naam:
Klik op bellen

Categorie:
Contact

Gebruik:
Secundaire conversie

Naam:
Klik op WhatsApp

Categorie:
Contact

Gebruik:
Secundaire conversie

## Environment variables in Vercel

Voeg daarna in Vercel toe:

NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=xxxxxxxxxxxxxxxx

Let op:
- Google Ads ID begint meestal met AW-
- De labels haal je uit de tag-instellingen per conversieactie.

## Upload

1. Pak deze zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat bestanden vervangen/toevoegen.
4. Commit.
5. Voeg de Vercel environment variables toe.
6. Redeploy in Vercel.
7. Test met Google Tag Assistant of Google Ads diagnose.

## Test

1. Open de site.
2. Verstuur een testaanvraag.
3. Klik op bellen.
4. Klik op WhatsApp.
5. Controleer in Google Ads of de tag actief wordt.

## Niet aangepast

- Neon
- admin dashboard
- voorstelmodule
- mailflow
- SEO/GEO pagina's
- API-routes
