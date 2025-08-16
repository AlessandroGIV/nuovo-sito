"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import GlobalAirportInput from "./global-airport-input"
import { Plane } from "lucide-react"

export default function HomeStartForm() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

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
    <Card className="border-0 shadow-2xl relative z-30">
      <CardContent className="relative p-6 md:p-8 overflow-visible">
        <Plane
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 h-28 w-28 md:h-36 md:w-36 text-[#072534] opacity-10"
        />
        <div className="relative">
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#072534]">Calcola la possibilità di rimborso</h2>
            <p className="text-sm text-neutral-600">Inserisci gli aeroporti e vai avanti</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GlobalAirportInput
              id="from"
              name="from"
              label="Aeroporto di partenza"
              value={from}
              onChange={setFrom}
              placeholder="Roma Fiumicino - (FCO)"
              required
              inputRef={fromRef}
            />
            <GlobalAirportInput
              id="to"
              name="to"
              label="Aeroporto di destinazione"
              value={to}
              onChange={setTo}
              placeholder="Milano Linate - (LIN)"
              required
              inputRef={toRef}
            />
          </div>

          <Button
            onClick={goToRequest}
            disabled={!from || !to}
            className="mt-5 w-full bg-[#FF8A00] text-white hover:bg-[#ff8a00]/90 font-semibold"
            aria-label="Calcola la possibilità di rimborso"
          >
            Calcola la possibilità di rimborso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
