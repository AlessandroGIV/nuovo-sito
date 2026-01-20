'use client'

import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it')
  }

  if (mobile) {
    return (
      <button
        onClick={toggleLanguage}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
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
      className="flex items-center gap-2 text-white hover:bg-white/10"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">{language === 'it' ? 'EN' : 'IT'}</span>
    </Button>
  )
}
