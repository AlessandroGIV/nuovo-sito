import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { airports } from '@/lib/airports-data'
import { fonte, type FonteId } from '@/lib/seo/fonti'
import { contenuto, DISSERVIZI, isDisservizio, migliaia } from '@/lib/seo/disservizi'
import { getTratta, titoloTratta, tratte, VERIFICA_TRATTE, type Tratta } from '@/lib/seo/tratte'

const BASE_URL = 'https://giustiziainvolo.it'

interface Props {
  params: Promise<{ vettore: string; tratta: string; disservizio: string }>
}

// Solo le combinazioni presenti nel lotto verificato: tutto il resto è 404.
export const dynamicParams = false

export function generateStaticParams() {
  return tratte.flatMap((t) =>
    DISSERVIZI.map((d) => ({ vettore: t.vettoreSlug, tratta: t.slug, disservizio: d.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vettore, tratta, disservizio } = await params
  const t = getTratta(vettore, tratta)
  if (!t || !isDisservizio(disservizio)) return {}
  const c = contenuto(t, disservizio)
  const url = `${BASE_URL}/voli/${vettore}/${tratta}/${disservizio}`
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    openGraph: { title: c.h1, description: c.description, url, type: 'article' },
  }
}

const dataIt = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

function hrefTratta(t: Tratta, disservizio: string) {
  return `/voli/${t.vettoreSlug}/${t.slug}/${disservizio}`
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white hover:border-white transition-colors"
    >
      {children}
    </Link>
  )
}

export default async function PaginaTratta({ params }: Props) {
  const { vettore, tratta, disservizio } = await params
  const t = getTratta(vettore, tratta)
  if (!t || !isDisservizio(disservizio)) notFound()

  const c = contenuto(t, disservizio)
  const url = `${BASE_URL}${hrefTratta(t, disservizio)}`
  const tr = titoloTratta(t)

  // Fonti citate nella pagina, nell'ordine in cui compaiono
  const idFonti: FonteId[] = []
  for (const s of c.sezioni) for (const p of s.paragrafi) for (const f of p.fonti) if (!idFonti.includes(f)) idFonti.push(f)
  const numero = (id: FonteId) => idFonti.indexOf(id) + 1

  // Link interni
  const altriDisservizi = DISSERVIZI.filter((d) => d.slug !== disservizio)
  const stessaTrattaAltriVettori = tratte.filter(
    (x) =>
      x.vettoreSlug !== t.vettoreSlug &&
      ((x.da.iata === t.da.iata && x.a.iata === t.a.iata) || (x.da.iata === t.a.iata && x.a.iata === t.da.iata))
  )
  const altreTratteVettore = tratte
    .filter((x) => x.vettoreSlug === t.vettoreSlug && x.slug !== t.slug && (x.da.iata === t.da.iata || x.a.iata === t.da.iata))
    .slice(0, 10)
  const paginaAeroporto = (iata: string) => airports.find((a) => a.code === iata)
  const aeroportiCollegati = [t.da, t.a]
    .map((a) => ({ a, pagina: paginaAeroporto(a.iata) }))
    .filter((x) => x.pagina)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Voli e tratte', item: `${BASE_URL}/voli` },
        { '@type': 'ListItem', position: 3, name: t.vettoreNome, item: `${BASE_URL}/compagnie-aeree/${t.vettoreSlug}` },
        { '@type': 'ListItem', position: 4, name: `${c.etichetta} ${tr}`, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.h1,
      description: c.description,
      inLanguage: 'it-IT',
      dateModified: VERIFICA_TRATTE.data,
      author: { '@type': 'Organization', name: 'Giustizia In Volo', url: BASE_URL },
      publisher: { '@type': 'Organization', name: 'Giustizia In Volo', url: BASE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      about: [
        { '@type': 'Airline', name: t.vettoreNome },
        { '@type': 'Airport', name: t.da.nome, iataCode: t.da.iata },
        { '@type': 'Airport', name: t.a.nome, iataCode: t.a.iata },
      ],
      citation: idFonti.map((id) => {
        const f = fonte(id)
        return { '@type': f.tipo === 'normativa' ? 'Legislation' : 'CreativeWork', name: f.estremi, ...(f.url ? { url: f.url } : {}) }
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <main className="bg-[#072534] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <nav aria-label="Percorso" className="text-sm text-white/50 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/voli" className="hover:text-white transition-colors">Voli e tratte</Link>
          <span>/</span>
          <Link href={`/compagnie-aeree/${t.vettoreSlug}`} className="hover:text-white transition-colors">{t.vettoreNome}</Link>
          <span>/</span>
          <span className="text-white/80">{c.etichetta} {tr}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/60 text-sm mb-3 uppercase tracking-widest">
          {t.vettoreNome} · {t.da.iata} – {t.a.iata} · Reg. CE 261/2004
        </p>
        <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight max-w-4xl mx-auto">
          {c.h1}
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">{c.intro}</p>
        <Link
          href="/richiesta"
          className="mt-8 inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Verifica gratis il tuo volo
        </Link>
      </section>

      {/* Dati della tratta */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-10">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { k: 'Tratta', v: tr },
              { k: 'Distanza ortodromica', v: `circa ${migliaia(t.km)} km` },
              { k: 'Compensazione a passeggero', v: `${t.importo} €` },
              { k: 'Norma applicabile', v: `art. 7, par. 1, lett. ${t.fascia})` },
            ].map((d) => (
              <div key={d.k} className="rounded-xl bg-[#072534] border border-white/10 p-5 text-center">
                <dt className="text-white/60 text-sm mb-1">{d.k}</dt>
                <dd className="text-[#FFC300] text-xl font-extrabold">{d.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Contenuto giuridico */}
      <section className="container mx-auto px-4 py-14 max-w-3xl">
        {c.sezioni.map((s) => (
          <div key={s.titolo} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-5">{s.titolo}</h2>
            <div className="space-y-4">
              {s.paragrafi.map((p, i) => (
                <p key={i} className="text-white/85 leading-relaxed">
                  {p.testo}{' '}
                  {p.fonti.map((id) => (
                    <a key={id} href={`#fonte-${numero(id)}`} className="text-[#FFC300] text-sm align-super hover:underline">
                      [{numero(id)}]
                    </a>
                  ))}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* Fonti */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-extrabold text-[#FFC300] mb-4">Fonti</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-white/80">
            {idFonti.map((id) => {
              const f = fonte(id)
              return (
                <li key={id} id={`fonte-${numero(id)}`}>
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                      {f.estremi}
                    </a>
                  ) : (
                    f.estremi
                  )}
                </li>
              )
            })}
          </ol>
          <p className="mt-4 text-xs text-white/55 leading-relaxed">
            {t.stagionale
              ? `Collegamento stagionale, con ultimi voli riscontrati a ${t.stagionale}.`
              : `Tratta riscontrata nell'operativo del vettore il ${dataIt(VERIFICA_TRATTE.data)}.`}{' '}
            I collegamenti cambiano a ogni stagione. Questa pagina ha scopo informativo e non sostituisce la valutazione del caso concreto.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#FFC300] mb-8 text-center">Domande frequenti</h2>
          <div className="space-y-4">
            {c.faq.map((f) => (
              <div key={f.q} className="rounded-xl bg-[#072534] p-6">
                <h3 className="text-[#FFC300] font-bold text-lg mb-2">{f.q}</h3>
                <p className="text-white/85">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link interni */}
      <section className="container mx-auto px-4 py-14 space-y-10">
        <div>
          <h2 className="text-center text-xl font-extrabold text-[#FFC300] mb-5">
            Altri disservizi sul volo {t.vettoreNome} {tr}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {altriDisservizi.map((d) => (
              <Pill key={d.slug} href={hrefTratta(t, d.slug)}>{d.etichetta} {tr}</Pill>
            ))}
            <Pill href={c.hrefGuida}>Guida generale</Pill>
            <Pill href={`/compagnie-aeree/${t.vettoreSlug}`}>Rimborso {t.vettoreNome}</Pill>
          </div>
        </div>

        {stessaTrattaAltriVettori.length > 0 && (
          <div>
            <h2 className="text-center text-xl font-extrabold text-[#FFC300] mb-5">La stessa tratta con altre compagnie</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {stessaTrattaAltriVettori.map((x) => (
                <Pill key={x.vettoreSlug} href={hrefTratta(x, disservizio)}>
                  {c.etichetta} {x.vettoreNome} {titoloTratta(x)}
                </Pill>
              ))}
            </div>
          </div>
        )}

        {altreTratteVettore.length > 0 && (
          <div>
            <h2 className="text-center text-xl font-extrabold text-[#FFC300] mb-5">
              Altre tratte {t.vettoreNome} da e per {t.da.nome}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {altreTratteVettore.map((x) => (
                <Pill key={x.slug} href={hrefTratta(x, disservizio)}>{titoloTratta(x)}</Pill>
              ))}
            </div>
          </div>
        )}

        {aeroportiCollegati.length > 0 && (
          <div>
            <h2 className="text-center text-xl font-extrabold text-[#FFC300] mb-5">Aeroporti della tratta</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {aeroportiCollegati.map(({ a, pagina }) => (
                <Pill key={a.iata} href={`/aeroporti/${pagina!.slug}`}>Diritti dei passeggeri a {a.nome}</Pill>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA finale */}
      <section className="container mx-auto px-4 pb-14 text-center">
        <div className="rounded-2xl bg-white/5 p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#FFC300] mb-3">
            Hai volato con {t.vettoreNome} tra {t.da.nome} e {t.a.nome}?
          </h2>
          <p className="text-white/85 mb-6">
            Inviaci i dati del volo. Controlliamo senza costi se la compensazione ti spetta e ti diciamo come procedere.
          </p>
          <Link
            href="/richiesta"
            className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            Inizia la richiesta
          </Link>
        </div>
      </section>
    </main>
  )
}
