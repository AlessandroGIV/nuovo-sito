import { PasswordForm } from '@/components/agenzie/access-forms'
import { PageTitle, Panel } from '@/components/portale/chrome'
import { requireAgency } from '@/lib/portale/session'

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2 text-[14.5px]">
      <dt className="text-[#5A7088]">{label}</dt>
      <dd className="font-medium text-[#13283D]">{value}</dd>
    </div>
  )
}

export default async function AccountPage() {
  const agency = await requireAgency()
  return (
    <>
      <PageTitle title="Account" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Dati dell’agenzia">
          <dl className="divide-y divide-[#072534]/[0.06]">
            <Row label="Agenzia" value={agency.ragione_sociale} />
            <Row label="Codice" value={agency.code} />
            <Row label="Partita IVA" value={agency.partita_iva} />
            <Row label="Sede" value={[agency.citta, agency.provincia].filter(Boolean).join(' ') || null} />
            <Row label="Referente" value={agency.referente} />
            <Row label="Email" value={agency.email} />
            <Row label="Telefono" value={agency.telefono} />
          </dl>
          <p className="mt-4 text-[14px] leading-relaxed text-[#4A5E73]">
            Per modificare questi dati scrivi a{' '}
            <a href="mailto:info@giustiziainvolo.it" className="font-semibold text-[#072534] underline underline-offset-2">
              info@giustiziainvolo.it
            </a>
            .
          </p>
        </Panel>
        <Panel title="Password">
          <PasswordForm />
          <p className="mt-4 text-[14px] leading-relaxed text-[#4A5E73]">
            Cambiando la password vengono chiuse le sessioni aperte sugli altri dispositivi.
          </p>
        </Panel>
      </div>
    </>
  )
}
