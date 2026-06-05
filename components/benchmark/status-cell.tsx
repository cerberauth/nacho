import { ArrowUpRight, Check, CircleHelp, Info, Trash, X } from 'lucide-react'
import Link from 'next/link'
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiAngular,
  SiVuedotjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiOpenjdk,
  SiDotnet,
  SiGo,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiFlutter,
  SiAndroid,
  SiExpo,
  SiRemix,
  SiGooglecloud,
  SiDigitalocean,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa6'
import { VscAzure } from 'react-icons/vsc'

import { FeatureStatus } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const REGION_CODE_MAP: Record<string, string> = {
  UK: 'GB',
}

function getFlagEmoji(code: string): string {
  const normalized = REGION_CODE_MAP[code.toUpperCase()] ?? code.toUpperCase()
  return [...normalized].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

const ICON_MAP: Record<string, React.ElementType> = {
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'React': SiReact,
  'React Native': SiReact,
  'Angular': SiAngular,
  'Vue': SiVuedotjs,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'Python': SiPython,
  'Java': SiOpenjdk,
  '.NET': SiDotnet,
  'Go': SiGo,
  'PHP': SiPhp,
  'Ruby': SiRuby,
  'Swift': SiSwift,
  'Kotlin': SiKotlin,
  'Flutter': SiFlutter,
  'Android': SiAndroid,
  'Expo': SiExpo,
  'Remix': SiRemix,
  'AWS': FaAws,
  'Azure': VscAzure,
  'GCP': SiGooglecloud,
  'Google Cloud': SiGooglecloud,
  'DigitalOcean': SiDigitalocean,
}

function getValueIcon(featureIdentifier: string, value: string): React.ReactNode {
  if (featureIdentifier === 'region_deployment') {
    return <span aria-label={value}>{getFlagEmoji(value)}</span>
  }
  const Icon = ICON_MAP[value]
  if (Icon && (featureIdentifier === 'private_cloud_deployment' || featureIdentifier === 'sdk_coverage')) {
    return <Icon className="inline-block shrink-0 h-3.5 w-auto" title={value} />
  }
  return null
}

type StatusCellProps = {
  featureIdentifier: string
  status: FeatureStatus
  links?: string[]
  values?: string[]
  description?: string
}

export function StatusCell({ featureIdentifier, status, links, values, description }: StatusCellProps) {
  return (
    <div className="w-full min-h-6 flex items-center justify-center rounded">
      <TooltipProvider>
        <Tooltip>
          {status === FeatureStatus.Supported && (
            <>
              <TooltipTrigger asChild>
                <span className="bg-lime-100 text-lime-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                  {values && values.length > 0
                    ? values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-lime-200 rounded flex items-center gap-1">{getValueIcon(featureIdentifier, v)}{v}</span>)
                    : <Check className="h-4 w-4" />
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{links?.[0] ? <Link href={links[0]} target="_blank" rel="nofollow">Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Supported'}</p>
              </TooltipContent>
            </>
          )}

          {status === FeatureStatus.NotSupported && (
            <>
              <TooltipTrigger asChild>
                <span className="bg-red-100 text-red-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                  {values && values.length > 0
                    ? values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-red-200 rounded flex items-center gap-1">{getValueIcon(featureIdentifier, v)}{v}</span>)
                    : <X className="w-4 h-4" />
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{links?.[0] ? <Link href={links[0]} target="_blank" rel="nofollow">Not Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Not Supported'}</p>
              </TooltipContent>
            </>
          )}

          {status === FeatureStatus.Deprecated && (
            <>
              <TooltipTrigger asChild>
                <span className="bg-yellow-100 text-yellow-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                  {values && values.length > 0
                    ? values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-yellow-200 rounded flex items-center gap-1">{getValueIcon(featureIdentifier, v)}{v}</span>)
                    : <Trash className="h-4 w-4" />
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{links?.[0] ? <Link href={links[0]} target="_blank" rel="nofollow">Deprecated <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Deprecated'}</p>
              </TooltipContent>
            </>
          )}

          {status === FeatureStatus.Partial && (
            <>
              <TooltipTrigger asChild>
                <span className="bg-blue-100 text-blue-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                  {values && values.length > 0
                    ? values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-blue-200 rounded flex items-center gap-1">{getValueIcon(featureIdentifier, v)}{v}</span>)
                    : <Info className="h-4 w-4" />
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{links?.[0] ? <Link href={links[0]} target="_blank" rel="nofollow">Partially Supported <ArrowUpRight className="w-4 h-4 inline-block" /></Link> : 'Partially Supported'}</p>
                {description && <p>{description}</p>}
              </TooltipContent>
            </>
          )}

          {status === FeatureStatus.Unknown && (
            <>
              <TooltipTrigger asChild>
                <span className="bg-gray-100 text-gray-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                  {values && values.length > 0
                    ? values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-gray-200 rounded flex items-center gap-1">{getValueIcon(featureIdentifier, v)}{v}</span>)
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
  )
}
