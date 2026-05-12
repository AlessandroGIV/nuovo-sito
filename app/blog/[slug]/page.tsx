import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllSlugs, getAdjacentPosts } from '@/lib/posts'

const BASE_URL = 'https://giustiziainvolo.it'

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
    <h1 className="text-[#FFC300] text-3xl md:text-4xl font-extrabold leading-tight mt-8 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-[#FFC300] text-2xl font-bold mt-10 mb-4 border-b border-white/10 pb-2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-white text-xl font-bold mt-6 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-white/85 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-outside pl-6 mb-4 space-y-1 text-white/85" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-outside pl-6 mb-4 space-y-1 text-white/85" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-white font-bold" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[#FFC300] underline hover:text-yellow-300 transition-colors" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-[#FFC300] pl-4 italic text-white/70 my-6"
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

  return (
    <main className="bg-[#072534] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-white/50 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#FFC300] transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-[#FFC300] transition-colors">
            Blog
          </Link>
          <span>›</span>
          <span className="text-white/80 truncate">{post.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-[#FFC300]/20 text-[#FFC300] px-2 py-1 rounded-full capitalize">
              {post.category}
            </span>
            <time className="text-xs text-white/50">
              {new Date(post.date).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFC300] leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-white/70 text-lg">{post.excerpt}</p>
        </header>

        {/* Article body */}
        <article className="prose-invert">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-white/5 border border-[#FFC300]/30 p-8 text-center">
          <h3 className="text-[#FFC300] text-xl font-extrabold mb-2">
            Hai subito un disservizio aereo?
          </h3>
          <p className="text-white/80 mb-6">
            Verifica gratis in 2 minuti se hai diritto al risarcimento. Nessun anticipo — paghiamo
            solo se vinciamo.
          </p>
          <Link
            href="/richiesta"
            className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            Verifica ora →
          </Link>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-12 grid gap-4 sm:grid-cols-2">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="rounded-xl border border-white/10 p-5 hover:border-[#FFC300]/50 transition-colors"
              >
                <span className="text-xs text-white/50 block mb-1">← Articolo precedente</span>
                <span className="text-white font-semibold text-sm leading-snug">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="rounded-xl border border-white/10 p-5 hover:border-[#FFC300]/50 transition-colors sm:text-right"
              >
                <span className="text-xs text-white/50 block mb-1">Articolo successivo →</span>
                <span className="text-white font-semibold text-sm leading-snug">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  )
}
