import { SegnalazioneForm } from '@/components/agenzie/segnalazione-form'
import { PageTitle } from '@/components/portale/chrome'
import { requireAgency } from '@/lib/portale/session'

export default async function NuovaPraticaPage() {
  const agency = await requireAgency()
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' })
  return (
    <div className="max-w-[760px]">
      <PageTitle
        title="Segnala una pratica"
        lead={
          agency.agency_contact_enabled
            ? 'Inserisci i dati del passeggero e del volo. Valutiamo il caso e scegli tu se il passeggero lo contattiamo noi o se passa tutto da voi.'
            : 'Inserisci i dati del passeggero e del volo. Valutiamo il caso e contattiamo noi il passeggero.'
        }
      />
      <SegnalazioneForm today={today} agencyContact={agency.agency_contact_enabled} />
    </div>
  )
}
