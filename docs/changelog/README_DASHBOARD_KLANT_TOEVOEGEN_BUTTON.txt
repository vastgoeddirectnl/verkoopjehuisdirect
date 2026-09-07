# Subtiele knop klant toevoegen

Deze patch behoudt de bestaande goede dashboardlayout en past alleen `app/admin/page.jsx` aan.

Toegevoegd:
- een knop `+ Klant toevoegen`
- linkt naar `/admin/nieuwe-lead`
- bedoeld om naast of bij de bestaande CSV-export te staan

Niet aangepast:
- `/admin/nieuwe-lead`
- `/api/admin/manual-lead`
- voorstelgenerator
- mailflow
- Neon
- homepage

Gebruik:
1. Pak deze zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat `app/admin/page.jsx` vervangen.
4. Commit.
5. Wacht op Vercel.
6. Controleer het dashboard.
