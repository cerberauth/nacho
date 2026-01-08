import { getProviders } from '@/lib/providers'
import { ProviderCard } from '@/components/provider-card'
import { BenchmarkTable } from '@/components/benchmark-table'
import { getTableCells } from './get-table-cells'
import { ProviderInaccuracyWarning } from './inaccuracy-warning'

const categories = getTableCells(getProviders().map((provider) => provider.identifier))

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

      <div className="sticky top-0 z-10 max-w-full">
        <div className="flex gap-1 bg-white pt-2">
          {getProviders().map((provider) => (
            <div key={`provider-${provider.identifier}`} className="max-w-32">
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col max-w-full">
        <BenchmarkTable categories={categories} />
      </div>
    </main>
  )
}
