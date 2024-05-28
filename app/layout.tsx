import type { Metadata } from 'next'
import Head from 'next/head'
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

        <PlausibleProvider
          domain="nacho.cerberauth.com"
          customDomain="https://a.cerberauth.com"
          selfHosted={true}
          trackOutboundLinks={true}
          taggedEvents={true}
        />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <body className={inter.className}>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          {children}
        </div>
      </body>
    </html>
  )
}
