import { cookies } from 'next/headers'
import type { Language } from '@/lib/i18n'

/** Lingua scelta dall'utente (cookie impostato dal pulsante IT/EN). Default italiano. */
export async function getServerLanguage(): Promise<Language> {
  const store = await cookies()
  return store.get('giustiziainvolo-lang')?.value === 'en' ? 'en' : 'it'
}
