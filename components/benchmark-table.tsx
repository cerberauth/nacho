import { Trash } from 'lucide-react'
import Link from 'next/link'

import { FeatureStatus } from '@/lib/types'
import { StatusCell } from '@/components/benchmark/status-cell'

type BenchmarkCellProps = {
  identifier: string
  description?: string
  status: FeatureStatus
  links?: string[]
  values?: string[]
}

type BenchmarkRowProps = {
  name: string
  identifier: string
  description?: string
  status: FeatureStatus
  links?: string[]
  cells: BenchmarkCellProps[]
}

export type BenchmarkCategoryProps = {
  name: string
  rows: BenchmarkRowProps[]
}

export function BenchmarkTable({
  categories,
  dimmedProviders
}: {
  categories: BenchmarkCategoryProps[]
  dimmedProviders?: Set<string>
}) {
  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => (
        <BenchmarkCategoryTable key={category.name} category={category} dimmedProviders={dimmedProviders} />
      ))}
    </div>
  )
}

function BenchmarkCategoryTable({
  category,
  dimmedProviders
}: {
  category: BenchmarkCategoryProps
  dimmedProviders?: Set<string>
}) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-1">
        <div id={category.name.trim()} className="sticky left-0 z-10 bg-white shrink-0 w-[280px] min-w-[280px] px-2 pt-4 pb-1">
          <a href={`#${category.name.trim()}`}>
            <h2
              className="text-xl font-mono text-slate-950 before:content-['#'] before:hidden before:absolute before:-left-4 hover:before:block">
              {category.name}
            </h2>
          </a>
        </div>
      </div>
      <ul className="flex flex-col gap-1">
          {category.rows.map((row) => (
            <li key={`category-row-${row.identifier}`} className="flex gap-1 items-start">
                <div className="sticky left-0 z-10 bg-white shrink-0 w-[280px] min-w-[280px] flex items-center px-2">
                  <Link className={`p-1 ${row.name.length > 30 ? 'text-xs' : 'text-sm'} text-slate-600 hover:text-slate-900 flex gap-1 items-start hover:underline`} href={row.links?.[0] || `#${row.identifier}`} title={row.description || row.name} target="_blank">
                    <span className="min-w-0">
                      <code>{row.name}</code>
                    </span>
                    {row.status === FeatureStatus.Deprecated && (
                      <span className="text-red-600 shrink-0">
                        <Trash className="h-4 w-4" />
                      </span>
                    )}
                  </Link>
                </div>
                {row.cells.map((cell) => (
                <div key={`row-${row.identifier}-cell-${cell.identifier}`} className={`min-w-[124px] w-full flex items-start justify-center transition-opacity ${dimmedProviders?.has(cell.identifier) ? 'opacity-25' : ''}`}>
                  <StatusCell
                    featureIdentifier={row.identifier}
                    status={cell.status}
                    links={cell.links}
                    values={cell.values}
                    description={cell.description}
                  />
                </div>
                ))}
            </li>
          ))}
      </ul>
    </div>
  )
}

