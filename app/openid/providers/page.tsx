import { ArrowUpRight, Check, CircleHelp, Info, Trash, X } from 'lucide-react'
import Link from 'next/link'

import { FeatureStatus } from '@/data/openid/providers'
import { getOpenIDConnectFeatureById, getProviderFeature, getProviders } from '@/lib/providers'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProviderCard } from '@/components/provider-card'

type BenchmarkCellProps = {
  identifier: string
  description?: string
  status: FeatureStatus
  url?: string
}

type BenchmarRowProps = {
  name: string
  identifier: string
  description?: string
  status: FeatureStatus
  url?: string
  cells: BenchmarkCellProps[]
}

type BenchmarkCategoryProps = {
  name: string
  rows: BenchmarRowProps[]
}

function BenchmarkTable({ category }: { category: BenchmarkCategoryProps }) {
  return (
    <div className="flex flex-col gap-2">
      <div id={category.name.trim()}>
        <a href={`#${category.name.trim()}`}>
          <h2
            className="text-xl font-mono text-slate-950 before:content-['#'] before:hidden before:absolute before:-left-4 hover:underline hover:before:block">
            {category.name}
          </h2>
        </a>
        <ul className="flex flex-col gap-1">
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
                <div key={`row-${row.identifier}-cell-${cell.identifier}`} className="min-w-[124px] flex items-center justify-center">
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

const categories: BenchmarkCategoryProps[] = [
  {
    name: 'Grant Types',
    features: [
      'authorization_code_grant',
      'implicit_grant',
      'client_credentials_grant',
      'refresh_token_grant',
      'password_grant',
      'urn:ietf:params:oauth:grant-type:token-exchange',
      'urn:openid:params:grant-type:ciba',
      'urn:ietf:params:oauth:grant-type:device_code',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'urn:ietf:params:oauth:grant-type:saml2-bearer'
    ]
  },

  {
    name: 'Extensions',
    features: [
      'pkce_extension',
      'par_extension',
      'rar_extension',
    ]
  },

  {
    name: 'Endpoints',
    features: [
      'authorization_endpoint',
      'token_endpoint',
      'userinfo_endpoint',
      'token_revocation_endpoint',
      'token_introspection_endpoint',
      'openid_connect_discovery_endpoint',
      'oauth_authorization_server_metadata_endpoint'
    ]
  },

  {
    name: 'Token Endpoint Authentication Methods',
    features: [
      'none_token_endpoint_auth',
      'client_secret_basic_token_endpoint_auth',
      'client_secret_post_token_endpoint_auth',
      'client_secret_jwt_token_endpoint_auth',
      'private_key_jwt_token_endpoint_auth',
      'tls_client_auth_token_endpoint_auth',
    ]
  },

  {
    name: 'Prompts',
    features: [
      'login_prompt',
      'none_prompt',
      'consent_prompt',
      'select_account_prompt',
      'create_prompt',
    ]
  },

  // {
  //   name: 'Claims',
  //   features: []
  // },

  // {
  //   name: 'Scopes',
  //   features: []
  // },

  {
    name: 'Features',
    features: [
      'refresh_token_rotation',
      'dynamic_client_registration',
      'rp_initiated_logout',
    ]
  }
].map(({ name, features }) => ({
  name,
  rows: features.map((identifier) => {
    const feature = getOpenIDConnectFeatureById(identifier)
    if (!feature) {
      console.warn(`Feature ${identifier} not found`)
      return {
        identifier,
        name: '',
        status: FeatureStatus.Unknown,
        cells: getProviders().map((provider) => ({
          identifier: provider.identifier,
          status: FeatureStatus.Unknown
        }))
      }
    }

    return {
      identifier,
      description: feature.description,
      name: feature.name,
      status: feature.status as FeatureStatus,
      url: feature.url,
      cells: getProviders().map((provider) => {
        const cellFeature = getProviderFeature(provider.identifier, identifier)
        if (!cellFeature) {
          console.warn(`Feature ${identifier} not found for provider ${provider.identifier}`)
          return {
            identifier: provider.identifier,
            status: FeatureStatus.Unknown
          }
        }

        return {
          identifier: provider.identifier,
          description: cellFeature.description,
          status: cellFeature.status as FeatureStatus,
          url: cellFeature.url
        }
      })
    }
  })
}))

export default function ProviderPage() {
  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col gap-4 max-w-full">
        <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2">
          OpenID Connect Providers compatibility
        </h1>
        <p className="text-md text-slate-600">
          Display the compatibility of OpenID Connect features across different providers.
        </p>
        <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <strong>Note:</strong> The current data is not 100% accurate and is based on provider documentation and experience.
          Please <Link href="https://github.com/cerberauth/nacho/issues" rel="nofollow" target="_blank">open an issue</Link> if you
          have spotted any inconsistencies.
        </p>
      </div>

      <div className="sticky top-0 z-10 max-w-full">
        <div className="flex gap-1 bg-white pt-2">
          {getProviders().map((provider) => (
            <div key={`provider-${provider.identifier}`} className="max-w-32">
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-full">
        {categories.map((category) => (
          <BenchmarkTable key={`op-category-${category.name}`} category={category} />
        ))}
      </div>
    </main>
  )
}
