'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useLanguage } from '@/contexts/language-context'

export default function FAQPage() {
  const { t } = useLanguage()
  
  const faqs = [
    { value: 'q1', title: t('faqQ1Title'), answer: t('faqQ1Answer') },
    { value: 'q2', title: t('faqQ2Title'), answer: t('faqQ2Answer') },
    { value: 'q3', title: t('faqQ3Title'), answer: t('faqQ3Answer') },
    { value: 'q4', title: t('faqQ4Title'), answer: t('faqQ4Answer') },
    { value: 'q5', title: t('faqQ5Title'), answer: t('faqQ5Answer') },
  ]
  
  return (
    <main className="bg-[#072534] text-white">
      <section className="container mx-auto px-4 py-14 text-center">
        <h1 className="text-[#FFC300] text-4xl md:text-5xl font-extrabold">{t('faqPageTitle')}</h1>
        <p className="mt-3 text-white/85 max-w-3xl mx-auto">
          {t('faqPageSubtitle')}
        </p>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value} className="border border-white/10 rounded-lg px-4">
              <AccordionTrigger className="text-left text-[#FFC300]">
                {faq.title}
              </AccordionTrigger>
              <AccordionContent className="text-white/85">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  )
}
