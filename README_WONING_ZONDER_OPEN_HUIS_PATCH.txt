Patch: woning-verkopen-zonder-open-huis

Doel:
Deze patch lost de 404 op voor:
https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-open-huis

Inhoud:
1. Nieuwe SEO-landingspagina:
   app/woning-verkopen-zonder-open-huis/page.jsx

2. Sitemap bijgewerkt:
   app/sitemap.js

Waarom:
De URL werd al intern gelinkt vanuit app/components/SeoLandingPage.jsx, maar de pagina bestond nog niet. Google kon de URL daardoor vinden en gaf in Search Console een 404.

Na uploaden in GitHub en deploy via Vercel controleren:
1. Open https://www.verkoopjehuisdirect.nl/woning-verkopen-zonder-open-huis
2. Controleer of de pagina 200 OK geeft.
3. Controleer https://www.verkoopjehuisdirect.nl/sitemap.xml
4. Vraag daarna in Google Search Console opnieuw indexering aan voor de URL.
