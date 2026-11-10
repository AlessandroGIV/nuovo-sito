import { PageTitle, Panel } from '@/components/portale/chrome'
import { CopyButton } from '@/components/portale/copy-button'
import { QrCard } from '@/components/portale/qr-card'
import { qrRows } from '@/lib/portale/qr'
import { requestOrigin, requireAgency } from '@/lib/portale/session'

export default async function LinkPage() {
  const agency = await requireAgency()
  const origin = await requestOrigin()
  const link = `${origin}/r/${agency.code}`
  const shown = link.replace(/^https?:\/\//, '')

  let rows: string[] | null = null
  try {
    rows = qrRows(link)
  } catch {
    rows = null
  }

  const whatsapp = `Buongiorno, per il volo in ritardo o cancellato può chiedere la compensazione prevista dal Regolamento CE 261/2004. Se ne occupa Giustizia In Volo, senza anticipi. Compili la richiesta da qui, bastano due minuti. ${link}`
  const email = `Gentile cliente,

per il disservizio subito sul suo volo potrebbe avere diritto alla compensazione prevista dal Regolamento CE 261/2004, da 250 a 600 euro a passeggero secondo la tratta.

Della richiesta si occupa Giustizia In Volo. Non è previsto alcun anticipo e il compenso è dovuto solo se la compagnia paga.

Per avviare la pratica basta compilare il modulo a questo indirizzo.
${link}

Restiamo a disposizione.
${agency.ragione_sociale}`

  return (
    <>
      <PageTitle
        title="Link e QR"
        lead="Il tuo link personale porta il cliente al modulo di richiesta. La pratica che compila viene collegata alla tua agenzia e la ritrovi tra le tue pratiche."
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          <Panel title="Il tuo link">
            <div className="flex flex-wrap items-center gap-3">
              <code className="min-w-0 flex-1 break-all rounded-xl bg-[#F6F4EF] px-4 py-3 font-sans text-[16px] font-bold text-[#072534]">
                {shown}
              </code>
              <CopyButton text={link} label="Copia il link" />
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#4A5E73]">
              Mandalo per WhatsApp o per email, oppure mettilo nella firma delle email dell’agenzia.
            </p>
          </Panel>

          <Panel title="Messaggio pronto per WhatsApp" aside={<CopyButton text={whatsapp} />}>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#13283D]">{whatsapp}</p>
          </Panel>

          <Panel title="Testo pronto per l’email" aside={<CopyButton text={email} />}>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#13283D]">{email}</p>
          </Panel>
        </div>

        <Panel title="QR da stampare">
          {rows ? (
            <>
              <QrCard rows={rows} filename={`giustiziainvolo-${agency.code}`} />
              <p className="mt-4 text-[14.5px] leading-relaxed text-[#4A5E73]">
                Tienilo al banco o inseriscilo nei documenti di viaggio. Il cliente lo inquadra con la
                fotocamera e arriva al modulo.
              </p>
            </>
          ) : (
            <p className="text-[14.5px] text-[#4A5E73]">QR non disponibile. Usa il link qui accanto.</p>
          )}
        </Panel>
      </div>
    </>
  )
}
