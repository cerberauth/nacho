import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { featuresCategories, FeatureStatus, OpenIDConnectFeatureCategory, type OpenIDConnectFeature, type OpenIDConnectProvider } from '@/data/openid/providers'
import { getOpenIDConnectFeatureById, getProviderById, getProviderFeature, getProviders } from '@/lib/providers'
import { BenchmarkTable } from '@/components/benchmark-table'
import { getTableCells } from '../get-table-cells'
import { ArrowUpRight } from 'lucide-react'
import { ProviderInaccuracyWarning } from '../inaccuracy-warning'

type Props = {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getProviders().map((provider) => ({ id: provider.identifier }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const provider = getProviderById(id)
  if (!provider) {
    return null
  }

  return {
    title: `${provider.name} OpenID Connect Provider`,
    description: provider.abstract,
    image: provider.icon.contentUrl
  }
}

type FAQFeature = {
  feature: OpenIDConnectFeature
  providerFeature: OpenIDConnectProvider['featureList'][0]
}

export default async function ProviderPage({ params }: Props) {
  const { id } = await params
  const provider = getProviderById(id)
  if (!provider) {
    return notFound()
  }

  const categories = getTableCells([provider.identifier])
  const faqFeatures = featuresCategories.reduce((acc, category) => {
    const features = category.features
      .map((feature) => getOpenIDConnectFeatureById(feature))
      .filter(Boolean)
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
            <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2">
              {provider.name} OpenID Connect Provider
            </h1>
            <p className="text-md text-slate-600">
              {provider.abstract}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <h2 className="text-3xl text-center font-semibold leading-none tracking-tight mb-2">Features</h2>

        <BenchmarkTable categories={categories} />

        <p className="text-sm text-slate-600">
          If you want to compare OpenID Connect features of different providers, please check out the <Link href="/openid/providers" className="text-primary hover:underline">OpenID Connect providers benchmark table</Link>.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <h2 className="text-3xl text-center font-semibold leading-none tracking-tight mb-2">Frequently Asked Questions</h2>

        {faqFeatures.map((feature) => (
          <FAQFeatureComponent key={`faq-feature-${feature.feature.identifier}`} feature={feature} provider={provider} />
        ))}
      </div>

      <div className="flex flex-col gap-8 max-w-full mt-8">
        <ProviderInaccuracyWarning />
      </div>
    </main>
  )
}

function FAQFeatureComponent({ feature, provider }: { feature: FAQFeature, provider: OpenIDConnectProvider }) {
  let fullFeatureName: string
  switch (feature.feature.category) {
    case OpenIDConnectFeatureCategory.GrantType:
      fullFeatureName = `${feature.feature.name} grant type`
      break

    case OpenIDConnectFeatureCategory.Extension:
      fullFeatureName = `${feature.feature.name} extension`
      break

    case OpenIDConnectFeatureCategory.Endpoint:
      fullFeatureName = `${feature.feature.name} endpoint`
      break

    case OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod:
      fullFeatureName = `${feature.feature.name} token endpoint authentication method`
      break

    case OpenIDConnectFeatureCategory.Prompt:
      fullFeatureName = `${feature.feature.name} prompt`
      break

    case OpenIDConnectFeatureCategory.Feature:
    default:
      fullFeatureName = `${feature.feature.name} feature`
      break
  }
  const question = `Does ${provider.name} support the ${fullFeatureName}?`

  let answer: string
  switch (feature.providerFeature.status) {
    case FeatureStatus.Supported:
      answer = `${provider.name} supports ${fullFeatureName}.`
      break

    case FeatureStatus.NotSupported:
      answer = `${provider.name} does not support ${fullFeatureName}.`
      break

    case FeatureStatus.Partial:
      answer = `${provider.name} partially supports ${fullFeatureName}.`
      break

    case FeatureStatus.Deprecated:
      answer = `${provider.name} supports ${feature.feature.name}, but it is deprecated or not recommended anymore.`
      break

    case FeatureStatus.Unknown:
    default:
      answer = `The status of ${feature.feature.name} is unknown.`
      break
  }

  if (feature.providerFeature.description) {
    answer += ` ${feature.providerFeature.description}`
  }

  return (
    <div key={feature.feature.identifier}>
      <h3 className="text-2xl font-semibold leading-none tracking-tight mb-2">{question}</h3>
      <p>{answer} {feature.providerFeature.url && (
        <Link href={feature.providerFeature.url} className="inline-flex items-center justify-center text-sm" rel="nofollow" target="_blank">
          Read more
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}</p>
    </div>
  )
}
