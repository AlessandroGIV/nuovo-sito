import Link from 'next/link'
import { LinkButton, PageTitle } from '@/components/portale/chrome'
import { formatDate } from '@/components/portale/format'
import { AGENCY_STATUS_LABEL, type AgencyStatus } from '@/lib/portale/constants'
import { listAgencies, listCases } from '@/lib/portale/data'
import { cn } from '@/lib/utils'
import { requireAdmin } from '@/lib/portale/session'

const STATUS_CLS: Record<AgencyStatus, string> = {
  pending: 'bg-[#FFF5CC] text-[#7A4A12]',
  active: 'bg-emerald-50 text-emerald-800',
  suspended: 'bg-[#EEF2F6] text-[#5A7088]',
  rejected: 'bg-[#EEF2F6] text-[#5A7088]',
}

export default async function AgenzieListPage() {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  const [agencies, cases] = await Promise.all([listAgencies(), listCases()])
  const count = new Map<string, number>()
  for (const c of cases) if (c.agency_id) count.set(c.agency_id, (count.get(c.agency_id) ?? 0) + 1)
  // Prima le richieste da valutare
  const order: AgencyStatus[] = ['pending', 'active', 'suspended', 'rejected']
  const sorted = [...agencies].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))

  return (
    <>
      <PageTitle
        title="Agenzie"
        action={<LinkButton href="/gestione/agenzie/nuova">Aggiungi un’agenzia</LinkButton>}
      />
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#072534]/20 bg-white px-6 py-10 text-center text-[15px] text-[#4A5E73]">
          Nessuna agenzia. Le richieste di adesione inviate dalla pagina /agenzie compaiono qui.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#072534]/10 bg-white">
          <table className="w-full min-w-[720px] text-left text-[14.5px]">
            <thead>
              <tr className="border-b border-[#072534]/[0.08] text-[13px] text-[#5A7088]">
                <th scope="col" className="px-5 py-3 font-medium">Agenzia</th>
                <th scope="col" className="px-3 py-3 font-medium">Codice</th>
                <th scope="col" className="px-3 py-3 font-medium">Stato</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Pratiche</th>
                <th scope="col" className="px-3 py-3 font-medium">Compensi</th>
                <th scope="col" className="px-5 py-3 font-medium">Ultimo accesso</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr key={a.id} className="border-b border-[#072534]/[0.06] last:border-b-0">
                  <td className="px-5 py-3">
                    <Link href={`/gestione/agenzie/${a.id}`} className="font-semibold text-[#072534] underline-offset-2 hover:underline">
                      {a.ragione_sociale}
                    </Link>
                    <div className="text-[13px] text-[#5A7088]">{[a.citta, a.provincia].filter(Boolean).join(' ')}</div>
                  </td>
                  <td className="px-3 py-3 font-semibold tabular-nums text-[#13283D]">{a.code ?? ''}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-[12.5px] font-semibold', STATUS_CLS[a.status])}>
                      {AGENCY_STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-[#13283D]">{count.get(a.id) ?? 0}</td>
                  <td className="px-3 py-3 text-[#13283D]">
                    {a.commission_enabled ? `${String(a.commission_pct).replace('.', ',')}%` : 'Spento'}
                  </td>
                  <td className="px-5 py-3 text-[#4A5E73]">{a.last_login_at ? formatDate(a.last_login_at) : 'Mai'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
