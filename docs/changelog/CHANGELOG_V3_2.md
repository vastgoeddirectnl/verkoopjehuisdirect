# Changelog V3.2

## CRM / admin
- Handmatige en automatische follow-up uit elkaar getrokken.
- Effectieve follow-up respecteert altijd een handmatige datum.
- Lead-detail uitgebreid met gecombineerde activiteitentijdlijn.
- Actiecentrum prioriteert recente klantintentie en achterstallige opvolging.
- Pipeline uitgebreid tot zes fasen en drag-and-drop statuswijziging.
- Globale leadzoekfunctie toegevoegd.
- Voorstellen linken naar een eigen beheerpagina.
- Voorstelbeheer toont views, reactie, events en versies.
- Nieuw voorstel kan als volgende versie van bestaand voorstel worden gekloond.

## Openbare voorstelpagina
- Geen viewregistratie meer tijdens server-render.
- View telt pas na zichtbare kijktijd in de browser en eenmaal per sessie.
- Eerste en laatste view apart beschikbaar.
- Akkoord gebruikt een bevestigingsstap.
- Bespreken/akkoord kan een optionele toelichting bevatten.
- Mobiele sticky CTA toegevoegd.
- WhatsApp- en printacties kunnen als voorstel-event worden geregistreerd.
- Gedeelde Amsterdam-datumlogica voor geldigheid.

## Website
- Grote homepage is geen volledige clientcomponent meer.
- Hoofdformulier verplaatst naar een gerichte clientcomponent.
- Inline veldvalidatie en voortgang toegevoegd.
- E-mailadres is optioneel; telefoon blijft vereist.
- Postcode/huisnummer-adrescontrole toegevoegd.
- Bron-, UTM- en advertentie-identificatie gecentraliseerd.
- Funnel-events voor view/start/stappen/submit/error toegevoegd.
- Gedeelde conversielink voor statische CTA's.

## Techniek / security
- Dynamische waarden in voorstelmail worden HTML-ge-escaped.
- Rate-limit tabel krijgt opportunistische cleanup.
- Database-indexen voor voorstel-events en laatste views toegevoegd.
- Proposal event history toegevoegd.
- Voorstelversievelden toegevoegd.
- Centrale datumutility gebruikt `Europe/Amsterdam`.
- Design-tokens toegevoegd aan globale CSS.
