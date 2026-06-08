# Dashboard rollback

Deze patch zet alleen het dashboard terug naar de vorige premium admin-layout.

Vervangt:
- app/admin/page.jsx

Laat ongemoeid:
- /admin/nieuwe-lead
- /api/admin/manual-lead
- voorstelgenerator
- mailflow
- Neon
- homepage

Gebruik:
1. Pak deze zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat app/admin/page.jsx vervangen.
4. Commit.
5. Wacht op Vercel.

Daarna staat de oude dashboardlayout terug. De handmatige invoerpagina blijft bereikbaar via:
https://www.verkoopjehuisdirect.nl/admin/nieuwe-lead
