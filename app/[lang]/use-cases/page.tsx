import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, type Locale } from '@/lib/dictionaries'
import { generateUseCasesMetadata, UseCasesPage } from '@/components/pages/use-cases'

type Props = { params: Promise<{ lang: string }> }

export const dynamic = 'force-static'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return generateUseCasesMetadata(lang as Locale)
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <UseCasesPage lang={lang as Locale} />
}
