import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { baseUrl } from '@/app/seo.config'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import useCasesJson from '@/data/mdx/use-cases.json'

export function generateUseCaseDetailMetadata(lang: string, slug: string): Metadata {
  const useCase = useCasesJson.find((u) => u.slug === slug)
  if (!useCase) return {}

  const { title, summary: description } = useCase.metadata
  const ogImage = `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    alternates: {
      canonical: makeCanonical(lang, `/use-cases/${slug}`),
      languages: makeLanguageAlternates(`/use-cases/${slug}`),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: makeCanonical(lang, `/use-cases/${slug}`),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export async function UseCaseDetailPage({ lang, slug }: { lang: string; slug: string }) {
  const useCase = useCasesJson.find((u) => u.slug === slug)
  if (!useCase) notFound()

  const { default: UseCase } = await import(`@/app/use-cases/${slug}.mdx`)

  return (
    <main className="flex flex-col max-w-2xl mx-auto items-center justify-center my-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: useCase.metadata.title,
            description: useCase.metadata.summary,
            image: `/og?title=${encodeURIComponent(useCase.metadata.title)}`,
            url: makeCanonical(lang, `/use-cases/${slug}`),
          }),
        }}
      />
      <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
        <h1 className="title font-semibold text-2xl tracking-tighter">
          {useCase.metadata.title}
        </h1>
        <article className="prose">
          <UseCase />
        </article>
      </div>
    </main>
  )
}
