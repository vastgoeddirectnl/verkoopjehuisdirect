# Verkoopjehuisdirect.nl — premium admin-app patch

Deze zip bevat alleen de bestanden voor de uitbreiding van de interne admin-app. De werkende homepage, SEO-pagina's, Neon-basis, mailbasis, favicon/logo en publieke pagina's worden niet onnodig vervangen.

## Nieuwe/verbeterde onderdelen

1. Lead-detailpagina
   - `/admin/leads/[id]`
   - volledig leadprofiel
   - contactgegevens, aanvraaggegevens, notities, status, taken, voorstellen en mailhistorie

2. Filters/zoeken/statussen in dashboard
   - zoeken op naam, telefoon, e-mail, postcode, pagina en bron
   - filter op status
   - statussen: Nieuw, Contact opgenomen, In beoordeling, Voorstel verzonden, Akkoord, Afgewezen

3. Taken/reminders per lead
   - taken aanmaken vanuit lead-detail
   - due date
   - status: Open, In behandeling, Afgerond

4. CSV-export
   - `/api/admin/export`
   - export vanuit dashboard met huidige status/search-filter

5. Rapportage per pagina/bron
   - leads per pagina
   - leads per bron
   - statusverdeling
   - maandrapportage
   - KPI's op dashboard

6. Verkoopvoorstel/print/PDF
   - verkoopvoorstel maken vanuit lead
   - print/PDF via `/admin/voorstellen/[id]/print`
   - voorstel per e-mail verzenden

7. Mailhistorie
   - interne melding
   - ontvangstbevestiging
   - verkoopvoorstel-mail
   - status: Verzonden, Overgeslagen of Fout

## Bestanden in deze patch

- `app/admin/page.jsx`
- `app/admin/layout.jsx`
- `app/admin/leads/[id]/page.jsx`
- `app/admin/voorstellen/[id]/print/page.jsx`
- `app/admin/voorstellen/[id]/print/PrintButton.jsx`
- `app/api/admin/v2/route.js`
- `app/api/admin/export/route.js`
- `app/api/admin/leads/route.js`
- `app/api/admin/leads/[id]/route.js`
- `app/lib/leads.js`
- `app/lib/mailLog.js`
- `neon/admin_app_upgrade.sql`

## Installatie

1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat bestaande bestanden vervangen.
4. Voer `neon/admin_app_upgrade.sql` uit in Neon SQL Editor.
5. Wacht op Vercel deployment.
6. Test `/admin`.

## Niet verwijderen

Laat deze Vercel-variabelen staan:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `LEAD_TO_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

## Belangrijk

Deze patch verandert niets aan de publieke homepage of SEO-pagina's. De techniek die al werkt blijft zoveel mogelijk intact.
