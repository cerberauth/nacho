import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'

import { FeatureStatus } from '@/lib/types'
import { getFeaturesCategories, OpenIDConnectFeatureCategory, type OpenIDConnectFeature, type OpenIDConnectProvider } from '@/data/openid/providers'
import { getProviderById, getProviderFeature, getProviders } from '@/lib/providers'
import { providers as iamProviders } from '@/data/iam/index'
import { BenchmarkTable } from '@/components/benchmark-table'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { getCountryFlag } from '@/lib/utils'
import { getTableCells } from '@/app/openid/providers/get-table-cells'
import { getDictionary, type Locale, type Dictionary } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'

type FAQFeature = {
  feature: OpenIDConnectFeature
  providerFeature: OpenIDConnectProvider['featureList'][0]
}

export async function generateOpenIDProviderDetailMetadata(lang: Locale, id: string): Promise<Metadata> {
  const provider = getProviderById(id)
  if (!provider) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.openidProviders.metaTitle.replace('{name}', provider.name),
    description: provider.abstract,
    alternates: {
      canonical: makeCanonical(lang, `/openid/providers/${id}`),
      languages: makeLanguageAlternates(`/openid/providers/${id}`),
    },
    openGraph: {
      images: [{ url: provider.icon.contentUrl }],
    },
  }
}

export async function OpenIDProviderDetailPage({ lang, id }: { lang: Locale; id: string }) {
  const provider = getProviderById(id)
  if (!provider) return notFound()

  const dict = await getDictionary(lang)
  const t = dict.openidProviders
  const categoriesData = getFeaturesCategories(t)
  const categories = getTableCells(categoriesData, [provider.identifier])
  const iamProvider = iamProviders.find((p) => p.identifier === provider.identifier)
  const faqFeatures = categoriesData.reduce((acc, category) => {
    const features = category.features
      .map((feature) => ({
        feature,
        providerFeature: getProviderFeature(provider.identifier, feature!.identifier),
      }))
      .filter((f) => f.providerFeature && f.providerFeature.status !== FeatureStatus.Unknown) as unknown as FAQFeature[]
    return [...acc, ...features]
  }, [] as FAQFeature[])

  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col max-w-full">
        <div className="flex items-center gap-4">
          {provider.icon?.contentUrl && (
            <Image
              className="w-24 h-24 my-auto"
              src={provider.icon.contentUrl}
              height={64}
              width={64}
              alt={provider.name}
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-semibold leading-none tracking-tight">
                {provider.name} {t.openIDProvider}
              </h1>
              {provider.nationality && (
                <span title={provider.nationality} className="text-4xl grayscale-[0.5] hover:grayscale-0 transition-all cursor-help">
                  {getCountryFlag(provider.nationality)}
                </span>
              )}
            </div>
            <p className="text-md text-slate-600">
              {provider.abstract}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <h2 className="text-3xl text-center font-semibold leading-none tracking-tight mb-2">{t.featuresTitle}</h2>

        <BenchmarkTable categories={categories} />

        <p className="text-sm text-slate-600">
          {t.compareNote}{' '}
          <Link href={langUrl(lang, '/openid/providers')} className="text-primary hover:underline">{t.openidBenchmark}</Link>.
        </p>
        {iamProvider && (
          <p className="text-sm text-slate-600">
            {t.lookingForIAMProvider.replace('{name}', provider.name)}{' '}
            <Link href={langUrl(lang, `/iam/providers/${iamProvider.identifier}`)} className="text-primary hover:underline">
              {t.viewOnIAM.replace('{name}', provider.name)}
            </Link>.
          </p>
        )}
        {!iamProvider && (
          <p className="text-sm text-slate-600">
            {t.lookingForIAMGeneral}{' '}
            <Link href={langUrl(lang, '/iam/providers')} className="text-primary hover:underline">
              {t.checkIAM}
            </Link>.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <h2 className="text-3xl text-center font-semibold leading-none tracking-tight mb-2">{t.faq}</h2>

        {faqFeatures.map((feature) => (
          <FAQFeatureComponent
            key={`faq-feature-${feature.feature.identifier}`}
            feature={feature}
            provider={provider}
            t={t}
          />
        ))}
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <ProviderInaccuracyWarning dict={dict.inaccuracyWarning} />
      </div>
    </main>
  )
}

function FAQFeatureComponent({
  feature,
  provider,
  t,
}: {
  feature: FAQFeature
  provider: OpenIDConnectProvider
  t: Dictionary['openidProviders']
}) {
  let featureSuffix: string
  switch (feature.feature.category) {
    case OpenIDConnectFeatureCategory.GrantType: featureSuffix = t.grantType; break
    case OpenIDConnectFeatureCategory.Extension: featureSuffix = t.extension; break
    case OpenIDConnectFeatureCategory.Endpoint: featureSuffix = t.endpoint; break
    case OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod: featureSuffix = t.tokenEndpointAuthMethod; break
    case OpenIDConnectFeatureCategory.Prompt: featureSuffix = t.prompt; break
    default: featureSuffix = t.feature; break
  }
  const fullFeatureName = `${feature.feature.name} ${featureSuffix}`
  const question = t.faqDoes.replace('{name}', provider.name).replace('{feature}', fullFeatureName)

  let answer: string
  switch (feature.providerFeature.status) {
    case FeatureStatus.Supported:
      answer = t.faqSupported.replace('{name}', provider.name).replace('{feature}', fullFeatureName)
      break
    case FeatureStatus.NotSupported:
      answer = t.faqNotSupported.replace('{name}', provider.name).replace('{feature}', fullFeatureName)
      break
    case FeatureStatus.Partial:
      answer = t.faqPartial.replace('{name}', provider.name).replace('{feature}', fullFeatureName)
      break
    case FeatureStatus.Deprecated:
      answer = t.faqDeprecated.replace('{name}', provider.name).replace('{featureName}', feature.feature.name)
      break
    default:
      answer = t.faqUnknown.replace('{feature}', feature.feature.name)
      break
  }

  if (feature.providerFeature.description) {
    answer += ` ${feature.providerFeature.description}`
  }

  return (
    <div key={feature.feature.identifier}>
      <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2">{question}</h3>
      <p>{answer} {feature.providerFeature.links?.[0] && (
        <Link href={feature.providerFeature.links[0]} className="inline-flex items-center justify-center text-sm" rel="nofollow" target="_blank">
          {t.readMore}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}</p>
    </div>
  )
}
