"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useSearchParams } from "next/navigation"
import {
  ArrowRight, ArrowLeft, Send, CheckCircle, Check,
  ArrowLeftRight, Calendar, User, PenLine, Plane,
} from "lucide-react"
import GlobalAirlineInput from "./global-airline-input"
import GlobalAirportInput from "./global-airport-input"
import { TimeInputResponsive } from "./time-input-responsive"
import emailjs from "@emailjs/browser"
import { cn } from "@/lib/utils"

type Leg = { date: string; airline: string; schedDep: string }
type Errors = Partial<
  Record<
    | "from" | "to" | "via"
    | "leg1Date" | "leg1Airline" | "leg1Time"
    | "leg2Date" | "leg2Airline" | "leg2Time"
    | "name" | "email" | "phone" | "description"
    | "privacy" | "terms",
    string
  >
>

/* ─── Left Rail ─── */

function StepDot({
  state, n,
}: {
  state: "done" | "active" | "upcoming"
  n: number
}) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm z-10",
        state === "done"
          ? "bg-[#FFC300] text-[#0B1B27]"
          : state === "active"
          ? "bg-[#FFC300] text-[#0B1B27] ring-4 ring-[#FFC300]/20"
          : "border border-white/15 text-white/35",
      )}
    >
      {state === "done" ? <Check className="w-4 h-4" /> : n}
    </div>
  )
}

function LeftRail({
  step,
  hasConnection,
}: {
  step: number
  hasConnection: boolean
}) {
  const steps = [
    { n: 1, label: "Itinerario", sub: "Dove stavi volando" },
    {
      n: 2,
      label: "Dettagli volo",
      sub: hasConnection ? "Primo volo + coincidenza" : "Data, orario, compagnia",
    },
    { n: 3, label: "Dati personali", sub: "Contatti e passeggeri" },
    { n: 4, label: "Riepilogo", sub: "Verifica e invia" },
  ]

  return (
    <aside className="hidden md:flex flex-col w-[300px] xl:w-[340px] flex-shrink-0 bg-black/20 border-r border-white/[0.07] p-8 xl:p-10">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FFC300] mb-1.5">
        Richiesta di risarcimento
      </div>
      <h2 className="text-2xl xl:text-[26px] font-extrabold text-white leading-tight mb-2">
        Volo in ritardo
        <br />o cancellato?
      </h2>
      <p className="text-sm text-white/50 leading-relaxed mb-8">
        Compila i 4 passaggi per verificare la tua richiesta. Ti risponderà un avvocato in 24 ore
        — gratuitamente.
      </p>

      <ol className="list-none m-0 p-0 flex flex-col">
        {steps.map((s, i) => {
          const state = step > s.n ? "done" : step === s.n ? "active" : "upcoming"
          const isLast = i === steps.length - 1
          return (
            <li key={s.n} className="flex items-start gap-3.5 py-2 relative">
              <StepDot state={state} n={s.n} />
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[18px] top-11 w-px bottom-0 -mb-2",
                    state === "done" ? "bg-[#FFC300]/60" : "bg-white/[0.08]",
                  )}
                />
              )}
              <div className="pt-1.5">
                <div
                  className={cn(
                    "text-sm font-semibold leading-none",
                    state === "upcoming" ? "text-white/35" : "text-white",
                  )}
                >
                  {s.label}
                </div>
                <div
                  className={cn(
                    "text-xs mt-1",
                    state === "upcoming" ? "text-white/20" : "text-white/45",
                  )}
                >
                  {s.sub}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-auto pt-8">
        <div className="text-xs text-white/30 leading-relaxed p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
          I tuoi dati sono trattati nel rispetto della normativa GDPR. Reg. UE 261/2004.
        </div>
      </div>
    </aside>
  )
}

function MobileProgress({ step }: { step: number }) {
  const labels = ["Itinerario", "Dettagli volo", "Dati personali", "Riepilogo"]
  return (
    <div className="md:hidden px-4 py-3 border-b border-white/10 bg-black/10">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-bold text-[#FFC300]">Passo {step} di 4</span>
        <span className="text-white/50">{labels[step - 1]}</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFC300] rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  )
}

/* ─── Card Shell ─── */

function CardShell({
  kicker,
  title,
  subtitle,
  children,
  footer,
}: {
  kicker: string
  title: string
  subtitle?: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl w-full max-w-[680px] flex flex-col shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5),0_16px_36px_-14px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="px-7 md:px-10 pt-8 pb-0 flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5CC] text-[#7A4A12] text-[10px] font-extrabold uppercase tracking-[0.15em] mb-5">
          {kicker}
        </div>
        <h1 className="text-[26px] md:text-3xl font-extrabold text-[#13283D] tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 mb-6 text-[#5A7088] text-[14.5px] leading-relaxed">{subtitle}</p>
        ) : (
          <div className="mb-6" />
        )}
      </div>

      {/* Scrollable content */}
      <div className="px-7 md:px-10 pb-2 flex-1 overflow-y-auto">{children}</div>

      {/* Footer nav */}
      <div className="px-7 md:px-10 py-5 border-t border-[#EEF2F6] flex-shrink-0">{footer}</div>
    </div>
  )
}

/* ─── Field wrapper (for native inputs only) ─── */

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#13283D]">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-[#7B8FA3]">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-600 font-semibold">{error}</p>}
    </div>
  )
}

/* ─── Choice card (direct / with stopover) ─── */

function ChoiceCard({
  selected,
  onClick,
  icon: IC,
  title,
  sub,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ElementType
  title: string
  sub: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center gap-3 p-4 rounded-2xl border-[1.5px] cursor-pointer text-left transition-all duration-150",
        selected
          ? "bg-[#FFFBEB] border-[#FFC300] shadow-[0_0_0_3px_rgba(255,195,0,0.18)]"
          : "bg-white border-[#DCE3EB] hover:border-[#FFC300]/60 hover:bg-[#FFFDF0]",
      )}
    >
      <span
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
          selected ? "bg-[#FFC300] text-[#0B1B27]" : "bg-[#FFF5CC] text-[#B8860B]",
        )}
      >
        <IC className="w-5 h-5" />
      </span>
      <span>
        <span className="block font-bold text-[15px] text-[#13283D]">{title}</span>
        <span className="block text-xs text-[#5A7088] mt-0.5">{sub}</span>
      </span>
    </button>
  )
}

/* ─── Leg section (for connecting flights) ─── */

function LegSection({
  tag,
  title,
  children,
}: {
  tag: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-[#E5EBF1] rounded-2xl p-5 bg-[#F8FAFC]">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7A4A12] bg-[#FFF5CC] px-2.5 py-1 rounded-full">
          {tag}
        </span>
        <h3 className="text-base font-bold text-[#13283D] m-0">{title}</h3>
      </div>
      {children}
    </div>
  )
}

/* ─── Navigation buttons ─── */

function PrimaryBtn({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[15px] transition-all duration-150 select-none",
        disabled
          ? "bg-[#E7ECF2] text-[#A8B5C2] cursor-not-allowed"
          : "bg-gradient-to-br from-[#FFD54F] to-[#FFC300] text-[#7A4A12] shadow-[0_8px_18px_-8px_rgba(255,195,0,0.5)] hover:-translate-y-px active:translate-y-0",
      )}
    >
      {children}
    </button>
  )
}

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[15px] bg-white text-[#1B2C3E] border border-[#DCE3EB] hover:border-[#FFC300]/60 transition-all duration-150"
    >
      {children}
    </button>
  )
}

/* ─── Summary components ─── */

function SummaryBlock({
  icon: IC,
  title,
  onEdit,
  children,
}: {
  icon: React.ElementType
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E5EBF1] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#13283D]">
          <span className="w-7 h-7 rounded-full bg-[#FFF5CC] text-[#B8860B] flex items-center justify-center">
            <IC className="w-4 h-4" />
          </span>
          {title}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#7A4A12] hover:text-[#FFC300] transition-colors bg-transparent border-none cursor-pointer"
        >
          <PenLine className="w-3.5 h-3.5" />
          Modifica
        </button>
      </div>
      {children}
    </div>
  )
}

function SumRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold text-[#7B8FA3] uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-[#13283D] mt-0.5 break-words">{value || "—"}</div>
    </div>
  )
}

function CheckboxCard({
  checked,
  onChange,
  label,
  error,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <label
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl border-[1.5px] cursor-pointer text-sm text-[#1B2C3E] transition-all duration-150 select-none",
          checked
            ? "bg-[#FFFBEB] border-[#FFC300] shadow-[0_0_0_3px_rgba(255,195,0,0.12)]"
            : "bg-white border-[#DCE3EB]",
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 cursor-pointer accent-[#FFC300] flex-shrink-0"
        />
        <span>{label}</span>
      </label>
      {error && <p className="mt-1 text-xs text-red-600 font-semibold">{error}</p>}
    </div>
  )
}

/* ─── Success state ─── */

function SuccessState({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-[500px] w-full mx-auto text-center bg-white/[0.03] border border-emerald-500/25 rounded-2xl p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]">
      <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-emerald-500/12 flex items-center justify-center">
        <CheckCircle className="w-9 h-9 text-emerald-400" />
      </div>
      <h2 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Richiesta Inviata!</h2>
      <p className="mt-3 mb-7 text-white/70 text-[15px] leading-relaxed max-w-sm mx-auto">
        Grazie per averci contattato. Un nostro avvocato ti risponderà al più presto per valutare il
        tuo caso.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-[15px] bg-[#FFC300] text-[#0B1B27] shadow-[0_8px_18px_-8px_rgba(255,195,0,0.55)] hover:-translate-y-px transition-all"
      >
        Invia un&apos;altra richiesta
      </button>
    </div>
  )
}

/* ─── Step content ─── */

function Step1Content({
  from, to, via, direct,
  setFrom, setTo, setVia, setDirect,
  refs, errors, onNext,
}: {
  from: string; to: string; via: string; direct: "si" | "no"
  setFrom: (v: string) => void; setTo: (v: string) => void
  setVia: (v: string) => void; setDirect: (v: "si" | "no") => void
  refs: { from: React.RefObject<HTMLInputElement | null>; to: React.RefObject<HTMLInputElement | null>; via: React.RefObject<HTMLInputElement | null> }
  errors: Errors; onNext: () => void
}) {
  return (
    <CardShell
      kicker="Passo 1 di 4"
      title="Dove stavi volando?"
      subtitle="Indica la tratta del volo per cui vuoi richiedere il risarcimento."
      footer={
        <div className="flex justify-end">
          <PrimaryBtn onClick={onNext}>
            Continua <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </div>
      }
    >
      <div className="space-y-5 pb-2">
        <GlobalAirportInput
          id="from" name="from" label="Aeroporto di partenza"
          value={from} onChange={setFrom}
          placeholder="Roma Fiumicino - (FCO)"
          required inputRef={refs.from} error={errors.from}
        />
        <GlobalAirportInput
          id="to" name="to" label="Aeroporto di destinazione"
          value={to} onChange={setTo}
          placeholder="Milano Linate - (LIN)"
          required inputRef={refs.to} error={errors.to}
        />

        {direct === "no" && (
          <GlobalAirportInput
            id="via" name="via" label="Aeroporto di scalo"
            value={via} onChange={setVia}
            placeholder="Es. Francoforte - (FRA)"
            required inputRef={refs.via} error={errors.via}
            disableBrowserAutocomplete
          />
        )}

        <div>
          <p className="mb-2.5 text-sm font-semibold text-[#13283D]">Il tuo volo era diretto?</p>
          <div className="flex gap-3">
            <ChoiceCard
              selected={direct === "si"}
              onClick={() => setDirect("si")}
              icon={ArrowRight}
              title="Sì, diretto"
              sub="Un solo volo, senza scali"
            />
            <ChoiceCard
              selected={direct === "no"}
              onClick={() => setDirect("no")}
              icon={ArrowLeftRight}
              title="No, con scalo"
              sub="Due voli con coincidenza"
            />
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function FlightDetailsFields({
  leg, setLeg,
  dateRef, airlineRef, timeRef,
  dateError, airlineError, timeError,
  prefix,
}: {
  leg: Leg
  setLeg: (patch: Partial<Leg>) => void
  dateRef: React.RefObject<HTMLInputElement | null>
  airlineRef: React.RefObject<HTMLInputElement | null>
  timeRef: React.RefObject<HTMLSelectElement | HTMLInputElement | null>
  dateError?: string
  airlineError?: string
  timeError?: string
  prefix: string
}) {
  return (
    <div className="space-y-4">
      <Field label="Data del volo" error={dateError}>
        <input
          ref={dateRef}
          type="date"
          name={`${prefix}-date`}
          value={leg.date}
          onChange={(e) => setLeg({ date: e.target.value })}
          className={cn(
            "w-full bg-white border-[1.5px] rounded-xl px-4 py-3 text-[15px] font-medium text-[#1B2C3E]",
            "focus:outline-none focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/20 transition-all",
            dateError ? "border-red-400" : "border-[#DCE3EB]",
          )}
        />
      </Field>
      <GlobalAirlineInput
        id={`${prefix}-airline`} name={`${prefix}-airline`}
        label="Compagnia aerea"
        value={leg.airline}
        onChange={(v) => setLeg({ airline: v })}
        required inputRef={airlineRef} error={airlineError}
      />
      <TimeInputResponsive
        id={`${prefix}-time`} name={`${prefix}-time`}
        label="Orario di partenza previsto"
        value={leg.schedDep}
        onChange={(v) => setLeg({ schedDep: v })}
        inputRef={timeRef} error={timeError} required
      />
    </div>
  )
}

function Step2Content({
  direct, leg1, leg2, setLeg1, setLeg2,
  refs, errors, onNext, onBack,
}: {
  direct: "si" | "no"
  leg1: Leg; leg2: Leg
  setLeg1: (p: Partial<Leg>) => void
  setLeg2: (p: Partial<Leg>) => void
  refs: {
    leg1Date: React.RefObject<HTMLInputElement | null>
    leg1Airline: React.RefObject<HTMLInputElement | null>
    leg1Time: React.RefObject<HTMLSelectElement | HTMLInputElement | null>
    leg2Date: React.RefObject<HTMLInputElement | null>
    leg2Airline: React.RefObject<HTMLInputElement | null>
    leg2Time: React.RefObject<HTMLSelectElement | HTMLInputElement | null>
  }
  errors: Errors; onNext: () => void; onBack: () => void
}) {
  const hasConnection = direct === "no"
  return (
    <CardShell
      kicker="Passo 2 di 4"
      title="Dettagli volo"
      subtitle={
        hasConnection
          ? "Inserisci i dati di entrambi i voli — il primo e quello in coincidenza."
          : "Quando è avvenuto il disservizio?"
      }
      footer={
        <div className="flex justify-between">
          <GhostBtn onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Indietro
          </GhostBtn>
          <PrimaryBtn onClick={onNext}>
            Continua <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </div>
      }
    >
      <div className="space-y-5 pb-2">
        {hasConnection ? (
          <>
            <LegSection tag="Volo 1" title="Primo volo">
              <FlightDetailsFields
                leg={leg1} setLeg={setLeg1}
                dateRef={refs.leg1Date} airlineRef={refs.leg1Airline} timeRef={refs.leg1Time}
                dateError={errors.leg1Date} airlineError={errors.leg1Airline} timeError={errors.leg1Time}
                prefix="leg1"
              />
            </LegSection>

            <div className="flex items-center gap-3 text-[#7B8FA3] text-xs font-semibold uppercase tracking-wider">
              <span className="flex-1 h-px bg-[#E5EBF1]" />
              <span className="inline-flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" /> Coincidenza
              </span>
              <span className="flex-1 h-px bg-[#E5EBF1]" />
            </div>

            <LegSection tag="Volo 2" title="Volo di coincidenza">
              <FlightDetailsFields
                leg={leg2} setLeg={setLeg2}
                dateRef={refs.leg2Date} airlineRef={refs.leg2Airline} timeRef={refs.leg2Time}
                dateError={errors.leg2Date} airlineError={errors.leg2Airline} timeError={errors.leg2Time}
                prefix="leg2"
              />
            </LegSection>
          </>
        ) : (
          <FlightDetailsFields
            leg={leg1} setLeg={setLeg1}
            dateRef={refs.leg1Date} airlineRef={refs.leg1Airline} timeRef={refs.leg1Time}
            dateError={errors.leg1Date} airlineError={errors.leg1Airline} timeError={errors.leg1Time}
            prefix="leg1"
          />
        )}
      </div>
    </CardShell>
  )
}

function Step3Content({
  name, email, phone, description, passengers,
  setName, setEmail, setPhone, setDescription, setPassengers,
  refs, errors, onNext, onBack,
}: {
  name: string; email: string; phone: string; description: string; passengers: number
  setName: (v: string) => void; setEmail: (v: string) => void
  setPhone: (v: string) => void; setDescription: (v: string) => void
  setPassengers: (v: number) => void
  refs: {
    name: React.RefObject<HTMLInputElement | null>
    email: React.RefObject<HTMLInputElement | null>
    phone: React.RefObject<HTMLInputElement | null>
    description: React.RefObject<HTMLTextAreaElement | null>
  }
  errors: Errors; onNext: () => void; onBack: () => void
}) {
  const inputCls = (err?: string) =>
    cn(
      "w-full bg-white border-[1.5px] rounded-xl px-4 py-3 text-[15px] font-medium text-[#1B2C3E]",
      "focus:outline-none focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/20 transition-all placeholder:text-[#A8B8C8]",
      err ? "border-red-400" : "border-[#DCE3EB]",
    )

  return (
    <CardShell
      kicker="Passo 3 di 4"
      title="I tuoi dati"
      subtitle="Come possiamo contattarti per aggiornarti sul tuo caso?"
      footer={
        <div className="flex justify-between">
          <GhostBtn onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Indietro
          </GhostBtn>
          <PrimaryBtn onClick={onNext}>
            Continua <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </div>
      }
    >
      <div className="space-y-5 pb-2">
        <Field label="Nome e Cognome" error={errors.name}>
          <input
            ref={refs.name} name="name" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mario Rossi" autoComplete="name"
            className={inputCls(errors.name)}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email" error={errors.email}>
            <input
              ref={refs.email} type="email" name="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mario@esempio.it" autoComplete="email"
              className={inputCls(errors.email)}
            />
          </Field>
          <Field label="Telefono" error={errors.phone}>
            <input
              ref={refs.phone} type="tel" inputMode="numeric" name="phone" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="3xx xxx xxxx" autoComplete="tel"
              className={inputCls(errors.phone)}
            />
          </Field>
        </div>

        <Field label="Numero di passeggeri" hint="Includi tutti i passeggeri che vogliono richiedere il risarcimento.">
          <div className="inline-flex items-center gap-4 bg-white border-[1.5px] border-[#DCE3EB] rounded-xl px-3 py-2">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-8 h-8 rounded-lg bg-[#F6F8FB] flex items-center justify-center text-[#1B2C3E] hover:bg-[#EEF2F6] transition-colors font-bold text-lg leading-none"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-[18px] font-extrabold text-[#13283D]">
              {passengers}
            </span>
            <button
              type="button"
              onClick={() => setPassengers(Math.min(20, passengers + 1))}
              className="w-8 h-8 rounded-lg bg-[#FFC300] flex items-center justify-center text-[#0B1B27] hover:bg-[#FFB300] transition-colors font-bold text-lg leading-none"
            >
              +
            </button>
          </div>
        </Field>

        <Field label="Descrizione del problema" error={errors.description}>
          <textarea
            ref={refs.description} name="description" rows={4} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrivi brevemente cosa è successo (ritardo di X ore, cancellazione, motivazione comunicata dalla compagnia…)"
            className={cn(inputCls(errors.description), "resize-none min-h-[100px]")}
          />
        </Field>
      </div>
    </CardShell>
  )
}

function Step4Content({
  from, to, via, direct, leg1, leg2,
  name, email, phone, description, passengers,
  privacy, terms, setPrivacy, setTerms,
  errors, onBack, onSubmit, submitting, goTo,
}: {
  from: string; to: string; via: string; direct: "si" | "no"
  leg1: Leg; leg2: Leg
  name: string; email: string; phone: string; description: string; passengers: number
  privacy: boolean; terms: boolean
  setPrivacy: (v: boolean) => void; setTerms: (v: boolean) => void
  errors: Errors; onBack: () => void; onSubmit: () => void
  submitting: boolean; goTo: (s: number) => void
}) {
  const hasConnection = direct === "no"
  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }) : "—"

  return (
    <CardShell
      kicker="Passo 4 di 4"
      title="Riepilogo e Conferma"
      subtitle="Verifica i dati inseriti prima di inviare la richiesta."
      footer={
        <div className="flex justify-between">
          <GhostBtn onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Indietro
          </GhostBtn>
          <PrimaryBtn onClick={onSubmit} disabled={submitting || !privacy || !terms}>
            <Send className="w-4 h-4" />
            {submitting ? "Invio in corso..." : "Invia richiesta"}
          </PrimaryBtn>
        </div>
      }
    >
      <div className="space-y-3 pb-2">
        {/* Itinerario */}
        <SummaryBlock icon={Plane} title="Itinerario" onEdit={() => goTo(1)}>
          <div
            className={cn(
              "grid gap-4",
              hasConnection ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3",
            )}
          >
            <SumRow label="Da" value={from} />
            <SumRow label="A" value={to} />
            {hasConnection && <SumRow label="Scalo" value={via} />}
            <SumRow
              label="Tipo"
              value={
                <span
                  className={cn(
                    "inline-block text-xs font-bold px-2.5 py-0.5 rounded-full",
                    hasConnection
                      ? "bg-orange-100 text-orange-700"
                      : "bg-emerald-100 text-emerald-700",
                  )}
                >
                  {hasConnection ? "Con scalo" : "Volo diretto"}
                </span>
              }
            />
          </div>
        </SummaryBlock>

        {/* Dettagli volo */}
        <SummaryBlock
          icon={Calendar}
          title={hasConnection ? "Dettagli voli" : "Dettagli volo"}
          onEdit={() => goTo(2)}
        >
          {hasConnection ? (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider mb-2">
                  Primo volo
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <SumRow label="Data" value={fmtDate(leg1.date)} />
                  <SumRow label="Orario" value={leg1.schedDep} />
                  <SumRow label="Compagnia" value={leg1.airline} />
                </div>
              </div>
              <div className="h-px bg-[#E5EBF1]" />
              <div>
                <div className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider mb-2">
                  Volo di coincidenza
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <SumRow label="Data" value={fmtDate(leg2.date)} />
                  <SumRow label="Orario" value={leg2.schedDep} />
                  <SumRow label="Compagnia" value={leg2.airline} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <SumRow label="Data" value={fmtDate(leg1.date)} />
              <SumRow label="Orario" value={leg1.schedDep} />
              <SumRow label="Compagnia" value={leg1.airline} />
            </div>
          )}
        </SummaryBlock>

        {/* Dati personali */}
        <SummaryBlock icon={User} title="Dati personali" onEdit={() => goTo(3)}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <SumRow label="Nome" value={name} />
            <SumRow label="Email" value={email} />
            <SumRow label="Telefono" value={phone} />
            <SumRow label="Passeggeri" value={passengers} />
          </div>
          {description && (
            <div className="pt-3 border-t border-dashed border-[#D9E0E7]">
              <SumRow label="Problema" value={description} />
            </div>
          )}
        </SummaryBlock>

        {/* Consensi */}
        <div className="space-y-2.5">
          <CheckboxCard
            checked={privacy}
            onChange={setPrivacy}
            error={errors.privacy}
            label={
              <>
                Ho letto e accetto la{" "}
                <a href="/privacy" className="font-bold underline text-[#13283D]">
                  Privacy Policy
                </a>{" "}
                *
              </>
            }
          />
          <CheckboxCard
            checked={terms}
            onChange={setTerms}
            error={errors.terms}
            label={
              <>
                Ho letto e accetto i{" "}
                <a href="/termini" className="font-bold underline text-[#13283D]">
                  Termini e condizioni
                </a>{" "}
                *
              </>
            }
          />
        </div>
      </div>
    </CardShell>
  )
}

/* ─── Main export ─── */

export default function RequestForm() {
  const params = useSearchParams()
  const presetFrom = params.get("from") ?? ""
  const presetTo = params.get("to") ?? ""
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  const [from, setFrom] = useState(presetFrom)
  const [to, setTo] = useState(presetTo)
  const [via, setVia] = useState("")
  const [direct, setDirect] = useState<"si" | "no">("si")

  const [leg1, setLeg1] = useState<Leg>({ date: "", airline: "", schedDep: "00:00" })
  const [leg2, setLeg2] = useState<Leg>({ date: "", airline: "", schedDep: "00:00" })

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [passengers, setPassengers] = useState(1)

  const [privacy, setPrivacy] = useState(false)
  const [terms, setTerms] = useState(false)

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)
  }, [])

  const refs = {
    from: useRef<HTMLInputElement>(null),
    to: useRef<HTMLInputElement>(null),
    via: useRef<HTMLInputElement>(null),
    leg1Date: useRef<HTMLInputElement>(null),
    leg1Airline: useRef<HTMLInputElement>(null),
    leg1Time: useRef<HTMLSelectElement | HTMLInputElement>(null),
    leg2Date: useRef<HTMLInputElement>(null),
    leg2Airline: useRef<HTMLInputElement>(null),
    leg2Time: useRef<HTMLSelectElement | HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    privacy: useRef<HTMLInputElement>(null),
    terms: useRef<HTMLInputElement>(null),
  }

  function isValidTime(v: string) {
    return /^\d{2}:\d{2}$/.test(v)
  }

  function isValidPhone10(v: string) {
    const digits = v.replace(/\D/g, "")
    return digits.length === 10
  }

  function validate(): { ok: boolean; errs: Errors } {
    const errs: Errors = {}
    if (!from) errs.from = "Campo obbligatorio"
    if (!to) errs.to = "Campo obbligatorio"
    if (!leg1.date) errs.leg1Date = "Campo obbligatorio"
    if (!leg1.airline) errs.leg1Airline = "Campo obbligatorio"
    if (!leg1.schedDep || !isValidTime(leg1.schedDep)) errs.leg1Time = "Inserisci un orario valido"
    if (direct === "no") {
      if (!via) errs.via = "Campo obbligatorio"
      if (!leg2.date) errs.leg2Date = "Campo obbligatorio"
      if (!leg2.airline) errs.leg2Airline = "Campo obbligatorio"
      if (!leg2.schedDep || !isValidTime(leg2.schedDep)) errs.leg2Time = "Inserisci un orario valido"
    }
    if (!name) errs.name = "Campo obbligatorio"
    if (!email) errs.email = "Campo obbligatorio"
    if (!phone || !isValidPhone10(phone)) errs.phone = "Inserisci un numero di 10 cifre"
    if (!description) errs.description = "Campo obbligatorio"
    return { ok: Object.keys(errs).length === 0, errs }
  }

  function validateStep(s: number): boolean {
    if (s === 1) {
      const errs: Errors = {}
      if (!from) errs.from = "Campo obbligatorio"
      if (!to) errs.to = "Campo obbligatorio"
      if (direct === "no" && !via) errs.via = "Campo obbligatorio"
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    if (s === 2) {
      const errs: Errors = {}
      if (!leg1.date) errs.leg1Date = "Campo obbligatorio"
      if (!leg1.airline) errs.leg1Airline = "Campo obbligatorio"
      if (!leg1.schedDep || !isValidTime(leg1.schedDep)) errs.leg1Time = "Inserisci un orario valido"
      if (direct === "no") {
        if (!leg2.date) errs.leg2Date = "Campo obbligatorio"
        if (!leg2.airline) errs.leg2Airline = "Campo obbligatorio"
        if (!leg2.schedDep || !isValidTime(leg2.schedDep)) errs.leg2Time = "Inserisci un orario valido"
      }
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    if (s === 3) {
      const errs: Errors = {}
      if (!name) errs.name = "Campo obbligatorio"
      if (!email) errs.email = "Campo obbligatorio"
      if (!phone || !isValidPhone10(phone)) errs.phone = "Inserisci un numero di 10 cifre"
      if (!description) errs.description = "Campo obbligatorio"
      setErrors(errs)
      return Object.keys(errs).length === 0
    }
    return true
  }

  function nextStep() {
    if (!validateStep(step)) {
      toast({
        title: "Compila i campi obbligatori",
        description: "Alcuni campi sono mancanti o non validi.",
        variant: "destructive",
      })
      return
    }
    setErrors({})
    setStep((s) => Math.min(4, s + 1))
    try { window.scrollTo({ top: 0, behavior: "smooth" }) } catch {}
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1))
    try { window.scrollTo({ top: 0, behavior: "smooth" }) } catch {}
  }

  async function handleSubmit() {
    if (submitting) return

    const { ok, errs } = validate()
    setErrors(errs)
    if (!ok) {
      toast({
        title: "Compila i campi obbligatori",
        description: "Alcuni campi sono mancanti o non validi.",
        variant: "destructive",
      })
      return
    }

    const consentErrs: Errors = {}
    if (!privacy) consentErrs.privacy = "Obbligatorio"
    if (!terms) consentErrs.terms = "Obbligatorio"
    if (Object.keys(consentErrs).length > 0) {
      setErrors({ ...errs, ...consentErrs })
      toast({
        title: "Consensi obbligatori",
        description: "Accetta Privacy e Termini per inviare la richiesta.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const templateParams = {
        name,
        email,
        phone,
        from_airport: from,
        to_airport: to,
        via_airport: direct === "no" ? via : "N/A",
        direct_flight: direct === "si" ? "Sì" : "No",
        flight1_date: leg1.date,
        flight1_airline: leg1.airline,
        flight1_departure: leg1.schedDep,
        flight2_date: direct === "si" ? "N/A" : leg2.date,
        flight2_airline: direct === "si" ? "N/A" : leg2.airline,
        flight2_departure: direct === "si" ? "N/A" : leg2.schedDep,
        message: description,
        submission_date: new Date().toLocaleString("it-IT"),
        flight_number: `${leg1.airline} (${leg1.date})`,
        flight_date: leg1.date,
        passengers: passengers.toString(),
      }

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
      )

      if (result.status === 200) {
        setSubmitted(true)
        try { window.scrollTo({ top: 0, behavior: "smooth" }) } catch {}
        toast({ title: "Richiesta inviata", description: "Ti ricontatteremo entro 24 ore." })
      } else {
        throw new Error("EmailJS failed")
      }
    } catch (error) {
      console.error("EmailJS error:", error)
      toast({
        title: "Errore di rete",
        description: "Controlla la connessione e riprova.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  function resetAll() {
    setFrom("")
    setTo("")
    setVia("")
    setDirect("si")
    setLeg1({ date: "", airline: "", schedDep: "00:00" })
    setLeg2({ date: "", airline: "", schedDep: "00:00" })
    setName("")
    setEmail("")
    setPhone("")
    setDescription("")
    setPassengers(1)
    setPrivacy(false)
    setTerms(false)
    setErrors({})
    setSubmitted(false)
    setStep(1)
    try { window.scrollTo({ top: 0, behavior: "smooth" }) } catch {}
  }

  return (
    <div
      className="flex min-h-[calc(100vh-4rem)]"
      style={{
        background:
          "radial-gradient(700px 400px at 15% 25%, rgba(255,195,0,0.05), transparent 70%), linear-gradient(180deg, #0E2032 0%, #0A1826 100%)",
      }}
    >
      {/* Left rail — desktop only */}
      <LeftRail step={step} hasConnection={direct === "no"} />

      {/* Right content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top progress */}
        {!submitted && <MobileProgress step={step} />}

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 xl:p-12">
          {submitted ? (
            <SuccessState reset={resetAll} />
          ) : (
            <>
              {step === 1 && (
                <Step1Content
                  from={from} to={to} via={via} direct={direct}
                  setFrom={setFrom} setTo={setTo} setVia={setVia} setDirect={setDirect}
                  refs={{ from: refs.from, to: refs.to, via: refs.via }}
                  errors={errors} onNext={nextStep}
                />
              )}
              {step === 2 && (
                <Step2Content
                  direct={direct} leg1={leg1} leg2={leg2}
                  setLeg1={(p) => setLeg1((l) => ({ ...l, ...p }))}
                  setLeg2={(p) => setLeg2((l) => ({ ...l, ...p }))}
                  refs={{
                    leg1Date: refs.leg1Date, leg1Airline: refs.leg1Airline, leg1Time: refs.leg1Time,
                    leg2Date: refs.leg2Date, leg2Airline: refs.leg2Airline, leg2Time: refs.leg2Time,
                  }}
                  errors={errors} onNext={nextStep} onBack={prevStep}
                />
              )}
              {step === 3 && (
                <Step3Content
                  name={name} email={email} phone={phone}
                  description={description} passengers={passengers}
                  setName={setName} setEmail={setEmail} setPhone={setPhone}
                  setDescription={setDescription} setPassengers={setPassengers}
                  refs={{ name: refs.name, email: refs.email, phone: refs.phone, description: refs.description }}
                  errors={errors} onNext={nextStep} onBack={prevStep}
                />
              )}
              {step === 4 && (
                <Step4Content
                  from={from} to={to} via={via} direct={direct}
                  leg1={leg1} leg2={leg2}
                  name={name} email={email} phone={phone}
                  description={description} passengers={passengers}
                  privacy={privacy} terms={terms}
                  setPrivacy={setPrivacy} setTerms={setTerms}
                  errors={errors} onBack={prevStep}
                  onSubmit={handleSubmit} submitting={submitting}
                  goTo={setStep}
                />
              )}
            </>
          )}
        </div>
      </div>

      <Toaster />
    </div>
  )
}
