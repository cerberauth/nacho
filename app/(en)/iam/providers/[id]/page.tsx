import type { Metadata } from 'next'

import { getIAMProviders } from '@/lib/iam-providers'
import { generateIAMProviderDetailMetadata, IAMProviderDetailPage } from '@/components/pages/iam-providers-detail'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getIAMProviders().map((p) => ({ id: p.identifier }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return generateIAMProviderDetailMetadata('en', id)
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <IAMProviderDetailPage lang="en" id={id} />
}
