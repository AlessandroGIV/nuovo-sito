'use client'

import { useLanguage } from '@/contexts/language-context'

export default function CompensoPage() {
  const { t } = useLanguage()
  
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">{t('compensationPageTitle')}</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          {t('compensationPageSubtitle')}
        </p>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold text-[#FFC300]">{t('noAdvanceRequired')}</h2>
          <div className="mt-4 space-y-4 text-white/85">
            <p>{t('noAdvanceP1')}</p>
            <p>{t('noAdvanceP2')}</p>
            <ul className="mt-4 space-y-2">
              <li>€ {t('noAdvanceBullet1')}</li>
              <li>% {t('noAdvanceBullet2')}</li>
              <li>📝 {t('noAdvanceBullet3')}</li>
            </ul>
          </div>
        </div>

        <aside className="rounded-xl bg-white/10 p-6">
          <h3 className="text-2xl font-extrabold text-[#FFC300]">{t('ourFee')}</h3>
          <ol className="mt-4 space-y-4 text-white/85">
            <li>{t('ourFeeItem1')}</li>
            <li>{t('ourFeeItem2')}</li>
            <li>{t('ourFeeItem3')}</li>
          </ol>
          <div className="mt-4 rounded-md border border-yellow-400/40 bg-yellow-500/10 p-3 text-white/90">
            {t('ourFeeNote')}
          </div>
        </aside>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h3 className="text-center text-3xl font-extrabold text-[#FFC300]">{t('concreteExamples')}</h3>
        <p className="mt-2 text-center text-white/85">
          {t('concreteExamplesSubtitle')}
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-lg text-left">
            <thead className="bg-[#243947] text-[#FFC300]">
              <tr>
                <th className="px-4 py-3 font-bold">{t('tableScenario')}</th>
                <th className="px-4 py-3 font-bold">{t('tableCompensation')}</th>
                <th className="px-4 py-3 font-bold">{t('tableFeeTaken')}</th>
                <th className="px-4 py-3 font-bold">{t('tableYouReceive')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              <tr>
                <td className="px-4 py-3">{t('exampleScenario1')}</td>
                <td className="px-4 py-3">250 €</td>
                <td className="px-4 py-3">50 € (20%)</td>
                <td className="px-4 py-3 font-bold text-[#FFC300]">200 €</td>
              </tr>
              <tr>
                <td className="px-4 py-3">{t('exampleScenario2')}</td>
                <td className="px-4 py-3">400 €</td>
                <td className="px-4 py-3">80 € (20%)</td>
                <td className="px-4 py-3 font-bold text-[#FFC300]">320 €</td>
              </tr>
              <tr>
                <td className="px-4 py-3">{t('exampleScenario3')}</td>
                <td className="px-4 py-3">600 €</td>
                <td className="px-4 py-3">150 € (25%)</td>
                <td className="px-4 py-3 font-bold text-[#FFC300]">450 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="rounded-xl bg-white/10 p-6">
          <h3 className="text-2xl font-extrabold text-[#FFC300]">{t('whyThisModel')}</h3>
          <p className="mt-3 text-white/85">
            {t('whyThisModelText')}
          </p>
        </div>

        <div className="mt-10 text-center">
          <h4 className="text-3xl font-extrabold text-[#FFC300]">{t('transparencyAndClarity')}</h4>
          <p className="mt-2 text-white/85">
            {t('transparencyAndClarityText')}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact-form"
              className="rounded-md bg-[#FF8A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8a00]/90"
            >
              {t('requestFreeClaim')}
            </a>
            <a
              href="/faq"
              className="rounded-md bg-[#FFC300] px-6 py-3 font-semibold text-[#072534] hover:bg-[#FFB800]"
            >
              {t('readFAQ')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
