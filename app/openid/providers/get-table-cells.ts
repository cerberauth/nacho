import { featuresCategories, FeatureStatus } from '@/data/openid/providers'
import { getOpenIDConnectFeatureById, getProviderFeature } from '@/lib/providers'
import { type BenchmarkCategoryProps } from '@/components/benchmark-table'

export function getTableCells(providerIdentifiers: string[]): BenchmarkCategoryProps[] {
  return featuresCategories.map(({ name, features }) => ({
    name,
    rows: features.map((identifier) => {
      const feature = getOpenIDConnectFeatureById(identifier)
      if (!feature) {
        console.warn(`Feature ${identifier} not found`)
        return {
          identifier,
          name: '',
          status: FeatureStatus.Unknown,
          cells: providerIdentifiers.map((providerIdentifier) => ({
            identifier: providerIdentifier,
            status: FeatureStatus.Unknown
          }))
        }
      }

      return {
        identifier,
        description: feature.description,
        name: feature.name,
        status: feature.status as FeatureStatus,
        url: feature.url,
        cells: providerIdentifiers.map((providerIdentifier) => {
          const cellFeature = getProviderFeature(providerIdentifier, identifier)
          if (!cellFeature) {
            return {
              identifier: providerIdentifier,
              status: FeatureStatus.Unknown
            }
          }

          return {
            identifier: providerIdentifier,
            description: cellFeature.description,
            status: cellFeature.status as FeatureStatus,
            url: cellFeature.url
          }
        })
      }
    })
  }))
}
