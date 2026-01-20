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
      if (body.direct === "no") {
        const leg2 = body.leg2 ?? {}
        const leg2Ok = leg2.date && leg2.airline && leg2.schedDep
        if (!leg2Ok) {
          return NextResponse.json({ ok: false, message: 'Dati volo (Volo 2) incompleti' }, { status: 400 })
        }
      }

      // Prepara i parametri per il template EmailJS
      const templateParams = {
        // Data invio
        submission_date: new Date().toLocaleDateString('it-IT', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        
        // Dati personali
        full_name: body.name,
        email: body.email,
        phone: body.phone,
        
        // Itinerario
        is_direct_label: body.direct === 'si' ? 'Volo Diretto' : 'Volo con Scalo',
        departure_airport: body.from,
        via_airport: body.via || 'N/A',
        arrival_airport: body.to,
        
        // Primo segmento
        segment1_date: leg1.date,
        segment1_time: leg1.schedDep,
        segment1_airline: leg1.airline,
        
        // Legacy fields per compatibilità
        flight_number: leg1.airline,
        flight_date: leg1.date,
        
        // Secondo segmento (se presente)
        segment2_date: body.direct === 'no' ? body.leg2.date : 'N/A',
        segment2_time: body.direct === 'no' ? body.leg2.schedDep : 'N/A',
        segment2_airline: body.direct === 'no' ? body.leg2.airline : 'N/A',
        
        // Descrizione problema
        description: body.description || 'Nessuna descrizione fornita',
      }

      // Invia email tramite EmailJS
      try {
        const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
            template_params: templateParams,
          }),
        })

        if (!emailResponse.ok) {
          console.error('[v0] EmailJS error:', await emailResponse.text())
          return NextResponse.json({ 
            ok: false, 
            message: 'Errore nell\'invio della richiesta. Riprova più tardi.' 
          }, { status: 500 })
        }

        return NextResponse.json({ ok: true, message: 'Richiesta inviata con successo.' })
      } catch (emailError) {
        console.error('[v0] EmailJS exception:', emailError)
        return NextResponse.json({ 
          ok: false, 
          message: 'Errore nell\'invio della richiesta. Verifica la configurazione EmailJS.' 
        }, { status: 500 })
      }
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
