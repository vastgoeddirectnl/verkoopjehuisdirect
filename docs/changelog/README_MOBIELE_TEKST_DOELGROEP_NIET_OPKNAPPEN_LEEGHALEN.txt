Patch: mobiele en algemene homepage-copy vereenvoudigd en sterker gericht op de gemiddelde woningeigenaar.

Doel van deze patch
- Layout behouden op mobiel en desktop.
- Tekst minder marketingachtig maken.
- Duidelijker maken dat de woning niet eerst verkoopklaar hoeft te zijn.
- Duidelijker maken dat de woning niet eerst opgeknapt of leeggehaald hoeft te worden.
- Boodschap concreter maken voor advertentiebezoekers.

Uitgangspunt
De bezoeker moet snel begrijpen:
- Ik kan vrijblijvend informeren.
- De woning hoeft niet eerst opgeknapt te worden.
- De woning hoeft niet eerst leeggehaald te worden.
- Ook een woning met spullen, onderhoud of achterstallige staat kan besproken worden.
- Ik zit nergens aan vast.

Aangepast bestand
- app/components/HomeClient.jsx

Belangrijkste tekstwijzigingen
- Hero mobiel en desktop vereenvoudigd naar: “Uw woning verkopen zonder gedoe?”
- Hero-subtekst concreter gemaakt: ook als de woning onderhoud nodig heeft, nog vol spullen staat of niet verkoopklaar is.
- Mobiele vertrouwensregel aangepast naar: “Niet eerst opknappen · Niet leeghalen · Vrijblijvend”.
- Trustregels aangepast naar: gratis/vrijblijvend, niet eerst opknappen, niet eerst leeghalen, persoonlijk contact.
- Formulierintro aangepast: ook als de woning nog vol staat, onderhoud nodig heeft of niet verkoopklaar is.
- Formuliermelding aangepast: gratis/vrijblijvend en niet eerst opknappen of leeg halen.
- Sectie “Waarom anders” herschreven met eenvoudigere, concretere taal.
- Situatiekaarten aangepast met “Niet eerst opknappen” en “Niet eerst leeghalen”.
- Vergelijking aangevuld met “Woning leeghalen”.
- FAQ aangepast naar: “Moet mijn woning verkoopklaar of leeg zijn?”
- Formulierkeuzes bij situatie uitgebreid met:
  - Woning staat nog vol spullen
  - Woning is niet verkoopklaar
  - Woning moet nog leeggehaald worden

Technisch behouden
- Bestaande layout behouden.
- Bestaande formulierwerking behouden.
- Submit naar /api/leads behouden.
- Google Ads-conversie behouden.
- WhatsApp- en beltracking behouden.
- Geen databasewijziging vereist.

Test na upload
1. Homepage mobiel controleren.
2. Hero bovenaan mobiel controleren op rust en duidelijkheid.
3. Formulier invullen met nieuwe situatieopties.
4. Controleren of lead in /admin binnenkomt.
5. Tag Assistant controleren of Website leadformulier verzonden nog vuurt.
