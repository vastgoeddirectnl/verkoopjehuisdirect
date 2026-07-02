# Controlefix levering & constructie patch

Deze zip bevat alleen de noodzakelijke correcties op de aangeleverde patch.

Aangepast:
- app/admin/leads/[id]/page.jsx
- app/admin/voorstellen/[id]/print/page.jsx
- app/voorstel/[token]/page.jsx
- neon/proposal_delivery_constructie_upgrade.sql

Correcties:
1. Helperfuncties `isSpecialProposalType` en `constructieChecks` toegevoegd aan interne print/PDF en klantversie. Zonder deze functies kan de voorstelpagina/printversie crashen zodra een voorstel wordt geopend.
2. Juridisch relevante checkboxes worden niet meer allemaal automatisch aangevinkt bij het kiezen van een bijzonder voorsteltype. Alleen `ABC-doorverkoop mogelijk` wordt automatisch aangezet wanneer dit voorsteltype wordt gekozen.
3. De Neon-migratie blijft ongewijzigd en is idempotent. Voer deze uit vóór gebruik van de nieuwe velden.

Advies:
- Eerst SQL uitvoeren in Neon: `neon/proposal_delivery_constructie_upgrade.sql`
- Daarna deployen.
- Test minimaal: standaard aankoop, uitgestelde levering, overbruggingsoplossing en ABC-doorverkoop.
