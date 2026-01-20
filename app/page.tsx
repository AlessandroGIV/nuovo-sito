"use client"

import HomeStartForm from "@/components/home-start-form"
import { Shield, Euro, Users, Plane } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()
  return (
    <main className="bg-[#072534]">
      {/* Rimosso overflow-hidden per non tagliare i dropdown */}
      <section className="relative">
        <div className="container mx-auto grid items-start gap-8 px-4 py-10 md:py-16 lg:py-20 lg:grid-cols-2">
          {/* Testi a sinistra */}
          <div className="max-w-2xl">
            <h1 className="text-[#FFC300] text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="mt-5 text-white text-xl md:text-2xl font-semibold">{t('heroSubtitle')}</p>
            <p className="mt-4 text-white/90 text-lg md:text-xl">
              {t('heroAmount')}
            </p>
            <div className="mt-8 hidden flex-wrap gap-5 text-white/85 md:flex">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#FFC300]" />
                {t('realLawyers')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Euro className="h-5 w-5 text-[#FFC300]" />
                {t('noUpfront')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-5 w-5 text-[#FFC300]" />
                {t('personalAssistance')}
              </span>
            </div>
          </div>

          {/* Form compatto con aeroporti */}
          <div>
            <HomeStartForm />
            <div className="md:hidden mt-4 flex flex-wrap gap-5 text-white/85">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#FFC300]" />
                {t('realLawyers')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Euro className="h-5 w-5 text-[#FFC300]" />
                {t('noUpfront')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-5 w-5 text-[#FFC300]" />
                {t('personalAssistance')}
              </span>
            </div>
          </div>
        </div>

        {/* Decoro aereo laterale */}
        <div className="pointer-events-none absolute -right-10 top-0 hidden h-full w-1/3 opacity-10 lg:block">
          <Plane className="h-full w-full text-white" />
        </div>
      </section>
    </main>
  )
}
