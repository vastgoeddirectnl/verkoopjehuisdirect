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
