'use client'

import { Fragment, useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleHelp, Info, Plus, Settings2, Trash, X } from 'lucide-react'

import { featuresCategories, FeatureStatus, type OpenIDConnectProvider } from '@/data/openid/providers'
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

type Props = {
  providers: OpenIDConnectProvider[]
  allCategories: BenchmarkCategoryProps[]
}

export function ProvidersInteractiveView({ providers, allCategories }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedFeatures = useMemo(() => {
    const f = searchParams.get('features')
    return f ? new Set(f.split(',').filter(Boolean)) : new Set<string>()
  }, [searchParams])

  const hiddenProviders = useMemo(() => {
    const p = searchParams.get('providers')
    return p ? new Set(p.split(',').filter(Boolean)) : new Set<string>()
  }, [searchParams])

  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [draftFeatures, setDraftFeatures] = useState<Set<string>>(new Set())

  const isConfigured = selectedFeatures.size > 0

  const updateParams = useCallback((features: Set<string>, hidden: Set<string>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (features.size > 0) {
      params.set('features', Array.from(features).join(','))
    } else {
      params.delete('features')
    }
    if (hidden.size > 0) {
      params.set('providers', Array.from(hidden).join(','))
    } else {
      params.delete('providers')
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const toggleProvider = (id: string) => {
    const next = new Set(hiddenProviders)
    const visibleCount = providers.filter(p => !next.has(p.identifier)).length
    if (next.has(id)) {
      next.delete(id)
    } else if (visibleCount > 1) {
      next.add(id)
    }
    updateParams(selectedFeatures, next)
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
    updateParams(draftFeatures, hiddenProviders)
    setWizardOpen(false)
  }

  const toggleFeature = (featureId: string) => {
    const next = new Set(selectedFeatures)
    if (next.has(featureId)) {
      next.delete(featureId)
    } else {
      next.add(featureId)
    }
    updateParams(next, hiddenProviders)
  }

  const resetBenchmark = () => {
    updateParams(new Set(), hiddenProviders)
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
    return [
      ...providers.filter(p => tableProviderIds.includes(p.identifier)),
      ...providers.filter(p => !tableProviderIds.includes(p.identifier)),
    ]
  }, [providers, tableProviderIds])

  const dimmedProviders = useMemo(() => {
    return new Set(providers.filter(p => !tableProviderIds.includes(p.identifier)).map(p => p.identifier))
  }, [providers, tableProviderIds])

  const filteredCategories = useMemo(() => {
    const sortedIds = sortedProviders.map(p => p.identifier)
    return allCategories
      .map(cat => ({
        ...cat,
        rows: cat.rows
          .filter(row => selectedFeatures.size === 0 || selectedFeatures.has(row.identifier))
          .map(row => ({
            ...row,
            cells: sortedIds.map(id =>
              row.cells.find(cell => cell.identifier === id) ?? { identifier: id, status: FeatureStatus.Unknown }
            )
          }))
      }))
      .filter(cat => cat.rows.length > 0)
  }, [allCategories, selectedFeatures, sortedProviders])

  const activeFeatureLabels = useMemo(() => {
    const allFeatures = featuresCategories.flatMap(c => c.features)
    return Array.from(selectedFeatures)
      .map(id => allFeatures.find(f => f.identifier === id))
      .filter(Boolean) as (typeof allFeatures)[number][]
  }, [selectedFeatures])

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
          {activeFeatureLabels.map(feature => (
            <button
              key={feature.identifier}
              onClick={() => toggleFeature(feature.identifier)}
              className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              {feature.name}
              <X className="h-3 w-3" />
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
              </div>
            </SheetContent>
          </Sheet>

          <button
            onClick={resetBenchmark}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
          >
            Reset
          </button>
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
              <div key={provider.identifier} className="sticky top-0 z-20 bg-white pt-2 pb-1">
                <div
                  onClick={() => toggleProvider(provider.identifier)}
                  title={inTable ? `Hide ${provider.name}` : `Show ${provider.name}`}
                  className={`flex flex-col items-center justify-between rounded-md px-3 py-2 gap-1 border cursor-pointer transition-all ${
                    inTable
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-white border-slate-100 opacity-20 hover:opacity-40'
                  }`}
                >
                  {provider.icon?.contentUrl && (
                    <Image
                      className="w-10 my-auto"
                      src={provider.icon.contentUrl}
                      height={30}
                      width={30}
                      alt={provider.name}
                    />
                  )}
                  <Link
                    href={`/openid/providers/${provider.identifier}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-center text-slate-900 truncate w-full hover:underline"
                  >
                    {provider.name}
                  </Link>
                  <span className="text-xs text-slate-400">{provider.license}</span>
                </div>
              </div>
            )
          })}

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
                  <div className="sticky left-0 z-10 bg-white flex items-center px-2">
                    <Link
                      className={`p-1 ${row.name.length > 30 ? 'text-xs' : 'text-sm'} text-slate-600 hover:text-slate-900 flex gap-1 items-start hover:underline`}
                      href={row.url || `#${row.identifier}`}
                      title={row.description || row.name}
                      target="_blank"
                    >
                      <span className="min-w-0"><code>{row.name}</code></span>
                      {row.status === FeatureStatus.Deprecated && (
                        <span className="text-red-600 shrink-0"><Trash className="h-4 w-4" /></span>
                      )}
                    </Link>
                  </div>

                  {/* Feature cells */}
                  {row.cells.map(cell => (
                    <div
                      key={cell.identifier}
                      className={`flex items-center justify-center transition-opacity ${dimmedProviders.has(cell.identifier) ? 'opacity-25' : ''}`}
                    >
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
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
