import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { ImportiForm, NotaInternaForm, StatoForm } from '@/components/gestione/forms'
import { Panel } from '@/components/portale/chrome'
import { formatBytes, formatDate, formatDateTime, formatMoney } from '@/components/portale/format'
import { RouteTrack, StatusBadge } from '@/components/portale/status'
import { DISRUPTION_LABEL, SOURCE_LABEL, STATUS_LABEL } from '@/lib/portale/constants'
import { agencyById, caseById, caseDocuments, caseEvents } from '@/lib/portale/data'
import { requireAdmin } from '@/lib/portale/session'

type Leg = { date?: string; airline?: string; schedDep?: string }

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (children === null || children === undefined || children === '') return null
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-2 text-[14.5px]">
      <dt className="text-[#5A7088]">{label}</dt>
      <dd className="break-words font-medium text-[#13283D]">{children}</dd>
    </div>
  )
}

const ACTOR = { gestione: 'Gestione', agenzia: 'Agenzia', cliente: 'Passeggero', sistema: 'Sistema' } as const

export default async function PraticaGestionePage({ params }: { params: Promise<{ id: string }> }) {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  const { id } = await params
  const pratica = await caseById(id)
  if (!pratica) notFound()
  const [events, docs, agency] = await Promise.all([
    caseEvents(pratica.id, { agencyView: false }),
    caseDocuments(pratica.id),
    pratica.agency_id ? agencyById(pratica.agency_id) : Promise.resolve(null),
  ])
  const payload = (pratica.payload ?? null) as { leg1?: Leg; leg2?: Leg | null } | null
  const leg = (l?: Leg | null) => (l ? [l.airline, l.date ? formatDate(l.date) : null, l.schedDep].filter(Boolean).join(', ') : null)

  return (
    <>
      <Link href="/gestione/pratiche" className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4A5E73] hover:text-[#072534]">
        <ArrowLeft className="h-4 w-4" />
        Tutte le pratiche
      </Link>

      <section className="rounded-2xl border border-[#072534]/10 bg-white px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold tabular-nums text-[#5A7088]">{pratica.ref}</div>
            <h1 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[#072534] sm:text-[28px]">
              {pratica.passenger_name}
            </h1>
            <p className="mt-1 text-[15px] text-[#4A5E73]">
              {SOURCE_LABEL[pratica.source]}
              {agency ? (
                <>
                  {' da '}
                  <Link href={`/gestione/agenzie/${agency.id}`} className="font-semibold text-[#072534] underline underline-offset-2">
                    {agency.ragione_sociale}
                  </Link>
                </>
              ) : null}
              , {formatDate(pratica.created_at)}
            </p>
          </div>
          <StatusBadge status={pratica.status} />
        </div>
        <RouteTrack status={pratica.status} className="mt-7" />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <Panel title="Passeggero e volo">
            <dl className="divide-y divide-[#072534]/[0.06]">
              <Row label="Email">
                {pratica.passenger_email ? (
                  <a href={`mailto:${pratica.passenger_email}`} className="underline underline-offset-2">{pratica.passenger_email}</a>
                ) : null}
              </Row>
              <Row label="Telefono">
                {pratica.passenger_phone ? (
                  <a href={`tel:${pratica.passenger_phone.replace(/[^\d+]/g, '')}`} className="underline underline-offset-2">{pratica.passenger_phone}</a>
                ) : null}
              </Row>
              <Row label="Passeggeri">{pratica.passengers_count}</Row>
              <Row label="Tratta">
                {pratica.dep_airport}, {pratica.arr_airport}
                {pratica.via_airport ? ` (scalo ${pratica.via_airport})` : ''}
              </Row>
              <Row label="Compagnia">{pratica.airline}</Row>
              <Row label="Volo">{pratica.flight_number}</Row>
              <Row label="Data del volo">{pratica.flight_date ? formatDate(pratica.flight_date) : null}</Row>
              <Row label="Disservizio">{pratica.disruption ? DISRUPTION_LABEL[pratica.disruption] : null}</Row>
              <Row label="Prenotazione">{pratica.booking_ref}</Row>
              <Row label="Primo volo">{leg(payload?.leg1)}</Row>
              <Row label="Secondo volo">{leg(payload?.leg2)}</Row>
            </dl>
            {pratica.description ? (
              <p className="mt-4 whitespace-pre-line rounded-xl bg-[#F6F4EF] px-4 py-3 text-[14.5px] leading-relaxed text-[#13283D]">
                {pratica.description}
              </p>
            ) : null}
          </Panel>

          <Panel title={`Documenti (${docs.length})`}>
            {docs.length === 0 ? (
              <p className="text-[14.5px] text-[#4A5E73]">Nessun documento caricato.</p>
            ) : (
              <ul className="space-y-2">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 text-[14.5px]">
                    <FileText className="h-4 w-4 flex-shrink-0 text-[#5A7088]" />
                    <a
                      href={`/api/gestione/documenti/${d.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 flex-1 truncate font-semibold text-[#072534] underline underline-offset-2"
                    >
                      {d.filename}
                    </a>
                    <span className="flex-shrink-0 text-[#5A7088]">
                      {formatBytes(d.size_bytes)}, {formatDate(d.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Cronologia completa">
            <ol className="space-y-4">
              {[...events].reverse().map((e) => (
                <li key={e.id} className="border-l-2 border-[#072534]/15 pl-4">
                  <div className="text-[12.5px] font-medium text-[#5A7088]">
                    {formatDateTime(e.created_at)}, {ACTOR[e.actor]}
                    {e.visible_to_agency ? '' : ', non visibile all’agenzia'}
                  </div>
                  {e.kind === 'stato' && e.to_status ? (
                    <div className="mt-0.5 text-[14.5px] font-semibold text-[#13283D]">
                      {e.from_status ? `${STATUS_LABEL[e.from_status]}, poi ` : ''}
                      {STATUS_LABEL[e.to_status]}
                    </div>
                  ) : null}
                  {e.message ? <div className="mt-0.5 text-[14px] leading-relaxed text-[#4A5E73]">{e.message}</div> : null}
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Stato e messaggi per l’agenzia">
            <StatoForm id={pratica.id} status={pratica.status} />
          </Panel>

          <Panel title="Importi">
            <ImportiForm
              id={pratica.id}
              claim={pratica.claim_amount}
              recovered={pratica.recovered_amount}
              recoveredAt={pratica.recovered_at}
            />
            <p className="mt-4 border-t border-[#072534]/[0.06] pt-4 text-[14px] leading-relaxed text-[#4A5E73]">
              {pratica.commission_amount !== null ? (
                <>
                  Compenso dell’agenzia {formatMoney(pratica.commission_amount)}, pari al{' '}
                  {String(pratica.commission_pct).replace('.', ',')}% dell’incassato.{' '}
                  {pratica.commission_paid_at ? `Pagato il ${formatDate(pratica.commission_paid_at)}.` : 'Da pagare.'}
                </>
              ) : agency?.commission_enabled ? (
                'Il modulo compensi di questa agenzia è attivo. Il compenso viene calcolato quando registri l’incasso.'
              ) : (
                'Il modulo compensi di questa agenzia è spento. Non viene calcolato alcun compenso.'
              )}
            </p>
          </Panel>

          <Panel title="Appunti">
            <NotaInternaForm id={pratica.id} note={pratica.internal_note} />
          </Panel>
        </div>
      </div>
    </>
  )
}
