'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { isTranslatedPath } from '@/lib/i18n-paths'
import { getTranslation, type Language, type TranslationKey } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getCookieLang(): Language | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)giustiziainvolo-lang=([^;]+)/)
  const val = match?.[1]
  return val === 'it' || val === 'en' ? val : null
}

function setCookieLang(lang: Language) {
  document.cookie = `giustiziainvolo-lang=${lang}; path=/; max-age=31536000; SameSite=Lax`
}

export function LanguageProvider({
  children,
  initialLanguage = 'it',
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  // initialLanguage arriva dal cookie letto dal layout: evita il flash IT→EN al caricamento
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  useEffect(() => {
    // 1. URL parameter ha priorità massima (es. QR code con ?lang=en)
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    if (urlLang === 'en' || urlLang === 'it') {
      setLanguageState(urlLang)
      setCookieLang(urlLang)
      localStorage.setItem('giustiziainvolo-lang', urlLang)
      return
    }

    // 2. Cookie (già letto dal server per il lang attribute, qui aggiorna lo stato client)
    const cookieLang = getCookieLang()
    if (cookieLang) {
      setLanguageState(cookieLang)
      return
    }

    // 3. Fallback: localStorage (migrazione da vecchie sessioni senza cookie)
    const stored = localStorage.getItem('giustiziainvolo-lang') as Language | null
    if (stored === 'it' || stored === 'en') {
      setLanguageState(stored)
      setCookieLang(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setCookieLang(lang)
    localStorage.setItem('giustiziainvolo-lang', lang)
  }

  // Sulle pagine solo in italiano anche header/footer restano in italiano
  const pathname = usePathname()
  const effective: Language = isTranslatedPath(pathname) ? language : 'it'

  const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
    return getTranslation(effective, key, vars)
  }

  return (
    <LanguageContext.Provider value={{ language: effective, setLanguage, t }}>
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
