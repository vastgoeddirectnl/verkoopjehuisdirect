Patch: mobiele homepage rustiger en minder herhalend

Doel
- De mobiele homepage minder druk maken.
- Herhaling van dezelfde beloftes boven de vouw verwijderen.
- Meer premium/rustige uitstraling behouden.
- Formulier laagdrempelig houden.
- Bestaande lead-submit, admin-dashboard, Google Ads-conversie en tracking behouden.

Aangepast bestand
- app/components/HomeClient.jsx

Belangrijkste aanpassingen
1. Mobiele hero opgeschoond
- Badge bovenaan verborgen op mobiel.
- Secundaire knop “Eerst even overleggen” blijft op desktop, maar is verborgen op mobiel.
- De herhaalde zin “Eerst duidelijkheid. Geen verkoopdruk. Geen open huis.” is op mobiel verborgen.
- De losse trustcards onder de hero zijn op mobiel verborgen.
- Op mobiel blijft alleen één rustige vertrouwensregel zichtbaar:
  Persoonlijk contact · Discreet behandeld · Vrijblijvend

2. Mobiele formuliertekst rustiger gemaakt
- Formuliertitel gewijzigd naar:
  Vertel kort om welke woning het gaat
- Formulierintro gewijzigd naar:
  Postcode, type woning en uw situatie zijn genoeg voor het eerste contact.
- Dubbele mobiele meldingen zoals “Binnen 1 minuut aangevraagd” en “gratis en vrijblijvend” blijven op desktop beschikbaar, maar zijn op mobiel verborgen.

3. Sticky mobiele CTA minder opdringerig
- Sticky CTA verschijnt pas na scrollen, niet meteen bovenaan de pagina.
- Alleen één knop blijft zichtbaar:
  Gratis voorstel aanvragen
- WhatsApp is verwijderd uit de sticky balk.

4. Niet aangepast
- Backend-submit naar /api/leads
- Mapping van formulierwaarden naar bestaande leadvelden
- Google Ads-conversie “Website leadformulier verzonden”
- WhatsApp- en beltracking elders op de site
- Desktopweergave zoveel mogelijk intact gehouden

Test na uploaden
1. Open homepage mobiel.
2. Controleer dat boven de vouw rustiger is: hero, één CTA, één vertrouwensregel, formulier.
3. Scroll omlaag en controleer dat sticky CTA pas na scrollen verschijnt.
4. Vul formulier volledig in.
5. Controleer of lead in /admin verschijnt.
6. Controleer met Tag Assistant of de leadconversie nog vuurt.
