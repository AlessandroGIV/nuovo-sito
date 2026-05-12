import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ChevronRight, Calendar, ArrowLeft, BadgeCheck } from 'lucide-react'
import { getPostBySlug, getAllSlugs, getAdjacentPosts } from '@/lib/posts'

const BASE_URL = 'https://giustiziainvolo.it'

const CATEGORY_LABELS: Record<string, string> = {
  guide: 'Guide pratiche',
  scioperi: 'Scioperi',
  compagnie: 'Compagnie aeree',
  legale: 'Normativa',
  casi: 'Casi reali',
  news: 'News',
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

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-[#FFC300] text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.08] mt-8 mb-4 scroll-mt-24" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-[#FFC300] text-3xl font-extrabold mt-10 mb-4 border-b border-white/10 pb-2 scroll-mt-24" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-[#FFC300] text-[1.375rem] font-bold mt-7 mb-2 scroll-mt-24" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[1.0625rem] leading-[1.75] text-white/85 mb-[1.1rem]" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="pl-0 mb-4 space-y-2 text-white/85 list-none" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-outside pl-6 mb-4 space-y-2 text-white/85" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-[1.0625rem] leading-[1.75] pl-5 relative before:absolute before:left-0 before:top-[0.6em] before:h-2 before:w-2 before:rotate-45 before:bg-[#FFC300] before:content-['']" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-white font-bold" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-white/80" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[#FFC300] underline underline-offset-[3px] hover:text-yellow-300 transition-colors" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-[3px] border-[#FFC300] bg-white/5 pl-5 pr-4 py-3 rounded-r-xl italic text-white/80 my-6"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm text-white/85 border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-white/10 text-white font-semibold" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th className="px-4 py-2 text-left border border-white/10" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td className="px-4 py-2 border border-white/10" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="even:bg-white/5" {...props} />
  ),
  hr: () => <hr className="border-white/10 my-8" />,
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-white/10 rounded px-1.5 py-0.5 text-sm font-mono text-[#FFC300]" {...props} />
  ),
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'Giustizia In Volo',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  }

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category

  return (
    <main className="bg-[#072534] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb bar */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <nav className="font-mono text-xs uppercase tracking-[0.16em] text-white/45 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#FFC300] transition-colors">GIV</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/blog" className="hover:text-[#FFC300] transition-colors">blog</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-white/80 font-sans normal-case max-w-[40ch] truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article hero */}
      <div className="container mx-auto px-4 pt-10 pb-10 md:pt-14 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-white/65 hover:text-[#FFC300] transition-colors text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Tutti gli articoli
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.16em] bg-[#FFC300]/15 border border-[#FFC300]/30 text-[#FFC300] px-3 py-1 rounded-full">
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/55">
              <Calendar className="h-3 w-3 text-[#FFC300]" />
              <time>
                {new Date(post.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#FFC300] leading-[1.08]">
            {post.title}
          </h1>
          <p className="mt-4 text-white/80 text-lg md:text-xl leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Article body */}
        <article>
          {/* @ts-expect-error next-mdx-remote RSC async component incompatible with React 19 JSX types */}
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-white/[0.06] border border-white/10 p-6 md:p-7">
          <div className="flex items-start gap-3 mb-3">
            <BadgeCheck className="h-5 w-5 text-[#FFC300] shrink-0 mt-0.5" />
            <h3 className="text-[#FFC300] text-xl font-extrabold leading-tight">
              È successo anche a te?
            </h3>
          </div>
          <p className="text-white/80 mb-6 ml-8">
            Verifichiamo gratuitamente se hai diritto al rimborso. Paghi solo se otteniamo il risarcimento — fino a 600 € a passeggero.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 ml-8">
            <Link
              href="/#contact-form"
              className="inline-block rounded-md bg-[#FF8A00] px-6 py-3 text-white font-semibold hover:bg-[#ff8a00]/90 transition-colors text-center"
            >
              Richiedi rimborso gratuito
            </Link>
            <Link
              href="/come-funziona"
              className="inline-block rounded-md border border-white/20 px-6 py-3 text-white/85 font-semibold hover:bg-white/5 hover:border-white/30 transition-colors text-center"
            >
              Come funziona
            </Link>
          </div>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-12 grid gap-4 sm:grid-cols-2">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="rounded-xl border border-white/10 p-5 hover:border-[#FFC300]/50 hover:bg-white/[0.04] transition-all"
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/45 block mb-2">← Precedente</span>
                <span className="text-white font-semibold text-sm leading-snug group-hover:text-[#FFC300]">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="rounded-xl border border-white/10 p-5 hover:border-[#FFC300]/50 hover:bg-white/[0.04] transition-all sm:text-right"
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/45 block mb-2">Successivo →</span>
                <span className="text-white font-semibold text-sm leading-snug">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  )
}
