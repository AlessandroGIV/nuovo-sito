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
import { ArrowLeft, ArrowRight, Send, CheckCircle, Plane, Calendar, User } from "lucide-react"
import GlobalAirlineInput from "./global-airline-input"
import GlobalAirportInput from "./global-airport-input"
import { TimeInputResponsive } from "./time-input-responsive"
import { useLanguage } from "@/contexts/language-context"
import { StepWizard } from "./step-wizard"
import emailjs from "@emailjs/browser"

export default function MultiStepRequestForm() {
  const params = useSearchParams()
  const presetFrom = params.get("from") ?? ""
  const presetTo = params.get("to") ?? ""
  const { toast } = useToast()
  const { t } = useLanguage()

  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form data
  const [from, setFrom] = useState(presetFrom)
  const [to, setTo] = useState(presetTo)
  const [via, setVia] = useState("")
  const [direct, setDirect] = useState<"si" | "no">("si")
  const [leg1, setLeg1] = useState({ date: "", airline: "", schedDep: "" })
  const [leg2, setLeg2] = useState({ date: "", airline: "", schedDep: "" })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  type Errors = Record<string, string>
  const [errors, setErrors] = useState<Errors>({})

  const refFrom = useRef<HTMLInputElement>(null)
  const refTo = useRef<HTMLInputElement>(null)
  const refVia = useRef<HTMLInputElement>(null)
  const refLeg1Date = useRef<HTMLInputElement>(null)
  const refLeg1Airline = useRef<HTMLInputElement>(null)
  const refLeg1Time = useRef<HTMLInputElement>(null)
  const refLeg2Date = useRef<HTMLInputElement>(null)
  const refLeg2Airline = useRef<HTMLInputElement>(null)
  const refLeg2Time = useRef<HTMLInputElement>(null)
  const refName = useRef<HTMLInputElement>(null)
  const refEmail = useRef<HTMLInputElement>(null)
  const refPhone = useRef<HTMLInputElement>(null)
  const refDescription = useRef<HTMLTextAreaElement>(null)
  const refTerms = useRef<HTMLInputElement>(null)

  const steps = [t("itinerary"), t("flightDetails"), t("personalData"), t("confirm")]

  const isValidTime = (t: string) => /^\d{2}:\d{2}$/.test(t)
  const isValidPhone10 = (p: string) => /^\d{10}$/.test(p)

  const refs = {
    from: refFrom,
    to: refTo,
    via: refVia,
    leg1Date: refLeg1Date,
    leg1Airline: refLeg1Airline,
    leg1Time: refLeg1Time,
    leg2Date: refLeg2Date,
    leg2Airline: refLeg2Airline,
    leg2Time: refLeg2Time,
    name: refName,
    email: refEmail,
    phone: refPhone,
    description: refDescription,
    terms: refTerms,
  }

  function validateStep(step: number): { ok: boolean; errs: Errors } {
    const errs: Errors = {}

    if (step === 1) {
      if (!from) errs.from = t("requiredField")
      if (!to) errs.to = t("requiredField")
      if (direct === "no" && !via) errs.via = t("requiredField")
    }

    if (step === 2) {
      if (!leg1.date) errs.leg1Date = t("requiredField")
      if (!leg1.airline) errs.leg1Airline = t("requiredField")
      if (!leg1.schedDep || !isValidTime(leg1.schedDep)) errs.leg1Time = t("validTimeRequired")
      if (direct === "no") {
        if (!leg2.date) errs.leg2Date = t("requiredField")
        if (!leg2.airline) errs.leg2Airline = t("requiredField")
        if (!leg2.schedDep || !isValidTime(leg2.schedDep)) errs.leg2Time = t("validTimeRequired")
      }
    }

    if (step === 3) {
      if (!name) errs.name = t("requiredField")
      if (!email) errs.email = t("requiredField")
      if (!phone || !isValidPhone10(phone)) errs.phone = t("enter10DigitPhone")
      if (!description) errs.description = t("requiredField")
    }

    if (step === 4) {
      if (!termsAccepted) errs.terms = t("required")
    }

    return { ok: Object.keys(errs).length === 0, errs }
  }

  function nextStep() {
    const { ok, errs } = validateStep(currentStep)
    setErrors(errs)

    if (!ok) {
      toast({
        title: t("completeRequiredFields"),
        description: t("someMissingInvalid"),
        variant: "destructive",
      })
      return
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function handleSubmit() {
    console.log("[v0] handleSubmit called")
    const { ok, errs } = validateStep(4)
    console.log("[v0] Validation result:", { ok, errs })
    setErrors(errs)

    if (!ok) {
      console.log("[v0] Validation failed, showing toast")
      toast({
        title: t("consentRequired"),
        description: t("acceptPrivacyTerms"),
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Starting submission...")
    setSubmitting(true)

    const payload = {
      flow: "request",
      from,
      to,
      via: direct === "no" ? via : "",
      direct,
      leg1,
      leg2: direct === "no" ? leg2 : { date: "", airline: "", schedDep: "" },
      name,
      email,
      phone,
      description,
      privacy: termsAccepted ? "on" : "",
      terms: termsAccepted ? "on" : "",
    }

    try {
      // 1. Valida i dati con l'API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.ok) {
        toast({
          title: t("sendFailed"),
          description: data.message ?? t("tryAgainLater"),
          variant: "destructive",
        })
        return
      }

      // 2. Prepara parametri per EmailJS
      const templateParams = {
        submission_date: new Date().toLocaleString("it-IT", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        full_name: name,
        email: email,
        phone: phone,
        is_direct_label: direct === "si" ? "Volo Diretto" : "Volo con Scalo",
        departure_airport: from,
        via_airport: via || "N/A",
        arrival_airport: to,
        segment1_date: leg1.date,
        segment1_time: leg1.schedDep,
        segment1_airline: leg1.airline,
        flight_number: leg1.airline,
        flight_date: leg1.date,
        segment2_date: direct === "no" ? leg2.date : "N/A",
        segment2_time: direct === "no" ? leg2.schedDep : "N/A",
        segment2_airline: direct === "no" ? leg2.airline : "N/A",
        description: description || "Nessuna descrizione fornita",
      }

      // 3. Invia email con EmailJS (client-side)
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )

      // 4. Track Google Ads conversion
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-17322484652/nuZvCKiXrbAbEKzHgMRA",
        })
      }

      // 5. Mostra successo
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
      toast({ title: t("requestSent"), description: t("requestSentThankYou") })
    } catch (error) {
      console.error("[v0] Error sending request:", error)
      toast({ title: t("networkError"), description: t("checkConnectionRetry"), variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  function resetAll() {
    setSubmitted(false)
    setCurrentStep(1)
    setFrom("")
    setTo("")
    setVia("")
    setDirect("si")
    setLeg1({ date: "", airline: "", schedDep: "" })
    setLeg2({ date: "", airline: "", schedDep: "" })
    setName("")
    setEmail("")
    setPhone("")
    setDescription("")
    setErrors({})
    setTermsAccepted(false)
  }

  const errCls = (key: string) => (errors[key] ? "border-red-500" : "")

  if (submitted) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          
          
        </div>

        {/* Success card */}
        <div className="rounded-2xl bg-[#0a3344] p-8 md:p-12 text-center py-3">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-500/20 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-green-500">{t('requestSentTitle')}</h2>
          <p className="mt-3 text-white/85 max-w-lg mx-auto">
            {t('requestSentMessage')}
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#FFC300] px-6 py-3 font-semibold text-[#072534] hover:bg-[#FFB800] transition-colors"
          >
            {t('sendAnotherRequestBtn')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 my-0 h-auto">
      <StepWizard currentStep={currentStep} steps={steps} />

      {/* Step 1: Itinerary */}
      {currentStep === 1 && (
        <Card className="bg-white text-[#072534] border-0 shadow-2xl py-0">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFC300]/20 mb-4">
                <Plane className="w-8 h-8 text-[#FFC300]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#072534] mb-2">
                {t("whereFlying")}
              </h2>
              
            </div>

            <div className="space-y-4">
              <GlobalAirportInput
                id="from"
                name="from"
                label={t("departureAirport")}
                value={from}
                onChange={setFrom}
                placeholder="Roma Fiumicino - (FCO)"
                required
                inputRef={refFrom}
                error={errors.from}
              />

              <GlobalAirportInput
                id="to"
                name="to"
                label={t("destinationAirport")}
                value={to}
                onChange={setTo}
                placeholder="Milano Linate - (LIN)"
                required
                inputRef={refTo}
                error={errors.to}
              />

              <div className="pt-4">
                <p className="mb-3 font-semibold text-[#072534]">{t("directFlight")}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDirect("si")}
                    className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                      direct === "si"
                        ? "border-[#FFC300] bg-[#FFC300]/10 text-[#072534]"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    {t("yes")}, {t("direct").toLowerCase()}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirect("no")}
                    className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                      direct === "no"
                        ? "border-[#FFC300] bg-[#FFC300]/10 text-[#072534]"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    {t("no")}, {t("withStopover").toLowerCase()}
                  </button>
                </div>
              </div>

              {direct === "no" && (
                <GlobalAirportInput
                  id="via"
                  name="via"
                  label={t("stopoverAirport")}
                  value={via}
                  onChange={setVia}
                  placeholder="Es. Amsterdam - (AMS)"
                  required
                  inputRef={refVia}
                  error={errors.via}
                  disableBrowserAutocomplete={true}
                />
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={nextStep}
                className="flex-1 bg-[#FF8A00] text-white hover:bg-[#ff8A00]/90 font-semibold h-12"
              >
                {t("continue")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Flight Details */}
      {currentStep === 2 && (
        <Card className="bg-white text-[#072534] border-0 shadow-2xl">
          <CardContent className="p-6 md:p-8 py-0">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFC300]/20 mb-4">
                <Calendar className="w-8 h-8 text-[#FFC300]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#072534] mb-2">
                {t("flightDetails")}
              </h2>
              <p className="text-neutral-600">{t("whenDidItHappen")}</p>
            </div>

            <div className="space-y-6">
              {/* Flight 1 */}
              <div className="space-y-4">
                {direct === "no" && (
                  <h3 className="font-bold text-lg text-[#072534]">{t("flight")} 1</h3>
                )}
                
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#072534]">{t("flightDate")}</label>
                  <Input
                    ref={refLeg1Date}
                    type="date"
                    name="leg1-date"
                    value={leg1.date}
                    onChange={(e) => setLeg1({ ...leg1, date: e.target.value })}
                    className={errCls("leg1Date")}
                  />
                  {errors.leg1Date && <p className="mt-1 text-xs text-red-600">{errors.leg1Date}</p>}
                </div>

                <GlobalAirlineInput
                  id="leg1-airline"
                  name="leg1-airline"
                  label={t("airline")}
                  value={leg1.airline}
                  onChange={(v) => setLeg1({ ...leg1, airline: v })}
                  required
                  inputRef={refLeg1Airline}
                  error={errors.leg1Airline}
                />

                <TimeInputResponsive
                  id="leg1-time"
                  name="leg1-time"
                  label={t("scheduledDeparture")}
                  value={leg1.schedDep}
                  onChange={(v) => setLeg1({ ...leg1, schedDep: v })}
                  inputRef={refLeg1Time}
                  error={errors.leg1Time}
                  required
                />
              </div>

              {/* Flight 2 */}
              {direct === "no" && (
                <div className="space-y-4 pt-6 border-t-2 border-neutral-100">
                  <h3 className="font-bold text-lg text-[#072534]">{t("flight")} 2</h3>
                  
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#072534]">{t("flightDate")}</label>
                    <Input
                      ref={refLeg2Date}
                      type="date"
                      name="leg2-date"
                      value={leg2.date}
                      onChange={(e) => setLeg2({ ...leg2, date: e.target.value })}
                      className={errCls("leg2Date")}
                    />
                    {errors.leg2Date && <p className="mt-1 text-xs text-red-600">{errors.leg2Date}</p>}
                  </div>

                  <GlobalAirlineInput
                    id="leg2-airline"
                    name="leg2-airline"
                    label={t("airline")}
                    value={leg2.airline}
                    onChange={(v) => setLeg2({ ...leg2, airline: v })}
                    required
                    inputRef={refLeg2Airline}
                    error={errors.leg2Airline}
                  />

                  <TimeInputResponsive
                    id="leg2-time"
                    name="leg2-time"
                    label={t("scheduledDeparture")}
                    value={leg2.schedDep}
                    onChange={(v) => setLeg2({ ...leg2, schedDep: v })}
                    inputRef={refLeg2Time}
                    error={errors.leg2Time}
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 border-2 border-neutral-200 hover:bg-neutral-50 font-semibold h-12 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> {t("back")}
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 bg-[#FF8A00] text-white hover:bg-[#ff8A00]/90 font-semibold h-12"
              >
                {t("continue")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Personal Data */}
      {currentStep === 3 && (
        <Card className="bg-white text-[#072534] border-0 shadow-2xl">
          <CardContent className="p-6 md:p-8 py-0">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFC300]/20 mb-4">
                <User className="w-8 h-8 text-[#FFC300]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#072534] mb-2">
                {t("yourData")}
              </h2>
              <p className="text-neutral-600">{t("howCanWeContact")}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#072534]">{t("fullName")}</label>
                <Input
                  ref={refName}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("yourFullName")}
                  className={errCls("name")}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#072534]">{t("email")}</label>
                <Input
                  ref={refEmail}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("yourEmail")}
                  className={errCls("email")}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#072534]">{t("phone")}</label>
                <Input
                  ref={refPhone}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("yourPhone")}
                  className={errCls("phone")}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#072534]">
                  {t("problemDescription")}
                </label>
                <Textarea
                  ref={refDescription}
                  name="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("problemDescriptionPlaceholder")}
                  className={errCls("description")}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 border-2 border-neutral-200 hover:bg-neutral-50 font-semibold h-12 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> {t("back")}
              </Button>
              <Button
                onClick={nextStep}
                className="flex-1 bg-[#FF8A00] text-white hover:bg-[#ff8A00]/90 font-semibold h-12"
              >
                {t("continue")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Summary and Confirm */}
      {currentStep === 4 && (
        <Card className="bg-white text-[#072534] border-0 shadow-2xl py-0">
          <CardContent className="p-6 md:p-8 py-3">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFC300]/20 mb-4">
                <CheckCircle className="w-8 h-8 text-[#FFC300]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#072534] mb-2">
                {t("almostDone")}
              </h2>
              <p className="text-neutral-600">{t("readAndAccept")}</p>
            </div>

            {/* Summary sections */}
            <div className="space-y-4 mb-6">
              {/* Itinerary summary */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-bold text-sm text-[#072534] mb-2 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#FFC300]" />
                  {t("summaryItinerary")}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-neutral-500">{t("summaryFrom")}:</span> <span className="font-medium">{from}</span></div>
                  <div><span className="text-neutral-500">{t("summaryTo")}:</span> <span className="font-medium">{to}</span></div>
                  {direct === "no" && via && (
                    <div className="col-span-2"><span className="text-neutral-500">{t("summaryVia")}:</span> <span className="font-medium">{via}</span></div>
                  )}
                  <div className="col-span-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${direct === "si" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {direct === "si" ? t("summaryDirectFlight") : t("summaryWithStopover")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flight details summary */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-bold text-sm text-[#072534] mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FFC300]" />
                  {t("summaryFlightDetails")}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div><span className="text-neutral-500">{t("summaryDate")}:</span> <span className="font-medium">{leg1.date}</span></div>
                    <div><span className="text-neutral-500">{t("summaryTime")}:</span> <span className="font-medium">{leg1.schedDep}</span></div>
                    <div><span className="text-neutral-500">{t("summaryAirline")}:</span> <span className="font-medium">{leg1.airline}</span></div>
                  </div>
                  {direct === "no" && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200">
                      <div><span className="text-neutral-500">{t("summaryDate")}:</span> <span className="font-medium">{leg2.date}</span></div>
                      <div><span className="text-neutral-500">{t("summaryTime")}:</span> <span className="font-medium">{leg2.schedDep}</span></div>
                      <div><span className="text-neutral-500">{t("summaryAirline")}:</span> <span className="font-medium">{leg2.airline}</span></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal data summary */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-bold text-sm text-[#072534] mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#FFC300]" />
                  {t("summaryPersonalData")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div><span className="text-neutral-500">{t("summaryName")}:</span> <span className="font-medium">{name}</span></div>
                  <div><span className="text-neutral-500">{t("summaryEmail")}:</span> <span className="font-medium">{email}</span></div>
                  <div><span className="text-neutral-500">{t("summaryPhone")}:</span> <span className="font-medium">{phone}</span></div>
                </div>
                {description && (
                  <div className="mt-2 pt-2 border-t border-neutral-200 text-sm">
                    <span className="text-neutral-500">{t("summaryProblem")}:</span>
                    <p className="font-medium mt-1 text-neutral-700">{description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Single checkbox for terms and privacy */}
            <div className="bg-[#072534]/5 p-4 rounded-lg border-2 border-[#072534]/10">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    console.log("[v0] Checkbox changed:", e.target.checked)
                    setTermsAccepted(e.target.checked)
                  }}
                  className="mt-1 w-5 h-5 rounded border-2 border-neutral-300 text-[#FFC300] focus:ring-[#FFC300] accent-[#FFC300]"
                  ref={refTerms}
                />
                <span className="text-sm text-neutral-700 group-hover:text-[#072534] transition-colors">
                  {t("acceptTermsAndPrivacy")}{" "}
                  <a href="/termini" target="_blank" className="underline font-semibold text-[#072534] hover:text-[#FFC300]">
                    {t("termsOfService")}
                  </a>{" "}
                  {t("and")}{" "}
                  <a href="/privacy" target="_blank" className="underline font-semibold text-[#072534] hover:text-[#FFC300]">
                    {t("privacyPolicy")}
                  </a>{" "}
                  *
                </span>
              </label>

              {errors.terms && (
                <p className="text-xs text-red-600 mt-2">{t("acceptPrivacyTerms")}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 border-2 border-neutral-200 hover:bg-neutral-50 font-semibold h-12 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> {t("back")}
              </Button>
              <Button
                onClick={(e) => {
                  console.log("[v0] Submit button clicked")
                  handleSubmit()
                }}
                disabled={submitting}
                className="flex-1 bg-[#FF8A00] text-white hover:bg-[#ff8A00]/90 font-semibold h-12"
              >
                {submitting ? (
                  t("submitting")
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> {t("sendRequest")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
