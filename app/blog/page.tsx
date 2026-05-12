import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { BlogList } from './_components/blog-list'

export const metadata: Metadata = {
  title: 'Blog — Diritti dei Passeggeri | Giustizia In Volo',
  description:
    'Guide pratiche, casi reali e aggiornamenti sul regolamento CE 261/2004. Scritti dai nostri avvocati — senza giri di parole.',
}

export default function BlogPage() {
  const posts = getAllPosts()

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
            <span className="text-[#FFC300]">blog</span>
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
        </div>
      </section>

      {/* ── List (client) ────────────────────────────── */}
      <div className="container mx-auto px-4">
        <BlogList posts={posts} />
      </div>
    </main>
  )
}
