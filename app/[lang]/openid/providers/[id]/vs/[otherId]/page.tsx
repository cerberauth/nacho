import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProviderVsPairs } from '@/lib/providers'
import { hasLocale, locales, type Locale } from '@/lib/dictionaries'
import { generateOpenIDProviderVsMetadata, OpenIDProviderVsPage } from '@/components/pages/openid-providers-vs'

type Props = { params: Promise<{ lang: string; id: string; otherId: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return locales
    .filter((l) => l !== 'en')
    .flatMap((lang) =>
      getProviderVsPairs().map((pair) => ({ lang, id: pair.a.identifier, otherId: pair.b.identifier }))
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id, otherId } = await params
  if (!hasLocale(lang)) return {}
  return generateOpenIDProviderVsMetadata(lang as Locale, id, otherId)
}

export default async function Page({ params }: Props) {
  const { lang, id, otherId } = await params
  if (!hasLocale(lang)) notFound()
  return <OpenIDProviderVsPage lang={lang as Locale} aId={id} bId={otherId} />
}
