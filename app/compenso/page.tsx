export default function CompensoPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">Modello di Compenso</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          Un sistema trasparente e senza costi anticipati.
        </p>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold text-[#FFC300]">Nessun Anticipo Richiesto</h2>
          <div className="mt-4 space-y-4 text-white/85">
            <p>
              Il nostro modello di compenso è basato sul principio "no win, no fee": se non
              otteniamo il risarcimento per te, non paghi nulla.
            </p>
            <p>
              Solo in caso di successo tratteniamo una percentuale dell'importo recuperato, sempre
              trasparente e concordata in anticipo.
            </p>
            <ul className="mt-4 space-y-2">
              <li>€ Nessun costo iniziale o nascosto</li>
              <li>% Percentuale contenuta e trasparente</li>
              <li>📝 Accordo scritto chiaro e dettagliato</li>
            </ul>
          </div>
        </div>

        <aside className="rounded-xl bg-white/10 p-6">
          <h3 className="text-2xl font-extrabold text-[#FFC300]">La Nostra Quota</h3>
          <ol className="mt-4 space-y-4 text-white/85">
            <li>
              <span className="font-bold">In caso di successo con diffida:</span> tratteniamo solo
              il 20-25% dell'importo recuperato (20% per rimborsi da 250€ e 400€, 25% per quelli da
              600€).
            </li>
            <li>
              <span className="font-bold">In caso di giudizio:</span> tratteniamo quanto liquidato
              dal giudice come spese legali + la medesima quota minima.
            </li>
            <li>
              <span className="font-bold">Limite massimo:</span> mai oltre una percentuale massima
              del 25% dell'importo recuperato.
            </li>
          </ol>
          <div className="mt-4 rounded-md border border-yellow-400/40 bg-yellow-500/10 p-3 text-white/90">
            In caso di insuccesso, non dovrai pagare nulla. Ci assumiamo interamente il rischio
            della pratica.
          </div>
        </aside>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h3 className="text-center text-3xl font-extrabold text-[#FFC300]">Esempi Concreti</h3>
        <p className="mt-2 text-center text-white/85">
          Ecco alcuni esempi di quanto potresti ricevere in diversi scenari:
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-lg text-left">
            <thead className="bg-[#243947] text-[#FFC300]">
              <tr>
                <th className="px-4 py-3 font-bold">Scenario</th>
                <th className="px-4 py-3 font-bold">Risarcimento</th>
                <th className="px-4 py-3 font-bold">Quota trattenuta</th>
                <th className="px-4 py-3 font-bold">Tu ricevi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              <tr>
                <td className="px-4 py-3">Volo cancellato, rimborso ottenuto con diffida</td>
                <td className="px-4 py-3">250 €</td>
                <td className="px-4 py-3">50 € (20%)</td>
                <td className="px-4 py-3 font-bold text-[#FFC300]">200 €</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Volo in ritardo di 4 ore, rimborso ottenuto con diffida</td>
                <td className="px-4 py-3">400 €</td>
                <td className="px-4 py-3">80 € (20%)</td>
                <td className="px-4 py-3 font-bold text-[#FFC300]">320 €</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Volo cancellato, rimborso ottenuto in giudizio</td>
                <td className="px-4 py-3">600 €</td>
                <td className="px-4 py-3">150 € (25%)</td>
                <td className="px-4 py-3 font-bold text-[#FFC300]">450 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="rounded-xl bg-white/10 p-6">
          <h3 className="text-2xl font-extrabold text-[#FFC300]">Perché Questo Modello?</h3>
          <p className="mt-3 text-white/85">
            Abbiamo scelto questo modello di compenso per rendere il servizio accessibile a tutti,
            indipendentemente dalle possibilità economiche. Crediamo che i passeggeri non debbano
            sostenere ulteriori costi dopo aver già subito un disservizio da parte della compagnia
            aerea. Inoltre, questo modello allinea i nostri interessi con i tuoi: siamo motivati a
            ottenere il massimo risarcimento possibile nel minor tempo possibile.
          </p>
        </div>

        <div className="mt-10 text-center">
          <h4 className="text-3xl font-extrabold text-[#FFC300]">Trasparenza e Chiarezza</h4>
          <p className="mt-2 text-white/85">
            Prima di iniziare, riceverai un accordo scritto che specifica chiaramente tutti i
            termini del nostro rapporto, inclusa la quota che tratterremo in caso di successo.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact-form"
              className="rounded-md bg-[#FF8A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8a00]/90"
            >
              Richiedi assistenza gratuita
            </a>
            <a
              href="/faq"
              className="rounded-md bg-[#FFC300] px-6 py-3 font-semibold text-[#072534] hover:bg-[#FFB800]"
            >
              Leggi le FAQ
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
