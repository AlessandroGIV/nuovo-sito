import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { airports, getAirport } from '@/lib/airports-data'

interface Props {
  params: Promise<{ aeroporto: string }>
}

export async function generateStaticParams() {
  return airports.map((a) => ({ aeroporto: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { aeroporto } = await params
  const airport = getAirport(aeroporto)
  if (!airport) return {}
  return {
    title: `Volo in Ritardo da ${airport.citta} (${airport.code}) | Rimborso Fino a €600 – Giustizia In Volo`,
    description: `Volo cancellato o in ritardo dall'${airport.name}? Hai diritto fino a €600 ai sensi del Reg. CE 261/2004. Nessun anticipo: Giustizia In Volo ti rimborsa.`,
  }
}

export default async function AeroportoPage({ params }: Props) {
  const { aeroporto } = await params
  const airport = getAirport(aeroporto)
  if (!airport) notFound()

  const isItalian = airport.paese === 'Italia'

  return (
    <main className="bg-[#072534] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <nav className="text-sm text-white/50 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/aeroporti" className="hover:text-white transition-colors">Aeroporti</Link>
          <span>/</span>
          <span className="text-white/80">{airport.citta} ({airport.code})</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/60 text-sm mb-3 uppercase tracking-widest">
          {airport.paese}{airport.regione ? ` · ${airport.regione}` : ''} · Codice IATA: {airport.code}
        </p>
        <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Volo in ritardo o cancellato da {airport.citta}?
          <br />Hai diritto fino a €600.
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
          {isItalian
            ? `Se il tuo volo è partito dall'${airport.name} (${airport.code}) ed è stato cancellato o è arrivato con oltre 3 ore di ritardo, il Regolamento CE 261/2004 ti garantisce un risarcimento. Giustizia In Volo lo ottiene per te senza costi anticipati.`
            : `Tutti i voli in partenza dall'${airport.name} (${airport.code}) operati da compagnie europee sono coperti dal Reg. CE 261/2004. Se hai subito un disservizio, hai diritto al risarcimento.`}
        </p>
        <Link
          href="/richiesta"
          className="mt-8 inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Richiedi il rimborso — è gratis
        </Link>
      </section>

      {/* Quando si applica il regolamento */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-10">
            Quando hai diritto al risarcimento per voli da {airport.citta}?
          </h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                icon: '⏱️',
                title: 'Ritardo oltre 3 ore',
                desc: `Se il tuo volo dall'${airport.code} è arrivato a destinazione con più di 3 ore di ritardo, hai diritto a €250–€600.`,
              },
              {
                icon: '✈️',
                title: 'Volo cancellato',
                desc: `Se la compagnia ha cancellato il tuo volo da ${airport.citta} senza adeguato preavviso, hai diritto al rimborso del biglietto e al risarcimento.`,
              },
              {
                icon: '🚫',
                title: 'Imbarco negato',
                desc: `Se ti hanno negato l'imbarco per overbooking all'${airport.code}, hai diritto immediato a €250–€600 più assistenza.`,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-[#072534] border border-white/10 p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-[#FFC300] font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Importi */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8">
          Quanto vale il tuo rimborso?
        </h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
          {[
            { distanza: 'Fino a 1.500 km', importo: '€250', esempio: 'Voli brevi' },
            { distanza: '1.500 – 3.500 km', importo: '€400', esempio: 'Voli medi' },
            { distanza: 'Oltre 3.500 km', importo: '€600', esempio: 'Voli intercontinentali' },
          ].map((row) => (
            <div key={row.distanza} className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-white/60 text-sm mb-2">{row.distanza}</p>
              <p className="text-[#FFC300] text-4xl font-extrabold">{row.importo}</p>
              <p className="text-white/50 text-xs mt-2">{row.esempio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8 text-center">
            Domande frequenti — Aeroporto di {airport.citta}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: `Il mio volo è partito dall'${airport.name}: si applica il Reg. CE 261/2004?`,
                a: isItalian
                  ? `Sì, tutti i voli in partenza dall'${airport.code} sono coperti dal Reg. CE 261/2004, indipendentemente dalla nazionalità della compagnia aerea o del passeggero.`
                  : `I voli in partenza dall'${airport.code} operati da compagnie europee sono coperti dal Reg. CE 261/2004. Se la compagnia è extraeuropea, dipende dalla rotta.`,
              },
              {
                q: `Quanto tempo ho per presentare la richiesta di rimborso per un volo da ${airport.citta}?`,
                a: `In Italia hai 3 anni dalla data del volo per richiedere il risarcimento. Non aspettare: più tempo passa, più è difficile raccogliere le prove.`,
              },
              {
                q: `Cosa devo conservare come prova del disservizio subito all'${airport.code}?`,
                a: `Conserva: carta d'imbarco originale, prenotazione, comunicazioni della compagnia (email, SMS), ricevute di eventuali spese extra e screenshot del tracking del volo.`,
              },
              {
                q: `La compagnia ha offerto un buono per il disservizio all'${airport.code}. Devo accettarlo?`,
                a: `Non sei obbligato ad accettare un voucher. Hai sempre diritto al risarcimento in denaro previsto dalla legge. Prima di accettare qualsiasi offerta, contattaci per valutare se è adeguata.`,
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl bg-[#072534] p-6">
                <h3 className="text-[#FFC300] font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-white/85">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/85 text-lg mb-6">
          Hai subito un disservizio con un volo da {airport.citta}? Non perdere il tuo diritto al rimborso.
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
