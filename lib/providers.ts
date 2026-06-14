import { FeatureStatus } from '@/lib/types'
import { openIDConnectFeatures, providers } from '@/data/openid/providers'

export const getOpenIDConnectFeatures = () => {
  return openIDConnectFeatures
}

export const getProviders = () => {
  return [...providers].sort((a, b) => {
    const countSupported = (p: typeof a) =>
      p.featureList.filter((f) => f.status === FeatureStatus.Supported).length
    return countSupported(b) - countSupported(a)
  })
}

export const getProvidersByNationalities = (nationalities: string[]) => {
  return getProviders().filter(
    (p) => p.nationality && nationalities.includes(p.nationality)
  )
}

export const getProviderById = (id: string) => {
  return getProviders().find((p) => p.identifier === id)
}

export const getProviderFeature = (providerId: string, featureId: string) => {
  const provider = getProviderById(providerId)
  return provider?.featureList.find((f) => f.identifier === featureId)
}
