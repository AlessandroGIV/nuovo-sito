import HomeStartForm from "@/components/home-start-form"
import { getAllPosts, type PostFrontmatter } from "@/lib/posts"
import Link from "next/link"
import {
  Shield,
  Euro,
  Users,
  Plane,
  ArrowRight,
  Scale,
  CheckCircle2,
  Clock,
} from "lucide-react"

// ── decorators ───────────────────────────────────────────────────────────────

function FlightPath({ opacity = 0.22, mirror = false }: { opacity?: number; mirror?: boolean }) {
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
        transform: mirror ? "scaleX(-1)" : undefined,
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
      }}
    />
  )
}

function CoverStripes({
  variant = "stripes",
  className = "",
}: {
  variant?: "orange" | "deep" | "stripes"
  className?: string
}) {
  const bg =
    variant === "orange" ? "#0A2C40" : variant === "deep" ? "#072534" : "#0E3A52"
  const backgroundImage =
    variant === "orange"
      ? "linear-gradient(135deg, rgba(255,138,0,0.18) 0 2px, transparent 2px 16px), linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 8px)"
      : variant === "deep"
      ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 18px)"
      : "linear-gradient(135deg, rgba(255,195,0,0.14) 0 2px, transparent 2px 16px), linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 8px)"
  return (
    <div
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ background: bg, backgroundImage }}
    />
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  guide: "Guide pratiche",
  compagnie: "Compagnie aeree",
  legale: "Normativa CE 261",
  casi: "Casi reali",
  scioperi: "Scioperi",
  news: "News",
}

const COVER_VARIANTS: Array<"orange" | "deep" | "stripes"> = [
  "orange",
  "deep",
  "stripes",
]

// ── page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <main className="bg-[#072534]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <FlightPath opacity={0.22} />

        <div className="relative z-10 mx-auto max-w-[1200px] flex flex-col items-center text-center px-5 pt-8 pb-6 lg:px-8 lg:pt-16 lg:pb-14">
          <h1
            className="m-0 font-extrabold leading-[1.02] tracking-[-0.03em] max-w-3xl"
            style={{ fontSize: "clamp(28px, 6vw, 54px)" }}
          >
            <span className="text-[#FFC300]">Volo in ritardo o cancellato?</span>
            <br />
            <span className="text-white">
              Potresti avere diritto fino a{" "}
              <span
                className="text-[#FFC300] whitespace-nowrap"
                style={{ borderBottom: "4px solid #FFC300", paddingBottom: 2 }}
              >
                €&nbsp;600
              </span>
              .
            </span>
          </h1>

          {/* form card — centered, max 560px */}
          <div className="w-full max-w-[560px] mt-6 text-left">
            <HomeStartForm />
          </div>

          {/* badges */}
          <div className="mt-5 flex gap-4 lg:gap-6 flex-wrap justify-center text-white/85 text-[12px] lg:text-[13.5px]">
            <TrustBadge Icon={Shield} label="Avvocati veri" />
            <TrustBadge Icon={Euro} label="Nessun anticipo" />
            <TrustBadge Icon={Users} label="Assistenza personale" />
          </div>

          {/* tagline */}
          <p className="m-0 mt-3 text-white/85 font-medium leading-[1.35] text-[15px] lg:text-[17px]">
            Non lasciare il tuo rimborso{" "}
            <span className="text-[#FFC300] font-bold">a terra</span>.
          </p>
        </div>
      </section>

      {/* ── TRUST BAND ───────────────────────────────────────────────────── */}
      <section className="bg-[#F6F4EF] text-[#0F2A3C]">
        <div className="mx-auto max-w-[1200px] px-5 py-10 lg:px-8 lg:py-16">
          <h2
            className="mt-0 font-extrabold tracking-[-0.03em] leading-[1.08] text-[#072534]"
            style={{ fontSize: 32 }}
          >
            Uno studio legale vero.
          </h2>

          {/* KPI cards + testimonial side by side on desktop */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-stretch gap-4">
            {/* 2 KPI cards */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 shrink-0">
              {[
                { kpi: "600 €", cap: "compenso massimo CE 261" },
                { kpi: "0 €", cap: "anticipo richiesto" },
              ].map((s) => (
                <div
                  key={s.kpi}
                  className="bg-white rounded-2xl px-4 py-4 shadow-[0_1px_0_rgba(7,37,52,0.04),0_6px_20px_rgba(7,37,52,0.06)]"
                >
                  <div className="text-[#072534] font-extrabold text-[28px] lg:text-[36px] tracking-[-0.03em] leading-none">
                    {s.kpi}
                  </div>
                  <div className="mt-2 text-[13px] leading-snug text-[rgba(15,42,60,0.62)]">
                    {s.cap}
                  </div>
                </div>
              ))}
            </div>

            {/* testimonial */}
            <div
              className="rounded-2xl p-4 lg:p-5 lg:flex-1"
              style={{ background: "#FFF8E0", borderLeft: "3px solid #FFC300" }}
            >
              <p className="m-0 italic text-[#072534] text-[14px] leading-relaxed">
                «La compagnia mi aveva lasciato in aeroporto senza assistenza. Loro hanno preso la pratica in mano e in 4 mesi ho avuto 400 €.»
              </p>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[rgba(15,42,60,0.55)]">
                — Francesco R. · TFS → FCO · marzo 2025
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COME FUNZIONA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#072534] text-white">
        <FlightPath opacity={0.10} mirror />
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 py-12 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
              come funziona
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
              3 step · 2 minuti
            </span>
          </div>

          <h2
            className="mt-4 font-extrabold tracking-[-0.03em] leading-[1.05] text-[#FFC300]"
            style={{ fontSize: "clamp(30px, 5vw, 56px)" }}
          >
            Dalla domanda al bonifico,
            <br />
            <span className="text-white">tre passi soltanto.</span>
          </h2>

          <div className="relative mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* dashed connector (desktop) */}
            <div
              aria-hidden
              className="absolute hidden lg:block"
              style={{
                top: 38,
                left: "16.66%",
                right: "16.66%",
                borderTop: "1.5px dashed rgba(255,195,0,0.35)",
                zIndex: 0,
              }}
            />

            {[
              {
                n: "01",
                Icon: Plane,
                title: "Raccontaci il tuo volo",
                body: "Tratta, data, compagnia. 2 minuti, niente documenti da caricare. Funziona anche dal telefono in aeroporto.",
              },
              {
                n: "02",
                Icon: Scale,
                title: "Verifichiamo il diritto",
                body: "Un avvocato GIV analizza il caso secondo il regolamento CE 261/2004. Ti diciamo subito se procediamo — gratis.",
              },
              {
                n: "03",
                Icon: CheckCircle2,
                title: "Incassi il rimborso",
                body: "Trattiamo con la compagnia, fino al giudice se serve. Paghi solo quando arriva il bonifico. 25% IVA inclusa.",
              },
            ].map((s) => (
              <div key={s.n} className="relative z-10">
                <div
                  className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full text-[#FFC300]"
                  style={{
                    background: "rgba(255,195,0,0.15)",
                    border: "1.5px solid rgba(255,195,0,0.35)",
                  }}
                >
                  <s.Icon className="h-8 w-8" />
                  <span
                    className="absolute -right-2 -top-2 rounded-full bg-[#FFC300] px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-[#072534] tracking-[0.04em]"
                  >
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-4 text-[20px] lg:text-[22px] font-bold text-white tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[360px] text-[15px] leading-relaxed text-white/70">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ARTICLES ────────────────────────────────────────────────── */}
      <section className="bg-[#F6F4EF] text-[#0F2A3C]">
        <div className="mx-auto max-w-[1200px] px-5 py-12 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium text-[#B07D00]">
                ★ casi reali · dal blog
              </span>
              <h2
                className="mt-2 font-extrabold tracking-[-0.03em] leading-[1.08] text-[#072534]"
                style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
              >
                Quello che leggi qui,
                <br />
                l&apos;abbiamo già vinto.
              </h2>
            </div>
          </div>

          {posts.length > 0 && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              {posts.map((post, i) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  variant={COVER_VARIANTS[i % COVER_VARIANTS.length]}
                />
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-[#072534]/20 bg-white px-6 py-3 text-[14px] font-semibold text-[#072534] shadow-sm hover:border-[#072534]/40 transition-colors"
            >
              Leggi tutti gli articoli
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STIMA + FAQ ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#072534] text-white">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-12 px-5 py-12 lg:px-8 lg:py-20">
          {/* stima rapida */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="relative overflow-hidden rounded-[20px] p-5 lg:p-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              {/* glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,195,0,0.28), transparent 70%)",
                }}
              />

              <div className="relative">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium text-[#FFC300]">
                  stima rapida · esempio reale
                </span>
                <div className="mt-3 font-extrabold tracking-[-0.035em] leading-none text-white">
                  <span className="text-[52px]">600 €</span>
                  <span className="ml-1.5 text-[20px] font-semibold text-white/50">
                    / pax
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/72">
                  Tratta extra-UE oltre 3.500 km, ritardo {">"}3 ore. Per una famiglia di 4 = 2.400 €.
                </p>

                <ul className="mt-4 grid gap-2.5 list-none p-0">
                  {[
                    "Cancellazione comunicata < 14 gg",
                    "Ritardo arrivo oltre 3 ore",
                    "Negato imbarco / overbooking",
                    "Coincidenza persa per ritardo",
                  ].map((x) => (
                    <li key={x} className="flex items-center gap-3 text-[14.5px] text-white/85">
                      <Bullet />
                      {x}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/richiesta"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFC300] text-[15px] font-bold text-[#072534] hover:bg-[#FFB800] transition-colors"
                >
                  Verifica il tuo caso
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                  2 min · senza impegno
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
              domande frequenti
            </span>
            <h2
              className="mt-2.5 font-extrabold tracking-[-0.03em] leading-[1.06] text-[#FFC300]"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Le domande
              <br />
              <span className="text-white">che ci fanno tutti.</span>
            </h2>

            <div className="mt-6">
              {[
                {
                  q: "Quanto posso ottenere davvero?",
                  a: "Da 250 € a 600 € per passeggero a seconda della distanza della tratta e del tipo di disservizio. Ogni caso è valutato singolarmente.",
                },
                {
                  q: "Quanto costa il vostro intervento?",
                  a: "Zero. Il nostro compenso è il 25% IVA inclusa solo sul rimborso effettivamente ottenuto. Se non vinciamo, non paghi.",
                },
                {
                  q: "In quanto tempo arriva il rimborso?",
                  a: "In media 4–8 settimane in via stragiudiziale. Se serve il giudice, 4–12 mesi. Ti aggiorniamo a ogni passaggio.",
                },
                {
                  q: "Posso reclamare per voli di anni fa?",
                  a: "Sì. Il diritto si prescrive in 3 anni in Italia. Verifichiamo subito se il tuo caso è ancora valido.",
                },
              ].map((f, i) => (
                <details
                  key={i}
                  open={i === 0}
                  className="group"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.10)",
                    borderBottom:
                      i === 3 ? "1px solid rgba(255,255,255,0.10)" : undefined,
                  }}
                >
                  <summary
                    className="flex cursor-pointer list-none items-center gap-3 py-4 text-[16px] lg:text-[18px] font-semibold text-white tracking-[-0.015em]"
                    style={{ listStyleType: "none" }}
                  >
                    <span className="min-w-[28px] font-mono text-[12px] font-semibold text-[#FFC300]">
                      0{i + 1}
                    </span>
                    <span className="flex-1">{f.q}</span>
                    <span className="text-white/50 font-light text-xl leading-none">+</span>
                  </summary>
                  <p className="mb-4 ml-[40px] max-w-[600px] text-[14.5px] leading-[1.7] text-white/72">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── sub-components ────────────────────────────────────────────────────────────

function TrustBadge({
  Icon,
  label,
  compact = false,
}: {
  Icon: React.FC<{ className?: string }>
  label: string
  compact?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Icon className={compact ? "h-3.5 w-3.5 text-[#FFC300]" : "h-[17px] w-[17px] text-[#FFC300]"} />
      {label}
    </span>
  )
}

function BlogCard({
  post,
  variant,
}: {
  post: PostFrontmatter
  variant: "orange" | "deep" | "stripes"
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="flex h-full flex-col gap-3 rounded-2xl bg-white p-3.5 shadow-[0_1px_0_rgba(7,37,52,0.04),0_6px_20px_rgba(7,37,52,0.08)] hover:shadow-[0_8px_32px_rgba(7,37,52,0.14)] transition-shadow">
        <CoverStripes variant={variant} className="h-[120px]" />
        <div className="flex items-center gap-2.5 text-[11.5px]">
          <span className="font-mono uppercase tracking-[0.14em] text-[11px] font-medium text-[#B07D00]">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          <span className="flex items-center gap-1 text-[rgba(15,42,60,0.55)]">
            <Clock className="h-[11px] w-[11px]" /> 6 min
          </span>
        </div>
        <h3 className="m-0 text-[17px] font-extrabold text-[#072534] leading-snug tracking-[-0.015em] group-hover:text-[#0E3A52] transition-colors">
          {post.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 font-mono text-[11px] text-[rgba(15,42,60,0.5)]">
          <span>{String(post.date).slice(0, 10)}</span>
          <span className="ml-auto font-bold text-[#072534]">→</span>
        </div>
      </article>
    </Link>
  )
}
