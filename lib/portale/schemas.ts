// Validazione dei dati in ingresso (zod). I messaggi sono quelli mostrati a schermo.

import { z } from 'zod'
import { AGENCY_CODE_RE, CASE_STATUSES, DISRUPTIONS, PASSWORD_MIN_LENGTH, UUID_RE } from './constants'

const str = () => z.string({ required_error: 'Campo obbligatorio', invalid_type_error: 'Campo obbligatorio' })

const req = (max: number) => str().trim().min(1, 'Campo obbligatorio').max(max, `Massimo ${max} caratteri`)
const opt = (max: number) =>
  str()
    .trim()
    .max(max, `Massimo ${max} caratteri`)
    .optional()
    .transform((v) => (v ? v : null))

const email = str().trim().toLowerCase().min(1, 'Campo obbligatorio').max(200).email('Email non valida')
const phone = str()
  .trim()
  .min(1, 'Campo obbligatorio')
  .regex(/^\+?[\d\s\-().]{7,20}$/, 'Numero di telefono non valido')
const isoDate = str()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida')
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Data non valida')
const optDate = str()
  .trim()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), 'Data non valida')
const optMoney = str()
  .trim()
  .optional()
  .transform((v) => (v ? v.replace(/\s/g, '').replace(',', '.') : null))
  .refine((v) => v === null || /^\d{1,7}(\.\d{1,2})?$/.test(v), 'Importo non valido')
  .transform((v) => (v === null ? null : Number(v)))
const uuid = str().regex(UUID_RE, 'Identificativo non valido')
const checked = (message: string) => z.literal('on', { errorMap: () => ({ message }) })

export const agencyCode = str()
  .trim()
  .toUpperCase()
  .regex(AGENCY_CODE_RE, 'Il codice ha da 4 a 16 lettere o cifre')

const password = str()
  .min(PASSWORD_MIN_LENGTH, `Almeno ${PASSWORD_MIN_LENGTH} caratteri`)
  .max(200, 'Massimo 200 caratteri')

// ── Agenzie ─────────────────────────────────────────────────────────────────

export const candidaturaSchema = z.object({
  ragione_sociale: req(160),
  partita_iva: str()
    .trim()
    .transform((v) => v.replace(/^IT/i, '').replace(/\s/g, ''))
    .refine((v) => /^\d{11}$/.test(v), 'La partita IVA ha 11 cifre'),
  citta: req(80),
  provincia: str()
    .trim()
    .toUpperCase()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^[A-Z]{2}$/.test(v), 'Sigla di due lettere, es. RM'),
  referente: req(120),
  email,
  telefono: phone,
  sito: opt(200),
  messaggio: opt(1000),
  privacy: checked('Serve il consenso per ricontattarti'),
})

export const loginSchema = z.object({
  code: agencyCode,
  password: str().min(1, 'Campo obbligatorio').max(200),
})

export const attivaSchema = z
  .object({
    token: str().min(20).max(200),
    password,
    conferma: str(),
  })
  .refine((v) => v.password === v.conferma, { path: ['conferma'], message: 'Le due password non coincidono' })

export const cambiaPasswordSchema = z
  .object({
    attuale: str().min(1, 'Campo obbligatorio').max(200),
    password,
    conferma: str(),
  })
  .refine((v) => v.password === v.conferma, { path: ['conferma'], message: 'Le due password non coincidono' })

// Email e telefono del passeggero sono obbligatori, salvo quando un'agenzia
// abilitata tiene lei i contatti. In quel caso sono facoltativi.
const optEmail = str()
  .trim()
  .toLowerCase()
  .max(200)
  .optional()
  .transform((v) => v || null)
  .refine((v) => v === null || z.string().email().safeParse(v).success, 'Email non valida')
const optPhone = str()
  .trim()
  .optional()
  .transform((v) => v || null)
  .refine((v) => v === null || /^\+?[\d\s\-().]{7,20}$/.test(v), 'Numero di telefono non valido')

export const segnalazioneSchema = z
  .object({
  passenger_name: req(160),
  passenger_email: optEmail,
  passenger_phone: optPhone,
  contact_via_agency: str().optional().transform((v) => v === 'agenzia'),
  passengers_count: z.coerce.number().int().min(1, 'Almeno 1').max(20, 'Massimo 20'),
  dep_airport: req(120),
  arr_airport: req(120),
  via_airport: opt(120),
  airline: req(120),
  flight_number: str()
    .trim()
    .toUpperCase()
    .optional()
    .transform((v) => (v ? v.replace(/\s/g, '') : null))
    .refine((v) => v === null || /^[A-Z0-9]{2,3}\d{1,4}[A-Z]?$/.test(v), 'Formato atteso, es. FR1234'),
  flight_date: isoDate.refine((v) => Date.parse(v) <= Date.now() + 86_400_000, 'Il volo deve essere già avvenuto'),
  disruption: z.enum(DISRUPTIONS, { errorMap: () => ({ message: 'Scegli il tipo di disservizio' }) }),
  booking_ref: opt(40),
  description: opt(2000),
  consenso: checked('Conferma di aver informato il passeggero'),
})
  .superRefine((d, ctx) => {
    if (d.contact_via_agency) return
    if (!d.passenger_email) ctx.addIssue({ code: 'custom', path: ['passenger_email'], message: 'Campo obbligatorio' })
    if (!d.passenger_phone) ctx.addIssue({ code: 'custom', path: ['passenger_phone'], message: 'Campo obbligatorio' })
  })

/** Dati del modulo richiesta del sito, quando il passeggero arriva dal link di un'agenzia. */
const leg = z.object({
  date: str().trim().max(20),
  airline: str().trim().max(120),
  schedDep: str().trim().max(10),
})
export const linkCaseSchema = z.object({
  code: agencyCode,
  name: req(160),
  email,
  phone,
  from: req(120),
  to: req(120),
  via: str().trim().max(120).optional().default(''),
  direct: z.enum(['si', 'no']),
  leg1: leg,
  leg2: leg.optional(),
  description: str().trim().max(4000).optional().default(''),
  passengers: z.coerce.number().int().min(1).max(20).default(1),
})

// ── Gestione ────────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({ password: str().min(1, 'Campo obbligatorio').max(500) })

export const approvaSchema = z.object({
  id: uuid,
  code: str()
    .trim()
    .toUpperCase()
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || AGENCY_CODE_RE.test(v), 'Il codice ha da 4 a 16 lettere o cifre'),
})

export const idSchema = z.object({ id: uuid })

export const agenziaSchema = z.object({
  id: uuid,
  status: z.enum(['active', 'suspended', 'rejected', 'pending']),
  commission_enabled: str().optional().transform((v) => v === 'on'),
  agency_contact_enabled: str().optional().transform((v) => v === 'on'),
  commission_pct: str()
    .trim()
    .transform((v) => v.replace(',', '.'))
    .refine((v) => /^\d{1,3}(\.\d{1,2})?$/.test(v) && Number(v) <= 100, 'Percentuale tra 0 e 100')
    .transform(Number),
  note_interne: opt(4000),
})

export const nuovaAgenziaSchema = candidaturaSchema.omit({ privacy: true, messaggio: true }).extend({
  code: approvaSchema.shape.code,
})

export const statoPraticaSchema = z.object({
  id: uuid,
  status: z.enum(CASE_STATUSES),
  message: opt(1500),
  visible: str().optional().transform((v) => v === 'on'),
})

export const importiSchema = z.object({
  id: uuid,
  claim_amount: optMoney,
  recovered_amount: optMoney,
  recovered_at: optDate,
})

export const notaInternaSchema = z.object({ id: uuid, internal_note: opt(8000) })

export const compensoPagatoSchema = z.object({ id: uuid, paid_at: optDate })

// ── Utilità ─────────────────────────────────────────────────────────────────

export type FieldErrors = Record<string, string>

export type ActionResult<T = undefined> = {
  ok: boolean
  message?: string
  fieldErrors?: FieldErrors
  data?: T
}

export function formObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of fd.entries()) if (typeof v === 'string') out[k] = v
  return out
}

export function fieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
