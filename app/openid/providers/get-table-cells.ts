import { featuresCategories, FeatureStatus } from '@/data/openid/providers'
import { getProviderFeature } from '@/lib/providers'
import { type BenchmarkCategoryProps } from '@/components/benchmark-table'

export function getTableCells(providerIdentifiers: string[]): BenchmarkCategoryProps[] {
  return featuresCategories.map(({ name, features }) => ({
    name,
    rows: features.map((feature) => {
      return {
        identifier: feature.identifier,
        description: feature.description,
        name: feature.name,
        status: feature.status as FeatureStatus,
        url: feature.url,
        cells: providerIdentifiers.map((providerIdentifier) => {
          const cellFeature = getProviderFeature(providerIdentifier, feature.identifier)
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
