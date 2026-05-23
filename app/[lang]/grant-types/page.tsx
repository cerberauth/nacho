import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, type Locale } from '@/lib/dictionaries'
import { generateGrantTypesMetadata, GrantTypesPage } from '@/components/pages/grant-types'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return generateGrantTypesMetadata(lang as Locale)
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <GrantTypesPage lang={lang as Locale} />
}
