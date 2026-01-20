'use client'

import { useLanguage } from '@/contexts/language-context'
import { legalTranslations } from '@/lib/legal-translations'

export default function TerminiPage() {
  const { t, language } = useLanguage()
  const lt = legalTranslations[language]
  const lang = language; // Declare the lang variable

  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/5 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFC300]">
            {t('termsAndConditionsTitle')}
          </h1>

          <p className="mt-4 text-white/90">{lt.termsIntro}</p>

          {/* 1 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection1Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection1Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection1Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 2 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection2Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection2Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection2Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-white/90 font-semibold">{lt.termsSection2LimitsTitle}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection2Limits.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 3 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection3Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection3P1}</p>
          <p className="mt-2 text-white/90">{lt.termsSection3P2}</p>

          {/* 4 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection4Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection4Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection4Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 5 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection5Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection5Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection5Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-white/90">{lt.termsSection5Note}</p>

          {/* 6 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection6Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection6Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection6Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-white/90">{lt.termsSection6Note}</p>

          {/* 7 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection7Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection7P1}</p>
          <p className="mt-2 text-white/90">{lt.termsSection7P2}</p>
          <p className="mt-2 text-white/90">{lt.termsSection7P3}</p>

          {/* 8 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection8Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection8P1}</p>
          <p className="mt-2 text-white/90">{lt.termsSection8Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection8Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-white/90">{lt.termsSection8Note}</p>

          {/* 9 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection9Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection9P1}</p>
          <p className="mt-2 text-white/90">{lt.termsSection9Intro}</p>
          <ul className="mt-2 list-disc pl-6 text-white/90 space-y-1">
            {lt.termsSection9Items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-white/90">{lt.termsSection9Note}</p>

          {/* 10 */}
          <h2 className="mt-8 text-2xl font-extrabold text-[#FFC300]">{lt.termsSection10Title}</h2>
          <p className="mt-2 text-white/90">{lt.termsSection10P1}</p>
          <p className="mt-2 text-white/90">{lt.termsSection10P2}</p>

          <p className="mt-6 text-sm text-white/70">{t('lastUpdated')}: {language === 'it' ? 'Maggio' : 'May'} 2025</p>
        </div>
      </section>
    </main>
  )
}
