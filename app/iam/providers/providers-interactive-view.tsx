'use client'

import { Fragment, useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, CircleHelp, Info, Plus, RefreshCw, Trash, X } from 'lucide-react'

import { FeatureStatus } from '@/data/iam/index'
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
import survey from '@/data/iam/survey.json'
import { scoreVendors, type SurveyAnswers, type VendorScore } from '@/lib/iam-scoring'

type FeatureCategory = {
  name: string
  identifier: string
  features: Array<{
    name: string
    identifier: string
    description?: string
    status?: string
  }>
}

type Provider = {
  name: string
  identifier: string
  abstract?: string
  website?: string
  icon?: { contentUrl: string }
  license: string
  pricing?: {
    hasFreeTier: boolean
    freeTierLimit?: string
    pricingModel: string
    pricingUrl?: string
    plans: { name: string; price: string }[]
  }
  featureList: Array<{
    identifier: string
    description?: string
    status: string
    links?: string[]
    values?: string[]
  }>
}

type Props = {
  providers: Provider[]
  allCategories: BenchmarkCategoryProps[]
  featuresCategories: FeatureCategory[]
  providerDetailUrlPrefix: string
}

type SurveyOption = {
  value: string
  label: string
  description?: string
}

type SurveyQuestion = {
  questionId: string
  label: string
  helpText?: string
  inputType: 'single_select' | 'multi_select'
  required?: boolean
  options?: SurveyOption[]
}

type SurveyStep = {
  stepId: string
  order: number
  title: string
  subtitle?: string
  questions: SurveyQuestion[]
}

function encodeAnswers(answers: SurveyAnswers): string {
  return btoa(JSON.stringify(answers))
}

function decodeAnswers(encoded: string): SurveyAnswers | null {
  try {
    return JSON.parse(atob(encoded)) as SurveyAnswers
  } catch {
    return null
  }
}

const STEPS = survey.steps as SurveyStep[]
const TOTAL_STEPS = STEPS.length

const ANSWER_KEY_MAP: Record<string, keyof SurveyAnswers> = {
  q_audience: 'audience',
  q_mau: 'mau',
  q_deployment: 'deployment',
  q_features: 'features',
  q_compliance: 'compliance',
  q_budget: 'budget',
}

export function IAMProvidersInteractiveView({
  providers,
  allCategories,
  featuresCategories,
  providerDetailUrlPrefix,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── Survey state ──────────────────────────────────────────────────────────
  const savedAnswers = useMemo<SurveyAnswers | null>(() => {
    const raw = searchParams.get('answers')
    return raw ? decodeAnswers(raw) : null
  }, [searchParams])

  const [wizardOpen, setWizardOpen] = useState(!savedAnswers)
  const [wizardStep, setWizardStep] = useState(0)
  const [draftAnswers, setDraftAnswers] = useState<SurveyAnswers>(savedAnswers ?? {})

  // ── Feature filter state (secondary, kept compatible with shared URL params) ─
  const selectedFeatures = useMemo(() => {
    const f = searchParams.get('features')
    return f ? new Set(f.split(',').filter(Boolean)) : new Set<string>()
  }, [searchParams])

  const hiddenProviders = useMemo(() => {
    const p = searchParams.get('excluded_providers')
    return p ? new Set(p.split(',').filter(Boolean)) : new Set<string>()
  }, [searchParams])

  const hiddenRows = useMemo(() => {
    const r = searchParams.get('excluded_features')
    return r ? new Set(r.split(',').filter(Boolean)) : new Set<string>()
  }, [searchParams])

  // ── URL param helpers ────────────────────────────────────────────────────
  const updateParams = useCallback(
    (
      answers: SurveyAnswers | null,
      features: Set<string>,
      hidden: Set<string>,
      rows: Set<string>,
    ) => {
      const params = new URLSearchParams(searchParams.toString())
      if (answers) {
        params.set('answers', encodeAnswers(answers))
      } else {
        params.delete('answers')
      }
      if (features.size > 0) {
        params.set('features', Array.from(features).join(','))
      } else {
        params.delete('features')
      }
      if (hidden.size > 0) {
        params.set('excluded_providers', Array.from(hidden).join(','))
      } else {
        params.delete('excluded_providers')
      }
      if (rows.size > 0) {
        params.set('excluded_features', Array.from(rows).join(','))
      } else {
        params.delete('excluded_features')
      }
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  // ── Scoring ───────────────────────────────────────────────────────────────
  const vendorScores = useMemo<VendorScore[]>(() => {
    if (!savedAnswers) return []
    return scoreVendors(providers as Parameters<typeof scoreVendors>[0], savedAnswers)
  }, [providers, savedAnswers])

  const scoreMap = useMemo(() => {
    return new Map(vendorScores.map(v => [v.identifier, v]))
  }, [vendorScores])

  // ── Provider ordering ─────────────────────────────────────────────────────
  const allSortedProviders = useMemo(() => {
    if (vendorScores.length === 0) return providers
    return [...providers].sort((a, b) => {
      const sa = scoreMap.get(a.identifier)?.score ?? 0
      const sb = scoreMap.get(b.identifier)?.score ?? 0
      return sb - sa
    })
  }, [providers, vendorScores, scoreMap])

  const tableProviderIds = useMemo(() => {
    return allSortedProviders
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
  }, [allSortedProviders, hiddenProviders, selectedFeatures])

  const sortedProviders = useMemo(
    () => allSortedProviders.filter(p => !hiddenProviders.has(p.identifier)),
    [allSortedProviders, hiddenProviders],
  )

  const hiddenProviderList = useMemo(
    () => providers.filter(p => hiddenProviders.has(p.identifier)),
    [providers, hiddenProviders],
  )

  const dimmedProviders = useMemo(
    () => new Set(sortedProviders.filter(p => !tableProviderIds.includes(p.identifier)).map(p => p.identifier)),
    [sortedProviders, tableProviderIds],
  )

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
            cells: sortedIds.map(
              id => row.cells.find(cell => cell.identifier === id) ?? { identifier: id, status: FeatureStatus.Unknown },
            ),
          })),
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


  // ── Provider toggle ───────────────────────────────────────────────────────
  const toggleProvider = (id: string) => {
    const next = new Set(hiddenProviders)
    const visibleCount = providers.filter(p => !next.has(p.identifier)).length
    if (next.has(id)) {
      next.delete(id)
    } else if (visibleCount > 1) {
      next.add(id)
    }
    updateParams(savedAnswers, selectedFeatures, next, hiddenRows)
  }

  const toggleRow = (id: string) => {
    const next = new Set(hiddenRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    updateParams(savedAnswers, selectedFeatures, hiddenProviders, next)
  }

  const trackVendorClick = (identifier: string) => {
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Vendor Click', { props: { vendor: identifier, benchmark: 'iam' } })
    )
  }

  // ── Feature filter toggle ─────────────────────────────────────────────────
  const toggleFeature = (featureId: string) => {
    const next = new Set(selectedFeatures)
    if (next.has(featureId)) next.delete(featureId)
    else next.add(featureId)
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Feature Filter', { props: { feature: featureId, action: next.has(featureId) ? 'add' : 'remove', benchmark: 'iam' } })
    )
    updateParams(savedAnswers, next, hiddenProviders, hiddenRows)
  }

  // ── Survey wizard helpers ─────────────────────────────────────────────────
  const openWizard = () => {
    setDraftAnswers(savedAnswers ?? {})
    setWizardStep(0)
    setWizardOpen(true)
  }

  const setDraftAnswer = (questionId: string, value: string) => {
    const key = ANSWER_KEY_MAP[questionId]
    if (!key) return
    const step = STEPS.find(s => s.questions.some(q => q.questionId === questionId))
    const question = step?.questions.find(q => q.questionId === questionId)
    if (!question) return

    setDraftAnswers(prev => {
      if (question.inputType === 'single_select') {
        return { ...prev, [key]: value }
      }
      // multi_select
      const current = (prev[key] as string[] | undefined) ?? []
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  const isDraftAnswerSelected = (questionId: string, value: string): boolean => {
    const key = ANSWER_KEY_MAP[questionId]
    if (!key) return false
    const current = draftAnswers[key]
    if (Array.isArray(current)) return current.includes(value)
    return current === value
  }

  const canAdvance = (): boolean => {
    const step = STEPS[wizardStep]
    return step.questions.every(q => {
      if (!q.required) return true
      const key = ANSWER_KEY_MAP[q.questionId]
      if (!key) return true
      const val = draftAnswers[key]
      return val !== undefined && val !== null
    })
  }

  const finishSurvey = () => {
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Survey Complete', { props: { benchmark: 'iam' } })
    )
    updateParams(draftAnswers, selectedFeatures, hiddenProviders, hiddenRows)
    setWizardOpen(false)
  }

  const recommendedVendors = useMemo(
    () => vendorScores.filter(v => v.recommended).slice(0, 3),
    [vendorScores],
  )

  return (
    <>
      {/* ── Survey wizard dialog ── */}
      <Dialog open={wizardOpen} onOpenChange={(open) => {
        // Only allow closing if survey is already answered
        if (!open && savedAnswers) setWizardOpen(false)
        else if (!open && !savedAnswers) setWizardOpen(false)
        else setWizardOpen(open)
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{survey.title}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-500 -mt-2">{survey.description}</p>

          {/* Progress bar */}
          <div className="flex gap-1">
            {STEPS.map((step, i) => (
              <div
                key={step.stepId}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i === wizardStep
                    ? 'bg-slate-900'
                    : i < wizardStep
                      ? 'bg-slate-400'
                      : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[260px] flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-0.5">{STEPS[wizardStep].title}</h3>
            {STEPS[wizardStep].subtitle && (
              <p className="text-xs text-slate-500 mb-4">{STEPS[wizardStep].subtitle}</p>
            )}

            {STEPS[wizardStep].questions.map(question => (
              <div key={question.questionId} className="flex flex-col gap-2 overflow-y-auto max-h-64">
                {question.inputType === 'single_select' && question.options?.map(option => {
                  const selected = isDraftAnswerSelected(question.questionId, option.value)
                  return (
                    <button
                      key={option.value}
                      onClick={() => setDraftAnswer(question.questionId, option.value)}
                      className={`flex flex-col items-start text-left px-4 py-3 rounded-lg border transition-all ${
                        selected
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-900">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-slate-500 mt-0.5">{option.description}</span>
                      )}
                    </button>
                  )
                })}

                {question.inputType === 'multi_select' && (
                  <div className="flex flex-col gap-1.5">
                    {question.options?.map(option => {
                      const selected = isDraftAnswerSelected(question.questionId, option.value)
                      return (
                        <label
                          key={option.value}
                          className={`flex items-start gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                            selected
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => setDraftAnswer(question.questionId, option.value)}
                            className="accent-slate-900 h-4 w-4 mt-0.5 shrink-0"
                          />
                          <div>
                            <span className="text-sm font-medium text-slate-900">{option.label}</span>
                            {option.description && (
                              <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2 border-t">
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
              Step {wizardStep + 1} of {TOTAL_STEPS}
            </span>

            {wizardStep < TOTAL_STEPS - 1 ? (
              <Button
                size="sm"
                variant={canAdvance() ? 'default' : 'ghost'}
                onClick={() => setWizardStep(s => s + 1)}
                disabled={!canAdvance()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={finishSurvey}>
                <Check className="h-4 w-4 mr-1" />
                See recommendations
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Recommendations panel ── */}
      {savedAnswers && recommendedVendors.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Top recommendations for your profile
            </h2>
            <button
              onClick={openWizard}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retake survey
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedVendors.map((vs, rank) => {
              const provider = providers.find(p => p.identifier === vs.identifier)
              if (!provider) return null
              return (
                <div
                  key={vs.identifier}
                  className={`relative flex flex-col gap-3 rounded-xl border p-4 ${
                    rank === 0 ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'
                  }`}
                >
                  {rank === 0 && (
                    <span className="absolute -top-2.5 left-4 text-xs font-semibold bg-slate-900 text-white px-2 py-0.5 rounded-full">
                      Best match
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    {provider.icon?.contentUrl && (
                      <Image
                        src={provider.icon.contentUrl}
                        height={32}
                        width={32}
                        alt={provider.name}
                        className="rounded"
                      />
                    )}
                    <div>
                      <Link
                        href={`${providerDetailUrlPrefix}/${provider.identifier}`}
                        onClick={() => trackVendorClick(provider.identifier)}
                        className="text-sm font-semibold text-slate-900 hover:underline"
                      >
                        {provider.name}
                      </Link>
                      <p className="text-xs text-slate-500">{provider.license}</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all"
                        style={{ width: `${vs.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">{vs.score}%</span>
                  </div>

                  {/* Top reasons */}
                  {vs.topReasons.length > 0 && (
                    <ul className="flex flex-col gap-1">
                      {vs.topReasons.map(reason => (
                        <li key={reason} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-900" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`${providerDetailUrlPrefix}/${provider.identifier}`}
                    onClick={() => trackVendorClick(provider.identifier)}
                    className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-0.5 mt-auto"
                  >
                    View details <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              )
            })}
          </div>

          <a
            href="#full-comparison"
            className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-2 w-fit"
          >
            Skip to full comparison table
          </a>
        </div>
      )}

      {/* ── Toolbar ── */}
      {savedAnswers ? (
        <div id="full-comparison" className="flex items-center gap-2 flex-wrap w-full">
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
              <button className="flex items-center gap-1 border border-dashed border-slate-300 text-slate-400 text-xs px-2 py-1 rounded-full hover:border-slate-500 hover:text-slate-600 transition-colors">
                <Plus className="h-3 w-3" />
                Filter by feature
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto w-80">
              <SheetHeader>
                <SheetTitle>Filter by feature</SheetTitle>
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
              onClick={() => updateParams(savedAnswers, new Set(), hiddenProviders, new Set())}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center gap-3 px-4 py-3 rounded-lg border border-slate-900 bg-slate-50 w-full">
          <p className="text-sm text-slate-600">
            Answer a few questions to get personalised vendor recommendations.
          </p>
          <Button onClick={openWizard} className="gap-2 shrink-0">
            Find my best match
          </Button>
        </div>
      )}

      {/* ── Comparison table ── */}
      <div className="w-full overflow-x-auto overflow-y-clip">
        <div
          className="grid gap-x-1"
          style={{ gridTemplateColumns: `280px repeat(${sortedProviders.length}, minmax(124px, 1fr))` }}
        >
          {/* Corner spacer */}
          <div className="sticky top-0 left-0 z-30 bg-white" />

          {/* Provider header cards */}
          {sortedProviders.map(provider => {
            const inTable = tableProviderIds.includes(provider.identifier)
            const vs = scoreMap.get(provider.identifier)
            return (
              <div key={provider.identifier} className="sticky top-0 z-20 bg-white pt-2 pb-1 group/col relative">
                <div
                  className={`flex flex-col items-center justify-between rounded-md px-3 py-2 gap-1 border transition-all ${
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
                    href={`${providerDetailUrlPrefix}/${provider.identifier}`}
                    onClick={() => trackVendorClick(provider.identifier)}
                    className="text-sm text-center text-slate-900 truncate w-full hover:underline"
                  >
                    {provider.name}
                  </Link>
                  <span className="text-xs text-slate-400">{provider.license}</span>

                  {/* Score badge */}
                  {vs && savedAnswers && (
                    <div className="flex items-center gap-1 w-full">
                      <div className="flex-1 h-1 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-700"
                          style={{ width: `${vs.score}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums">{vs.score}%</span>
                    </div>
                  )}

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

          {/* Pricing & Plans section */}
          {sortedProviders.some(p => p.pricing) && (
            <Fragment>
              <div className="col-span-full sticky left-0 bg-white px-2 pt-4 pb-1">
                <h2 className="text-xl font-mono text-slate-950">Pricing &amp; Plans</h2>
              </div>

              <div className="sticky left-0 z-10 bg-white flex items-center px-2">
                <span className="p-1 text-sm text-slate-600"><code>Free Tier</code></span>
              </div>
              {sortedProviders.map(provider => (
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
              {sortedProviders.map(provider => (
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
          )}

          {/* Categories + feature rows */}
          {filteredCategories.map(category => (
            <Fragment key={category.name}>
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

              {category.rows.map(row => (
                <Fragment key={row.identifier}>
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

                  {row.cells.map(cell => (
                    <div
                      key={cell.identifier}
                      className={`flex items-center justify-center transition-opacity ${dimmedProviders.has(cell.identifier) ? 'opacity-25' : ''}`}
                    >
                      <div className="w-full min-h-6 flex items-center justify-center rounded">
                        <TooltipProvider>
                          <Tooltip>
                            {cell.status === FeatureStatus.Supported && (
                              <>
                                <TooltipTrigger asChild>
                                  <span className="bg-lime-100 text-lime-600 w-full min-h-6 flex flex-wrap gap-1 items-center justify-center rounded p-1">
                                    {cell.values && cell.values.length > 0
                                      ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-lime-200 rounded">{v}</span>)
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
                                      ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-red-200 rounded">{v}</span>)
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
                                      ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-yellow-200 rounded">{v}</span>)
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
                                      ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-blue-200 rounded">{v}</span>)
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
                                      ? cell.values.map(v => <span key={v} className="text-xs px-1 py-0.5 bg-gray-200 rounded">{v}</span>)
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
