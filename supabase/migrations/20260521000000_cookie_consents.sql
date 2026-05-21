create table public.cookie_consents (
  id             uuid primary key default gen_random_uuid(),
  consent_id     uuid not null,
  policy_version int  not null,
  action         text not null check (action in ('accept_all', 'reject_all', 'custom')),
  categories     jsonb not null,
  locale         text,
  user_agent     text,
  created_at     timestamptz not null default now()
);

create index cookie_consents_consent_id_idx on public.cookie_consents (consent_id);
create index cookie_consents_created_at_idx on public.cookie_consents (created_at);

alter table public.cookie_consents enable row level security;
-- No public policies: this table is writable only via service role key from the server.
