// Controlli comuni delle route API del portale.

/** true se la richiesta arriva dallo stesso sito (difesa CSRF per le POST con cookie). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return false
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
