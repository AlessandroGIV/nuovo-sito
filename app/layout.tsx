import React from "react"
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import Script from 'next/script'
import { cookies } from 'next/headers'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LanguageProvider } from '@/contexts/language-context'
import { ConsentProvider } from '@/components/cookie/ConsentProvider'
import { CookieBanner } from '@/components/cookie/CookieBanner'
import { CookiePreferencesModal } from '@/components/cookie/CookiePreferencesModal'

const GA_ID = 'G-N9B7Q6PYCE'
const AW_ID = 'AW-17322484652'

export const metadata: Metadata = {
  title: 'Rimborso Volo Cancellato o in Ritardo | Fino a €600 – Giustizia In Volo',
  description:
    'Volo cancellato o in ritardo di oltre 3 ore? Hai diritto fino a €600. Nessun anticipo, paghiamo solo se vinciamo. Reg. CE 261/2004.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('giustiziainvolo-lang')
  const lang = langCookie?.value === 'en' ? 'en' : 'it'

  // Read existing consent from cookie server-side so returning visitors
  // get the correct initial Consent Mode state without waiting for JS hydration.
  const rawConsent = cookieStore.get('giv_consent')?.value
  let prevCategories: { analytics?: boolean; marketing?: boolean } | null = null
  if (rawConsent) {
    try {
      prevCategories = JSON.parse(decodeURIComponent(rawConsent)).categories
    } catch {
      // malformed cookie — treat as no consent
    }
  }
  const granted = (ok?: boolean) => (ok ? 'granted' : 'denied')

  return (
    <html lang={lang}>
      <head>
        {/* Consent Mode v2 — must run before gtag.js loads */}
        <Script id="consent-default" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: '${granted(prevCategories?.analytics ?? false)}',
            ad_storage: '${granted(prevCategories?.marketing ?? false)}',
            ad_user_data: '${granted(prevCategories?.marketing ?? false)}',
            ad_personalization: '${granted(prevCategories?.marketing ?? false)}',
            wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
        `}</Script>

        {/* Google Analytics + Google Ads */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          gtag('config', '${AW_ID}');
        `}</Script>

        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <LanguageProvider>
          <ConsentProvider locale={lang}>
            <SiteHeader />
            {children}
            <SiteFooter />
            <CookieBanner />
            <CookiePreferencesModal />
          </ConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
