import { SegnalazioneForm } from '@/components/agenzie/segnalazione-form'
import { PageTitle } from '@/components/portale/chrome'
import { requireAgency } from '@/lib/portale/session'

export default async function NuovaPraticaPage() {
  await requireAgency()
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' })
  return (
    <div className="max-w-[760px]">
      <PageTitle
        title="Segnala una pratica"
        lead="Inserisci i dati del passeggero e del volo. Valutiamo il caso e contattiamo noi il passeggero."
      />
      <SegnalazioneForm today={today} />
    </div>
  )
}
