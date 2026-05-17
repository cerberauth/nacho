'use client'

import { Fragment, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Plus, RefreshCw, Trash, X } from 'lucide-react'

import { FeatureStatus, type Provider, type FeatureCategory } from '@/lib/types'
import { StatusCell } from '@/components/benchmark/status-cell'
import type { BenchmarkCategoryProps } from '@/components/benchmark-table'
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
import {
  scoreVendors,
  type SurveyAnswers,
  type VendorScore,
  COMMON_FEATURES,
  AUDIENCE_FEATURES,
  FEATURE_MAP,
  COMPLIANCE_MAP
} from '@/lib/iam-scoring'

import { useBenchmarkParams } from '@/components/hooks/use-benchmark-params'
import { PricingRows } from '@/components/benchmark/pricing-rows'
import { getCountryFlag } from '@/lib/utils'

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
  const {
    selectedFeatures,
    hiddenProviders,
    hiddenRows,
    updateParams,
    searchParams,
  } = useBenchmarkParams()

  const savedAnswers = useMemo<SurveyAnswers | null>(() => {
    const raw = searchParams.get('answers')
    return raw ? decodeAnswers(raw) : null
  }, [searchParams])

  const [wizardOpen, setWizardOpen] = useState(!savedAnswers)
  const [wizardStep, setWizardStep] = useState(0)
  const [draftAnswers, setDraftAnswers] = useState<SurveyAnswers>(savedAnswers ?? {})

  const vendorScores = useMemo<VendorScore[]>(() => {
    if (!savedAnswers) return []
    return scoreVendors(providers as Parameters<typeof scoreVendors>[0], savedAnswers)
  }, [providers, savedAnswers])

  const scoreMap = useMemo(() => {
    return new Map(vendorScores.map(v => [v.identifier, v]))
  }, [vendorScores])

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
    if (next.has(id)) next.delete(id)
    else next.add(id)
    updateParams({ hiddenRows: next })
  }

  const trackVendorClick = (identifier: string) => {
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Vendor Click', { props: { vendor: identifier, benchmark: 'iam' } })
    )
  }

  const toggleFeature = (featureId: string) => {
    const next = new Set(selectedFeatures)
    if (next.has(featureId)) next.delete(featureId)
    else next.add(featureId)
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Feature Filter', { props: { feature: featureId, action: next.has(featureId) ? 'add' : 'remove', benchmark: 'iam' } })
    )
    updateParams({ features: next })
  }

  const openWizard = () => {
    setDraftAnswers(savedAnswers ?? {})
    setWizardStep(0)
    setWizardOpen(true)
  }

  const setDraftAnswer = (questionId: string, value: string | number) => {
    const key = ANSWER_KEY_MAP[questionId]
    if (!key) return
    const step = STEPS.find(s => s.questions.some(q => q.questionId === questionId))
    const question = step?.questions.find(q => q.questionId === questionId)
    if (!question) return

    setDraftAnswers(prev => {
      if (questionId === 'q_mau' && typeof value === 'number') {
        let bucket: SurveyAnswers['mau'] = '<1k'
        if (value >= 1000000) bucket = '1m+'
        else if (value >= 100000) bucket = '100k-1m'
        else if (value >= 10000) bucket = '10k-100k'
        else if (value >= 1000) bucket = '1k-10k'
        return { ...prev, mau: bucket, mauCount: value }
      }

      if (question.inputType === 'single_select') {
        return { ...prev, [key]: value as string }
      }
      const current = (prev[key] as string[] | undefined) ?? []
      const next = current.includes(value as string)
        ? current.filter(v => v !== (value as string))
        : [...current, value as string]
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

  const isQuestionAnswered = (questionId: string): boolean => {
    const key = ANSWER_KEY_MAP[questionId]
    if (!key) return true
    if (questionId === 'q_mau') return draftAnswers.mauCount !== undefined
    const val = draftAnswers[key]
    if (Array.isArray(val)) return val.length > 0
    return val !== undefined && val !== null
  }

  const isStepAnswered = (): boolean => {
    const step = STEPS[wizardStep]
    return step.questions.every(q => isQuestionAnswered(q.questionId))
  }

  const canAdvance = (): boolean => {
    return true // Allow skipping any step
  }

  const finishSurvey = () => {
    import('@plausible-analytics/tracker').then(({ track }) =>
      track('Benchmark Survey Complete', { props: { benchmark: 'iam' } })
    )

    // Build the set of features to display based on answers
    const nextSelectedFeatures = new Set<string>(COMMON_FEATURES)

    // Add audience-specific features
    if (draftAnswers.audience) {
      if (draftAnswers.audience === 'mixed') {
        Object.values(AUDIENCE_FEATURES).flat().forEach(f => nextSelectedFeatures.add(f))
      } else if (AUDIENCE_FEATURES[draftAnswers.audience]) {
        AUDIENCE_FEATURES[draftAnswers.audience].forEach(f => nextSelectedFeatures.add(f))
      }
    }

    // Add compliance features
    if (draftAnswers.compliance) {
      draftAnswers.compliance.forEach(c => {
        const mapped = COMPLIANCE_MAP[c]
        if (mapped) mapped.forEach(f => nextSelectedFeatures.add(f))
      })
    }

    // Add user-selected capabilities
    if (draftAnswers.features) {
      draftAnswers.features.forEach(feat => {
        const mapped = FEATURE_MAP[feat]
        if (mapped) mapped.forEach(f => nextSelectedFeatures.add(f))
      })
    }

    updateParams({
      features: nextSelectedFeatures,
      extra: { answers: encodeAnswers(draftAnswers) }
    })
    setWizardOpen(false)
  }

  const recommendedVendors = useMemo(
    () => vendorScores.filter(v => v.recommended).slice(0, 3),
    [vendorScores],
  )

  return (
    <>
      <Dialog open={wizardOpen} onOpenChange={(open) => {
        if (!open && savedAnswers) setWizardOpen(false)
        else if (!open && !savedAnswers) setWizardOpen(false)
        else setWizardOpen(open)
      }}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{survey.title}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-500 -mt-2">{survey.description}</p>

          <div className="flex gap-1">
            {STEPS.map((step, i) => (
              <div
                key={step.stepId}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i === wizardStep
                  ? 'bg-slate-900'
                  : i < wizardStep
                    ? 'bg-slate-400'
                    : 'bg-slate-200'
                  }`}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col py-4 overflow-hidden">
            <h3 className="font-semibold text-slate-900 mb-0.5">{STEPS[wizardStep].title}</h3>
            {STEPS[wizardStep].subtitle && (
              <p className="text-xs text-slate-500 mb-4">{STEPS[wizardStep].subtitle}</p>
            )}

            <div className="flex-1 overflow-y-auto pr-2">
              {STEPS[wizardStep].questions.map(question => (
                <div key={question.questionId} className="flex flex-col gap-2">
                  {question.questionId === 'q_mau' ? (
                    <div className="flex flex-col gap-8 py-8 px-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-slate-900 tabular-nums">
                          {(draftAnswers.mauCount || 1000).toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-slate-500 text-center uppercase tracking-wider">
                          Monthly Active Users
                        </span>
                      </div>

                      <div className="relative pt-6 pb-2">
                        <input
                          type="range"
                          min="0"
                          max="1000000"
                          step="1000"
                          value={draftAnswers.mauCount || 1000}
                          onChange={(e) => setDraftAnswer('q_mau', parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span>0</span>
                          <span>250k</span>
                          <span>500k</span>
                          <span>750k</span>
                          <span>1M+</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 text-center italic">
                        Scale significantly affects platform choice and pricing models.
                      </p>
                    </div>
                  ) : (
                    <>
                      {question.inputType === 'single_select' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options?.map(option => {
                            const selected = isDraftAnswerSelected(question.questionId, option.value)
                            return (
                              <button
                                key={option.value}
                                onClick={() => setDraftAnswer(question.questionId, option.value)}
                                className={`flex flex-col items-start text-left px-4 py-3 rounded-lg border transition-all ${selected
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
                        </div>
                      )}

                      {question.inputType === 'multi_select' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options?.map(option => {
                            const selected = isDraftAnswerSelected(question.questionId, option.value)
                            return (
                              <label
                                key={option.value}
                                className={`flex items-start gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${selected
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
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-auto">
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
                variant={isStepAnswered() ? 'default' : 'outline'}
                onClick={() => setWizardStep(s => s + 1)}
              >
                {isStepAnswered() ? 'Next' : 'Skip'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={finishSurvey} variant={isStepAnswered() ? 'default' : 'outline'}>
                {isStepAnswered() ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    See recommendations
                  </>
                ) : 'Skip to results'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
                  className={`relative flex flex-col gap-3 rounded-xl border p-4 ${rank === 0 ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'
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
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`${providerDetailUrlPrefix}/${provider.identifier}`}
                          onClick={() => trackVendorClick(provider.identifier)}
                          className="text-sm font-semibold text-slate-900 hover:underline"
                        >
                          {provider.name}
                        </Link>
                        {provider.nationality && (
                          <span title={provider.nationality} className="text-xs grayscale-[0.5] hover:grayscale-0 transition-all cursor-help">
                            {getCountryFlag(provider.nationality)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{provider.license}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all"
                        style={{ width: `${vs.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">{vs.score}%</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-y border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Monthly Cost</span>
                    <span className="text-xs font-bold text-slate-900">
                      {vs.estimatedPrice === 'Free' ? (
                        <span className="text-lime-600">Free</span>
                      ) : vs.estimatedPrice === 'Custom' ? (
                        'Custom'
                      ) : vs.estimatedPrice !== undefined ? (
                        `$${vs.estimatedPrice.toLocaleString()}`
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>

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
              onClick={() => updateParams({ features: new Set(), hiddenRows: new Set() })}
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

      <div className="w-full overflow-x-auto overflow-y-clip">
        <div
          className="grid gap-x-1"
          style={{ gridTemplateColumns: `280px repeat(${sortedProviders.length}, minmax(124px, 1fr))` }}
        >
          <div className="sticky top-0 left-0 z-30 bg-white" />

          {sortedProviders.map(provider => {
            const inTable = tableProviderIds.includes(provider.identifier)
            const vs = scoreMap.get(provider.identifier)
            return (
              <div key={provider.identifier} className="sticky top-0 z-20 bg-white pt-2 pb-1 group/col relative">
                <div
                  className={`flex flex-col items-center justify-between rounded-md px-3 py-2 gap-1 border transition-all ${inTable
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
                  <div className="flex items-center gap-1 w-full justify-center">
                    <Link
                      href={`${providerDetailUrlPrefix}/${provider.identifier}`}
                      onClick={() => trackVendorClick(provider.identifier)}
                      className="text-sm text-center text-slate-900 truncate hover:underline"
                    >
                      {provider.name}
                    </Link>
                    {provider.nationality && (
                      <span title={provider.nationality} className="text-xs grayscale-[0.5] hover:grayscale-0 transition-all cursor-help">
                        {getCountryFlag(provider.nationality)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{provider.license}</span>

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

            <PricingRows providers={sortedProviders} dimmedProviders={dimmedProviders} />

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
