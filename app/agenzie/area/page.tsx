import Link from 'next/link'
import { LinkButton, PageTitle } from '@/components/portale/chrome'
import { formatDate } from '@/components/portale/format'
import { RouteMini, StatusBadge } from '@/components/portale/status'
import { CLOSED_STATUSES, DISRUPTION_LABEL } from '@/lib/portale/constants'
import { listAgencyCases } from '@/lib/portale/data'
import { requireAgency } from '@/lib/portale/session'

export default async function PratichePage() {
  const agency = await requireAgency()
  const cases = await listAgencyCases(agency.id)

  const open = cases.filter((c) => !CLOSED_STATUSES.includes(c.status))
  const waiting = cases.filter((c) => c.status === 'documenti_richiesti')
  const won = cases.filter((c) => c.status === 'risarcimento_ottenuto')

  return (
    <>
      <PageTitle
        title="Pratiche"
        lead={
          cases.length === 0
            ? undefined
            : `${open.length} in corso, ${won.length} concluse con risarcimento, ${cases.length} in tutto.`
        }
        action={<LinkButton href="/agenzie/area/nuova">Segnala una pratica</LinkButton>}
      />

      {waiting.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-[#E0A100]/40 bg-[#FFF5CC] px-5 py-4 text-[15px] text-[#5C3A0A]">
          <span className="font-bold">
            {waiting.length === 1 ? 'Una pratica aspetta dei documenti.' : `${waiting.length} pratiche aspettano dei documenti.`}
          </span>{' '}
          Aprila per vedere cosa serve e caricare i file.
        </div>
      ) : null}

      {cases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#072534]/20 bg-white px-6 py-12 text-center">
          <p className="text-[18px] font-bold text-[#072534]">Nessuna pratica, per ora</p>
          <p className="mx-auto mt-2 max-w-[46ch] text-[15px] leading-relaxed text-[#4A5E73]">
            Quando un cliente ha un volo in ritardo o cancellato puoi inserire tu la pratica, oppure dargli il
            tuo link personale e lasciare che la compili lui.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/agenzie/area/nuova">Segnala una pratica</LinkButton>
            <LinkButton href="/agenzie/area/link" variant="quiet">
              Vedi il tuo link e il QR
            </LinkButton>
          </div>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-[#072534]/10 bg-white">
          {cases.map((c) => (
            <li key={c.id} className="border-b border-[#072534]/[0.08] last:border-b-0">
              <Link
                href={`/agenzie/area/pratiche/${c.id}`}
                className="grid gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-[#F6F4EF]/70 focus-visible:bg-[#F6F4EF] focus-visible:outline-none sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="truncate text-[16px] font-bold text-[#072534]">{c.passenger_name}</span>
                    <span className="text-[13px] font-medium tabular-nums text-[#5A7088]">{c.ref}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[14px] text-[#4A5E73]">
                    {c.dep_airport}, {c.arr_airport}
                    {c.flight_date ? ` · ${formatDate(c.flight_date)}` : ''}
                    {c.disruption ? ` · ${DISRUPTION_LABEL[c.disruption]}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  <span className="hidden md:inline-flex">
                    <RouteMini status={c.status} />
                  </span>
                  <StatusBadge status={c.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
