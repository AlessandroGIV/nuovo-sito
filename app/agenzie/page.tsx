import type { Metadata } from 'next'
import Link from 'next/link'
import { AdesioneForm } from '@/components/agenzie/adesione-form'
import { RouteTrack, StatusBadge } from '@/components/portale/status'

export const metadata: Metadata = {
  title: 'Agenzie di viaggio | Assistenza ai clienti per voli in ritardo o cancellati – Giustizia In Volo',
  description:
    'Un servizio in più per i clienti della tua agenzia. Segnali il volo in ritardo o cancellato, il nostro team legale segue la richiesta di compensazione e tu vedi lo stato della pratica.',
  alternates: { canonical: 'https://giustiziainvolo.it/agenzie' },
}

const STEPS = [
  {
    title: 'Chiedi l’adesione',
    body: 'Compili il modulo in fondo alla pagina. Ti ricontattiamo, definiamo insieme la collaborazione e ricevi il codice agenzia con l’accesso all’area riservata.',
  },
  {
    title: 'Segnali il caso',
    body: 'Dai al cliente il tuo link o il QR da tenere al banco, oppure inserisci tu la pratica con i documenti di viaggio che hai già.',
  },
  {
    title: 'Segui la pratica',
    body: 'Nell’area riservata vedi a che punto è ogni pratica, dalla segnalazione all’esito, senza dover telefonare per saperlo.',
  },
]

const REASONS = [
  {
    title: 'Un servizio in più per chi viaggia con te',
    body: 'Ritardi e cancellazioni capitano. Il cliente che trova una risposta in agenzia ha un motivo in più per tornarci.',
  },
  {
    title: 'Nessun costo per aderire',
    body: 'L’adesione è gratuita e non ci sono volumi minimi. Segnali un caso quando capita.',
  },
  {
    title: 'Il passeggero non anticipa nulla',
    body: 'Il nostro compenso è dovuto solo se la compagnia paga. Se non si ottiene nulla, il passeggero non deve nulla.',
  },
  {
    title: 'Non ci fermiamo al primo rifiuto',
    body: 'Quando la compagnia non risponde o respinge la richiesta, valutiamo con il passeggero l’azione in sede giudiziale.',
  },
]

const CASES = [
  'Arrivo a destinazione con almeno tre ore di ritardo',
  'Volo cancellato',
  'Imbarco negato per overbooking',
  'Coincidenza persa, con un’unica prenotazione, e arrivo finale con almeno tre ore di ritardo',
]

const FAQ = [
  {
    q: 'Aderire ha un costo?',
    a: 'No. L’adesione è gratuita e non comporta obblighi di volume o di esclusiva.',
  },
  {
    q: 'Cosa devo fare quando un cliente ha un problema con un volo?',
    a: 'Gli mandi il tuo link personale, oppure inserisci tu la pratica dall’area riservata. Servono i dati del passeggero e del volo e, se li hai, carta d’imbarco e conferma di prenotazione.',
  },
  {
    q: 'Cosa vedo nell’area riservata?',
    a: 'Le pratiche segnalate dalla tua agenzia e il loro stato di avanzamento. I documenti del passeggero e la corrispondenza con la compagnia restano riservati.',
  },
  {
    q: 'Devo avvisare il cliente prima di segnalare?',
    a: 'Sì. Prima di inserire una pratica informa il passeggero che i suoi dati vengono trasmessi a Giustizia In Volo per la valutazione del caso. Nel modulo ti chiediamo di confermarlo.',
  },
  {
    q: 'Chi tiene i rapporti con la compagnia aerea?',
    a: 'Noi. Dopo la segnalazione contattiamo il passeggero, raccogliamo l’incarico e gestiamo ogni comunicazione con il vettore.',
  },
]

function Diamond() {
  return (
    <span
      aria-hidden="true"
      className="mt-[7px] inline-block h-2 w-2 flex-shrink-0 rotate-45 rounded-[2px] bg-[#FFC300]"
    />
  )
}

export default function AgenziePage() {
  return (
    <main className="bg-[#F6F4EF] text-[#072534]">
      {/* ── Apertura ─────────────────────────────────────────────────────── */}
      <section
        className="text-white"
        style={{ background: 'linear-gradient(180deg, #0E2032 0%, #0A1826 100%)' }}
      >
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-5 pb-14 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:pb-20 lg:pt-20">
          <div>
            <p className="text-[14px] font-semibold text-[#FFC300]">Per le agenzie di viaggio</p>
            <h1
              className="mt-3 font-extrabold leading-[1.06] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(30px, 5.2vw, 50px)' }}
            >
              Quando il volo salta, il cliente chiama la sua agenzia.
            </h1>
            <p className="mt-5 max-w-[54ch] text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
              Con Giustizia In Volo hai una risposta pronta. Ci segnali il caso in due minuti, il nostro team
              legale segue la richiesta di compensazione fino alla fine e tu vedi sempre a che punto è.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#adesione"
                className="inline-flex items-center justify-center rounded-xl bg-[#FFC300] px-6 py-3.5 text-[15px] font-bold text-[#072534] transition-colors hover:bg-[#FFB800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E2032]"
              >
                Richiedi l’adesione
              </a>
              <Link
                href="/agenzie/accedi"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:border-[#FFC300] hover:text-[#FFC300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
              >
                Accedi all’area agenzie
              </Link>
            </div>
          </div>

          {/* Come appare una pratica nell'area riservata */}
          <figure className="m-0">
            <div className="rounded-2xl bg-white p-5 text-[#072534] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[13px] font-semibold tabular-nums text-[#5A7088]">GIV-26-01042</div>
                  <div className="mt-0.5 text-[18px] font-extrabold tracking-[-0.01em]">Roma Fiumicino, Madrid</div>
                  <div className="mt-0.5 text-[14px] text-[#4A5E73]">Ritardo, 2 passeggeri</div>
                </div>
                <StatusBadge status="richiesta_inviata" />
              </div>
              <RouteTrack status="richiesta_inviata" className="mt-6" />
              <p className="mt-5 border-t border-[#072534]/[0.08] pt-4 text-[14px] leading-relaxed text-[#4A5E73]">
                Abbiamo chiesto la compensazione alla compagnia aerea.
              </p>
            </div>
            <figcaption className="mt-3 text-center text-[13px] text-white/55">
              Esempio di pratica vista dall’area agenzie
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Come funziona ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-5 py-14 lg:px-8 lg:py-20">
        <h2 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Come funziona</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t-[3px] border-[#072534] pt-4">
              <div className="text-[15px] font-extrabold tabular-nums text-[#B98900]">{i + 1}</div>
              <h3 className="mt-1 text-[19px] font-bold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-[#3D5166]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Perché aderire ───────────────────────────────────────────────── */}
      <section className="border-y border-[#072534]/10 bg-white">
        <div className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">
              Cosa cambia per l’agenzia
            </h2>
            <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed text-[#3D5166]">
              Tu resti il riferimento del cliente. Della pratica, dei documenti e della compagnia ci occupiamo
              noi.
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {REASONS.map((r) => (
              <div key={r.title}>
                <dt className="text-[17px] font-bold tracking-[-0.01em]">{r.title}</dt>
                <dd className="mt-1.5 text-[15.5px] leading-relaxed text-[#3D5166]">{r.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Quali casi ───────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Quali casi segnalare</h2>
          <p className="mt-3 max-w-[52ch] text-[15.5px] leading-relaxed text-[#3D5166]">
            In base al Regolamento CE 261/2004 al passeggero può spettare una compensazione da 250 a 600 euro,
            secondo la distanza della tratta, in situazioni come queste.
          </p>
          <ul className="mt-6 space-y-3">
            {CASES.map((c) => (
              <li key={c} className="flex gap-3 text-[16px] font-medium leading-snug">
                <Diamond />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[52ch] text-[14.5px] leading-relaxed text-[#4A5E73]">
            Non ogni disservizio dà diritto alla compensazione. Non è dovuta, ad esempio, quando la compagnia
            dimostra che la cancellazione o il ritardo dipendono da circostanze eccezionali che non poteva
            evitare. Per questo valutiamo ogni segnalazione prima di procedere.
          </p>
        </div>

        <div>
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Domande frequenti</h2>
          <div className="mt-5 divide-y divide-[#072534]/10 border-y border-[#072534]/10">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#072534] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 text-[20px] font-normal leading-none text-[#B98900] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-[58ch] text-[15.5px] leading-relaxed text-[#3D5166]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Adesione ─────────────────────────────────────────────────────── */}
      <section id="adesione" className="scroll-mt-20 border-t border-[#072534]/10 bg-white">
        <div className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] lg:text-[32px]">Richiedi l’adesione</h2>
            <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed text-[#3D5166]">
              Lasciaci i dati dell’agenzia. Ti ricontattiamo noi per definire la collaborazione e attivare
              l’accesso.
            </p>
            <p className="mt-6 text-[15px] text-[#3D5166]">
              Hai già un codice agenzia?{' '}
              <Link href="/agenzie/accedi" className="font-bold underline underline-offset-2">
                Accedi
              </Link>
            </p>
          </div>
          <div className="relative">
            <AdesioneForm />
          </div>
        </div>
      </section>
    </main>
  )
}
