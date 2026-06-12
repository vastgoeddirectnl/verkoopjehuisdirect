Patch: homepage premium onderscheidend + nieuw laagdrempelig aanvraagformulier

Bestand vervangen:
- app/components/HomeClient.jsx

Wat is aangepast:
- Hero-tekst vervangen door: "Uw woning verkopen zonder verkoopstress?"
- Positionering aangescherpt: eerst duidelijkheid, geen verkoopdruk, geen open huis.
- Compacte trustregels in de hero aangepast.
- Nieuw premium blok toegevoegd direct onder het compacte Google-reviewblok:
  "Waarom Vastgoed Direct Nederland anders werkt"
- Bestaand Google-reviewblok compact gehouden.
- SEO/GEO-links blijven lager op de pagina.
- Aanvraagformulier premiumer en laagdrempeliger gemaakt.
- Formulier teruggebracht naar 3 rustige stappen:
  1. Uw woning
  2. Uw situatie
  3. Contactgegevens
- Woonoppervlakte en perceeloppervlakte niet toegevoegd om het formulier laagdrempelig te houden.
- Type woning uitgebreid met o.a. benedenwoning, bovenwoning, maisonette, woonboerderij, bungalow, recreatiewoning en chalet.
- Nieuw veld "Situatie" toegevoegd met o.a. achterstallig onderhoud, leegstand, verhuurde woning, erfenis, scheiding, dubbele lasten en privacy.
- Gewenste termijn toegevoegd.
- Korte toelichting optioneel toegevoegd.

Technisch behouden:
- Bestaande submit naar /api/leads blijft intact.
- Bestaande Google Ads conversion tracking blijft intact: trackGoogleAdsConversion("lead") na succesvolle verzending.
- WhatsApp- en beltracking blijven intact.
- CTA-links blijven intact.

Mapping formulier naar bestaande backend:
- woningtype blijft woningtype.
- situatie wordt meegestuurd als staat.
- termijn + toelichting worden samengevoegd in reden.
- situatie, termijn en toelichting worden ook extra meegestuurd; als de backend deze niet gebruikt, blijft de lead alsnog werken via de bestaande velden.

Installatie:
1. Upload/vervang app/components/HomeClient.jsx in GitHub.
2. Commit de wijziging.
3. Laat Vercel opnieuw deployen.
4. Test daarna live:
   - Homepage mobiel en desktop.
   - Formulier volledig invullen en verzenden.
   - Controleer dat de lead in /admin binnenkomt.
   - Controleer in Tag Assistant dat de Google Ads-conversie nog vuurt.
