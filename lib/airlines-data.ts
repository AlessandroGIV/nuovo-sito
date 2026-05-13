export interface Airline {
  slug: string
  name: string
  iata: string
  paese: string
  tipo: 'low-cost' | 'tradizionale'
  rimborsoSlug?: string
}

export const airlines: Airline[] = [
  { slug: 'ryanair', name: 'Ryanair', iata: 'FR', paese: 'Irlanda', tipo: 'low-cost', rimborsoSlug: 'rimborso-ryanair' },
  { slug: 'easyjet', name: 'easyJet', iata: 'U2', paese: 'Regno Unito', tipo: 'low-cost', rimborsoSlug: 'rimborso-easyjet' },
  { slug: 'ita-airways', name: 'ITA Airways', iata: 'AZ', paese: 'Italia', tipo: 'tradizionale', rimborsoSlug: 'rimborso-ita-airways' },
  { slug: 'wizz-air', name: 'Wizz Air', iata: 'W6', paese: 'Ungheria', tipo: 'low-cost', rimborsoSlug: 'rimborso-wizz-air' },
  { slug: 'vueling', name: 'Vueling', iata: 'VY', paese: 'Spagna', tipo: 'low-cost', rimborsoSlug: 'rimborso-vueling' },
  { slug: 'volotea', name: 'Volotea', iata: 'V7', paese: 'Spagna', tipo: 'low-cost', rimborsoSlug: 'rimborso-volotea' },
  { slug: 'lufthansa', name: 'Lufthansa', iata: 'LH', paese: 'Germania', tipo: 'tradizionale', rimborsoSlug: 'rimborso-lufthansa' },
  { slug: 'air-france', name: 'Air France', iata: 'AF', paese: 'Francia', tipo: 'tradizionale', rimborsoSlug: 'rimborso-air-france' },
  { slug: 'klm', name: 'KLM', iata: 'KL', paese: 'Paesi Bassi', tipo: 'tradizionale', rimborsoSlug: 'rimborso-klm' },
  { slug: 'tap-portugal', name: 'TAP Portugal', iata: 'TP', paese: 'Portogallo', tipo: 'tradizionale', rimborsoSlug: 'rimborso-tap' },
  { slug: 'iberia', name: 'Iberia', iata: 'IB', paese: 'Spagna', tipo: 'tradizionale', rimborsoSlug: 'rimborso-iberia' },
  { slug: 'british-airways', name: 'British Airways', iata: 'BA', paese: 'Regno Unito', tipo: 'tradizionale' },
  { slug: 'turkish-airlines', name: 'Turkish Airlines', iata: 'TK', paese: 'Turchia', tipo: 'tradizionale' },
  { slug: 'norwegian', name: 'Norwegian', iata: 'DY', paese: 'Norvegia', tipo: 'low-cost' },
  { slug: 'transavia', name: 'Transavia', iata: 'HV', paese: 'Paesi Bassi', tipo: 'low-cost' },
  { slug: 'eurowings', name: 'Eurowings', iata: 'EW', paese: 'Germania', tipo: 'low-cost' },
  { slug: 'swiss', name: 'Swiss', iata: 'LX', paese: 'Svizzera', tipo: 'tradizionale' },
  { slug: 'austrian', name: 'Austrian Airlines', iata: 'OS', paese: 'Austria', tipo: 'tradizionale' },
  { slug: 'brussels-airlines', name: 'Brussels Airlines', iata: 'SN', paese: 'Belgio', tipo: 'tradizionale' },
  { slug: 'finnair', name: 'Finnair', iata: 'AY', paese: 'Finlandia', tipo: 'tradizionale' },
  { slug: 'lot', name: 'LOT Polish Airlines', iata: 'LO', paese: 'Polonia', tipo: 'tradizionale' },
  { slug: 'aegean', name: 'Aegean Airlines', iata: 'A3', paese: 'Grecia', tipo: 'tradizionale' },
  { slug: 'emirates', name: 'Emirates', iata: 'EK', paese: 'Emirati Arabi', tipo: 'tradizionale' },
  { slug: 'qatar-airways', name: 'Qatar Airways', iata: 'QR', paese: 'Qatar', tipo: 'tradizionale' },
  { slug: 'condor', name: 'Condor', iata: 'DE', paese: 'Germania', tipo: 'low-cost' },
]

export function getAirline(slug: string): Airline | undefined {
  return airlines.find((a) => a.slug === slug)
}

export interface AirlineSubpage {
  slug: string
  label: string
  title: (airlineName: string) => string
  description: (airlineName: string) => string
  h1: (airlineName: string) => string
  intro: (airlineName: string) => string
  faqs: (airlineName: string) => { q: string; a: string }[]
}

export const airlineSubpages: AirlineSubpage[] = [
  {
    slug: 'risarcimento',
    label: 'Risarcimento',
    title: (n) => `Risarcimento ${n} | Fino a €600 – Giustizia In Volo`,
    description: (n) =>
      `Volo ${n} cancellato o in ritardo? Hai diritto a un risarcimento fino a €600 ai sensi del Reg. CE 261/2004. Nessun anticipo richiesto.`,
    h1: (n) => `Risarcimento volo ${n}: come ottenere fino a €600`,
    intro: (n) =>
      `Se il tuo volo ${n} è stato cancellato o è arrivato in ritardo di oltre 3 ore, hai diritto a un risarcimento fino a €600 per passeggero in base al Regolamento CE 261/2004. Giustizia In Volo gestisce tutto gratuitamente: paghiamo solo se otteniamo il rimborso.`,
    faqs: (n) => [
      {
        q: `A quanto ammonta il risarcimento per un volo ${n} cancellato?`,
        a: `Il risarcimento va da €250 a €600 a seconda della distanza del volo. Voli fino a 1.500 km: €250. Tra 1.500 e 3.500 km: €400. Oltre 3.500 km: €600.`,
      },
      {
        q: `Entro quanto tempo posso richiedere il risarcimento a ${n}?`,
        a: `In Italia hai fino a 3 anni dalla data del volo per presentare la richiesta.`,
      },
      {
        q: `${n} si rifiuta di pagare. Cosa posso fare?`,
        a: `Giustizia In Volo si occupa dell'intera procedura, compreso il ricorso legale se necessario. Nessun costo anticipato per te.`,
      },
      {
        q: `Il mio volo ${n} era in codeshare. Ho diritto al risarcimento?`,
        a: `Sì, se il volo operativo era di ${n} o di un vettore europeo, il Reg. CE 261/2004 si applica.`,
      },
    ],
  },
  {
    slug: 'bagagli',
    label: 'Bagagli',
    title: (n) => `Bagaglio ${n} Smarrito o Danneggiato | Rimborso – Giustizia In Volo`,
    description: (n) =>
      `${n} ha perso, danneggiato o ritardato il tuo bagaglio? Scopri i tuoi diritti e come ottenere il risarcimento fino a €1.600.`,
    h1: (n) => `Bagaglio ${n}: cosa fare se è perso, danneggiato o in ritardo`,
    intro: (n) =>
      `Se ${n} ha perso, danneggiato o consegnato in ritardo il tuo bagaglio, hai diritto a un risarcimento fino a circa 1.400 DSP (circa €1.600) ai sensi della Convenzione di Montreal. La prima cosa da fare è compilare il modulo PIR (Property Irregularity Report) in aeroporto prima di lasciare il terminal.`,
    faqs: (n) => [
      {
        q: `${n} ha perso il mio bagaglio: cosa devo fare subito?`,
        a: `Vai all'ufficio Lost & Found di ${n} in aeroporto e compila il modulo PIR. Conserva la ricevuta: è indispensabile per la richiesta di risarcimento.`,
      },
      {
        q: `Quanto tempo ha ${n} per ritrovare il bagaglio smarrito?`,
        a: `${n} ha 21 giorni di tempo. Se entro 21 giorni il bagaglio non viene ritrovato, viene considerato perso e puoi richiedere il risarcimento pieno.`,
      },
      {
        q: `Qual è il risarcimento massimo per un bagaglio perso da ${n}?`,
        a: `La Convenzione di Montreal prevede un massimale di circa 1.400 DSP, equivalenti a circa €1.600.`,
      },
      {
        q: `Posso richiedere rimborso per i beni acquistati d'urgenza mentre aspettavo il bagaglio?`,
        a: `Sì, hai diritto al rimborso delle spese essenziali documentate con ricevuta durante il periodo di ritardo del bagaglio.`,
      },
    ],
  },
  {
    slug: 'overbooking',
    label: 'Overbooking',
    title: (n) => `Overbooking ${n} | Risarcimento Fino a €600 – Giustizia In Volo`,
    description: (n) =>
      `${n} ti ha negato l'imbarco per overbooking? Hai diritto a un risarcimento immediato fino a €600. Scopri come ottenerlo.`,
    h1: (n) => `Overbooking ${n}: i tuoi diritti e come ottenere il risarcimento`,
    intro: (n) =>
      `L'overbooking da parte di ${n} è una delle violazioni più gravi del Regolamento CE 261/2004. Se sei stato costretto a prendere un volo alternativo o a rinunciare al viaggio, hai diritto a un risarcimento immediato fino a €600, oltre a pasti, bevande e sistemazione alberghiera se necessario.`,
    faqs: (n) => [
      {
        q: `${n} mi ha negato l'imbarco: a quanto risarcimento ho diritto?`,
        a: `Hai diritto a €250 per voli fino a 1.500 km, €400 per voli tra 1.500 e 3.500 km, e €600 per voli oltre 3.500 km. Più rimborso del biglietto o volo alternativo.`,
      },
      {
        q: `Ho accettato il voucher offerto da ${n}. Posso ancora chiedere il risarcimento?`,
        a: `Dipende dalle condizioni del voucher. Contattaci prima di accettare qualsiasi compensazione da ${n}.`,
      },
      {
        q: `${n} sostiene che il mio posto era doppiamente prenotato per colpa mia. È vero?`,
        a: `In quasi tutti i casi l'overbooking dipende dalla compagnia. Giustizia In Volo verifica e contesta le giustificazioni infondate.`,
      },
      {
        q: `Quanto tempo ho per richiedere il risarcimento per overbooking ${n}?`,
        a: `Hai 3 anni dalla data del volo per presentare la richiesta.`,
      },
    ],
  },
  {
    slug: 'contatti',
    label: 'Contatti',
    title: (n) => `Contatti ${n} | Come Farsi Rimborsare – Giustizia In Volo`,
    description: (n) =>
      `Cerchi i contatti di ${n} per un rimborso? Scopri come contattare la compagnia e perché affidarti a Giustizia In Volo è più efficace.`,
    h1: (n) => `Contatti ${n}: come richiedere rimborso o assistenza`,
    intro: (n) =>
      `Contattare direttamente ${n} per ottenere un rimborso può richiedere settimane o mesi senza risultato. Le compagnie aeree spesso ignorano le richieste individuali o offrono voucher inferiori al dovuto. Giustizia In Volo agisce per tuo conto con strumenti legali.`,
    faqs: (n) => [
      {
        q: `Come posso contattare ${n} per un rimborso?`,
        a: `Puoi usare il sito ufficiale di ${n} o il loro servizio clienti. Tuttavia, i tempi medi di risposta superano spesso i 30 giorni.`,
      },
      {
        q: `${n} non risponde alla mia richiesta di rimborso. Cosa posso fare?`,
        a: `Se ${n} non risponde entro 14 giorni o rifiuta la tua richiesta, puoi affidarti a Giustizia In Volo: agiamo legalmente senza costo anticipato.`,
      },
      {
        q: `Posso richiedere il rimborso a ${n} anche online?`,
        a: `Sì, ma conserva tutti i messaggi e le risposte. Sono documenti utili per un eventuale procedimento legale.`,
      },
      {
        q: `Perché affidarmi a Giustizia In Volo invece di contattare ${n} da solo?`,
        a: `Le richieste inviate da uno studio legale hanno una probabilità di successo molto più alta. E non paghi nulla se non otteniamo il rimborso.`,
      },
    ],
  },
  {
    slug: 'faq',
    label: 'FAQ',
    title: (n) => `FAQ ${n}: Rimborsi e Diritti Passeggeri – Giustizia In Volo`,
    description: (n) =>
      `Domande frequenti su rimborsi, ritardi e cancellazioni con ${n}. Tutto quello che devi sapere sui tuoi diritti passeggero.`,
    h1: (n) => `FAQ ${n}: tutte le risposte sui rimborsi`,
    intro: (n) =>
      `Hai dubbi sui tuoi diritti con ${n}? Qui trovi le risposte alle domande più comuni su rimborsi per voli cancellati, ritardi, overbooking e problemi con i bagagli.`,
    faqs: (n) => [
      {
        q: `Quali diritti ho se il mio volo ${n} è in ritardo?`,
        a: `Se il ritardo supera le 2 ore hai diritto a pasti e bevande. Se supera le 3 ore all'arrivo, hai diritto a un risarcimento fino a €600. Se supera le 5 ore puoi scegliere il rimborso del biglietto.`,
      },
      {
        q: `Il mio volo ${n} è stato cancellato: ho diritto al rimborso del biglietto?`,
        a: `Sì, sempre. In più, se la cancellazione non è stata comunicata con almeno 14 giorni di anticipo, hai anche diritto al risarcimento (€250–€600).`,
      },
      {
        q: `${n} dice che il ritardo è dovuto a maltempo. Ho diritto al risarcimento?`,
        a: `Il maltempo straordinario è una "circostanza eccezionale". Tuttavia ${n} deve dimostrarlo. Spesso le compagnie usano questa scusa in modo improprio.`,
      },
      {
        q: `Posso richiedere il risarcimento per un volo ${n} di anni fa?`,
        a: `In Italia il termine di prescrizione è di 3 anni dalla data del volo.`,
      },
      {
        q: `Quanto costa affidarsi a Giustizia In Volo per un reclamo contro ${n}?`,
        a: `Nulla in anticipo. Trattiamo una percentuale solo se otteniamo il rimborso. Se non vinciamo, non paghi niente.`,
      },
    ],
  },
  {
    slug: 'tracking-volo',
    label: 'Tracking Volo',
    title: (n) => `Tracking Volo ${n} | Monitora il Tuo Volo – Giustizia In Volo`,
    description: (n) =>
      `Monitora in tempo reale il tuo volo ${n}. Scopri ritardi e cancellazioni e richiedi subito il rimborso se hai subito un disservizio.`,
    h1: (n) => `Tracking volo ${n}: monitora ritardi e cancellazioni`,
    intro: (n) =>
      `Tenere traccia del tuo volo ${n} in tempo reale ti permette di sapere subito se hai diritto a un risarcimento. Se il tuo volo arriva con oltre 3 ore di ritardo o viene cancellato, puoi presentare immediatamente la richiesta a Giustizia In Volo.`,
    faqs: (n) => [
      {
        q: `Come posso seguire il mio volo ${n} in tempo reale?`,
        a: `Puoi usare il sito ufficiale di ${n} o app come Flightradar24 e FlightAware inserendo il numero del tuo volo.`,
      },
      {
        q: `Il mio volo ${n} risulta in ritardo: quando posso richiedere il risarcimento?`,
        a: `Se il ritardo all'arrivo supera le 3 ore, hai diritto al risarcimento. Puoi presentare la richiesta subito dopo l'arrivo.`,
      },
      {
        q: `Come documento il ritardo del mio volo ${n} per la richiesta di rimborso?`,
        a: `Conserva la carta d'imbarco, lo screenshot del tracking con l'orario reale e qualsiasi comunicazione di ${n} sul ritardo.`,
      },
      {
        q: `${n} ha cambiato il mio volo all'ultimo momento. È considerato cancellazione?`,
        a: `Se la modifica supera le 3 ore sull'orario di arrivo, viene trattata come cancellazione e ti dà diritto al risarcimento.`,
      },
    ],
  },
]

export function getSubpage(slug: string): AirlineSubpage | undefined {
  return airlineSubpages.find((s) => s.slug === slug)
}
