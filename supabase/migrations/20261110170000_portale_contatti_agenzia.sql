-- Contatti col passeggero tenuti dall'agenzia
-- La gestione abilita la singola agenzia. Solo un'agenzia abilitata può
-- segnalare una pratica indicando che i contatti col passeggero passano da lei.

alter table public.agencies
  add column if not exists agency_contact_enabled boolean not null default false;

alter table public.cases
  add column if not exists contact_via_agency boolean not null default false;
