import type { Metadata } from 'next'
import Link from 'next/link'
import { AttivaForm } from '@/components/agenzie/access-forms'

export const metadata: Metadata = {
  title: 'Attiva l’accesso – Giustizia In Volo',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default async function AttivaPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  const valid = typeof token === 'string' && /^[A-Za-z0-9_-]{20,200}$/.test(token)
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-[#F6F4EF] px-4 py-12 sm:py-20">
      <div className="w-full max-w-[420px]">
        <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#072534]">Attiva l’accesso</h1>
        {valid ? (
          <>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A5E73]">
              Scegli la password della tua agenzia. Da ora in poi entrerai con il codice agenzia e questa
              password.
            </p>
            <div className="mt-6 rounded-2xl border border-[#072534]/10 bg-white p-6">
              <AttivaForm token={token} />
            </div>
          </>
        ) : (
          <p className="mt-3 text-[15px] leading-relaxed text-[#4A5E73]">
            Questo link non è valido. Apri di nuovo il link che hai ricevuto, oppure scrivi a{' '}
            <a href="mailto:info@giustiziainvolo.it" className="font-semibold text-[#072534] underline underline-offset-2">
              info@giustiziainvolo.it
            </a>{' '}
            per riceverne uno nuovo.
          </p>
        )}
        <p className="mt-5 text-[14.5px] text-[#4A5E73]">
          Hai già una password?{' '}
          <Link href="/agenzie/accedi" className="font-semibold text-[#072534] underline underline-offset-2">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  )
}
