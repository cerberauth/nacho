import { providers } from '@/data/iam/index'
import { createProviderListHelpers } from '@/lib/provider-list'

const helpers = createProviderListHelpers(providers)

export const getIAMProviders = helpers.getAll
export const getIAMProvidersByNationalities = helpers.getByNationalities
export const getIAMProviderById = helpers.getById
export const getIAMProviderFeature = helpers.getFeature
export const getIAMProviderVsPairs = helpers.getVsPairs
export const getIAMProviderVsOrder = helpers.getVsOrder
