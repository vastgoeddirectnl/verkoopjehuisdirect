# V4.1.1 - btw-weergave netto-opbrengstvergelijking

Deze patch corrigeert de klantweergave van de netto-opbrengstvergelijking.

## Aanpassing

In het adminportaal blijven makelaarskosten en overige verkoopkosten invoerbedragen **exclusief btw**. De berekening telt daarop automatisch 21% btw bij voor de netto-opbrengst.

In de publieke klantvoorstelpagina en print/PDF worden deze kosten nu ook **inclusief 21% btw** getoond, zodat de tabel aansluit op de berekende netto-opbrengst.

## Aangepaste bestanden

- `app/voorstel/[token]/page.jsx`
- `app/admin/voorstellen/[id]/print/page.jsx`
- `package.json`
- `package-lock.json`

## Database

Geen nieuwe Neon-migratie nodig.
