'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Search, Clock } from 'lucide-react'
import type { PostFrontmatter, PostCategory } from '@/lib/posts'

const CATEGORIES: { id: PostCategory | 'tutti'; label: string }[] = [
  { id: 'tutti',     label: 'Tutti gli articoli' },
  { id: 'guide',     label: 'Guide pratiche' },
  { id: 'legale',    label: 'Normativa CE 261' },
  { id: 'compagnie', label: 'Compagnie aeree' },
  { id: 'casi',      label: 'Casi reali' },
  { id: 'scioperi',  label: 'Scioperi' },
  { id: 'news',      label: 'News' },
]

const COVER: Record<PostCategory, string> = {
  guide:     'cover-stripes',
  legale:    'cover-stripes',
  compagnie: 'cover-orange',
  scioperi:  'cover-orange',
  casi:      'cover-deep',
  news:      'cover-deep',
}

const CAT_LABEL: Record<PostCategory, string> = {
  guide:     'Guide pratiche',
  legale:    'Normativa CE 261',
  compagnie: 'Compagnie aeree',
  casi:      'Casi reali',
  scioperi:  'Scioperi',
  news:      'News',
}

function readMin(excerpt: string) {
  return Math.max(5, Math.round(excerpt.split(/\s+/).length / 3.5))
}

// ── Category pill ────────────────────────────────────────────

function CategoryPill({
  label, count, active, onClick,
}: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all"
      style={
        active
          ? { background: '#FFC300', borderColor: '#FFC300', color: '#0E2032' }
          : { borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(232,238,244,0.85)' }
      }
    >
      {label}
      {typeof count === 'number' && (
        <span className="ml-2 font-mono text-[11px]" style={{ opacity: 0.65 }}>
          {count}
        </span>
      )}
    </button>
  )
}

// ── Post cover ───────────────────────────────────────────────

function PostCover({ variant, slug, ratio = '16/10' }: { variant: string; slug: string; ratio?: string }) {
  return (
    <div className={`${variant} relative overflow-hidden rounded-xl`} style={{ aspectRatio: ratio }}>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          {slug.slice(0, 28)}
        </span>
      </div>
    </div>
  )
}

// ── Author avatar ─────────────────────────────────────────────

function AuthorAvatar({ initial, size = 36, onPaper = false }: { initial: string; size?: number; onPaper?: boolean }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-sm shrink-0"
      style={
        onPaper
          ? { width: size, height: size, background: '#FFF4CC', border: '1px solid #F0CE5C', color: '#8A6A00' }
          : { width: size, height: size, background: 'rgba(255,195,0,0.15)', border: '1px solid rgba(255,195,0,0.35)', color: '#FFC300' }
      }
    >
      {initial}
    </div>
  )
}

// ── Post card (paper) ────────────────────────────────────────

function PostCard({ post, featured = false }: { post: PostFrontmatter; featured?: boolean }) {
  const min = readMin(post.excerpt)
  const cover = COVER[post.category]
  const initial = 'G'
  const dateStr = new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

  const inner = (
    <>
      {/* Left / Top: text */}
      <div className={featured ? 'order-2 lg:order-1 flex flex-col justify-center' : 'flex flex-col gap-0'}>
        {/* Meta row */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-mono uppercase tracking-[0.16em]" style={{ color: '#B07D00' }}>
            {CAT_LABEL[post.category]}
          </span>
          <span style={{ color: 'rgba(15,42,60,0.25)' }}>·</span>
          <span className="inline-flex items-center gap-1" style={{ color: 'rgba(15,42,60,0.55)' }}>
            <Clock className="h-3 w-3" /> {min} min
          </span>
        </div>

        {/* Title */}
        <h3
          className="mt-3 font-extrabold leading-[1.1] transition-opacity group-hover:opacity-80"
          style={{
            color: '#072534',
            letterSpacing: '-0.02em',
            fontFamily: "var(--font-display, 'Geist', system-ui, sans-serif)",
            fontSize: featured ? 'clamp(1.375rem, 2.5vw, 2.1rem)' : '1.2rem',
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className="mt-3 leading-relaxed flex-1"
          style={{ color: 'rgba(15,42,60,0.78)', fontSize: featured ? '1rem' : '0.9375rem' }}
        >
          {post.excerpt}
        </p>

        {/* Author + date */}
        <div className="mt-5 flex items-center gap-3">
          <AuthorAvatar initial={initial} onPaper />
          <div className="text-xs min-w-0">
            <div className="font-medium" style={{ color: 'rgba(7,37,52,0.9)' }}>Studio Legale GIV</div>
            <div className="font-mono" style={{ color: 'rgba(15,42,60,0.55)' }}>{dateStr}</div>
          </div>
          {featured && (
            <span
              className="ml-auto inline-flex items-center gap-1.5 font-semibold text-sm"
              style={{ color: '#072534' }}
            >
              Leggi →
            </span>
          )}
        </div>
      </div>

      {/* Right / Bottom: cover */}
      <div className={featured ? 'order-1 lg:order-2' : 'mt-1'}>
        <PostCover variant={cover} slug={post.slug} ratio={featured ? '16/9' : '16/10'} />
      </div>
    </>
  )

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article
          className="group cursor-pointer transition-transform hover:-translate-y-0.5 grid gap-7 lg:grid-cols-2"
          style={{
            borderRadius: '1.25rem',
            padding: '1.5rem',
            background: '#FFFFFF',
            boxShadow: '0 1px 0 rgba(7,37,52,0.04), 0 10px 30px rgba(7,37,52,0.18)',
          }}
        >
          {inner}
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className="group cursor-pointer transition-transform hover:-translate-y-0.5 flex flex-col gap-3 h-full"
        style={{
          borderRadius: '1rem',
          padding: '1rem',
          background: '#FFFFFF',
          boxShadow: '0 1px 0 rgba(7,37,52,0.04), 0 6px 20px rgba(7,37,52,0.10)',
        }}
      >
        {inner}
      </article>
    </Link>
  )
}

// ── Blog list ─────────────────────────────────────────────────

interface Props {
  posts: PostFrontmatter[]
}

export function BlogList({ posts }: Props) {
  const [cat, setCat] = useState<PostCategory | 'tutti'>('tutti')
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const c: Record<string, number> = { tutti: posts.length }
    posts.forEach((p) => { c[p.category] = (c[p.category] ?? 0) + 1 })
    return c
  }, [posts])

  const visibleCats = useMemo(
    () => CATEGORIES.filter((c) => c.id === 'tutti' || counts[c.id]),
    [counts]
  )

  const filtered = useMemo(() => {
    let list = cat === 'tutti' ? posts : posts.filter((p) => p.category === cat)
    if (q.trim()) {
      const lq = q.trim().toLowerCase()
      list = list.filter((p) => (p.title + ' ' + p.excerpt).toLowerCase().includes(lq))
    }
    return list
  }, [posts, cat, q])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <main className="bg-[#072534] text-white min-h-screen">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative border-b border-white/5 overflow-hidden">
        {/* Decorative flight path */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <svg
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMaxYMid slice"
            className="absolute inset-0 w-full h-full"
          >
            <path
              d="M 60 420 Q 360 50 880 200"
              fill="none"
              stroke="rgba(255,195,0,0.22)"
              strokeWidth="1.25"
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
            <circle cx="60" cy="420" r="4" fill="#FFC300" opacity="0.5" />
            <circle cx="880" cy="200" r="4" fill="#FFC300" opacity="0.5" />
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-16 pb-12 md:pt-20 md:pb-16 relative" style={{ zIndex: 2 }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-white/45 mb-5">
            <Link href="/" className="hover:text-[#FFC300] transition-colors">GIV</Link>
            <span>/</span>
            <span style={{ color: '#FFC300' }}>blog</span>
          </div>

          {/* H1 + subtitle */}
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-end">
            <h1
              className="font-extrabold leading-[0.96]"
              style={{
                color: '#FFC300',
                fontFamily: "var(--font-display, 'Geist', system-ui, sans-serif)",
                fontSize: 'clamp(44px, 5.8vw, 80px)',
                letterSpacing: '-0.035em',
              }}
            >
              Diritti dei passeggeri,<br />spiegati con chiarezza.
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
              Guide pratiche, casi reali e aggiornamenti sul regolamento CE&nbsp;261/2004. Scritti dai nostri avvocati — senza giri di parole.
            </p>
          </div>

          {/* Search + stats row */}
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/45 pointer-events-none" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca un articolo, una compagnia, un argomento…"
                className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-[15px] text-white placeholder:text-white/40 focus:outline-none transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,195,0,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,195,0,0.15)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>
            <div className="flex items-center gap-5 text-sm font-mono text-white/45">
              <span><span className="text-white/85">{posts.length}</span> articoli</span>
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-6 -mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {visibleCats.map((c) => (
                <CategoryPill
                  key={c.id}
                  label={c.label}
                  count={c.id !== 'tutti' ? counts[c.id] : undefined}
                  active={cat === c.id}
                  onClick={() => setCat(c.id as PostCategory | 'tutti')}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured (paper band) ─────────────────────── */}
      {featured && (
        <section className="band-paper">
          <div className="container mx-auto px-4 py-14">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'rgba(7,37,52,0.55)' }}>
                <span style={{ color: '#B07D00' }}>★</span>&nbsp; in evidenza
              </h2>
              <span className="text-xs font-mono" style={{ color: 'rgba(7,37,52,0.45)' }}>
                {new Date(featured.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <PostCard post={featured} featured />
          </div>
        </section>
      )}

      {/* ── Grid ──────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        {/* Section header */}
        <div className="mb-6 flex items-baseline justify-between border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">
            {cat === 'tutti' ? 'tutti gli articoli' : CATEGORIES.find((c) => c.id === cat)?.label}
          </h2>
          <span className="text-xs font-mono text-white/45">{rest.length} articoli</span>
        </div>

        {rest.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-white/75">Nessun articolo trovato con questi filtri.</p>
            <button
              onClick={() => { setCat('tutti'); setQ('') }}
              className="mt-4 font-semibold text-[#FFC300] underline"
            >
              Mostra tutti
            </button>
          </div>
        ) : null}

        {/* Newsletter */}
        <div
          className="mt-16 rounded-2xl border border-white/10 p-6 md:p-8 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -right-8 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,195,0,0.18), transparent 70%)' }}
          />
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#FFC300]">
              Newsletter — 1 e-mail al mese
            </div>
            <h3
              className="mt-2 text-2xl md:text-3xl font-extrabold text-white"
              style={{ letterSpacing: '-0.025em', fontFamily: "var(--font-display, 'Geist', system-ui)" }}
            >
              Una sintesi mensile delle sentenze che contano.
            </h3>
            <p className="mt-2 text-white/70 text-[15px]">
              Nuove pronunce, modifiche al regolamento, compagnie sotto osservazione. Niente spam, mai.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 relative"
          >
            <input
              type="email"
              placeholder="la-tua@email.it"
              className="flex-1 rounded-xl border py-3 px-3 text-white placeholder:text-white/40 focus:outline-none min-w-0"
              style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(7,37,52,0.6)' }}
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl px-5 py-3 font-semibold text-[#0E2032]"
              style={{ background: 'linear-gradient(135deg, #FFC300 0%, #FFD466 100%)' }}
            >
              Iscrivimi
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
