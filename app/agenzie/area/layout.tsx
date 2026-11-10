import type { Metadata } from 'next'
import { esci } from '@/app/agenzie/actions'
import { PortalHeader, type NavItem } from '@/components/portale/chrome'
import { requireAgency } from '@/lib/portale/session'

export const metadata: Metadata = {
  title: 'Area agenzie – Giustizia In Volo',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AreaLayout({ children }: { children: React.ReactNode }) {
  const agency = await requireAgency()
  const nav: NavItem[] = [
    { href: '/agenzie/area', label: 'Pratiche', exact: true },
    { href: '/agenzie/area/nuova', label: 'Segnala una pratica' },
    { href: '/agenzie/area/link', label: 'Link e QR' },
    ...(agency.commission_enabled ? [{ href: '/agenzie/area/compensi', label: 'Compensi' }] : []),
    { href: '/agenzie/area/account', label: 'Account' },
  ]
  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <PortalHeader
        area="Area agenzie"
        who={agency.ragione_sociale}
        detail={agency.code ? `Codice ${agency.code}` : undefined}
        nav={nav}
        logout={esci}
      />
      <main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
