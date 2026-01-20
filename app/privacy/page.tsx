'use client'

import { useLanguage } from '@/contexts/language-context'
import { legalTranslations } from '@/lib/legal-translations'

export default function PrivacyPage() {
  const { t, language } = useLanguage()
  const lt = legalTranslations[language]
  
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/5 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFC300]">
            {t('privacyPolicyTitle')}
          </h1>

          <p className="mt-4 text-white/90">{lt.privacyIntro}</p>

          {/* 1 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection1Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection1Content}</p>

          {/* 2 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection2Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection2Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.privacySection2Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 3 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection3Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection3Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.privacySection3Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 4 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection4Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection4Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.privacySection4Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 5 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection5Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection5Content}</p>

          {/* 6 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection6Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection6Content}</p>

          {/* 7 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection7Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection7Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.privacySection7Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 8 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection8Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection8Content}</p>

          {/* 9 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.privacySection9Title}</h2>
          <p className="mt-2 text-white/90">{lt.privacySection9Content}</p>

          <p className="mt-6 text-sm text-white/70">{t('lastUpdated')}: {language === 'it' ? 'Maggio' : 'May'} 2025</p>
        </div>
      </section>
    </main>
  )
}
