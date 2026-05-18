import Link from "next/link"
import { CheckCircle2, ArrowRight, Scale, BookOpen, Users } from "lucide-react"

function FlightPath({ opacity = 0.15 }: { opacity?: number }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    >
      <path
        d="M 60 420 Q 360 50 880 200"
        fill="none"
        stroke="#FFC300"
        strokeWidth="1.25"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />
      <circle cx="60" cy="420" r="4" fill="#FFC300" opacity="0.5" />
      <circle cx="880" cy="200" r="4" fill="#FFC300" opacity="0.5" />
    </svg>
  )
}

const BULLETS = [
  "Avvocati iscritti all'albo professionale",
  "Esperienza diretta nel settore aereo",
  "Specializzati nel Regolamento CE 261/2004",
  "Comunicazione chiara e diretta",
]

const VALUES = [
  {
    icon: BookOpen,
    title: "Trasparenza",
    body: "Comunichiamo in modo chiaro e diretto, senza promesse irrealistiche o costi nascosti. Saprai sempre a che punto è la tua pratica.",
  },
  {
    icon: Scale,
    title: "Professionalità",
    body: "Ogni caso è gestito con la massima competenza da avvocati qualificati, nel rispetto del codice deontologico.",
  },
  {
    icon: Users,
    title: "Accessibilità",
    body: "Crediamo che la giustizia debba essere accessibile a tutti, indipendentemente dalle possibilità economiche. Per questo non chiediamo anticipi.",
  },
]

export default function ChiSiamoPage() {
  return (
    <main
      className="text-white"
      style={{ background: "linear-gradient(180deg, #0E2032 0%, #0A1826 100%)" }}
    >
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <FlightPath />
        <div className="relative z-10 mx-auto max-w-[1100px] flex flex-col items-center text-center px-5 pt-12 pb-10 lg:px-8 lg:pt-20 lg:pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5CC]/10 border border-[#FFC300]/25 text-[#FFC300] text-[11px] font-extrabold uppercase tracking-[0.15em] mb-5">
            Chi siamo
          </div>
          <h1
            className="m-0 font-extrabold leading-[1.05] tracking-[-0.03em] max-w-2xl text-white"
            style={{ fontSize: "clamp(26px, 5vw, 48px)" }}
          >
            Avvocati dalla parte{" "}
            <span className="text-[#FFC300]">dei passeggeri.</span>
          </h1>
          <p className="mt-5 text-white/65 max-w-lg text-[15px] lg:text-[17px] leading-relaxed">
            Un team di avvocati specializzati nei diritti dei passeggeri aerei — con esperienza
            diretta nel settore, dalla parte opposta del tavolo.
          </p>
        </div>
      </section>

      {/* ── STORY + MISSION ──────────────────────────────────────────────── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16 grid md:grid-cols-2 gap-10 items-start">
          {/* Story */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFC300] mb-3">
              La nostra storia
            </p>
            <div className="space-y-4 text-[15px] text-white/65 leading-relaxed">
              <p>
                GiustiziaInVolo nasce dall'esperienza di un team di avvocati specializzati nel
                diritto dei trasporti e nella tutela dei consumatori.
              </p>
              <p>
                Il fondatore del progetto ha lavorato come legale per una nota compagnia aerea,
                acquisendo una conoscenza approfondita del settore e delle strategie utilizzate
                dalle compagnie per evitare di pagare i risarcimenti dovuti.
              </p>
              <p>
                Questa esperienza ci permette di conoscere il sistema dall'interno e di usarla a
                vantaggio dei passeggeri, per far valere i loro diritti in modo efficace.
              </p>
            </div>
            <ul className="mt-6 flex flex-col gap-3">
              {BULLETS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC300] flex-shrink-0" />
                  <span className="text-[14.5px] text-white/75">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission */}
          <div
            className="rounded-2xl p-6 lg:p-8 border border-[#FFC300]/20 flex flex-col gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,195,0,0.07) 0%, rgba(255,195,0,0.02) 100%)",
            }}
          >
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFC300]">
              La nostra missione
            </p>
            <h2 className="text-[22px] lg:text-[26px] font-extrabold text-white leading-snug tracking-tight">
              Rendere i diritti dei passeggeri accessibili a tutti.
            </h2>
            <p className="text-[14.5px] text-white/60 leading-relaxed">
              Crediamo che ogni passeggero abbia diritto a un trattamento equo e a un risarcimento
              adeguato quando i suoi diritti vengono violati. La nostra missione è rendere questo
              processo semplice, trasparente e accessibile a tutti — senza costi iniziali e con un
              approccio umano e professionale.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFC300] mb-3 text-center">
            I nostri valori
          </p>
          <h2 className="text-[24px] lg:text-[30px] font-extrabold text-white text-center tracking-tight mb-8">
            Principi che guidano ogni pratica.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-2xl p-6 border border-white/[0.07]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="w-11 h-11 rounded-xl bg-[#FFC300]/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#FFC300]" />
                </span>
                <div>
                  <div className="text-[15px] font-bold text-white mb-1.5">{title}</div>
                  <p className="text-[14px] text-white/55 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-5 py-14 lg:px-8 lg:py-20 text-center">
        <h2 className="text-[24px] lg:text-[32px] font-extrabold text-white tracking-tight mb-3">
          Hai subito un disservizio aereo?
        </h2>
        <p className="text-white/60 text-[15px] mb-8 max-w-md mx-auto leading-relaxed">
          Contattaci per una valutazione gratuita. Un avvocato reale analizzerà la tua situazione
          entro 24 ore.
        </p>
        <Link
          href="/richiesta"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] bg-gradient-to-br from-[#FFD54F] to-[#FFC300] text-[#7A4A12] shadow-[0_8px_24px_-8px_rgba(255,195,0,0.5)] hover:-translate-y-px transition-all"
        >
          Richiedi assistenza gratuita <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  )
}
