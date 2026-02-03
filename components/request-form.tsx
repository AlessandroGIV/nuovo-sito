"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { Send, CheckCircle, Pencil } from "lucide-react"
import GlobalAirlineInput from "./global-airline-input"
import GlobalAirportInput from "./global-airport-input"
import { TimeInputResponsive } from "./time-input-responsive"
import emailjs from '@emailjs/browser'

type Leg = { date: string; airline: string; schedDep: string }
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

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)
  }, [])

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
    setCurrentStep(1)
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
  }

  function goToStep(step: number) {
    setCurrentStep(step)
    setErrors({})
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
  }

  function nextStep() {
    const { ok, errs } = validateCurrentStep()
    setErrors(errs)
    if (!ok) {
      scrollToFirstError(errs)
      toast({
        title: "Compila i campi obbligatori",
        description: "Alcuni campi sono mancanti o non validi.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep(currentStep + 1)
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
  }

  function prevStep() {
    setCurrentStep(currentStep - 1)
    setErrors({})
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
  }

  function validateCurrentStep(): { ok: boolean; errs: Errors } {
    const errs: Errors = {}
    
    if (currentStep === 1) {
      if (!from) errs.from = "Campo obbligatorio"
      if (!to) errs.to = "Campo obbligatorio"
      if (direct === "no" && !via) errs.via = "Campo obbligatorio"
    } else if (currentStep === 2) {
      if (!leg1.date) errs.leg1Date = "Campo obbligatorio"
      if (!leg1.airline) errs.leg1Airline = "Campo obbligatorio"
      if (!leg1.schedDep || !isValidTime(leg1.schedDep)) errs.leg1Time = "Inserisci un orario valido"
      if (direct === "no") {
        if (!leg2.date) errs.leg2Date = "Campo obbligatorio"
        if (!leg2.airline) errs.leg2Airline = "Campo obbligatorio"
        if (!leg2.schedDep || !isValidTime(leg2.schedDep)) errs.leg2Time = "Inserisci un orario valido"
      }
    } else if (currentStep === 3) {
      if (!name) errs.name = "Campo obbligatorio"
      if (!email) errs.email = "Campo obbligatorio"
      if (!phone || !isValidPhone10(phone)) errs.phone = "Inserisci un numero di 10 cifre"
      if (!description) errs.description = "Campo obbligatorio"
    }
    
    return { ok: Object.keys(errs).length === 0, errs }
  }

  function isValidTime(v: string) {
    return /^\d{2}:\d{2}$/.test(v)
  }
  function isValidPhone10(v: string) {
    const digits = v.replace(/\D/g, "")
    return digits.length === 10
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return

    // Check terms acceptance on step 4
    const fd = new FormData(e.currentTarget)
    const priv = fd.get("privacy")
    if (!priv) {
      setErrors({ privacy: "Obbligatorio" })
      scrollToFirstError({ privacy: "Obbligatorio" })
      toast({
        title: "Consenso obbligatorio",
        description: "Devi accettare i termini e la privacy policy per inviare la richiesta.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      // Complete email template parameters with all required fields
     const templateParams = {
      // Trip details
      is_direct: direct === "si" ? "true" : "false",
      is_direct_label: direct === "si" ? "Volo Diretto" : "Volo con Scalo",
      departure_airport: from,
      arrival_airport: to,
      
      // First/only flight segment
      segment1_date: leg1.date,
      segment1_time: leg1.schedDep,
      segment1_airline: leg1.airline,
      
      // Second segment (only if not direct)
      segment2_date: direct === "si" ? "" : leg2.date,
      segment2_time: direct === "si" ? "" : leg2.schedDep,
      segment2_airline: direct === "si" ? "" : leg2.airline,
      
      // Contact & case info
      full_name: name,
      email: email,
      phone: phone,
      description: description,
      
      // Layover info - properly cleaned
      via_airport: direct === "no" && via ? via : "Nessuno",
      
      // Legacy fields for compatibility
      flight_number: leg1.airline ? `${leg1.airline} - ${leg1.date}` : "Non specificato",
      flight_date: leg1.date || "Non specificato",
      
      // Additional context
      submission_date: new Date().toLocaleString('it-IT'),
}


      console.log('Sending email with data:', templateParams) // Debug log

      // Send email via EmailJS
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams
      )

      if (result.status === 200) {
        setSubmitted(true)
        try {
          window.scrollTo({ top: 0, behavior: "smooth" })
        } catch {}
        toast({ title: "Richiesta inviata", description: "Ti ricontatteremo entro 24 ore." })
        return
      } else {
        throw new Error('EmailJS failed')
      }

    } catch (error) {
      console.error('EmailJS error:', error)
      toast({ title: "Errore di rete", description: "Controlla la connessione e riprova.", variant: "destructive" })
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
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300]">Richiesta Inviata!</h2>
        <p className="mt-2 text-white/85">
          Grazie per averci contattato. Un nostro avvocato ti risponderà al più presto per valutare il tuo caso.
        </p>
        <button
          type="button"
          onClick={resetAll}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-[#FFC300] px-5 py-2.5 font-semibold text-[#072534] hover:bg-[#FFB800]"
        >
          Invia un'altra richiesta
        </button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      {/* Itinerario */}
      {currentStep < 4 && (
        <Card className="bg-white text-[#072534] border-0 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-xl font-extrabold">Itinerario</h2>
          <div className={`mt-3 grid gap-4 ${direct === "no" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {/* Partenza */}
            <GlobalAirportInput
              id="from"
              name="from"
              label="Aeroporto di partenza"
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
                id="layover-airport"
                name="layover-airport"
                label="Aeroporto di scalo"
                value={via}
                onChange={setVia}
                placeholder="Es. Amsterdam Schiphol - (AMS)"
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
              label="Aeroporto di destinazione"
              value={to}
              onChange={setTo}
              placeholder="Milano Linate - (LIN)"
              required
              inputRef={refs.to}
              error={errors.to}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 font-semibold">Il tuo volo era diretto?</p>
            <RadioGroup defaultValue="si" onValueChange={(v) => setDirect(v as "si" | "no")} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id="diretto-si" />
                <Label htmlFor="diretto-si">Sì</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="diretto-no" />
                <Label htmlFor="diretto-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Dettagli volo/i */}
      <Card className="bg-white text-[#072534] border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-xl font-extrabold">Dettagli volo{direct === "no" ? " (Volo 1)" : ""}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">Data del volo</label>
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
              label="Compagnia aerea"
              value={leg1.airline}
              onChange={(v) => setLeg1({ ...leg1, airline: v })}
              required
              inputRef={refs.leg1Airline}
              error={errors.leg1Airline}
            />
            <TimeInputResponsive
              id="leg1-time"
              name="leg1-time"
              label="Orario di partenza previsto"
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
              <h2 className="text-xl font-extrabold">Dettagli volo (Volo 2)</h2>
              <div className="mt-3 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#072534]">Data del volo</label>
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
                  label="Compagnia aerea"
                  value={leg2.airline}
                  onChange={(v) => setLeg2({ ...leg2, airline: v })}
                  required
                  inputRef={refs.leg2Airline}
                  error={errors.leg2Airline}
                />
                <TimeInputResponsive
                  id="leg2-time"
                  name="leg2-time"
                  label="Orario di partenza previsto"
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
          <h2 className="text-xl font-extrabold">Dati personali</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">Nome e Cognome</label>
              <Input
                ref={refs.name}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Il tuo nome completo"
                className={errCls("name")}
              />
              {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">Email</label>
              <Input
                ref={refs.email}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                className={errCls("email")}
              />
              {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#072534]">Telefono</label>
              <Input
                ref={refs.phone}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Il tuo numero di telefono"
                className={errCls("phone")}
              />
              {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-[#072534]">Breve descrizione del problema</label>
              <Textarea
                ref={refs.description}
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Es. ritardo di 4 ore sul primo volo, perdita connessione..."
                className={errCls("description")}
              />
              {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
            </div>
          </div>

          <Button
            type="button"
            onClick={nextStep}
            className="mt-5 w-full bg-[#FF8A00] text-white hover:bg-[#ff8a00]/90 font-semibold"
          >
            Rivedi e Invia
          </Button>
        </CardContent>
      </Card>
      )}

      {/* Step 4: Riepilogo e Conferma */}
      {currentStep === 4 && (
        <>
          <Card className="bg-white text-[#072534] border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-2xl font-extrabold mb-6">Riepilogo e Conferma</h2>

              {/* Itinerario Summary */}
              <div className="mb-6 rounded-lg bg-[#072534]/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Itinerario</h3>
                  <Button
                    type="button"
                    onClick={() => goToStep(1)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Modifica
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Partenza:</span>
                    <span>{from || "Non specificato"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Destinazione:</span>
                    <span>{to || "Non specificato"}</span>
                  </div>
                  {direct === "no" && via && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Scalo:</span>
                      <span>{via}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-semibold">Tipo volo:</span>
                    <span>{direct === "si" ? "Diretto" : "Con scalo"}</span>
                  </div>
                </div>
              </div>

              {/* Dettagli Volo Summary */}
              <div className="mb-6 rounded-lg bg-[#072534]/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Dettagli Volo</h3>
                  <Button
                    type="button"
                    onClick={() => goToStep(2)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Modifica
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-1">Volo {direct === "no" ? "1" : ""}</p>
                    <div className="space-y-1 text-sm pl-3">
                      <div className="flex justify-between">
                        <span className="text-[#072534]/70">Data:</span>
                        <span>{leg1.date || "Non specificato"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#072534]/70">Compagnia:</span>
                        <span>{leg1.airline || "Non specificato"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#072534]/70">Orario partenza:</span>
                        <span>{leg1.schedDep}</span>
                      </div>
                    </div>
                  </div>
                  {direct === "no" && (
                    <div>
                      <p className="font-semibold text-sm mb-1">Volo 2</p>
                      <div className="space-y-1 text-sm pl-3">
                        <div className="flex justify-between">
                          <span className="text-[#072534]/70">Data:</span>
                          <span>{leg2.date || "Non specificato"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#072534]/70">Compagnia:</span>
                          <span>{leg2.airline || "Non specificato"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#072534]/70">Orario partenza:</span>
                          <span>{leg2.schedDep}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dati Personali Summary */}
              <div className="mb-6 rounded-lg bg-[#072534]/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Dati Personali</h3>
                  <Button
                    type="button"
                    onClick={() => goToStep(3)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Modifica
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Nome:</span>
                    <span>{name || "Non specificato"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span>{email || "Non specificato"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Telefono:</span>
                    <span>{phone || "Non specificato"}</span>
                  </div>
                  {description && (
                    <div>
                      <p className="font-semibold mb-1">Descrizione:</p>
                      <p className="text-[#072534]/70 text-xs whitespace-pre-wrap">{description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and Privacy - Less prominent */}
              <div className="mt-8 space-y-3 border-t border-[#072534]/10 pt-6 text-sm">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input ref={refs.privacy} name="privacy" type="checkbox" className="mt-1" />
                  <span className="text-[#072534]/80">
                    Ho preso visione e accetto i{" "}
                    <a href="/termini" target="_blank" className="underline text-[#072534] hover:text-[#FF8A00]">
                      Termini e condizioni
                    </a>{" "}
                    e la{" "}
                    <a href="/privacy" target="_blank" className="underline text-[#072534] hover:text-[#FF8A00]">
                      Privacy Policy
                    </a>
                    {" "}*
                  </span>
                </label>
                {(errors.privacy || errors.terms) && (
                  <p className="text-xs text-red-600">Devi accettare i termini e la privacy policy per continuare</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between gap-3">
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Indietro
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#FF8A00] text-white hover:bg-[#ff8a00]/90 font-semibold"
            >
              <Send className="mr-2 h-4 w-4" />
              {submitting ? "Invio in corso..." : "Invia richiesta"}
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
