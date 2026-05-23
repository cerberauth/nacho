import type { Metadata } from 'next'

import useCasesJson from '@/data/mdx/use-cases.json'
import { generateUseCaseDetailMetadata, UseCaseDetailPage } from '@/components/pages/use-cases-detail'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return useCasesJson.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return generateUseCaseDetailMetadata('en', slug)
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <UseCaseDetailPage lang="en" slug={slug} />
}
