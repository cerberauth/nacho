'use client'

import { Fragment, useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleHelp, Info, Plus, Settings2, Trash, X } from 'lucide-react'

import { FeatureStatus, type Provider, type FeatureCategory } from '@/lib/types'
import { StatusCell } from '@/components/benchmark/status-cell'
import type { BenchmarkCategoryProps } from '@/components/benchmark-table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import { useBenchmarkParams } from '@/components/hooks/use-benchmark-params'
import { PricingRows } from '@/components/benchmark/pricing-rows'

type Props = {
  providers: Provider[]
  allCategories: BenchmarkCategoryProps[]
  featuresCategories: FeatureCategory[]
  providerDetailUrlPrefix: string
}

export function ProvidersInteractiveView({ providers, allCategories, featuresCategories, providerDetailUrlPrefix }: Props) {
  const {
    selectedFeatures,
    hiddenProviders,
    hiddenRows,
    updateParams,
  } = useBenchmarkParams()

  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [draftFeatures, setDraftFeatures] = useState<Set<string>>(new Set())

  const isConfigured = selectedFeatures.size > 0 || hiddenRows.size > 0

  const toggleProvider = (id: string) => {
    const next = new Set(hiddenProviders)
    const visibleCount = providers.filter(p => !next.has(p.identifier)).length
    if (next.has(id)) {
      next.delete(id)
    } else if (visibleCount > 1) {
      next.add(id)
    }
    updateParams({ hiddenProviders: next })
  }

  const toggleRow = (id: string) => {
    const next = new Set(hiddenRows)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    updateParams({ hiddenRows: next })
  }

  const trackVendorClick = (identifier: string) => {
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Vendor Click', { props: { vendor: identifier, benchmark: 'openid' } })
    )
  }

  const openWizard = () => {
    setDraftFeatures(new Set())
    setWizardStep(0)
    setWizardOpen(true)
  }

  const toggleDraftFeature = (featureId: string) => {
    setDraftFeatures(prev => {
      const next = new Set(prev)
      if (next.has(featureId)) next.delete(featureId)
      else next.add(featureId)
      return next
    })
  }

  const applyWizard = () => {
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Setup', { props: { features: Array.from(draftFeatures).join(','), benchmark: 'openid' } })
    )
    updateParams({ features: draftFeatures })
    setWizardOpen(false)
  }

  const toggleFeature = (featureId: string) => {
    const next = new Set(selectedFeatures)
    if (next.has(featureId)) {
      next.delete(featureId)
    } else {
      next.add(featureId)
    }
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Feature Filter', { props: { feature: featureId, action: next.has(featureId) ? 'add' : 'remove', benchmark: 'openid' } })
    )
    updateParams({ features: next })
  }

  const resetBenchmark = () => {
    updateParams({ features: new Set(), hiddenRows: new Set() })
  }

  const tableProviderIds = useMemo(() => {
    return providers
      .filter(p => !hiddenProviders.has(p.identifier))
      .filter(p => {
        if (selectedFeatures.size === 0) return true
        for (const featureId of selectedFeatures) {
          const feat = p.featureList.find(f => f.identifier === featureId)
          const status = feat?.status
          if (status === FeatureStatus.NotSupported || status === FeatureStatus.Deprecated) {
            return false
          }
        }
        return true
      })
      .map(p => p.identifier)
  }, [providers, hiddenProviders, selectedFeatures])

  const sortedProviders = useMemo(() => {
    const notHidden = providers.filter(p => !hiddenProviders.has(p.identifier))
    return [
      ...notHidden.filter(p => tableProviderIds.includes(p.identifier)),
      ...notHidden.filter(p => !tableProviderIds.includes(p.identifier)),
    ]
  }, [providers, hiddenProviders, tableProviderIds])

  const hiddenProviderList = useMemo(() => {
    return providers.filter(p => hiddenProviders.has(p.identifier))
  }, [providers, hiddenProviders])

  const dimmedProviders = useMemo(() => {
    return new Set(sortedProviders.filter(p => !tableProviderIds.includes(p.identifier)).map(p => p.identifier))
  }, [sortedProviders, tableProviderIds])

  const filteredCategories = useMemo(() => {
    const sortedIds = sortedProviders.map(p => p.identifier)
    return allCategories
      .map(cat => ({
        ...cat,
        rows: cat.rows
          .filter(row => !hiddenRows.has(row.identifier))
          .filter(row => selectedFeatures.size === 0 || selectedFeatures.has(row.identifier))
          .map(row => ({
            ...row,
            cells: sortedIds.map(id =>
              row.cells.find(cell => cell.identifier === id) ?? { identifier: id, status: FeatureStatus.Unknown }
            )
          }))
      }))
      .filter(cat => cat.rows.length > 0)
  }, [allCategories, selectedFeatures, hiddenRows, sortedProviders])

  const hiddenRowDetails = useMemo(() => {
    if (hiddenRows.size === 0) return []
    const allRowsList = allCategories.flatMap(c => c.rows)
    return Array.from(hiddenRows)
      .map(id => allRowsList.find(r => r.identifier === id))
      .filter(Boolean) as (typeof allRowsList)[number][]
  }, [hiddenRows, allCategories])

  const excludedFeaturesSorted = useMemo(() => {
    return [...hiddenRowDetails].sort((a, b) => {
      const countA = sortedProviders.filter(p =>
        p.featureList.find(f => f.identifier === a.identifier)?.status === FeatureStatus.Supported
      ).length
      const countB = sortedProviders.filter(p =>
        p.featureList.find(f => f.identifier === b.identifier)?.status === FeatureStatus.Supported
      ).length
      return countB - countA
    })
  }, [hiddenRowDetails, sortedProviders])

  const totalSteps = featuresCategories.length

  return (
    <>
      {!isConfigured ? (
        <div className="flex justify-center items-center gap-3 px-4 py-3 rounded-lg border border-slate-900 bg-slate-50 w-full">
          <p className="text-sm text-slate-600">
            Filter providers by the features your project needs.
          </p>
          <Button onClick={openWizard} className="gap-2 shrink-0">
            <Settings2 className="h-4 w-4" />
            Set up benchmark
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          {excludedFeaturesSorted.map(feature => (
            <button
              key={feature.identifier}
              onClick={() => toggleRow(feature.identifier)}
              className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full hover:bg-lime-50 hover:text-lime-700 transition-colors"
            >
              <Plus className="h-3 w-3" />
              {feature.name}
            </button>
          ))}

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-1 border border-dashed border-slate-300 text-slate-400 text-xs px-2 py-1 rounded-full hover:border-slate-500 hover:text-slate-600 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add feature
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto w-80">
              <SheetHeader>
                <SheetTitle>Add or remove features</SheetTitle>
              </SheetHeader>
              <p className="text-sm text-slate-500 mt-1 mb-4">
                Only providers supporting all selected features will be shown.
              </p>
              <div className="flex flex-col gap-6">
                {featuresCategories.map(category => (
                  <div key={category.identifier}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">{category.name}</h3>
                    <div className="flex flex-col gap-0.5">
                      {category.features.map(feature => (
                        <label
                          key={feature.identifier}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-1 py-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFeatures.has(feature.identifier)}
                            onChange={() => toggleFeature(feature.identifier)}
                            className="accent-slate-900 h-3.5 w-3.5"
                          />
                          <span className="text-sm">{feature.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {hiddenRowDetails.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Hidden rows</h3>
                    <div className="flex flex-col gap-0.5">
                      {hiddenRowDetails.map(row => (
                        <div
                          key={row.identifier}
                          className="flex items-center justify-between px-1 py-1 rounded hover:bg-slate-50"
                        >
                          <span className="text-sm text-slate-500"><code>{row.name}</code></span>
                          <button
                            onClick={() => toggleRow(row.identifier)}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {(selectedFeatures.size > 0 || hiddenRows.size > 0) && (
            <button
              onClick={resetBenchmark}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}

      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Set up your benchmark</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-500 -mt-2">
            Pick the features your project needs. Only providers that support all of them will be shown.
          </p>

          <div className="flex gap-1">
            {featuresCategories.map((cat, i) => (
              <button
                key={cat.identifier}
                onClick={() => setWizardStep(i)}
                title={cat.name}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i === wizardStep
                    ? 'bg-slate-900'
                    : i < wizardStep
                      ? 'bg-slate-400'
                      : 'bg-slate-200'
                  }`}
              />
            ))}
          </div>

          <div className="min-h-[220px] flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-0.5">
              {featuresCategories[wizardStep].name}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Step {wizardStep + 1} of {totalSteps}
            </p>
            <div className="flex flex-col gap-0.5 overflow-y-auto max-h-56">
              {featuresCategories[wizardStep].features.map(feature => (
                <label
                  key={feature.identifier}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded"
                >
                  <input
                    type="checkbox"
                    checked={draftFeatures.has(feature.identifier)}
                    onChange={() => toggleDraftFeature(feature.identifier)}
                    className="accent-slate-900 h-3.5 w-3.5 shrink-0"
                  />
                  <span className="text-sm">{feature.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWizardStep(s => s - 1)}
              disabled={wizardStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span className="text-xs text-slate-400">
              {draftFeatures.size} feature{draftFeatures.size !== 1 ? 's' : ''} selected
            </span>
            {wizardStep < totalSteps - 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWizardStep(s => s + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={applyWizard} disabled={draftFeatures.size === 0}>
                <Check className="h-4 w-4 mr-1" />
                Apply
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full overflow-x-auto overflow-y-clip">
        <div
          className="grid gap-x-1"
          style={{ gridTemplateColumns: `280px repeat(${sortedProviders.length}, minmax(124px, 1fr))` }}
        >
          {/* ── Corner spacer ── */}
          <div className="sticky top-0 left-0 z-30 bg-white" />

          {/* ── Provider header cards ── */}
          {sortedProviders.map(provider => {
            const inTable = tableProviderIds.includes(provider.identifier)
            return (
              <div key={provider.identifier} className="sticky top-0 z-20 bg-white pt-2 pb-1 group/col relative">
                <div
                  className={`flex flex-col items-center justify-between rounded-md px-3 py-2 gap-1 border transition-all ${
                    inTable
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-white border-slate-100 opacity-20 hover:opacity-40'
                  }`}
                >
                  <div className="h-10 flex items-center justify-center">
                    {provider.icon?.contentUrl && (
                      <Image
                        className="w-10 h-10 object-contain"
                        src={provider.icon.contentUrl}
                        height={40}
                        width={40}
                        alt={provider.name}
                      />
                    )}
                  </div>
                  <Link
                    href={`${providerDetailUrlPrefix}/${provider.identifier}`}
                    onClick={(e) => { trackVendorClick(provider.identifier) }}
                    className="text-sm text-center text-slate-900 truncate w-full hover:underline"
                  >
                    {provider.name}
                  </Link>
                  <span className="text-xs text-slate-400">{provider.license}</span>
                  {provider.pricing && (
                    <div className="flex flex-col items-center gap-0.5 w-full">
                      {provider.pricing.hasFreeTier ? (
                        <span className="text-xs text-lime-700 bg-lime-50 rounded px-1">Free tier</span>
                      ) : (
                        <span className="text-xs text-slate-400">No free tier</span>
                      )}
                      {provider.pricing.pricingUrl && (
                        <Link
                          href={provider.pricing.pricingUrl}
                          target="_blank"
                          rel="nofollow"
                          className="text-xs text-slate-400 hover:text-slate-700 hover:underline flex items-center gap-0.5"
                        >
                          Pricing <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleProvider(provider.identifier)}
                  className="absolute top-2 right-0 z-10 opacity-0 group-hover/col:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200 hover:border-red-300 hover:text-red-500 text-slate-400"
                  title={`Remove ${provider.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}

          {/* ── Pricing & Plans section ── */}
          <PricingRows providers={sortedProviders} dimmedProviders={dimmedProviders} />

          {/* ── Categories + feature rows ── */}
          {filteredCategories.map(category => (
            <Fragment key={category.name}>
              {/* Category header spans all columns */}
              <div
                id={category.name.trim()}
                className="col-span-full sticky left-0 bg-white px-2 pt-4 pb-1"
              >
                <a href={`#${category.name.trim()}`}>
                  <h2 className="text-xl font-mono text-slate-950 hover:underline">
                    {category.name}
                  </h2>
                </a>
              </div>

              {/* Feature rows */}
              {category.rows.map(row => (
                <Fragment key={row.identifier}>
                  {/* Feature label */}
                  <div className="sticky left-0 z-10 bg-white flex items-center px-2 group/row">
                    <Link
                      className={`p-1 ${row.name.length > 30 ? 'text-xs' : 'text-sm'} text-slate-600 hover:text-slate-900 flex gap-1 items-start hover:underline`}
                      href={row.links?.[0] || `#${row.identifier}`}
                      title={row.description || row.name}
                      target="_blank"
                    >
                      <span className="min-w-0"><code>{row.name}</code></span>
                      {row.status === FeatureStatus.Deprecated && (
                        <span className="text-red-600 shrink-0"><Trash className="h-4 w-4" /></span>
                      )}
                    </Link>
                    <button
                      onClick={() => toggleRow(row.identifier)}
                      className="ml-auto shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity p-0.5 rounded text-slate-400 hover:text-red-500"
                      title={`Remove ${row.name} row`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Feature cells */}
                  {row.cells.map(cell => (
                    <div
                      key={cell.identifier}
                      className={`flex items-center justify-center transition-opacity ${dimmedProviders.has(cell.identifier) ? 'opacity-25' : ''}`}
                    >
                      <StatusCell
                        featureIdentifier={row.identifier}
                        status={cell.status as FeatureStatus}
                        links={cell.links}
                        values={cell.values}
                        description={cell.description}
                      />
                    </div>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* ── Hidden providers restore strip ── */}
      {hiddenProviderList.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className="text-xs text-slate-400">Hidden:</span>
          {hiddenProviderList.map(p => (
            <button
              key={p.identifier}
              onClick={() => toggleProvider(p.identifier)}
              className="flex items-center gap-1 text-xs text-slate-500 border border-dashed border-slate-300 px-2 py-1 rounded-full hover:border-slate-500 hover:text-slate-700 transition-colors"
            >
              <Plus className="h-3 w-3" />
              {p.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
