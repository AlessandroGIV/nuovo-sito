import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { airlines, airlineSubpages } from '@/lib/airlines-data'
import { airports } from '@/lib/airports-data'
import { ec261Pages } from '@/lib/ec261-data'
import { DISSERVIZI } from '@/lib/seo/disservizi'
import { tratte, VERIFICA_TRATTE } from '@/lib/seo/tratte'

import { SITE_URL as BASE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: post.category === 'guide' || post.category === 'legale' ? 'monthly' : 'weekly',
    priority: post.category === 'guide' || post.category === 'legale' ? 0.8 : 0.6,
  }))

  // Pagine compagnie aeree (principale + sotto-pagine)
  const airlineEntries: MetadataRoute.Sitemap = []
  for (const airline of airlines) {
    airlineEntries.push({
      url: `${BASE_URL}/compagnie-aeree/${airline.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    })
    for (const sub of airlineSubpages) {
      airlineEntries.push({
        url: `${BASE_URL}/compagnie-aeree/${airline.slug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.75,
      })
    }
  }

  // Pagine aeroporti
  const airportEntries: MetadataRoute.Sitemap = airports.map((airport) => ({
    url: `${BASE_URL}/aeroporti/${airport.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Pagine EC261 keyword
  const ec261Entries: MetadataRoute.Sitemap = ec261Pages.map((p) => ({
    url: `${BASE_URL}/ec261/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Pagine vettore + tratta + disservizio (lib/seo). lastModified segue la data di verifica del lotto.
  const tratteEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/voli`,
      lastModified: new Date(VERIFICA_TRATTE.data),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...tratte.flatMap((t) =>
      DISSERVIZI.map((d) => ({
        url: `${BASE_URL}/voli/${t.vettoreSlug}/${t.slug}/${d.slug}`,
        lastModified: new Date(VERIFICA_TRATTE.data),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    ),
  ]

  return [
    // Pagine principali
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/agenzie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/rimborso-ryanair`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-ita-airways`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-easyjet`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-wizz-air`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-vueling`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-volotea`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-lufthansa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-air-france`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-klm`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-tap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rimborso-iberia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compenso`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/chi-siamo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/richiesta`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/termini`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Nuove pagine programmatiche
    ...airlineEntries,
    ...airportEntries,
    ...ec261Entries,
    ...tratteEntries,
  ]
}
