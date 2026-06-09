# Google-review homepage patch

Deze patch zet de echte Google-review van Laura vd Zalm op de homepage.

Vervangt:
- app/components/HomeClient.jsx

Toegevoegd:
- premium reviewblok direct onder de hero;
- 5-sterren Google-review;
- reviewtekst;
- reviewer: Laura vd Zalm;
- extra CTA naar de aanvraag;
- responsive styling voor mobiel.

Niet aangepast:
- API-routes;
- Neon;
- admin;
- voorstelmodule;
- mailflow;
- SEO-pagina's.

Let op:
Er is bewust geen Review structured data toegevoegd. Voor LocalBusiness-websites kan review markup met eigen getoonde reviews SEO-risico geven. Visueel tonen is wel prima en geloofwaardig.

Upload:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat `app/components/HomeClient.jsx` vervangen.
4. Commit.
5. Wacht op Vercel.
6. Controleer homepage desktop en mobiel.
