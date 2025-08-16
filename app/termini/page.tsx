export default function TerminiPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/5 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFC300]">Termini e Condizioni</h1>

          <p className="mt-4 text-white/90">
            I presenti Termini e Condizioni regolano l{"'"}utilizzo del sito web di GiustiziaInVolo e la fornitura dei
            servizi di assistenza legale per il recupero dei risarcimenti previsti dal Regolamento CE 261/2004.
          </p>

          {/* 1 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">1. Definizioni</h2>
          <p className="mt-2 text-white/90">Ai fini dei presenti Termini e Condizioni, si intende per:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>
              {'"'}Cliente{'"'} o {'"'}Passeggero{'"'}: la persona fisica o giuridica che richiede i servizi di
              GiustiziaInVolo
            </li>
            <li>
              {'"'}GiustiziaInVolo{'"'}: il servizio legale fornito da Studio Legale Petrecca
            </li>
            <li>
              {'"'}Mandato{'"'}: l{"'"}incarico professionale conferito dal Cliente a GiustiziaInVolo
            </li>
            <li>
              {'"'}Compagnia aerea{'"'}: il vettore aereo responsabile del disservizio
            </li>
            <li>
              {'"'}Compensazione{'"'}: il risarcimento previsto dal Regolamento CE 261/2004
            </li>
            <li>
              {'"'}Credito{'"'}: l{"'"}importo dovuto dalla compagnia aerea al passeggero
            </li>
            <li>
              {'"'}Sito{'"'}: il sito web www.giustiziainvolo.it
            </li>
          </ul>

          {/* 2 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">2. Oggetto del Servizio e Limiti</h2>
          <p className="mt-2 text-white/90">
            GiustiziaInVolo offre assistenza legale per il recupero di compensazioni pecuniarie, rimborsi e danni
            derivanti da disservizi aerei, inclusa la gestione di reclami, attività stragiudiziale e giudiziale per:
          </p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Voli cancellati</li>
            <li>Voli in ritardo</li>
            <li>Negato imbarco (overbooking)</li>
            <li>Altri disservizi coperti dal Regolamento CE 261/2004 e normative connesse</li>
          </ul>
          <p className="mt-4 text-white/90 font-semibold">Limiti del servizio:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Il servizio è limitato ai voli per cui il Cliente abbia effettivo diritto secondo il Reg. UE 261/04</li>
            <li>Non viene fornita consulenza legale personalizzata generale</li>
            <li>Sono escluse pratiche già trattate da altri professionisti</li>
            <li>Sono esclusi casi già prescritti o per cui sia già stato ottenuto risarcimento</li>
          </ul>

          {/* 3 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">3. Conclusione del Contratto</h2>
          <p className="mt-2 text-white/90">
            Con l{"'"}accettazione dei presenti Termini e Condizioni e l{"'"}invio del modulo {'"'}INVIA RICHIESTA!{'"'}{" "}
            tramite il sito www.giustiziainvolo.it, il Cliente formula a Giustizia in Volo una proposta contrattuale
            vincolante per il conferimento di un incarico di rappresentanza volto alla presentazione del reclamo (e di
            tutte le attività connesse e conseguenti, incluse eventuali procedure di conciliazione e/o la proposizione
            di azioni giudiziali), finalizzato all{"'"}ottenimento della compensazione pecuniaria, del rimborso o di
            qualsiasi altra somma eventualmente dovuta ai sensi del Regolamento UE n. 261/2004 o di altra normativa
            nazionale e/o internazionale applicabile in materia di diritti del passeggero.
          </p>
          <p className="mt-2 text-white/90">
            Giustizia in Volo si riserva il diritto di accettare l{"'"}incarico solo a seguito della verifica della
            sussistenza dei presupposti previsti dal Regolamento UE n. 261/2004 (o da ogni altra normativa applicabile)
            e della ricezione di tutta la documentazione necessaria per la predisposizione del reclamo. L{"'"}
            accettazione dell{"'"}incarico sarà comunicata al Cliente tramite e-mail.
          </p>

          {/* 4 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">4. Gestione delle Somme e Compensi</h2>
          <p className="mt-2 text-white/90">
            Il servizio è fornito secondo il modello {'"'}no win, no fee{'"'}:
          </p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Nessun costo anticipato è richiesto al Cliente</li>
            <li>Il compenso è dovuto solo in caso di esito positivo</li>
            <li>
              In caso di successo con diffida stragiudiziale: GiustiziaInVolo trattiene il 20% per rimborsi da 250€ e
              400€, il 25% per rimborsi da 600€
            </li>
            <li>
              In caso di procedimento giudiziario: GiustiziaInVolo trattiene le spese legali liquidate dal giudice più
              la percentuale sopra indicata
            </li>
            <li>Il pagamento al Cliente avviene entro 30 giorni dall{"'"}incasso delle somme</li>
            <li>Tutte le spese legali e processuali sono anticipate da GiustiziaInVolo</li>
            <li>In caso di esito negativo, nessun compenso è dovuto</li>
          </ul>

          {/* 5 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">5. Obblighi e Responsabilità del Cliente</h2>
          <p className="mt-2 text-white/90">Il Cliente si impegna a:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Fornire informazioni veritiere, complete e aggiornate</li>
            <li>Non conferire lo stesso incarico ad altri professionisti</li>
            <li>Non aver già percepito somme per la stessa richiesta</li>
            <li>Collaborare attivamente fornendo la documentazione richiesta</li>
            <li>Comunicare tempestivamente eventuali variazioni o comunicazioni ricevute dalla compagnia aerea</li>
            <li>Non intraprendere autonomamente azioni nei confronti della compagnia aerea durante il mandato</li>
          </ul>
          <p className="mt-2 text-white/90">
            La fornitura di informazioni errate o la mancata collaborazione possono comportare la risoluzione del
            contratto e l{"'"}addebito delle spese sostenute.
          </p>

          {/* 6 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">6. Doveri e Obblighi di GiustiziaInVolo</h2>
          <p className="mt-2 text-white/90">GiustiziaInVolo si impegna a:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Gestire la pratica con la massima diligenza professionale</li>
            <li>Seguire le procedure più appropriate per il caso specifico</li>
            <li>Fornire aggiornamenti al Cliente nei casi essenziali o a esito raggiunto</li>
            <li>Rispettare la normativa sulla privacy e tutelare i dati personali</li>
            <li>Mantenere la riservatezza su tutte le informazioni ricevute</li>
          </ul>
          <p className="mt-2 text-white/90">
            Importante: GiustiziaInVolo non può garantire l{"'"}esito positivo della pratica, che dipende da fattori non
            sempre controllabili.
          </p>

          {/* 7 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">7. Nomina di un Avvocato</h2>
          <p className="mt-2 text-white/90">
            GiustiziaInVolo si riserva la facoltà di nominare un avvocato per l{"'"}attività giudiziale qualora quella
            stragiudiziale non abbia esito positivo.
          </p>
          <p className="mt-2 text-white/90">
            Il Cliente, con la sottoscrizione del presente contratto, autorizza tale nomina e conferisce mandato anche
            al legale che sarà eventualmente scelto da GiustiziaInVolo.
          </p>
          <p className="mt-2 text-white/90">
            Tutti i costi di giudizio restano a carico di GiustiziaInVolo, salvo casi di dolo o colpa grave del Cliente.
          </p>

          {/* 8 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">8. Durata e Risoluzione del Contratto</h2>
          <p className="mt-2 text-white/90">
            Il contratto ha durata fino alla chiusura della pratica o al raggiungimento dell{"'"}esito finale, positivo
            o negativo.
          </p>
          <p className="mt-2 text-white/90">Il contratto può essere risolto anticipatamente per:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Giusta causa (inadempimento grave di una delle parti)</li>
            <li>Impossibilità di proseguire (documenti falsi, doppio mandato, ecc.)</li>
            <li>Mutuo consenso delle parti</li>
          </ul>
          <p className="mt-2 text-white/90">
            In caso di risoluzione, le spese sostenute fino a quel momento restano a carico della parte inadempiente, e
            GiustiziaInVolo provvederà alla restituzione della documentazione fornita dal Cliente.
          </p>

          {/* 9 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">9. Diritto di Recesso del Consumatore</h2>
          <p className="mt-2 text-white/90">
            Il Cliente consumatore ha diritto di recedere dal contratto entro 14 giorni dalla sua conclusione, senza
            dover fornire alcuna motivazione e senza sostenere penalità.
          </p>
          <p className="mt-2 text-white/90">Il recesso può essere esercitato tramite:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Comunicazione scritta all{"'"}indirizzo info@giustiziainvolo.it</li>
            <li>Posta elettronica certificata (PEC)</li>
          </ul>
          <p className="mt-2 text-white/90">
            In caso di recesso, nessun compenso è dovuto a GiustiziaInVolo, salvo per le attività già svolte su
            richiesta esplicita del Cliente prima della scadenza del termine di recesso.
          </p>

          {/* 10 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">10. Legge Applicabile e Foro Competente</h2>
          <p className="mt-2 text-white/90">
            I presenti Termini e Condizioni sono regolati dalla legge italiana. Per qualsiasi controversia relativa all
            {"'"}interpretazione, esecuzione o risoluzione del presente contratto, sarà competente in via esclusiva il
            Foro di Isernia.
          </p>
          <p className="mt-2 text-white/90">
            Per i rapporti con i consumatori, resta salva la competenza del foro del consumatore quando più favorevole
            secondo la normativa vigente.
          </p>

          <p className="mt-6 text-sm text-white/70">Ultimo aggiornamento: maggio 2025</p>
        </div>
      </section>
    </main>
  )
}
