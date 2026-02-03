'use client'

import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function ChiSiamoPage() {
  const { t } = useLanguage()
  
  const bullets = [
    t('ourStoryBullet1'),
    t('ourStoryBullet2'),
    t('ourStoryBullet3'),
    t('ourStoryBullet4'),
  ]
  
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">{t('whoWeArePageTitle')}</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          {t('whoWeArePageSubtitle')}
        </p>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-14 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold text-[#FFC300]">{t('ourStory')}</h2>
          <div className="mt-4 space-y-4 text-white/85">
            <p>{t('ourStoryP1')}</p>
            <p>{t('ourStoryP2')}</p>
            <p>{t('ourStoryP3')}</p>
            <ul className="mt-4 space-y-2">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-4 w-4 text-[#FFC300]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="rounded-xl bg-white/10 p-6">
          <h3 className="text-2xl font-extrabold text-[#FFC300]">{t('ourMission')}</h3>
          <p className="mt-3 text-white/85">
            {t('ourMissionText')}
          </p>
        </aside>
      </section>

      <section className="bg-white/5">
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-3xl font-extrabold text-[#FFC300]">{t('ourValues')}</h3>
          <p className="mt-2 text-white/85">{t('ourValuesSubtitle')}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                t: t('valueTransparency'),
                d: t('valueTransparencyDesc'),
              },
              {
                t: t('valueProfessionalism'),
                d: t('valueProfessionalismDesc'),
              },
              {
                t: t('valueAccessibility'),
                d: t('valueAccessibilityDesc'),
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl bg-white/10 p-6 text-left">
                <h4 className="text-xl font-bold text-[#FFC300]">{c.t}</h4>
                <p className="mt-2 text-white/85">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h4 className="text-3xl font-extrabold text-[#FFC300]">{t('hadDisruption')}</h4>
            <p className="mt-2 text-white/85">
              {t('hadDisruptionText')}
            </p>
            <a
              href="/#contact-form"
              className="mt-6 inline-block rounded-md bg-[#FF8A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8a00]/90"
            >
              {t('requestAssistance')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
