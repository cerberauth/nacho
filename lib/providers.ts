import { openIDConnectFeatures, providers, FeatureStatus } from '@/data/openid/providers'

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

export const getProviderById = (id: string) => {
  return getProviders().find((p) => p.identifier === id)
}

export const getProviderFeature = (providerId: string, featureId: string) => {
  const provider = getProviderById(providerId)
  return provider?.featureList.find((f) => f.identifier === featureId)
}
