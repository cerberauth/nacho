import { getProviderFeature } from '@/lib/providers'
import { getTableCells as buildTableCells } from '@/lib/get-table-cells'
import type { BenchmarkCategoryProps } from '@/components/benchmark-table'

export function getTableCells(categories: any[], providerIdentifiers: string[]): BenchmarkCategoryProps[] {
  return buildTableCells(categories, providerIdentifiers, getProviderFeature)
}
