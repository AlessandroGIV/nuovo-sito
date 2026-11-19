/**
 * Registro delle fonti citabili nelle pagine pubbliche.
 *
 * Regola editoriale: una pagina pubblica cita solo fonti presenti qui.
 * Stati ammessi
 *  - `integrale`  testo completo letto (EUR-Lex per normativa e Corte di giustizia, oppure scheda
 *                 `verificato` dell'archivio giv-giurisprudenza)
 *  - `lexroom`    estremi e passaggi verificati sulla ricerca Lexroom, testo completo non letto
 *
 * Le schede `da-verificare` dell'archivio e le pronunce ricordate a memoria NON entrano in questo file.
 * Gli estremi si copiano dalla scheda o dall'intestazione della pronuncia, mai a memoria.
 */
export type StatoFonte = 'integrale' | 'lexroom'
export type TipoFonte = 'normativa' | 'cgue' | 'cassazione' | 'merito'

export interface Fonte {
  id: string
  tipo: TipoFonte
  /** Estremi come vanno mostrati al lettore */
  estremi: string
  stato: StatoFonte
  /** Testo ufficiale liberamente consultabile, quando esiste */
  url?: string
  /** Data dell'ultima verifica (AAAA-MM-GG) */
  verificataIl: string
}

export const fonti = {
  reg261: {
    id: 'reg261',
    tipo: 'normativa',
    estremi: 'Regolamento (CE) n. 261/2004 del Parlamento europeo e del Consiglio, 11 febbraio 2004',
    stato: 'integrale',
    url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32004R0261',
    verificataIl: '2026-11-16',
  },
  sturgeon: {
    id: 'sturgeon',
    tipo: 'cgue',
    estremi: 'Corte di giustizia UE, Quarta Sezione, 19 novembre 2009, cause riunite C-402/07 e C-432/07, Sturgeon e a.',
    stato: 'integrale',
    url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:62007CJ0402',
    verificataIl: '2026-11-16',
  },
  nelson: {
    id: 'nelson',
    tipo: 'cgue',
    estremi: 'Corte di giustizia UE, Grande Sezione, 23 ottobre 2012, cause riunite C-581/10 e C-629/10, Nelson e a.',
    stato: 'integrale',
    url: 'https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:62010CJ0581',
    verificataIl: '2026-11-16',
  },
  tap: {
    id: 'tap',
    tipo: 'cgue',
    estremi: 'Corte di giustizia UE, Quarta Sezione, 11 giugno 2020, causa C-74/19, Transportes Aéreos Portugueses',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  airhelpSas: {
    id: 'airhelpSas',
    tipo: 'cgue',
    estremi: 'Corte di giustizia UE, Grande Sezione, 23 marzo 2021, causa C-28/20, Airhelp contro SAS',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  cass20489: {
    id: 'cass20489',
    tipo: 'cassazione',
    estremi: 'Corte di cassazione, sez. III, ordinanza 17 giugno 2026 n. 20489',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  cass9002: {
    id: 'cass9002',
    tipo: 'cassazione',
    estremi: 'Corte di cassazione, sez. III, ordinanza 9 aprile 2026 n. 9002',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  cass4427: {
    id: 'cass4427',
    tipo: 'cassazione',
    estremi: 'Corte di cassazione, sez. III, ordinanza 20 febbraio 2024 n. 4427',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  tribBergamo52: {
    id: 'tribBergamo52',
    tipo: 'merito',
    estremi: 'Tribunale di Bergamo, 14 gennaio 2025 n. 52',
    stato: 'integrale',
    verificataIl: '2026-11-06',
  },
  tribPalermo4910: {
    id: 'tribPalermo4910',
    tipo: 'merito',
    estremi: 'Tribunale di Palermo, sez. V, 2 dicembre 2025 n. 4910',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  tribRoma15400: {
    id: 'tribRoma15400',
    tipo: 'merito',
    estremi: 'Tribunale di Roma, 11 ottobre 2024 n. 15400',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  tribMilano3034: {
    id: 'tribMilano3034',
    tipo: 'merito',
    estremi: 'Tribunale di Milano, 10 aprile 2026 n. 3034',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  austrianC826: {
    id: 'austrianC826',
    tipo: 'cgue',
    estremi: 'Corte di giustizia UE, Quarta Sezione, 22 aprile 2021, causa C-826/19, Austrian Airlines',
    stato: 'lexroom',
    verificataIl: '2026-11-06',
  },
  cass17096: {
    id: 'cass17096',
    tipo: 'cassazione',
    estremi: 'Corte di cassazione, sez. III, ordinanza 31 maggio 2026 n. 17096',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  tribCivitavecchia880: {
    id: 'tribCivitavecchia880',
    tipo: 'merito',
    estremi: 'Tribunale di Civitavecchia, 30 maggio 2024 n. 880',
    stato: 'lexroom',
    verificataIl: '2026-11-06',
  },
  tribCatania828: {
    id: 'tribCatania828',
    tipo: 'merito',
    estremi: 'Tribunale di Catania, sez. IV, 17 febbraio 2026 n. 828',
    stato: 'lexroom',
    verificataIl: '2026-11-08',
  },
  tribCatania957: {
    id: 'tribCatania957',
    tipo: 'merito',
    estremi: 'Tribunale di Catania, 7 febbraio 2025 n. 957',
    stato: 'lexroom',
    verificataIl: '2026-11-06',
  },
} as const satisfies Record<string, Fonte>

export type FonteId = keyof typeof fonti

export function fonte(id: FonteId): Fonte {
  return fonti[id]
}
