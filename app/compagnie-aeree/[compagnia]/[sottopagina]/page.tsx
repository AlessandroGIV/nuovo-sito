import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { airlines, airlineSubpages, getAirline, getSubpage } from '@/lib/airlines-data'

interface Props {
  params: Promise<{ compagnia: string; sottopagina: string }>
}

export async function generateStaticParams() {
  const params: { compagnia: string; sottopagina: string }[] = []
  for (const airline of airlines) {
    for (const sub of airlineSubpages) {
      params.push({ compagnia: airline.slug, sottopagina: sub.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { compagnia, sottopagina } = await params
  const airline = getAirline(compagnia)
  const subpage = getSubpage(sottopagina)
  if (!airline || !subpage) return {}
  return {
    title: subpage.title(airline.name),
    description: subpage.description(airline.name),
  }
}

export default async function SottopaginaCompagniaPage({ params }: Props) {
  const { compagnia, sottopagina } = await params
  const airline = getAirline(compagnia)
  const subpage = getSubpage(sottopagina)
  if (!airline || !subpage) notFound()

  const faqs = subpage.faqs(airline.name)

  return (
    <main className="bg-[#072534] text-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <nav className="text-sm text-white/50 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/compagnie-aeree/${compagnia}`} className="hover:text-white transition-colors">
            {airline.name}
          </Link>
          <span>/</span>
          <span className="text-white/80">{subpage.label}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-[#FFC300] text-3xl md:text-4xl font-extrabold leading-tight max-w-3xl mx-auto">
          {subpage.h1(airline.name)}
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
          {subpage.intro(airline.name)}
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-3">
            {airlineSubpages.map((s) => (
              <Link
                key={s.slug}
                href={`/compagnie-aeree/${compagnia}/${s.slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  s.slug === sottopagina
                    ? 'bg-[#FFC300] text-[#072534] border-[#FFC300]'
                    : 'border-[#FFC300]/40 text-[#FFC300] hover:bg-[#FFC300] hover:text-[#072534]'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8 text-center">
          Domande frequenti
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-white/5 p-6">
              <h3 className="text-[#FFC300] font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-white/85">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA finale */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="rounded-2xl bg-white/5 p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#FFC300] mb-3">
            Pronto a ottenere il tuo rimborso da {airline.name}?
          </h2>
          <p className="text-white/85 mb-6">
            Nessun costo anticipato. Paghiamo solo se otteniamo il risarcimento per te.
          </p>
          <Link
            href="/richiesta"
            className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            Inizia ora — nessun rischio
          </Link>
        </div>
      </section>
    </main>
  )
}
