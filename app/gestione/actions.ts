'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import { STATUS_LABEL } from '@/lib/portale/constants'
import { hashToken, newAgencyCode, newToken, safeEqual } from '@/lib/portale/crypto'
import { addEvent, agencyById, caseById, updateAgency, updateCase } from '@/lib/portale/data'
import { dbInsert, isUniqueViolation } from '@/lib/portale/db'
import {
  adminLoginSchema,
  agenziaSchema,
  approvaSchema,
  compensoPagatoSchema,
  fieldErrors,
  formObject,
  idSchema,
  importiSchema,
  notaInternaSchema,
  nuovaAgenziaSchema,
  statoPraticaSchema,
  type ActionResult,
} from '@/lib/portale/schemas'
import {
  adminConfigured,
  clientIp,
  endAdminSession,
  isAdmin,
  requestOrigin,
  startAdminSession,
} from '@/lib/portale/session'

const SETUP_LINK_DAYS = 7
const DENIED: ActionResult<never> = { ok: false, message: 'Sessione scaduta. Accedi di nuovo.' }
const FAILED: ActionResult<never> = { ok: false, message: 'Operazione non riuscita. Riprova.' }

export type AccessLink = { link: string; code: string; expiresAt: string }

// ── Accesso ─────────────────────────────────────────────────────────────────

export async function accediGestione(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const ip = await clientIp()
  if (!rateLimit(`gestione-login:${ip}`, 5, 15 * 60_000)) {
    return { ok: false, message: 'Troppi tentativi. Riprova tra un quarto d’ora.' }
  }
  if (!adminConfigured()) {
    return { ok: false, message: 'Gestione non configurata. Mancano le variabili d’ambiente del portale.' }
  }
  const parsed = adminLoginSchema.safeParse(formObject(fd))
  if (!parsed.success || !safeEqual(parsed.data.password, process.env.GESTIONE_PASSWORD as string)) {
    return { ok: false, message: 'Password non corretta.' }
  }
  if (!(await startAdminSession())) return FAILED
  redirect('/gestione')
}

export async function esciGestione(): Promise<void> {
  await endAdminSession()
  redirect('/gestione/accedi')
}

// ── Agenzie ─────────────────────────────────────────────────────────────────

/** Crea un nuovo link con cui l'agenzia sceglie la password. In database resta solo l'hash. */
async function issueAccessLink(agencyId: string, code: string): Promise<AccessLink> {
  const token = newToken()
  const expiresAt = new Date(Date.now() + SETUP_LINK_DAYS * 86_400_000).toISOString()
  await updateAgency(agencyId, { setup_token_hash: hashToken(token), setup_token_expires_at: expiresAt })
  const origin = await requestOrigin()
  return { link: `${origin}/agenzie/attiva?token=${token}`, code, expiresAt }
}

/** Assegna il codice. Se è generato in automatico riprova finché non ne trova uno libero. */
async function assignCode(agencyId: string, wanted: string | null): Promise<string | null> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = wanted ?? newAgencyCode()
    try {
      await updateAgency(agencyId, { code, status: 'active', approved_at: new Date().toISOString() })
      return code
    } catch (err) {
      if (!isUniqueViolation(err)) throw err
      if (wanted) return null
    }
  }
  return null
}

export async function approvaAgenzia(
  _prev: ActionResult<AccessLink>,
  fd: FormData,
): Promise<ActionResult<AccessLink>> {
  if (!(await isAdmin())) return DENIED
  const parsed = approvaSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    return { ok: false, message: 'Controlla il codice.', fieldErrors: fieldErrors(parsed.error) }
  }
  try {
    const agency = await agencyById(parsed.data.id)
    if (!agency) return { ok: false, message: 'Agenzia non trovata.' }
    const code = agency.code ?? (await assignCode(agency.id, parsed.data.code))
    if (!code) return { ok: false, message: 'Questo codice è già usato da un’altra agenzia.', fieldErrors: { code: 'Codice già in uso' } }
    if (agency.code) await updateAgency(agency.id, { status: 'active', approved_at: agency.approved_at ?? new Date().toISOString() })
    const data = await issueAccessLink(agency.id, code)
    revalidatePath('/gestione', 'layout')
    return { ok: true, data }
  } catch (err) {
    console.error('[gestione] approvazione', err)
    return FAILED
  }
}

export async function nuovoLinkAccesso(
  _prev: ActionResult<AccessLink>,
  fd: FormData,
): Promise<ActionResult<AccessLink>> {
  if (!(await isAdmin())) return DENIED
  const parsed = idSchema.safeParse(formObject(fd))
  if (!parsed.success) return FAILED
  try {
    const agency = await agencyById(parsed.data.id)
    if (!agency || !agency.code || agency.status !== 'active') {
      return { ok: false, message: 'Il link si può creare solo per un’agenzia attiva.' }
    }
    return { ok: true, data: await issueAccessLink(agency.id, agency.code) }
  } catch (err) {
    console.error('[gestione] link di accesso', err)
    return FAILED
  }
}

export async function creaAgenzia(
  _prev: ActionResult<AccessLink & { id: string }>,
  fd: FormData,
): Promise<ActionResult<AccessLink & { id: string }>> {
  if (!(await isAdmin())) return DENIED
  const parsed = nuovaAgenziaSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  const { code: wanted, ...data } = parsed.data
  try {
    const created = await dbInsert<{ id: string }>('agencies', { ...data, status: 'pending' }, 'id')
    const code = await assignCode(created.id, wanted)
    if (!code) {
      await updateAgency(created.id, { status: 'rejected', note_interne: 'Creazione annullata: codice già in uso.' })
      return { ok: false, message: 'Questo codice è già usato da un’altra agenzia.', fieldErrors: { code: 'Codice già in uso' } }
    }
    const link = await issueAccessLink(created.id, code)
    revalidatePath('/gestione', 'layout')
    return { ok: true, data: { ...link, id: created.id } }
  } catch (err) {
    console.error('[gestione] nuova agenzia', err)
    return FAILED
  }
}

export async function aggiornaAgenzia(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return DENIED
  const parsed = agenziaSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  const { id, ...patch } = parsed.data
  try {
    const agency = await agencyById(id)
    if (!agency) return { ok: false, message: 'Agenzia non trovata.' }
    if (patch.status === 'active' && !agency.code) {
      return { ok: false, message: 'Per attivarla usa “Approva”, così riceve codice e link di accesso.' }
    }
    await updateAgency(id, patch)
    revalidatePath('/gestione', 'layout')
    return { ok: true, message: 'Salvato.' }
  } catch (err) {
    console.error('[gestione] agenzia', err)
    return FAILED
  }
}

// ── Pratiche ────────────────────────────────────────────────────────────────

export async function aggiornaStatoPratica(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return DENIED
  const parsed = statoPraticaSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  const { id, status, message, visible } = parsed.data
  try {
    const pratica = await caseById(id)
    if (!pratica) return { ok: false, message: 'Pratica non trovata.' }
    const changed = pratica.status !== status
    if (!changed && !message) return { ok: false, message: 'Cambia lo stato oppure scrivi un messaggio.' }
    if (changed) await updateCase(id, { status })
    await addEvent({
      case_id: id,
      actor: 'gestione',
      kind: changed ? 'stato' : 'nota',
      from_status: changed ? pratica.status : null,
      to_status: changed ? status : null,
      message,
      // Un cambio di stato è sempre visibile all'agenzia. Una nota solo se lo scegli.
      visible_to_agency: changed ? true : visible,
    })
    revalidatePath('/gestione', 'layout')
    return { ok: true, message: changed ? `Stato aggiornato: ${STATUS_LABEL[status]}.` : 'Nota aggiunta.' }
  } catch (err) {
    console.error('[gestione] stato pratica', err)
    return FAILED
  }
}

export async function salvaImporti(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return DENIED
  const parsed = importiSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  const { id, claim_amount, recovered_amount, recovered_at } = parsed.data
  try {
    const pratica = await caseById(id)
    if (!pratica) return { ok: false, message: 'Pratica non trovata.' }

    const patch: Record<string, unknown> = { claim_amount, recovered_amount, recovered_at }

    // Il compenso dell'agenzia si calcola solo se il modulo compensi di
    // quell'agenzia è attivo. Una volta pagato non viene più ricalcolato.
    if (!pratica.commission_paid_at) {
      const agency = pratica.agency_id ? await agencyById(pratica.agency_id) : null
      if (agency?.commission_enabled && recovered_amount !== null) {
        const pct = pratica.commission_pct ?? agency.commission_pct
        patch.commission_pct = pct
        patch.commission_amount = Math.round(recovered_amount * pct) / 100
      } else {
        patch.commission_pct = null
        patch.commission_amount = null
      }
    }
    await updateCase(id, patch)
    await addEvent({
      case_id: id,
      actor: 'gestione',
      kind: 'importo',
      message: 'Importi aggiornati.',
      visible_to_agency: false,
    })
    revalidatePath('/gestione', 'layout')
    return { ok: true, message: 'Importi salvati.' }
  } catch (err) {
    console.error('[gestione] importi', err)
    return FAILED
  }
}

export async function salvaNotaInterna(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return DENIED
  const parsed = notaInternaSchema.safeParse(formObject(fd))
  if (!parsed.success) return { ok: false, message: 'Nota troppo lunga.' }
  try {
    await updateCase(parsed.data.id, { internal_note: parsed.data.internal_note })
    revalidatePath('/gestione', 'layout')
    return { ok: true, message: 'Nota salvata.' }
  } catch (err) {
    console.error('[gestione] nota interna', err)
    return FAILED
  }
}

export async function segnaCompensoPagato(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return DENIED
  const parsed = compensoPagatoSchema.safeParse(formObject(fd))
  if (!parsed.success) return { ok: false, message: 'Data non valida.' }
  try {
    const pratica = await caseById(parsed.data.id)
    if (!pratica || pratica.commission_amount === null) {
      return { ok: false, message: 'Questa pratica non ha un compenso da pagare.' }
    }
    await updateCase(parsed.data.id, { commission_paid_at: parsed.data.paid_at })
    revalidatePath('/gestione', 'layout')
    return { ok: true, message: parsed.data.paid_at ? 'Segnato come pagato.' : 'Pagamento annullato.' }
  } catch (err) {
    console.error('[gestione] compenso', err)
    return FAILED
  }
}
