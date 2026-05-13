export interface Ec261Page {
  slug: string
  title: string
  metaDescription: string
  h1: string
  intro: string
  faqs: { q: string; a: string }[]
}

export const ec261Pages: Ec261Page[] = [
  {
    slug: 'ritardo-aereo',
    title: 'Ritardo Aereo: Rimborso Fino a €600 | Giustizia In Volo',
    metaDescription: 'Il tuo aereo è in ritardo? Scopri quando hai diritto al risarcimento fino a €600 e come ottenerlo gratuitamente con Giustizia In Volo.',
    h1: 'Ritardo aereo: quando hai diritto al risarcimento',
    intro: 'Se il tuo volo è arrivato a destinazione con oltre 3 ore di ritardo, il Regolamento CE 261/2004 ti garantisce un risarcimento da €250 a €600 per passeggero. Giustizia In Volo si occupa di tutto senza alcun costo anticipato: paghiamo solo se otteniamo il rimborso.',
    faqs: [
      { q: 'Da quante ore di ritardo ho diritto al risarcimento?', a: 'Il diritto al risarcimento scatta quando il ritardo all\'arrivo supera le 3 ore. Il ritardo viene misurato all\'atterraggio effettivo a destinazione, non alla partenza.' },
      { q: 'Quanto vale il risarcimento per ritardo aereo?', a: '€250 per voli fino a 1.500 km, €400 per voli intraeuropei oltre 1.500 km e tutti i voli tra 1.500 e 3.500 km, €600 per voli oltre 3.500 km.' },
      { q: 'Il ritardo era dovuto a maltempo: ho comunque diritto al rimborso?', a: 'Il maltempo straordinario è una "circostanza eccezionale" che esonera la compagnia. Tuttavia, deve essere provato. Spesso le compagnie usano questa motivazione in modo improprio.' },
      { q: 'Entro quando devo fare la richiesta per un volo in ritardo?', a: 'In Italia hai 3 anni dalla data del volo per richiedere il risarcimento.' },
    ],
  },
  {
    slug: 'volo-cancellato',
    title: 'Volo Cancellato: Rimborso e Risarcimento Fino a €600 | Giustizia In Volo',
    metaDescription: 'Il tuo volo è stato cancellato? Hai diritto al rimborso del biglietto e fino a €600 di risarcimento. Agisci ora con Giustizia In Volo.',
    h1: 'Volo cancellato: tutti i tuoi diritti e come ottenere il risarcimento',
    intro: 'La cancellazione del volo è uno dei disservizi più gravi che può capitare a un passeggero. Il Reg. CE 261/2004 ti garantisce sempre il rimborso integrale del biglietto, e se la cancellazione non è stata comunicata con almeno 14 giorni di anticipo, anche un risarcimento fino a €600.',
    faqs: [
      { q: 'Ho sempre diritto al rimborso del biglietto se il volo è cancellato?', a: 'Sì, sempre, indipendentemente dal motivo della cancellazione. Puoi scegliere tra rimborso integrale del biglietto o volo alternativo alla prima data disponibile.' },
      { q: 'Quando ho diritto anche al risarcimento oltre al rimborso del biglietto?', a: 'Hai diritto al risarcimento (€250–€600) quando la cancellazione non è stata comunicata almeno 14 giorni prima e non è dovuta a circostanze eccezionali.' },
      { q: 'La compagnia mi ha offerto un voucher invece del rimborso: devo accettarlo?', a: 'No, non sei obbligato ad accettare un voucher. Hai sempre diritto al rimborso in denaro del biglietto entro 7 giorni.' },
      { q: 'Quali sono le "circostanze eccezionali" che esonerano dalla compensazione?', a: 'Maltempo estremo, instabilità politica, scioperi del controllo del traffico aereo, emergenze sanitarie. Gli scioperi interni alla compagnia NON sono circostanze eccezionali.' },
    ],
  },
  {
    slug: 'overbooking',
    title: 'Overbooking Aereo: Risarcimento Fino a €600 | Giustizia In Volo',
    metaDescription: 'Ti hanno negato l\'imbarco per overbooking? Hai diritto immediato a €250–€600. Scopri come ottenerlo con Giustizia In Volo.',
    h1: 'Overbooking aereo: i tuoi diritti e il risarcimento che ti spetta',
    intro: 'L\'overbooking (imbarco negato involontariamente) è una pratica che alcune compagnie aeree adottano vendendo più posti di quanti ne abbia l\'aereo. Se ti è capitato, hai diritto a un risarcimento immediato oltre a volo alternativo o rimborso del biglietto.',
    faqs: [
      { q: 'Cosa succede se la compagnia nega l\'imbarco per overbooking?', a: 'Devi ricevere immediatamente: scelta tra volo alternativo e rimborso del biglietto, assistenza (pasti, bevande, comunicazioni), e risarcimento monetario da €250 a €600.' },
      { q: 'Ho accettato di cedere il posto in cambio di un voucher. Posso ancora richiedere il risarcimento?', a: 'Se hai accettato volontariamente di cedere il posto e hai firmato una rinuncia, potrebbe essere complicato. Contattaci prima di firmare qualsiasi documento.' },
      { q: 'La differenza tra "overbooking volontario" e "involontario" cambia i miei diritti?', a: 'L\'overbooking involontario dà sempre diritto al risarcimento. Se hai ceduto il posto volontariamente in cambio di benefici, i diritti dipendono dall\'accordo stipulato.' },
      { q: 'Posso richiedere il risarcimento per overbooking anche anni dopo?', a: 'Sì, hai 3 anni dalla data del volo per presentare la richiesta.' },
    ],
  },
  {
    slug: 'rimborso-volo-cancellato',
    title: 'Rimborso Volo Cancellato: Come Ottenerlo | Giustizia In Volo',
    metaDescription: 'Come richiedere il rimborso per un volo cancellato. Guida completa sui tuoi diritti e come agire con Giustizia In Volo.',
    h1: 'Rimborso volo cancellato: guida completa per ottenerlo',
    intro: 'Ottenere il rimborso per un volo cancellato non dovrebbe essere complicato, eppure molte compagnie aeree rendono il processo deliberatamente difficile. Ecco tutto quello che devi sapere per far valere i tuoi diritti senza stress.',
    faqs: [
      { q: 'Entro quanto tempo devo ricevere il rimborso per il volo cancellato?', a: 'Il Reg. CE 261/2004 prevede che la compagnia rimborsi entro 7 giorni dalla richiesta. Se non rispetta questo termine, puoi procedere legalmente.' },
      { q: 'Come faccio a richiedere il rimborso per un volo cancellato?', a: 'Contatta la compagnia via email o modulo online, specificando numero volo, data e richiesta di rimborso integrale in denaro. Conserva sempre la risposta.' },
      { q: 'La compagnia mi ha proposto di cambiare la data del volo. Devo accettare?', a: 'No. Puoi sempre scegliere il rimborso integrale in denaro invece del volo alternativo.' },
      { q: 'Ho pagato il biglietto con carta di credito: posso fare un chargeback?', a: 'Sì, se la compagnia non rimborsa entro i tempi previsti puoi aprire una contestazione con la tua banca. Questo non esclude il diritto al risarcimento aggiuntivo.' },
    ],
  },
  {
    slug: 'volo-in-ritardo-rimborso',
    title: 'Volo in Ritardo: Rimborso Fino a €600 | Giustizia In Volo',
    metaDescription: 'Volo in ritardo di oltre 3 ore? Hai diritto a un rimborso fino a €600. Giustizia In Volo ti aiuta gratuitamente.',
    h1: 'Volo in ritardo: come ottenere il rimborso fino a €600',
    intro: 'Un volo in ritardo di oltre 3 ore ti dà diritto a un risarcimento in denaro, non solo a un buono pasto. Il Regolamento europeo CE 261/2004 è chiaro: la compagnia deve compensarti economicamente. Giustizia In Volo ottiene il rimborso per te senza alcun costo anticipato.',
    faqs: [
      { q: 'Come si calcola il ritardo: alla partenza o all\'arrivo?', a: 'Il ritardo si calcola all\'arrivo: è l\'orario in cui le porte dell\'aereo vengono aperte a destinazione che conta, non l\'orario di decollo.' },
      { q: 'Ho perso una coincidenza a causa del ritardo. Ho diritto a ulteriori rimborsi?', a: 'Sì, se hai perso la coincidenza a causa del ritardo del primo volo, hai diritto al risarcimento calcolato sulla distanza totale del viaggio.' },
      { q: 'Il ritardo era di 2 ore e 55 minuti. Ho diritto al rimborso?', a: 'No, la soglia è di 3 ore precise. Tuttavia, se il ritardo è borderline, vale la pena verificare: spesso i documenti ufficiali riportano orari diversi da quelli percepiti.' },
      { q: 'La compagnia mi ha dato solo un buono pasto durante il ritardo. Posso richiedere anche il risarcimento in denaro?', a: 'Assolutamente sì. Il buono pasto è un\'assistenza a cui hai diritto durante l\'attesa, ma non sostituisce il risarcimento monetario.' },
    ],
  },
  {
    slug: 'imbarco-negato',
    title: 'Imbarco Negato: Diritti e Risarcimento | Giustizia In Volo',
    metaDescription: 'Ti è stato negato l\'imbarco? Scopri i tuoi diritti e come ottenere il risarcimento fino a €600 con Giustizia In Volo.',
    h1: 'Imbarco negato: cosa fare e come ottenere il risarcimento',
    intro: 'Quando una compagnia aerea nega l\'imbarco contro la tua volontà, hai diritto a una serie di tutele immediate previste dal Reg. CE 261/2004. Non devi accettare quello che ti offrono senza conoscere i tuoi diritti.',
    faqs: [
      { q: 'Cosa devo fare immediatamente se mi viene negato l\'imbarco?', a: 'Chiedi alla compagnia una dichiarazione scritta del motivo dell\'imbarco negato, non firmare nessuna rinuncia, e richiedi assistenza (pasti, bevande) e informazioni sulle tue opzioni.' },
      { q: 'La compagnia dice che il gate era già chiuso. Hanno comunque torto?', a: 'Dipende. Se hai rispettato i tempi di check-in e presentazione al gate indicati nel biglietto, l\'imbarco negato è sempre responsabilità della compagnia.' },
      { q: 'Posso rifiutare il volo alternativo e chiedere solo il rimborso del biglietto?', a: 'Sì, hai sempre questa scelta. Non sei obbligato ad accettare il volo alternativo proposto dalla compagnia.' },
      { q: 'Ho diritto a una sistemazione alberghiera se l\'imbarco negato mi costringe a pernottare?', a: 'Sì, la compagnia deve fornire gratuitamente hotel, trasporto verso l\'hotel e due chiamate telefoniche o email.' },
    ],
  },
  {
    slug: 'coincidenza-persa',
    title: 'Coincidenza Persa: Rimborso e Risarcimento | Giustizia In Volo',
    metaDescription: 'Hai perso la coincidenza per colpa della compagnia aerea? Scopri come ottenere il rimborso e il risarcimento fino a €600.',
    h1: 'Coincidenza persa: i tuoi diritti e come ottenere il risarcimento',
    intro: 'Perdere una coincidenza a causa del ritardo del primo volo è uno dei disservizi più stressanti e costosi per i viaggiatori. Se l\'inconveniente è dovuto alla compagnia aerea e i voli erano prenotati sullo stesso biglietto, hai diritto al risarcimento.',
    faqs: [
      { q: 'Ho perso la coincidenza: ho diritto al risarcimento?', a: 'Sì, se i voli erano sullo stesso biglietto (o prenotazione) e hai perso la coincidenza per colpa della compagnia, hai diritto al risarcimento calcolato sulla distanza totale del viaggio.' },
      { q: 'I biglietti erano su prenotazioni separate. Ho ancora diritto al rimborso?', a: 'In questo caso è più complesso. Il Reg. CE 261/2004 si applica pienamente solo se i voli erano sullo stesso contratto di trasporto. Contattaci per valutare la tua situazione.' },
      { q: 'La compagnia mi ha riprenotato su un volo il giorno dopo. Ho diritto a hotel e pasti?', a: 'Sì, la compagnia deve fornire assistenza completa: hotel, trasporto e pasti per tutto il tempo di attesa.' },
      { q: 'Ho perso la coincidenza e il mio bagaglio è rimasto indietro. Posso chiedere il risarcimento anche per quello?', a: 'Sì, il ritardo del bagaglio è un danno separato che dà diritto a un rimborso aggiuntivo per le spese sostenute.' },
    ],
  },
  {
    slug: 'volo-cancellato-cosa-fare',
    title: 'Volo Cancellato: Cosa Fare | Guida Pratica – Giustizia In Volo',
    metaDescription: 'Il tuo volo è stato cancellato? Ecco cosa fare passo dopo passo per tutelare i tuoi diritti e ottenere il massimo rimborso.',
    h1: 'Volo cancellato: cosa fare passo dopo passo',
    intro: 'Scoprire che il tuo volo è stato cancellato è sempre uno shock. Ma sapere esattamente cosa fare nei momenti successivi può fare la differenza tra recuperare tutto il rimborso dovuto e perdere i tuoi diritti. Ecco la guida pratica di Giustizia In Volo.',
    faqs: [
      { q: 'Qual è la prima cosa da fare quando scopro che il volo è cancellato?', a: 'Non abbandonare l\'aeroporto senza aver chiesto alla compagnia una dichiarazione scritta della cancellazione e le opzioni disponibili: rimborso o volo alternativo.' },
      { q: 'Devo restare in aeroporto o posso andarmene?', a: 'Puoi andartene, ma prima assicurati di aver documentato la cancellazione (screenshot, comunicazioni) e di aver scelto formalmente tra rimborso e volo alternativo.' },
      { q: 'Ho prenotato hotel e trasporti per la destinazione: posso chiedere anche quei rimborsi?', a: 'Il Reg. CE 261/2004 copre il risarcimento per la cancellazione. Per i danni consequenziali (hotel, auto) devi valutare la tua polizza di assicurazione viaggio.' },
      { q: 'Quanto tempo ho per presentare la richiesta dopo la cancellazione?', a: 'In Italia hai 3 anni dalla data del volo cancellato.' },
    ],
  },
  {
    slug: 'ritardo-aereo-3-ore',
    title: 'Ritardo Aereo di 3 Ore: Rimborso Garantito | Giustizia In Volo',
    metaDescription: 'Il tuo volo è arrivato con 3 ore di ritardo? Hai diritto al risarcimento. Scopri come ottenerlo gratuitamente.',
    h1: 'Ritardo aereo di 3 ore: hai diritto al risarcimento',
    intro: 'Tre ore di ritardo all\'arrivo è la soglia magica del Reg. CE 261/2004: superata questa, la compagnia aerea è obbligata a pagarti un risarcimento in denaro. Non basta offrire un pasto o un voucher: hai diritto a compensazione monetaria.',
    faqs: [
      { q: 'Come si calcola esattamente se il ritardo ha superato le 3 ore?', a: 'Si calcola dall\'orario programmato di apertura delle porte all\'arrivo rispetto all\'orario reale. Anche un ritardo di 3 ore e 1 minuto dà diritto al risarcimento.' },
      { q: 'Il mio volo è partito in orario ma è arrivato con 3 ore di ritardo: ho diritto al rimborso?', a: 'Sì, quello che conta è il ritardo all\'arrivo, non alla partenza.' },
      { q: 'La compagnia mi ha già rimborsato il biglietto: ho ancora diritto al risarcimento?', a: 'Il rimborso del biglietto e il risarcimento per il ritardo sono due diritti separati e cumulabili.' },
      { q: 'Posso richiedere il risarcimento da solo o devo usare un servizio come Giustizia In Volo?', a: 'Puoi provarci da solo, ma le compagnie spesso ignorano o rifiutano le richieste individuali. Giustizia In Volo ha un tasso di successo molto più alto, senza costi anticipati.' },
    ],
  },
  {
    slug: 'diritti-passeggeri-aereo',
    title: 'Diritti Passeggeri Aereo: Guida Completa | Giustizia In Volo',
    metaDescription: 'Scopri tutti i tuoi diritti come passeggero aereo secondo il Reg. CE 261/2004: ritardi, cancellazioni, overbooking e bagagli.',
    h1: 'Diritti passeggeri aereo: guida completa al Reg. CE 261/2004',
    intro: 'Il Regolamento CE 261/2004 è la legge europea che tutela i passeggeri aerei in caso di ritardi, cancellazioni, overbooking e altri disservizi. Conoscere i tuoi diritti è il primo passo per non lasciarli inutilizzati.',
    faqs: [
      { q: 'Il Reg. CE 261/2004 si applica al mio volo?', a: 'Si applica a tutti i voli in partenza da un aeroporto UE, e ai voli in arrivo in UE operati da compagnie europee. Copre sia i passeggeri europei che quelli di qualsiasi altra nazionalità.' },
      { q: 'Ho diritto all\'assistenza anche se il ritardo è dovuto a sciopero?', a: 'L\'assistenza (pasti, bevande, alloggio) è sempre dovuta indipendentemente dal motivo. Il risarcimento monetario dipende dalla causa: gli scioperi interni alla compagnia non sono circostanze eccezionali.' },
      { q: 'Posso richiedere il risarcimento se ho un biglietto in classe business?', a: 'Sì, il Reg. CE 261/2004 si applica a tutti i passeggeri indipendentemente dalla classe acquistata. L\'importo del risarcimento non varia in base alla classe.' },
      { q: 'Cosa devo conservare per poter richiedere il risarcimento?', a: 'Conserva carta d\'imbarco, prenotazione, eventuali comunicazioni della compagnia e ricevute di spese extra sostenute a causa del disservizio.' },
    ],
  },
  {
    slug: 'risarcimento-volo-cancellato',
    title: 'Risarcimento Volo Cancellato: Fino a €600 | Giustizia In Volo',
    metaDescription: 'Il tuo volo è stato cancellato? Hai diritto a un risarcimento fino a €600. Scopri come ottenerlo senza costi anticipati.',
    h1: 'Risarcimento volo cancellato: quanto spetta e come ottenerlo',
    intro: 'Quando un volo viene cancellato, molti passeggeri non sanno di avere diritto non solo al rimborso del biglietto, ma anche a un risarcimento aggiuntivo in denaro. Scopri quanto ti spetta e come Giustizia In Volo lo ottiene per te.',
    faqs: [
      { q: 'Qual è la differenza tra rimborso e risarcimento per volo cancellato?', a: 'Il rimborso è la restituzione del prezzo del biglietto. Il risarcimento (€250–€600) è una compensazione aggiuntiva per il disagio subito. Puoi avere diritto a entrambi contemporaneamente.' },
      { q: 'Se scelgo il volo alternativo, perdo il diritto al risarcimento?', a: 'No. Se hai preso il volo alternativo ma la cancellazione soddisfa i criteri del Reg. CE 261/2004, hai comunque diritto al risarcimento in denaro.' },
      { q: 'La cancellazione era per sciopero dei controllori: ho diritto al rimborso?', a: 'Lo sciopero dei controllori del traffico aereo è una circostanza eccezionale che esonera dalla compensazione monetaria. Ma hai sempre diritto al rimborso integrale del biglietto.' },
      { q: 'Come calcolo a quanto risarcimento ho diritto per il mio volo cancellato?', a: 'Dipende dalla distanza: €250 per meno di 1.500 km, €400 tra 1.500 e 3.500 km, €600 oltre 3.500 km. In certi casi questo importo può essere ridotto del 50% se il volo alternativo è arrivato entro certe soglie di tempo.' },
    ],
  },
  {
    slug: 'sciopero-aereo',
    title: 'Sciopero Aereo: Diritti e Rimborsi | Giustizia In Volo',
    metaDescription: 'Volo cancellato o in ritardo per sciopero? Scopri quando hai diritto al rimborso e al risarcimento con Giustizia In Volo.',
    h1: 'Sciopero aereo: quando hai diritto al rimborso',
    intro: 'Quando un volo viene cancellato o ritardato per uno sciopero, la questione dei rimborsi dipende da chi ha scioperato. Non tutti gli scioperi sono uguali dal punto di vista legale.',
    faqs: [
      { q: 'Ho diritto al risarcimento se il volo è cancellato per sciopero?', a: 'Dipende dal tipo di sciopero. Lo sciopero interno alla compagnia aerea (piloti, assistenti di volo) NON è una circostanza eccezionale, quindi hai diritto al risarcimento. Lo sciopero del controllo del traffico aereo o del personale aeroportuale SÌ è eccezionale, quindi non dà diritto al risarcimento monetario.' },
      { q: 'Ho sempre diritto al rimborso del biglietto in caso di sciopero?', a: 'Sì, sempre, indipendentemente dal tipo di sciopero. Hai diritto al rimborso integrale del biglietto o a un volo alternativo.' },
      { q: 'Come faccio a sapere se lo sciopero era "interno" alla compagnia?', a: 'Controlla le notizie del giorno o chiedi alla compagnia una dichiarazione scritta del motivo. Giustizia In Volo può verificare per te se il caso rientra nel diritto al risarcimento.' },
      { q: 'La compagnia dice che era uno sciopero esterno ma non ne ho trovato notizie. Posso contestare?', a: 'Assolutamente sì. L\'onere della prova è sulla compagnia: deve dimostrare che si trattava di circostanze eccezionali. Giustizia In Volo sa come contestare queste affermazioni.' },
    ],
  },
  {
    slug: 'bagaglio-smarrito',
    title: 'Bagaglio Smarrito in Aereo: Rimborso e Risarcimento | Giustizia In Volo',
    metaDescription: 'La compagnia aerea ha perso il tuo bagaglio? Scopri i tuoi diritti e come ottenere il rimborso fino a €1.600.',
    h1: 'Bagaglio smarrito: cosa fare e come ottenere il rimborso',
    intro: 'Scoprire che la compagnia aerea ha perso il tuo bagaglio è una delle esperienze peggiori di viaggio. La Convenzione di Montreal ti protegge: hai diritto a un risarcimento fino a circa €1.600 per il valore dei beni persi.',
    faqs: [
      { q: 'Cosa devo fare subito se il mio bagaglio non arriva?', a: 'Prima di uscire dall\'area bagagli, vai all\'ufficio Lost & Found della compagnia e compila il modulo PIR (Property Irregularity Report). Senza questo documento è molto difficile ottenere il risarcimento.' },
      { q: 'Dopo quanto tempo un bagaglio "ritardato" diventa "smarrito"?', a: 'Dopo 21 giorni senza che il bagaglio sia stato ritrovato, viene ufficialmente considerato perso e puoi richiedere il risarcimento pieno.' },
      { q: 'Quanto vale il risarcimento massimo per un bagaglio perso?', a: 'La Convenzione di Montreal prevede un massimale di circa 1.400 DSP (diritti speciali di prelievo), equivalenti a circa €1.600–€1.700. L\'importo dipende dal valore dei beni.' },
      { q: 'Posso richiedere il rimborso per i vestiti e i prodotti che ho comprato in attesa del bagaglio?', a: 'Sì, hai diritto al rimborso delle spese essenziali e documentate sostenute durante il periodo di assenza del bagaglio.' },
    ],
  },
  {
    slug: 'maltempo-volo-cancellato',
    title: 'Volo Cancellato per Maltempo: Ho Diritto al Rimborso? | Giustizia In Volo',
    metaDescription: 'Il tuo volo è stato cancellato per maltempo? Scopri quando hai diritto al rimborso del biglietto e quando anche al risarcimento.',
    h1: 'Volo cancellato per maltempo: i tuoi diritti',
    intro: 'Il maltempo è spesso citato dalle compagnie aeree come motivo di cancellazione, ma non tutte le condizioni meteorologiche sono uguali dal punto di vista legale. Scopri quando hai diritto al rimborso e quando anche al risarcimento.',
    faqs: [
      { q: 'Il maltempo è una "circostanza eccezionale" che mi priva del risarcimento?', a: 'Non sempre. Il maltempo deve essere straordinario e imprevedibile. Una normale tempesta invernale potrebbe non bastare. La compagnia deve dimostrare che le condizioni erano eccezionali e che non poteva fare nulla per evitare la cancellazione.' },
      { q: 'Ho sempre diritto al rimborso del biglietto anche se il volo è cancellato per maltempo?', a: 'Sì, il rimborso del biglietto è sempre garantito, indipendentemente dal motivo della cancellazione. Le circostanze eccezionali riguardano solo il risarcimento aggiuntivo.' },
      { q: 'Altri voli partivano normalmente mentre il mio era cancellato "per maltempo". Cosa significa?', a: 'È un segnale molto importante: se altri aerei operavano, il maltempo non era così eccezionale da giustificare la cancellazione. In questi casi hai probabilmente diritto anche al risarcimento.' },
      { q: 'Come posso verificare se il maltempo era davvero così grave da essere "circostanza eccezionale"?', a: 'Giustizia In Volo verifica i dati meteo e i movimenti aerei di quel giorno per valutare se la giustificazione della compagnia è fondata.' },
    ],
  },
  {
    slug: 'volo-dirottato',
    title: 'Volo Dirottato: Diritti e Rimborso | Giustizia In Volo',
    metaDescription: 'Il tuo volo è stato dirottato su un altro aeroporto? Scopri i tuoi diritti e come ottenere il rimborso con Giustizia In Volo.',
    h1: 'Volo dirottato: cosa fare e a cosa hai diritto',
    intro: 'Un volo dirottato su un aeroporto diverso da quello di destinazione è un disservizio che può causare enormi disagi. Il Reg. CE 261/2004 ti tutela anche in questi casi.',
    faqs: [
      { q: 'Il mio volo è atterrato in un aeroporto diverso da quello di destinazione: ho diritto al rimborso?', a: 'Sì, hai diritto a trasporto gratuito verso la destinazione originale o il rimborso del biglietto, più eventuale risarcimento se il dirottamento è dovuto a cause non eccezionali.' },
      { q: 'La compagnia deve portarmi alla destinazione originale?', a: 'Sì, la compagnia è obbligata a organizzare e pagare il trasporto verso la destinazione originale del tuo biglietto.' },
      { q: 'Ho sostenuto spese extra per raggiungere la mia destinazione dopo il dirottamento: posso chiedere il rimborso?', a: 'Sì, tutte le spese documentate di trasporto verso la destinazione originale sono rimborsabili.' },
      { q: 'Il dirottamento era per emergenza medica a bordo: ho diritto al risarcimento?', a: 'Un\'emergenza medica è generalmente considerata circostanza eccezionale, quindi non dà diritto al risarcimento monetario aggiuntivo. Ma hai sempre diritto all\'assistenza e al trasporto verso destinazione.' },
    ],
  },
]

export function getEc261Page(slug: string): Ec261Page | undefined {
  return ec261Pages.find((p) => p.slug === slug)
}
