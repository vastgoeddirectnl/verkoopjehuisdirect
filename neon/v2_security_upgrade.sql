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
