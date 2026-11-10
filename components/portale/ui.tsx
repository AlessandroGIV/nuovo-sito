'use client'

// Mattoni dei moduli del portale. Stesso aspetto dei campi del modulo richiesta.

import { useActionState, useEffect, useRef, useTransition } from 'react'
import type React from 'react'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/lib/portale/schemas'

const INITIAL: ActionResult<never> = { ok: false }

/**
 * Collega un modulo a una server action.
 * L'invio passa da onSubmit, così i campi non si svuotano quando la
 * validazione fallisce.
 */
export function useAction<T>(action: (prev: ActionResult<T>, fd: FormData) => Promise<ActionResult<T>>) {
  const [state, run] = useActionState(action, INITIAL as ActionResult<T>)
  const [pending, startTransition] = useTransition()
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    // Il pulsante premuto, se ha un nome, entra nei dati come in un invio normale
    const submitter = (e.nativeEvent as SubmitEvent).submitter
    if (submitter instanceof HTMLButtonElement && submitter.name) fd.set(submitter.name, submitter.value)
    startTransition(() => run(fd))
  }
  return { state, pending, onSubmit }
}

/** Modulo collegato a una server action, con stato ed esito passati ai figli. */
export function ActionForm<T>({
  action,
  children,
  className,
  onSuccess,
  resetOnSuccess = false,
}: {
  action: (prev: ActionResult<T>, fd: FormData) => Promise<ActionResult<T>>
  children: (state: ActionResult<T>, pending: boolean) => React.ReactNode
  className?: string
  onSuccess?: (state: ActionResult<T>) => void
  resetOnSuccess?: boolean
}) {
  const { state, pending, onSubmit } = useAction(action)
  const formRef = useRef<HTMLFormElement>(null)
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  useEffect(() => {
    if (!state.ok) return
    if (resetOnSuccess) formRef.current?.reset()
    onSuccessRef.current?.(state)
  }, [state, resetOnSuccess])

  return (
    <form ref={formRef} noValidate className={className} onSubmit={onSubmit}>
      {children(state, pending)}
    </form>
  )
}

export const inputCls = (error?: string) =>
  cn(
    'w-full bg-white border-[1.5px] rounded-xl px-4 py-3 text-[15px] font-medium text-[#1B2C3E]',
    'focus:outline-none focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/25 transition-colors placeholder:text-[#A8B8C8]',
    'disabled:bg-[#F3F5F8] disabled:text-[#5A7088]',
    error ? 'border-red-400' : 'border-[#DCE3EB]',
  )

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#13283D]">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-[#5A7088]">facoltativo</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[13px] font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-[#5A7088]">{hint}</p>
      ) : null}
    </div>
  )
}

type CommonProps = { label: string; name: string; hint?: string; error?: string; optional?: boolean }

export function TextField({
  label,
  name,
  hint,
  error,
  optional,
  className,
  ...rest
}: CommonProps & Omit<React.ComponentProps<'input'>, 'name'>) {
  const id = rest.id ?? `f-${name}`
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        {...rest}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputCls(error), className)}
      />
    </FieldShell>
  )
}

export function SelectField({
  label,
  name,
  hint,
  error,
  optional,
  children,
  ...rest
}: CommonProps & Omit<React.ComponentProps<'select'>, 'name'>) {
  const id = rest.id ?? `f-${name}`
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <select
        {...rest}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputCls(error), 'appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%235A7088' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
        }}
      >
        {children}
      </select>
    </FieldShell>
  )
}

export function TextAreaField({
  label,
  name,
  hint,
  error,
  optional,
  ...rest
}: CommonProps & Omit<React.ComponentProps<'textarea'>, 'name'>) {
  const id = rest.id ?? `f-${name}`
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        rows={4}
        {...rest}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputCls(error), 'resize-y leading-relaxed')}
      />
    </FieldShell>
  )
}

export function CheckField({
  name,
  error,
  children,
  defaultChecked,
}: {
  name: string
  error?: string
  children: React.ReactNode
  defaultChecked?: boolean
}) {
  const id = `f-${name}`
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-[#13283D]">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 rounded border-[#B7C4D2] accent-[#072534]"
        />
        <span>{children}</span>
      </label>
      {error ? <p className="mt-1.5 pl-[30px] text-[13px] font-medium text-red-600">{error}</p> : null}
    </div>
  )
}

export function SubmitButton({
  pending,
  children,
  pendingLabel,
  variant = 'primary',
  className,
  name,
  value,
}: {
  pending: boolean
  children: React.ReactNode
  pendingLabel?: string
  variant?: 'primary' | 'navy' | 'quiet' | 'danger'
  className?: string
  name?: string
  value?: string
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-bold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#072534]',
        'disabled:cursor-wait disabled:opacity-60',
        variant === 'primary' && 'bg-[#FFC300] text-[#072534] hover:bg-[#FFB800]',
        variant === 'navy' && 'bg-[#072534] text-white hover:bg-[#0E3A52]',
        variant === 'quiet' && 'border-[1.5px] border-[#DCE3EB] bg-white text-[#13283D] hover:border-[#072534]',
        variant === 'danger' && 'border-[1.5px] border-red-200 bg-white text-red-700 hover:border-red-500',
        className,
      )}
    >
      {pending ? (pendingLabel ?? 'Attendi…') : children}
    </button>
  )
}

/** Esito di un'azione. Gli errori sono annunciati subito ai lettori di schermo. */
export function Notice({ state, className }: { state: ActionResult<unknown>; className?: string }) {
  if (!state.message) return null
  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      className={cn(
        'rounded-xl px-4 py-3 text-[14px] font-medium',
        state.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700',
        className,
      )}
    >
      {state.message}
    </p>
  )
}
