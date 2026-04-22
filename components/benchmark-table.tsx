import { ArrowUpRight, Check, CircleHelp, Info, Trash, X } from 'lucide-react'
import Link from 'next/link'

import { FeatureStatus } from '@/data/openid/providers'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const REGION_CODE_MAP: Record<string, string> = {
  UK: 'GB',
}

function getFlagEmoji(code: string): string {
  const normalized = REGION_CODE_MAP[code.toUpperCase()] ?? code.toUpperCase()
  return [...normalized].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

const DEVICON_SLUG_MAP: Record<string, string> = {
  'JavaScript': 'javascript/javascript-original.svg',
  'TypeScript': 'typescript/typescript-original.svg',
  'React': 'react/react-original.svg',
  'React Native': 'react/react-original.svg',
  'Angular': 'angular/angular-original.svg',
  'Vue': 'vuejs/vuejs-original.svg',
  'Next.js': 'nextjs/nextjs-original.svg',
  'Node.js': 'nodejs/nodejs-original.svg',
  'Python': 'python/python-original.svg',
  'Java': 'java/java-original.svg',
  '.NET': 'dotnetcore/dotnetcore-original.svg',
  'Go': 'go/go-original.svg',
  'PHP': 'php/php-original.svg',
  'Ruby': 'ruby/ruby-original.svg',
  'Swift': 'swift/swift-original.svg',
  'Kotlin': 'kotlin/kotlin-original.svg',
  'Flutter': 'flutter/flutter-original.svg',
  'Android': 'android/android-original.svg',
  'Expo': 'expo/expo-original.svg',
  'Remix': 'remix/remix-original.svg',
  'AWS': 'amazonwebservices/amazonwebservices-original.svg',
  'Azure': 'azure/azure-original.svg',
  'GCP': 'googlecloud/googlecloud-original.svg',
  'Google Cloud': 'googlecloud/googlecloud-original.svg',
  'DigitalOcean': 'digitalocean/digitalocean-original.svg',
}

const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

function getValueIcon(featureIdentifier: string, value: string): React.ReactNode {
  if (featureIdentifier === 'region_deployment') {
    return <span aria-label={value}>{getFlagEmoji(value)}</span>
  }
  const slug = DEVICON_SLUG_MAP[value]
  if (slug && (featureIdentifier === 'private_cloud_deployment' || featureIdentifier === 'sdk_coverage')) {
    return <img src={`${DEVICON_CDN}/${slug}`} alt={value} width={14} height={14} className="inline-block shrink-0" />
  }
  return null
}

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
              className="text-xl font-mono text-slate-950 before:content-['#'] before:hidden before:absolute before:-left-4 hover:underline hover:before:block">
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
                  <div className="w-full min-h-6 flex items-center justify-center rounded">
                    <TooltipProvider>
                      <Tooltip>
                        {cell.status === FeatureStatus.Supported && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-lime-100 text-lime-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                                {cell.values && cell.values.length > 0
                                  ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-lime-200 rounded flex items-center gap-1">{getValueIcon(row.identifier, v)}{v}</span>)
                                  : <Check className="h-4 w-4" />
                                }
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.links?.[0] ? <Link href={cell.links[0]} target="_blank" rel="nofollow">Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Supported'}</p>
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.NotSupported && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-red-100 text-red-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                                {cell.values && cell.values.length > 0
                                  ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-red-200 rounded flex items-center gap-1">{getValueIcon(row.identifier, v)}{v}</span>)
                                  : <X className="w-4 h-4" />
                                }
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.links?.[0] ? <Link href={cell.links[0]} target="_blank" rel="nofollow">Not Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Not Supported'}</p>
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.Deprecated && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-yellow-100 text-yellow-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                                {cell.values && cell.values.length > 0
                                  ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-yellow-200 rounded flex items-center gap-1">{getValueIcon(row.identifier, v)}{v}</span>)
                                  : <Trash className="h-4 w-4" />
                                }
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.links?.[0] ? <Link href={cell.links[0]} target="_blank" rel="nofollow">Deprecated <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Deprecated'}</p>
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.Partial && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-blue-100 text-blue-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                                {cell.values && cell.values.length > 0
                                  ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-blue-200 rounded flex items-center gap-1">{getValueIcon(row.identifier, v)}{v}</span>)
                                  : <Info className="h-4 w-4" />
                                }
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">{cell.links?.[0] ? <Link href={cell.links[0]} target="_blank" rel="nofollow">Partially Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Partially Supported'}</p>
                              {cell.description && <p>{cell.description}</p>}
                            </TooltipContent>
                          </>
                        )}

                        {cell.status === FeatureStatus.Unknown && (
                          <>
                            <TooltipTrigger asChild>
                              <span className="bg-gray-100 text-gray-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                                {cell.values && cell.values.length > 0
                                  ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-gray-200 rounded flex items-center gap-1">{getValueIcon(row.identifier, v)}{v}</span>)
                                  : <CircleHelp className="w-4 h-4" />
                                }
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
  )
}
