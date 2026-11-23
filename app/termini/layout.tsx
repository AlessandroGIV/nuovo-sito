import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini e condizioni | Giustizia In Volo',
  description:
    "Termini e condizioni del servizio di assistenza ai passeggeri aerei di Giustizia In Volo.",
  alternates: { canonical: 'https://www.giustiziainvolo.it/termini' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
