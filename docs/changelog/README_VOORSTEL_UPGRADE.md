# Voorstel-upgrade Vastgoed Direct Nederland

Deze patch verbetert het gegenereerde verkoopvoorstel in de admin-app.

## Wat is toegevoegd

1. Uitgebreid voorstel naast het compacte voorstel
2. Voorblad met premium uitstraling
3. Uitgangspunten van het voorstel
4. Uitgebreidere woninggegevens
5. Wat is inbegrepen
6. Netto-opbrengstvergelijking
7. Korte vergelijking met traditionele verkoop
8. Voorbehouden/checklist
9. Vervolgstappen
10. Contactblok en juridische disclaimer
11. Knop om voorstel te mailen en vastlegging in mailhistorie

## Bestanden

- `app/admin/leads/[id]/page.jsx`
- `app/admin/voorstellen/[id]/print/page.jsx`
- `app/admin/voorstellen/[id]/print/PrintButton.jsx`
- `app/api/admin/v2/route.js`
- `neon/proposal_document_upgrade.sql`

## Installatie

1. Pak deze zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat bestaande bestanden vervangen.
4. Voer daarna in Neon SQL Editor de inhoud uit van:

`neon/proposal_document_upgrade.sql`

Let op: plak niet de bestandsnaam in Neon, maar de inhoud van het SQL-bestand.

5. Wacht op Vercel deployment.
6. Open `/admin`.
7. Open een lead.
8. Vul het blok `Uitgebreid verkoopvoorstel maken` in.
9. Klik op `Voorstel maken en openen`.
10. Gebruik `Print / opslaan als PDF`.

## Belangrijk

De bestaande homepage, leadopslag, Neon-verbinding en mailbevestiging worden niet vervangen.
