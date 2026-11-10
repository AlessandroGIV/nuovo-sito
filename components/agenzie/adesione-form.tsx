'use client'

import { CheckCircle } from 'lucide-react'
import { inviaCandidatura } from '@/app/agenzie/actions'
import { ActionForm, CheckField, Notice, SubmitButton, TextAreaField, TextField } from '@/components/portale/ui'

export function AdesioneForm() {
  return (
    <ActionForm action={inviaCandidatura}>
      {(state, pending) =>
        state.ok ? (
          <div role="status" className="flex items-start gap-4 rounded-2xl bg-emerald-50 p-6">
            <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-[17px] font-bold text-emerald-900">Richiesta inviata</p>
              <p className="mt-1 text-[15px] leading-relaxed text-emerald-900/80">
                Ti ricontattiamo all’indirizzo che hai indicato per definire la collaborazione e attivare
                l’accesso all’area agenzie.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <TextField
              label="Nome dell’agenzia"
              name="ragione_sociale"
              autoComplete="organization"
              placeholder="Viaggi Esempio S.r.l."
              error={state.fieldErrors?.ragione_sociale}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Partita IVA"
                name="partita_iva"
                inputMode="numeric"
                placeholder="11 cifre"
                error={state.fieldErrors?.partita_iva}
              />
              <TextField
                label="Sito web"
                name="sito"
                optional
                inputMode="url"
                placeholder="www.esempio.it"
                error={state.fieldErrors?.sito}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <TextField label="Città" name="citta" autoComplete="address-level2" error={state.fieldErrors?.citta} />
              <TextField
                label="Provincia"
                name="provincia"
                optional
                maxLength={2}
                placeholder="RM"
                className="uppercase"
                error={state.fieldErrors?.provincia}
              />
            </div>
            <TextField
              label="Persona di riferimento"
              name="referente"
              autoComplete="name"
              error={state.fieldErrors?.referente}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Email" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
              <TextField
                label="Telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                error={state.fieldErrors?.telefono}
              />
            </div>
            <TextAreaField
              label="Vuoi dirci altro?"
              name="messaggio"
              optional
              rows={3}
              hint="Ad esempio quanti clienti seguite o se avete già casi da segnalare."
              error={state.fieldErrors?.messaggio}
            />

            {/* Campo trappola per i bot, invisibile alle persone */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Non compilare questo campo
                <input type="text" name="sito_aziendale" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <CheckField name="privacy" error={state.fieldErrors?.privacy}>
              Acconsento a essere ricontattato per questa richiesta. I dati sono trattati come indicato nella{' '}
              <a href="/privacy" className="font-semibold underline">
                Privacy Policy
              </a>
              .
            </CheckField>

            {!state.ok ? <Notice state={state} /> : null}
            <SubmitButton pending={pending} pendingLabel="Invio in corso…" className="w-full sm:w-auto">
              Invia la richiesta di adesione
            </SubmitButton>
          </div>
        )
      }
    </ActionForm>
  )
}
