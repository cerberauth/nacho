import { FeatureStatus } from '@/lib/types'
import { type BenchmarkCategoryProps } from '@/components/benchmark-table'

type FeatureInput = {
  identifier: string
  name: string
  description?: string
  status?: string
  links?: string[]
}

type FeatureCategoryInput = {
  name: string
  features: FeatureInput[]
}

type ProviderFeatureResult = {
  description?: string
  status: string
  links?: string[]
  values?: string[]
} | null | undefined

export function getTableCells(
  featuresCategories: FeatureCategoryInput[],
  providerIdentifiers: string[],
  getProviderFeature: (providerId: string, featureId: string) => ProviderFeatureResult
): BenchmarkCategoryProps[] {
  return featuresCategories.map(({ name, features }) => ({
    name,
    rows: features.map((feature) => ({
      identifier: feature.identifier,
      description: feature.description,
      name: feature.name,
      status: feature.status as FeatureStatus,
      links: feature.links,
      cells: providerIdentifiers.map((providerIdentifier) => {
        const cellFeature = getProviderFeature(providerIdentifier, feature.identifier)
        if (!cellFeature) {
          return {
            identifier: providerIdentifier,
            status: FeatureStatus.Unknown,
          }
        }
        return {
          identifier: providerIdentifier,
          description: cellFeature.description,
          status: cellFeature.status as FeatureStatus,
          links: cellFeature.links,
          values: cellFeature.values,
        }
      }),
    })),
  }))
}
