'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { PostFrontmatter, PostCategory } from '@/lib/posts'

const CATEGORY_LABELS: Record<PostCategory | 'all', string> = {
  all: 'Tutti',
  guide: 'Guide',
  scioperi: 'Scioperi',
  compagnie: 'Compagnie',
  legale: 'Legale',
  casi: 'Casi',
  news: 'News',
}

const CATEGORY_COLORS: Record<PostCategory, string> = {
  guide: 'bg-blue-500/20 text-blue-300',
  scioperi: 'bg-red-500/20 text-red-300',
  compagnie: 'bg-purple-500/20 text-purple-300',
  legale: 'bg-green-500/20 text-green-300',
  casi: 'bg-orange-500/20 text-orange-300',
  news: 'bg-gray-500/20 text-gray-300',
}

interface Props {
  posts: PostFrontmatter[]
}

export function BlogList({ posts }: Props) {
  const [active, setActive] = useState<PostCategory | 'all'>('all')

  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active)

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))] as (
    | PostCategory
    | 'all'
  )[]

  return (
    <>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              active === cat
                ? 'bg-[#FFC300] text-[#072534]'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="text-white/60 text-center py-16">Nessun articolo in questa categoria.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl bg-white/5 border border-white/10 p-6 hover:border-[#FFC300]/50 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[post.category]}`}
                >
                  {CATEGORY_LABELS[post.category]}
                </span>
                <time className="text-xs text-white/50">
                  {new Date(post.date).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-[#FFC300] transition-colors leading-snug mb-3">
                {post.title}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed flex-1">{post.excerpt}</p>
              <span className="mt-4 text-[#FFC300] text-sm font-semibold">
                Leggi l&apos;articolo →
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
