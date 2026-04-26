import { featuresCategories } from '@/data/iam/index'
import { getIAMProviderFeature } from '@/lib/iam-providers'
import { getTableCells as buildTableCells } from '@/lib/get-table-cells'
import type { BenchmarkCategoryProps } from '@/components/benchmark-table'

export function getTableCells(providerIdentifiers: string[]): BenchmarkCategoryProps[] {
  return buildTableCells(featuresCategories, providerIdentifiers, getIAMProviderFeature)
}
