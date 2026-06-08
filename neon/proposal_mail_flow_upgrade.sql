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
