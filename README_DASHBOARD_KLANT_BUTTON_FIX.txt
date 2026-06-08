# Dashboard knop fix — + Klant toevoegen naast CSV export

Deze patch herstelt de fout uit de vorige knop-patch.

Oorzaak vorige fout:
- de knop was per ongeluk in de laadstatus geplaatst;
- daardoor verscheen hij alleen heel even tijdens refresh;
- de styling viel daardoor verkeerd uit.

Deze patch:
- start vanaf de goede rollback-layout;
- vervangt alleen `app/admin/page.jsx`;
- plaatst `+ Klant toevoegen` netjes naast `CSV export`;
- linkt naar `/admin/nieuwe-lead`;
- wijzigt niets aan de handmatige invoerfunctie, Neon, voorstellen of mailflow.

Upload:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat `app/admin/page.jsx` vervangen.
4. Commit.
5. Wacht op Vercel.
6. Controleer `/admin`.

