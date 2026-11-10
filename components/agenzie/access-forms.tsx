'use client'

import { accedi, attivaAccesso, cambiaPassword } from '@/app/agenzie/actions'
import { ActionForm, Notice, SubmitButton, TextField } from '@/components/portale/ui'
import { PASSWORD_MIN_LENGTH } from '@/lib/portale/constants'

export function LoginForm() {
  return (
    <ActionForm action={accedi} className="space-y-4">
      {(state, pending) => (
        <>
          <TextField
            label="Codice agenzia"
            name="code"
            autoComplete="username"
            autoCapitalize="characters"
            spellCheck={false}
            className="uppercase tracking-[0.08em]"
          />
          <TextField label="Password" name="password" type="password" autoComplete="current-password" />
          <Notice state={state} />
          <SubmitButton pending={pending} pendingLabel="Accesso in corso…" className="w-full">
            Accedi
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

export function AttivaForm({ token }: { token: string }) {
  return (
    <ActionForm action={attivaAccesso} className="space-y-4">
      {(state, pending) => (
        <>
          <input type="hidden" name="token" value={token} />
          <TextField
            label="Scegli una password"
            name="password"
            type="password"
            autoComplete="new-password"
            hint={`Almeno ${PASSWORD_MIN_LENGTH} caratteri.`}
            error={state.fieldErrors?.password}
          />
          <TextField
            label="Ripeti la password"
            name="conferma"
            type="password"
            autoComplete="new-password"
            error={state.fieldErrors?.conferma}
          />
          <Notice state={state} />
          <SubmitButton pending={pending} pendingLabel="Salvataggio…" className="w-full">
            Salva la password ed entra
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}

export function PasswordForm() {
  return (
    <ActionForm action={cambiaPassword} className="max-w-[420px] space-y-4" resetOnSuccess>
      {(state, pending) => (
        <>
          <TextField
            label="Password attuale"
            name="attuale"
            type="password"
            autoComplete="current-password"
            error={state.fieldErrors?.attuale}
          />
          <TextField
            label="Nuova password"
            name="password"
            type="password"
            autoComplete="new-password"
            hint={`Almeno ${PASSWORD_MIN_LENGTH} caratteri.`}
            error={state.fieldErrors?.password}
          />
          <TextField
            label="Ripeti la nuova password"
            name="conferma"
            type="password"
            autoComplete="new-password"
            error={state.fieldErrors?.conferma}
          />
          <Notice state={state} />
          <SubmitButton pending={pending} variant="navy" pendingLabel="Salvataggio…">
            Cambia password
          </SubmitButton>
        </>
      )}
    </ActionForm>
  )
}
