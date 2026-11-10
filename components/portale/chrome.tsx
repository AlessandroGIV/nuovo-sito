'use client'

// Intestazione e navigazione delle aree riservate (agenzia e gestione).

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Plane } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavItem = { href: string; label: string; exact?: boolean; badge?: number }

export function PortalHeader({
  area,
  who,
  detail,
  nav,
  logout,
}: {
  area: string
  who: string
  detail?: string
  nav: NavItem[]
  logout: () => Promise<void>
}) {
  const pathname = usePathname()
  return (
    <header className="bg-[#072534] text-white">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2 font-extrabold text-[#FFC300]">
            <Plane className="h-5 w-5" />
            <span className="hidden text-lg sm:inline">GiustiziaInVolo</span>
          </Link>
          <span className="h-5 w-px flex-shrink-0 bg-white/20" aria-hidden="true" />
          <span className="truncate text-[14px] font-semibold text-white/85">{area}</span>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 text-right leading-tight">
            <div className="truncate text-[14px] font-semibold">{who}</div>
            {detail ? <div className="truncate text-[12px] text-white/60">{detail}</div> : null}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-[13px] font-semibold text-white/90 transition-colors hover:border-[#FFC300] hover:text-[#FFC300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Esci
            </button>
          </form>
        </div>
      </div>
      <nav aria-label={area} className="border-t border-white/10">
        <ul className="mx-auto flex max-w-[1120px] gap-1 overflow-x-auto px-2 sm:px-4">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href} className="flex-shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex items-center gap-2 border-b-[3px] px-3 py-3 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFC300]',
                    active ? 'border-[#FFC300] text-white' : 'border-transparent text-white/65 hover:text-white',
                  )}
                >
                  {item.label}
                  {item.badge ? (
                    <span className="rounded-full bg-[#FFC300] px-1.5 py-px text-[11px] font-extrabold text-[#072534]">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export function PageTitle({
  title,
  lead,
  action,
}: {
  title: string
  lead?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[62ch]">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-[#072534] sm:text-[30px]">{title}</h1>
        {lead ? <p className="mt-1.5 text-[15px] leading-relaxed text-[#4A5E73]">{lead}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Panel({
  title,
  children,
  className,
  aside,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  aside?: React.ReactNode
}) {
  return (
    <section className={cn('rounded-2xl border border-[#072534]/10 bg-white', className)}>
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b border-[#072534]/[0.08] px-5 py-3.5 sm:px-6">
          <h2 className="text-[15px] font-bold text-[#072534]">{title}</h2>
          {aside}
        </div>
      ) : null}
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  )
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'navy' | 'quiet'
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-bold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#072534]',
        variant === 'primary' && 'bg-[#FFC300] text-[#072534] hover:bg-[#FFB800]',
        variant === 'navy' && 'bg-[#072534] text-white hover:bg-[#0E3A52]',
        variant === 'quiet' && 'border-[1.5px] border-[#DCE3EB] bg-white text-[#13283D] hover:border-[#072534]',
        className,
      )}
    >
      {children}
    </Link>
  )
}
