# Homepage interne links nieuwe SEO/GEO pagina's

Deze patch vervangt alleen:

- app/components/HomeClient.jsx

Doel:
- nieuwe SEO/GEO-pagina's vanaf de homepage intern linken;
- geen rommelige hoofdnavigatie;
- linkwaarde naar nieuwe pagina's geven;
- bezoekers vanaf de homepage naar relevante situaties/regio's sturen.

Toegevoegd aan homepageblok `Verkoopinformatie per situatie, regio of plaats`:
- /huis-verkopen-zonder-funda
- /huis-verkopen-zonder-verkoopklaar-maken
- /woning-verkopen-met-schade
- /huis-verkopen-met-spoed
- /huis-verkopen-na-overlijden
- /huis-verkopen-stadskanaal
- /huis-verkopen-veendam
- /huis-verkopen-winschoten
- /huis-verkopen-assen
- /huis-verkopen-emmen
- /huis-verkopen-borger
- /huis-verkopen-gieten

Ook enkele belangrijke nieuwe links subtiel toegevoegd aan de footer.

Niet aangepast:
- API-routes;
- Neon;
- admin;
- voorstelmodule;
- mailflow;
- sitemap;
- nieuwe pagina's zelf.

Upload:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat app/components/HomeClient.jsx vervangen.
4. Commit.
5. Wacht op Vercel.
6. Controleer homepage desktop/mobiel en klik enkele nieuwe links.
