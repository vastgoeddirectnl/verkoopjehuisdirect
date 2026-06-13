Patch: mobiele conversie-optimalisatie homepage
Domein: verkoopjehuisdirect.nl
Bestand: app/components/HomeClient.jsx

Doel
Deze patch optimaliseert de mobiele weergave omdat circa 90% van de advertentieklikken mobiel is. De desktopversie en bestaande formulier-/trackingfunctionaliteit blijven behouden.

Aangepast
- Mobiele hero korter en directer gemaakt.
- Mobiele bewijsregel toegevoegd: "Binnen 1 minuut aangevraagd · gratis en vrijblijvend".
- Header op mobiel compacter gemaakt.
- Navigatie op mobiel verborgen om advertentieverkeer sneller naar de aanvraag te leiden.
- Aanvraagformulier op mobiel compacter gemaakt.
- Formulierlogo op mobiel verborgen om ruimte te besparen.
- Mobiele formuliertekst ingekort.
- Extra mobiele kicker toegevoegd: "Binnen 1 minuut aangevraagd".
- Gewenste termijn is optioneel gemaakt.
- Korte toelichting blijft optioneel.
- Reviewblok op mobiel compacter gemaakt; lange reviewtekst wordt mobiel verborgen.
- Sticky mobiele CTA aangescherpt naar: "Gratis voorstel aanvragen" + WhatsApp.
- Formulier scroll-margin aangepast voor mobiel.
- Basisvalidatie toegevoegd bij stappen in het formulier:
  - Stap 1 vereist postcode, huisnummer en type woning.
  - Stap 2 vereist alleen situatie.

Niet gewijzigd
- Google Ads-conversie blijft vuren via trackGoogleAdsConversion("lead") na succesvolle formulierverzending.
- Formulier blijft posten naar /api/leads.
- Bestaande payload mapping blijft behouden.
- WhatsApp- en beltracking blijven behouden.
- SEO/GEO-links blijven lager op de pagina.

Na uploaden testen
1. Homepage openen op mobiel.
2. Controleren of de hero compact is.
3. Klikken op "Gratis voorstel aanvragen" of "Start aanvraag".
4. Formulier volledig doorlopen.
5. Controleren of de lead in /admin binnenkomt.
6. Met Tag Assistant controleren of "Website leadformulier verzonden" nog vuurt.
7. In Google Ads controleren dat Displaynetwerk uit blijft en alleen Google Zoeken actief is.
