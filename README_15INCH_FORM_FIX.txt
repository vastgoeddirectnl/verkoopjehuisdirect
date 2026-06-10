# 15-inch formulier/hero compact fix

Deze patch vervangt alleen:

- app/components/HomeClient.jsx

Doel:
- voorkomen dat het aanvraagformulier op 15-inch/laptophoogte net wordt afgesneden;
- hero boven de vouw compacter maken bij lagere schermhoogtes;
- formulierkaart iets compacter maken zonder inhoud te verwijderen;
- bestaande desktop/mobiele layout behouden.

Wat is aangepast:
- extra CSS voor schermen met beperkte hoogte;
- iets kleinere header/hero/formulier op laptophoogte;
- kleinere logo/badges/velden in het formulier op 15-inch;
- iets smallere formulierkolom zodat de kaart niet tegen de rand komt;
- bij zeer lage schermhoogte wordt alleen het derde item onder 'Wat u ontvangt' verborgen.

Niet aangepast:
- API-routes;
- Neon;
- admin;
- voorstelmodule;
- mailflow;
- formulierwerking;
- SEO-pagina's.

Upload:
1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat app/components/HomeClient.jsx vervangen.
4. Commit.
5. Wacht op Vercel.
6. Test op 15-inch/laptop en mobiel.
