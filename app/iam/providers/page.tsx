import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { featuresCategories } from '@/data/iam/index'
import { getIAMProviders } from '@/lib/iam-providers'
import { getTableCells } from './get-table-cells'
import { ProviderInaccuracyWarning } from './inaccuracy-warning'
import { IAMProvidersInteractiveView } from './providers-interactive-view'

export const metadata: Metadata = {
  title: 'CIAM Identity Providers benchmark',
  description: 'Compare CIAM identity providers across authentication methods, user management, compliance, and developer integration features.',
  alternates: {
    canonical: '/iam/providers',
  },
}

const allProviders = getIAMProviders()
const allCategories = getTableCells(allProviders.map((provider) => provider.identifier))

export default function IAMProviderPage() {
  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col gap-4 max-w-full">
        <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2">
          CIAM Identity Providers benchmark
        </h1>
        <p className="text-md text-slate-600">
          Compare Customer Identity and Access Management (CIAM) providers across authentication methods,
          user management, compliance, security, and developer integration features.
        </p>
        <p className="text-sm text-slate-500">
          Looking for OpenID Connect protocol-level compatibility?{' '}
          <Link href="/openid/providers" className="text-primary hover:underline">
            Check out the OpenID Connect Providers benchmark
          </Link>
          .
        </p>
        <ProviderInaccuracyWarning />
      </div>

      <Suspense>
        <IAMProvidersInteractiveView
          providers={allProviders}
          allCategories={allCategories}
          featuresCategories={featuresCategories}
          providerDetailUrlPrefix="/iam/providers"
        />
      </Suspense>
    </main>
  )
}
