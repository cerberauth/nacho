import type { Metadata } from 'next'
import { Suspense } from 'react'

import { getDictionary, type Locale } from '@/lib/dictionaries'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import { CreateClientContainer } from '@/app/[lang]/clients/create/create-client'

export async function generateClientsCreateMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.createClient.title,
    description: dict.createClient.metaDescription,
    alternates: {
      canonical: makeCanonical(lang, '/clients/create'),
      languages: makeLanguageAlternates('/clients/create'),
    },
  }
}

export async function ClientsCreatePage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <Suspense fallback={<div className="container mx-auto max-w-4xl px-4 py-12">{dict.createClient.loading}</div>}>
      <CreateClientContainer dict={dict.createClient} lang={lang} />
    </Suspense>
  )
}
