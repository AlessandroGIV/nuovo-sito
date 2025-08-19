"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Airport = { iata?: string; icao?: string; name?: string; city?: string; country?: string }

type Props = {
  id: string
  name: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  inputRef?: React.RefObject<HTMLInputElement | null>
  error?: string
  disableBrowserAutocomplete?: boolean
}

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function highlight(text: string, query: string) {
  if (!query) return text
  const re = new RegExp(`(${escapeRegExp(query)})`, "ig")
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-transparent text-[#072534] underline decoration-[#072534] decoration-2">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

// Check if the value looks like a selected airport (contains IATA code in parentheses)
function isSelectedAirport(value: string): boolean {
  return /\([A-Z]{3}\)/.test(value)
}

// Generate a random name to confuse browsers
function generateRandomName(): string {
  return `airport_field_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
}

export default function GlobalAirportInput({
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
  disableBrowserAutocomplete = false,
}: Props) {
  const [q, setQ] = useState(value)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Airport[]>([])
  const [active, setActive] = useState(-1)
  const [randomName] = useState(() => generateRandomName())
  const [randomId] = useState(() => `input_${Math.random().toString(36).substring(2, 8)}`)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const localInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<number | null>(null)

  // sync external value to local
  useEffect(() => setQ(value), [value])

  // forward ref out
  useEffect(() => {
    if (inputRef && localInputRef.current) {
      // @ts-expect-error - This is fine, we're forwarding the ref
      inputRef.current = localInputRef.current
    }
  }, [inputRef])

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  // fetch with debounce 200ms, min 2 chars
  useEffect(() => {
    const v = q.trim()

    // Don't search if it looks like an already selected airport
    if (isSelectedAirport(v)) {
      setItems([])
      setActive(-1)
      setOpen(false)
      return
    }

    if (v.length < 2) {
      setItems([])
      setActive(-1)
      setOpen(false)
      return
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/airports?q=${encodeURIComponent(v)}`)
        const data = ((await res.json()) as Airport[]) || []
        // keep at most 10 in UI
        setItems(data.slice(0, 10))
        setOpen(data.length > 0)
        setActive(data.length > 0 ? 0 : -1)
      } catch {
        setItems([])
        setOpen(false)
        setActive(-1)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [q])

  // ensure active item in view
  useEffect(() => {
    if (!listRef.current || active < 0) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [active])

  // Don't show dropdown if it looks like an airport is already selected
  const show = open && !isSelectedAirport(q) && items.length > 0

  function select(a: Airport) {
    const IATA = (a.iata || "").toUpperCase()
    const city = a.city?.trim() || ""
    const nameStr = a.name?.trim() || ""
    const labelText = [city, nameStr].filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
    const text = `${labelText}${IATA ? ` - (${IATA})` : ""}`.trim()
    setQ(text)
    onChange(text)
    setOpen(false)
    setItems([])
    setActive(-1)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!show) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => (items.length ? Math.min(items.length - 1, (i < 0 ? -1 : i) + 1) : -1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => (items.length ? Math.max(0, (i < 0 ? items.length : i) - 1) : -1))
    } else if (e.key === "Enter") {
      if (active >= 0 && items[active]) {
        e.preventDefault()
        select(items[active]!)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  const qLower = normalize(q)
  const rendered = useMemo(() => {
    return items.map((a) => {
      const IATA = (a.iata || "").toUpperCase()
      const line1 = `${a.name ?? ""}${IATA ? ` (${IATA})` : ""}`.trim()
      const line2 = [a.city, a.country].filter(Boolean).join(", ")
      return { a, line1, line2 }
    })
  }, [items])

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <label htmlFor={disableBrowserAutocomplete ? randomId : id} className="mb-1 block text-sm font-semibold text-[#072534]">
        {label}
      </label>

      {/* Multiple decoy inputs to confuse autofill when anti-autofill is active */}
      {disableBrowserAutocomplete && (
        <>
          {/* Invisible decoy fields */}
          <div style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", opacity: 0 }}>
            <input type="text" name="username" autoComplete="username" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="email" autoComplete="email" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="name" autoComplete="name" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="address-line1" autoComplete="address-line1" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="address-line2" autoComplete="address-line2" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="street-address" autoComplete="street-address" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="city" autoComplete="address-level2" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="state" autoComplete="address-level1" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="zip" autoComplete="postal-code" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="country" autoComplete="country" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="phone" autoComplete="tel" tabIndex={-1} aria-hidden="true" />
            <input type="text" name="organization" autoComplete="organization" tabIndex={-1} aria-hidden="true" />
          </div>
          
          {/* Visible decoy field that confuses autofill */}
          <input
            type="text"
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
            name="fake-address"
            autoComplete="street-address"
            tabIndex={-1}
            aria-hidden="true"
          />
        </>
      )}

      {/* Main input */}
      <Input
        ref={localInputRef}
        id={disableBrowserAutocomplete ? randomId : id}
        name={disableBrowserAutocomplete ? randomName : name}
        value={q}
        required={required}
        onChange={(e) => {
          const v = e.target.value
          setQ(v)
          onChange(v)
        }}
        onFocus={() => {
          if (!isSelectedAirport(q) && q.trim().length >= 2 && items.length > 0) {
            setOpen(true)
          }
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? "Es. Roma Fiumicino - (FCO)"}
        // Enhanced anti-autofill attributes
        autoComplete={disableBrowserAutocomplete ? "new-password" : "off"}
        data-form-type={disableBrowserAutocomplete ? "search" : undefined}
        data-lpignore={disableBrowserAutocomplete ? "true" : undefined}
        data-1p-ignore={disableBrowserAutocomplete ? "true" : undefined}
        data-bwignore={disableBrowserAutocomplete ? "true" : undefined}
        data-dashlane-rid={disableBrowserAutocomplete ? Math.random().toString() : undefined}
        data-lastpass-ignore={disableBrowserAutocomplete ? "true" : undefined}
        spellCheck={disableBrowserAutocomplete ? false : undefined}
        // Additional attributes for maximum protection
        {...(disableBrowserAutocomplete && {
          "data-no-autofill": "true",
          "data-disable-autofill": "true",
          "data-airport-search": "true",
          autoCapitalize: "off",
          autoCorrect: "off",
          role: "combobox",
        })}
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls={`${randomId}-listbox`}
        className={cn(error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : undefined)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${randomId}-error` : undefined}
      />

      {/* Hidden input for form submission with original name */}
      {disableBrowserAutocomplete && <input type="hidden" name={name} value={q} />}

      {error ? (
        <p id={`${randomId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}

      {show && (
        <div
          ref={listRef}
          id={`${randomId}-listbox`}
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 w-full overflow-y-auto rounded-md border border-[#072534]/15 bg-white shadow-lg",
            "max-h-40",
          )}
        >
          {loading && <div className="px-3 py-2 text-sm text-[#072534]/60">Caricamento aeroporti…</div>}
          {!loading &&
            rendered.map(({ a, line1, line2 }, i) => {
              const isActive = i === active
              return (
                <button
                  type="button"
                  key={`${a.iata ?? a.name ?? i}-${i}`}
                  role="option"
                  aria-selected={isActive}
                  data-index={i}
                  className={cn(
                    "block w-full px-3 py-2 text-left",
                    "hover:bg-[#072534]/5",
                    isActive ? "bg-[#072534]/10" : "",
                  )}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(a)}
                >
                  <div className="text-sm text-[#072534] font-medium">{highlight(line1, qLower)}</div>
                  <div className="text-xs text-[#072534]/70">{highlight(line2 || "", qLower)}</div>
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
