Patch: aanvraagblok op SEO/Ads pagina's sterker gericht op voorstel ontvangen

Aangepast:
- app/components/SeoLandingPage.jsx
  - Aanvraagblok benoemt nu dat de aanvraag wordt beoordeeld en dat waar mogelijk een eerste vrijblijvende inschatting of verkoopvoorstel wordt gestuurd.
  - Blok 'Wat gebeurt er na uw aanvraag?' legt minder nadruk op direct persoonlijk contact en meer op beoordeling, voorstel en vrijblijvendheid.

- app/components/AdsLeadMiniForm.jsx
  - Succesmelding na verzending aangepast naar: gegevens worden beoordeeld; waar mogelijk volgt een eerste vrijblijvende inschatting of voorstel; alleen bij ontbrekende info kort contact.

- app/components/HomeClient.jsx
  - Homepage-formulier en FAQ-tekst in dezelfde richting aangepast.

Controle:
- npm install uitgevoerd.
- npm run build compileerde succesvol.
- Build kwam tot statisch genereren, maar de lokale tool brak af met EPIPE/timing; geen JSX- of compilefouten zichtbaar.
