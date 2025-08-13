"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TimeInput } from "./time-input"

type Props = {
  id: string
  name: string
  label: string
  value: string // "HH:MM"
  onChange: (v: string) => void
  required?: boolean
  error?: string
  inputRef?: React.RefObject<any>
  className?: string
}

// Normalize "HH:MM" from native time inputs
function normalizeTime(v: string) {
  if (!v) return "00:00"
  // Some browsers can emit "HH:MM[:SS]". Keep HH:MM
  const m = v.match(/^(\d{2}):(\d{2})/)
  if (m) return `${m[1]}:${m[2]}`
  return "00:00"
}

export function TimeInputResponsive({ id, name, label, value, onChange, required, error, inputRef, className }: Props) {
  return (
    <div className={cn(className)}>
      {/* Mobile: native time input */}
      <div className="block md:hidden">
        <label htmlFor={`${id}-mobile`} className="mb-1 block text-sm font-semibold text-[#072534]">
          {label}
        </label>
        <Input
          ref={inputRef as any}
          id={`${id}-mobile`}
          name={name}
          type="time"
          step={60}
          value={value}
          required={required}
          onChange={(e) => onChange(normalizeTime(e.target.value))}
          className={error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        ) : null}
      </div>

      {/* Desktop: existing dual-select */}
      <div className="hidden md:block">
        <TimeInput
          id={id}
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          required={required}
          error={error}
          inputRef={inputRef as any}
        />
      </div>
    </div>
  )
}
