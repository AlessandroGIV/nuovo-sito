/**
 * Immagine di copertina di un articolo del blog.
 * Si sovrappone al riquadro colorato della categoria, che resta come sfondo quando l'immagine manca.
 * Le immagini stanno in public/blog/<slug>.webp e si indicano nel frontmatter con `cover` e `coverAlt`.
 */
export function BlogCoverImage({ src, alt, priority = false }: { src?: string; alt?: string; priority?: boolean }) {
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      className="absolute inset-0 h-full w-full object-cover"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
