-- Portale agenzie
-- Agenzie partner, pratiche attribuite a un'agenzia, cronologia e documenti.
--
-- Come per cookie_consents, tutte le tabelle hanno RLS attiva e nessuna policy.
-- Si leggono e si scrivono solo dal server con la service role key. I ruoli
-- anon e authenticated vengono inoltre privati di ogni privilegio, perché
-- agencies contiene gli hash delle password.

-- ── Agenzie ─────────────────────────────────────────────────────────────────

create table public.agencies (
  id                     uuid primary key default gen_random_uuid(),
  status                 text not null default 'pending'
                           check (status in ('pending', 'active', 'suspended', 'rejected')),
  -- Codice agenzia. Serve per accedere e compare nel link /r/CODICE.
  -- Viene assegnato all'approvazione.
  code                   text unique check (code ~ '^[A-Z0-9]{4,16}$'),
  ragione_sociale        text not null,
  partita_iva            text,
  citta                  text,
  provincia              text,
  referente              text not null,
  email                  text not null,
  telefono               text not null,
  sito                   text,
  messaggio              text,
  note_interne           text,
  -- Accesso
  password_hash          text,
  session_version        integer not null default 1,
  failed_logins          integer not null default 0,
  locked_until           timestamptz,
  setup_token_hash       text,
  setup_token_expires_at timestamptz,
  -- Modulo compensi. Spento di default, si attiva per singola agenzia.
  commission_enabled     boolean not null default false,
  commission_pct         numeric(5,2) not null default 10
                           check (commission_pct >= 0 and commission_pct <= 100),
  privacy_accepted_at    timestamptz,
  created_at             timestamptz not null default now(),
  approved_at            timestamptz,
  last_login_at          timestamptz
);

create index agencies_status_idx on public.agencies (status);
create index agencies_setup_token_idx on public.agencies (setup_token_hash)
  where setup_token_hash is not null;

-- ── Pratiche ────────────────────────────────────────────────────────────────

create sequence public.cases_ref_seq start 1001;

create table public.cases (
  id                  uuid primary key default gen_random_uuid(),
  -- Riferimento leggibile, es. GIV-26-01001
  ref                 text not null unique
                        default ('GIV-' || to_char(now(), 'YY') || '-' ||
                                 lpad(nextval('public.cases_ref_seq')::text, 5, '0')),
  agency_id           uuid references public.agencies (id) on delete restrict,
  -- modulo_agenzia: inserita dall'agenzia nell'area riservata
  -- link_cliente:   inserita dal passeggero arrivato dal link o dal QR dell'agenzia
  source              text not null check (source in ('modulo_agenzia', 'link_cliente')),
  status              text not null default 'ricevuta'
                        check (status in (
                          'ricevuta', 'in_valutazione', 'documenti_richiesti',
                          'presa_in_carico', 'richiesta_inviata', 'azione_legale',
                          'recupero_forzoso', 'risarcimento_ottenuto',
                          'non_procedibile', 'esito_negativo'
                        )),
  -- Passeggero
  passenger_name      text not null,
  passenger_email     text,
  passenger_phone     text,
  passengers_count    integer not null default 1
                        check (passengers_count between 1 and 20),
  -- Volo
  dep_airport         text not null,
  arr_airport         text not null,
  via_airport         text,
  airline             text,
  flight_number       text,
  flight_date         date,
  disruption          text check (disruption in (
                          'ritardo', 'cancellazione', 'negato_imbarco',
                          'coincidenza_persa', 'altro'
                        )),
  booking_ref         text,
  description         text,
  -- Nota riservata alla gestione. I messaggi per l'agenzia stanno in case_events.
  internal_note       text,
  -- Importi
  claim_amount        numeric(10,2) check (claim_amount >= 0),
  recovered_amount    numeric(10,2) check (recovered_amount >= 0),
  recovered_at        date,
  -- Compenso dell'agenzia. Valorizzato solo se il modulo compensi
  -- dell'agenzia è attivo quando si registra l'incasso.
  commission_pct      numeric(5,2),
  commission_amount   numeric(10,2),
  commission_paid_at  date,
  -- Dati grezzi del modulo del sito, per le pratiche da link
  payload             jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index cases_agency_idx on public.cases (agency_id, created_at desc);
create index cases_status_idx on public.cases (status);
create index cases_created_idx on public.cases (created_at desc);

-- ── Cronologia ──────────────────────────────────────────────────────────────

create table public.case_events (
  id                uuid primary key default gen_random_uuid(),
  case_id           uuid not null references public.cases (id) on delete cascade,
  actor             text not null check (actor in ('gestione', 'agenzia', 'cliente', 'sistema')),
  kind              text not null check (kind in ('creata', 'stato', 'nota', 'documento', 'importo')),
  from_status       text,
  to_status         text,
  message           text,
  visible_to_agency boolean not null default true,
  created_at        timestamptz not null default now()
);

create index case_events_case_idx on public.case_events (case_id, created_at);

-- ── Documenti ───────────────────────────────────────────────────────────────

create table public.case_documents (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid not null references public.cases (id) on delete cascade,
  storage_path text not null unique,
  filename     text not null,
  mime         text not null,
  size_bytes   integer not null check (size_bytes > 0),
  uploaded_by  text not null check (uploaded_by in ('agenzia', 'gestione')),
  created_at   timestamptz not null default now()
);

create index case_documents_case_idx on public.case_documents (case_id, created_at);

-- ── Sicurezza ───────────────────────────────────────────────────────────────

alter table public.agencies       enable row level security;
alter table public.cases          enable row level security;
alter table public.case_events    enable row level security;
alter table public.case_documents enable row level security;

revoke all on table public.agencies, public.cases, public.case_events, public.case_documents
  from anon, authenticated;
revoke all on sequence public.cases_ref_seq from anon, authenticated;

-- ── Archivio documenti ──────────────────────────────────────────────────────
-- Bucket privato. I file si caricano e si scaricano solo dal server.

do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit)
    values ('pratiche', 'pratiche', false, 4194304)
    on conflict (id) do nothing;
  end if;
end
$$;
