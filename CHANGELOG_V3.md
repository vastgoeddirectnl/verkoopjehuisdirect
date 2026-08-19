# V3 release notes

## Website
- Inline formulier-validatie in plaats van browser alerts.
- Postcode wordt automatisch genormaliseerd.
- Visuele voortgang (stap 1/3 t/m 3/3).
- Verzenden krijgt een loading/disabled state.
- API-fouten worden in het formulier getoond.

## Admin
- Actiecentrum met automatisch geprioriteerde leads.
- Warme voorstelviews en positieve reacties krijgen voorrang.
- Compacte Kanban/pipeline boven de leadlijst.
- Voorsteloverzicht toont view count en klantreactie.
- Bestaande lead-detail-, taken-, archief- en rapportagefuncties blijven behouden.

## Voorstel
- Nieuwe primaire CTA: positief over voorstel.
- Nieuwe CTA: voorstel bespreken.
- WhatsApp-vraagactie.
- Geldigheidsduur wordt ook relatief getoond.
- Reactie wordt opgeslagen in CRM.
- Positieve reactie verplaatst een actieve lead naar `In onderhandeling`.
- Er wordt automatisch een opvolgtaak voor vandaag aangemaakt.

## Database
Voer bij upgrade vanaf V2 `neon/v3_upgrade.sql` uit.
Voor een nieuwe installatie is `neon/v3_full_setup.sql` beschikbaar.
