'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CopyButton({
  text,
  label = 'Copia',
  copiedLabel = 'Copiato',
  className,
}: {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          // Appunti non disponibili: il testo resta selezionabile a mano.
        }
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border-[1.5px] border-[#DCE3EB] bg-white px-3 py-2 text-[13.5px] font-semibold text-[#13283D] transition-colors hover:border-[#072534]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534]',
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  )
}
