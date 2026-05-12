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
      {/* Hero */}
      <section className="border-b border-white/5">
        <div className="container mx-auto px-4 pt-14 pb-10 md:pt-16 md:pb-12">
          <nav className="font-mono text-xs uppercase tracking-[0.18em] text-white/45 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#FFC300] transition-colors">GIV</Link>
            <span>/</span>
            <span className="text-[#FFC300]">blog</span>
          </nav>
          <div className="grid md:grid-cols-[1.4fr_1fr] md:items-end gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-[#FFC300]">
              Diritti dei passeggeri, spiegati con chiarezza.
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
              Guide pratiche, casi reali e aggiornamenti sul regolamento CE 261/2004. Scritti dai nostri avvocati — senza giri di parole.
            </p>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="container mx-auto px-4 py-12 pb-16">
        <BlogList posts={posts} />
      </section>
    </main>
  )
}
