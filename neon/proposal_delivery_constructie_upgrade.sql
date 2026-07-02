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
