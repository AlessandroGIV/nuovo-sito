import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ec261Pages, getEc261Page } from '@/lib/ec261-data'

interface Props {
  params: Promise<{ keyword: string }>
}

export async function generateStaticParams() {
  return ec261Pages.map((p) => ({ keyword: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params
  const page = getEc261Page(keyword)
  if (!page) return {}
  return {
    title: page.title,
    description: page.metaDescription,
  }
}

export default async function Ec261KeywordPage({ params }: Props) {
  const { keyword } = await params
  const page = getEc261Page(keyword)
  if (!page) notFound()

  return (
    <main className="bg-[#072534] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <nav className="text-sm text-white/50 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/faq" className="hover:text-white transition-colors">Diritti Passeggeri</Link>
          <span>/</span>
          <span className="text-white/80">{page.h1}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/60 text-sm mb-3 uppercase tracking-widest">
          Reg. CE 261/2004 · Diritti Passeggeri
        </p>
        <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          {page.h1}
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
          {page.intro}
        </p>
        <Link
          href="/richiesta"
          className="mt-8 inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Verifica subito il tuo rimborso — è gratis
        </Link>
      </section>

      {/* Come funziona */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-10">
            Come ottieni il rimborso con Giustizia In Volo
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n: '1', title: 'Inviaci i dati', desc: 'Compila il modulo con i dettagli del volo. La valutazione è gratuita e senza impegno.' },
              { n: '2', title: 'Ci occupiamo di tutto', desc: 'Un avvocato contatta la compagnia per tuo conto. Zero burocrazia per te.' },
              { n: '3', title: 'Ricevi il rimborso', desc: 'Ottieni fino a €600. Paghiamo solo se vinciamo: nessun rischio per te.' },
            ].map((s) => (
              <div key={s.n} className="rounded-xl bg-[#072534] border border-white/10 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC300] text-[#072534] font-bold text-lg">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-[#FFC300]">{s.title}</h3>
                <p className="mt-2 text-white/85">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Importi */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8">
          Quanto puoi ricevere?
        </h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
          {[
            { distanza: 'Voli fino a 1.500 km', importo: '€250' },
            { distanza: 'Voli 1.500 – 3.500 km', importo: '€400' },
            { distanza: 'Voli oltre 3.500 km', importo: '€600' },
          ].map((row) => (
            <div key={row.distanza} className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
              <p className="text-white/60 text-sm mb-2">{row.distanza}</p>
              <p className="text-[#FFC300] text-4xl font-extrabold">{row.importo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8 text-center">
            Domande frequenti
          </h2>
          <div className="space-y-4">
            {page.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl bg-[#072534] p-6">
                <h3 className="text-[#FFC300] font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-white/85">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link ad altre pagine correlate */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="text-center text-xl font-extrabold text-[#FFC300] mb-6">
          Approfondisci i tuoi diritti
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/ec261/ritardo-aereo', label: 'Ritardo aereo' },
            { href: '/ec261/volo-cancellato', label: 'Volo cancellato' },
            { href: '/ec261/overbooking', label: 'Overbooking' },
            { href: '/ec261/bagaglio-smarrito', label: 'Bagaglio smarrito' },
            { href: '/ec261/diritti-passeggeri-aereo', label: 'Diritti passeggeri' },
            { href: '/faq', label: 'Tutte le FAQ' },
          ].filter(l => l.href !== `/ec261/${keyword}`).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white hover:border-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA finale */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="rounded-2xl bg-white/5 p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#FFC300] mb-3">
            Hai subito un disservizio aereo?
          </h2>
          <p className="text-white/85 mb-6">
            Hai 3 anni di tempo. Non aspettare: verifica subito se hai diritto al rimborso.
          </p>
          <Link
            href="/richiesta"
            className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            Inizia ora — nessun costo
          </Link>
        </div>
      </section>
    </main>
  )
}
