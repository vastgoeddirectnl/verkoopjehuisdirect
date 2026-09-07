Admin archief patch - Vastgoed Direct Nederland

Wat is toegevoegd:
- Nieuw menu-item "Archief" in het adminportaal.
- Leads met status Akkoord, Afgewezen, Afgerond of Gearchiveerd komen in het archief.
- De gewone leadlijst toont standaard alleen actieve leads.
- Knoppen in lead-detail:
  - "Afgerond archiveren"
  - "Naar archief"
- In het archief kun je een lead terugzetten naar actief. De status wordt dan "In beoordeling".
- Verkoopvoorstellen kunnen vanuit de voorstellenlijst worden gearchiveerd.
- Gearchiveerde voorstellen staan in het nieuwe archief.
- Voorstellen kunnen vanuit het archief terug naar actief worden gezet als "Concept".
- Dashboard-KPI's voor archief leads en archief voorstellen toegevoegd.

Belangrijk:
- Er is geen Neon SQL-migratie nodig. De patch gebruikt bestaande statusvelden.
- Upload de volledige inhoud naar GitHub en laat Vercel opnieuw deployen.
- Test daarna in /admin:
  1. Lead openen.
  2. Klik op "Afgerond archiveren" of "Naar archief".
  3. Controleer menu-item "Archief".
  4. Zet de lead eventueel terug naar actief.
  5. Archiveer een verkoopvoorstel en controleer of het in Archief verschijnt.

Technische bestanden aangepast:
- app/admin/page.jsx
- app/api/admin/v2/route.js
- app/lib/leads.js
- app/lib/automation.js
