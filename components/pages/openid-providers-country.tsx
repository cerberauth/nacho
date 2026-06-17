import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getFeaturesCategories } from '@/data/openid/providers'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { ProvidersInteractiveView } from '@/components/providers-interactive-view'
import { getProvidersByNationalities } from '@/lib/providers'
import { getTableCells } from '@/app/openid/providers/get-table-cells'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import { getCountryBySlug } from '@/lib/countries'

export async function generateOpenIDProvidersCountryMetadata(lang: Locale, country: string): Promise<Metadata> {
  const countryConfig = getCountryBySlug(country)
  if (!countryConfig) return {}
  const dict = await getDictionary(lang)
  const t = dict.openidProvidersCountry
  const title = t.title.replace('{country}', countryConfig.label)
  const description = t.description.replace(/{country}/g, countryConfig.label)
  return {
    title,
    description,
    alternates: {
      canonical: makeCanonical(lang, `/openid/providers/country/${country}`),
      languages: makeLanguageAlternates(`/openid/providers/country/${country}`),
    },
  }
}

export async function OpenIDProvidersCountryPage({ lang, country }: { lang: Locale; country: string }) {
  const countryConfig = getCountryBySlug(country)
  if (!countryConfig) notFound()

  const dict = await getDictionary(lang)
  const t = dict.openidProvidersCountry
  const tOpenid = dict.openidProviders

  const providers = getProvidersByNationalities(countryConfig.nationalities)
  const categoriesData = getFeaturesCategories(tOpenid)
  const allCategories = getTableCells(categoriesData, providers.map((p) => p.identifier))

  const title = t.title.replace('{country}', `${countryConfig.flag} ${countryConfig.label}`)
  const description = t.description.replace(/{country}/g, countryConfig.label)

  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col gap-4 max-w-full">
        <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-md text-slate-600">
          {description}
        </p>
        <p className="text-sm text-slate-500">
          {t.lookingForAllProviders}{' '}
          <Link href={langUrl(lang, '/openid/providers')} className="text-primary hover:underline">
            {t.checkAllProviders}
          </Link>
          .
        </p>
        <p className="text-sm text-slate-500">
          {t.lookingForIAM}{' '}
          <Link href={langUrl(lang, `/iam/providers/country/${country}`)} className="text-primary hover:underline">
            {t.checkIAM}
          </Link>
          .
        </p>
        <ProviderInaccuracyWarning dict={dict.inaccuracyWarning} />
      </div>

      {providers.length === 0 ? (
        <p className="text-slate-500">{t.noProviders.replace('{country}', countryConfig.label)}</p>
      ) : (
        <Suspense>
          <ProvidersInteractiveView
            providers={providers}
            allCategories={allCategories}
            featuresCategories={categoriesData}
            providerDetailUrlPrefix={langUrl(lang, '/openid/providers')}
          />
        </Suspense>
      )}
    </main>
  )
}
