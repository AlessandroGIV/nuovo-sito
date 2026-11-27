// Pagine disponibili anche in inglese. Altrove (blog, pagine vettori/tratte, aree riservate)
// il contenuto è solo in italiano: lì il pulsante IT/EN è nascosto e header/footer restano in italiano.
const TRANSLATED_PATHS = ['/', '/chi-siamo', '/compenso', '/faq', '/richiesta', '/privacy', '/termini', '/cookie']

export function isTranslatedPath(pathname: string | null | undefined) {
  if (!pathname) return false
  const clean = pathname.replace(/\/$/, '') || '/'
  return TRANSLATED_PATHS.includes(clean)
}
