import { airlines } from '@/lib/airlines-data'
import { aeroporto, distanzaKm, type AeroportoTratta } from './aeroporti'

/**
 * Lotto di tratte per le pagine /voli/[vettore]/[tratta]/[disservizio].
 *
 * Ogni tratta è stata riscontrata due volte: sull'elenco "Airlines and destinations" della pagina
 * Wikipedia (EN) dell'aeroporto di partenza e sulla pagina della rotta di flightera.net, che mostra
 * i voli settimanali e i vettori che la operano. Le tratte non confermate da Flightera sono state tolte.
 * Non si aggiungono tratte a memoria. Chi aggiunge una tratta indica fonte e data della verifica.
 * L'operativo cambia a ogni stagione IATA, quindi l'audit settimanale ricontrolla il lotto.
 */
export const VERIFICA_TRATTE = {
  data: '2026-11-16',
  fonte: 'Pagine rotta di flightera.net e elenchi destinazioni delle pagine Wikipedia (EN) degli aeroporti di partenza',
} as const

/**
 * vettore (slug di lib/airlines-data) → aeroporto di partenza → destinazioni
 *
 * 17.11.2026  ricontrollate tutte le tratte in partenza da BRI e BLQ e aggiunte 14 tratte Ryanair
 *             (BRI → CTA, PMO, CAG, PSA, VRN, GOA, VIE, ATH; BLQ → BDS, SUF, OLB, LIS, VIE, ATH) e Wizz Air BLQ → OTP,
 *             tutte nell'elenco non stagionale delle pagine Wikipedia (EN) degli aeroporti di Bari e Bologna.
 *             Flightera non era leggibile in automatico (errore del sito), quindi manca il secondo riscontro.
 * 24.11.2026  ricontrollate tutte le tratte in partenza da FCO e MXP (53, tutte confermate non stagionali) e aggiunte 15 tratte:
 *             Ryanair FCO → BDS, TPS, BER, VIE, ATH; easyJet FCO → BER; Wizz Air FCO → WAW; ITA Airways FCO → BDS;
 *             Ryanair MXP → CAG, PSR, REG, SUF; easyJet MXP → OLB, BDS, CAG. Tutte nell'elenco non stagionale delle pagine
 *             Wikipedia (EN) di Fiumicino e Malpensa lette il 24.11.2026. Flightera ancora non leggibile (errore del sito),
 *             il sito di ADR non leggibile, quello di Malpensa senza elenco destinazioni: manca il secondo riscontro.
 */
const LOTTO: Record<string, Record<string, string[]>> = {
  ryanair: {
    BRI: ['AGP', 'MAD', 'STN', 'CRL', 'BGY', 'MXP', 'BLQ', 'FCO', 'TRN', 'VCE', 'CTA', 'PMO', 'CAG', 'PSA', 'VRN', 'GOA', 'VIE', 'ATH'],
    FCO: ['BCN', 'MAD', 'AGP', 'SVQ', 'LIS', 'DUB', 'CTA', 'PMO', 'BRI', 'TFS', 'BDS', 'TPS', 'BER', 'VIE', 'ATH'],
    MXP: ['BCN', 'MAD', 'CTA', 'PMO', 'BRI', 'NAP', 'STN', 'DUB', 'CAG', 'PSR', 'REG', 'SUF'],
    BGY: ['BCN', 'MAD', 'AGP', 'LIS', 'STN', 'DUB', 'CRL', 'CTA', 'PMO', 'BRI', 'NAP', 'CAG'],
    NAP: ['BCN', 'STN', 'DUB', 'BGY', 'MXP', 'VCE', 'CTA', 'PMO'],
    CTA: ['FCO', 'MXP', 'BGY', 'BLQ', 'VCE', 'TRN', 'PSA', 'NAP', 'STN'],
    BLQ: ['BCN', 'MAD', 'AGP', 'STN', 'DUB', 'CTA', 'PMO', 'BRI', 'CAG', 'BDS', 'SUF', 'OLB', 'LIS', 'VIE', 'ATH'],
    VCE: ['BCN', 'STN', 'DUB', 'CTA', 'PMO', 'NAP'],
  },
  easyjet: {
    BRI: ['MXP', 'LGW'],
    FCO: ['LGW', 'ORY', 'NCE', 'BER'],
    MXP: ['BCN', 'LGW', 'AMS', 'CDG', 'LIS', 'CTA', 'PMO', 'NAP', 'BRI', 'OLB', 'BDS', 'CAG'],
    NAP: ['LGW', 'ORY', 'MXP', 'BCN'],
    CTA: ['MXP', 'NAP', 'LGW'],
    VCE: ['LGW', 'CDG', 'ORY', 'AMS'],
  },
  'wizz-air': {
    BRI: ['BUD', 'TIA'],
    FCO: ['BUD', 'TIA', 'MAD', 'BCN', 'OTP', 'WAW'],
    MXP: ['BUD', 'OTP', 'TIA', 'CTA', 'MAD'],
    BGY: ['OTP', 'TIA'],
    NAP: ['BUD', 'TIA'],
    CTA: ['BLQ', 'MXP', 'VCE'],
    BLQ: ['CTA', 'TIA', 'OTP'],
    VCE: ['CTA', 'NAP', 'LTN'],
  },
  vueling: {
    BRI: ['BCN'],
    FCO: ['BCN', 'BIO'],
    MXP: ['BCN'],
    NAP: ['BCN'],
    CTA: ['BCN'],
    BLQ: ['BCN'],
    VCE: ['BCN'],
  },
  volotea: {
    NAP: ['TRN', 'GOA'],
    CTA: ['VRN'],
  },
  'ita-airways': {
    BRI: ['LIN', 'FCO'],
    FCO: ['LIN', 'CTA', 'PMO', 'BRI', 'MAD', 'BCN', 'CDG', 'LHR', 'AMS', 'FRA', 'BDS'],
    NAP: ['LIN', 'FCO'],
    CTA: ['LIN', 'FCO'],
    BLQ: ['FCO'],
    VCE: ['FCO'],
  },
}

/**
 * Collegamenti stagionali tenuti nel lotto perché operati di recente. Chiave "vettore|DA-A".
 * Il valore è l'ultimo periodo in cui Flightera riporta voli.
 */
const STAGIONALI: Record<string, string> = {
  'ryanair|BRI-AGP': 'agosto 2026',
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
  /** Se stagionale, ultimo periodo con voli riscontrati (es. "agosto 2026") */
  stagionale?: string
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
          stagionale: STAGIONALI[`${vettoreSlug}|${daIata}-${aIata}`],
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
