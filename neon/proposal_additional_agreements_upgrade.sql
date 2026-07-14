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
