import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Domande frequenti | Giustizia In Volo',
  description:
    "Risposte alle domande più comuni su ritardi, cancellazioni, negato imbarco e sul servizio di Giustizia In Volo.",
  alternates: { canonical: 'https://www.giustiziainvolo.it/faq' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
