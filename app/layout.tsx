import type { Metadata } from 'next'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import PlausibleProvider from 'next-plausible'
import { DefaultSeo, SoftwareAppJsonLd } from 'next-seo'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

import { seoConfig } from './seo.config'

export const metadata: Metadata = {
  title: seoConfig.title,
  description: seoConfig.description,
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

      <body className={inter.className}>
        <SessionProvider>
          <PlausibleProvider
            domain="nacho.cerberauth.com"
            customDomain="https://a.cerberauth.com"
            selfHosted={true}
            trackOutboundLinks={true}
            taggedEvents={true}
          >
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              {children}
            </div>
          </PlausibleProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
