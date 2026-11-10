// Sessioni del portale. Un cookie firmato (HMAC-SHA256) per l'agenzia e uno
// per la gestione. A ogni richiesta la sessione dell'agenzia viene ricontrollata
// sul database, così sospensione e cambio password hanno effetto subito.

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { dbConfigured, dbSelectOne } from './db'
import { AGENCY_COLUMNS, type Agency } from './types'
import { UUID_RE } from './constants'

const AGENCY_COOKIE = 'giv_agenzia'
const ADMIN_COOKIE = 'giv_gestione'
const AGENCY_TTL_S = 60 * 60 * 24 * 30
const ADMIN_TTL_S = 60 * 60 * 12

type Payload =
  | { t: 'ag'; id: string; v: number; exp: number }
  | { t: 'adm'; exp: number }

function secret(): string | null {
  const s = process.env.PORTAL_SESSION_SECRET
  return s && s.length >= 32 ? s : null
}

/** Il portale funziona solo con database e segreto di sessione configurati. */
export function portalConfigured(): boolean {
  return dbConfigured() && secret() !== null
}

export function adminConfigured(): boolean {
  const p = process.env.GESTIONE_PASSWORD
  return portalConfigured() && Boolean(p && p.length >= 16)
}

function sign(payload: Payload): string | null {
  const key = secret()
  if (!key) return null
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const mac = createHmac('sha256', key).update(body).digest('base64url')
  return `${body}.${mac}`
}

function verify(token: string | undefined): Payload | null {
  const key = secret()
  if (!key || !token) return null
  const dot = token.indexOf('.')
  if (dot < 1) return null
  const body = token.slice(0, dot)
  const mac = Buffer.from(token.slice(dot + 1), 'base64url')
  const expected = createHmac('sha256', key).update(body).digest()
  if (mac.length !== expected.length || !timingSafeEqual(mac, expected)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Payload
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) return null
    return payload
  } catch {
    return null
  }
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

// ── Agenzia ─────────────────────────────────────────────────────────────────

export async function startAgencySession(agencyId: string, sessionVersion: number): Promise<boolean> {
  const token = sign({ t: 'ag', id: agencyId, v: sessionVersion, exp: Math.floor(Date.now() / 1000) + AGENCY_TTL_S })
  if (!token) return false
  ;(await cookies()).set(AGENCY_COOKIE, token, cookieOptions(AGENCY_TTL_S))
  return true
}

export async function endAgencySession(): Promise<void> {
  ;(await cookies()).delete(AGENCY_COOKIE)
}

/** L'agenzia che ha fatto l'accesso, oppure null. */
export const getAgency = cache(async (): Promise<Agency | null> => {
  const payload = verify((await cookies()).get(AGENCY_COOKIE)?.value)
  if (!payload || payload.t !== 'ag' || !UUID_RE.test(payload.id)) return null
  const row = await dbSelectOne<Agency & { session_version: number }>('agencies', {
    select: `${AGENCY_COLUMNS},session_version`,
    id: `eq.${payload.id}`,
  })
  if (!row || row.status !== 'active' || row.session_version !== payload.v) return null
  const { session_version: _v, ...agency } = row
  return agency
})

export async function requireAgency(): Promise<Agency> {
  const agency = await getAgency()
  if (!agency) redirect('/agenzie/accedi')
  return agency
}

// ── Gestione ────────────────────────────────────────────────────────────────

export async function startAdminSession(): Promise<boolean> {
  const token = sign({ t: 'adm', exp: Math.floor(Date.now() / 1000) + ADMIN_TTL_S })
  if (!token) return false
  ;(await cookies()).set(ADMIN_COOKIE, token, cookieOptions(ADMIN_TTL_S))
  return true
}

export async function endAdminSession(): Promise<void> {
  ;(await cookies()).delete(ADMIN_COOKIE)
}

export const isAdmin = cache(async (): Promise<boolean> => {
  if (!adminConfigured()) return false
  const payload = verify((await cookies()).get(ADMIN_COOKIE)?.value)
  return payload?.t === 'adm'
})

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/gestione/accedi')
}

// ── Richiesta ───────────────────────────────────────────────────────────────

export async function clientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0].trim() ?? h.get('x-real-ip') ?? 'unknown'
}

/** Origine pubblica della richiesta, es. https://giustiziainvolo.it */
export async function requestOrigin(): Promise<string> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!host) return 'https://giustiziainvolo.it'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')
  return `${proto}://${host}`
}
