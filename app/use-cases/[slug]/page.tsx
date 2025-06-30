import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { baseUrl } from '@/app/seo.config'

import { getUseCases } from '../utils'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return getUseCases().map((useCase) => ({
    slug: useCase.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const useCase = getUseCases().find((useCase) => useCase.slug === slug)
  if (!useCase) {
    return
  }

  const {
    title,
    summary: description,
    image,
  } = useCase.metadata
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/use-cases/${useCase.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const useCase = getUseCases().find((useCase) => useCase.slug === slug)
  if (!useCase) {
    notFound()
  }

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
            image: useCase.metadata.image
              ? `${baseUrl}${useCase.metadata.image}`
              : `/og?title=${encodeURIComponent(useCase.metadata.title)}`,
            url: `${baseUrl}/blog/${useCase.slug}`,
          }),
        }}
      />
      <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
        <h1 className="title font-semibold text-2xl tracking-tighter">
          {useCase.metadata.title}
        </h1>
        <article className="prose">
          <CustomMDX source={useCase.content} />
        </article>
      </div>
    </main>
  )
}
