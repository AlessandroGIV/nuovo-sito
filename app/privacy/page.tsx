export default function PrivacyPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/5 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFC300]">Privacy Policy</h1>

          <p className="mt-4 text-white/90">
            La presente Privacy Policy descrive le modalità di raccolta e trattamento dei dati personali degli utenti
            che visitano il sito web di GiustiziaInVolo e che utilizzano i nostri servizi.
          </p>

          {/* 1 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">1. Titolare del Trattamento</h2>
          <p className="mt-2 text-white/90">Il titolare del trattamento dei dati personali è GiustiziaInVolo</p>

          {/* 2 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">2. Dati Raccolti</h2>
          <p className="mt-2 text-white/90">Raccogliamo i seguenti tipi di dati personali:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Dati di contatto (nome, cognome, email, telefono)</li>
            <li>Informazioni sul volo (numero di volo, data, compagnia aerea)</li>
            <li>Dettagli del disservizio subito</li>
            <li>Documenti di viaggio e identificativi</li>
            <li>Dati di navigazione sul sito web</li>
          </ul>

          {/* 3 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">3. Finalità del Trattamento</h2>
          <p className="mt-2 text-white/90">I dati personali sono raccolti e trattati per le seguenti finalità:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Fornire assistenza legale per il recupero del risarcimento</li>
            <li>Comunicare con l{"'"}utente riguardo alla sua pratica</li>
            <li>Adempiere agli obblighi legali e contrattuali</li>
            <li>Migliorare i nostri servizi</li>
            <li>Inviare comunicazioni informative (previo consenso)</li>
          </ul>

          {/* 4 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">4. Base Giuridica del Trattamento</h2>
          <p className="mt-2 text-white/90">Il trattamento dei dati personali si basa su:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Esecuzione di un contratto di cui l{"'"}interessato è parte</li>
            <li>Adempimento di obblighi legali</li>
            <li>Consenso dell{"'"}interessato (per finalità di marketing)</li>
            <li>Legittimo interesse del titolare</li>
          </ul>

          {/* 5 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">5. Modalità di Trattamento</h2>
          <p className="mt-2 text-white/90">
            I dati personali sono trattati con strumenti informatici e manuali, con logiche strettamente correlate alle
            finalità indicate e in modo da garantire la sicurezza e la riservatezza dei dati stessi.
          </p>

          {/* 6 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">6. Conservazione dei Dati</h2>
          <p className="mt-2 text-white/90">
            I dati personali sono conservati per il tempo necessario al conseguimento delle finalità per cui sono
            raccolti e trattati, e comunque non oltre i termini previsti dalla legge.
          </p>

          {/* 7 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">7. Diritti dell{"'"}Interessato</h2>
          <p className="mt-2 text-white/90">L{"'"}interessato ha il diritto di:</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            <li>Accedere ai propri dati personali</li>
            <li>Chiederne la rettifica o la cancellazione</li>
            <li>Limitare o opporsi al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
            <li>Proporre reclamo all{"'"}autorità di controllo</li>
          </ul>

          {/* 8 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">8. Contatti</h2>
          <p className="mt-2 text-white/90">
            Per esercitare i propri diritti o per qualsiasi informazione riguardante il trattamento dei dati personali,
            l{"'"}interessato può contattare il titolare all{"'"}indirizzo email: info@giustiziainvolo.it
          </p>

          {/* 9 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">9. Modifiche alla Privacy Policy</h2>
          <p className="mt-2 text-white/90">
            La presente Privacy Policy può essere soggetta a modifiche. Eventuali aggiornamenti saranno pubblicati sul
            sito web con indicazione della data di ultima modifica.
          </p>

          <p className="mt-6 text-sm text-white/70">Ultimo aggiornamento: Maggio 2025</p>
        </div>
      </section>
    </main>
  )
}
