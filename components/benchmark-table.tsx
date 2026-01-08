import { ArrowUpRight, Check, CircleHelp, Info, Trash, X } from 'lucide-react'
import Link from 'next/link'

import { FeatureStatus } from '@/data/openid/providers'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type BenchmarkCellProps = {
  identifier: string
  description?: string
  status: FeatureStatus
  url?: string
}

type BenchmarkRowProps = {
  name: string
  identifier: string
  description?: string
  status: FeatureStatus
  url?: string
  cells: BenchmarkCellProps[]
}

export type BenchmarkCategoryProps = {
  name: string
  rows: BenchmarkRowProps[]
}

export function BenchmarkTable({ categories }: { categories: BenchmarkCategoryProps[] }) {
  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => (
        <BenchmarkCategoryTable key={category.name} category={category} />
      ))}
    </div>
  )
}

function BenchmarkCategoryTable({ category }: { category: BenchmarkCategoryProps }) {
  return (
    <div className="flex flex-col">
      <div id={category.name.trim()}>
        <a href={`#${category.name.trim()}`}>
          <h2
            className="text-xl font-mono text-slate-950 before:content-['#'] before:hidden before:absolute before:-left-4 hover:underline hover:before:block">
            {category.name}
          </h2>
        </a>
        <ul className="flex flex-col gap-1 mt-2">
          {category.rows.map((row) => (
            <li key={`category-row-${row.identifier}`} className="flex gap-1">
              <Link className="absolute transform xl:translate-x-[calc(-100%-8px)] p-1 pr-4 text-sm text-slate-600 group-hover:text-slate-900 flex gap-1 items-center hover:underline" href={row.url || `#${row.identifier}`} title={row.description || row.name} target="_blank">
                <span>
                  <code>{row.name}</code>
                </span>
                {row.status === FeatureStatus.Deprecated && (
                  <span className="text-red-600">
                    <Trash className="h-4 w-4" />
                  </span>
                )}
              </Link>
              {row.cells.map((cell) => (
                <div key={`row-${row.identifier}-cell-${cell.identifier}`} className="min-w-[124px] w-full flex items-center justify-center">
                  <div className="w-full h-6 flex items-center justify-center rounded">
                    <TooltipProvider>
                      <Tooltip>
                        {cell.status === FeatureStatus.Supported && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-lime-100 text-lime-600 w-full h-6 flex items-center justify-center rounded">
                                <Check className="h-4 w-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.url ? <Link href={cell.url} target="_blank" rel="nofollow">Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Supported'}</p>
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.NotSupported && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-red-100 text-red-600 w-full h-6 flex items-center justify-center rounded">
                                <X className="w-4 h-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.url ? <Link href={cell.url} target="_blank" rel="nofollow">Not Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Not Supported'}</p>
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.Deprecated && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-yellow-100 text-yellow-600 w-full h-6 flex items-center justify-center rounded">
                                <Trash className="h-4 w-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.url ? <Link href={cell.url} target="_blank" rel="nofollow">Deprecated <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Deprecated'}</p>
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.Partial && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-blue-100 text-blue-600 w-full h-6 flex items-center justify-center rounded">
                                <Info className="h-4 w-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.url ? <Link href={cell.url} target="_blank" rel="nofollow">Partially Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Partially Supported'}</p>
                              {cell.description && <p>{cell.description}</p>}
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.Unknown && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-gray-100 text-gray-600 w-full h-6 flex items-center justify-center rounded">
                                <CircleHelp className="w-4 h-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">Unknown Support</p>
                              Help us improve this data by <Link href="https://github.com/cerberauth/nacho/issues" target="_blank" rel="nofollow" className="underline">opening an issue</Link>.
                            </TooltipContent>
                          </>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div >
  )
}
