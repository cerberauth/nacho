import { FeatureStatus } from '@/lib/types'

type ProviderLike = {
  identifier: string
  nationality?: string
  featureList: Array<{ identifier: string; status: string }>
}

export function createProviderListHelpers<T extends ProviderLike>(providers: T[]) {
  const getAll = () => {
    return [...providers].sort((a, b) => {
      const countSupported = (p: T) =>
        p.featureList.filter((f) => f.status === FeatureStatus.Supported).length
      return countSupported(b) - countSupported(a)
    })
  }

  const getByNationalities = (nationalities: string[]) => {
    return getAll().filter(
      (p) => p.nationality && nationalities.includes(p.nationality)
    )
  }

  const getById = (id: string) => {
    return getAll().find((p) => p.identifier === id)
  }

  const getFeature = (providerId: string, featureId: string) => {
    return getById(providerId)?.featureList.find((f) => f.identifier === featureId)
  }

  const getVsPairs = () => {
    const list = getAll()
    const pairs: { a: T; b: T }[] = []
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        pairs.push({ a: list[i], b: list[j] })
      }
    }
    return pairs
  }

  const getVsOrder = (idA: string, idB: string): [string, string] | null => {
    const list = getAll()
    const indexA = list.findIndex((p) => p.identifier === idA)
    const indexB = list.findIndex((p) => p.identifier === idB)
    if (indexA === -1 || indexB === -1 || indexA === indexB) {
      return null
    }
    return indexA < indexB ? [idA, idB] : [idB, idA]
  }

  return { getAll, getByNationalities, getById, getFeature, getVsPairs, getVsOrder }
}
