"use client"

import { IT_AIRPORTS } from "@/lib/airports"
import { Input } from "@/components/ui/input"

type Props = {
  id: string
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

// Note: kept for potential reuse, but removed the helper text line as requested.
export function AirportInput({ id, label, name, value, onChange, placeholder, className }: Props) {
  const listId = `${id}-list`

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[#072534]">
        {label}
      </label>
      <Input
        id={id}
        name={name}
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Scrivi città, aeroporto o codice IATA"}
        autoComplete="off"
      />
      <datalist id={listId}>
        {IT_AIRPORTS.map((a) => (
          <option key={a.code} value={`${a.city} (${a.code}) - ${a.name}`} />
        ))}
      </datalist>
    </div>
  )
}
