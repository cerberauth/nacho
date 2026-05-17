import { Fragment } from 'react'
import { Check, CircleHelp, X } from 'lucide-react'
import { type Provider } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type PricingRowsProps = {
  providers: Provider[]
  dimmedProviders: Set<string>
}

export function PricingRows({ providers, dimmedProviders }: PricingRowsProps) {
  if (!providers.some(p => p.pricing)) return null

  return (
    <Fragment>
      <div className="col-span-full sticky left-0 bg-white px-2 pt-4 pb-1">
        <h2 className="text-xl font-mono text-slate-950">Pricing &amp; Plans</h2>
      </div>

      <div className="sticky left-0 z-10 bg-white flex items-center px-2">
        <span className="p-1 text-sm text-slate-600"><code>Free Tier</code></span>
      </div>
      {providers.map(provider => (
        <div key={`pricing-free-tier-${provider.identifier}`} className={`flex items-center justify-center transition-opacity ${dimmedProviders.has(provider.identifier) ? 'opacity-25' : ''}`}>
          <div className="w-full h-6 flex items-center justify-center rounded">
            {provider.pricing ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {provider.pricing.hasFreeTier ? (
                      <span className="bg-lime-100 text-lime-600 w-full h-6 flex items-center justify-center rounded cursor-default">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 w-full h-6 flex items-center justify-center rounded cursor-default">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{provider.pricing.hasFreeTier ? (provider.pricing.freeTierLimit || 'Free tier available') : 'No free tier'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span className="bg-gray-100 text-gray-600 w-full h-6 flex items-center justify-center rounded">
                <CircleHelp className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="sticky left-0 z-10 bg-white flex items-start px-2 pt-1">
        <span className="p-1 text-sm text-slate-600"><code>Plans</code></span>
      </div>
      {providers.map(provider => (
        <div key={`pricing-plans-${provider.identifier}`} className={`flex items-start justify-center py-1 transition-opacity ${dimmedProviders.has(provider.identifier) ? 'opacity-25' : ''}`}>
          {provider.pricing ? (
            <div className="flex flex-col gap-0.5 w-full">
              {provider.pricing.plans.map(plan => (
                <div key={plan.name} className="flex flex-col items-center rounded bg-slate-50 border border-slate-100 px-1 py-0.5">
                  <span className="text-xs font-medium text-slate-700 text-center">{plan.name}</span>
                  <span className="text-xs text-slate-500 text-center">{plan.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400 mt-1">—</span>
          )}
        </div>
      ))}
    </Fragment>
  )
}
