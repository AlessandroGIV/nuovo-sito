import { NextResponse } from 'next/server'
import { documentById } from '@/lib/portale/data'
import { isAdmin } from '@/lib/portale/session'
import { signedDownloadUrl } from '@/lib/portale/storage'

export const runtime = 'nodejs'

// Apre un documento di una pratica. Solo gestione.
// Genera un link temporaneo (60 secondi) e ci reindirizza.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new NextResponse('Non autorizzato', { status: 401 })
  const { id } = await ctx.params
  try {
    const doc = await documentById(id)
    if (!doc) return new NextResponse('Documento non trovato', { status: 404 })
    const url = await signedDownloadUrl(doc.storage_path, 60)
    if (!url) return new NextResponse('Documento non disponibile', { status: 502 })
    const res = NextResponse.redirect(url, 302)
    res.headers.set('Cache-Control', 'no-store')
    res.headers.set('Referrer-Policy', 'no-referrer')
    return res
  } catch (err) {
    console.error('[gestione] documento', err)
    return new NextResponse('Errore', { status: 500 })
  }
}
