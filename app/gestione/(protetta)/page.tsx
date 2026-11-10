import Link from 'next/link'
import { PageTitle, Panel } from '@/components/portale/chrome'
import { formatDate } from '@/components/portale/format'
import { StatusBadge } from '@/components/portale/status'
import { CLOSED_STATUSES } from '@/lib/portale/constants'
import { listAgencies, listCases } from '@/lib/portale/data'
import { requireAdmin } from '@/lib/portale/session'

export default async function RiepilogoPage() {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  const [agencies, cases] = await Promise.all([listAgencies(), listCases()])
  const pending = agencies.filter((a) => a.status === 'pending')
  const active = agencies.filter((a) => a.status === 'active')
  const fresh = cases.filter((c) => c.status === 'ricevuta')
  const open = cases.filter((c) => !CLOSED_STATUSES.includes(c.status))

  // Quante pratiche ha portato ogni agenzia
  const perAgency = new Map<string, number>()
  for (const c of cases) if (c.agency_id) perAgency.set(c.agency_id, (perAgency.get(c.agency_id) ?? 0) + 1)
  const top = active
    .map((a) => ({ a, n: perAgency.get(a.id) ?? 0 }))
    .sort((x, y) => y.n - x.n)
    .slice(0, 8)

  const stats = [
    { label: 'Pratiche da valutare', value: fresh.length, href: '/gestione/pratiche?stato=ricevuta' },
    { label: 'Pratiche in corso', value: open.length, href: '/gestione/pratiche' },
    { label: 'Adesioni da valutare', value: pending.length, href: '/gestione/agenzie' },
    { label: 'Agenzie attive', value: active.length, href: '/gestione/agenzie' },
  ]

  return (
    <>
      <PageTitle title="Riepilogo" />
      <dl className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-[#072534]/10 bg-white px-5 py-4 transition-colors hover:border-[#072534]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534]"
          >
            <dt className="text-[14px] font-medium text-[#5A7088]">{s.label}</dt>
            <dd className="mt-1 text-[30px] font-extrabold tabular-nums tracking-[-0.02em] text-[#072534]">{s.value}</dd>
          </Link>
        ))}
      </dl>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Pratiche da valutare">
          {fresh.length === 0 ? (
            <p className="text-[14.5px] text-[#4A5E73]">Nessuna pratica nuova.</p>
          ) : (
            <ul className="divide-y divide-[#072534]/[0.06]">
              {fresh.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <Link href={`/gestione/pratiche/${c.id}`} className="flex items-center justify-between gap-4 py-2.5 hover:underline">
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-semibold text-[#072534]">{c.passenger_name}</span>
                      <span className="block truncate text-[13.5px] text-[#5A7088]">
                        {c.agencies?.ragione_sociale ?? 'Senza agenzia'}, {formatDate(c.created_at)}
                      </span>
                    </span>
                    <StatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title="Adesioni da valutare">
            {pending.length === 0 ? (
              <p className="text-[14.5px] text-[#4A5E73]">Nessuna richiesta in attesa.</p>
            ) : (
              <ul className="divide-y divide-[#072534]/[0.06]">
                {pending.map((a) => (
                  <li key={a.id}>
                    <Link href={`/gestione/agenzie/${a.id}`} className="block py-2.5 hover:underline">
                      <span className="block text-[15px] font-semibold text-[#072534]">{a.ragione_sociale}</span>
                      <span className="block text-[13.5px] text-[#5A7088]">
                        {[a.citta, a.provincia].filter(Boolean).join(' ')}, {formatDate(a.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Agenzie per pratiche segnalate">
            {top.length === 0 ? (
              <p className="text-[14.5px] text-[#4A5E73]">Ancora nessuna agenzia attiva.</p>
            ) : (
              <ul className="divide-y divide-[#072534]/[0.06]">
                {top.map(({ a, n }) => (
                  <li key={a.id}>
                    <Link href={`/gestione/agenzie/${a.id}`} className="flex items-center justify-between gap-4 py-2.5 hover:underline">
                      <span className="truncate text-[15px] font-semibold text-[#072534]">{a.ragione_sociale}</span>
                      <span className="text-[15px] font-bold tabular-nums text-[#072534]">{n}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}
