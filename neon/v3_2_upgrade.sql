-- Vastgoed Direct Nederland V3.2
-- Uitvoeren op een bestaande V3.1.1 database.
-- Idempotent: veilig om opnieuw uit te voeren.

create extension if not exists pgcrypto;

-- Handmatige opvolging krijgt voortaan voorrang op automatisering.
alter table leads add column if not exists manual_follow_up_at date;
alter table leads add column if not exists automation_follow_up_at date;

update leads
set manual_follow_up_at = next_follow_up_at
where manual_follow_up_at is null
  and next_follow_up_at is not null
  and last_automation_at is null;

-- Betrouwbaardere voorstelweergaven.
alter table proposals add column if not exists public_last_viewed_at timestamptz;
alter table proposals add column if not exists version_number integer not null default 1;
alter table proposals add column if not exists parent_proposal_id uuid references proposals(id) on delete set null;

update proposals
set public_last_viewed_at = public_viewed_at
where public_last_viewed_at is null and public_viewed_at is not null;

create index if not exists proposals_public_last_viewed_idx
  on proposals (public_last_viewed_at desc nulls last);
create index if not exists proposals_parent_idx
  on proposals (parent_proposal_id);

-- Eventhistorie: views, akkoord/bespreken, WhatsApp, print/PDF enz.
create table if not exists proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  event_type text not null,
  session_key text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists proposal_events_proposal_created_idx
  on proposal_events (proposal_id, created_at desc);
create index if not exists proposal_events_lead_created_idx
  on proposal_events (lead_id, created_at desc);
create index if not exists proposal_events_type_created_idx
  on proposal_events (event_type, created_at desc);

create unique index if not exists proposal_events_unique_view_session_idx
  on proposal_events (proposal_id, event_type, session_key)
  where event_type = 'view' and session_key is not null;

-- Bestaande historische voorstelstatussen opnemen als events waar mogelijk.
insert into proposal_events (proposal_id, lead_id, event_type, message, created_at)
select p.id, p.lead_id, 'legacy_interest',
       coalesce(p.interest_status, 'Historische reactie') ||
         case when coalesce(p.interest_message, '') <> '' then ': ' || p.interest_message else '' end,
       coalesce(p.interest_at, p.updated_at, p.created_at)
from proposals p
where p.interest_at is not null
  and not exists (
    select 1 from proposal_events e
    where e.proposal_id = p.id and e.event_type = 'legacy_interest'
  );
