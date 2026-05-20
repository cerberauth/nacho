import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getIAMProviders } from '@/lib/iam-providers'
import { hasLocale, locales, type Locale } from '@/lib/dictionaries'
import { generateIAMProviderDetailMetadata, IAMProviderDetailPage } from '@/components/pages/iam-providers-detail'

type Props = { params: Promise<{ lang: string; id: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return locales
    .filter((l) => l !== 'en')
    .flatMap((lang) => getIAMProviders().map((p) => ({ lang, id: p.identifier })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  if (!hasLocale(lang)) return {}
  return generateIAMProviderDetailMetadata(lang as Locale, id)
}

export default async function Page({ params }: Props) {
  const { lang, id } = await params
  if (!hasLocale(lang)) notFound()
  return <IAMProviderDetailPage lang={lang as Locale} id={id} />
}
