import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ChevronRight, ArrowLeft, ArrowRight, Clock, Calendar, Tag, BadgeCheck, Twitter, Linkedin, Facebook, Link2 } from 'lucide-react'
import { getPostBySlug, getAllPosts, getAllSlugs } from '@/lib/posts'
import { TocSidebar, type TocItem } from '../_components/toc'

const BASE_URL = 'https://giustiziainvolo.it'

const CAT_LABEL: Record<string, string> = {
  guide:     'Guide pratiche',
  legale:    'Normativa CE 261',
  compagnie: 'Compagnie aeree',
  casi:      'Casi reali',
  scioperi:  'Scioperi',
  news:      'News',
}

const COVER: Record<string, string> = {
  guide:     'cover-stripes',
  legale:    'cover-stripes',
  compagnie: 'cover-orange',
  scioperi:  'cover-orange',
  casi:      'cover-deep',
  news:      'cover-deep',
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Giustizia In Volo`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    keywords: post.keywords,
  }
}

/** Extract h2 headings from MDX source and generate anchor IDs from heading text */
function extractToc(content: string): TocItem[] {
  const items: TocItem[] = []
  const re = /^## (.+?)(?:\s*\{#[^}]+\})?$/gm
  let m
  while ((m = re.exec(content)) !== null) {
    const rawLabel = m[1].replace(/\{#[^}]+\}/g, '').trim()
    const id = rawLabel
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    items.push({ id, label: rawLabel })
  }
  return items
}

/** Strip {#anchor} syntax from MDX so next-mdx-remote doesn't choke on it as JSX */
function stripAnchorSyntax(content: string): string {
  return content.replace(/^(#{1,6}\s[^\n]*?)\s*\{#[^}]+\}/gm, '$1')
}

/** Estimate reading time from word count */
function readMin(content: string) {
  return Math.max(5, Math.round(content.split(/\s+/).length / 200))
}

// ── MDX components (paper-safe: no colour classes, CSS handles it) ──────────

const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    let id: string | undefined
    let label: React.ReactNode = children
    if (typeof children === 'string') {
      const m = children.match(/\{#([^}]+)\}/)
      if (m) {
        id = m[1]
        label = children.replace(/\s*\{#[^}]+\}/, '').trim()
      } else {
        id = children
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      }
    }
    return <h2 id={id} {...props}>{label}</h2>
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props}>{children}</h3>
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} />
  ),
}

// ── Related post card (paper) ────────────────────────────────

function RelatedCard({ post }: { post: import('@/lib/posts').PostFrontmatter }) {
  const cover = COVER[post.category] ?? 'cover-deep'
  const dateStr = new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  const min = readMin(post.excerpt)

  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className="group cursor-pointer transition-transform hover:-translate-y-0.5 flex flex-col gap-3 h-full"
        style={{ borderRadius: '1rem', padding: '1rem', background: '#FFFFFF', boxShadow: '0 1px 0 rgba(7,37,52,0.04), 0 6px 20px rgba(7,37,52,0.10)' }}
      >
        <div className={`${cover} relative overflow-hidden rounded-xl`} style={{ aspectRatio: '16/10' }}>
          <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            {post.slug.slice(0, 24)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono uppercase tracking-[0.16em]" style={{ color: '#B07D00' }}>
            {CAT_LABEL[post.category] ?? post.category}
          </span>
          <span style={{ color: 'rgba(15,42,60,0.25)' }}>·</span>
          <span className="inline-flex items-center gap-1" style={{ color: 'rgba(15,42,60,0.55)' }}>
            <Clock className="h-3 w-3" /> {min} min
          </span>
        </div>
        <h3
          className="font-extrabold leading-tight transition-opacity group-hover:opacity-80"
          style={{ color: '#072534', letterSpacing: '-0.02em', fontSize: '1.1rem', fontFamily: "var(--font-display, 'Geist', system-ui)" }}
        >
          {post.title}
        </h3>
        <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(15,42,60,0.78)' }}>
          {post.excerpt}
        </p>
        <div className="mt-auto pt-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
               style={{ background: '#FFF4CC', border: '1px solid #F0CE5C', color: '#8A6A00' }}>
            G
          </div>
          <span className="font-mono text-xs" style={{ color: 'rgba(15,42,60,0.55)' }}>{dateStr}</span>
        </div>
      </article>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3)
  const toc = extractToc(post.content)
  const safeContent = stripAnchorSyntax(post.content)
  const min = readMin(post.content)
  const cover = COVER[post.category] ?? 'cover-deep'
  const catLabel = CAT_LABEL[post.category] ?? post.category
  const dateStr = new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: { '@type': 'Organization', name: 'Giustizia In Volo', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
  }

  return (
    <main className="bg-[#072534] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Breadcrumb bar ────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <nav className="font-mono text-xs uppercase tracking-[0.16em] text-white/45 flex items-center gap-1.5 flex-wrap">
            <Link href="/blog" className="hover:opacity-80 transition-opacity">blog</Link>
            <ChevronRight className="h-3 w-3 text-white/30 shrink-0" />
            <span className="text-[#FFC300]">{catLabel}</span>
            <ChevronRight className="h-3 w-3 text-white/30 shrink-0" />
            <span className="text-white/55 normal-case tracking-normal font-sans truncate max-w-[40ch]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Article hero ──────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* flight path decoration */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <svg viewBox="0 0 1000 500" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 w-full h-full">
            <path d="M 60 420 Q 360 50 880 200" fill="none" stroke="rgba(255,195,0,0.18)" strokeWidth="1.25" strokeDasharray="2 8" strokeLinecap="round" />
            <circle cx="60" cy="420" r="4" fill="#FFC300" opacity="0.4" />
            <circle cx="880" cy="200" r="4" fill="#FFC300" opacity="0.4" />
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-10 pb-10 md:pt-14 relative" style={{ zIndex: 2 }}>
          {/* Back link */}
          <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-white/65 hover:opacity-90 transition-opacity">
            <ArrowLeft className="h-4 w-4" /> Tutti gli articoli
          </Link>

          {/* Grid: text + cover */}
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              {/* Category badge */}
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-[0.18em]"
                style={{ background: 'rgba(255,195,0,0.12)', border: '1px solid rgba(255,195,0,0.35)', color: '#FFC300' }}
              >
                <Tag className="h-3 w-3" /> {catLabel}
              </span>

              {/* H1 */}
              <h1
                className="mt-4 font-extrabold leading-[1.02]"
                style={{
                  color: '#FFC300',
                  fontFamily: "var(--font-display, 'Geist', system-ui, sans-serif)",
                  fontSize: 'clamp(32px, 4.4vw, 56px)',
                  letterSpacing: '-0.03em',
                }}
              >
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-5 text-white/80 text-lg md:text-xl leading-relaxed">{post.excerpt}</p>

              {/* Meta row */}
              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm">
                {/* Author avatar */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0"
                       style={{ background: 'rgba(255,195,0,0.15)', border: '1px solid rgba(255,195,0,0.35)', color: '#FFC300' }}>
                    G
                  </div>
                  <div>
                    <div className="text-white font-medium">Studio Legale GIV</div>
                    <div className="text-white/50 font-mono text-xs">Team rimborsi</div>
                  </div>
                </div>
                <span className="h-6 w-px bg-white/15 hidden md:block" />
                <span className="inline-flex items-center gap-1.5 text-white/65">
                  <Calendar className="h-4 w-4 text-[#FFC300]" />
                  {dateStr}
                </span>
                <span className="inline-flex items-center gap-1.5 text-white/65">
                  <Clock className="h-4 w-4 text-[#FFC300]" />
                  {min} min di lettura
                </span>
              </div>
            </div>

            {/* Cover */}
            <div>
              <div className={`${cover} relative overflow-hidden rounded-xl`} style={{ aspectRatio: '16/9' }}>
                <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {post.slug.slice(0, 28)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body on paper ─────────────────────────────── */}
      <section className="band-paper">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">

            {/* Article card */}
            <article
              className="max-w-2xl"
              style={{
                background: '#FFFFFF',
                borderRadius: '1rem',
                padding: '1.75rem',
                boxShadow: '0 1px 0 rgba(7,37,52,0.04), 0 10px 30px rgba(7,37,52,0.10)',
              }}
            >
              {/* MDX body */}
              <div className="prose-on-paper">
                {/* @ts-expect-error next-mdx-remote RSC async component incompatible with React 19 JSX types */}
                <MDXRemote source={safeContent} components={mdxComponents} />
              </div>

              {/* CTA box inside article card */}
              <div
                className="mt-12 rounded-2xl p-6 md:p-7 relative overflow-hidden"
                style={{ background: '#072534', color: '#fff' }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(255,195,0,0.25), transparent 70%)' }}
                />
                <div className="flex items-start gap-4 relative">
                  <div
                    className="hidden sm:flex h-12 w-12 shrink-0 rounded-xl items-center justify-center"
                    style={{ background: 'rgba(255,195,0,0.15)', border: '1px solid rgba(255,195,0,0.4)', color: '#FFC300' }}
                  >
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl md:text-2xl font-extrabold"
                      style={{ color: '#FFC300', letterSpacing: '-0.02em', fontFamily: "var(--font-display, 'Geist', system-ui)" }}
                    >
                      È successo anche a te?
                    </h3>
                    <p className="mt-2 text-white/85 text-[15px] leading-relaxed">
                      Verifichiamo gratuitamente se hai diritto al rimborso. Paghi solo se otteniamo il risarcimento — fino a 600 € a passeggero.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/#contact-form"
                        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#072534] text-center"
                        style={{ background: '#FFC300' }}
                      >
                        Richiedi rimborso gratuito
                      </Link>
                      <Link
                        href="/come-funziona"
                        className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-white text-center"
                        style={{ borderColor: 'rgba(255,255,255,0.22)' }}
                      >
                        Come funziona
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags + share */}
              <div
                className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-6"
                style={{ borderColor: 'rgba(7,37,52,0.10)' }}
              >
                <div className="flex flex-wrap gap-2">
                  {post.keywords.slice(0, 5).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full border px-3 py-1 text-xs font-mono"
                      style={{ borderColor: 'rgba(7,37,52,0.12)', background: '#F6F4EF', color: 'rgba(7,37,52,0.7)' }}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(7,37,52,0.7)' }}>
                  <span className="mr-1">Condividi:</span>
                  {[Twitter, Linkedin, Facebook, Link2].map((Icon, i) => (
                    <button
                      key={i}
                      className="h-8 w-8 rounded-lg border flex items-center justify-center hover:opacity-70 transition-opacity"
                      style={{ borderColor: 'rgba(7,37,52,0.15)' }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Author box */}
              <div className="mt-10 rounded-2xl p-6 flex gap-5 items-start" style={{ background: '#F6F4EF' }}>
                <div
                  className="h-14 w-14 shrink-0 rounded-full flex items-center justify-center font-bold text-xl"
                  style={{ background: '#FFF4CC', border: '1px solid #F0CE5C', color: '#8A6A00' }}
                >
                  G
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.16em]" style={{ color: 'rgba(7,37,52,0.55)' }}>
                    Scritto da
                  </div>
                  <div className="mt-1 text-lg font-bold" style={{ color: '#072534' }}>Studio Legale GIV</div>
                  <div className="text-sm" style={{ color: 'rgba(7,37,52,0.6)' }}>Team rimborsi, diritto aeronautico</div>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'rgba(7,37,52,0.8)' }}>
                    Il team legale di Giustizia In Volo si occupa di diritto del trasporto aereo e contenzioso CE 261 dal 2018. Oltre 2.000 pratiche di rimborso gestite con successo.
                  </p>
                </div>
              </div>
            </article>

            {/* Sidebar: TOC + stima rapida */}
            <aside className="hidden lg:block">
              <TocSidebar items={toc} />
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related articles ──────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-white/10 bg-[#072534]">
          <div className="container mx-auto px-4 py-14">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-4 mb-8">
              <h2
                className="text-xl md:text-2xl font-extrabold"
                style={{ color: '#FFC300', letterSpacing: '-0.02em', fontFamily: "var(--font-display, 'Geist', system-ui)" }}
              >
                Continua a leggere
              </h2>
              <Link href="/blog" className="text-sm text-white/65 hover:opacity-80 inline-flex items-center gap-1 transition-opacity">
                Tutti gli articoli <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <RelatedCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
