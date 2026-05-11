import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Rimborso Volo Wizz Air | Ritardo o Cancellazione – Fino a €600 – Giustizia In Volo',
  description:
    'Wizz Air ha cancellato o ritardato il tuo volo? Hai diritto fino a €600. No win, no fee.',
}

const steps = [
  {
    n: '1',
    title: 'Inviaci i dati del volo',
    description:
      'Compila il modulo con numero volo, data e motivo della cancellazione o ritardo. La valutazione è gratuita e senza impegno.',
  },
  {
    n: '2',
    title: 'Un avvocato segue il tuo caso',
    description:
      'Un nostro legale analizza la situazione e contatta Wizz Air per tuo conto. Nessun anticipo richiesto.',
  },
  {
    n: '3',
    title: 'Ricevi il rimborso',
    description:
      'In caso di successo ottieni fino a €600. Tratteniamo solo una quota concordata sul rimborso effettivamente ottenuto.',
  },
]

export default function RimborsoWizzAirPage() {
  return (
    <main className="bg-[#072534] text-white">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Il tuo volo Wizz Air è stato cancellato o in ritardo? Hai diritto fino a €600.
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
          Il Regolamento CE 261/2004 obbliga Wizz Air a risarcirti. Noi ci occupiamo di tutto:
          nessun anticipo, nessuna burocrazia. Paghiamo solo se otteniamo il rimborso.
        </p>
        <Link
          href="/richiesta"
          className="mt-8 inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Richiedi il rimborso ora — è gratis
        </Link>
      </section>

      {/* Come funziona */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-10">
            Come funziona
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl bg-white/5 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC300] text-[#072534] font-bold text-lg">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-[#FFC300]">{s.title}</h3>
                <p className="mt-2 text-white/85">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/85 text-lg mb-6">
          Hai 3 anni di tempo per reclamare il tuo rimborso. Non aspettare.
        </p>
        <Link
          href="/richiesta"
          className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Inizia la tua richiesta
        </Link>
      </section>
    </main>
  )
}
