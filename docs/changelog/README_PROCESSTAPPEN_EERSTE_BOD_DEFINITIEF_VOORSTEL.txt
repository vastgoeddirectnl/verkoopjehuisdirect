Patch: processtappen eerste vrijblijvend bod + definitief voorstel

Doel
- Procesvolgorde corrigeren op SEO-/campagne- en kennisbankpagina's.
- Eerst een eerste vrijblijvend bod/indicatie op basis van de eerste gegevens.
- Daarna persoonlijk contact en eventueel bekijken van de woning in huidige staat.
- Vervolgens een definitief voorstel met bod, planning en uitleg over het vervolg.
- Bij akkoord koopovereenkomst en daarna notariële overdracht.

Aangepast
- app/components/SeoLandingPage.jsx
- app/huis-snel-verkopen/page.jsx
- app/huis-direct-verkopen/page.jsx
- app/woning-verkopen-zonder-makelaar/page.jsx
- app/opknapwoning-verkopen/page.jsx
- app/huis-verkopen-zonder-leeghalen/page.jsx
- app/huis-verkopen-zonder-opknappen/page.jsx
- app/woning-verkopen-die-nog-vol-staat/page.jsx
- app/geerfde-woning-verkopen-zonder-leeghalen/page.jsx
- app/huis-verkopen-bij-dubbele-lasten/page.jsx
- app/huis-verkopen-zonder-bezichtigingen-uitleg/page.jsx

Meegeleverd uit bestaande SEO/AI-bundel
- app/sitemap.js
- overige kennisbank-/campagnepagina's uit de SEO/AI-contentupgrade, zodat de patch als drop-in blijft werken.

Niet aangepast
- formulierverwerking
- Google Ads-conversie
- WhatsApp- en telefoonlinks
- URL-structuur
- mobiele layout

Na uploaden testen
1. Build/deploy groen in Vercel.
2. Controleer enkele pagina's op desktop en mobiel.
3. Controleer met name de blokken 'Hoe werkt het proces?' en 'Hoe werkt een voorstel?'.
