Patch: homepage processtappen ook aanpassen

Waarom deze patch:
De vorige processtappen-patch paste de SEO-/kennisbankpagina's aan, maar de homepage gebruikt app/components/HomeClient.jsx. Daardoor was verkoopjehuisdirect.nl zelf nog niet aangepast.

Aangepast:
- app/components/HomeClient.jsx
- app/components/SeoLandingPage.jsx
- bestaande campagne-/kennisbankpagina's uit eerdere procespatch blijven inbegrepen

Nieuwe homepage-volgorde:
1. Vrijblijvend aanvragen
2. Eerste bod
3. Eventueel bekijken
4. Definitief voorstel
5. Koopovereenkomst en notaris

Tekstueel verwerkt:
- Eerst een vrijblijvend eerste bod
- Woning bekijken alleen als dat nodig is
- Daarna definitief bod met planning en uitleg over vervolg
- Bij akkoord koopovereenkomst en overdracht via de notaris

Controle na deploy:
- Open https://www.verkoopjehuisdirect.nl/#werkwijze
- Controleer de 5 stappen
- Controleer desktop en mobiel
