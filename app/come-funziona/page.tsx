'use client'

import { BadgeCheck } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function ComeFunzionaPage() {
  const { t } = useLanguage()
  
  const steps = [
    {
      n: '1',
      t: t('step1ContactUs'),
      d: t('step1ContactDesc'),
    },
    {
      n: '2',
      t: t('step2FollowYou'),
      d: t('step2FollowDesc'),
    },
    {
      n: '3',
      t: t('step3GetRefund'),
      d: t('step3GetRefundDesc'),
    },
  ]
  
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">{t('howItWorksPageTitle')}</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          {t('howItWorksPageSubtitle')}
        </p>
      </section>

      <section className="bg-white/5">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl bg-white/5 p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC300] text-[#072534] font-bold text-lg">
                {s.n}
              </div>
              <h3 className="text-xl font-bold text-[#FFC300]">{s.t}</h3>
              <p className="mt-2 text-white/85">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
