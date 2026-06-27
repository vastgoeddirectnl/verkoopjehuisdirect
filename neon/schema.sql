-- Neon Postgres schema voor vastgoeddirectnederland.nl
-- Uitvoeren in Neon Console > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  naam text,
  email text,
  telefoon text,
  postcode text,
  huisnummer text,
  woningtype text,
  staat text,
  reden text,
  pagina text,
  bron text,
  status text not null default 'Nieuw',
  notitie text,
  last_contact_at timestamptz
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_pagina_idx on leads (pagina);
create index if not exists leads_bron_idx on leads (bron);

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references leads(id) on delete set null,
  lead_naam text,
  lead_email text,
  lead_telefoon text,
  property_address text,
  amount_text text,
  validity_date date,
  transfer_date_text text,
  deposit_text text,
  conditions_text text,
  notes text,
  status text not null default 'Concept',
  emailed_at timestamptz
);

create index if not exists proposals_created_at_idx on proposals (created_at desc);
create index if not exists proposals_lead_id_idx on proposals (lead_id);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid references leads(id) on delete set null,
  lead_naam text,
  title text not null default 'Nieuwe taak',
  due_date date,
  status text not null default 'Open',
  note text
);

create index if not exists tasks_due_date_idx on tasks (due_date asc nulls last);
create index if not exists tasks_status_idx on tasks (status);
create index if not exists tasks_lead_id_idx on tasks (lead_id);

-- Optioneel: automatisch updated_at bijwerken.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at
before update on leads
for each row execute function set_updated_at();

drop trigger if exists proposals_set_updated_at on proposals;
create trigger proposals_set_updated_at
before update on proposals
for each row execute function set_updated_at();

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
before update on tasks
for each row execute function set_updated_at();
