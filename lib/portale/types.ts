import type { AgencyStatus, CaseSource, CaseStatus, Disruption } from './constants'

/** Riga di agencies senza i campi di accesso. */
export type Agency = {
  id: string
  status: AgencyStatus
  code: string | null
  ragione_sociale: string
  partita_iva: string | null
  citta: string | null
  provincia: string | null
  referente: string
  email: string
  telefono: string
  sito: string | null
  messaggio: string | null
  note_interne: string | null
  commission_enabled: boolean
  commission_pct: number
  agency_contact_enabled: boolean
  created_at: string
  approved_at: string | null
  last_login_at: string | null
}

/** Campi di accesso, letti solo dove servono. */
export type AgencyAuth = {
  id: string
  status: AgencyStatus
  code: string | null
  password_hash: string | null
  session_version: number
  failed_logins: number
  locked_until: string | null
  setup_token_hash: string | null
  setup_token_expires_at: string | null
}

export type CaseRow = {
  id: string
  ref: string
  agency_id: string | null
  source: CaseSource
  status: CaseStatus
  passenger_name: string
  passenger_email: string | null
  passenger_phone: string | null
  passengers_count: number
  contact_via_agency: boolean
  dep_airport: string
  arr_airport: string
  via_airport: string | null
  airline: string | null
  flight_number: string | null
  flight_date: string | null
  disruption: Disruption | null
  booking_ref: string | null
  description: string | null
  internal_note: string | null
  claim_amount: number | null
  recovered_amount: number | null
  recovered_at: string | null
  commission_pct: number | null
  commission_amount: number | null
  commission_paid_at: string | null
  created_at: string
  updated_at: string
}

export type CaseEvent = {
  id: string
  case_id: string
  actor: 'gestione' | 'agenzia' | 'cliente' | 'sistema'
  kind: 'creata' | 'stato' | 'nota' | 'documento' | 'importo'
  from_status: CaseStatus | null
  to_status: CaseStatus | null
  message: string | null
  visible_to_agency: boolean
  created_at: string
}

export type CaseDocument = {
  id: string
  case_id: string
  storage_path: string
  filename: string
  mime: string
  size_bytes: number
  uploaded_by: 'agenzia' | 'gestione'
  created_at: string
}

/** Colonne di agencies che si possono mostrare. Mai password_hash o token. */
export const AGENCY_COLUMNS =
  'id,status,code,ragione_sociale,partita_iva,citta,provincia,referente,email,telefono,sito,messaggio,note_interne,commission_enabled,commission_pct,agency_contact_enabled,created_at,approved_at,last_login_at'

export const AGENCY_AUTH_COLUMNS =
  'id,status,code,password_hash,session_version,failed_logins,locked_until,setup_token_hash,setup_token_expires_at'

/** Colonne di cases visibili all'agenzia. Niente note interne. */
export const CASE_COLUMNS_AGENCY =
  'id,ref,agency_id,source,status,passenger_name,passengers_count,contact_via_agency,dep_airport,arr_airport,via_airport,airline,flight_number,flight_date,disruption,booking_ref,description,recovered_amount,recovered_at,commission_pct,commission_amount,commission_paid_at,created_at,updated_at'
