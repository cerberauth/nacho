import { featuresCategories, FeatureStatus, type IAMFeature } from '@/data/iam/index'
import { getIAMProviderFeature } from '@/lib/iam-providers'
import { type BenchmarkCategoryProps } from '@/components/benchmark-table'

export function getTableCells(providerIdentifiers: string[]): BenchmarkCategoryProps[] {
  return featuresCategories.map(({ name, features }) => ({
    name,
    rows: (features as IAMFeature[]).map((feature) => {
      return {
        identifier: feature.identifier,
        description: feature.description,
        name: feature.name,
        status: feature.status as FeatureStatus,
        links: feature.links,
        cells: providerIdentifiers.map((providerIdentifier) => {
          const cellFeature = getIAMProviderFeature(providerIdentifier, feature.identifier)
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
            links: cellFeature.links,
            values: cellFeature.values,
          }
        })
      }
    })
  }))
}
