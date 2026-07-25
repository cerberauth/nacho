import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { FeatureStatus } from '@/lib/types'
import { getFeaturesCategories } from '@/data/openid/providers'
import { getProviderById, getProviders, getProviderVsOrder } from '@/lib/providers'
import { getIAMProviderVsOrder } from '@/lib/iam-providers'
import { providers as iamProviders } from '@/data/iam/index'
import { BenchmarkTable } from '@/components/benchmark-table'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { getCountryFlag } from '@/lib/utils'
import { getTableCells } from '@/app/openid/providers/get-table-cells'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'

export async function generateOpenIDProviderVsMetadata(lang: Locale, aId: string, bId: string): Promise<Metadata> {
  const order = getProviderVsOrder(aId, bId)
  if (!order) {
    return {}
  }

  const [id1, id2] = order
  const providerA = getProviderById(id1)
  const providerB = getProviderById(id2)
  if (!providerA || !providerB) {
    return {}
  }

  const dict = await getDictionary(lang)
  const t = dict.openidProvidersVs
  const path = `/openid/providers/${id1}/vs/${id2}`
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

export async function OpenIDProviderVsPage({ lang, aId, bId }: { lang: Locale; aId: string; bId: string }) {
  if (aId !== bId) {
    const order = getProviderVsOrder(aId, bId)
    if (!order || order[0] !== aId || order[1] !== bId) {
      return notFound()
    }
  } else {
    return notFound()
  }

  const providerA = getProviderById(aId)
  const providerB = getProviderById(bId)
  if (!providerA || !providerB) {
    return notFound()
  }

  const dict = await getDictionary(lang)
  const t = dict.openidProvidersVs
  const tOpenID = dict.openidProviders
  const categoriesData = getFeaturesCategories(tOpenID)
  const categories = getTableCells(categoriesData, [providerA.identifier, providerB.identifier])
  const total = categoriesData.reduce((acc, c) => acc + c.features.length, 0)
  const countSupported = (p: typeof providerA) =>
    p.featureList.filter((f) => f.status === FeatureStatus.Supported).length
  const countA = countSupported(providerA)
  const countB = countSupported(providerB)

  const iamProviderA = iamProviders.find((p) => p.identifier === providerA.identifier)
  const iamProviderB = iamProviders.find((p) => p.identifier === providerB.identifier)
  const iamVsOrder = iamProviderA && iamProviderB
    ? getIAMProviderVsOrder(iamProviderA.identifier, iamProviderB.identifier)
    : null

  const otherProviders = getProviders().filter(
    (p) => p.identifier !== providerA.identifier && p.identifier !== providerB.identifier
  )

  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="w-full max-w-2xl mx-auto bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm p-4">
        {t.focusNote.replace('{nameA}', providerA.name).replace('{nameB}', providerB.name)}{' '}
        {iamVsOrder ? (
          <>
            {t.lookingForIAM}{' '}
            <Link href={langUrl(lang, `/iam/providers/${iamVsOrder[0]}/vs/${iamVsOrder[1]}`)} className="underline font-medium">
              {t.viewOnIAM.replace('{nameA}', providerA.name).replace('{nameB}', providerB.name)}
            </Link>.
          </>
        ) : (
          <>
            {tOpenID.lookingForIAMGeneral}{' '}
            <Link href={langUrl(lang, '/iam/providers')} className="underline font-medium">
              {tOpenID.checkIAM}
            </Link>.
          </>
        )}
      </div>

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
                href={langUrl(lang, `/openid/providers/${provider.identifier}`)}
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
          <Link href={langUrl(lang, '/openid/providers')} className="text-primary hover:underline">{t.browseAll}</Link>.
        </p>

        {iamVsOrder && (
          <p className="text-sm text-slate-600">
            {t.lookingForIAM}{' '}
            <Link
              href={langUrl(lang, `/iam/providers/${iamVsOrder[0]}/vs/${iamVsOrder[1]}`)}
              className="text-primary hover:underline"
            >
              {t.viewOnIAM.replace('{nameA}', providerA.name).replace('{nameB}', providerB.name)}
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
                const order = getProviderVsOrder(provider.identifier, p.identifier)
                if (!order) {
                  return null
                }

                return (
                  <Link
                    key={`vs-${provider.identifier}-${p.identifier}`}
                    href={langUrl(lang, `/openid/providers/${order[0]}/vs/${order[1]}`)}
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
