import { openIDConnectFeatures, providers } from '@/data/openid/providers'

export const getOpenIDConnectFeatures = () => {
  return openIDConnectFeatures
}

export const getProviders = () => {
  return providers
}

export const getProviderById = (id: string) => {
  return getProviders().find((p) => p.identifier === id)
}

export const getProviderFeature = (providerId: string, featureId: string) => {
  const provider = getProviderById(providerId)
  return provider?.featureList.find((f) => f.identifier === featureId)
}
