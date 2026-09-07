# Handmatig klant invoeren — admin patch

Deze patch voegt een aparte adminfunctie toe voor klanten die telefonisch, via WhatsApp of via netwerkcontact binnenkomen.

Nieuwe URL:
`/admin/nieuwe-lead`

Nieuwe API-route:
`/api/admin/manual-lead`

De functie slaat direct op in de bestaande Neon `leads`-tabel. Er is geen extra SQL nodig.

Upload:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat bestanden toevoegen.
4. Wacht op Vercel.
5. Open `/admin/nieuwe-lead`.

Deze patch vervangt geen bestaande dashboardbestanden. Wil je een zichtbare knop op het bestaande dashboard, voeg later een link toe naar `/admin/nieuwe-lead`.
