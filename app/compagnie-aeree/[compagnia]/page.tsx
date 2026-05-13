import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { airlines, airlineSubpages, getAirline } from '@/lib/airlines-data'

interface Props {
  params: Promise<{ compagnia: string }>
}

export async function generateStaticParams() {
  return airlines.map((a) => ({ compagnia: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { compagnia } = await params
  const airline = getAirline(compagnia)
  if (!airline) return {}
  return {
    title: `Rimborso Volo ${airline.name} | Fino a €600 – Giustizia In Volo`,
    description: `Volo ${airline.name} cancellato, in ritardo o overbooking? Hai diritto fino a €600 ai sensi del Reg. CE 261/2004. Nessun anticipo: paghiamo solo se vinciamo.`,
  }
}

export default async function CompagniaPage({ params }: Props) {
  const { compagnia } = await params
  const airline = getAirline(compagnia)
  if (!airline) notFound()

  const subpages = airlineSubpages.map((s) => ({
    slug: s.slug,
    label: s.label,
    href: `/compagnie-aeree/${compagnia}/${s.slug}`,
  }))

  return (
    <main className="bg-[#072534] text-white">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-white/60 text-sm mb-3 uppercase tracking-widest">
          {airline.paese} · {airline.tipo === 'low-cost' ? 'Low Cost' : 'Compagnia Tradizionale'} · {airline.iata}
        </p>
        <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Rimborso volo {airline.name}: fino a €600 se hai subito un disservizio
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
          Il Regolamento CE 261/2004 obbliga {airline.name} a risarcirti per voli cancellati, in ritardo di oltre 3 ore o con imbarco negato. Nessun anticipo, nessuna burocrazia.
        </p>
        <Link
          href="/richiesta"
          className="mt-8 inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Richiedi il rimborso — è gratis
        </Link>
      </section>

      {/* Navigazione sottopagine */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-center text-lg font-semibold text-white/70 mb-6">
            Scopri tutto su {airline.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {subpages.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="rounded-full border border-[#FFC300]/50 px-5 py-2 text-[#FFC300] hover:bg-[#FFC300] hover:text-[#072534] transition-colors font-medium"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-10">
          Come funziona con {airline.name}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              n: '1',
              title: 'Inviaci i dati del volo',
              desc: `Compila il modulo con il numero del tuo volo ${airline.name}, la data e il tipo di disservizio. La valutazione è gratuita.`,
            },
            {
              n: '2',
              title: 'Un avvocato segue il tuo caso',
              desc: `Un nostro legale analizza la situazione e contatta ${airline.name} per tuo conto. Zero burocrazia per te.`,
            },
            {
              n: '3',
              title: 'Ricevi il risarcimento',
              desc: `Se ${airline.name} è obbligata a pagare, ottieni fino a €600. Trattiamo solo una quota concordata sul rimborso ottenuto.`,
            },
          ].map((s) => (
            <div key={s.n} className="rounded-xl bg-white/5 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC300] text-[#072534] font-bold text-lg">
                {s.n}
              </div>
              <h3 className="text-xl font-bold text-[#FFC300]">{s.title}</h3>
              <p className="mt-2 text-white/85">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quanto spetta */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8">
            Quanto spetta per un volo {airline.name} in ritardo o cancellato?
          </h2>
          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            {[
              { distanza: 'Fino a 1.500 km', importo: '€250', esempio: 'Es. Roma–Milano, Napoli–Barcellona' },
              { distanza: '1.500 – 3.500 km', importo: '€400', esempio: 'Es. Roma–Londra, Milano–Atene' },
              { distanza: 'Oltre 3.500 km', importo: '€600', esempio: 'Es. Roma–New York, Milano–Dubai' },
            ].map((row) => (
              <div key={row.distanza} className="rounded-xl bg-[#072534] border border-white/10 p-6 text-center">
                <p className="text-white/60 text-sm mb-2">{row.distanza}</p>
                <p className="text-[#FFC300] text-4xl font-extrabold">{row.importo}</p>
                <p className="text-white/50 text-xs mt-2">{row.esempio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/85 text-lg mb-6">
          Hai 3 anni di tempo per reclamare il tuo rimborso da {airline.name}. Non aspettare.
        </p>
        <Link
          href="/richiesta"
          className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Inizia la tua richiesta — nessun costo
        </Link>
      </section>
    </main>
  )
}
