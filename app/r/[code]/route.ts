import { NextResponse } from 'next/server'
import { AGENCY_CODE_RE } from '@/lib/portale/constants'

// Link personale dell'agenzia: giustiziainvolo.it/r/CODICE
// Porta il passeggero al modulo richiesta con l'agenzia già indicata.
export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code: raw } = await ctx.params
  const code = raw.trim().toUpperCase()
  const dest = new URL('/richiesta', req.url)
  if (AGENCY_CODE_RE.test(code)) dest.searchParams.set('ag', code)
  const res = NextResponse.redirect(dest, 307)
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}
