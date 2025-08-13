import { BadgeCheck } from 'lucide-react'

export default function ComeFunzionaPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">Come Funziona</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          Un processo semplice e trasparente per ottenere il tuo risarcimento senza stress.
        </p>
      </section>

      <section className="bg-white/5">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Contattaci',
              d: 'Compila il modulo con i dati del tuo volo o scrivici direttamente via email. Valuteremo gratuitamente il tuo caso.',
            },
            {
              n: '2',
              t: 'Ti seguiamo personalmente',
              d: 'Un avvocato reale, non un algoritmo, si occuperà del tuo caso. Nessun anticipo richiesto.',
            },
            {
              n: '3',
              t: 'Ricevi il tuo rimborso',
              d: 'In caso di successo, ricevi il risarcimento. Tratteniamo solo una piccola quota concordata.',
            },
          ].map((s) => (
            <div key={s.n} className="rounded-xl bg-white/5 p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC300] text-[#072534] font-bold text-lg">
                {s.n}
              </div>
              <h3 className="text-xl font-bold text-[#FFC300]">{s.t}</h3>
              <p className="mt-2 text-white/85">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
