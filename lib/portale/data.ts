// Letture e scritture del portale. Tutto passa da qui, così i filtri per
// agenzia stanno in un posto solo.

import { dbCount, dbInsert, dbSelect, dbSelectOne, dbUpdate, type Query } from './db'
import { AGENCY_CODE_RE, UUID_RE, type CaseStatus } from './constants'
import {
  AGENCY_AUTH_COLUMNS,
  AGENCY_COLUMNS,
  CASE_COLUMNS_AGENCY,
  type Agency,
  type AgencyAuth,
  type CaseDocument,
  type CaseEvent,
  type CaseRow,
} from './types'

// ── Agenzie ─────────────────────────────────────────────────────────────────

export async function agencyAuthByCode(code: string): Promise<AgencyAuth | null> {
  if (!AGENCY_CODE_RE.test(code)) return null
  return dbSelectOne<AgencyAuth>('agencies', { select: AGENCY_AUTH_COLUMNS, code: `eq.${code}` })
}

export async function agencyAuthById(id: string): Promise<AgencyAuth | null> {
  if (!UUID_RE.test(id)) return null
  return dbSelectOne<AgencyAuth>('agencies', { select: AGENCY_AUTH_COLUMNS, id: `eq.${id}` })
}

export async function agencyAuthBySetupToken(tokenHash: string): Promise<AgencyAuth | null> {
  if (!/^[0-9a-f]{64}$/.test(tokenHash)) return null
  return dbSelectOne<AgencyAuth>('agencies', {
    select: AGENCY_AUTH_COLUMNS,
    setup_token_hash: `eq.${tokenHash}`,
  })
}

/** Nome dell'agenzia per un codice attivo. È l'unico dato esposto al pubblico. */
export async function activeAgencyByCode(code: string): Promise<{ id: string; ragione_sociale: string } | null> {
  if (!AGENCY_CODE_RE.test(code)) return null
  return dbSelectOne('agencies', {
    select: 'id,ragione_sociale',
    code: `eq.${code}`,
    status: 'eq.active',
  })
}

export async function agencyById(id: string): Promise<Agency | null> {
  if (!UUID_RE.test(id)) return null
  return dbSelectOne<Agency>('agencies', { select: AGENCY_COLUMNS, id: `eq.${id}` })
}

export async function listAgencies(): Promise<Agency[]> {
  return dbSelect<Agency>('agencies', { select: AGENCY_COLUMNS, order: 'created_at.desc', limit: 500 })
}

export async function agencyExistsByVat(partitaIva: string): Promise<boolean> {
  if (!/^\d{11}$/.test(partitaIva)) return false
  const n = await dbCount('agencies', { partita_iva: `eq.${partitaIva}`, status: 'in.(pending,active)' })
  return n > 0
}

export async function updateAgency(id: string, patch: Record<string, unknown>): Promise<boolean> {
  if (!UUID_RE.test(id)) return false
  const rows = await dbUpdate<{ id: string }>('agencies', { id: `eq.${id}` }, patch, 'id')
  return rows.length === 1
}

// ── Pratiche viste dall'agenzia ─────────────────────────────────────────────

export type AgencyCase = Omit<CaseRow, 'internal_note' | 'claim_amount' | 'passenger_email' | 'passenger_phone'>

export async function listAgencyCases(agencyId: string): Promise<AgencyCase[]> {
  return dbSelect<AgencyCase>('cases', {
    select: CASE_COLUMNS_AGENCY,
    agency_id: `eq.${agencyId}`,
    order: 'created_at.desc',
    limit: 500,
  })
}

export async function agencyCaseById(agencyId: string, caseId: string): Promise<AgencyCase | null> {
  if (!UUID_RE.test(caseId)) return null
  return dbSelectOne<AgencyCase>('cases', {
    select: CASE_COLUMNS_AGENCY,
    id: `eq.${caseId}`,
    agency_id: `eq.${agencyId}`,
  })
}

// ── Pratiche viste dalla gestione ───────────────────────────────────────────

export type CaseWithAgency = CaseRow & { agencies: { ragione_sociale: string; code: string | null } | null }

export async function listCases(filter: { status?: CaseStatus; agencyId?: string } = {}): Promise<CaseWithAgency[]> {
  const q: Query = {
    select: '*,agencies(ragione_sociale,code)',
    order: 'created_at.desc',
    limit: 500,
  }
  if (filter.status) q.status = `eq.${filter.status}`
  if (filter.agencyId && UUID_RE.test(filter.agencyId)) q.agency_id = `eq.${filter.agencyId}`
  const rows = await dbSelect<CaseWithAgency & { payload?: unknown }>('cases', q)
  return rows
}

export async function caseById(id: string): Promise<(CaseWithAgency & { payload: unknown }) | null> {
  if (!UUID_RE.test(id)) return null
  return dbSelectOne('cases', { select: '*,agencies(ragione_sociale,code)', id: `eq.${id}` })
}

export async function updateCase(id: string, patch: Record<string, unknown>): Promise<boolean> {
  if (!UUID_RE.test(id)) return false
  const rows = await dbUpdate<{ id: string }>(
    'cases',
    { id: `eq.${id}` },
    { ...patch, updated_at: new Date().toISOString() },
    'id',
  )
  return rows.length === 1
}

export async function insertCase(row: Record<string, unknown>): Promise<{ id: string; ref: string }> {
  return dbInsert<{ id: string; ref: string }>('cases', row, 'id,ref')
}

// ── Cronologia e documenti ──────────────────────────────────────────────────

export async function addEvent(event: {
  case_id: string
  actor: CaseEvent['actor']
  kind: CaseEvent['kind']
  from_status?: CaseStatus | null
  to_status?: CaseStatus | null
  message?: string | null
  visible_to_agency?: boolean
}): Promise<void> {
  await dbInsert('case_events', { visible_to_agency: true, ...event }, 'id')
}

export async function caseEvents(caseId: string, opts: { agencyView: boolean }): Promise<CaseEvent[]> {
  const q: Query = { select: '*', case_id: `eq.${caseId}`, order: 'created_at.asc', limit: 300 }
  if (opts.agencyView) q.visible_to_agency = 'eq.true'
  return dbSelect<CaseEvent>('case_events', q)
}

export async function caseDocuments(caseId: string): Promise<CaseDocument[]> {
  return dbSelect<CaseDocument>('case_documents', {
    select: '*',
    case_id: `eq.${caseId}`,
    order: 'created_at.asc',
    limit: 100,
  })
}

export async function documentById(id: string): Promise<CaseDocument | null> {
  if (!UUID_RE.test(id)) return null
  return dbSelectOne<CaseDocument>('case_documents', { select: '*', id: `eq.${id}` })
}

export async function countCaseDocuments(caseId: string): Promise<number> {
  return dbCount('case_documents', { case_id: `eq.${caseId}` })
}

export async function insertDocument(row: Omit<CaseDocument, 'id' | 'created_at'>): Promise<void> {
  await dbInsert('case_documents', row, 'id')
}
