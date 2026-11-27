import HomeStartForm from "@/components/home-start-form"
import { getAllPosts, type PostFrontmatter } from "@/lib/posts"
import Link from "next/link"
import { getServerLanguage } from "@/lib/server-lang"
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

// ── testi IT / EN ────────────────────────────────────────────────────────────

const COPY = {
  it: {
    heroA: "Volo in ritardo o cancellato?",
    heroB: "Potresti avere diritto fino a",
    badges: ["Avvocati veri", "Nessun anticipo", "Assistenza personale"],
    taglineA: "Non lasciare il tuo rimborso",
    taglineB: "a terra",
    trustTitle: "Uno studio legale vero.",
    kpis: [
      { kpi: "600 €", cap: "compenso massimo CE 261" },
      { kpi: "0 €", cap: "anticipo richiesto" },
    ],
    testimonial:
      "«La compagnia mi aveva lasciato in aeroporto senza assistenza. Loro hanno preso la pratica in mano e in 4 mesi ho avuto 400 €.»",
    testimonialBy: "— Francesco R. · TFS → FCO · marzo 2025",
    howKicker: "come funziona",
    howMeta: "3 step · 2 minuti",
    howTitleA: "Dalla domanda al bonifico,",
    howTitleB: "tre passi soltanto.",
    steps: [
      {
        title: "Raccontaci il tuo volo",
        body: "Tratta, data, compagnia. 2 minuti, niente documenti da caricare. Funziona anche dal telefono in aeroporto.",
      },
      {
        title: "Verifichiamo il diritto",
        body: "Un avvocato GIV analizza il caso secondo il regolamento CE 261/2004. Ti diciamo subito se procediamo — gratis.",
      },
      {
        title: "Incassi il rimborso",
        body: "Trattiamo con la compagnia, fino al giudice se serve. Paghi solo quando arriva il bonifico. 25% IVA inclusa.",
      },
    ],
    blogKicker: "★ casi reali · dal blog",
    blogTitleA: "Quello che leggi qui,",
    blogTitleB: "l'abbiamo già vinto.",
    blogAll: "Leggi tutti gli articoli",
    categories: {
      guide: "Guide pratiche",
      compagnie: "Compagnie aeree",
      legale: "Normativa CE 261",
      casi: "Casi reali",
      scioperi: "Scioperi",
      news: "News",
    } as Record<string, string>,
    estKicker: "stima rapida · esempio reale",
    estBody: "Tratta extra-UE oltre 3.500 km, ritardo >3 ore. Per una famiglia di 4 = 2.400 €.",
    estList: [
      "Cancellazione comunicata < 14 gg",
      "Ritardo arrivo oltre 3 ore",
      "Negato imbarco / overbooking",
      "Coincidenza persa per ritardo",
    ],
    estCta: "Verifica il tuo caso",
    estNote: "2 min · senza impegno",
    faqKicker: "domande frequenti",
    faqTitleA: "Le domande",
    faqTitleB: "che ci fanno tutti.",
    faqs: [
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
        a: "Dipende da quanto tempo è passato. Il regolamento non fissa un termine e i giudici italiani applicano termini brevi, di un anno o di sei mesi dall'arrivo a seconda dell'orientamento. Scrivici e verifichiamo se il tuo caso è ancora azionabile.",
      },
    ],
  },
  en: {
    heroA: "Flight delayed or cancelled?",
    heroB: "You could be entitled to up to",
    badges: ["Real lawyers", "No upfront fees", "Personal assistance"],
    taglineA: "Don't leave your compensation",
    taglineB: "grounded",
    trustTitle: "A real law firm.",
    kpis: [
      { kpi: "€600", cap: "maximum EC 261 compensation" },
      { kpi: "€0", cap: "upfront payment" },
    ],
    testimonial:
      "“The airline left me at the airport with no assistance. They took over my claim and within 4 months I received €400.”",
    testimonialBy: "— Francesco R. · TFS → FCO · March 2025",
    howKicker: "how it works",
    howMeta: "3 steps · 2 minutes",
    howTitleA: "From claim to payout,",
    howTitleB: "just three steps.",
    steps: [
      {
        title: "Tell us about your flight",
        body: "Route, date, airline. 2 minutes, no documents to upload. Works from your phone at the airport too.",
      },
      {
        title: "We check your rights",
        body: "A GIV lawyer reviews your case under Regulation (EC) 261/2004. We tell you right away whether we'll proceed — free of charge.",
      },
      {
        title: "You get paid",
        body: "We deal with the airline, and go to court if needed. You only pay when the money arrives. 25% VAT included.",
      },
    ],
    blogKicker: "★ real cases · from the blog",
    blogTitleA: "What you read here,",
    blogTitleB: "we've already won.",
    blogAll: "Read all articles (in Italian)",
    categories: {
      guide: "Practical guides",
      compagnie: "Airlines",
      legale: "EC 261 law",
      casi: "Real cases",
      scioperi: "Strikes",
      news: "News",
    } as Record<string, string>,
    estKicker: "quick estimate · real example",
    estBody: "Non-EU route over 3,500 km, arrival delay >3 hours. For a family of 4 = €2,400.",
    estList: [
      "Cancellation notified < 14 days before",
      "Arrival delay over 3 hours",
      "Denied boarding / overbooking",
      "Missed connection due to delay",
    ],
    estCta: "Check your case",
    estNote: "2 min · no obligation",
    faqKicker: "frequently asked questions",
    faqTitleA: "The questions",
    faqTitleB: "everyone asks us.",
    faqs: [
      {
        q: "How much can I really get?",
        a: "From €250 to €600 per passenger, depending on the flight distance and the type of disruption. Every case is assessed individually.",
      },
      {
        q: "How much does your service cost?",
        a: "Nothing upfront. Our fee is 25% (VAT included) of the compensation actually obtained. If we don't win, you don't pay.",
      },
      {
        q: "How long does it take to get paid?",
        a: "On average 4–8 weeks out of court. If we need to go to court, 4–12 months. We keep you updated at every step.",
      },
      {
        q: "Can I claim for flights from years ago?",
        a: "It depends on how much time has passed. The Regulation sets no deadline, and Italian courts apply short time limits, of one year or six months from arrival depending on the line of case law. Write to us and we'll check whether your case can still be pursued.",
      },
    ],
  },
}

const COVER_VARIANTS: Array<"orange" | "deep" | "stripes"> = [
  "orange",
  "deep",
  "stripes",
]

// ── page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const posts = getAllPosts().slice(0, 3)
  const lang = await getServerLanguage()
  const c = COPY[lang]

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
            <span className="text-[#FFC300]">{c.heroA}</span>
            <br />
            <span className="text-white">
              {c.heroB}{" "}
              <span
                className="text-[#FFC300] whitespace-nowrap"
                style={{ borderBottom: "4px solid #FFC300", paddingBottom: 2 }}
              >
                {lang === "en" ? <>€600</> : <>€&nbsp;600</>}
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
            <TrustBadge Icon={Shield} label={c.badges[0]} />
            <TrustBadge Icon={Euro} label={c.badges[1]} />
            <TrustBadge Icon={Users} label={c.badges[2]} />
          </div>

          {/* tagline */}
          <p className="m-0 mt-3 text-white/85 font-medium leading-[1.35] text-[15px] lg:text-[17px]">
            {c.taglineA}{" "}
            <span className="text-[#FFC300] font-bold">{c.taglineB}</span>.
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
            {c.trustTitle}
          </h2>

          {/* KPI cards + testimonial side by side on desktop */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-stretch gap-4">
            {/* 2 KPI cards */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 shrink-0">
              {c.kpis.map((s) => (
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
                {c.testimonial}
              </p>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[rgba(15,42,60,0.55)]">
                {c.testimonialBy}
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
              {c.howKicker}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
              {c.howMeta}
            </span>
          </div>

          <h2
            className="mt-4 font-extrabold tracking-[-0.03em] leading-[1.05] text-[#FFC300]"
            style={{ fontSize: "clamp(30px, 5vw, 56px)" }}
          >
            {c.howTitleA}
            <br />
            <span className="text-white">{c.howTitleB}</span>
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
              { n: "01", Icon: Plane, ...c.steps[0] },
              { n: "02", Icon: Scale, ...c.steps[1] },
              { n: "03", Icon: CheckCircle2, ...c.steps[2] },
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
                {c.blogKicker}
              </span>
              <h2
                className="mt-2 font-extrabold tracking-[-0.03em] leading-[1.08] text-[#072534]"
                style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
              >
                {c.blogTitleA}
                <br />
                {c.blogTitleB}
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
                  categoryLabel={c.categories[post.category] ?? post.category}
                />
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-[#072534]/20 bg-white px-6 py-3 text-[14px] font-semibold text-[#072534] shadow-sm hover:border-[#072534]/40 transition-colors"
            >
              {c.blogAll}
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
                  {c.estKicker}
                </span>
                <div className="mt-3 font-extrabold tracking-[-0.035em] leading-none text-white">
                  <span className="text-[52px]">600 €</span>
                  <span className="ml-1.5 text-[20px] font-semibold text-white/50">
                    / pax
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/72">
                  {c.estBody}
                </p>

                <ul className="mt-4 grid gap-2.5 list-none p-0">
                  {c.estList.map((x) => (
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
                  {c.estCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="mt-2.5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                  {c.estNote}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
              {c.faqKicker}
            </span>
            <h2
              className="mt-2.5 font-extrabold tracking-[-0.03em] leading-[1.06] text-[#FFC300]"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              {c.faqTitleA}
              <br />
              <span className="text-white">{c.faqTitleB}</span>
            </h2>

            <div className="mt-6">
              {c.faqs.map((f, i) => (
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
  categoryLabel,
}: {
  post: PostFrontmatter
  variant: "orange" | "deep" | "stripes"
  categoryLabel: string
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="flex h-full flex-col gap-3 rounded-2xl bg-white p-3.5 shadow-[0_1px_0_rgba(7,37,52,0.04),0_6px_20px_rgba(7,37,52,0.08)] hover:shadow-[0_8px_32px_rgba(7,37,52,0.14)] transition-shadow">
        <CoverStripes variant={variant} className="h-[120px]" />
        <div className="flex items-center gap-2.5 text-[11.5px]">
          <span className="font-mono uppercase tracking-[0.14em] text-[11px] font-medium text-[#B07D00]">
            {categoryLabel}
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
