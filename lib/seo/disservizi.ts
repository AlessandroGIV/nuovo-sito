import type { FonteId } from './fonti'
import { titoloTratta, type Tratta } from './tratte'

/**
 * Contenuto giuridico delle pagine tratta.
 *
 * Ogni affermazione porta gli identificativi delle fonti che la reggono (lib/seo/fonti.ts).
 * Un paragrafo senza fonte non si pubblica. Gli importi e le soglie derivano dai dati della tratta,
 * non sono scritti a mano pagina per pagina.
 */
export type DisservizioSlug = 'ritardo' | 'cancellazione' | 'negato-imbarco'

export interface Paragrafo {
  testo: string
  fonti: FonteId[]
}

export interface Sezione {
  titolo: string
  paragrafi: Paragrafo[]
}

export interface Faq {
  q: string
  a: string
}

export interface ContenutoDisservizio {
  slug: DisservizioSlug
  etichetta: string
  /** Pagina generale del sito sullo stesso disservizio */
  hrefGuida: string
  h1: string
  title: string
  description: string
  intro: string
  sezioni: Sezione[]
  faq: Faq[]
}

export const DISSERVIZI: { slug: DisservizioSlug; etichetta: string }[] = [
  { slug: 'ritardo', etichetta: 'Ritardo' },
  { slug: 'cancellazione', etichetta: 'Cancellazione' },
  { slug: 'negato-imbarco', etichetta: 'Negato imbarco' },
]

export function isDisservizio(s: string): s is DisservizioSlug {
  return DISSERVIZI.some((d) => d.slug === s)
}

const euro = (n: number) => `${n} euro`
/** Migliaia con il punto anche sotto 10.000 (toLocaleString in italiano non raggruppa le quattro cifre). */
export const migliaia = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const km = (n: number) => `${migliaia(n)} km`
const lettera = (t: Tratta) => (t.fascia === 'a' ? 'a)' : 'b)')

function descrizioneFascia(t: Tratta): string {
  if (t.fascia === 'a') return 'tratte aeree pari o inferiori a 1.500 chilometri'
  return t.intraUe
    ? 'tratte aeree intracomunitarie superiori a 1.500 chilometri'
    : 'tratte aeree comprese tra 1.500 e 3.500 chilometri'
}

/** Sezione comune a tutte le pagine: importo e ambito di applicazione sulla tratta. */
function sezioneImporto(t: Tratta): Sezione {
  const ritorno = t.intraUe
    ? `Anche il volo in senso opposto, da ${t.a.nome} a ${t.da.nome}, parte da un aeroporto situato in uno Stato membro, quindi il regolamento si applica allo stesso modo (art. 3, par. 1, lett. a).`
    : `Per il volo di ritorno da ${t.a.nome}, aeroporto situato fuori dall'Unione (${t.a.paese}), il regolamento si applica alle condizioni dell'art. 3, par. 1, lett. b), cioè quando il vettore aereo operativo è un vettore comunitario.`
  return {
    titolo: `Quanto spetta sulla tratta ${titoloTratta(t)}`,
    paragrafi: [
      {
        testo: `La distanza tra ${t.da.nome} e ${t.a.nome}, misurata con il metodo della rotta ortodromica come richiede l'art. 7, par. 4, è di circa ${km(t.km)}. Un volo diretto rientra quindi nell'art. 7, par. 1, lett. ${lettera(t)} del Regolamento (CE) n. 261/2004 (${descrizioneFascia(t)}) e la compensazione pecuniaria è di ${euro(t.importo)} per ciascun passeggero.`,
        fonti: ['reg261'],
      },
      {
        testo: `Il volo ${t.vettoreNome} da ${t.da.nome} parte da un aeroporto situato nel territorio di uno Stato membro, quindi rientra nel regolamento qualunque sia la nazionalità del vettore o del passeggero (art. 3, par. 1, lett. a). ${ritorno}`,
        fonti: ['reg261'],
      },
      {
        testo: `Se il viaggio prevede una coincidenza, la distanza si calcola sull'ultima destinazione alla quale il passeggero arriva in ritardo rispetto all'orario previsto (art. 7, par. 1), e l'importo può essere diverso da quello indicato per il volo diretto.`,
        fonti: ['reg261'],
      },
    ],
  }
}

/** Difese ricorrenti del vettore in caso di ritardo o cancellazione (art. 5, par. 3). */
function sezioneDifese(t: Tratta): Sezione {
  return {
    titolo: `Quando ${t.vettoreNome} può non pagare`,
    paragrafi: [
      {
        testo: `Il vettore non è tenuto alla compensazione se dimostra che il disservizio è dovuto a circostanze eccezionali che non si sarebbero potute evitare anche adottando tutte le misure del caso (art. 5, par. 3). La prova spetta al vettore. La Corte di cassazione richiede una prova piena, rigorosa e specifica dei fatti posti a fondamento dell'esimente e del nesso causale diretto con il singolo volo, senza spazio per presunzioni su generici effetti a catena.`,
        fonti: ['reg261', 'cass20489'],
      },
      {
        testo: `Guasto tecnico. Un problema tecnico dell'aeromobile non è una circostanza eccezionale, salvo che derivi da eventi che non sono inerenti al normale esercizio dell'attività del vettore e che sfuggono al suo effettivo controllo.`,
        fonti: ['sturgeon'],
      },
      {
        testo: `Sciopero. Lo sciopero del personale del vettore, proclamato dal sindacato dei suoi dipendenti, non è una circostanza eccezionale. Possono esserlo gli scioperi esterni all'attività del vettore, come quelli dei controllori di volo o del personale aeroportuale, e anche in quel caso il vettore deve provare il nesso con il volo e le misure adottate.`,
        fonti: ['airhelpSas', 'cass20489'],
      },
      {
        testo: `Maltempo. Un fenomeno meteorologico precedente al volo non basta. Il vettore deve provare che gli effetti delle condizioni avverse si sono protratti fino all'orario di partenza, al punto da impedire il volo o da imporre un ritardo superiore alle tre ore.`,
        fonti: ['tribBergamo52'],
      },
      {
        testo: `Ritardo del volo precedente. Il vettore può invocare una circostanza eccezionale che ha colpito un volo precedente operato con lo stesso aeromobile solo se esiste un nesso di causalità diretta tra quell'evento e il ritardo o la cancellazione del volo successivo.`,
        fonti: ['tap'],
      },
      {
        testo: `Riprotezione. Anche davanti a una circostanza eccezionale il vettore deve dimostrare di avere adottato misure adeguate con tutti i mezzi di cui disponeva. Riproteggere il passeggero su un proprio volo che arriva il giorno successivo non è una misura ragionevole se esisteva un altro collegamento, diretto o con scalo, anche di un altro vettore, che arrivava prima, salvo che ciò comportasse un sacrificio insopportabile per l'impresa.`,
        fonti: ['tap'],
      },
    ],
  }
}

/** Termini per agire: quadro giurisprudenziale non uniforme, esposto come tale. */
function sezioneTermini(): Sezione {
  return {
    titolo: 'Entro quando agire',
    paragrafi: [
      {
        testo: `Il regolamento non fissa un termine per chiedere la compensazione. La Corte di cassazione, richiamando la Corte di giustizia, ha chiarito che il termine è stabilito dal diritto di ciascuno Stato membro e che non coincide con quello biennale dell'art. 35 della Convenzione di Montreal.`,
        fonti: ['cass4427'],
      },
      {
        testo: `In Italia i giudici di merito non seguono una linea unica. Alcune pronunce applicano la prescrizione di un anno prevista dall'art. 2951 c.c. per i diritti che derivano dal contratto di trasporto, con decorrenza dall'arrivo a destinazione. Altre applicano in via analogica l'art. 418 cod. nav., che porta il termine a sei mesi dall'arrivo. Per questo conviene inviare la richiesta al vettore il prima possibile dopo il volo.`,
        fonti: ['tribPalermo4910', 'tribRoma15400', 'tribMilano3034'],
      },
    ],
  }
}

function ritardo(t: Tratta): ContenutoDisservizio {
  const tr = titoloTratta(t)
  return {
    slug: 'ritardo',
    etichetta: 'Ritardo',
    hrefGuida: '/ec261/ritardo-aereo',
    h1: `Ritardo volo ${t.vettoreNome} ${tr}, quando spetta la compensazione`,
    title: `Ritardo ${t.vettoreNome} ${tr} | Compensazione di ${t.importo} € – Giustizia In Volo`,
    description: `Volo ${t.vettoreNome} ${tr} arrivato con tre ore o più di ritardo? Su questa tratta di circa ${km(t.km)} la compensazione del Reg. CE 261/2004 è di ${t.importo} € a passeggero.`,
    intro: `Se il tuo volo ${t.vettoreNome} da ${t.da.nome} a ${t.a.nome} è arrivato a destinazione con tre ore o più di ritardo, puoi avere diritto a una compensazione di ${euro(t.importo)} a passeggero, oltre all'assistenza in aeroporto.`,
    sezioni: [
      {
        titolo: 'Quando il ritardo dà diritto alla compensazione',
        paragrafi: [
          {
            testo: `Il regolamento prevede la compensazione pecuniaria per la cancellazione e per il negato imbarco. La Corte di giustizia ha stabilito che i passeggeri di un volo ritardato possono essere assimilati a quelli di un volo cancellato quando subiscono una perdita di tempo pari o superiore a tre ore, cioè quando raggiungono la destinazione finale tre ore o più dopo l'orario di arrivo originariamente previsto dal vettore. La Grande Sezione ha poi confermato questa interpretazione.`,
            fonti: ['sturgeon', 'nelson'],
          },
          {
            testo: `Conta quindi l'orario di arrivo a destinazione, non quello di partenza. Un volo partito in forte ritardo che recupera in rotta e atterra con meno di tre ore di ritardo non dà diritto alla compensazione, ma resta il diritto all'assistenza dell'art. 6 quando il ritardo alla partenza raggiunge le soglie indicate più sotto.`,
            fonti: ['sturgeon', 'reg261'],
          },
        ],
      },
      sezioneImporto(t),
      {
        titolo: `Assistenza durante l'attesa a ${t.da.nome}`,
        paragrafi: [
          {
            testo: `Su una tratta di questa lunghezza l'assistenza è dovuta quando il vettore prevede un ritardo alla partenza di almeno ${t.oreAssistenza === 2 ? 'due' : 'tre'} ore (art. 6, par. 1, lett. ${t.oreAssistenza === 2 ? 'a' : 'b'}). Comprende pasti e bevande in relazione alla durata dell'attesa e due comunicazioni gratuite (art. 9, par. 1, lett. a, e par. 2). Se la nuova partenza è prevista almeno il giorno successivo, spettano anche la sistemazione in albergo e il trasporto tra aeroporto e albergo (art. 9, par. 1, lett. b e c).`,
            fonti: ['reg261'],
          },
          {
            testo: `Quando il ritardo è di almeno cinque ore il passeggero può rinunciare al volo e ottenere il rimborso del biglietto ai sensi dell'art. 8, par. 1, lett. a).`,
            fonti: ['reg261'],
          },
        ],
      },
      sezioneDifese(t),
      sezioneTermini(),
    ],
    faq: [
      {
        q: `Quanto spetta per un ritardo sul volo ${t.vettoreNome} ${tr}?`,
        a: `${t.importo} euro a passeggero per un volo diretto. La distanza ortodromica è di circa ${km(t.km)} e la tratta rientra nell'art. 7, par. 1, lett. ${lettera(t)} del Reg. CE 261/2004.`,
      },
      {
        q: 'Da quante ore di ritardo scatta la compensazione?',
        a: `Da tre ore di ritardo all'arrivo alla destinazione finale, rispetto all'orario di arrivo originariamente previsto. Lo ha stabilito la Corte di giustizia UE nella sentenza Sturgeon del 19 novembre 2009, confermata dalla Grande Sezione nella sentenza Nelson del 23 ottobre 2012.`,
      },
      {
        q: `${t.vettoreNome} può rifiutare la compensazione per un guasto tecnico?`,
        a: `Di regola no. Secondo la Corte di giustizia un problema tecnico dell'aeromobile non è una circostanza eccezionale, salvo che derivi da eventi non inerenti al normale esercizio dell'attività del vettore e che sfuggono al suo effettivo controllo.`,
      },
      {
        q: `Che assistenza spetta in aeroporto a ${t.da.nome}?`,
        a: `Con un ritardo alla partenza di almeno ${t.oreAssistenza === 2 ? 'due' : 'tre'} ore spettano pasti e bevande e due comunicazioni gratuite. Se la partenza slitta al giorno successivo spettano anche albergo e trasporto (artt. 6 e 9 del Reg. CE 261/2004).`,
      },
    ],
  }
}

function cancellazione(t: Tratta): ContenutoDisservizio {
  const tr = titoloTratta(t)
  const oreRiduzione = t.fascia === 'a' ? 'due' : 'tre'
  return {
    slug: 'cancellazione',
    etichetta: 'Cancellazione',
    hrefGuida: '/ec261/volo-cancellato',
    h1: `Volo ${t.vettoreNome} ${tr} cancellato, rimborso e compensazione`,
    title: `Volo ${t.vettoreNome} ${tr} cancellato | Rimborso e ${t.importo} € – Giustizia In Volo`,
    description: `Volo ${t.vettoreNome} ${tr} cancellato? Hai diritto al rimborso o a un volo alternativo e, se l'avviso è arrivato tardi, a ${t.importo} € di compensazione a passeggero.`,
    intro: `Se ${t.vettoreNome} ha cancellato il tuo volo da ${t.da.nome} a ${t.a.nome}, hai diritto a scegliere tra rimborso e volo alternativo, all'assistenza in aeroporto e, in molti casi, a una compensazione di ${euro(t.importo)} a passeggero.`,
    sezioni: [
      {
        titolo: 'Rimborso o volo alternativo, la scelta è tua',
        paragrafi: [
          {
            testo: `In caso di cancellazione il vettore deve offrire la scelta tra il rimborso del prezzo del biglietto entro sette giorni, l'imbarco su un volo alternativo verso la destinazione finale non appena possibile e l'imbarco su un volo alternativo in una data successiva di gradimento del passeggero, a seconda dei posti disponibili (art. 5, par. 1, lett. a, e art. 8, par. 1).`,
            fonti: ['reg261'],
          },
          {
            testo: `Durante l'attesa spettano pasti e bevande e due comunicazioni gratuite. Se il volo alternativo parte almeno il giorno successivo spettano anche l'albergo e il trasporto tra aeroporto e albergo (art. 5, par. 1, lett. b, e art. 9).`,
            fonti: ['reg261'],
          },
        ],
      },
      {
        titolo: 'Quando spetta anche la compensazione',
        paragrafi: [
          {
            testo: `Oltre al rimborso o al volo alternativo spetta la compensazione dell'art. 7, a meno che il passeggero sia stato informato della cancellazione almeno due settimane prima dell'orario di partenza previsto (art. 5, par. 1, lett. c, punto i).`,
            fonti: ['reg261'],
          },
          {
            testo: `Con un avviso arrivato tra due settimane e sette giorni prima, la compensazione è esclusa solo se viene offerto un volo alternativo che parte non più di due ore prima dell'orario previsto e arriva a destinazione meno di quattro ore dopo. Con un avviso arrivato meno di sette giorni prima, solo se il volo alternativo parte non più di un'ora prima e arriva meno di due ore dopo (art. 5, par. 1, lett. c, punti ii e iii).`,
            fonti: ['reg261'],
          },
          {
            testo: `Spetta al vettore provare di avere informato il passeggero e quando lo ha fatto (art. 5, par. 4).`,
            fonti: ['reg261'],
          },
        ],
      },
      {
        ...sezioneImporto(t),
        paragrafi: [
          ...sezioneImporto(t).paragrafi,
          {
            testo: `Se il passeggero accetta un volo alternativo che arriva a destinazione con non più di ${oreRiduzione} ore di ritardo rispetto all'orario del volo cancellato, il vettore può ridurre la compensazione del 50 per cento (art. 7, par. 2).`,
            fonti: ['reg261'],
          },
        ],
      },
      sezioneDifese(t),
      sezioneTermini(),
    ],
    faq: [
      {
        q: `Quanto spetta se ${t.vettoreNome} cancella il volo ${tr}?`,
        a: `Il rimborso del biglietto oppure un volo alternativo, a tua scelta. In più ${t.importo} euro a passeggero di compensazione se la cancellazione non è stata comunicata almeno due settimane prima e non dipende da circostanze eccezionali.`,
      },
      {
        q: 'La compagnia mi ha avvisato pochi giorni prima, ho diritto alla compensazione?',
        a: `Sì, salvo che ti abbia offerto un volo alternativo entro i limiti dell'art. 5, par. 1, lett. c). Con un avviso a meno di sette giorni il volo alternativo deve partire non più di un'ora prima e arrivare meno di due ore dopo l'orario previsto.`,
      },
      {
        q: 'Chi deve provare quando è stata comunicata la cancellazione?',
        a: `Il vettore aereo operativo. Lo prevede l'art. 5, par. 4 del Reg. CE 261/2004.`,
      },
      {
        q: `${t.vettoreNome} può invocare uno sciopero per non pagare?`,
        a: `Dipende da chi sciopera. Secondo la Corte di giustizia UE (causa C-28/20) lo sciopero del personale del vettore non è una circostanza eccezionale, mentre possono esserlo gli scioperi dei controllori di volo o del personale aeroportuale.`,
      },
    ],
  }
}

function negatoImbarco(t: Tratta): ContenutoDisservizio {
  const tr = titoloTratta(t)
  const oreRiduzione = t.fascia === 'a' ? 'due' : 'tre'
  return {
    slug: 'negato-imbarco',
    etichetta: 'Negato imbarco',
    hrefGuida: '/ec261/overbooking',
    h1: `Imbarco negato sul volo ${t.vettoreNome} ${tr}, cosa spetta`,
    title: `Negato imbarco ${t.vettoreNome} ${tr} | Overbooking, ${t.importo} € – Giustizia In Volo`,
    description: `Imbarco negato per overbooking sul volo ${t.vettoreNome} ${tr}? La compensazione del Reg. CE 261/2004 su questa tratta è di ${t.importo} € a passeggero, più rimborso o volo alternativo.`,
    intro: `Se ${t.vettoreNome} ti ha negato l'imbarco sul volo da ${t.da.nome} a ${t.a.nome} contro la tua volontà e senza un ragionevole motivo, hai diritto a una compensazione immediata di ${euro(t.importo)} a passeggero, alla scelta tra rimborso e volo alternativo e all'assistenza in aeroporto.`,
    sezioni: [
      {
        titolo: 'Che cosa si intende per negato imbarco',
        paragrafi: [
          {
            testo: `Il regolamento definisce negato imbarco il rifiuto di trasportare passeggeri che si sono presentati all'imbarco nel rispetto delle condizioni dell'art. 3, par. 2, salvo che vi siano ragionevoli motivi per negarlo, quali ad esempio motivi di salute o di sicurezza, ovvero documenti di viaggio inadeguati (art. 2, lett. j).`,
            fonti: ['reg261'],
          },
          {
            testo: `Il passeggero deve avere una prenotazione confermata ed essersi presentato all'accettazione secondo le modalità e all'ora indicate dal vettore oppure, se l'ora non è indicata, al più tardi quarantacinque minuti prima dell'ora di partenza pubblicata (art. 3, par. 2).`,
            fonti: ['reg261'],
          },
        ],
      },
      {
        titolo: 'Volontari e passeggeri non consenzienti',
        paragrafi: [
          {
            testo: `Quando prevede di dover negare l'imbarco il vettore deve prima cercare volontari disposti a rinunciare alla prenotazione in cambio di benefici da concordare. I volontari hanno comunque diritto al rimborso o al volo alternativo dell'art. 8 (art. 4, par. 1).`,
            fonti: ['reg261'],
          },
          {
            testo: `Se i volontari non bastano il vettore può negare l'imbarco a passeggeri non consenzienti, ai quali deve versare immediatamente la compensazione dell'art. 7 e prestare l'assistenza degli artt. 8 e 9 (art. 4, par. 2 e 3).`,
            fonti: ['reg261'],
          },
        ],
      },
      {
        ...sezioneImporto(t),
        paragrafi: [
          ...sezioneImporto(t).paragrafi,
          {
            testo: `Se il passeggero accetta un volo alternativo che arriva a destinazione con non più di ${oreRiduzione} ore di ritardo rispetto all'orario del volo prenotato, il vettore può ridurre la compensazione del 50 per cento (art. 7, par. 2).`,
            fonti: ['reg261'],
          },
        ],
      },
      {
        titolo: 'Rimborso, volo alternativo e assistenza',
        paragrafi: [
          {
            testo: `Il passeggero sceglie tra il rimborso del biglietto entro sette giorni e l'imbarco su un volo alternativo, non appena possibile o in una data successiva di suo gradimento (art. 8, par. 1). Nell'attesa spettano pasti e bevande, due comunicazioni gratuite e, se serve un pernottamento, albergo e trasporto (art. 9).`,
            fonti: ['reg261'],
          },
        ],
      },
      sezioneTermini(),
    ],
    faq: [
      {
        q: `Quanto spetta per un negato imbarco sul volo ${t.vettoreNome} ${tr}?`,
        a: `${t.importo} euro a passeggero per un volo diretto, oltre alla scelta tra rimborso del biglietto e volo alternativo. La tratta misura circa ${km(t.km)} e rientra nell'art. 7, par. 1, lett. ${lettera(t)} del Reg. CE 261/2004.`,
      },
      {
        q: 'La compensazione per overbooking va pagata subito?',
        a: `Sì. L'art. 4, par. 3 del Reg. CE 261/2004 prevede che il vettore versi immediatamente la compensazione ai passeggeri ai quali nega l'imbarco contro la loro volontà.`,
      },
      {
        q: 'Ho accettato di cedere il posto come volontario, cosa mi spetta?',
        a: `I benefici concordati con il vettore e il rimborso o il volo alternativo dell'art. 8. La compensazione immediata dell'art. 7 è prevista dall'art. 4, par. 3 per i passeggeri ai quali l'imbarco è negato contro la loro volontà, quindi leggi con attenzione quello che firmi.`,
      },
      {
        q: 'Quando il vettore può negare legittimamente l’imbarco?',
        a: `Quando esistono ragionevoli motivi, come motivi di salute o di sicurezza oppure documenti di viaggio inadeguati (art. 2, lett. j del Reg. CE 261/2004). In questi casi non si tratta di negato imbarco ai sensi del regolamento.`,
      },
    ],
  }
}

export function contenuto(t: Tratta, d: DisservizioSlug): ContenutoDisservizio {
  if (d === 'ritardo') return ritardo(t)
  if (d === 'cancellazione') return cancellazione(t)
  return negatoImbarco(t)
}
