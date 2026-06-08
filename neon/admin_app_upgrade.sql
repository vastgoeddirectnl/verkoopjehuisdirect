-- Admin-app uitbreiding voor verkoopjehuisdirect.nl
-- Uitvoeren in Neon Console > SQL Editor.
-- Veilig om meerdere keren uit te voeren.

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

alter table leads
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists naam text,
  add column if not exists email text,
  add column if not exists telefoon text,
  add column if not exists postcode text,
  add column if not exists huisnummer text,
  add column if not exists woningtype text,
  add column if not exists staat text,
  add column if not exists reden text,
  add column if not exists pagina text,
  add column if not exists bron text,
  add column if not exists status text not null default 'Nieuw',
  add column if not exists notitie text,
  add column if not exists last_contact_at timestamptz;

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

alter table proposals
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists lead_id uuid references leads(id) on delete set null,
  add column if not exists lead_naam text,
  add column if not exists lead_email text,
  add column if not exists lead_telefoon text,
  add column if not exists property_address text,
  add column if not exists amount_text text,
  add column if not exists validity_date date,
  add column if not exists transfer_date_text text,
  add column if not exists deposit_text text,
  add column if not exists conditions_text text,
  add column if not exists notes text,
  add column if not exists status text not null default 'Concept',
  add column if not exists emailed_at timestamptz;

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

alter table tasks
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists lead_id uuid references leads(id) on delete set null,
  add column if not exists lead_naam text,
  add column if not exists title text not null default 'Nieuwe taak',
  add column if not exists due_date date,
  add column if not exists status text not null default 'Open',
  add column if not exists note text;

create table if not exists mail_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads(id) on delete set null,
  proposal_id uuid references proposals(id) on delete set null,
  type text,
  recipient text,
  subject text,
  status text,
  provider_id text,
  error text
);

alter table mail_logs
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists lead_id uuid references leads(id) on delete set null,
  add column if not exists proposal_id uuid references proposals(id) on delete set null,
  add column if not exists type text,
  add column if not exists recipient text,
  add column if not exists subject text,
  add column if not exists status text,
  add column if not exists provider_id text,
  add column if not exists error text;

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_pagina_idx on leads (pagina);
create index if not exists leads_bron_idx on leads (bron);
create index if not exists proposals_created_at_idx on proposals (created_at desc);
create index if not exists proposals_lead_id_idx on proposals (lead_id);
create index if not exists tasks_due_date_idx on tasks (due_date asc nulls last);
create index if not exists tasks_status_idx on tasks (status);
create index if not exists tasks_lead_id_idx on tasks (lead_id);
create index if not exists mail_logs_created_at_idx on mail_logs (created_at desc);
create index if not exists mail_logs_lead_id_idx on mail_logs (lead_id);
create index if not exists mail_logs_proposal_id_idx on mail_logs (proposal_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at before update on leads for each row execute function set_updated_at();

drop trigger if exists proposals_set_updated_at on proposals;
create trigger proposals_set_updated_at before update on proposals for each row execute function set_updated_at();

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at before update on tasks for each row execute function set_updated_at();
