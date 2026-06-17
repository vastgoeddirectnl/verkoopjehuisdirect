Patch: homepage intuïtiever en informatiever

Doel
- De homepage sterker laten aansluiten op de vergelijking met Nationale Huizenmaatschappij, zonder de rustige/premium positionering te verliezen.
- De bezoeker sneller laten herkennen welke situatie op hem/haar van toepassing is.
- Meer uitleg geven vóórdat iemand het formulier invult.
- Meer vertrouwen, procesduidelijkheid en praktische informatie toevoegen.

Aangepast bestand
- app/components/HomeClient.jsx

Belangrijkste wijzigingen
1. Nieuw blok: "Waarmee kunnen wij u helpen?"
   - 6 herkenbare situaties met directe links naar kennisbank-/campagnepagina's:
     - Woning staat nog vol spullen
     - Niet eerst opknappen
     - Leegstaande woning
     - Erfenis of nalatenschap
     - Dubbele lasten
     - Geen bezichtigingen

2. Formulierkaart uitgebreid met "Wat gebeurt er na uw aanvraag?"
   - Eerste vrijblijvend bod
   - Persoonlijk contact
   - Eventueel bekijken
   - Definitief voorstel
   Dit geeft bezoekers meer zekerheid voordat ze het formulier invullen.

3. Nieuw vertrouwenblok: "Waarom verkopers voor ons kiezen"
   - Persoonlijk contact
   - Afspraken op papier
   - Niet eerst alles regelen
   - Vrijblijvend beginnen

4. Nieuw wel/niet passend-blok
   - Eerlijker en betrouwbaarder: wanneer past deze route wel en wanneer mogelijk minder goed?

5. Nieuw blok: "Kosten en afwikkeling"
   - Makelaarskosten
   - Notaris
   - Opknappen
   - Leeghalen
   - Verplichting

6. Kennisbank beter zichtbaar
   - De bestaande SEO/kennisbankpagina's staan nu hoger en logischer gegroepeerd.
   - Niet meer alleen als lange SEO-linklijst onderaan.

7. Navigatie aangepast
   - Situaties
   - Werkwijze
   - Kosten
   - Informatie
   - FAQ

Niet aangepast
- Formulier-submit naar /api/leads
- Google Ads-conversietracking
- WhatsApp- en beltracking
- Sitemap
- Kennisbankpagina's zelf
- Database/admin dashboard

Test na upload
1. Homepage desktop bekijken
2. Homepage mobiel bekijken
3. Klikken op de situatiekaarten testen
4. Formulier invullen en controleren in /admin
5. Tag Assistant controleren of Website leadformulier verzonden nog vuurt
