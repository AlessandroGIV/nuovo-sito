import Link from "next/link"
import { Shield, Euro, CheckCircle2, ArrowRight, Percent } from "lucide-react"

// ── decorators ────────────────────────────────────────────────────────────────

function FlightPath({ opacity = 0.18 }: { opacity?: number }) {
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

function Bullet() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: 8,
        height: 8,
        background: "#FFC300",
        borderRadius: 2,
        transform: "rotate(45deg)",
        marginTop: 6,
      }}
    />
  )
}

// ── data ──────────────────────────────────────────────────────────────────────

const EXAMPLES = [
  {
    scenario: "Ritardo oltre 3 ore — volo breve (< 1500 km)",
    compensation: 250,
    fee: 62.5,
    youGet: 187.5,
  },
  {
    scenario: "Cancellazione — volo medio (1500–3500 km)",
    compensation: 400,
    fee: 100,
    youGet: 300,
  },
  {
    scenario: "Ritardo oltre 4 ore — volo lungo (> 3500 km)",
    compensation: 600,
    fee: 150,
    youGet: 450,
  },
]

const PILLARS = [
  {
    icon: Euro,
    title: "Zero costi iniziali",
    body: "Non ti chiediamo un centesimo per avviare la pratica. Valutazione, gestione e comunicazione con la compagnia sono completamente gratuite.",
  },
  {
    icon: Percent,
    title: "25% solo se vinciamo",
    body: "Il nostro compenso è il 25% del rimborso effettivamente ottenuto. Se la compagnia non paga, non paghi nemmeno tu.",
  },
  {
    icon: Shield,
    title: "Avvocati specializzati",
    body: "Seguiamo ogni pratica con avvocati esperti in diritto aereo. Sappiamo quando vale la pena procedere e quando no.",
  },
]

// ── page ─────────────────────────────────────────────────────────────────────

export default function CompensoPage() {
  return (
    <main
      className="text-white"
      style={{ background: "linear-gradient(180deg, #0E2032 0%, #0A1826 100%)" }}
    >
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <FlightPath />
        <div className="relative z-10 mx-auto max-w-[1100px] flex flex-col items-center text-center px-5 pt-12 pb-10 lg:px-8 lg:pt-20 lg:pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5CC]/10 border border-[#FFC300]/25 text-[#FFC300] text-[11px] font-extrabold uppercase tracking-[0.15em] mb-5">
            Il nostro modello
          </div>
          <h1
            className="m-0 font-extrabold leading-[1.05] tracking-[-0.03em] max-w-3xl text-white"
            style={{ fontSize: "clamp(28px, 5.5vw, 52px)" }}
          >
            Nessun anticipo.{" "}
            <span
              className="text-[#FFC300]"
              style={{ borderBottom: "4px solid #FFC300", paddingBottom: 2 }}
            >
              Solo il 25%
            </span>{" "}
            se vinciamo.
          </h1>
          <p className="mt-5 text-white/70 max-w-xl text-[15px] lg:text-[17px] leading-relaxed">
            Se recuperiamo il tuo rimborso, tratteniamo il 25% come onorario. Se non otteniamo nulla,
            non paghi nulla. È così semplice.
          </p>
          <Link
            href="/richiesta"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[15px] bg-gradient-to-br from-[#FFD54F] to-[#FFC300] text-[#7A4A12] shadow-[0_8px_24px_-8px_rgba(255,195,0,0.5)] hover:-translate-y-px transition-all"
          >
            Richiedi gratuitamente <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 3 PILLARS ────────────────────────────────────────────────────── */}
      <section className="border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PILLARS.map(({ icon: Icon, title, body }) => (
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

      {/* ── HOW THE 25% WORKS ────────────────────────────────────────────── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFC300] mb-3">
              Come funziona
            </p>
            <h2 className="text-[28px] lg:text-[36px] font-extrabold leading-tight tracking-tight text-white mb-5">
              Un modello semplice,
              <br />
              senza sorprese.
            </h2>
            <ul className="flex flex-col gap-4">
              {[
                "Compili la richiesta online in 2 minuti — è gratuita.",
                "Un avvocato valuta il tuo caso entro 24 ore.",
                "Gestiamo tutto: lettere, negoziazione, eventuale ricorso.",
                "Se otteniamo il rimborso, tratteniamo il 25%. Il resto è tuo.",
                "Se la compagnia non paga, non ti addebitiamo nulla.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC300] flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] text-white/75 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 25% visual card */}
          <div
            className="rounded-2xl p-7 lg:p-9 flex flex-col items-center text-center border border-[#FFC300]/20"
            style={{ background: "linear-gradient(135deg, rgba(255,195,0,0.08) 0%, rgba(255,195,0,0.02) 100%)" }}
          >
            <div
              className="text-[72px] lg:text-[90px] font-extrabold leading-none tracking-tight text-[#FFC300]"
              style={{ textShadow: "0 0 60px rgba(255,195,0,0.25)" }}
            >
              25%
            </div>
            <p className="mt-3 text-white/60 text-[14px] leading-relaxed max-w-xs">
              del rimborso ottenuto — e solo in caso di successo.
              <br />
              Nessun costo fisso, nessuna sorpresa.
            </p>
            <div className="mt-6 w-full h-px bg-white/10" />
            <div className="mt-6 flex flex-col gap-2.5 w-full text-left">
              {[
                "Nessun pagamento anticipato",
                "Nessun costo se non vinciamo",
                "Percentuale fissa e trasparente",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <Bullet />
                  <span className="text-[13.5px] text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXAMPLES ─────────────────────────────────────────────────────── */}
      <section className="border-b border-white/5" style={{ background: "rgba(0,0,0,0.15)" }}>
        <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFC300] mb-3 text-center">
            Esempi concreti
          </p>
          <h2 className="text-[26px] lg:text-[32px] font-extrabold text-white text-center mb-8 tracking-tight">
            Quanto ricevi in pratica?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXAMPLES.map(({ scenario, compensation, fee, youGet }) => (
              <div
                key={scenario}
                className="rounded-2xl border border-white/[0.07] overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="px-5 py-4 border-b border-white/[0.06]">
                  <p className="text-[13px] text-white/55 leading-snug">{scenario}</p>
                </div>
                <div className="px-5 py-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">Rimborso CE261</span>
                    <span className="text-[15px] font-bold text-white">€ {compensation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">Onorario (25%)</span>
                    <span className="text-[15px] font-semibold text-white/50">− € {fee}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-[#FFC300] uppercase tracking-wider">A te</span>
                    <span
                      className="text-[22px] font-extrabold text-[#FFC300]"
                      style={{ textShadow: "0 0 24px rgba(255,195,0,0.3)" }}
                    >
                      € {youGet}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[13px] text-white/35">
            Gli importi dipendono dalla distanza del volo secondo il Regolamento CE 261/2004.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-5 py-14 lg:px-8 lg:py-20 text-center">
        <h2 className="text-[26px] lg:text-[34px] font-extrabold text-white tracking-tight mb-3">
          Hai avuto un problema con un volo?
        </h2>
        <p className="text-white/60 text-[15px] mb-8 max-w-md mx-auto leading-relaxed">
          Compila la richiesta in 2 minuti. Un avvocato ti risponde entro 24 ore — senza impegno.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/richiesta"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] bg-gradient-to-br from-[#FFD54F] to-[#FFC300] text-[#7A4A12] shadow-[0_8px_24px_-8px_rgba(255,195,0,0.5)] hover:-translate-y-px transition-all"
          >
            Richiedi gratuitamente <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] border border-white/15 text-white/80 hover:border-[#FFC300]/40 hover:text-white transition-all"
          >
            Leggi le FAQ
          </Link>
        </div>
      </section>
    </main>
  )
}
