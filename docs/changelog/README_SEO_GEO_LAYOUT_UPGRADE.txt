# SEO/GEO layout upgrade

Deze patch vervangt:

- app/components/SeoLandingPage.jsx

Omdat alle bestaande SEO- en GEO-pagina's deze component gebruiken, krijgen de bestaande pagina's direct de nieuwe premium layout.

Toegevoegd:
- header in stijl van de nieuwe homepage;
- compacte hero met CTA-card;
- Google-review trustblok;
- premium voordelenkaarten;
- betere sectiekaarten;
- vergelijking in twee visuele kolommen;
- compactere FAQ;
- interne links naar bestaande en nieuwe SEO/GEO-pagina's;
- footer en mobiele sticky CTA.

Niet aangepast:
- homepage;
- admin;
- Neon;
- formulier/API;
- voorstelmodule;
- bestaande pagina-inhoud/metadata;
- URL's.

Upload:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat app/components/SeoLandingPage.jsx vervangen.
4. Commit.
5. Wacht op Vercel.
6. Controleer een bestaande pagina zoals /huis-direct-verkopen.
