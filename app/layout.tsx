import type { Metadata, Viewport } from 'next'
import './globals.css'

import { seoConfig } from './seo.config'

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.canonical),
  title: {
    template: seoConfig.titleTemplate,
    default: seoConfig.title,
  },
  description: seoConfig.description,
  alternates: {
    languages: {
      'en': '/en',
      'fr': '/fr',
      'x-default': '/en',
    },
  },
  openGraph: seoConfig.openGraph,
  twitter: seoConfig.twitter,
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
