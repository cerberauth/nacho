import type { Metadata } from 'next'

import { getIAMProviderVsPairs } from '@/lib/iam-providers'
import { generateIAMProviderVsMetadata, IAMProviderVsPage } from '@/components/pages/iam-providers-vs'

type Props = { params: Promise<{ id: string; otherId: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getIAMProviderVsPairs().map((pair) => ({ id: pair.a.identifier, otherId: pair.b.identifier }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, otherId } = await params
  return generateIAMProviderVsMetadata('en', id, otherId)
}

export default async function Page({ params }: Props) {
  const { id, otherId } = await params
  return <IAMProviderVsPage lang="en" aId={id} bId={otherId} />
}
