'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Search, Clock } from 'lucide-react'
import type { PostFrontmatter, PostCategory } from '@/lib/posts'

const CATEGORY_LABELS: Record<PostCategory | 'all', string> = {
  all: 'Tutti',
  guide: 'Guide pratiche',
  scioperi: 'Scioperi',
  compagnie: 'Compagnie aeree',
  legale: 'Normativa',
  casi: 'Casi reali',
  news: 'News',
}

const COVER_CLASS: Record<PostCategory, string> = {
  guide: 'cover-stripes',
  legale: 'cover-stripes',
  compagnie: 'cover-orange',
  scioperi: 'cover-orange',
  casi: 'cover-deep',
  news: 'cover-deep',
}

function estimateReadMin(excerpt: string): number {
  const words = excerpt.split(/\s+/).length
  return Math.max(3, Math.round((words * 10) / 200))
}

interface Props {
  posts: PostFrontmatter[]
}

export function BlogList({ posts }: Props) {
  const [active, setActive] = useState<PostCategory | 'all'>('all')
  const [query, setQuery] = useState('')

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(posts.map((p) => p.category)))] as (PostCategory | 'all')[],
    [posts]
  )

  const filtered = useMemo(() => {
    let result = active === 'all' ? posts : posts.filter((p) => p.category === active)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      )
    }
    return result
  }, [posts, active, query])

  return (
    <>
      {/* Search */}
      <div className="relative w-full md:max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un articolo, una compagnia, un argomento…"
          className="w-full rounded-md border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-3 text-[15px] text-white placeholder:text-white/40 focus:border-[#FFC300]/60 focus:outline-none transition-colors"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-[#FFC300] border border-[#FFC300] text-[#072534]'
                : 'border border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:border-white/25'
            }`}
          >
            {CATEGORY_LABELS[cat]}
            {cat !== 'all' && (
              <span className={`ml-1.5 text-xs ${active === cat ? 'text-[#072534]/60' : 'text-white/40'}`}>
                {posts.filter((p) => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between pb-4 mb-8 border-b border-white/5">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">
          {active === 'all' ? 'Tutti gli articoli' : CATEGORY_LABELS[active]}
          {' '}
          <span className="text-white/30">·</span>
          {' '}
          <span className="text-white/40">{filtered.length}</span>
        </span>
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-12 text-center">
          <p className="text-white/60 mb-4">Nessun articolo trovato con questi filtri.</p>
          <button
            onClick={() => { setActive('all'); setQuery('') }}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/85 hover:bg-white/10 transition-colors"
          >
            Mostra tutti
          </button>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  )
}

function PostCard({ post }: { post: PostFrontmatter }) {
  const readMin = estimateReadMin(post.excerpt)
  const coverClass = COVER_CLASS[post.category]

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
      {/* Cover placeholder */}
      <div className={`${coverClass} aspect-[16/10] rounded-lg relative overflow-hidden`}>
        <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          {post.slug.slice(0, 24)}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-mono uppercase tracking-[0.16em] text-[#FFC300]">
          {CATEGORY_LABELS[post.category]}
        </span>
        <span className="text-white/30">·</span>
        <span className="flex items-center gap-1 text-white/55">
          <Clock className="h-3 w-3" />
          {readMin} min
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-extrabold text-white group-hover:text-[#FFC300] transition-colors leading-tight">
        {post.title}
      </h2>

      {/* Excerpt */}
      <p className="text-[15px] text-white/75 leading-relaxed flex-1">{post.excerpt}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <time className="font-mono text-xs text-white/45">
          {new Date(post.date).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
        <span className="text-[#FFC300] text-sm font-semibold group-hover:underline">
          Leggi →
        </span>
      </div>
    </Link>
  )
}
