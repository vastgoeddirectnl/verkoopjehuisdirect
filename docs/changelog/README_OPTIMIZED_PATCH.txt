# Verkoopjehuisdirect.nl — geoptimaliseerde patch

Deze zip bevat alleen de bestanden die aangepast of geoptimaliseerd zijn. Upload dus niet opnieuw de hele website.

## Inhoud

- `package.json`
- `.npmrc`
- `app/layout.jsx`
- `app/robots.js`
- `app/not-found.jsx`
- `app/sitemap.js`

## Waarom deze bestanden?

### package.json
Zet Next, React, React DOM, Neon en Resend vast op stabiele versies, zodat Vercel niet opnieuw oude of conflicterende versies installeert.

### .npmrc
Dwingt Vercel om de publieke npm registry te gebruiken.

### app/layout.jsx
SEO-basis voor de hele site:
- Nederlandse taal
- title template
- description
- canonical
- favicons
- OpenGraph

### app/robots.js
Laat de website indexeren, maar blokkeert:
- `/admin`
- `/api`

### app/not-found.jsx
Veilige eenvoudige 404-pagina zonder imports, zodat prerendering niet faalt.

### app/sitemap.js
Sitemap met alle bekende SEO- en GEO-pagina's.

## Belangrijk

Laat deze werkende bestanden voorlopig met rust:
- Neon API-routes
- `app/lib/neonDb.js`
- `app/lib/leads.js`
- `app/lib/mail.js`
- `HomeClient.jsx`
- admin-bestanden

Die werken al en hoeven niet opnieuw vervangen te worden.

## Uploadinstructie

1. Pak deze zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat bestaande bestanden vervangen.
4. Verwijder `package-lock.json` als die nog in GitHub staat.
5. Commit.
6. Controleer of Vercel opnieuw deployt.
7. Test:
   - homepage
   - formulier
   - `/admin`
   - `/robots.txt`
   - `/sitemap.xml`
   - een niet-bestaande URL, bijvoorbeeld `/test-404`
