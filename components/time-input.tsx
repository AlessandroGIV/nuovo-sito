"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  id: string
  name: string
  label: string
  value: string // expected "HH:MM" or ""
  onChange: (v: string) => void
  required?: boolean
  error?: string
  inputRef?: React.RefObject<HTMLSelectElement | null> // Fixed type
  className?: string
}

function clampTime(hh: number, mm: number) {
  const H = Math.min(23, Math.max(0, hh))
  const M = Math.min(59, Math.max(0, mm))
  return { H, M }
}

export function TimeInput({ id, name, label, value, onChange, required, error, inputRef, className }: Props) {
  // parse incoming value; default to 00:00 to always be valid even if unchanged
  const parsed = useMemo(() => {
    const m = value?.match?.(/^(\d{2}):(\d{2})$/)
    const hh = m ? Number.parseInt(m[1]!, 10) : 0
    const mm = m ? Number.parseInt(m[2]!, 10) : 0
    const { H, M } = clampTime(isNaN(hh) ? 0 : hh, isNaN(mm) ? 0 : mm)
    return { hh: String(H).padStart(2, "0"), mm: String(M).padStart(2, "0") }
  }, [value])

  const [hour, setHour] = useState(parsed.hh)
  const [minute, setMinute] = useState(parsed.mm)
  const hourRef = useRef<HTMLSelectElement>(null)

  // expose ref for scroll/focus
  useEffect(() => {
    if (inputRef && hourRef.current) {
      // @ts-expect-error - This is fine, we're forwarding the ref
      inputRef.current = hourRef.current
    }
  }, [inputRef])

  // keep local in sync if parent changes value
  useEffect(() => {
    setHour(parsed.hh)
    setMinute(parsed.mm)
  }, [parsed.hh, parsed.mm])

  // propagate combined HH:MM upstream
  useEffect(() => {
    onChange(`${hour}:${minute}`)
  }, [hour, minute]) // eslint-disable-line react-hooks/exhaustive-deps

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[#072534]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <select
          ref={hourRef}
          id={id}
          aria-label="Ore"
          className={cn(
            "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm",
            error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : "",
          )}
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          required={required}
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="text-[#072534] font-semibold">:</span>
        <select
          aria-label="Minuti"
          className={cn(
            "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm",
            error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : "",
          )}
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          required={required}
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {/* Hidden input to keep HTML forms semantics if ever needed */}
        <input type="hidden" name={name} value={`${hour}:${minute}`} />
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  )
}