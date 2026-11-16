import { airlines } from '@/lib/airlines-data'
import { aeroporto, distanzaKm, type AeroportoTratta } from './aeroporti'

/**
 * Lotto di tratte per le pagine /voli/[vettore]/[tratta]/[disservizio].
 *
 * Ogni tratta è stata riscontrata sull'elenco "Airlines and destinations" della pagina Wikipedia
 * (edizione inglese) dell'aeroporto di partenza, come collegamento non stagionale del vettore.
 * Non si aggiungono tratte a memoria. Chi aggiunge una tratta indica fonte e data della verifica.
 * L'operativo cambia a ogni stagione IATA, quindi l'audit settimanale ricontrolla il lotto.
 */
export const VERIFICA_TRATTE = {
  data: '2026-11-16',
  fonte: 'Elenchi "Airlines and destinations" delle pagine Wikipedia (EN) degli aeroporti di partenza',
} as const

/** vettore (slug di lib/airlines-data) → aeroporto di partenza → destinazioni */
const LOTTO: Record<string, Record<string, string[]>> = {
  ryanair: {
    BRI: ['AGP', 'MAD', 'STN', 'CRL', 'BGY', 'MXP', 'BLQ', 'FCO', 'TRN', 'VCE'],
    FCO: ['BCN', 'MAD', 'AGP', 'SVQ', 'LIS', 'DUB', 'CTA', 'PMO', 'BRI', 'TFS'],
    MXP: ['BCN', 'MAD', 'CTA', 'PMO', 'BRI', 'NAP', 'STN', 'DUB'],
    BGY: ['BCN', 'MAD', 'AGP', 'LIS', 'STN', 'DUB', 'CRL', 'CTA', 'PMO', 'BRI', 'NAP', 'CAG'],
    NAP: ['BCN', 'STN', 'DUB', 'BGY', 'MXP', 'VCE', 'CTA', 'PMO'],
    CTA: ['FCO', 'MXP', 'BGY', 'BLQ', 'VCE', 'TRN', 'PSA', 'NAP', 'STN'],
    BLQ: ['BCN', 'MAD', 'AGP', 'STN', 'DUB', 'CTA', 'PMO', 'BRI', 'CAG'],
    VCE: ['BCN', 'STN', 'DUB', 'CTA', 'PMO', 'NAP'],
  },
  easyjet: {
    BRI: ['MXP', 'LGW'],
    FCO: ['LGW', 'ORY', 'BER', 'NCE'],
    MXP: ['BCN', 'LGW', 'AMS', 'CDG', 'LIS', 'CTA', 'PMO', 'NAP', 'BRI'],
    NAP: ['LGW', 'ORY', 'BER', 'MXP', 'BCN'],
    CTA: ['MXP', 'NAP', 'LGW'],
    VCE: ['LGW', 'CDG', 'ORY', 'AMS'],
  },
  'wizz-air': {
    BRI: ['BUD', 'TIA'],
    FCO: ['BUD', 'TIA', 'MAD', 'BCN', 'OTP'],
    MXP: ['BUD', 'OTP', 'TIA', 'CTA', 'MAD'],
    BGY: ['OTP', 'TIA'],
    NAP: ['BUD', 'TIA'],
    CTA: ['BLQ', 'MXP', 'VCE'],
    BLQ: ['CTA', 'TIA'],
    VCE: ['CTA', 'NAP', 'LTN'],
  },
  vueling: {
    BRI: ['BCN'],
    FCO: ['BCN', 'BIO', 'AGP'],
    MXP: ['BCN'],
    NAP: ['BCN'],
    CTA: ['BCN'],
    BLQ: ['BCN'],
    VCE: ['BCN'],
  },
  volotea: {
    NAP: ['TRN', 'VCE', 'GOA', 'PMO'],
    CTA: ['VRN'],
    VCE: ['NAP'],
  },
  'ita-airways': {
    BRI: ['LIN', 'FCO'],
    FCO: ['LIN', 'CTA', 'PMO', 'BRI', 'MAD', 'BCN', 'CDG', 'LHR', 'AMS', 'FRA'],
    NAP: ['LIN', 'FCO'],
    CTA: ['LIN', 'FCO'],
    BLQ: ['FCO'],
    VCE: ['FCO'],
  },
}

export type Fascia = 'a' | 'b'

export interface Tratta {
  vettoreSlug: string
  vettoreNome: string
  da: AeroportoTratta
  a: AeroportoTratta
  /** es. "bari-malaga" */
  slug: string
  /** Distanza ortodromica arrotondata ai 10 km */
  km: number
  /** Lettera dell'art. 7 par. 1 Reg. CE 261/2004 applicabile a un volo diretto */
  fascia: Fascia
  importo: 250 | 400
  /** Soglia di ritardo alla partenza che fa scattare l'assistenza ex art. 6 par. 1 */
  oreAssistenza: 2 | 3
  /** Partenza e arrivo entrambi in aeroporti dell'Unione */
  intraUe: boolean
  nazionale: boolean
}

/** Margine di sicurezza attorno alla soglia dei 1.500 km: le tratte troppo vicine non si pubblicano. */
const MARGINE_KM = 40

function costruisci(): Tratta[] {
  const out: Tratta[] = []
  const viste = new Set<string>()
  for (const [vettoreSlug, partenze] of Object.entries(LOTTO)) {
    const vettore = airlines.find((x) => x.slug === vettoreSlug)
    if (!vettore) throw new Error(`[seo] Vettore ${vettoreSlug} assente da lib/airlines-data.ts`)
    for (const [daIata, destinazioni] of Object.entries(partenze)) {
      for (const aIata of destinazioni) {
        // Una sola pagina per coppia di aeroporti e vettore: il verso opposto non si duplica.
        const chiave = `${vettoreSlug}|${[daIata, aIata].sort().join('-')}`
        if (viste.has(chiave)) continue
        viste.add(chiave)

        const da = aeroporto(daIata)
        const a = aeroporto(aIata)
        if (!da.ue) throw new Error(`[seo] ${daIata}: le pagine tratta partono solo da aeroporti UE`)
        const esatta = distanzaKm(da, a)
        if (Math.abs(esatta - 1500) < MARGINE_KM) {
          throw new Error(
            `[seo] ${daIata}-${aIata}: ${Math.round(esatta)} km, troppo vicina alla soglia dei 1.500 km per indicare un importo certo`
          )
        }
        if (esatta > 3500 && !a.ue) {
          throw new Error(`[seo] ${daIata}-${aIata}: tratta extra UE oltre 3.500 km non gestita dal modello`)
        }
        const fascia: Fascia = esatta <= 1500 ? 'a' : 'b'
        out.push({
          vettoreSlug,
          vettoreNome: vettore.name,
          da,
          a,
          slug: `${da.slug}-${a.slug}`,
          km: Math.round(esatta / 10) * 10,
          fascia,
          importo: fascia === 'a' ? 250 : 400,
          oreAssistenza: fascia === 'a' ? 2 : 3,
          intraUe: da.ue && a.ue,
          nazionale: da.paese === a.paese,
        })
      }
    }
  }
  return out
}

export const tratte: Tratta[] = costruisci()

export function getTratta(vettoreSlug: string, slug: string): Tratta | undefined {
  return tratte.find((t) => t.vettoreSlug === vettoreSlug && t.slug === slug)
}

export function tratteDelVettore(vettoreSlug: string): Tratta[] {
  return tratte.filter((t) => t.vettoreSlug === vettoreSlug)
}

/** Tratte che toccano un aeroporto, in partenza o in arrivo. */
export function tratteDaAeroporto(iata: string): Tratta[] {
  return tratte.filter((t) => t.da.iata === iata || t.a.iata === iata)
}

export function titoloTratta(t: Tratta): string {
  return `${t.da.nome} – ${t.a.nome}`
}
