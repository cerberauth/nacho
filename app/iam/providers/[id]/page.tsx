import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

import { FeatureStatus } from '@/lib/types'
import { featuresCategories, IAMFeatureCategory, type IAMFeature, type IAMProvider } from '@/data/iam/index'
import { getIAMProviderById, getIAMProviderFeature, getIAMProviders } from '@/lib/iam-providers'
import { providers as openIDProviders } from '@/data/openid/providers'
import { BenchmarkTable } from '@/components/benchmark-table'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { getCountryFlag } from '@/lib/utils'
import { getTableCells } from '../get-table-cells'

type Props = {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getIAMProviders().map((provider) => ({ id: provider.identifier }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const provider = getIAMProviderById(id)
  if (!provider) {
    return null
  }

  return {
    title: `${provider.name} IAM Provider`,
    description: provider.abstract,
    alternates: {
      canonical: `/iam/providers/${id}`,
    },
    openGraph: {
      images: [{ url: provider.icon.contentUrl }],
    },
  }
}

type FAQFeature = {
  feature: IAMFeature
  providerFeature: IAMProvider['featureList'][0]
}

export default async function ProviderPage({ params }: Props) {
  const { id } = await params
  const provider = getIAMProviderById(id)
  if (!provider) {
    return notFound()
  }

  const categories = getTableCells([provider.identifier])
  const openIDProvider = openIDProviders.find((p) => p.identifier === provider.identifier)
  const faqFeatures = featuresCategories.reduce((acc, category) => {
    const features = category.features
      .map((feature) => ({
        feature,
        providerFeature: getIAMProviderFeature(provider.identifier, feature!.identifier),
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
                {provider.name} IAM Provider
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
        <h2 className="text-3xl text-center font-semibold leading-none tracking-tight mb-2">Features</h2>

        <BenchmarkTable categories={categories} />

        <p className="text-sm text-slate-600">
          If you want to compare IAM features of different providers, please check out the <Link href="/iam/providers" className="text-primary hover:underline">(C)IAM Identity Providers benchmark</Link>.
        </p>
        {openIDProvider && (
          <p className="text-sm text-slate-600">
            Looking for {provider.name}&apos;s OpenID Connect protocol compatibility?{' '}
            <Link href={`/openid/providers/${openIDProvider.identifier}`} className="text-primary hover:underline">
              View {provider.name} on the OpenID Connect Providers benchmark
            </Link>.
          </p>
        )}
        {!openIDProvider && (
          <p className="text-sm text-slate-600">
            Looking for OpenID Connect protocol-level compatibility across providers?{' '}
            <Link href="/openid/providers" className="text-primary hover:underline">
              Check out the OpenID Connect Providers benchmark
            </Link>.
          </p>
        )}
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

function FAQFeatureComponent({ feature, provider }: { feature: FAQFeature, provider: IAMProvider }) {
  let fullFeatureName: string
  switch (feature.feature.category) {
    case IAMFeatureCategory.AuthenticationMethod:
      fullFeatureName = `${feature.feature.name} authentication method`
      break

    case IAMFeatureCategory.MFA:
      fullFeatureName = `${feature.feature.name} MFA`
      break

    case IAMFeatureCategory.IntegrationProtocols:
      fullFeatureName = `${feature.feature.name} integration protocol`
      break

    case IAMFeatureCategory.IdentityFederation:
      fullFeatureName = `${feature.feature.name} identity federation`
      break

    case IAMFeatureCategory.UserManagement:
      fullFeatureName = `${feature.feature.name} user management`
      break

    case IAMFeatureCategory.AccessControl:
      fullFeatureName = `${feature.feature.name} access control`
      break

    case IAMFeatureCategory.Security:
      fullFeatureName = `${feature.feature.name} security feature`
      break

    case IAMFeatureCategory.MultiTenancy:
      fullFeatureName = `${feature.feature.name} multi-tenancy`
      break

    case IAMFeatureCategory.BrandingUX:
      fullFeatureName = `${feature.feature.name} branding feature`
      break

    case IAMFeatureCategory.Analytics:
      fullFeatureName = `${feature.feature.name} analytics`
      break

    case IAMFeatureCategory.Compliance:
      fullFeatureName = `${feature.feature.name} compliance`
      break

    case IAMFeatureCategory.DeveloperIntegration:
      fullFeatureName = `${feature.feature.name} developer integration`
      break

    case IAMFeatureCategory.Advanced:
    default:
      fullFeatureName = `${feature.feature.name} feature`
      break
  }
  const question = `Does ${provider.name} support ${fullFeatureName}?`

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
      <p>{answer} {feature.providerFeature.links?.[0] && (
        <Link href={feature.providerFeature.links[0]} className="inline-flex items-center justify-center text-sm" rel="nofollow" target="_blank">
          Read more
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}</p>
    </div>
  )
}
