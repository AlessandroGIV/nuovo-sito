"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useConsent } from "@/components/cookie/ConsentProvider";

const content = {
  it: {
    title: "Cookie Policy",
    subtitle: "Informativa sull'uso dei cookie — giustiziainvolo.it",
    intro:
      "La presente informativa descrive le tecnologie utilizzate dal sito giustiziainvolo.it (di seguito, il «Sito») e le modalità con cui l'utente può gestire le proprie preferenze. Costituisce parte integrante della Privacy Policy.",
    controllerTitle: "Titolare del trattamento",
    controllerText:
      "Dott. Alessandro Petrecca, P.IVA 18069201004. Contatto: info@giustiziainvolo.it",
    whatAreTitle: "Cosa sono i cookie",
    whatAreText:
      "I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva. Tecnologie analoghe (pixel, identificatori) svolgono funzioni simili.",
    cat1Title: "1. Cookie necessari",
    cat1Text:
      "Garantiscono il funzionamento del Sito e la memorizzazione delle preferenze. Non richiedono consenso e non possono essere disattivati.",
    cat1Items: [
      "`giv_consent` — memorizza le scelte dell'utente sui cookie. Durata: 6 mesi. Prima parte.",
      "Cookie tecnici di sessione e di sicurezza (Next.js / Vercel).",
    ],
    cat2Title: "2. Cookie di statistica",
    cat2Text:
      "Consentono di analizzare in forma aggregata l'utilizzo del Sito. Attivati solo previo consenso.",
    cat2Items: [
      "Google Analytics 4 (`_ga`, `_ga_*`). Durata fino a 2 anni. Fornitore: Google Ireland Ltd.",
    ],
    cat3Title: "3. Cookie di marketing",
    cat3Text:
      "Consentono di misurare l'efficacia delle campagne pubblicitarie e di mostrare annunci pertinenti. Attivati solo previo consenso.",
    cat3Items: [
      "Google Ads (`_gcl_au` e cookie di conversione). Durata fino a 90 giorni. Fornitore: Google Ireland Ltd.",
      "Meta Pixel (`_fbp`) — previsto in futuro. Durata fino a 90 giorni. Fornitore: Meta Platforms Ireland Ltd.",
    ],
    manageTitle: "Gestione delle preferenze",
    manageText:
      "Puoi modificare o revocare il tuo consenso in qualsiasi momento. Le scelte vengono salvate per 180 giorni; il banner si ripresenterà se la policy viene aggiornata.",
    manageBtn: "Gestisci le tue preferenze",
    transfersTitle: "Trasferimenti e terze parti",
    transfersText:
      "I servizi di Google e Meta possono comportare il trattamento di dati anche al di fuori dell'UE. Per i dettagli consulta:",
    rightsTitle: "Diritti dell'interessato e contatti",
    rightsText:
      "Puoi esercitare i diritti previsti dagli artt. 15-22 GDPR scrivendo a info@giustiziainvolo.it. Per il dettaglio si rinvia alla",
    privacyLink: "Privacy Policy",
    updated: "Ultimo aggiornamento: maggio 2026",
  },
  en: {
    title: "Cookie Policy",
    subtitle: "Cookie usage notice — giustiziainvolo.it",
    intro:
      "This notice describes the technologies used by the giustiziainvolo.it website (the «Site») and how users can manage their preferences. It forms an integral part of the Privacy Policy.",
    controllerTitle: "Data controller",
    controllerText:
      "Dott. Alessandro Petrecca, VAT 18069201004. Contact: info@giustiziainvolo.it",
    whatAreTitle: "What cookies are",
    whatAreText:
      "Cookies are small text files that visited websites send to the user's device, where they are stored and sent back to the same sites on the next visit. Similar technologies (pixels, identifiers) perform comparable functions.",
    cat1Title: "1. Necessary cookies",
    cat1Text:
      "Ensure the Site works and store user preferences. They do not require consent and cannot be disabled.",
    cat1Items: [
      "`giv_consent` — stores the user's cookie choices. Duration: 6 months. First party.",
      "Technical session and security cookies (Next.js / Vercel).",
    ],
    cat2Title: "2. Analytics cookies",
    cat2Text:
      "Allow aggregated analysis of how the Site is used. Activated only with consent.",
    cat2Items: [
      "Google Analytics 4 (`_ga`, `_ga_*`). Duration up to 2 years. Provider: Google Ireland Ltd.",
    ],
    cat3Title: "3. Marketing cookies",
    cat3Text:
      "Allow measuring ad campaign effectiveness and showing relevant ads. Activated only with consent.",
    cat3Items: [
      "Google Ads (`_gcl_au` and conversion cookies). Duration up to 90 days. Provider: Google Ireland Ltd.",
      "Meta Pixel (`_fbp`) — planned. Duration up to 90 days. Provider: Meta Platforms Ireland Ltd.",
    ],
    manageTitle: "Managing preferences",
    manageText:
      "You can change or withdraw your consent at any time. Choices are saved for 180 days; the banner will reappear if the policy is updated.",
    manageBtn: "Manage your preferences",
    transfersTitle: "Transfers and third parties",
    transfersText:
      "Google and Meta services may involve data processing outside the EU. See:",
    rightsTitle: "Data subject rights and contact",
    rightsText:
      "You may exercise your rights under Articles 15-22 GDPR by writing to info@giustiziainvolo.it. See the",
    privacyLink: "Privacy Policy",
    updated: "Last updated: May 2026",
  },
};

export default function CookiePage() {
  const { language } = useLanguage();
  const { openPreferences } = useConsent();
  const c = content[language === "en" ? "en" : "it"];

  return (
    <main className="min-h-screen">
      {/* Navy hero */}
      <div className="bg-[#072534]">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#FFC300]/70">
            Informativa
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-2 text-sm text-white/50">{c.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F6F4EF]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="text-[15px] leading-relaxed text-[#072534]/70">{c.intro}</p>

          <Section title={c.controllerTitle}>
            <p>{c.controllerText}</p>
          </Section>

          <Section title={c.whatAreTitle}>
            <p>{c.whatAreText}</p>
          </Section>

          <Section title={c.cat1Title}>
            <p>{c.cat1Text}</p>
            <CookieList items={c.cat1Items} />
          </Section>

          <Section title={c.cat2Title}>
            <p>{c.cat2Text}</p>
            <CookieList items={c.cat2Items} />
          </Section>

          <Section title={c.cat3Title}>
            <p>{c.cat3Text}</p>
            <CookieList items={c.cat3Items} />
          </Section>

          <Section title={c.manageTitle}>
            <p>{c.manageText}</p>
            <button
              onClick={openPreferences}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#072534] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0E3A52] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F4EF]"
            >
              <Settings2 className="h-4 w-4 text-[#FFC300]" />
              {c.manageBtn}
            </button>
          </Section>

          <Section title={c.transfersTitle}>
            <p>
              {c.transfersText}{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#072534] underline decoration-[#FFC300] underline-offset-2 hover:decoration-2"
              >
                Google
              </a>
              {" · "}
              <a
                href="https://www.facebook.com/privacy/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#072534] underline decoration-[#FFC300] underline-offset-2 hover:decoration-2"
              >
                Meta
              </a>
            </p>
          </Section>

          <Section title={c.rightsTitle}>
            <p>
              {c.rightsText}{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#072534] underline decoration-[#FFC300] underline-offset-2 hover:decoration-2"
              >
                {c.privacyLink}
              </Link>
              .
            </p>
          </Section>

          <p className="mt-14 text-[11px] text-[#072534]/35">{c.updated}</p>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-[#072534]/8 pt-8">
      <h2 className="text-[15px] font-bold text-[#072534]">{title}</h2>
      <div className="mt-2.5 space-y-2 text-[14.5px] leading-relaxed text-[#072534]/65">
        {children}
      </div>
    </section>
  );
}

function CookieList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-[13px] text-[#072534]/60"
        >
          <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-sm bg-[#FFC300] rotate-45" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
