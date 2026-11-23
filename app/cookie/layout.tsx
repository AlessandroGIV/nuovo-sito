import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie policy | Giustizia In Volo',
  description:
    "Quali cookie usa il sito giustiziainvolo.it, a che cosa servono e come gestire il consenso.",
  alternates: { canonical: 'https://www.giustiziainvolo.it/cookie' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
