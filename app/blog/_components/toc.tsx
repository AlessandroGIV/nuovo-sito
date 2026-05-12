'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface TocItem {
  id: string
  label: string
}

interface Props {
  items: TocItem[]
}

export function TocSidebar({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!items.length) return

    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-120px 0px -70% 0px' }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <div className="sticky top-24">
      {/* TOC card */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 0 rgba(7,37,52,0.04), 0 6px 20px rgba(7,37,52,0.08)' }}>
        <div className="font-mono text-xs uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(7,37,52,0.55)' }}>
          Indice
        </div>
        <ul className="space-y-0.5 border-l pl-4" style={{ borderColor: 'rgba(7,37,52,0.10)' }}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`toc-link relative -ml-[17px] pl-4 block py-1.5 text-sm transition-colors before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:transition-colors ${active === item.id ? 'active' : ''}`}
                style={{ ['--before-bg' as string]: active === item.id ? '#072534' : 'rgba(7,37,52,0.18)' }}
              >
                <span className="before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[rgba(7,37,52,0.18)]" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Stima rapida card */}
      <div className="mt-6 rounded-2xl p-5 relative overflow-hidden bg-[#072534] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,195,0,0.28), transparent 70%)' }}
        />
        <div className="relative">
          <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#FFC300]">Stima rapida</div>
          <div className="mt-2 text-2xl font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>
            Fino a 600 €
          </div>
          <p className="mt-1 text-sm text-white/70">
            Compensazione massima per tratte extra-UE oltre 3.500 km.
          </p>
          <Link
            href="/#contact-form"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFC300]"
          >
            Verifica il tuo caso <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
