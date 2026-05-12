import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { BlogList } from './_components/blog-list'

export const metadata: Metadata = {
  title: 'Blog — Diritti dei Passeggeri | Giustizia In Volo',
  description:
    'Guide, aggiornamenti e approfondimenti legali sui diritti dei passeggeri aerei. A cura di Giustizia In Volo.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="bg-[#072534] text-white min-h-screen">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight">
            Blog — Diritti dei Passeggeri
          </h1>
          <p className="mt-4 text-white/80 text-lg">
            Guide pratiche, aggiornamenti normativi e approfondimenti legali per difendere i tuoi
            diritti quando qualcosa va storto in volo.
          </p>
        </div>

        <BlogList posts={posts} />
      </section>
    </main>
  )
}
