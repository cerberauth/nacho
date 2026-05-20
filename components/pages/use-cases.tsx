import Link from 'next/link'
import type { Metadata } from 'next'

import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import useCasesJson from '@/data/mdx/use-cases.json'

export async function generateUseCasesMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.useCases.title,
    description: dict.useCases.description,
    alternates: {
      canonical: makeCanonical(lang, '/use-cases'),
      languages: makeLanguageAlternates('/use-cases'),
    },
  }
}

export async function UseCasesPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <main className="flex flex-col max-w-2xl mx-auto items-center justify-center my-8">
      <h1 className="font-semibold text-4xl mb-8 tracking-tighter">{dict.useCases.title}</h1>

      <div>
        {useCasesJson.map((useCase) => (
          <Link
            key={useCase.slug}
            className="flex flex-col space-y-1 mb-4"
            href={langUrl(lang, `/use-cases/${useCase.slug}`)}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {useCase.metadata.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
