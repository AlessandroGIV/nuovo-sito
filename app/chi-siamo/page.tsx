import { CheckCircle } from 'lucide-react'

export default function ChiSiamoPage() {
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">Chi Siamo</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          Un team di avvocati specializzati nei diritti dei passeggeri aerei.
        </p>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-14 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold text-[#FFC300]">La Nostra Storia</h2>
          <div className="mt-4 space-y-4 text-white/85">
            <p>
              GiustiziaInVolo nasce dall’esperienza di un team di avvocati specializzati nel diritto
              dei trasporti e nella tutela dei consumatori.
            </p>
            <p>
              Il fondatore del progetto ha lavorato come legale per una nota compagnia aerea,
              acquisendo una conoscenza approfondita del settore e delle strategie utilizzate dalle
              compagnie per evitare di pagare i risarcimenti dovuti.
            </p>
            <p>
              Questa esperienza ci permette di conoscere il sistema dall’interno e di utilizzare
              questa conoscenza a vantaggio dei passeggeri, per far valere i loro diritti in modo
              efficace.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Avvocati iscritti all’albo professionale',
                'Esperienza diretta nel settore aereo',
                'Specializzati nel Regolamento CE 261/2004',
                'Comunicazione chiara e diretta',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-[#FFC300]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="rounded-xl bg-white/10 p-6">
          <h3 className="text-2xl font-extrabold text-[#FFC300]">La Nostra Missione</h3>
          <p className="mt-3 text-white/85">
            Crediamo che ogni passeggero abbia diritto a un trattamento equo e a un risarcimento
            adeguato quando i suoi diritti vengono violati. La nostra missione è rendere questo
            processo semplice, trasparente e accessibile a tutti, senza costi iniziali e con un
            approccio umano e professionale.
          </p>
        </aside>
      </section>

      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-3xl font-extrabold text-[#FFC300]">I Nostri Valori</h3>
          <p className="mt-2 text-white/85">Principi che guidano il nostro lavoro quotidiano</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                t: 'Trasparenza',
                d: 'Comunichiamo in modo chiaro e diretto, senza promesse irrealistiche o costi nascosti. Saprai sempre a che punto è la tua pratica.',
              },
              {
                t: 'Professionalità',
                d: 'Ogni caso è gestito con la massima competenza e serietà da avvocati qualificati, nel rispetto del codice deontologico.',
              },
              {
                t: 'Accessibilità',
                d: 'Crediamo che la giustizia debba essere accessibile a tutti, indipendentemente dalle possibilità economiche. Per questo non chiediamo anticipi.',
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl bg-white/10 p-6 text-left">
                <h4 className="text-xl font-bold text-[#FFC300]">{c.t}</h4>
                <p className="mt-2 text-white/85">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h4 className="text-3xl font-extrabold text-[#FFC300]">Hai Subito un Disservizio Aereo?</h4>
            <p className="mt-2 text-white/85">
              Contattaci oggi stesso per una valutazione gratuita del tuo caso. Un avvocato reale
              analizzerà la tua situazione.
            </p>
            <a
              href="/#contact-form"
              className="mt-6 inline-block rounded-md bg-[#FF8A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8a00]/90"
            >
              Richiedi assistenza
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
