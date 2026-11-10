import { NextResponse } from 'next/server'
import { getClientIP, rateLimit } from '@/lib/rate-limit'
import { activeAgencyByCode, addEvent, insertCase } from '@/lib/portale/data'
import { dbConfigured } from '@/lib/portale/db'
import { sameOrigin } from '@/lib/portale/http'
import { linkCaseSchema } from '@/lib/portale/schemas'

// Salva la pratica di un passeggero arrivato dal link o dal QR di un'agenzia.
// Il modulo richiesta continua a inviare la sua email come prima: questa
// chiamata si aggiunge e un suo errore non blocca mai l'invio.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 })
  if (!rateLimit(`pratica-link:${getClientIP(req)}`, 5, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const parsed = linkCaseSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })
  if (!dbConfigured()) return NextResponse.json({ ok: false }, { status: 503 })

  const d = parsed.data
  try {
    const agency = await activeAgencyByCode(d.code)
    if (!agency) return NextResponse.json({ ok: false }, { status: 404 })

    const flightDate = /^\d{4}-\d{2}-\d{2}$/.test(d.leg1.date) ? d.leg1.date : null
    const created = await insertCase({
      agency_id: agency.id,
      source: 'link_cliente',
      passenger_name: d.name,
      passenger_email: d.email,
      passenger_phone: d.phone,
      passengers_count: d.passengers,
      dep_airport: d.from,
      arr_airport: d.to,
      via_airport: d.direct === 'no' && d.via ? d.via : null,
      airline: d.leg1.airline || null,
      flight_date: flightDate,
      description: d.description || null,
      payload: { direct: d.direct, leg1: d.leg1, leg2: d.direct === 'no' ? (d.leg2 ?? null) : null },
    })
    await addEvent({
      case_id: created.id,
      actor: 'cliente',
      kind: 'creata',
      to_status: 'ricevuta',
      message: 'Richiesta inviata dal passeggero tramite il link dell’agenzia.',
    })
    return NextResponse.json({ ok: true, ref: created.ref })
  } catch (err) {
    console.error('[agenzie] pratica da link non salvata', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
