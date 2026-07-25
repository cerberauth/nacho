import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { FeatureStatus } from '@/lib/types'
import { getFeaturesCategories } from '@/data/iam/index'
import { getIAMProviderById, getIAMProviders, getIAMProviderVsOrder } from '@/lib/iam-providers'
import { getProviderVsOrder } from '@/lib/providers'
import { providers as openIDProviders } from '@/data/openid/providers'
import { BenchmarkTable } from '@/components/benchmark-table'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { getCountryFlag } from '@/lib/utils'
import { getTableCells } from '@/app/iam/providers/get-table-cells'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'

export async function generateIAMProviderVsMetadata(lang: Locale, aId: string, bId: string): Promise<Metadata> {
  const order = getIAMProviderVsOrder(aId, bId)
  if (!order) {
    return {}
  }

  const [id1, id2] = order
  const providerA = getIAMProviderById(id1)
  const providerB = getIAMProviderById(id2)
  if (!providerA || !providerB) {
    return {}
  }

  const dict = await getDictionary(lang)
  const t = dict.iamProvidersVs
  const path = `/iam/providers/${id1}/vs/${id2}`
  return {
    title: t.metaTitle.replace('{nameA}', providerA.name).replace('{nameB}', providerB.name),
    description: t.description.replace(/{nameA}/g, providerA.name).replace(/{nameB}/g, providerB.name),
    alternates: {
      canonical: makeCanonical(lang, path),
      languages: makeLanguageAlternates(path),
    },
    openGraph: {
      images: [{ url: providerA.icon.contentUrl }],
    },
  }
}

export async function IAMProviderVsPage({ lang, aId, bId }: { lang: Locale; aId: string; bId: string }) {
  if (aId !== bId) {
    const order = getIAMProviderVsOrder(aId, bId)
    if (!order || order[0] !== aId || order[1] !== bId) {
      return notFound()
    }
  } else {
    return notFound()
  }

  const providerA = getIAMProviderById(aId)
  const providerB = getIAMProviderById(bId)
  if (!providerA || !providerB) {
    return notFound()
  }

  const dict = await getDictionary(lang)
  const t = dict.iamProvidersVs
  const tIam = dict.iamProviders
  const categoriesData = getFeaturesCategories(tIam)
  const categories = getTableCells(categoriesData, [providerA.identifier, providerB.identifier])
  const total = categoriesData.reduce((acc, c) => acc + c.features.length, 0)
  const countSupported = (p: typeof providerA) =>
    p.featureList.filter((f) => f.status === FeatureStatus.Supported).length
  const countA = countSupported(providerA)
  const countB = countSupported(providerB)

  const openIDProviderA = openIDProviders.find((p) => p.identifier === providerA.identifier)
  const openIDProviderB = openIDProviders.find((p) => p.identifier === providerB.identifier)
  const openIDVsOrder = openIDProviderA && openIDProviderB
    ? getProviderVsOrder(openIDProviderA.identifier, openIDProviderB.identifier)
    : null

  const otherProviders = getIAMProviders().filter(
    (p) => p.identifier !== providerA.identifier && p.identifier !== providerB.identifier
  )

  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col gap-2 max-w-full">
        <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2 text-center">
          {providerA.name} <span className="text-slate-400">vs</span> {providerB.name}
        </h1>
        <p className="text-md text-slate-600 text-center">
          {t.description.replace(/{nameA}/g, providerA.name).replace(/{nameB}/g, providerB.name)}
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-full mt-4 w-full">
        <div className="flex gap-1">
          <div className="sticky left-0 z-10 shrink-0 w-[280px] min-w-[280px]" />
          {[providerA, providerB].map((provider) => (
            <div key={provider.identifier} className="min-w-[124px] w-full flex flex-col items-center gap-1 px-2">
              {provider.icon?.contentUrl && (
                <Image
                  className="w-12 h-12 object-contain"
                  src={provider.icon.contentUrl}
                  height={48}
                  width={48}
                  alt={provider.name}
                />
              )}
              <Link
                href={langUrl(lang, `/iam/providers/${provider.identifier}`)}
                className="text-sm font-semibold text-slate-900 hover:underline text-center"
              >
                {provider.name}
              </Link>
              {provider.nationality && (
                <span title={provider.nationality} className="text-lg grayscale-[0.5] hover:grayscale-0 transition-all cursor-help">
                  {getCountryFlag(provider.nationality)}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-600 text-center">
          {t.verdict
            .replace('{nameA}', providerA.name)
            .replace('{countA}', String(countA))
            .replace('{nameB}', providerB.name)
            .replace('{countB}', String(countB))
            .replace('{total}', String(total))}
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-4 w-full">
        <h2 className="text-3xl text-center font-semibold leading-none tracking-tight mb-2">{t.featuresTitle}</h2>

        <BenchmarkTable categories={categories} />

        <p className="text-sm text-slate-600">
          {t.compareNote}{' '}
          <Link href={langUrl(lang, '/iam/providers')} className="text-primary hover:underline">{t.browseAll}</Link>.
        </p>

        {openIDVsOrder && (
          <p className="text-sm text-slate-600">
            {t.lookingForOpenID}{' '}
            <Link
              href={langUrl(lang, `/openid/providers/${openIDVsOrder[0]}/vs/${openIDVsOrder[1]}`)}
              className="text-primary hover:underline"
            >
              {t.viewOnOpenID.replace('{nameA}', providerA.name).replace('{nameB}', providerB.name)}
            </Link>.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8 w-full">
        {[providerA, providerB].map((provider) => (
          <div key={`more-${provider.identifier}`} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              {t.moreComparisons.replace('{name}', provider.name)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherProviders.map((p) => {
                const order = getIAMProviderVsOrder(provider.identifier, p.identifier)
                if (!order) {
                  return null
                }

                return (
                  <Link
                    key={`vs-${provider.identifier}-${p.identifier}`}
                    href={langUrl(lang, `/iam/providers/${order[0]}/vs/${order[1]}`)}
                    className="text-sm text-primary hover:underline bg-slate-50 border border-slate-200 rounded-full px-3 py-1"
                  >
                    {provider.name} vs {p.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <ProviderInaccuracyWarning dict={dict.inaccuracyWarning} />
      </div>
    </main>
  )
}
