"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Phone, Plane } from "lucide-react"

export function SiteFooter() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const hideCta = pathname === "/richiesta" || pathname === "/chi-siamo" || pathname === "/compenso" // niente CTA in queste pagine

  return (
    <footer className="border-t border-white/10 bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#FFC300]">Pronto a Richiedere il Tuo Risarcimento?</h3>
        <p className="mt-3 text-white/80 max-w-2xl mx-auto">
          Non lasciare che le compagnie aeree ignorino i tuoi diritti. Contattaci oggi stesso per una valutazione
          gratuita del tuo caso.
        </p>
        {!isHome && !hideCta && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact-form"
              className="rounded-md bg-[#FF8A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8a00]/90"
            >
              Richiedi assistenza gratuita
            </Link>
            <Link
              href="/faq"
              className="rounded-md bg-[#FFC300] px-6 py-3 font-semibold text-[#072534] hover:bg-[#FFB800]"
            >
              Leggi le FAQ
            </Link>
          </div>
        )}
      </section>

      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-[#FFC300] font-extrabold">
            <Plane className="h-5 w-5" />
            GiustiziaInVolo
          </div>
          <p className="mt-3 text-white/80">
            Servizio legale italiano che assiste i passeggeri aerei vittime di ritardi o cancellazioni.
          </p>
          <p className="mt-2 text-[#FFC300] font-semibold">Non lasciare il tuo rimborso a terra.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Collegamenti Rapidi</h4>
          <ul className="space-y-2 text-white/80">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/come-funziona">Come Funziona</Link>
            </li>
            <li>
              <Link href="/chi-siamo">Chi Siamo</Link>
            </li>
            <li>
              <Link href="/compenso">Modello di Compenso</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-white">Contattaci</h4>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#FFC300]" />
              <a href="mailto:info@giustiziainvolo.it">info@giustiziainvolo.it</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#FFC300]" />
              <span>Compila il modulo per essere ricontattato</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-white/70 text-sm">
        © 2025 GiustiziaInVolo - Attività legale regolarmente esercitata ·{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        ·{" "}
        <Link href="/termini" className="underline">
          Termini e Condizioni
        </Link>
      </div>
    </footer>
  )
}
