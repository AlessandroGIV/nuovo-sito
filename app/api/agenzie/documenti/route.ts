import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import {
  ALLOWED_UPLOAD_TYPES,
  CLOSED_STATUSES,
  MAX_DOCS_PER_CASE,
  MAX_UPLOAD_BYTES,
} from '@/lib/portale/constants'
import { addEvent, agencyCaseById, countCaseDocuments, insertDocument } from '@/lib/portale/data'
import { sameOrigin } from '@/lib/portale/http'
import { gestioneUrl, notifyLater } from '@/lib/portale/notify'
import { getAgency } from '@/lib/portale/session'
import { uploadObject } from '@/lib/portale/storage'

export const runtime = 'nodejs'

/** Il contenuto corrisponde al tipo dichiarato? Controllo sui primi byte. */
function looksLike(mime: string, b: Uint8Array): boolean {
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to))
  switch (mime) {
    case 'application/pdf':
      return ascii(0, 5) === '%PDF-'
    case 'image/jpeg':
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff
    case 'image/png':
      return b[0] === 0x89 && ascii(1, 4) === 'PNG'
    case 'image/webp':
      return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
    case 'image/heic':
      return ascii(4, 8) === 'ftyp'
    default:
      return false
  }
}

function json(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status })
}

// Carica un documento su una pratica dell'agenzia. Un file per richiesta.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json(403, 'Richiesta non valida.')
  const agency = await getAgency()
  if (!agency) return json(401, 'Sessione scaduta. Accedi di nuovo.')
  if (!rateLimit(`agenzia-doc:${agency.id}`, 60, 10 * 60_000)) {
    return json(429, 'Troppi caricamenti in poco tempo. Riprova tra qualche minuto.')
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return json(400, 'File non leggibile.')
  }
  const caseId = String(form.get('case_id') ?? '')
  const file = form.get('file')
  if (!(file instanceof File)) return json(400, 'Nessun file ricevuto.')
  if (file.size === 0) return json(400, 'Il file è vuoto.')
  if (file.size > MAX_UPLOAD_BYTES) return json(413, 'Il file supera i 4 MB.')
  const ext = ALLOWED_UPLOAD_TYPES[file.type]
  if (!ext) return json(415, 'Formato non accettato. Carica PDF, JPG, PNG, WEBP o HEIC.')

  try {
    const pratica = await agencyCaseById(agency.id, caseId)
    if (!pratica) return json(404, 'Pratica non trovata.')
    if (CLOSED_STATUSES.includes(pratica.status)) return json(409, 'La pratica è chiusa.')
    if ((await countCaseDocuments(pratica.id)) >= MAX_DOCS_PER_CASE) {
      return json(409, `Massimo ${MAX_DOCS_PER_CASE} documenti per pratica.`)
    }

    const bytes = await file.arrayBuffer()
    if (!looksLike(file.type, new Uint8Array(bytes.slice(0, 16)))) {
      return json(415, 'Il contenuto del file non corrisponde al formato.')
    }

    const path = `${agency.id}/${pratica.id}/${randomUUID()}.${ext}`
    const filename = file.name.replace(/[\u0000-\u001f\u007f/\\]/g, '_').slice(0, 160) || `documento.${ext}`
    await uploadObject(path, bytes, file.type)
    await insertDocument({
      case_id: pratica.id,
      storage_path: path,
      filename,
      mime: file.type,
      size_bytes: file.size,
      uploaded_by: 'agenzia',
    })
    await addEvent({
      case_id: pratica.id,
      actor: 'agenzia',
      kind: 'documento',
      message: filename,
    })
    // Avviso solo quando l'agenzia risponde a una richiesta di documenti,
    // e uno solo anche se carica più file di seguito.
    if (pratica.status === 'documenti_richiesti' && rateLimit(`avviso-doc:${pratica.id}`, 1, 10 * 60_000)) {
      notifyLater(`Documenti integrati sulla pratica ${pratica.ref}`, [
        `${agency.ragione_sociale} ha caricato nuovi documenti sulla pratica ${pratica.ref}, che era in attesa di integrazione.`,
        '',
        'Li trovi in gestione.',
        gestioneUrl(`/pratiche/${pratica.id}`),
      ])
    }
    return NextResponse.json({ ok: true, filename })
  } catch (err) {
    console.error('[agenzie] documento non salvato', err)
    return json(500, 'Caricamento non riuscito. Riprova.')
  }
}
