"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle } from "lucide-react"
import emailjs from '@emailjs/browser'

type State = { ok: boolean; message: string }
type ContactFormProps = { variant?: "light" | "dark" }

export default function ContactForm({ variant = "light" }: ContactFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<State | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isDark = variant === "dark"
  const labelClass = isDark ? "text-white" : "text-[#072534]"
  const helperTextClass = isDark ? "text-white/70" : "text-neutral-600"
  const inputClass = isDark ? "bg-[#243947] border-white/10 text-white placeholder:text-white/60" : ""

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)
  }, [])

  function validPhone10(v: string | FormDataEntryValue | null) {
    const s = (typeof v === "string" ? v : "") ?? ""
    const digits = s.replace(/\D/g, "")
    return digits.length === 10
  }

  function resetContactForm() {
    const form = document.getElementById("contact-form") as HTMLFormElement | null
    form?.reset()
    setSubmitted(false)
    try {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {}
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    if (
      !payload.name ||
      !payload.email ||
      !payload.flightNumber ||
      !payload.date ||
      !payload.phone ||
      !payload.privacy ||
      !payload.terms
    ) {
      toast({
        title: "Compila i campi obbligatori",
        description: "Nome, Email, Numero volo, Data, Telefono, Privacy e Termini sono richiesti.",
        variant: "destructive",
      })
      return
    }
    if (!validPhone10(payload.phone)) {
      toast({
        title: "Numero non valido",
        description: "Inserisci un numero di telefono di 10 cifre.",
        variant: "destructive",
      })
      return
    }

    // honeypot check
    if (payload.company) {
      setSubmitted(true)
      toast({ title: "Richiesta inviata", description: "Ti ricontatteremo entro 24 ore." })
      return
    }

    setLoading(true)
    setState(null)
    
    try {
      // Prepare email template parameters to match your HTML template
      const templateParams = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        flight_number: payload.flightNumber,
        flight_date: payload.date,
        message: payload.description || 'Nessuna descrizione fornita'
      }

      // Send email via EmailJS
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams
      )

      if (result.status === 200) {
        setState({ ok: true, message: "Email inviata con successo!" })
        setSubmitted(true)
        toast({ title: "Richiesta inviata", description: "Ti ricontatteremo entro 24 ore." })
        try {
          window.scrollTo({ top: 0, behavior: "smooth" })
        } catch {}
        form.reset()
      } else {
        throw new Error('EmailJS failed')
      }

    } catch (error) {
      console.error('EmailJS error:', error)
      setState({ ok: false, message: "Errore durante l'invio email. Riprova più tardi." })
      toast({
        title: "Invio non riuscito",
        description: "Errore durante l'invio. Riprova più tardi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        className={`rounded-2xl p-8 text-center ${isDark ? "bg-white/10 text-white" : "bg-[#072534]/5 text-[#072534]"}`}
      >
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-green-500/20">
          <CheckCircle className="h-7 w-7 text-green-500" />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#FFC300]">Richiesta Inviata!</h3>
        <p className={`${isDark ? "text-white/85" : "text-[#072534]/80"} mt-2`}>
          Grazie per averci contattato. Un nostro avvocato ti risponderà al più presto per valutare il tuo caso.
        </p>
        <button
          type="button"
          onClick={resetContactForm}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-[#FFC300] px-5 py-2.5 font-semibold text-[#072534] hover:bg-[#FFB800]"
        >
          Invia un'altra richiesta
        </button>
      </div>
    )
  }

  return (
    <form id="contact-form" onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={`mb-1 block text-sm font-semibold ${labelClass}`}>
            Nome e Cognome *
          </label>
          <Input id="name" name="name" placeholder="Inserisci il tuo nome completo" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={`mb-1 block text-sm font-semibold ${labelClass}`}>
            Email *
          </label>
          <Input id="email" name="email" type="email" placeholder="La tua email" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="flightNumber" className={`mb-1 block text-sm font-semibold ${labelClass}`}>
            Numero di Volo *
          </label>
          <Input id="flightNumber" name="flightNumber" placeholder="Es. AZ1234" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="date" className={`mb-1 block text-sm font-semibold ${labelClass}`}>
            Data del Volo *
          </label>
          <Input id="date" name="date" type="date" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={`mb-1 block text-sm font-semibold ${labelClass}`}>
          Descrizione del Problema *
        </label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Descrivi brevemente cosa è successo (ritardo, cancellazione, ecc.)"
          required
          className={isDark ? "bg-[#243947] border-white/10 text-white placeholder:text-white/60" : ""}
        />
      </div>

      <div>
        <label htmlFor="phone" className={`${"mb-1 block text-sm font-semibold"} ${labelClass}`}>
          Telefono *
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          placeholder="Il tuo numero di telefono"
          required
          className={inputClass}
        />
      </div>

      <div className={`space-y-2 text-sm ${helperTextClass}`}>
        <label className="flex items-start gap-2">
          <input id="privacy" name="privacy" type="checkbox" className="mt-1" required />
          <span>
            Acconsento al trattamento dei miei dati personali come descritto nella{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>{" "}
            *
          </span>
        </label>

        <label className="flex items-start gap-2">
          <input id="terms" name="terms" type="checkbox" className="mt-1" required />
          <span>
            Dichiaro di aver preso visione e accettato i termini e condizioni del servizio —{" "}
            <a href="/termini" className="underline">
              Termini e condizioni
            </a>{" "}
            *
          </span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF8A00] text-white hover:bg-[#ff8A00]/90 font-semibold"
      >
        <Send className="mr-2 h-4 w-4" />
        {loading ? "Invio in corso..." : "INVIA RICHIESTA!"}
      </Button>

      {state && (
        <p
          className={`text-sm ${state.ok ? (isDark ? "text-green-400" : "text-green-700") : isDark ? "text-red-300" : "text-red-700"}`}
          aria-live="polite"
        >
          {state.message}
        </p>
      )}

      <div className={`text-center text-sm ${helperTextClass}`}>
        In alternativa, puoi scriverci direttamente a{" "}
        <a
          className={isDark ? "font-semibold text-[#FFC300]" : "font-semibold text-[#072534]"}
          href="mailto:info@giustiziainvolo.it"
        >
          info@giustiziainvolo.it
        </a>
        .
      </div>
    </form>
  )
}