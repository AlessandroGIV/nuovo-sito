import { NuovaAgenziaForm } from '@/components/gestione/forms'
import { PageTitle } from '@/components/portale/chrome'
import { requireAdmin } from '@/lib/portale/session'

export default async function NuovaAgenziaPage() {
  // Il controllo del layout non basta: Next può servire la sola pagina senza rieseguire il layout.
  await requireAdmin()
  return (
    <div className="max-w-[720px]">
      <PageTitle
        title="Aggiungi un’agenzia"
        lead="Per le agenzie con cui hai già un accordo. Viene creata attiva, con codice e link per scegliere la password."
      />
      <div className="rounded-2xl border border-[#072534]/10 bg-white p-5 sm:p-6">
        <NuovaAgenziaForm />
      </div>
    </div>
  )
}
