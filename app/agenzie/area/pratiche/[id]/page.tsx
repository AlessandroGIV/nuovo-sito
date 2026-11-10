import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { Panel } from '@/components/portale/chrome'
import { AddDocuments } from '@/components/portale/doc-uploader'
import { formatBytes, formatDate, formatDateTime } from '@/components/portale/format'
import { RouteTrack, StatusBadge } from '@/components/portale/status'
import {
  CLOSED_STATUSES,
  DISRUPTION_LABEL,
  SOURCE_LABEL,
  STATUS_HELP,
  STATUS_LABEL,
} from '@/lib/portale/constants'
import { agencyCaseById, caseDocuments, caseEvents } from '@/lib/portale/data'
import { requireAgency } from '@/lib/portale/session'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2 text-[14.5px]">
      <dt className="text-[#5A7088]">{label}</dt>
      <dd className="font-medium text-[#13283D]">{children}</dd>
    </div>
  )
}

export default async function PraticaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ nuova?: string; documenti?: string }>
}) {
  const agency = await requireAgency()
  const { id } = await params
  const { nuova, documenti } = await searchParams
  const pratica = await agencyCaseById(agency.id, id)
  if (!pratica) notFound()

  const [events, docs] = await Promise.all([
    caseEvents(pratica.id, { agencyView: true }),
    caseDocuments(pratica.id),
  ])
  const closed = CLOSED_STATUSES.includes(pratica.status)
  // L'ultimo messaggio scritto dalla gestione per lo stato attuale
  const lastMessage = [...events]
    .reverse()
    .find((e) => e.actor === 'gestione' && e.message && (e.kind === 'nota' || e.to_status === pratica.status))

  return (
    <>
      <Link
        href="/agenzie/area"
        className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4A5E73] hover:text-[#072534]"
      >
        <ArrowLeft className="h-4 w-4" />
        Tutte le pratiche
      </Link>

      {nuova ? (
        <p role="status" className="mb-5 rounded-2xl bg-emerald-50 px-5 py-4 text-[15px] font-medium text-emerald-900">
          {pratica.contact_via_agency
            ? 'Pratica segnalata. Per i passi successivi scriviamo a voi.'
            : 'Pratica segnalata. Contattiamo noi il passeggero per i passi successivi.'}
        </p>
      ) : null}
      {documenti ? (
        <p role="alert" className="mb-5 rounded-2xl bg-red-50 px-5 py-4 text-[15px] font-medium text-red-700">
          La pratica è stata salvata, ma alcuni documenti non sono stati caricati. Puoi aggiungerli qui sotto.
        </p>
      ) : null}

      <section className="rounded-2xl border border-[#072534]/10 bg-white px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold tabular-nums text-[#5A7088]">{pratica.ref}</div>
            <h1 className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[#072534] sm:text-[28px]">
              {pratica.passenger_name}
            </h1>
            <p className="mt-1 text-[15px] text-[#4A5E73]">
              {pratica.dep_airport}, {pratica.arr_airport}
              {pratica.flight_date ? ` · ${formatDate(pratica.flight_date)}` : ''}
            </p>
          </div>
          <StatusBadge status={pratica.status} />
        </div>

        <RouteTrack status={pratica.status} className="mt-7" />

        <div className="mt-6 border-t border-[#072534]/[0.08] pt-4">
          <p className="text-[15.5px] leading-relaxed text-[#13283D]">{STATUS_HELP[pratica.status]}</p>
          {lastMessage ? (
            <p className="mt-3 rounded-xl bg-[#F6F4EF] px-4 py-3 text-[15px] leading-relaxed text-[#13283D]">
              <span className="font-bold">Nota di Giustizia In Volo.</span> {lastMessage.message}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Panel title="Dati della segnalazione">
            <dl className="divide-y divide-[#072534]/[0.06]">
              <Row label="Passeggeri">{pratica.passengers_count}</Row>
              <Row label="Tratta">
                {pratica.dep_airport}, {pratica.arr_airport}
                {pratica.via_airport ? ` (scalo ${pratica.via_airport})` : ''}
              </Row>
              {pratica.airline ? <Row label="Compagnia">{pratica.airline}</Row> : null}
              {pratica.flight_number ? <Row label="Volo">{pratica.flight_number}</Row> : null}
              {pratica.flight_date ? <Row label="Data del volo">{formatDate(pratica.flight_date)}</Row> : null}
              {pratica.disruption ? <Row label="Disservizio">{DISRUPTION_LABEL[pratica.disruption]}</Row> : null}
              {pratica.booking_ref ? <Row label="Prenotazione">{pratica.booking_ref}</Row> : null}
              <Row label="Origine">{SOURCE_LABEL[pratica.source]}</Row>
              <Row label="Contatti">{pratica.contact_via_agency ? 'Tramite la vostra agenzia' : 'Giustizia In Volo col passeggero'}</Row>
              <Row label="Segnalata il">{formatDate(pratica.created_at)}</Row>
            </dl>
            {pratica.source === 'modulo_agenzia' && pratica.description ? (
              <p className="mt-4 whitespace-pre-line border-t border-[#072534]/[0.06] pt-4 text-[14.5px] leading-relaxed text-[#3D5166]">
                {pratica.description}
              </p>
            ) : null}
          </Panel>

          <Panel title="Documenti">
            {docs.length === 0 ? (
              <p className="text-[14.5px] text-[#4A5E73]">Nessun documento caricato.</p>
            ) : (
              <ul className="space-y-2">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 text-[14.5px]">
                    <FileText className="h-4 w-4 flex-shrink-0 text-[#5A7088]" />
                    <span className="min-w-0 flex-1 truncate font-medium text-[#13283D]">{d.filename}</span>
                    <span className="flex-shrink-0 text-[#5A7088]">
                      {formatBytes(d.size_bytes)} · {formatDate(d.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {closed ? null : (
              <div className="mt-5 border-t border-[#072534]/[0.06] pt-5">
                <AddDocuments caseId={pratica.id} />
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Cronologia">
          <ol className="space-y-4">
            {[...events].reverse().map((e) => (
              <li key={e.id} className="border-l-2 border-[#072534]/15 pl-4">
                <div className="text-[12.5px] font-medium text-[#5A7088]">{formatDateTime(e.created_at)}</div>
                <div className="mt-0.5 text-[14.5px] font-semibold text-[#13283D]">
                  {e.kind === 'stato' && e.to_status ? STATUS_LABEL[e.to_status] : e.kind === 'creata' ? 'Pratica segnalata' : e.kind === 'documento' ? 'Documento' : 'Nota'}
                </div>
                {e.message && e.kind !== 'creata' ? (
                  <div className="mt-0.5 text-[14px] leading-relaxed text-[#4A5E73]">{e.message}</div>
                ) : null}
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  )
}
