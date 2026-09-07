# V4.1 - SEO-pagina's meer in lijn met de hoofdpagina

Deze patch brengt de SEO-landingspagina's visueel dichter bij de hoofdpagina, zonder de pagina's inhoudelijk te dupliceren.

## Aangepast

- `app/components/SeoLandingPage.jsx`
- `package.json`
- `package-lock.json`

## Wijzigingen

1. Nieuw premium blok direct onder de reviewband:
   - dezelfde rustige route als de hoofdpagina;
   - toegespitst op de specifieke SEO-zoekintentie;
   - drie duidelijke cards: eerst duidelijkheid, minder verkoopgedoe, schriftelijk/notarieel.

2. Vergelijker versterkt:
   - extra bewijs-/uitlegcards boven de vergelijking;
   - nadruk op prijs, kosten, voorbereiding, doorlooptijd en zekerheid.

3. Verwante routes compacter en visueler:
   - homepage-achtige routecards;
   - maximaal vier relevante vervolgroutes prominent;
   - bestaande gerelateerde linksectie blijft behouden voor SEO-interne links.

4. Mobiele weergave gecontroleerd:
   - nieuwe blokken stapelen netjes onder elkaar;
   - sticky CTA blijft behouden;
   - geen nieuwe databasevelden.

## Database

Geen nieuwe Neon-migratie nodig. Deze wijziging is uitsluitend frontend/layout/contentweergave.

## Advies

Gebruik dit als nieuwe V4.1-basis wanneer je de SEO-pagina's meer dezelfde premium uitstraling als de hoofdpagina wilt geven, maar de inhoud per pagina specifiek wilt houden.
