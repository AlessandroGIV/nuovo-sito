// Costanti del portale agenzie. Nessun segreto qui dentro, il file è usato
// anche dai componenti client.

export const CASE_STATUSES = [
  'ricevuta',
  'in_valutazione',
  'documenti_richiesti',
  'presa_in_carico',
  'richiesta_inviata',
  'azione_legale',
  'recupero_forzoso',
  'risarcimento_ottenuto',
  'non_procedibile',
  'esito_negativo',
] as const

export type CaseStatus = (typeof CASE_STATUSES)[number]

export const STATUS_LABEL: Record<CaseStatus, string> = {
  ricevuta: 'Ricevuta',
  in_valutazione: 'In valutazione',
  documenti_richiesti: 'Documenti da integrare',
  presa_in_carico: 'Presa in carico',
  richiesta_inviata: 'Richiesta inviata alla compagnia',
  azione_legale: 'Azione legale in corso',
  recupero_forzoso: 'Recupero forzoso in corso',
  risarcimento_ottenuto: 'Risarcimento ottenuto',
  non_procedibile: 'Non procedibile',
  esito_negativo: 'Chiusa senza risarcimento',
}

/** Cosa significa lo stato, spiegato a chi lavora in agenzia. */
export const STATUS_HELP: Record<CaseStatus, string> = {
  ricevuta: 'Abbiamo ricevuto la segnalazione. La valutiamo a breve.',
  in_valutazione: 'Stiamo verificando volo, orari e documenti.',
  documenti_richiesti: 'Per andare avanti servono altri documenti. Trovi il dettaglio nella nota.',
  presa_in_carico: 'Il passeggero ci ha conferito l’incarico. Prepariamo la richiesta.',
  richiesta_inviata: 'Abbiamo chiesto la compensazione alla compagnia aerea.',
  azione_legale: 'La compagnia non ha pagato. La pratica prosegue in sede giudiziale.',
  recupero_forzoso: 'C’è un provvedimento favorevole. Stiamo recuperando le somme.',
  risarcimento_ottenuto: 'La compagnia ha pagato. La pratica è conclusa.',
  non_procedibile: 'Il caso non ha i requisiti per procedere. Trovi il motivo nella nota.',
  esito_negativo: 'La pratica si è chiusa senza risarcimento.',
}

/**
 * Le tappe della rotta mostrata all'agenzia. Ogni stato cade su una tappa.
 * Gli stati di chiusura senza esito non stanno sulla rotta e si mostrano a parte.
 */
export const ROUTE_STOPS = [
  { key: 'segnalata', label: 'Segnalata' },
  { key: 'valutata', label: 'Valutazione' },
  { key: 'incarico', label: 'Presa in carico' },
  { key: 'richiesta', label: 'Richiesta alla compagnia' },
  { key: 'esito', label: 'Risarcimento' },
] as const

export const STATUS_STOP: Record<CaseStatus, number> = {
  ricevuta: 0,
  in_valutazione: 1,
  documenti_richiesti: 1,
  presa_in_carico: 2,
  richiesta_inviata: 3,
  azione_legale: 3,
  recupero_forzoso: 3,
  risarcimento_ottenuto: 4,
  non_procedibile: -1,
  esito_negativo: -1,
}

export const CLOSED_STATUSES: CaseStatus[] = ['risarcimento_ottenuto', 'non_procedibile', 'esito_negativo']

export const DISRUPTIONS = ['ritardo', 'cancellazione', 'negato_imbarco', 'coincidenza_persa', 'altro'] as const
export type Disruption = (typeof DISRUPTIONS)[number]

export const DISRUPTION_LABEL: Record<Disruption, string> = {
  ritardo: 'Ritardo',
  cancellazione: 'Cancellazione',
  negato_imbarco: 'Negato imbarco',
  coincidenza_persa: 'Coincidenza persa',
  altro: 'Altro',
}

export const AGENCY_STATUS_LABEL = {
  pending: 'Da valutare',
  active: 'Attiva',
  suspended: 'Sospesa',
  rejected: 'Non accolta',
} as const
export type AgencyStatus = keyof typeof AGENCY_STATUS_LABEL

export const SOURCE_LABEL = {
  modulo_agenzia: 'Inserita dall’agenzia',
  link_cliente: 'Arrivata dal link',
} as const
export type CaseSource = keyof typeof SOURCE_LABEL

export const AGENCY_CODE_RE = /^[A-Z0-9]{4,16}$/
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Documenti allegabili a una pratica. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
export const MAX_DOCS_PER_CASE = 12
export const ALLOWED_UPLOAD_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
}

export const PASSWORD_MIN_LENGTH = 10
