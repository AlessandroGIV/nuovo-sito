import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { AccessoAgenzia, AgenziaForm } from '@/components/gestione/forms'
import { PageTitle, Panel } from '@/components/portale/chrome'
import { formatDate } from '@/components/portale/format'
import { StatusBadge } from '@/components/portale/status'
import { AGENCY_STATUS_LABEL } from '@/lib/portale/constants'
import { agencyById, listCases } from '@/lib/portale/data'
import { requestOrigin, requireAdmin } from '@/lib/portale/session'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-2 text-[14.5px]">
      <dt className="text-[#5A7088]">{label}</dt>
      <dd className="break-words font-medium text-[#13283D]">{children}</dd>
    </div>
  )
}

export default async function AgenziaPage({ params }: { params: Promise<{ id: string }> }) {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  const { id } = await params
  const agency = await agencyById(id)
  if (!agency) notFound()
  const [cases, origin] = await Promise.all([listCases({ agencyId: agency.id }), requestOrigin()])
  const needsApproval = agency.status === 'pending' || !agency.code

  return (
    <>
      <Link href="/gestione/agenzie" className="mb-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#4A5E73] hover:text-[#072534]">
        <ArrowLeft className="h-4 w-4" />
        Tutte le agenzie
      </Link>
      <PageTitle
        title={agency.ragione_sociale}
        lead={`${AGENCY_STATUS_LABEL[agency.status]}${agency.code ? `, codice ${agency.code}` : ''}. Richiesta del ${formatDate(agency.created_at)}.`}
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Panel title="Dati">
            <dl className="divide-y divide-[#072534]/[0.06]">
              <Row label="Partita IVA">{agency.partita_iva}</Row>
              <Row label="Sede">{[agency.citta, agency.provincia].filter(Boolean).join(' ')}</Row>
              <Row label="Referente">{agency.referente}</Row>
              <Row label="Email">
                <a href={`mailto:${agency.email}`} className="underline underline-offset-2">{agency.email}</a>
              </Row>
              <Row label="Telefono">
                <a href={`tel:${agency.telefono.replace(/[^\d+]/g, '')}`} className="underline underline-offset-2">{agency.telefono}</a>
              </Row>
              <Row label="Sito">{agency.sito}</Row>
              <Row label="Link agenzia">{agency.code ? `${origin.replace(/^https?:\/\//, '')}/r/${agency.code}` : null}</Row>
              <Row label="Ultimo accesso">{agency.last_login_at ? formatDate(agency.last_login_at) : agency.code ? 'Mai' : null}</Row>
            </dl>
            {agency.messaggio ? (
              <p className="mt-4 whitespace-pre-line rounded-xl bg-[#F6F4EF] px-4 py-3 text-[14.5px] leading-relaxed text-[#13283D]">
                {agency.messaggio}
              </p>
            ) : null}
          </Panel>

          <Panel title={`Pratiche segnalate (${cases.length})`}>
            {cases.length === 0 ? (
              <p className="text-[14.5px] text-[#4A5E73]">Nessuna pratica da questa agenzia.</p>
            ) : (
              <ul className="divide-y divide-[#072534]/[0.06]">
                {cases.map((c) => (
                  <li key={c.id}>
                    <Link href={`/gestione/pratiche/${c.id}`} className="flex items-center justify-between gap-4 py-2.5 hover:underline">
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold text-[#072534]">{c.passenger_name}</span>
                        <span className="block text-[13px] tabular-nums text-[#5A7088]">{c.ref}, {formatDate(c.created_at)}</span>
                      </span>
                      <StatusBadge status={c.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title={needsApproval ? 'Approvazione' : 'Accesso'}>
            <AccessoAgenzia
              id={agency.id}
              agencyName={agency.ragione_sociale}
              hasCode={Boolean(agency.code)}
              mode={needsApproval ? 'approva' : agency.status === 'active' ? 'link' : 'none'}
            />
          </Panel>

          <Panel title="Impostazioni">
            <AgenziaForm agency={agency} />
          </Panel>
        </div>
      </div>
    </>
  )
}
