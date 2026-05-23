import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import '../globals.css'

import { ClientPlausibleProvider } from '@/components/plausible-provider'
import { AppFooter } from '@/components/app-footer'
import { seoConfig } from '../seo.config'
import { getDictionary } from '@/lib/dictionaries'
import { makeLanguageAlternates } from '@/lib/metadata'
import Header from '../[lang]/header'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(seoConfig.canonical),
    title: {
      template: seoConfig.titleTemplate,
      default: seoConfig.title,
    },
    description: seoConfig.description,
    alternates: {
      canonical: '/',
      languages: makeLanguageAlternates('/'),
    },
    openGraph: {
      ...seoConfig.openGraph,
      locale: 'en_US',
    },
    twitter: seoConfig.twitter,
    manifest: '/manifest.webmanifest',
  }
}

export const viewport: Viewport = {
  maximumScale: 1,
}

export default async function EnLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary('en')

  return (
    <html lang="en">
      <ClientPlausibleProvider />

      <body className={`min-h-[100dvh] bg-white dark:bg-gray-950 text-black dark:text-white ${fontSans.className} antialiased`}>
        <Header lang="en" dict={dict.nav} />

        {children}

        <AppFooter lang="en" dict={dict.footer} />
      </body>
    </html>
  )
}
