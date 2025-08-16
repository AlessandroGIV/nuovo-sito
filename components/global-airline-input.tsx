"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AIRLINES_MANUAL } from "@/lib/airlines-manual"

type Props = {
  id: string
  name: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  inputRef?: React.RefObject<HTMLInputElement | null> // Fixed type
  error?: string
}

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

export default function GlobalAirlineInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  className,
  required,
  inputRef,
  error,
}: Props) {
  const [q, setQ] = useState(value)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const localInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setQ(value), [value])

  useEffect(() => {
    if (inputRef && localInputRef.current) {
      // @ts-expect-error - This is fine, we're forwarding the ref
      inputRef.current = localInputRef.current
    }
  }, [inputRef])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const results = useMemo(() => {
    const n = normalize(q)
    if (n.length < 1) return []
    const filtered = AIRLINES_MANUAL.filter((name) => normalize(name).startsWith(n))
    return filtered.slice(0, 60)
  }, [q])

  const show = open && q.trim().length >= 1

  function select(nameStr: string) {
    setQ(nameStr)
    onChange(nameStr)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[#072534]">
        {label}
      </label>
      <Input
        ref={localInputRef}
        id={id}
        name={name}
        value={q}
        required={required}
        onChange={(e) => {
          const v = e.target.value
          setQ(v)
          onChange(v) // libero inserimento sempre possibile
          if (v.trim().length >= 1) setOpen(true)
          else setOpen(false)
        }}
        onFocus={() => {
          if (q.trim().length >= 1) setOpen(true)
        }}
        placeholder={placeholder ?? "Es. ITA Airways"}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls={`${id}-listbox`}
        className={error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}

      {show && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border border-[#072534]/15 bg-white p-1 shadow-lg"
        >
          {results.length > 0 ? (
            results.map((nameStr, i) => (
              <button
                type="button"
                key={`${nameStr}-${i}`}
                role="option"
                className="w-full rounded px-2 py-2 text-left text-sm text-[#072534] hover:bg-[#072534]/5"
                onClick={() => select(nameStr)}
              >
                <span className="font-medium">{nameStr}</span>
              </button>
            ))
          ) : (
            <div className="px-2 py-2 text-sm text-[#072534]/60">Nessun risultato</div>
          )}
        </div>
      )}
    </div>
  )
}