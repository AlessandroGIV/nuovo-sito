import { NextResponse } from 'next/server'
import { getClientIP, rateLimit } from '@/lib/rate-limit'
import { AGENCY_CODE_RE } from '@/lib/portale/constants'
import { activeAgencyByCode } from '@/lib/portale/data'
import { dbConfigured } from '@/lib/portale/db'

// Dato un codice agenzia restituisce il nome dell'agenzia, se attiva.
// Serve al modulo richiesta per dire al passeggero tramite chi sta aprendo la pratica.
export async function GET(req: Request) {
  if (!rateLimit(`attribuzione:${getClientIP(req)}`, 30, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }
  const code = (new URL(req.url).searchParams.get('code') ?? '').trim().toUpperCase()
  if (!AGENCY_CODE_RE.test(code) || !dbConfigured()) return NextResponse.json({ ok: false })
  try {
    const agency = await activeAgencyByCode(code)
    if (!agency) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true, code, name: agency.ragione_sociale })
  } catch (err) {
    console.error('[agenzie] attribuzione', err)
    return NextResponse.json({ ok: false })
  }
}
