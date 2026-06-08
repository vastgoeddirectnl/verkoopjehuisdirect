# Premium klantvoorstel upgrade

Deze patch maakt het uitgebreide voorstel dat naar de klant gaat professioneler en premiumer.

Vervangt:
- app/voorstel/[token]/page.jsx
- app/voorstel/[token]/PrintButton.jsx
- app/api/admin/v2/route.js

Wat is verbeterd:
- premium cover met donkerblauwe hero en bedragkaart;
- meer persoonlijke introductie;
- betere samenvatting van bedrag, geldigheid, overdracht en voorschot;
- duidelijker woninggegevensblok;
- extra sectie `Wat dit voorstel vooral oplevert`;
- luxere financiële vergelijking;
- betere opbouw: uitgangspunten, inbegrepen onderdelen, voorbehouden, proces en contact;
- betere mobiele weergave;
- betere print/PDF uitstraling;
- premiumere e-mail die naar de klant wordt gestuurd.

Niet aangepast:
- dashboard;
- /admin/nieuwe-lead;
- Neon database-structuur;
- bestaande leads;
- voorstelvelden.

Extra SQL:
Geen extra SQL nodig.

Gebruik:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat de drie bestanden vervangen.
4. Commit.
5. Wacht op Vercel.
6. Maak of open een voorstel en stuur een testmail naar jezelf.
7. Controleer de klantlink `/voorstel/...`.
