Patch: SEO/campagne-landingspagina's meer in lijn met de nieuwe homepage-positionering.

Doel:
- De landingspagina's moeten beter aansluiten bij Google Ads-verkeer.
- De tekst moet eenvoudiger, concreter en minder marketingachtig zijn.
- De bezoeker moet direct begrijpen dat de woning niet eerst opgeknapt, leeggehaald of verkoopklaar gemaakt hoeft te worden.
- Layout blijft premium/rustig, maar de copy is aangepast op het niveau van de gemiddelde verkoper.

Aangepast:
- app/components/SeoLandingPage.jsx
- app/huis-direct-verkopen/page.jsx
- app/huis-snel-verkopen/page.jsx
- app/woning-verkopen-zonder-makelaar/page.jsx
- app/opknapwoning-verkopen/page.jsx
- app/leegstaand-huis-verkopen/page.jsx

Belangrijkste copy-richting:
- Uw woning verkopen zonder gedoe
- Niet eerst opknappen
- Niet leeghalen
- Ook als de woning nog vol spullen staat
- Ook als de woning onderhoud nodig heeft
- Ook als de woning niet verkoopklaar is
- Vrijblijvend voorstel
- Geen open huis nodig
- U beslist zelf of u verder wilt

Technisch:
- Deze patch raakt niet aan /api/leads.
- Deze patch raakt niet aan Google Ads-conversiemeting.
- CTA's blijven verwijzen naar /#aanvraag op de homepage.
- WhatsApp- en belknoppen blijven werken.

Na uploaden testen:
1. /huis-direct-verkopen
2. /huis-snel-verkopen
3. /woning-verkopen-zonder-makelaar
4. /opknapwoning-verkopen
5. /leegstaand-huis-verkopen

Controleer vooral mobiel:
- Eerste scherm rustig genoeg?
- Duidelijk dat opknappen/leeghalen niet nodig is?
- CTA naar formulier werkt?
- Geen storende herhaling?
