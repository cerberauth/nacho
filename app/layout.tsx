import type { Metadata } from 'next'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import PlausibleProvider from 'next-plausible'
import { DefaultSeo, SoftwareAppJsonLd } from 'next-seo'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

import { cn } from '@/lib/utils'

import { seoConfig } from './seo.config'
import Header from './header'

export const metadata: Metadata = {
  title: seoConfig.title,
  description: seoConfig.description,
  metadataBase: new URL(seoConfig.canonical!),
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
          </PlausibleProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
