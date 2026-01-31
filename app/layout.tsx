import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

import { ClientPlausibleProvider } from '@/components/plausible-provider'
import { seoConfig } from './seo.config'
import Header from './header'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.canonical),
  title: {
    template: seoConfig.titleTemplate,
    default: seoConfig.title,
  },
  description: seoConfig.description,
  alternates: {
    canonical: './',
  },
  openGraph: seoConfig.openGraph,
  twitter: seoConfig.twitter,
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-[100dvh] bg-white dark:bg-gray-950 text-black dark:text-white ${fontSans.className} antialiased`}>
        <ClientPlausibleProvider
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
              <Link className="text-primary" href="/clients">Clients</Link> - <Link className="text-primary" href="/templates">Templates</Link> - <Link className="text-primary" href="/use-cases">Use Cases</Link> - <Link className="text-primary" href="/openid/providers">OpenID Connect Providers Benchmark</Link>
            </p>
            <p className="text-sm">
              <Link className="text-gray-500 hover:text-gray-600" href="https://www.cerberauth.com/tos?utm_source=nacho" rel="nofollow" target="_blank">Terms of Service</Link> - <Link className="text-gray-500 hover:text-gray-600" href="https://www.cerberauth.com/privacy?utm_source=nacho" rel="nofollow" target="_blank">Privacy Policy</Link> - <Link className="text-gray-500 hover:text-gray-600" href="https://github.com/cerberauth/nacho" rel="nofollow noopener noreferrer" target="_blank">Github</Link>
            </p>
            <p className="text-sm text-gray-500">Proudly part of <Link className="text-primary"
              href="https://www.cerberauth.com/?utm_source=nacho">CerberAuth</Link> community.</p>
          </footer>
        </ClientPlausibleProvider>
      </body>
    </html>
  )
}
