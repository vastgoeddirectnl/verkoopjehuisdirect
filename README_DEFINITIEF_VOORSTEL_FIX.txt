# Definitief voorstel / constructie-weergave fix

Deze patch corrigeert de klantversie en interne print/PDF van het verkoopvoorstel.

Aangepast:
- app/admin/voorstellen/[id]/print/page.jsx
- app/voorstel/[token]/page.jsx

Correcties:
1. Overbruggingssituatie wordt nu als eigen blok getoond wanneer:
   - Type voorstel = Overbruggingsoplossing, of
   - één van de overbruggingsvelden is ingevuld.
2. Levering & constructie wordt los getoond van overbruggingssituatie.
3. Aanbetaling / voorschot wordt als bedrag geformatteerd wanneer er een bedrag is ingevuld.
4. Woonoppervlakte en perceel krijgen automatisch m² wanneer alleen een getal is ingevuld.
5. Interne print/PDF toont voorstelnummer, voorstelstatus, datum en geldigheid.
6. Sectienummering schuift automatisch mee als levering/constructie en overbrugging aanwezig zijn.
7. Vervolgstappen bevatten explicieter de route naar koopovereenkomst en notaris.

Geen Neon-migratie nodig bovenop de bestaande levering/constructie-migratie.

Let op:
- Browser-header/footer met datum en URL komt uit het printvenster van de browser. Zet bij afdrukken/opslaan als PDF de optie 'Kop- en voetteksten' uit voor een schone PDF.
