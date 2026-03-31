"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { Send, CheckCircle } from "lucide-react"
import GlobalAirlineInput from "./global-airline-input"
import GlobalAirportInput from "./global-airport-input"
import { TimeInputResponsive } from "./time-input-responsive"
import { useLanguage } from "@/contexts/language-context"

type Leg = { date: string; airline: string; schedDep: string }
type Payload = {
  flow: "request"
  from: string
  to: string
  direct: boolean
  via?: string
  leg1: Leg
  leg2?: Leg | null
  name: string
  email: string
  phone: string
  description: string
  privacy: "on"
  terms: "on"
}
type Errors = Partial<
  Record<
    | "from"
    | "to"
    | "via"
    | "leg1Date"
    | "leg1Airline"
    | "leg1Time"
    | "leg2Date"
    | "leg2Airline"
    | "leg2Time"
    | "name"
    | "email"
    | "phone"
    | "description"
    | "privacy"
    | "terms",
    string
  >
>

export default function RequestForm() {
  const params = useSearchParams()
  const presetFrom = params.get("from") ?? ""
  const presetTo = params.get("to") ?? ""
  const { toast } = useToast()
  const { t } = useLanguage()

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

  // Refs for scroll/focus
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

  function scrollToFirstError(errs: Errors) {
    const order: (keyof Errors)[] = [
      "from",
      "to",
      "via",
      "leg1Date",
      "leg1Airline",
      "leg1Time",
      "leg2Date",
      "leg2Airline",
      "leg2Time",
      "name",
      "email",
      "phone",
      "description",
      "privacy",
      "terms",
    ]
    for (const k of order) {
      if (errs[k]) {
        const el = refs[k as keyof typeof refs]?.current
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" })
          ;(el as any).focus?.()
          break
        }
      }
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
    setErrors({})
    setSubmitted(false)
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
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
    if (!from) errs.from = t('requiredField')
    if (!to) errs.to = t('requiredField')
    if (!leg1.date) errs.leg1Date = t('requiredField')
    if (!leg1.airline) errs.leg1Airline = t('requiredField')
    if (!leg1.schedDep || !isValidTime(leg1.schedDep)) errs.leg1Time = t('validTimeRequired')
    if (direct === "no") {
      if (!via) errs.via = t('requiredField')
      if (!leg2.date) errs.leg2Date = t('requiredField')
      if (!leg2.airline) errs.leg2Airline = t('requiredField')
      if (!leg2.schedDep || !isValidTime(leg2.schedDep)) errs.leg2Time = t('validTimeRequired')
    }
    if (!name) errs.name = t('requiredField')
    if (!email) errs.email = t('requiredField')
    if (!phone || !isValidPhone10(phone)) errs.phone = t('enter10DigitPhone')
    if (!description) errs.description = t('requiredField')
    return { ok: Object.keys(errs).length === 0, errs }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return

    const { ok, errs } = validate()
    setErrors(errs)
    if (!ok) {
      scrollToFirstError(errs)
      toast({
        title: t('completeRequiredFields'),
        description: t('someMissingInvalid'),
        variant: "destructive",
      })
      return
    }

    const fd = new FormData(e.currentTarget)
    const priv = fd.get("privacy")
    const trm = fd.get("terms")
    const consentErrs: Errors = {}
    if (!priv) consentErrs.privacy = t('required')
    if (!trm) consentErrs.terms = t('required')
    if (Object.keys(consentErrs).length > 0) {
      const combined = { ...errs, ...consentErrs }
      setErrors(combined)
      scrollToFirstError(combined)
      toast({
        title: t('consentRequired'),
        description: t('acceptPrivacyTerms'),
        variant: "destructive",
      })
      return
    }

    const payload: Payload = {
      flow: "request",
      from,
      to,
      direct: direct === "si",
      via: direct === "no" ? via : undefined,
      leg1,
      leg2: direct === "si" ? null : leg2,
      name,
      email,
      phone,
      description,
      privacy: "on",
      terms: "on",
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as { ok: boolean; message: string }
      if (data.ok) {
        setSubmitted(true)
        try {
          window.scrollTo({ top: 0, behavior: "smooth" })
        } catch {}
        toast({ title: t('requestSent'), description: t('requestSentThankYou') })
        return
      } else {
        toast({
          title: t('sendFailed'),
          description: data.message ?? t('tryAgainLater'),
          variant: "destructive",
        })
      }
    } catch {
      toast({ title: t('networkError'), description: t('checkConnectionRetry'), variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const errCls = (key: keyof Errors) => (errors[key] ? "ring-2 ring-red-500 focus-visible:ring-red-500" : "")

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white/10 p-8 text-center text-white">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-green-500/20">
          <CheckCircle className="h-7 w-7 text-green-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300]">{t('requestSent')}</h2>
        <p className="mt-2 text-white/85">
          {t('requestSentMessage')}
        </p>
        <button
          type="button"
          onClick={resetAll}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-[#FFC300] px-5 py-2.5 font-semibold text-[#072534] hover:bg-[#FFB800]"
        >
          {t('sendAnotherRequest')}
        </button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      {/* Itinerario */}
      <Card className="bg-white text-[#072534] border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-xl font-extrabold">{t('itinerary')}</h2>
          <div className={`mt-3 grid gap-4 ${direct === "no" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {/* Partenza */}
            <GlobalAirportInput
              id="from"
              name="from"
              label={t('departureAirport')}
              value={from}
              onChange={setFrom}
              placeholder="Roma Fiumicino - (FCO)"
              required
              inputRef={refs.from}
              error={errors.from}
            />

            {/* Scalo: mostrato solo se volo non diretto, al centro su desktop */}
            {direct === "no" && (
              <GlobalAirportInput
                id="via"
                name="via"
                label={t('stopoverAirport')}
                value={via}
                onChange={setVia}
                placeholder="Es. Amsterdam - (AMS)"
                required
                inputRef={refs.via}
                error={errors.via}
                disableBrowserAutocomplete={true}
              />
            )}

            {/* Destinazione */}
            <GlobalAirportInput
              id="to"
              name="to"
              label={t('destinationAirport')}
              value={to}
              onChange={setTo}
              placeholder="Milano Linate - (LIN)"
              required
              inputRef={refs.to}
              error={errors.to}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 font-semibold">{t('directFlight')}</p>
            <RadioGroup defaultValue="si" onValueChange={(v) => setDirect(v as "si" | "no")} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="diretto-si" />
                <Label htmlFor="diretto-si">{t('yes')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="diretto-no" />
                <Label htmlFor="diretto-no">{t('no')}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Dettagli volo/i */}
      <Card className="bg-white text-[#072534] border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-xl font-extrabold">{direct === "no" ? t('flightDetailsWithNumber', {number: '1'}) : t('flightDetails')}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">{t('flightDate')}</label>
              <Input
                ref={refs.leg1Date}
                type="date"
                name="leg1-date"
                value={leg1.date}
                onChange={(e) => setLeg1({ ...leg1, date: e.target.value })}
                className={errCls("leg1Date")}
              />
              {errors.leg1Date ? <p className="mt-1 text-xs text-red-600">{errors.leg1Date}</p> : null}
            </div>
            <GlobalAirlineInput
              id="leg1-airline"
              name="leg1-airline"
              label={t('airline')}
              value={leg1.airline}
              onChange={(v) => setLeg1({ ...leg1, airline: v })}
              required
              inputRef={refs.leg1Airline}
              error={errors.leg1Airline}
            />
            <TimeInputResponsive
              id="leg1-time"
              name="leg1-time"
              label={t('scheduledDeparture')}
              value={leg1.schedDep}
              onChange={(v) => setLeg1({ ...leg1, schedDep: v })}
              inputRef={refs.leg1Time}
              error={errors.leg1Time}
              required
            />
          </div>

          {direct === "no" && (
            <>
              <hr className="my-6 border-[#072534]/10" />
              <h2 className="text-xl font-extrabold">{t('flightDetailsWithNumber', {number: '2'})}</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#072534]">{t('flightDate')}</label>
                  <Input
                    ref={refs.leg2Date}
                    type="date"
                    name="leg2-date"
                    value={leg2.date}
                    onChange={(e) => setLeg2({ ...leg2, date: e.target.value })}
                    className={errCls("leg2Date")}
                  />
                  {errors.leg2Date ? <p className="mt-1 text-xs text-red-600">{errors.leg2Date}</p> : null}
                </div>
                <GlobalAirlineInput
                  id="leg2-airline"
                  name="leg2-airline"
                  label={t('airline')}
                  value={leg2.airline}
                  onChange={(v) => setLeg2({ ...leg2, airline: v })}
                  required
                  inputRef={refs.leg2Airline}
                  error={errors.leg2Airline}
                />
                <TimeInputResponsive
                  id="leg2-time"
                  name="leg2-time"
                  label={t('scheduledDeparture')}
                  value={leg2.schedDep}
                  onChange={(v) => setLeg2({ ...leg2, schedDep: v })}
                  inputRef={refs.leg2Time}
                  error={errors.leg2Time}
                  required
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dati personali */}
      <Card className="bg-white text-[#072534] border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-xl font-extrabold">{t('personalData')}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">{t('fullName')}</label>
              <Input
                ref={refs.name}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('yourFullName')}
                className={errCls("name")}
              />
              {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">{t('email')}</label>
              <Input
                ref={refs.email}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('yourEmail')}
                className={errCls("email")}
              />
              {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">{t('phone')}</label>
              <Input
                ref={refs.phone}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('yourPhone')}
                className={errCls("phone")}
              />
              {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-[#072534]">{t('problemDescription')}</label>
              <Textarea
                ref={refs.description}
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('problemDescriptionPlaceholder')}
                className={errCls("description")}
              />
              {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <label className="flex items-start gap-2">
              <input ref={refs.privacy} name="privacy" type="checkbox" className="mt-1" />
              <span>
                {t('agreeToPrivacy')}{" "}
                <a href="/privacy" className="underline text-[#072534]">
                  {t('privacyPolicy')}
                </a>{" "}
                *
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input ref={refs.terms} name="terms" type="checkbox" className="mt-1" />
              <span>
                {t('agreeToTerms')}{" "}
                <a href="/termini" className="underline text-[#072534]">
                  {t('termsAndConditions')}
                </a>{" "}
                *
              </span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full bg-[#FF8A00] text-white hover:bg-[#ff8a00]/90 font-semibold"
          >
            <Send className="mr-2 h-4 w-4" />
            {submitting ? t('submitting') : t('submit')}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
