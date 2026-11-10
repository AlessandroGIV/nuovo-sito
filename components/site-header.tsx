"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const pathname = usePathname()

  // Le aree riservate hanno la loro intestazione
  if (pathname.startsWith("/agenzie/area") || pathname.startsWith("/gestione")) return null

  const nav = [
    { href: "/", label: t('home') },
    { href: "/chi-siamo", label: t('whoWeAre') },
    { href: "/compenso", label: t('compensation') },
    { href: "/faq", label: t('faq') },
    { href: "/blog", label: t('blog') },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#072534]/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-[#FFC300] font-extrabold">
          <Plane className="h-5 w-5" />
          <span className="text-lg">GiustiziaInVolo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-white/90 hover:text-[#FFC300] transition-colors">
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="text-white hover:text-[#FFC300]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Apri menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A1E2E] text-white border-l border-white/[0.08] w-[270px] flex flex-col p-0">
              <SheetHeader className="px-6 pt-7 pb-5 border-b border-white/[0.08] flex-shrink-0">
                <SheetTitle className="flex items-center gap-2 text-[#FFC300] font-extrabold text-[15px]">
                  <Plane className="h-4 w-4" />
                  GiustiziaInVolo
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-0.5 px-3 py-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/chi-siamo", label: "Chi siamo" },
                  { href: "/compenso", label: "Compenso" },
                  { href: "/blog", label: "Blog" },
                ].map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-3 rounded-xl text-[15px] font-medium text-white/75 hover:text-[#FFC300] hover:bg-white/[0.06] transition-all"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
