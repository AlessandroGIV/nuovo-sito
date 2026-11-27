'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { isTranslatedPath } from '@/lib/i18n-paths'

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  if (!isTranslatedPath(pathname)) return null

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it')
    // Le pagine server leggono la lingua dal cookie: serve un refresh per ri-renderizzarle
    startTransition(() => router.refresh())
  }

  if (mobile) {
    return (
      <button
        onClick={toggleLanguage}
        disabled={pending}
        className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-white/75 hover:text-[#FFC300] hover:bg-white/[0.06] transition-all disabled:opacity-60"
      >
        <Languages className="h-5 w-5" />
        <span>{language === 'it' ? 'English' : 'Italiano'}</span>
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      disabled={pending}
      aria-label={language === 'it' ? 'Switch to English' : "Passa all'italiano"}
      className="flex items-center gap-2 text-white hover:bg-white/10"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">{language === 'it' ? 'EN' : 'IT'}</span>
    </Button>
  )
}
