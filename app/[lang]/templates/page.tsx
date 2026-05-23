import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, type Locale } from '@/lib/dictionaries'
import { generateTemplatesMetadata, TemplatesPage } from '@/components/pages/templates'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return generateTemplatesMetadata(lang as Locale)
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <TemplatesPage lang={lang as Locale} />
}
