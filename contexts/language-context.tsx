'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getTranslation, type Language } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check URL parameter first (for QR codes)
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    
    if (urlLang === 'en' || urlLang === 'it') {
      setLanguageState(urlLang)
      localStorage.setItem('giustiziainvolo-lang', urlLang)
      return
    }
    
    // Otherwise check localStorage
    const stored = localStorage.getItem('giustiziainvolo-lang') as Language | null
    if (stored && (stored === 'it' || stored === 'en')) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (mounted) {
      localStorage.setItem('giustiziainvolo-lang', lang)
    }
  }

  const t = (key: string, vars?: Record<string, string | number>) => {
    return getTranslation(language, key, vars)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
