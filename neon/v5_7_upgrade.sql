-- 5.7.0: plaats, gemeente en provincie bij elke lead (adrescontrole via PDOK).
--
-- Eenmalig uitvoeren in de Neon SQL-editor. Veilig om opnieuw te draaien.
-- Zonder deze kolommen blijft de site werken: aanvragen worden gewoon
-- opgeslagen, alleen plaats en provincie worden dan niet bewaard.

alter table leads add column if not exists plaats text;
alter table leads add column if not exists gemeente text;
alter table leads add column if not exists provincie text;

-- Wanneer het adres voor het laatst is opgezocht, zodat de dagelijkse run
-- oudere leads aanvult zonder een niet-gevonden adres elke dag opnieuw te
-- proberen.
alter table leads add column if not exists address_lookup_at timestamptz;

create index if not exists leads_provincie_idx on leads (provincie);
