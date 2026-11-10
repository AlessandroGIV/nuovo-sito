// Stato di una pratica: etichetta e rotta. Componenti senza stato, usabili ovunque.

import { Plane } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTE_STOPS, STATUS_LABEL, STATUS_STOP, type CaseStatus } from '@/lib/portale/constants'

type Tone = 'open' | 'action' | 'won' | 'closed'

function tone(status: CaseStatus): Tone {
  if (status === 'risarcimento_ottenuto') return 'won'
  if (status === 'documenti_richiesti') return 'action'
  if (status === 'non_procedibile' || status === 'esito_negativo') return 'closed'
  return 'open'
}

const TONE_CLS: Record<Tone, string> = {
  open: 'bg-[#072534]/[0.06] text-[#072534]',
  action: 'bg-[#FFF5CC] text-[#7A4A12]',
  won: 'bg-emerald-50 text-emerald-800',
  closed: 'bg-[#EEF2F6] text-[#5A7088]',
}

const DOT_CLS: Record<Tone, string> = {
  open: 'bg-[#072534]',
  action: 'bg-[#E0A100]',
  won: 'bg-emerald-600',
  closed: 'bg-[#9AA9B8]',
}

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  const t = tone(status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12.5px] font-semibold',
        TONE_CLS[t],
        className,
      )}
    >
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', DOT_CLS[t])} />
      {STATUS_LABEL[status]}
    </span>
  )
}

/**
 * La rotta della pratica, dalla segnalazione al risarcimento.
 * Il tratto percorso è pieno, quello ancora da fare è tratteggiato come la
 * rotta disegnata nelle pagine del sito. L'aereo segna la tappa attuale.
 */
export function RouteTrack({
  status,
  onDark = false,
  className,
}: {
  status: CaseStatus
  onDark?: boolean
  className?: string
}) {
  const current = STATUS_STOP[status]
  const interrupted = current === -1
  const ink = onDark ? '#FFC300' : '#072534'
  const faint = onDark ? 'rgba(255,255,255,0.28)' : 'rgba(7,37,52,0.22)'
  const label = interrupted
    ? `Pratica chiusa: ${STATUS_LABEL[status]}`
    : `Tappa ${current + 1} di ${ROUTE_STOPS.length}: ${ROUTE_STOPS[current].label}`

  return (
    <div className={className}>
      <ol
        role="img"
        aria-label={label}
        className="grid"
        style={{ gridTemplateColumns: `repeat(${ROUTE_STOPS.length}, minmax(0, 1fr))` }}
      >
        {ROUTE_STOPS.map((stop, i) => {
          const reached = !interrupted && i <= current
          const isCurrent = !interrupted && i === current
          return (
            <li key={stop.key} aria-hidden="true" className="relative flex flex-col items-center">
              {i > 0 ? (
                <span
                  className="absolute right-1/2 top-[13px] w-full -translate-y-1/2"
                  style={
                    reached
                      ? { height: 2, background: ink }
                      : { height: 0, borderTop: `2px dashed ${faint}` }
                  }
                />
              ) : null}
              <span
                className="relative z-[1] flex h-[26px] w-[26px] items-center justify-center rounded-full"
                style={
                  isCurrent
                    ? { background: '#FFC300', boxShadow: `0 0 0 4px ${onDark ? 'rgba(255,195,0,0.22)' : 'rgba(255,195,0,0.3)'}` }
                    : undefined
                }
              >
                {isCurrent ? (
                  <Plane className="h-3.5 w-3.5 rotate-45 text-[#072534]" strokeWidth={2.5} />
                ) : (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={
                      reached
                        ? { background: ink }
                        : { background: onDark ? '#0E2032' : '#FFFFFF', boxShadow: `inset 0 0 0 2px ${faint}` }
                    }
                  />
                )}
              </span>
              <span
                className={cn(
                  'mt-2 px-1 text-center text-[11.5px] leading-tight sm:text-[12.5px]',
                  isCurrent ? 'font-bold' : 'font-medium',
                  !isCurrent && 'hidden sm:block',
                )}
                style={{ color: reached ? (onDark ? '#FFFFFF' : '#072534') : onDark ? 'rgba(255,255,255,0.5)' : '#7C8DA0' }}
              >
                {stop.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Versione stretta per le righe di un elenco: solo la linea e i punti. */
export function RouteMini({ status }: { status: CaseStatus }) {
  const current = STATUS_STOP[status]
  const interrupted = current === -1
  return (
    <span aria-hidden="true" className="inline-flex items-center">
      {ROUTE_STOPS.map((stop, i) => {
        const reached = !interrupted && i <= current
        return (
          <span key={stop.key} className="inline-flex items-center">
            {i > 0 ? (
              <span
                className="inline-block w-4"
                style={
                  reached
                    ? { height: 2, background: '#072534' }
                    : { height: 0, borderTop: '2px dashed rgba(7,37,52,0.22)' }
                }
              />
            ) : null}
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={
                !interrupted && i === current
                  ? { background: '#FFC300', boxShadow: '0 0 0 2px #072534' }
                  : reached
                    ? { background: '#072534' }
                    : { background: '#fff', boxShadow: 'inset 0 0 0 1.5px rgba(7,37,52,0.25)' }
              }
            />
          </span>
        )
      })}
    </span>
  )
}
