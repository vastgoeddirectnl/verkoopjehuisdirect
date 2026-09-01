# V5.1.1 — Admin/voorstel-correctie

Deze versie is gebaseerd op V5.1 en bevat een gerichte correctieronde voor het adminportaal en het klantvoorstel.

## Aangepast

- Klantacties uit het voorstel worden niet meer alleen als logregel behandeld.
- De kaart `Klant wil het voorstel bespreken` / `Klant heeft een vraag` / `Klant wil verder` verdwijnt uit de open acties zodra contact is vastgelegd.
- `Contact vastleggen` werkt de lead bij, rondt de bijbehorende automatische opvolgtaak af en schrijft een afhandel-event in de tijdlijn.
- Dashboard en open-takenoverzicht houden rekening met klantacties die al zijn opgevolgd.
- De tijdlijn toont klantacties als `Actie nodig` zolang er nog geen contactmoment is en als `Afgehandeld` zodra contact is vastgelegd.
- WhatsApp-voorstelbericht vanuit admin logt nu eerst de actie en opent daarna WhatsApp.
- Zinsopbouw in de netto-opbrengstvergelijking is aangescherpt.
- Dubbele/overlappende formuleringen rond huidige staat, levering en btw-weergave zijn ingekort.
- De voorstelmail gebruikt bij objecten het label `Object` in plaats van standaard `Woning`.

## Database

Geen nieuwe Neon-migratie nodig. Deze versie gebruikt de bestaande V3.2-velden en `proposal_events`-tabel.

## Controle

Na deploy testen:

1. Klantvoorstel openen.
2. `Eerst bespreken` of sticky `Bespreken` gebruiken.
3. Controleren of de klantactie bovenaan de lead-detailpagina verschijnt.
4. `Contact vastleggen` klikken.
5. Controleren of de kaart verdwijnt of als afgehandeld wordt getoond.
6. Controleren of de opvolgtaak is afgerond.
7. Dashboard controleren op open acties.
8. WhatsApp-knop na voorstelverzending testen.
