# Voorsteltekst + definitieve mailflow upgrade

Deze patch verfijnt de standaardteksten in de voorstelgenerator en maakt de mailflow klantvriendelijker.

## Toegevoegd

- Betere standaardteksten voor uitgangspunten, voorwaarden, vergelijking, voorbehouden en vervolgstappen.
- Klant krijgt geen `/admin/...` link meer.
- Klant krijgt een openbare unieke voorstel-link: `/voorstel/[public_token]`.
- Mail heeft nette onderwerpregel, samenvatting, CTA en disclaimer.
- Proposalstatus wordt `Verzonden`.
- Leadstatus wordt `Voorstel verzonden`.
- Mailhistorie wordt bijgewerkt.
- Bekeken voorstellen worden geregistreerd met `public_viewed_at` en `public_view_count`.

## Bestanden

- `app/api/admin/v2/route.js`
- `app/admin/leads/[id]/page.jsx`
- `app/voorstel/[token]/page.jsx`
- `app/voorstel/[token]/PrintButton.jsx`
- `neon/proposal_mail_flow_upgrade.sql`

## Installatie

1. Pak de zip uit.
2. Upload de inhoud naar de hoofdmap van GitHub.
3. Laat bestaande bestanden vervangen.
4. Voer in Neon SQL Editor de inhoud uit van `neon/proposal_mail_flow_upgrade.sql`.
5. Wacht op Vercel.
6. Open `/admin`, maak of open een voorstel, controleer print/PDF en klik daarna op `Mail voorstel naar klant`.
