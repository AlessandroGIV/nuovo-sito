import type { MetadataRoute } from 'next'

const BASE_URL = 'https://giustiziainvolo.it'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Aree riservate del portale agenzie e link personali delle agenzie
      disallow: ['/gestione', '/agenzie/area', '/agenzie/accedi', '/agenzie/attiva', '/r/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
