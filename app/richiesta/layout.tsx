import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invia la richiesta | Giustizia In Volo',
  description:
    "Compila la richiesta per il tuo volo in ritardo, cancellato o con imbarco negato. Valutiamo il caso alla luce del Reg. CE 261/2004.",
  alternates: { canonical: 'https://giustiziainvolo.it/richiesta' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
