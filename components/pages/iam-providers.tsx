import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { getFeaturesCategories } from '@/data/iam/index'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { getIAMProviders } from '@/lib/iam-providers'
import { getTableCells } from '@/app/iam/providers/get-table-cells'
import { IAMProvidersInteractiveView } from '@/app/iam/providers/providers-interactive-view'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'

const allProviders = getIAMProviders()

export async function generateIAMProvidersMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.iamProviders.title,
    description: dict.iamProviders.description,
    alternates: {
      canonical: makeCanonical(lang, '/iam/providers'),
      languages: makeLanguageAlternates('/iam/providers'),
    },
  }
}

export async function IAMProvidersPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)
  const t = dict.iamProviders

  const categoriesData = getFeaturesCategories(t)
  const allCategories = getTableCells(categoriesData, allProviders.map((p) => p.identifier))

  return (
    <main className="flex flex-col gap-8 py-24 items-center px-4">
      <div className="relative flex flex-col gap-4 max-w-full">
        <h1 className="text-5xl font-semibold leading-none tracking-tight mb-2">
          {t.title}
        </h1>
        <p className="text-md text-slate-600">
          {t.description}
        </p>
        <p className="text-sm text-slate-500">
          {t.lookingForOpenID}{' '}
          <Link href={langUrl(lang, '/openid/providers')} className="text-primary hover:underline">
            {t.checkOpenID}
          </Link>
          .
        </p>
        <ProviderInaccuracyWarning dict={dict.inaccuracyWarning} />
      </div>

      <Suspense>
        <IAMProvidersInteractiveView
          providers={allProviders}
          allCategories={allCategories}
          featuresCategories={categoriesData}
          providerDetailUrlPrefix={langUrl(lang, '/iam/providers')}
          dict={t.survey}
        />
      </Suspense>
    </main>
  )
}
