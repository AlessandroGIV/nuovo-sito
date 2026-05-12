import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { BlogList } from './_components/blog-list'

export const metadata: Metadata = {
  title: 'Blog — Diritti dei Passeggeri | Giustizia In Volo',
  description:
    'Guide pratiche, casi reali e aggiornamenti sul regolamento CE 261/2004. Scritti dai nostri avvocati — senza giri di parole.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  return <BlogList posts={posts} />
}
