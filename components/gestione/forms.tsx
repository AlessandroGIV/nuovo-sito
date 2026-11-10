'use client'

// Moduli del pannello di gestione.

import {
  accediGestione,
  aggiornaAgenzia,
  aggiornaStatoPratica,
  approvaAgenzia,
  creaAgenzia,
  nuovoLinkAccesso,
  salvaImporti,
  salvaNotaInterna,
  segnaCompensoPagato,
  type AccessLink,
} from '@/app/gestione/actions'
import { CopyButton } from '@/components/portale/copy-button'
import { formatDate } from '@/components/portale/format'
import {
  ActionForm,
  CheckField,
  Notice,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
  useAction,
} from '@/components/portale/ui'
import { CASE_STATUSES, STATUS_LABEL, type AgencyStatus, type CaseStatus } from '@/lib/portale/constants'

export function AdminLoginForm() {
  return (
    <ActionForm action={accediGestione} className="space-y-4">
      {(state, pending) => (
        <>
          <TextField label="Password" name="password" type="password" autoComplete="current-password" />
          <Notice state={state} />
          <SubmitButton pending={pending} variant="navy" pendingLabel="Accesso in corso…" className="w-full">
            Entra
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

/** Il link compare una volta sola: in database resta soltanto il suo hash. */
export function AccessLinkBox({ data, agencyName }: { data: AccessLink; agencyName: string }) {
  const message = `Buongiorno, l’accesso all’area agenzie di Giustizia In Volo per ${agencyName} è pronto.

Il vostro codice agenzia è ${data.code}

Per scegliere la password aprite questo link, valido fino al ${formatDate(data.expiresAt)}.
${data.link}

Dopo il primo accesso si entra da ${new URL(data.link).origin}/agenzie/accedi con codice e password.`
  return (
    <div role="status" className="rounded-2xl border border-emerald-600/25 bg-emerald-50 p-5">
      <p className="text-[15px] font-bold text-emerald-900">
        Link di accesso creato per il codice {data.code}
      </p>
      <p className="mt-1 text-[14px] leading-relaxed text-emerald-900/80">
        Copialo adesso e mandalo all’agenzia. Non verrà più mostrato. Scade il {formatDate(data.expiresAt)} e
        funziona una sola volta.
      </p>
      <code className="mt-3 block break-all rounded-xl bg-white px-4 py-3 font-sans text-[13.5px] text-[#13283D]">
        {data.link}
      </code>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={data.link} label="Copia il link" />
        <CopyButton text={message} label="Copia il messaggio per l’agenzia" />
      </div>
    </div>
  )
}

/**
 * Approvazione e link di accesso di un'agenzia.
 * Lo stato delle due azioni vive qui e non nei singoli moduli: dopo
 * l'approvazione la pagina si aggiorna, l'agenzia risulta attiva e il modulo
 * di approvazione sparisce, ma il link deve restare a schermo finché non è
 * stato copiato.
 */
export function AccessoAgenzia({
  id,
  agencyName,
  mode,
  hasCode,
}: {
  id: string
  agencyName: string
  mode: 'approva' | 'link' | 'none'
  hasCode: boolean
}) {
  const approva = useAction(approvaAgenzia)
  const nuovo = useAction(nuovoLinkAccesso)
  const issued = nuovo.state.data ?? approva.state.data ?? null

  return (
    <div className="space-y-4">
      {issued ? <AccessLinkBox data={issued} agencyName={agencyName} /> : null}

      {mode === 'approva' && !issued ? (
        <form noValidate className="space-y-4" onSubmit={approva.onSubmit}>
          <p className="text-[14.5px] leading-relaxed text-[#4A5E73]">
            Approvando, l’agenzia diventa attiva e riceve un codice. Ti viene mostrato il link con cui sceglie
            la password, da mandarle tu.
          </p>
          <input type="hidden" name="id" value={id} />
          {hasCode ? null : (
            <div className="max-w-[280px]">
              <TextField
                label="Codice agenzia"
                name="code"
                optional
                placeholder="Generato in automatico"
                className="uppercase"
                hint="Da 4 a 16 lettere o cifre. Compare nel link dell’agenzia."
                error={approva.state.fieldErrors?.code}
              />
            </div>
          )}
          <Notice state={approva.state} />
          <SubmitButton pending={approva.pending} pendingLabel="Attendi…">
            Approva e crea il link di accesso
          </SubmitButton>
        </form>
      ) : null}

      {mode === 'link' ? (
        <form noValidate className="space-y-3" onSubmit={nuovo.onSubmit}>
          {issued ? null : (
            <p className="text-[14.5px] leading-relaxed text-[#4A5E73]">
              Se l’agenzia ha perso la password o non ha mai usato il primo link, creane uno nuovo. Il
              precedente smette di funzionare.
            </p>
          )}
          <input type="hidden" name="id" value={id} />
          {nuovo.state.ok ? null : <Notice state={nuovo.state} />}
          <SubmitButton pending={nuovo.pending} variant="quiet" pendingLabel="Attendi…">
            Crea un nuovo link di accesso
          </SubmitButton>
        </form>
      ) : null}

      {mode === 'none' && !issued ? (
        <p className="text-[14.5px] leading-relaxed text-[#4A5E73]">
          L’agenzia non è attiva. Per darle di nuovo accesso riportala su “Attiva” dalle impostazioni.
        </p>
      ) : null}
    </div>
  )
}

export function AgenziaForm({
  agency,
}: {
  agency: { id: string; status: AgencyStatus; commission_enabled: boolean; commission_pct: number; note_interne: string | null }
}) {
  return (
    <ActionForm action={aggiornaAgenzia} className="space-y-4">
      {(state, pending) => (
        <>
          <input type="hidden" name="id" value={agency.id} />
          <div className="max-w-[280px]">
            <SelectField label="Stato" name="status" defaultValue={agency.status} error={state.fieldErrors?.status}>
              {agency.status === 'pending' ? <option value="pending">Da valutare</option> : null}
              <option value="active">Attiva</option>
              <option value="suspended">Sospesa</option>
              <option value="rejected">Non accolta</option>
            </SelectField>
          </div>

          <div className="rounded-xl bg-[#F6F4EF] p-4">
            <CheckField name="commission_enabled" defaultChecked={agency.commission_enabled}>
              <span className="font-semibold">Modulo compensi attivo per questa agenzia</span>
              <span className="mt-0.5 block text-[13.5px] text-[#4A5E73]">
                Se è attivo, quando registri un incasso viene calcolato il compenso e l’agenzia vede la pagina
                Compensi. Se è spento l’agenzia vede solo lo stato delle pratiche.
              </span>
            </CheckField>
            <div className="mt-3 max-w-[200px] pl-[30px]">
              <TextField
                label="Percentuale sul risarcimento"
                name="commission_pct"
                inputMode="decimal"
                defaultValue={String(agency.commission_pct).replace('.', ',')}
                error={state.fieldErrors?.commission_pct}
              />
            </div>
          </div>

          <TextAreaField
            label="Note interne"
            name="note_interne"
            optional
            defaultValue={agency.note_interne ?? ''}
            hint="Non visibili all’agenzia."
            error={state.fieldErrors?.note_interne}
          />
          <Notice state={state} />
          <SubmitButton pending={pending} variant="navy" pendingLabel="Salvataggio…">
            Salva
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

export function NuovaAgenziaForm() {
  return (
    <ActionForm action={creaAgenzia} className="space-y-4">
      {(state, pending) => {
        const e = state.fieldErrors ?? {}
        if (state.ok && state.data) {
          return (
            <div className="space-y-4">
              <AccessLinkBox data={state.data} agencyName="la vostra agenzia" />
              <a
                href={`/gestione/agenzie/${state.data.id}`}
                className="inline-block text-[15px] font-bold text-[#072534] underline underline-offset-2"
              >
                Apri la scheda dell’agenzia
              </a>
            </div>
          )
        }
        return (
          <>
            <TextField label="Nome dell’agenzia" name="ragione_sociale" error={e.ragione_sociale} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Partita IVA" name="partita_iva" inputMode="numeric" error={e.partita_iva} />
              <TextField label="Sito web" name="sito" optional error={e.sito} />
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <TextField label="Città" name="citta" error={e.citta} />
              <TextField label="Provincia" name="provincia" optional maxLength={2} className="uppercase" error={e.provincia} />
            </div>
            <TextField label="Persona di riferimento" name="referente" error={e.referente} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Email" name="email" type="email" error={e.email} />
              <TextField label="Telefono" name="telefono" type="tel" error={e.telefono} />
            </div>
            <div className="max-w-[280px]">
              <TextField
                label="Codice agenzia"
                name="code"
                optional
                placeholder="Generato in automatico"
                className="uppercase"
                error={e.code}
              />
            </div>
            <Notice state={state} />
            <SubmitButton pending={pending} pendingLabel="Creazione…">
              Crea l’agenzia e il link di accesso
            </SubmitButton>
          </>
        )
      }}
    </ActionForm>
  )
}

export function StatoForm({ id, status }: { id: string; status: CaseStatus }) {
  return (
    <ActionForm action={aggiornaStatoPratica} className="space-y-4">
      {(state, pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <SelectField label="Stato" name="status" defaultValue={status} key={status}>
            {CASE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </SelectField>
          <TextAreaField
            label="Messaggio"
            name="message"
            optional
            rows={3}
            hint="Con un cambio di stato l’agenzia lo legge sempre. Senza cambio di stato resta una nota, visibile solo se spunti la casella."
            error={state.fieldErrors?.message}
          />
          <CheckField name="visible">Mostra la nota all’agenzia</CheckField>
          <Notice state={state} />
          <SubmitButton pending={pending} variant="navy" pendingLabel="Salvataggio…">
            Aggiorna
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

const money = (n: number | null) => (n === null ? '' : String(n).replace('.', ','))

export function ImportiForm({
  id,
  claim,
  recovered,
  recoveredAt,
}: {
  id: string
  claim: number | null
  recovered: number | null
  recoveredAt: string | null
}) {
  return (
    <ActionForm action={salvaImporti} className="space-y-4">
      {(state, pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Richiesto (€)"
              name="claim_amount"
              optional
              inputMode="decimal"
              defaultValue={money(claim)}
              error={state.fieldErrors?.claim_amount}
            />
            <TextField
              label="Incassato (€)"
              name="recovered_amount"
              optional
              inputMode="decimal"
              defaultValue={money(recovered)}
              error={state.fieldErrors?.recovered_amount}
            />
            <TextField
              label="Data incasso"
              name="recovered_at"
              optional
              type="date"
              defaultValue={recoveredAt ?? ''}
              error={state.fieldErrors?.recovered_at}
            />
          </div>
          <Notice state={state} />
          <SubmitButton pending={pending} variant="navy" pendingLabel="Salvataggio…">
            Salva gli importi
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

export function NotaInternaForm({ id, note }: { id: string; note: string | null }) {
  return (
    <ActionForm action={salvaNotaInterna} className="space-y-3">
      {(state, pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          <TextAreaField label="Nota interna" name="internal_note" optional rows={4} defaultValue={note ?? ''} hint="Non visibile all’agenzia." />
          <Notice state={state} />
          <SubmitButton pending={pending} variant="quiet" pendingLabel="Salvataggio…">
            Salva la nota
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

export function CompensoForm({ id, paidAt, today }: { id: string; paidAt: string | null; today: string }) {
  return (
    <ActionForm action={segnaCompensoPagato} className="flex flex-wrap items-center justify-end gap-2">
      {(state, pending) => (
        <>
          <input type="hidden" name="id" value={id} />
          {paidAt ? (
            <>
              <input type="hidden" name="paid_at" value="" />
              <span className="text-[14px] text-emerald-700">Pagato il {formatDate(paidAt)}</span>
              <button
                type="submit"
                disabled={pending}
                className="text-[13.5px] font-semibold text-[#5A7088] underline underline-offset-2 hover:text-[#072534]"
              >
                Annulla
              </button>
            </>
          ) : (
            <>
              <input
                type="date"
                name="paid_at"
                defaultValue={today}
                max={today}
                aria-label="Data del pagamento"
                className="rounded-lg border-[1.5px] border-[#DCE3EB] bg-white px-2.5 py-1.5 text-[14px] text-[#13283D]"
              />
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-[#072534] px-3 py-2 text-[13.5px] font-bold text-white hover:bg-[#0E3A52] disabled:opacity-60"
              >
                Segna pagato
              </button>
            </>
          )}
          {state.message && !state.ok ? <span className="basis-full text-right text-[13px] text-red-600">{state.message}</span> : null}
        </>
      )}
    </ActionForm>
  )
}
