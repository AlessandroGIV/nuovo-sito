import Link from 'next/link'
import { CompensoForm } from '@/components/gestione/forms'
import { PageTitle } from '@/components/portale/chrome'
import { formatDate, formatMoney } from '@/components/portale/format'
import { listAgencies, listCases } from '@/lib/portale/data'
import { requireAdmin } from '@/lib/portale/session'

export default async function CompensiGestionePage() {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  const [agencies, cases] = await Promise.all([listAgencies(), listCases()])
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' })
  const withFee = cases.filter((c) => c.commission_amount !== null)
  const enabled = agencies.filter((a) => a.commission_enabled)
  const sum = (rows: typeof withFee) => rows.reduce((t, c) => t + Number(c.commission_amount ?? 0), 0)

  const groups = agencies
    .map((a) => ({ a, rows: withFee.filter((c) => c.agency_id === a.id) }))
    .filter((g) => g.rows.length > 0)
    .sort((x, y) => sum(y.rows.filter((c) => !c.commission_paid_at)) - sum(x.rows.filter((c) => !c.commission_paid_at)))

  return (
    <>
      <PageTitle
        title="Compensi alle agenzie"
        lead={
          enabled.length === 0
            ? 'Il modulo compensi è spento per tutte le agenzie. Si attiva dalla scheda della singola agenzia.'
            : `Modulo attivo per ${enabled.length === 1 ? 'un’agenzia' : `${enabled.length} agenzie`}. Il compenso si calcola quando registri l’incasso di una pratica.`
        }
      />

      <dl className="mb-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Da pagare', value: formatMoney(sum(withFee.filter((c) => !c.commission_paid_at))) },
          { label: 'Pagato', value: formatMoney(sum(withFee.filter((c) => c.commission_paid_at))) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#072534]/10 bg-white px-5 py-4">
            <dt className="text-[14px] font-medium text-[#5A7088]">{s.label}</dt>
            <dd className="mt-1 text-[26px] font-extrabold tabular-nums tracking-[-0.02em] text-[#072534]">{s.value}</dd>
          </div>
        ))}
      </dl>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#072534]/20 bg-white px-6 py-10 text-center text-[15px] text-[#4A5E73]">
          Nessun compenso maturato.
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(({ a, rows }) => (
            <section key={a.id} className="overflow-hidden rounded-2xl border border-[#072534]/10 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#072534]/[0.08] px-5 py-3.5 sm:px-6">
                <h2 className="text-[15px] font-bold text-[#072534]">
                  <Link href={`/gestione/agenzie/${a.id}`} className="underline-offset-2 hover:underline">
                    {a.ragione_sociale}
                  </Link>
                </h2>
                <span className="text-[14px] text-[#4A5E73]">
                  Da pagare{' '}
                  <span className="font-bold tabular-nums text-[#072534]">
                    {formatMoney(sum(rows.filter((c) => !c.commission_paid_at)))}
                  </span>
                </span>
              </div>
              <ul>
                {rows.map((c) => (
                  <li
                    key={c.id}
                    className="grid items-center gap-x-4 gap-y-2 border-b border-[#072534]/[0.06] px-5 py-3 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:px-6"
                  >
                    <div className="min-w-0">
                      <Link href={`/gestione/pratiche/${c.id}`} className="font-semibold text-[#072534] underline-offset-2 hover:underline">
                        {c.passenger_name}
                      </Link>
                      <div className="text-[13px] tabular-nums text-[#5A7088]">
                        {c.ref}, incassati {formatMoney(c.recovered_amount)}
                        {c.recovered_at ? ` il ${formatDate(c.recovered_at)}` : ''}
                      </div>
                    </div>
                    <div className="text-[15px] font-bold tabular-nums text-[#072534]">{formatMoney(c.commission_amount)}</div>
                    <CompensoForm id={c.id} paidAt={c.commission_paid_at} today={today} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
