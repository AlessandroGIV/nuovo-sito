import Link from 'next/link'
import { PageTitle } from '@/components/portale/chrome'
import { formatDate } from '@/components/portale/format'
import { StatusBadge } from '@/components/portale/status'
import {
  CASE_STATUSES,
  CLOSED_STATUSES,
  STATUS_LABEL,
  TRIAGE_STATUSES,
  WORKING_STATUSES,
  type CaseStatus,
} from '@/lib/portale/constants'
import { listCases } from '@/lib/portale/data'
import { cn } from '@/lib/utils'
import { requireAdmin } from '@/lib/portale/session'

export default async function PraticheGestionePage({
  searchParams,
}: {
  searchParams: Promise<{ stato?: string }>
}) {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  const { stato } = await searchParams
  const filter = CASE_STATUSES.includes(stato as CaseStatus) ? (stato as CaseStatus) : undefined
  const all = await listCases()
  const groups: Record<string, (c: { status: CaseStatus }) => boolean> = {
    '': (c) => !CLOSED_STATUSES.includes(c.status),
    da_valutare: (c) => TRIAGE_STATUSES.includes(c.status),
    in_corso: (c) => WORKING_STATUSES.includes(c.status),
    chiuse: (c) => CLOSED_STATUSES.includes(c.status),
  }
  const group = !filter && stato && stato in groups ? stato : ''
  const shown = filter ? all.filter((c) => c.status === filter) : all.filter(groups[group])

  const counts = new Map<string, number>()
  for (const c of all) counts.set(c.status, (counts.get(c.status) ?? 0) + 1)
  const n = (k: string) => all.filter(groups[k]).length

  const tabs: { key: string; label: string; n: number }[] = [
    { key: '', label: 'Aperte', n: n('') },
    { key: 'da_valutare', label: 'Da valutare', n: n('da_valutare') },
    { key: 'in_corso', label: 'In corso', n: n('in_corso') },
    ...CASE_STATUSES.filter((s) => !CLOSED_STATUSES.includes(s) && (counts.get(s) ?? 0) > 0).map((s) => ({
      key: s,
      label: STATUS_LABEL[s],
      n: counts.get(s) ?? 0,
    })),
    { key: 'chiuse', label: 'Chiuse', n: n('chiuse') },
  ]
  const current = filter ?? group

  return (
    <>
      <PageTitle title="Pratiche" />
      <ul className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <li key={t.key}>
            <Link
              href={t.key ? `/gestione/pratiche?stato=${t.key}` : '/gestione/pratiche'}
              aria-current={current === t.key ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border-[1.5px] px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors',
                current === t.key
                  ? 'border-[#072534] bg-[#072534] text-white'
                  : 'border-[#DCE3EB] bg-white text-[#13283D] hover:border-[#072534]',
              )}
            >
              {t.label}
              <span className="tabular-nums opacity-70">{t.n}</span>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#072534]/20 bg-white px-6 py-10 text-center text-[15px] text-[#4A5E73]">
          Nessuna pratica in questo elenco.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#072534]/10 bg-white">
          <table className="w-full min-w-[760px] text-left text-[14.5px]">
            <thead>
              <tr className="border-b border-[#072534]/[0.08] text-[13px] text-[#5A7088]">
                <th scope="col" className="px-5 py-3 font-medium">Passeggero</th>
                <th scope="col" className="px-3 py-3 font-medium">Volo</th>
                <th scope="col" className="px-3 py-3 font-medium">Agenzia</th>
                <th scope="col" className="px-3 py-3 font-medium">Ricevuta</th>
                <th scope="col" className="px-5 py-3 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id} className="border-b border-[#072534]/[0.06] last:border-b-0">
                  <td className="px-5 py-3">
                    <Link href={`/gestione/pratiche/${c.id}`} className="font-semibold text-[#072534] underline-offset-2 hover:underline">
                      {c.passenger_name}
                    </Link>
                    <div className="text-[13px] tabular-nums text-[#5A7088]">{c.ref}</div>
                  </td>
                  <td className="px-3 py-3 text-[#13283D]">
                    {c.dep_airport}, {c.arr_airport}
                    <div className="text-[13px] text-[#5A7088]">
                      {[c.airline, c.flight_date ? formatDate(c.flight_date) : null].filter(Boolean).join(', ')}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#13283D]">{c.agencies?.ragione_sociale ?? ''}</td>
                  <td className="px-3 py-3 text-[#4A5E73]">{formatDate(c.created_at)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
