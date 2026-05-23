import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, locales } from '@/lib/dictionaries'
import useCasesJson from '@/data/mdx/use-cases.json'
import { generateUseCaseDetailMetadata, UseCaseDetailPage } from '@/components/pages/use-cases-detail'

type Props = { params: Promise<{ lang: string; slug: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return locales
    .filter((l) => l !== 'en')
    .flatMap((lang) => useCasesJson.map((u) => ({ lang, slug: u.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  return generateUseCaseDetailMetadata(lang, slug)
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  return <UseCaseDetailPage lang={lang} slug={slug} />
}
