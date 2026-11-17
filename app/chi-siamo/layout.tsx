import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chi siamo | Giustizia In Volo',
  description:
    "Chi c'è dietro Giustizia In Volo, il servizio di assistenza ai passeggeri per i diritti del Reg. CE 261/2004.",
  alternates: { canonical: 'https://giustiziainvolo.it/chi-siamo' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
