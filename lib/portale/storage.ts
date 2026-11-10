// Documenti delle pratiche su Supabase Storage (bucket privato "pratiche").
// Upload e download passano sempre dal server.

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
export const DOCS_BUCKET = 'pratiche'

function authHeaders(): Record<string, string> {
  return { apikey: SERVICE_KEY!, Authorization: `Bearer ${SERVICE_KEY}` }
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/')
}

export async function uploadObject(path: string, bytes: ArrayBuffer, mime: string): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Storage non configurato.')
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${DOCS_BUCKET}/${encodePath(path)}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': mime, 'x-upsert': 'false' },
    body: bytes,
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Caricamento su Storage fallito (${res.status}).`)
  }
}

/** Link temporaneo per scaricare un documento. Scade dopo `expiresIn` secondi. */
export async function signedDownloadUrl(path: string, expiresIn = 60): Promise<string | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) return null
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${DOCS_BUCKET}/${encodePath(path)}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn }),
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = (await res.json()) as { signedURL?: string; signedUrl?: string }
  const rel = data.signedURL ?? data.signedUrl
  return rel ? `${SUPABASE_URL}/storage/v1${rel}` : null
}
