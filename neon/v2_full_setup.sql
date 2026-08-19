-- Vastgoed Direct Nederland V2 - complete database setup
-- Voor een NIEUWE database: voer dit bestand in één keer uit in Neon SQL Editor.
-- Voor een bestaande database: voer alleen neon/v2_security_upgrade.sql uit als alle eerdere migraties al actief zijn.


-- ============================================================
-- START schema.sql
-- ============================================================

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


-- END schema.sql


-- ============================================================
-- START admin_app_upgrade.sql
-- ============================================================

-- Admin-app uitbreiding voor vastgoeddirectnederland.nl
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


-- END admin_app_upgrade.sql


-- ============================================================
-- START proposal_document_upgrade.sql
-- ============================================================

-- Uitbreiding verkoopvoorstellen Vastgoed Direct Nederland
-- Uitvoeren in Neon SQL Editor.

create extension if not exists pgcrypto;

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
  add column if not exists proposal_variant text not null default 'Uitgebreid',
  add column if not exists property_postcode text,
  add column if not exists property_house_number text,
  add column if not exists property_type text,
  add column if not exists living_area_text text,
  add column if not exists plot_area_text text,
  add column if not exists build_year_text text,
  add column if not exists current_situation text,
  add column if not exists assumptions_text text,
  add column if not exists included_items text,
  add column if not exists traditional_price_text text,
  add column if not exists agent_costs_text text,
  add column if not exists notary_costs_text text,
  add column if not exists renovation_costs_text text,
  add column if not exists other_costs_text text,
  add column if not exists traditional_net_text text,
  add column if not exists direct_net_text text,
  add column if not exists short_comparison_text text,
  add column if not exists reservations_text text,
  add column if not exists next_steps_text text,
  add column if not exists contact_person text;

create index if not exists proposals_created_at_idx on proposals (created_at desc);
create index if not exists proposals_lead_id_idx on proposals (lead_id);
create index if not exists proposals_status_idx on proposals (status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists proposals_set_updated_at on proposals;
create trigger proposals_set_updated_at before update on proposals for each row execute function set_updated_at();


-- END proposal_document_upgrade.sql


-- ============================================================
-- START proposal_mail_flow_upgrade.sql
-- ============================================================

-- Voorsteltekst + definitieve mailflow upgrade
-- Uitvoeren in Neon SQL Editor. Plak de inhoud van dit bestand, niet alleen de bestandsnaam.

create extension if not exists pgcrypto;

alter table proposals
  add column if not exists public_token uuid default gen_random_uuid(),
  add column if not exists public_viewed_at timestamptz,
  add column if not exists public_view_count integer not null default 0,
  add column if not exists sent_to_email text,
  add column if not exists last_emailed_subject text,
  add column if not exists mail_message text;

update proposals set public_token = gen_random_uuid() where public_token is null;
alter table proposals alter column public_token set default gen_random_uuid();

create unique index if not exists proposals_public_token_idx on proposals (public_token);
create index if not exists proposals_public_viewed_at_idx on proposals (public_viewed_at desc nulls last);


-- END proposal_mail_flow_upgrade.sql


-- ============================================================
-- START proposal_delivery_constructie_upgrade.sql
-- ============================================================

-- Uitbreiding voorstellen: levering & constructie / overbruggingssituatie
-- Uitvoeren in Neon SQL Editor vóór het aanmaken van voorstellen met deze nieuwe velden.

alter table proposals
  add column if not exists proposal_type text not null default 'Standaard aankoop',
  add column if not exists delivery_term_text text,
  add column if not exists desired_transfer_date date,
  add column if not exists buyer_text text,
  add column if not exists allow_kadaster_registration boolean not null default false,
  add column if not exists allow_abc_resale boolean not null default false,
  add column if not exists seller_cooperates_resale boolean not null default false,
  add column if not exists delivery_free_of_claims boolean not null default false,
  add column if not exists property_same_state boolean not null default false,
  add column if not exists bridge_current_home text,
  add column if not exists bridge_old_home text,
  add column if not exists bridge_goal_text text,
  add column if not exists bridge_explanation_text text;


-- END proposal_delivery_constructie_upgrade.sql


-- ============================================================
-- START proposal_additional_agreements_upgrade.sql
-- ============================================================

-- Uitbreiding aankoopvoorstellen: werkzaamheden verkoper + aanvullende betaling bij doorverkoop
-- Uitvoeren in Neon SQL Editor vóór gebruik van deze nieuwe proposalvelden.

alter table proposals
  add column if not exists seller_work_enabled boolean not null default false,
  add column if not exists seller_work_description text,
  add column if not exists seller_work_deadline date,
  add column if not exists seller_work_amount_text text,
  add column if not exists seller_work_base_price_text text,
  add column if not exists seller_work_total_price_text text,
  add column if not exists seller_work_conditions_text text,
  add column if not exists resale_payment_enabled boolean not null default false,
  add column if not exists resale_threshold_text text,
  add column if not exists resale_percentage_text text,
  add column if not exists resale_deduct_courtage boolean not null default true,
  add column if not exists resale_period_months integer,
  add column if not exists resale_cap_text text,
  add column if not exists resale_explanation_text text,
  add column if not exists nonbinding_text text;

update proposals
set nonbinding_text = 'Dit voorstel is vrijblijvend en niet-bindend. Aan dit voorstel kunnen geen rechten worden ontleend. Een koopovereenkomst komt uitsluitend tot stand nadat alle voorwaarden definitief zijn uitgewerkt en de koopovereenkomst door koper en verkoper is ondertekend. Het voorstel is daarnaast onder voorbehoud van juridische, fiscale en notariële uitvoerbaarheid.'
where nonbinding_text is null;


-- END proposal_additional_agreements_upgrade.sql


-- ============================================================
-- START proposal_use_rental_delivery_upgrade.sql
-- ============================================================

-- Uitbreiding aankoopvoorstellen: gebruik, verhuur en oplevering
-- Uitvoeren in Neon SQL Editor vóór gebruik van deze nieuwe proposalvelden.

alter table proposals
  add column if not exists use_rental_enabled boolean not null default false,
  add column if not exists object_usage_type text,
  add column if not exists current_occupancy_status text,
  add column if not exists delivery_occupancy_status text,
  add column if not exists lease_agreement_available text,
  add column if not exists lease_end_date date,
  add column if not exists tenant_vacate_deadline date,
  add column if not exists tenant_cooperation_status text,
  add column if not exists current_rent_text text,
  add column if not exists deposit_present text,
  add column if not exists rent_arrears_or_dispute text,
  add column if not exists commercial_area_text text,
  add column if not exists residential_area_text text,
  add column if not exists separate_entrance_status text,
  add column if not exists independent_residence_status text,
  add column if not exists zoning_permits_checked text,
  add column if not exists split_potential_status text,
  add column if not exists fire_safety_check_status text,
  add column if not exists use_rental_notes_text text;


-- END proposal_use_rental_delivery_upgrade.sql


-- ============================================================
-- START automation_phase1.sql
-- ============================================================

-- Automatisering fase 1
-- Run dit één keer in de Neon SQL Editor.

alter table leads
  add column if not exists lead_score integer not null default 0,
  add column if not exists lead_priority text not null default 'Normaal',
  add column if not exists automation_note text,
  add column if not exists next_follow_up_at date,
  add column if not exists last_automation_at timestamptz,
  add column if not exists proposal_viewed_at timestamptz;

alter table tasks
  add column if not exists automation_key text;

create index if not exists leads_priority_idx on leads (lead_priority);
create index if not exists leads_next_follow_up_idx on leads (next_follow_up_at);
create index if not exists leads_proposal_viewed_idx on leads (proposal_viewed_at desc nulls last);
create index if not exists tasks_automation_key_idx on tasks (lead_id, automation_key);

-- Bestaande leads krijgen na upload van de patch automatisch score/opvolging zodra je
-- in het dashboard op "Automatisering uitvoeren" klikt.


-- END automation_phase1.sql


-- ============================================================
-- START v2_security_upgrade.sql
-- ============================================================

-- V2 security/performance upgrade
-- Safe to run multiple times.

create table if not exists request_rate_limits (
  bucket_key text primary key,
  request_count integer not null default 0,
  expires_at timestamptz not null
);

create index if not exists request_rate_limits_expires_at_idx
  on request_rate_limits (expires_at);

-- Helpful composite indexes for the admin overview.
create index if not exists tasks_lead_status_idx
  on tasks (lead_id, status);

create index if not exists proposals_lead_created_at_idx
  on proposals (lead_id, created_at desc);

create index if not exists mail_logs_lead_created_at_idx
  on mail_logs (lead_id, created_at desc);

-- Optional cleanup can be run periodically:
-- delete from request_rate_limits where expires_at < now() - interval '1 day';


-- END v2_security_upgrade.sql
