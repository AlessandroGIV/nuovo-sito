import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminLoginForm } from '@/components/gestione/forms'
import { adminConfigured, isAdmin } from '@/lib/portale/session'

export const metadata: Metadata = {
  title: 'Gestione – Giustizia In Volo',
  robots: { index: false, follow: false },
}

export default async function GestioneAccediPage() {
  if (await isAdmin()) redirect('/gestione')
  return (
    <main className="flex min-h-screen items-start justify-center bg-[#F6F4EF] px-4 py-16 sm:py-24">
      <div className="w-full max-w-[380px]">
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-[#072534]">Gestione portale agenzie</h1>
        <div className="mt-6 rounded-2xl border border-[#072534]/10 bg-white p-6">
          <AdminLoginForm />
        </div>
        {adminConfigured() ? null : (
          <p className="mt-5 rounded-xl bg-[#FFF5CC] px-4 py-3 text-[14px] leading-relaxed text-[#5C3A0A]">
            Il portale non è ancora configurato. Servono le variabili SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
            PORTAL_SESSION_SECRET (almeno 32 caratteri) e GESTIONE_PASSWORD (almeno 16 caratteri).
          </p>
        )}
      </div>
    </main>
  )
}
