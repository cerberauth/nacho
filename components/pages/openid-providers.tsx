import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { getFeaturesCategories } from '@/data/openid/providers'
import { ProviderInaccuracyWarning } from '@/components/inaccuracy-warning'
import { ProvidersInteractiveView } from '@/components/providers-interactive-view'
import { getProviders } from '@/lib/providers'
import { getTableCells } from '@/app/openid/providers/get-table-cells'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'

const allProviders = getProviders()

export async function generateOpenIDProvidersMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.openidProviders.title,
    description: dict.openidProviders.description,
    alternates: {
      canonical: makeCanonical(lang, '/openid/providers'),
      languages: makeLanguageAlternates('/openid/providers'),
    },
  }
}

export async function OpenIDProvidersPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)
  const t = dict.openidProviders

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
          {t.lookingForIAM}{' '}
          <Link href={langUrl(lang, '/iam/providers')} className="text-primary hover:underline">
            {t.checkIAM}
          </Link>
          .
        </p>
        <ProviderInaccuracyWarning dict={dict.inaccuracyWarning} />
      </div>

      <Suspense>
        <ProvidersInteractiveView
          providers={allProviders}
          allCategories={allCategories}
          featuresCategories={categoriesData}
          providerDetailUrlPrefix={langUrl(lang, '/openid/providers')}
        />
      </Suspense>
    </main>
  )
}
