"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import GlobalAirportInput from "./global-airport-input"
import { Plane, ArrowRight, Shield } from "lucide-react"

export default function HomeStartForm() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  const ready = from.trim().length > 1 && to.trim().length > 1

  function goToRequest() {
    if (!from || !to) {
      if (!from && fromRef.current) fromRef.current.focus()
      else if (!to && toRef.current) toRef.current.focus()
      return
    }
    const params = new URLSearchParams({ from, to })
    router.push(`/richiesta?${params.toString()}`)
  }

  return (
    <div className="relative overflow-hidden rounded-[20px] bg-white p-5 md:p-7 shadow-[0_24px_60px_rgba(7,37,52,0.40)]">
      <Plane
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-28 w-28 text-[#072534] opacity-[0.06]"
      />

      <div className="relative">
        <div
          className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium text-[#B07D00]"
        >
          ★ calcolo gratuito · 2 minuti
        </div>

        <h2 className="mt-1.5 text-[24px] md:text-[28px] font-extrabold text-[#072534] leading-tight tracking-tight">
          Calcola il tuo rimborso
        </h2>
        <p className="mt-1 text-[13.5px] text-[rgba(15,42,60,0.6)]">
          Inserisci la tratta, ti diciamo subito se hai diritto.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GlobalAirportInput
            id="from"
            name="from"
            label="Aeroporto di partenza"
            value={from}
            onChange={setFrom}
            placeholder="es. Roma Fiumicino"
            required
            inputRef={fromRef}
          />
          <GlobalAirportInput
            id="to"
            name="to"
            label="Aeroporto di arrivo"
            value={to}
            onChange={setTo}
            placeholder="es. Milano Linate"
            required
            inputRef={toRef}
          />
        </div>

        <button
          onClick={goToRequest}
          disabled={!ready}
          style={{
            marginTop: 14,
            width: "100%",
            height: 54,
            border: "none",
            background: ready ? "#FF8A00" : "#F4D9BD",
            color: ready ? "#fff" : "rgba(125,72,18,0.55)",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: ready
              ? "0 8px 24px rgba(255,138,0,0.32)"
              : "0 1px 0 rgba(7,37,52,0.04)",
            cursor: ready ? "pointer" : "not-allowed",
            transition: "background 180ms ease, color 180ms ease, box-shadow 180ms ease",
          }}
        >
          Calcola il rimborso
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="mt-3 flex items-center gap-2 border-t border-dashed border-[rgba(15,42,60,0.12)] pt-3 text-[11.5px] text-[rgba(15,42,60,0.6)]">
          <Shield className="h-3.5 w-3.5 flex-shrink-0 text-[#FFC300]" />
          Dati protetti · solo per la tua pratica · GDPR
        </div>
      </div>
    </div>
  )
}
