Patch: homepage premium compacter met keuzeroutes

Doel
- De homepage van verkoopjehuisdirect.nl korter, rustiger en premiumer maken.
- Informatie die niet direct op de hoofdpagina hoeft niet verwijderen, maar beter ontsluiten via compacte routekaarten/slider en links naar detailpagina's.
- De homepage positioneren als premium startpagina met duidelijke keuzes in plaats van lange informatiepagina.

Aangepast bestand
- app/components/HomeClient.jsx

Belangrijkste wijzigingen
- Navigatie vereenvoudigd naar: Situaties, Waarom VDN?, Werkwijze, FAQ.
- Nieuwe compacte route-slider toegevoegd: “Wat past bij uw woning?”
- Routekaarten toegevoegd voor o.a. niet eerst opknappen, niet eerst leeghalen, woning vol spullen, leegstand/dubbele lasten, opknapwoning, zonder makelaar, erfenis en zonder bezichtigingen.
- Lange secties zoals uitgebreide situatieblokken, vergelijking, over-ons en voorbeeldsituaties vervangen door compactere premium secties.
- “Waarom Vastgoed Direct Nederland?” korter en rustiger gemaakt.
- Werkwijze teruggebracht naar 3 stappen.
- FAQ compacter gemaakt met uitklapbare vragen.
- SEO/GEO-links lager op de pagina gehouden en compacter weergegeven.
- Mobiele weergave compact gehouden.

Niet aangepast
- Formulierwerking
- Submit naar /api/leads
- Google Ads-conversie
- WhatsApp-tracking
- Beltracking
- Footerlinks
- Schema's voor LocalBusiness en FAQPage

Testen na upload
1. Homepage desktop/laptop bekijken: voelt de pagina korter en rustiger?
2. Mobiele homepage controleren: routekaarten moeten horizontaal schuifbaar zijn.
3. Formulier volledig invullen en controleren of lead in /admin binnenkomt.
4. Tag Assistant controleren: Website leadformulier verzonden moet blijven vuren.
5. Controleren of alle routekaarten naar bestaande pagina's verwijzen.
