import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageTitle } from '@/components/portale/chrome'
import { formatDate, formatMoney, formatMonth } from '@/components/portale/format'
import { listAgencyCases } from '@/lib/portale/data'
import { requireAgency } from '@/lib/portale/session'

// Visibile solo alle agenzie per cui la gestione ha attivato il modulo compensi.
export default async function CompensiPage() {
  const agency = await requireAgency()
  if (!agency.commission_enabled) notFound()

  const cases = (await listAgencyCases(agency.id)).filter((c) => c.commission_amount !== null)
  const due = cases.filter((c) => !c.commission_paid_at)
  const sum = (rows: typeof cases) => rows.reduce((t, c) => t + Number(c.commission_amount ?? 0), 0)

  // Raggruppa per mese di incasso
  const months = new Map<string, typeof cases>()
  for (const c of cases) {
    const key = (c.recovered_at ?? c.updated_at).slice(0, 7)
    months.set(key, [...(months.get(key) ?? []), c])
  }
  const ordered = [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]))

  return (
    <>
      <PageTitle
        title="Compensi"
        lead="Il compenso matura quando la compagnia paga il risarcimento. Qui trovi le pratiche concluse, mese per mese."
      />

      <dl className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Da ricevere', value: formatMoney(sum(due)) },
          { label: 'Già ricevuto', value: formatMoney(sum(cases) - sum(due)) },
          { label: 'Pratiche concluse', value: String(cases.length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#072534]/10 bg-white px-5 py-4">
            <dt className="text-[14px] font-medium text-[#5A7088]">{s.label}</dt>
            <dd className="mt-1 text-[26px] font-extrabold tabular-nums tracking-[-0.02em] text-[#072534]">{s.value}</dd>
          </div>
        ))}
      </dl>

      {ordered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#072534]/20 bg-white px-6 py-10 text-center text-[15px] text-[#4A5E73]">
          Ancora nessun compenso maturato. Compare qui quando una pratica si chiude con il risarcimento.
        </div>
      ) : (
        <div className="space-y-5">
          {ordered.map(([month, rows]) => (
            <section key={month} className="overflow-hidden rounded-2xl border border-[#072534]/10 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#072534]/[0.08] px-5 py-3.5 sm:px-6">
                <h2 className="text-[15px] font-bold capitalize text-[#072534]">{formatMonth(month)}</h2>
                <span className="text-[15px] font-bold tabular-nums text-[#072534]">{formatMoney(sum(rows))}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-[14.5px]">
                  <thead>
                    <tr className="text-[13px] text-[#5A7088]">
                      <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">Pratica</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Risarcimento</th>
                      <th scope="col" className="px-3 py-2.5 text-right font-medium">Compenso</th>
                      <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.id} className="border-t border-[#072534]/[0.06]">
                        <td className="px-5 py-3 sm:px-6">
                          <Link href={`/agenzie/area/pratiche/${c.id}`} className="font-semibold text-[#072534] underline-offset-2 hover:underline">
                            {c.passenger_name}
                          </Link>
                          <span className="ml-2 text-[13px] tabular-nums text-[#5A7088]">{c.ref}</span>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-[#13283D]">{formatMoney(c.recovered_amount)}</td>
                        <td className="px-3 py-3 text-right font-semibold tabular-nums text-[#13283D]">
                          {formatMoney(c.commission_amount)}
                        </td>
                        <td className="px-5 py-3 sm:px-6">
                          {c.commission_paid_at ? (
                            <span className="text-emerald-700">Pagato il {formatDate(c.commission_paid_at)}</span>
                          ) : (
                            <span className="text-[#7A4A12]">Da pagare</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
