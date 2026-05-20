import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProviders } from '@/lib/providers'
import { hasLocale, locales, type Locale } from '@/lib/dictionaries'
import { generateOpenIDProviderDetailMetadata, OpenIDProviderDetailPage } from '@/components/pages/openid-providers-detail'

type Props = { params: Promise<{ lang: string; id: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return locales
    .filter((l) => l !== 'en')
    .flatMap((lang) => getProviders().map((p) => ({ lang, id: p.identifier })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  if (!hasLocale(lang)) return {}
  return generateOpenIDProviderDetailMetadata(lang as Locale, id)
}

export default async function Page({ params }: Props) {
  const { lang, id } = await params
  if (!hasLocale(lang)) notFound()
  return <OpenIDProviderDetailPage lang={lang as Locale} id={id} />
}
