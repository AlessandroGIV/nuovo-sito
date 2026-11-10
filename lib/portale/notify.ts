// Avvisi email alla gestione: nuova richiesta di adesione, nuova pratica
// segnalata da un'agenzia, documenti integrati su una pratica in attesa.
//
// L'invio passa da Resend (REST, nessuna dipendenza). Senza RESEND_API_KEY
// non parte nulla e il portale funziona come prima.
//
// Nel testo non entrano dati dei passeggeri. Ci sono solo riferimento,
// agenzia, tratta e il link alla gestione, dove si leggono dopo l'accesso.
// Solo server.

import { after } from 'next/server'

const API_URL = process.env.RESEND_API_URL ?? 'https://api.resend.com/emails'
const API_KEY = process.env.RESEND_API_KEY
// Con il mittente di prova di Resend (onboarding@resend.dev) la consegna
// funziona solo verso l'indirizzo con cui è registrato l'account Resend.
const TO = process.env.PORTAL_NOTIFY_TO ?? 'info@giustiziainvolo.it'
const FROM = process.env.PORTAL_NOTIFY_FROM ?? 'Portale agenzie GIV <onboarding@resend.dev>'
// I link negli avvisi puntano sempre a questo indirizzo, mai a quello letto
// dalle intestazioni della richiesta, che chi scrive al modulo pubblico può alterare.
const SITE = (process.env.PORTAL_PUBLIC_URL ?? 'https://giustiziainvolo.it').replace(/\/+$/, '')

/** Indirizzo assoluto di una pagina della gestione, da mettere negli avvisi. */
export function gestioneUrl(path: string): string {
  return `${SITE}/gestione${path}`
}

export function notifyConfigured(): boolean {
  return Boolean(API_KEY)
}

async function send(subject: string, lines: string[]): Promise<void> {
  if (!API_KEY) return
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      // Niente a capo nell'oggetto, qualunque cosa contengano i dati inseriti
      body: JSON.stringify({ from: FROM, to: [TO], subject: subject.replace(/\s+/g, ' ').slice(0, 200), text: lines.join('\n') }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) console.error(`[avvisi] invio non riuscito (${res.status})`)
  } catch (err) {
    console.error('[avvisi] invio non riuscito', err)
  }
}

/**
 * Manda l'avviso dopo che la risposta è partita. Un errore o un ritardo
 * dell'invio non tocca chi sta usando il portale.
 */
export function notifyLater(subject: string, lines: string[]): void {
  if (!notifyConfigured()) return
  after(() => send(subject, lines))
}

/** 2026-10-28 diventa 28/10/2026 */
export function itDate(iso: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '')
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ''
}
