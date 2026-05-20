import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'

import { ClientPlausibleProvider } from '@/components/plausible-provider'
import { AppFooter } from '@/components/app-footer'
import { seoConfig } from '../seo.config'
import { getDictionary, hasLocale, locales } from '@/lib/dictionaries'
import { makeLanguageAlternates } from '@/lib/metadata'
import Header from './header'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return locales.filter((l) => l !== 'en').map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    metadataBase: new URL(seoConfig.canonical),
    title: {
      template: seoConfig.titleTemplate,
      default: seoConfig.title,
    },
    description: seoConfig.description,
    alternates: {
      canonical: `/${lang}`,
      languages: makeLanguageAlternates('/'),
    },
    openGraph: {
      ...seoConfig.openGraph,
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: seoConfig.twitter,
    manifest: '/manifest.webmanifest',
  }
}

export const viewport: Viewport = {
  maximumScale: 1,
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  if (!hasLocale(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang)

  return (
    <html lang={lang}>
      <ClientPlausibleProvider />

      <body className={`min-h-[100dvh] bg-white dark:bg-gray-950 text-black dark:text-white ${fontSans.className} antialiased`}>
        <Header lang={lang} dict={dict.nav} />

        {children}

        <AppFooter lang={lang} dict={dict.footer} />
      </body>
    </html>
  )
}
