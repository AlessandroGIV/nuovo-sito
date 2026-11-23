import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy policy | Giustizia In Volo',
  description:
    "Come Giustizia In Volo tratta i dati personali di chi chiede assistenza per un volo in ritardo, cancellato o con imbarco negato.",
  alternates: { canonical: 'https://www.giustiziainvolo.it/privacy' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
