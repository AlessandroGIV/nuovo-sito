// Accesso a Supabase dal server con la service role key, via REST (PostgREST).
// Stesso schema di app/api/consent/route.ts, senza dipendenze aggiuntive.
// Non importare questo file da componenti client.

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export class DbError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'DbError'
    this.status = status
    this.code = code
  }
}

export function dbConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY)
}

export type Query = Record<string, string | number | undefined>

function qs(query?: Query): string {
  if (!query) return ''
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) p.append(k, String(v))
  }
  const s = p.toString()
  return s ? `?${s}` : ''
}

async function request(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD',
  table: string,
  opts: { query?: Query; body?: unknown; prefer?: string } = {},
): Promise<Response> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new DbError('Database non configurato (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).', 503)
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${qs(opts.query)}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.prefer ? { Prefer: opts.prefer } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  })
  if (!res.ok) {
    let code: string | undefined
    let message = `Supabase ${method} ${table} ha risposto ${res.status}`
    try {
      const err = (await res.json()) as { code?: string; message?: string }
      code = err.code
      if (err.message) message += ` (${err.message})`
    } catch {
      // corpo non JSON, basta lo status
    }
    throw new DbError(message, res.status, code)
  }
  return res
}

export async function dbSelect<T>(table: string, query?: Query): Promise<T[]> {
  const res = await request('GET', table, { query })
  return (await res.json()) as T[]
}

export async function dbSelectOne<T>(table: string, query?: Query): Promise<T | null> {
  const rows = await dbSelect<T>(table, { ...query, limit: 1 })
  return rows[0] ?? null
}

export async function dbInsert<T>(table: string, row: Record<string, unknown>, select = '*'): Promise<T> {
  const res = await request('POST', table, {
    query: { select },
    body: row,
    prefer: 'return=representation',
  })
  const rows = (await res.json()) as T[]
  return rows[0]
}

/** Aggiorna le righe che rispettano il filtro. Il filtro è obbligatorio. */
export async function dbUpdate<T>(
  table: string,
  filter: Query,
  patch: Record<string, unknown>,
  select = '*',
): Promise<T[]> {
  if (Object.keys(filter).length === 0) throw new DbError('Aggiornamento senza filtro rifiutato.', 400)
  const res = await request('PATCH', table, {
    query: { ...filter, select },
    body: patch,
    prefer: 'return=representation',
  })
  return (await res.json()) as T[]
}

export async function dbCount(table: string, filter?: Query): Promise<number> {
  const res = await request('HEAD', table, { query: { ...filter, select: 'id' }, prefer: 'count=exact' })
  const range = res.headers.get('content-range') ?? ''
  const total = Number(range.split('/')[1])
  return Number.isFinite(total) ? total : 0
}

/** Violazione di vincolo unique (es. codice agenzia già usato). */
export function isUniqueViolation(err: unknown): boolean {
  return err instanceof DbError && err.code === '23505'
}
