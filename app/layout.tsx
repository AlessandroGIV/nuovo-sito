import React from "react"
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LanguageProvider } from '@/contexts/language-context'

export const metadata: Metadata = {
  title: 'Giustizia In Volo - Risarcimento per ritardi e cancellazioni voli',
  description: 'Servizio legale specializzato nell\'ottenere risarcimenti fino a 600€ per ritardi, cancellazioni e negato imbarco. Assistenza da veri avvocati, nessun anticipo richiesto.',
  icons: {
    icon: '/favicon.ico',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
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
