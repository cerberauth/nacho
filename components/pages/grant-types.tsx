import type { Metadata } from 'next'

import { getDictionary, type Locale } from '@/lib/dictionaries'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import { GrantTypesView } from '@/app/[lang]/grant-types/grant-types-view'

export async function generateGrantTypesMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.grantTypes.pageTitle,
    description: dict.grantTypes.metaDescription,
    alternates: {
      canonical: makeCanonical(lang, '/grant-types'),
      languages: makeLanguageAlternates('/grant-types'),
    },
  }
}

export async function GrantTypesPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)
  return <GrantTypesView dict={dict.grantTypes} />
}
