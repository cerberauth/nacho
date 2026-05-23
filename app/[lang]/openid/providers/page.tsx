import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, type Locale } from '@/lib/dictionaries'
import { generateOpenIDProvidersMetadata, OpenIDProvidersPage } from '@/components/pages/openid-providers'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return generateOpenIDProvidersMetadata(lang as Locale)
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <OpenIDProvidersPage lang={lang as Locale} />
}
