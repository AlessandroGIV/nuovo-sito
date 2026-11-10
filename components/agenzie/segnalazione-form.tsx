'use client'

// Segnalazione di una pratica da parte dell'agenzia. Prima salva i dati,
// poi carica gli allegati sulla pratica appena creata.

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { creaSegnalazione } from '@/app/agenzie/actions'
import { FilePicker, uploadDocument, type PickedFile } from '@/components/portale/doc-uploader'
import {
  ActionForm,
  CheckField,
  Notice,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/portale/ui'
import { DISRUPTIONS, DISRUPTION_LABEL } from '@/lib/portale/constants'

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-[#072534]/10 bg-white px-5 py-5 sm:px-6">
      <legend className="float-left mb-4 w-full text-[15px] font-bold text-[#072534]">{title}</legend>
      <div className="clear-both space-y-4">{children}</div>
    </fieldset>
  )
}

export function SegnalazioneForm({ today }: { today: string }) {
  const router = useRouter()
  const [files, setFiles] = useState<PickedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  return (
    <ActionForm
      action={creaSegnalazione}
      className="space-y-5"
      onSuccess={async (state) => {
        const created = state.data
        if (!created) return
        const valid = files.filter((f) => !f.error)
        if (valid.length > 0) {
          setUploading(true)
          let failed = 0
          for (const f of valid) {
            const res = await uploadDocument(created.id, f.file)
            if (!res.ok) failed++
          }
          setUploading(false)
          if (failed > 0) {
            // La pratica esiste già: si va al dettaglio, da dove si possono ricaricare.
            setUploadError('La pratica è stata salvata, ma alcuni documenti non sono stati caricati.')
            router.push(`/agenzie/area/pratiche/${created.id}?documenti=da-ricaricare`)
            return
          }
        }
        router.push(`/agenzie/area/pratiche/${created.id}?nuova=1`)
      }}
    >
      {(state, pending) => {
        const busy = pending || uploading || state.ok
        const e = state.fieldErrors ?? {}
        return (
          <>
            <Group title="Passeggero">
              <TextField
                label="Nome e cognome"
                name="passenger_name"
                autoComplete="off"
                hint="Il passeggero che firmerà l’incarico. Se viaggiavano in più persone indica il numero qui sotto."
                error={e.passenger_name}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Email del passeggero" name="passenger_email" type="email" autoComplete="off" error={e.passenger_email} />
                <TextField label="Telefono del passeggero" name="passenger_phone" type="tel" autoComplete="off" error={e.passenger_phone} />
              </div>
              <div className="max-w-[200px]">
                <TextField
                  label="Passeggeri"
                  name="passengers_count"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={1}
                  inputMode="numeric"
                  error={e.passengers_count}
                />
              </div>
            </Group>

            <Group title="Volo">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Aeroporto di partenza" name="dep_airport" placeholder="Roma Fiumicino" error={e.dep_airport} />
                <TextField label="Aeroporto di arrivo" name="arr_airport" placeholder="Madrid" error={e.arr_airport} />
              </div>
              <TextField
                label="Scalo"
                name="via_airport"
                optional
                hint="Solo se il viaggio prevedeva una coincidenza nella stessa prenotazione."
                error={e.via_airport}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField label="Compagnia aerea" name="airline" placeholder="Ryanair" error={e.airline} />
                <TextField
                  label="Numero di volo"
                  name="flight_number"
                  optional
                  placeholder="FR1234"
                  className="uppercase"
                  error={e.flight_number}
                />
                <TextField label="Data del volo" name="flight_date" type="date" max={today} error={e.flight_date} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Cosa è successo" name="disruption" defaultValue="" error={e.disruption}>
                  <option value="" disabled>
                    Scegli
                  </option>
                  {DISRUPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {DISRUPTION_LABEL[d]}
                    </option>
                  ))}
                </SelectField>
                <TextField
                  label="Codice di prenotazione"
                  name="booking_ref"
                  optional
                  placeholder="PNR"
                  className="uppercase"
                  error={e.booking_ref}
                />
              </div>
              <TextAreaField
                label="Note"
                name="description"
                optional
                hint="Orario di arrivo effettivo, cosa ha comunicato la compagnia, spese sostenute dal passeggero."
                error={e.description}
              />
            </Group>

            <Group title="Documenti">
              <p className="text-[14.5px] leading-relaxed text-[#4A5E73]">
                Carta d’imbarco, conferma di prenotazione e comunicazioni della compagnia accelerano la valutazione.
                Puoi aggiungerli anche in un secondo momento.
              </p>
              <FilePicker files={files} onChange={setFiles} disabled={busy} />
            </Group>

            <CheckField name="consenso" error={e.consenso}>
              Ho informato il passeggero che i suoi dati vengono trasmessi a Giustizia In Volo per la valutazione
              del caso e che verrà ricontattato.
            </CheckField>

            {!state.ok ? <Notice state={state} /> : null}
            {uploadError ? (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
                {uploadError}
              </p>
            ) : null}

            <SubmitButton
              pending={busy}
              pendingLabel={uploading ? 'Caricamento dei documenti…' : 'Invio in corso…'}
              className="w-full sm:w-auto"
            >
              Segnala la pratica
            </SubmitButton>
          </>
        )
      }}
    </ActionForm>
  )
}
