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
