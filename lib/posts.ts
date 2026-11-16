import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export type PostCategory = 'guide' | 'scioperi' | 'compagnie' | 'legale' | 'casi' | 'news'

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  slug: string
  category: PostCategory
  keywords: string[]
  excerpt: string
}

export interface Post extends PostFrontmatter {
  content: string
}

/**
 * Il frontmatter YAML può dare la data come stringa ("2026-05-12") o come Date (2026-05-12 senza apici).
 * La si porta sempre a stringa AAAA-MM-GG, così ordinamento, sitemap e JSON-LD vedono lo stesso formato.
 */
function normalizza(data: Record<string, unknown>): PostFrontmatter {
  const d = data.date
  const date = d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? '')
  return { ...(data as unknown as PostFrontmatter), date }
}

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data } = matter(raw)
    return normalizza(data)
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return { ...normalizza(data), content }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}

export function getAdjacentPosts(
  slug: string
): { prev: PostFrontmatter | null; next: PostFrontmatter | null } {
  const posts = getAllPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  }
}
