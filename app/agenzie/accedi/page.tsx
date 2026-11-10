import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/agenzie/access-forms'
import { getAgency, portalConfigured } from '@/lib/portale/session'

export const metadata: Metadata = {
  title: 'Accesso area agenzie – Giustizia In Volo',
  robots: { index: false, follow: false },
}

export default async function AccediPage() {
  if (portalConfigured() && (await getAgency())) redirect('/agenzie/area')
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-[#F6F4EF] px-4 py-12 sm:py-20">
      <div className="w-full max-w-[420px]">
        <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#072534]">Area agenzie</h1>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A5E73]">
          Entra con il codice agenzia e la password che hai scelto.
        </p>
        <div className="mt-6 rounded-2xl border border-[#072534]/10 bg-white p-6">
          <LoginForm />
        </div>
        <p className="mt-5 text-[14.5px] leading-relaxed text-[#4A5E73]">
          Password dimenticata? Scrivi a{' '}
          <a href="mailto:info@giustiziainvolo.it" className="font-semibold text-[#072534] underline underline-offset-2">
            info@giustiziainvolo.it
          </a>{' '}
          e ti mandiamo un nuovo link di accesso.
        </p>
        <p className="mt-2 text-[14.5px] text-[#4A5E73]">
          La tua agenzia non ha ancora un codice?{' '}
          <Link href="/agenzie#adesione" className="font-semibold text-[#072534] underline underline-offset-2">
            Richiedi l’adesione
          </Link>
        </p>
      </div>
    </main>
  )
}
