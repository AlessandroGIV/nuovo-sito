import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Se proviene dal nuovo flusso "richiesta"
    if (body?.flow === 'request') {
      const requiredTop = ['from', 'to', 'direct', 'name', 'email', 'phone', 'privacy', 'terms']
      for (const k of requiredTop) {
        if (body[k] === undefined || body[k] === '') {
          return NextResponse.json({ ok: false, message: `Campo mancante: ${k}` }, { status: 400 })
        }
      }
      // leg1 required sempre, leg2 se non diretto
      const leg1 = body.leg1 ?? {}
      const legOk = leg1.date && leg1.airline && leg1.schedDep
      if (!legOk) {
        return NextResponse.json({ ok: false, message: 'Dati volo (Volo 1) incompleti' }, { status: 400 })
      }
      if (!body.direct) {
        const leg2 = body.leg2 ?? {}
        const leg2Ok = leg2.date && leg2.airline && leg2.schedDep
        if (!leg2Ok) {
          return NextResponse.json({ ok: false, message: 'Dati volo (Volo 2) incompleti' }, { status: 400 })
        }
      }

      // TODO: integrazione email/DB
      return NextResponse.json({ ok: true, message: 'Richiesta inviata con successo.' })
    }

    // Campi obbligatori aggiornati (telefono incluso)
    const requiredLegacy = ['name', 'email', 'flightNumber', 'date', 'phone', 'privacy', 'terms']
    for (const key of requiredLegacy) {
      if (!body?.[key]) {
        return NextResponse.json({ ok: false, message: `Campo mancante: ${key}` }, { status: 400 })
      }
    }

    // honeypot
    if (body.company) {
      return NextResponse.json({ ok: true, message: 'Grazie! Ti contatteremo a breve.' })
    }

    // Qui si può integrare un provider email/DB
    return NextResponse.json({ ok: true, message: 'Richiesta inviata con successo.' })
  } catch {
    return NextResponse.json({ ok: false, message: 'Errore durante l’invio. Riprova.' }, { status: 500 })
  }
}
