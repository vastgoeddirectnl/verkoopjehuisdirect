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
