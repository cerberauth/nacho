import type { Metadata } from 'next'

import { getProviderVsPairs } from '@/lib/providers'
import { generateOpenIDProviderVsMetadata, OpenIDProviderVsPage } from '@/components/pages/openid-providers-vs'

type Props = { params: Promise<{ id: string; otherId: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getProviderVsPairs().map((pair) => ({ id: pair.a.identifier, otherId: pair.b.identifier }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, otherId } = await params
  return generateOpenIDProviderVsMetadata('en', id, otherId)
}

export default async function Page({ params }: Props) {
  const { id, otherId } = await params
  return <OpenIDProviderVsPage lang="en" aId={id} bId={otherId} />
}
