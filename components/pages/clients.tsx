import type { Metadata } from 'next'

import { getDictionary, type Locale } from '@/lib/dictionaries'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import { DataTable } from '@/app/[lang]/clients/data-table'

export async function generateClientsMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.clients.recentlyViewed,
    description: dict.clients.metaDescription,
    alternates: {
      canonical: makeCanonical(lang, '/clients'),
      languages: makeLanguageAlternates('/clients'),
    },
  }
}

export async function ClientsPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">
          {dict.clients.recentlyViewed}
        </h1>
      </div>

      <div className="py-8">
        <DataTable dict={dict.clients} />
      </div>
    </main>
  )
}
