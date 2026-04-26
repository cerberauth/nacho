import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { featuresCategories } from '@/data/openid/providers'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { ProvidersInteractiveView } from '@/components/providers-interactive-view'
import { getProviders } from '@/lib/providers'
import { getTableCells } from './get-table-cells'

export const metadata: Metadata = {
  title: 'OpenID Connect Providers Benchmark',
  description: 'Compare OpenID Connect providers across grant types, token endpoint authentication methods, extensions, endpoints, FAPI compliance, and protocol features.',
  alternates: {
    canonical: '/openid/providers',
  },
}

const allProviders = getProviders()
const allCategories = getTableCells(allProviders.map((provider) => provider.identifier))

export default function ProviderPage() {
  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col gap-4 max-w-full">
        <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2">
          OpenID Connect Providers Benchmark
        </h1>
        <p className="text-md text-slate-600">
          Compare OpenID Connect providers across grant types, token endpoint authentication methods, extensions, endpoints, FAPI compliance, and protocol features.
        </p>
        <p className="text-sm text-slate-500">
          Looking for CIAM features like MFA, SSO, user management, and compliance?{' '}
          <Link href="/iam/providers" className="text-primary hover:underline">
            Check out the CIAM Identity Providers benchmark
          </Link>
          .
        </p>
        <ProviderInaccuracyWarning />
      </div>

      <Suspense>
        <ProvidersInteractiveView
          providers={allProviders}
          allCategories={allCategories}
          featuresCategories={featuresCategories}
          providerDetailUrlPrefix="/openid/providers"
        />
      </Suspense>
    </main>
  )
}
