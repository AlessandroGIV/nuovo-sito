import type { Metadata } from 'next'
import Link from 'next/link'
import { DISSERVIZI } from '@/lib/seo/disservizi'
import { titoloTratta, tratte } from '@/lib/seo/tratte'

import { SITE_URL as BASE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Ritardi e cancellazioni per compagnia e tratta | Giustizia In Volo',
  description:
    'Quanto spetta per ritardo, cancellazione o negato imbarco sul tuo volo. Importi del Reg. CE 261/2004 calcolati tratta per tratta, compagnia per compagnia.',
  alternates: { canonical: `${BASE_URL}/voli` },
}

export default function VoliIndex() {
  const perVettore = new Map<string, typeof tratte>()
  for (const t of tratte) {
    const lista = perVettore.get(t.vettoreSlug) ?? []
    lista.push(t)
    perVettore.set(t.vettoreSlug, lista)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Voli e tratte', item: `${BASE_URL}/voli` },
    ],
  }

  return (
    <main className="bg-[#072534] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/60 text-sm mb-3 uppercase tracking-widest">Reg. CE 261/2004 · Tratta per tratta</p>
        <h1 className="text-[#FFC300] text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Ritardi, cancellazioni e overbooking per compagnia e tratta
        </h1>
        <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
          Scegli la compagnia e il collegamento. Per ogni tratta trovi la distanza, l&apos;importo della compensazione e le
          regole che si applicano al tuo caso, con le fonti.
        </p>
      </section>

      {[...perVettore.entries()].map(([slug, lista]) => (
        <section key={slug} className="border-t border-white/10">
          <div className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-extrabold text-[#FFC300] mb-6">
              <Link href={`/compagnie-aeree/${slug}`} className="hover:underline">{lista[0].vettoreNome}</Link>
            </h2>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((t) => (
                <li key={t.slug} className="text-white/85">
                  <span className="font-semibold">{titoloTratta(t)}</span>
                  <span className="text-white/45"> · {t.importo} €</span>
                  <div className="text-sm">
                    {DISSERVIZI.map((d, i) => (
                      <span key={d.slug}>
                        {i > 0 && <span className="text-white/30"> · </span>}
                        <Link
                          href={`/voli/${t.vettoreSlug}/${t.slug}/${d.slug}`}
                          className="text-white/65 hover:text-white underline-offset-2 hover:underline"
                        >
                          {d.etichetta}
                        </Link>
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="container mx-auto px-4 py-14 text-center">
        <p className="text-white/85 text-lg mb-6">Non trovi la tua tratta? Il regolamento si applica comunque.</p>
        <Link
          href="/richiesta"
          className="inline-block rounded-full bg-[#FFC300] px-8 py-4 text-[#072534] font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          Verifica gratis il tuo volo
        </Link>
      </section>
    </main>
  )
}
