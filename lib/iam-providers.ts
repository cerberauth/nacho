import { FeatureStatus } from '@/lib/types'
import { providers } from '@/data/iam/index'

export const getIAMProviders = () => {
  return [...providers].sort((a, b) => {
    const countSupported = (p: typeof a) =>
      p.featureList.filter((f) => f.status === FeatureStatus.Supported).length
    return countSupported(b) - countSupported(a)
  })
}

export const getIAMProvidersByNationalities = (nationalities: string[]) => {
  return getIAMProviders().filter(
    (p) => p.nationality && nationalities.includes(p.nationality)
  )
}

export const getIAMProviderById = (id: string) => {
  return getIAMProviders().find((p) => p.identifier === id)
}

export const getIAMProviderFeature = (providerId: string, featureId: string) => {
  const provider = getIAMProviderById(providerId)
  return provider?.featureList.find((f) => f.identifier === featureId)
}
