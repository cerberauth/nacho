import { featuresCategories } from '@/data/openid/providers'
import { getProviderFeature } from '@/lib/providers'
import { getTableCells as buildTableCells } from '@/lib/get-table-cells'
import type { BenchmarkCategoryProps } from '@/components/benchmark-table'

export function getTableCells(providerIdentifiers: string[]): BenchmarkCategoryProps[] {
  return buildTableCells(featuresCategories, providerIdentifiers, getProviderFeature)
}
