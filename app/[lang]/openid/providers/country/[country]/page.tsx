import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, locales, type Locale } from '@/lib/dictionaries'
import { countries } from '@/lib/countries'
import { getProvidersByNationalities } from '@/lib/providers'
import {
  generateOpenIDProvidersCountryMetadata,
  OpenIDProvidersCountryPage,
} from '@/components/pages/openid-providers-country'

type Props = { params: Promise<{ lang: string; country: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return locales
    .filter((l) => l !== 'en')
    .flatMap((lang) =>
      countries
        .filter((c) => getProvidersByNationalities(c.nationalities).length > 0)
        .map((c) => ({ lang, country: c.slug }))
    )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country } = await params
  if (!hasLocale(lang)) return {}
  return generateOpenIDProvidersCountryMetadata(lang as Locale, country)
}

export default async function Page({ params }: Props) {
  const { lang, country } = await params
  if (!hasLocale(lang)) notFound()
  return <OpenIDProvidersCountryPage lang={lang as Locale} country={country} />
}
