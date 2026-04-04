import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getProviders } from '@/lib/providers'
import { getTableCells } from './get-table-cells'
import { ProviderInaccuracyWarning } from './inaccuracy-warning'
import { ProvidersInteractiveView } from './providers-interactive-view'

export const metadata: Metadata = {
  title: 'OpenID Connect Providers compatibility',
  description: 'Display the compatibility of OpenID Connect features across different providers.',
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
          OpenID Connect Providers compatibility
        </h1>
        <p className="text-md text-slate-600">
          Display the compatibility of OpenID Connect features across different providers.
        </p>
        <ProviderInaccuracyWarning />
      </div>

      <Suspense>
        <ProvidersInteractiveView providers={allProviders} allCategories={allCategories} />
      </Suspense>
    </main>
  )
}
