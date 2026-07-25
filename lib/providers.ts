import { openIDConnectFeatures, providers } from '@/data/openid/providers'
import { createProviderListHelpers } from '@/lib/provider-list'

export const getOpenIDConnectFeatures = () => {
  return openIDConnectFeatures
}

const helpers = createProviderListHelpers(providers)

export const getProviders = helpers.getAll
export const getProvidersByNationalities = helpers.getByNationalities
export const getProviderById = helpers.getById
export const getProviderFeature = helpers.getFeature
export const getProviderVsPairs = helpers.getVsPairs
export const getProviderVsOrder = helpers.getVsOrder
