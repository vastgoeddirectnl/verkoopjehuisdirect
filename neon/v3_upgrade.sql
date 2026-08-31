-- Vastgoed Direct Nederland V3
-- Run once on an existing V2 database.
alter table proposals add column if not exists interest_status text;
alter table proposals add column if not exists interest_at timestamptz;
alter table proposals add column if not exists interest_message text;
create index if not exists proposals_interest_at_idx on proposals (interest_at desc nulls last);

