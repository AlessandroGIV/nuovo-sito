import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quanto costa il servizio | Giustizia In Volo',
  description:
    "Come funziona il compenso di Giustizia In Volo per l'assistenza ai passeggeri aerei.",
  alternates: { canonical: 'https://www.giustiziainvolo.it/compenso' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
