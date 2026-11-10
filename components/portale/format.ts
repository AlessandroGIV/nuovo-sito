// Formattazione di date e importi per il portale.

const dateFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Rome' })
const dateTimeFmt = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Rome',
})
const moneyFmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const monthFmt = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'Europe/Rome' })

/** Accetta una data ISO (2026-11-10) o un timestamp. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value.length === 10 ? `${value}T12:00:00Z` : value)
  return Number.isNaN(d.getTime()) ? '' : dateFmt.format(d)
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : dateTimeFmt.format(d)
}

export function formatMoney(value: number | null | undefined): string {
  return value === null || value === undefined ? '' : moneyFmt.format(Number(value))
}

export function formatMonth(value: string): string {
  const d = new Date(value.length === 7 ? `${value}-15T12:00:00Z` : value)
  return Number.isNaN(d.getTime()) ? value : monthFmt.format(d)
}

export function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`
  return `${(n / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}
