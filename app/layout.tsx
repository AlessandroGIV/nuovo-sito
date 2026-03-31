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

export const metadata: Metadata = {
  title: 'Giustizia In Volo - Risarcimento per ritardi e cancellazioni voli',
  description: 'Servizio legale specializzato nell\'ottenere risarcimenti fino a 600€ per ritardi, cancellazioni e negato imbarco. Assistenza da veri avvocati, nessun anticipo richiesto.',
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

  return (
    <html lang={lang}>
      <head>
        {/* Google Analytics + Google Ads — singolo caricamento gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N9B7Q6PYCE"
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N9B7Q6PYCE');
            gtag('config', 'AW-17322484652');
          `}
        </Script>
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
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  )
}
