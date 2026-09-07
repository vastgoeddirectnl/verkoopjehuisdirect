Mobiele cleanup-patch voor verkoopjehuisdirect.nl

Doel:
De mobiele homepage rustiger maken na feedback dat de eerste mobiele optimalisatie te druk oogde.

Aangepast bestand:
- app/components/HomeClient.jsx

Belangrijkste wijzigingen:
- Mobiele hero-kop kleiner en rustiger.
- Secundaire hero-knop “Eerst even overleggen” op mobiel verborgen.
- Dubbele “Binnen 1 minuut aangevraagd”-meldingen op mobiel verborgen.
- Trustcards onder hero op mobiel versoberd naar compacte tekstregels zonder kaart-schaduw.
- Formulierbadges “Persoonlijk / Discreet / Vrijblijvend” op mobiel verborgen.
- Formulierkicker “Binnen 1 minuut aangevraagd” op mobiel verborgen.
- Oranje notice “Gratis en vrijblijvend...” in formulier op mobiel verborgen om herhaling te voorkomen.
- Formuliertitel op mobiel iets kleiner.
- Sticky mobiele CTA rustiger gemaakt: alleen één primaire knop, WhatsApp-knop verborgen.

Niet aangepast:
- Formulierwerking
- /api/leads submit
- Google Ads-conversie
- WhatsApp- en beltracking
- Desktoplayout

Test na upload:
1. Homepage op mobiel openen.
2. Bovenste scherm beoordelen op rust en duidelijkheid.
3. CTA naar formulier testen.
4. Formulier volledig invullen.
5. Controleren of lead in /admin binnenkomt.
6. Tag Assistant controleren: Website leadformulier verzonden.
