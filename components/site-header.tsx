"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"

const nav = [
  { href: "/", label: "Home" },
  { href: "/come-funziona", label: "Come Funziona" },
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/compenso", label: "Compenso" },
  { href: "/faq", label: "FAQ" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
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
            <SheetContent side="right" className="bg-[#072534] text-white border-white/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-[#FFC300]">
                  <Plane className="h-5 w-5" />
                  GiustiziaInVolo
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 grid gap-4">
                {nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className="text-white/90 hover:text-[#FFC300] transition-colors py-2">
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
