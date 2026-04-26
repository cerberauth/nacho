import { useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useBenchmarkParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  const updateParams = useCallback(
    (paramsToUpdate: {
      features?: Set<string>
      hiddenProviders?: Set<string>
      hiddenRows?: Set<string>
      extra?: Record<string, string | null>
    }) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (paramsToUpdate.features !== undefined) {
        if (paramsToUpdate.features.size > 0) {
          params.set('features', Array.from(paramsToUpdate.features).join(','))
        } else {
          params.delete('features')
        }
      }

      if (paramsToUpdate.hiddenProviders !== undefined) {
        if (paramsToUpdate.hiddenProviders.size > 0) {
          params.set('excluded_providers', Array.from(paramsToUpdate.hiddenProviders).join(','))
        } else {
          params.delete('excluded_providers')
        }
      }

      if (paramsToUpdate.hiddenRows !== undefined) {
        if (paramsToUpdate.hiddenRows.size > 0) {
          params.set('excluded_features', Array.from(paramsToUpdate.hiddenRows).join(','))
        } else {
          params.delete('excluded_features')
        }
      }

      if (paramsToUpdate.extra) {
        Object.entries(paramsToUpdate.extra).forEach(([key, value]) => {
          if (value === null) {
            params.delete(key)
          } else {
            params.set(key, value)
          }
        })
      }

      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  return {
    selectedFeatures,
    hiddenProviders,
    hiddenRows,
    updateParams,
    searchParams,
  }
}
