import type { Metadata } from 'next'
import { esciGestione } from '@/app/gestione/actions'
import { PortalHeader, type NavItem } from '@/components/portale/chrome'
import { dbCount } from '@/lib/portale/db'
import { requireAdmin } from '@/lib/portale/session'

export const metadata: Metadata = {
  title: 'Gestione – Giustizia In Volo',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function GestioneLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const [pending, fresh] = await Promise.all([
    dbCount('agencies', { status: 'eq.pending' }).catch(() => 0),
    dbCount('cases', { status: 'eq.ricevuta' }).catch(() => 0),
  ])
  const nav: NavItem[] = [
    { href: '/gestione', label: 'Riepilogo', exact: true },
    { href: '/gestione/pratiche', label: 'Pratiche', badge: fresh },
    { href: '/gestione/agenzie', label: 'Agenzie', badge: pending },
    { href: '/gestione/compensi', label: 'Compensi' },
  ]
  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <PortalHeader area="Gestione" who="Portale agenzie" nav={nav} logout={esciGestione} />
      <main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
