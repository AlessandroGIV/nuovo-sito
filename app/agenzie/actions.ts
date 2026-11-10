'use server'

import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import { DISRUPTION_LABEL } from '@/lib/portale/constants'
import { hashPassword, hashToken, verifyPassword } from '@/lib/portale/crypto'
import {
  addEvent,
  agencyAuthByCode,
  agencyAuthById,
  agencyAuthBySetupToken,
  agencyExistsByVat,
  insertCase,
  updateAgency,
} from '@/lib/portale/data'
import { dbInsert } from '@/lib/portale/db'
import { gestioneUrl, itDate, notifyLater } from '@/lib/portale/notify'
import {
  attivaSchema,
  cambiaPasswordSchema,
  candidaturaSchema,
  fieldErrors,
  formObject,
  loginSchema,
  segnalazioneSchema,
  type ActionResult,
} from '@/lib/portale/schemas'
import {
  clientIp,
  endAgencySession,
  getAgency,
  portalConfigured,
  startAgencySession,
} from '@/lib/portale/session'

const NOT_AVAILABLE =
  'Il servizio non è disponibile in questo momento. Riprova più tardi o scrivi a info@giustiziainvolo.it.'
const MAX_FAILED_LOGINS = 5
const LOCK_MINUTES = 15

// Hash di riferimento per far durare la verifica lo stesso tempo
// anche quando il codice agenzia non esiste.
const DUMMY_HASH =
  'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

// ── Richiesta di adesione ───────────────────────────────────────────────────

export async function inviaCandidatura(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const ip = await clientIp()
  if (!rateLimit(`candidatura:${ip}`, 3, 10 * 60_000)) {
    return { ok: false, message: 'Hai inviato troppe richieste. Riprova tra qualche minuto.' }
  }

  const raw = formObject(fd)
  // Campo trappola: le persone non lo vedono, i bot lo compilano.
  if (raw.sito_aziendale) return { ok: true }

  const parsed = candidaturaSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  if (!portalConfigured()) return { ok: false, message: NOT_AVAILABLE }

  const { privacy: _privacy, ...data } = parsed.data
  try {
    // Una sola richiesta per partita IVA. La risposta resta la stessa,
    // così non si può scoprire chi è già partner.
    if (!(await agencyExistsByVat(data.partita_iva))) {
      const created = await dbInsert<{ id: string }>(
        'agencies',
        { ...data, status: 'pending', privacy_accepted_at: new Date().toISOString() },
        'id',
      )
      notifyLater(`Nuova richiesta di adesione, ${data.ragione_sociale}`, [
        `${data.ragione_sociale} (${data.citta}) ha chiesto di aderire al portale agenzie.`,
        '',
        'La trovi in gestione, da dove puoi approvarla.',
        gestioneUrl(`/agenzie/${created.id}`),
      ])
    }
  } catch (err) {
    console.error('[agenzie] candidatura non salvata', err)
    return { ok: false, message: NOT_AVAILABLE }
  }
  return { ok: true }
}

// ── Accesso ─────────────────────────────────────────────────────────────────

export async function accedi(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const ip = await clientIp()
  if (!rateLimit(`agenzia-login:${ip}`, 10, 10 * 60_000)) {
    return { ok: false, message: 'Troppi tentativi. Riprova tra qualche minuto.' }
  }
  const parsed = loginSchema.safeParse(formObject(fd))
  if (!parsed.success) return { ok: false, message: 'Codice o password non corretti.' }
  if (!portalConfigured()) return { ok: false, message: NOT_AVAILABLE }

  const { code, password } = parsed.data
  let sessionVersion: number
  let agencyId: string
  try {
    const agency = await agencyAuthByCode(code)
    if (!agency || !agency.password_hash) {
      await verifyPassword(password, DUMMY_HASH)
      return { ok: false, message: 'Codice o password non corretti.' }
    }
    if (agency.locked_until && Date.parse(agency.locked_until) > Date.now()) {
      const minutes = Math.max(1, Math.ceil((Date.parse(agency.locked_until) - Date.now()) / 60_000))
      return { ok: false, message: `Troppi tentativi. L’accesso è sospeso per altri ${minutes} minuti.` }
    }
    if (!(await verifyPassword(password, agency.password_hash))) {
      const failed = agency.failed_logins + 1
      await updateAgency(
        agency.id,
        failed >= MAX_FAILED_LOGINS
          ? { failed_logins: 0, locked_until: new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() }
          : { failed_logins: failed },
      )
      return { ok: false, message: 'Codice o password non corretti.' }
    }
    if (agency.status !== 'active') {
      return { ok: false, message: 'L’accesso di questa agenzia non è attivo. Scrivi a info@giustiziainvolo.it.' }
    }
    await updateAgency(agency.id, {
      failed_logins: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
    })
    agencyId = agency.id
    sessionVersion = agency.session_version
  } catch (err) {
    console.error('[agenzie] accesso fallito', err)
    return { ok: false, message: NOT_AVAILABLE }
  }

  if (!(await startAgencySession(agencyId, sessionVersion))) return { ok: false, message: NOT_AVAILABLE }
  redirect('/agenzie/area')
}

export async function esci(): Promise<void> {
  await endAgencySession()
  redirect('/agenzie/accedi')
}

/** Primo accesso o password dimenticata: l'agenzia sceglie la password dal link ricevuto. */
export async function attivaAccesso(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const ip = await clientIp()
  if (!rateLimit(`agenzia-attiva:${ip}`, 10, 10 * 60_000)) {
    return { ok: false, message: 'Troppi tentativi. Riprova tra qualche minuto.' }
  }
  const parsed = attivaSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error)
    if (errors.token) return { ok: false, message: 'Il link non è valido. Chiedine uno nuovo.' }
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: errors }
  }
  if (!portalConfigured()) return { ok: false, message: NOT_AVAILABLE }

  let agencyId: string
  let version: number
  try {
    const agency = await agencyAuthBySetupToken(hashToken(parsed.data.token))
    const expired = !agency?.setup_token_expires_at || Date.parse(agency.setup_token_expires_at) < Date.now()
    if (!agency || expired || agency.status !== 'active') {
      return { ok: false, message: 'Il link è scaduto o è già stato usato. Chiedine uno nuovo.' }
    }
    version = agency.session_version + 1
    await updateAgency(agency.id, {
      password_hash: await hashPassword(parsed.data.password),
      setup_token_hash: null,
      setup_token_expires_at: null,
      session_version: version,
      failed_logins: 0,
      locked_until: null,
      last_login_at: new Date().toISOString(),
    })
    agencyId = agency.id
  } catch (err) {
    console.error('[agenzie] attivazione fallita', err)
    return { ok: false, message: NOT_AVAILABLE }
  }

  if (!(await startAgencySession(agencyId, version))) return { ok: false, message: NOT_AVAILABLE }
  redirect('/agenzie/area')
}

export async function cambiaPassword(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const agency = await getAgency()
  if (!agency) return { ok: false, message: 'Sessione scaduta. Accedi di nuovo.' }
  if (!rateLimit(`agenzia-password:${agency.id}`, 5, 10 * 60_000)) {
    return { ok: false, message: 'Troppi tentativi. Riprova tra qualche minuto.' }
  }
  const parsed = cambiaPasswordSchema.safeParse(formObject(fd))
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  try {
    const auth = await agencyAuthById(agency.id)
    if (!auth || !(await verifyPassword(parsed.data.attuale, auth.password_hash))) {
      return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: { attuale: 'Password attuale non corretta' } }
    }
    // Cambiare la password chiude le sessioni aperte sugli altri dispositivi.
    const version = auth.session_version + 1
    await updateAgency(agency.id, {
      password_hash: await hashPassword(parsed.data.password),
      session_version: version,
    })
    await startAgencySession(agency.id, version)
  } catch (err) {
    console.error('[agenzie] cambio password fallito', err)
    return { ok: false, message: NOT_AVAILABLE }
  }
  return { ok: true, message: 'Password aggiornata.' }
}

// ── Segnalazione di una pratica ─────────────────────────────────────────────

export async function creaSegnalazione(
  _prev: ActionResult<{ id: string; ref: string }>,
  fd: FormData,
): Promise<ActionResult<{ id: string; ref: string }>> {
  const agency = await getAgency()
  if (!agency) return { ok: false, message: 'Sessione scaduta. Accedi di nuovo.' }
  if (!rateLimit(`agenzia-pratica:${agency.id}`, 30, 60 * 60_000)) {
    return { ok: false, message: 'Hai inserito molte pratiche in poco tempo. Riprova tra qualche minuto.' }
  }
  const input = formObject(fd)
  // Solo un'agenzia abilitata dalla gestione può tenere lei i contatti col passeggero
  if (!agency.agency_contact_enabled) delete input.contact_via_agency
  const parsed = segnalazioneSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: 'Controlla i campi evidenziati.', fieldErrors: fieldErrors(parsed.error) }
  }
  const { consenso: _consenso, ...data } = parsed.data
  try {
    const created = await insertCase({ ...data, agency_id: agency.id, source: 'modulo_agenzia' })
    await addEvent({
      case_id: created.id,
      actor: 'agenzia',
      kind: 'creata',
      to_status: 'ricevuta',
      message: 'Pratica segnalata dall’agenzia.',
    })
    notifyLater(`Nuova pratica ${created.ref} da ${agency.ragione_sociale}`, [
      `${agency.ragione_sociale} (codice ${agency.code}) ha segnalato la pratica ${created.ref}.`,
      `Tratta ${data.dep_airport}, ${data.arr_airport}. Volo del ${itDate(data.flight_date)}, ${DISRUPTION_LABEL[data.disruption].toLowerCase()}.`,
      ...(data.contact_via_agency ? ['I contatti col passeggero li tiene l’agenzia.'] : []),
      '',
      'Dati del passeggero e documenti sono in gestione.',
      gestioneUrl(`/pratiche/${created.id}`),
    ])
    return { ok: true, data: created }
  } catch (err) {
    console.error('[agenzie] segnalazione non salvata', err)
    return { ok: false, message: NOT_AVAILABLE }
  }
}
