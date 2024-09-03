import type { Metadata } from 'next'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import PlausibleProvider from 'next-plausible'
import { DefaultSeo, SoftwareAppJsonLd } from 'next-seo'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

import { cn } from '@/lib/utils'

import { seoConfig } from './seo.config'
import Header from './header'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.canonical!),
  title: {
    template: seoConfig.titleTemplate!,
    default: seoConfig.title!,
  },
  description: seoConfig.description,
  alternates: {
    canonical: './',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <DefaultSeo {...seoConfig} />
        <SoftwareAppJsonLd
          name={seoConfig.title as string}
          description={seoConfig.description}
          price='0'
          priceCurrency='USD'
          applicationCategory='WebApplication'
          keywords='OAuth, OpenID Connect, Client, Helper'
          operatingSystem='All'
        />

        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <SessionProvider>
          <PlausibleProvider
            domain="nacho.cerberauth.com"
            customDomain="https://a.cerberauth.com"
            selfHosted={true}
            trackOutboundLinks={true}
            taggedEvents={true}
          >
            <Header />

            {children}

            <footer className="text-center p-8 space-y-4">
              <p className="text-gray-500 text-sm">
                <Link className="text-primary" href="/clients">Clients</Link> - <Link className="text-primary" href="/templates">Templates</Link> - <Link className="text-primary" href="/openid/providers">OpenID Connect Providers Benchmark</Link>
              </p>
              <p className="text-sm text-gray-500">Proudly part of <Link className="text-primary"
                href="https://www.cerberauth.com?utm_source=nacho">CerberAuth</Link> community.</p>
            </footer>
          </PlausibleProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
