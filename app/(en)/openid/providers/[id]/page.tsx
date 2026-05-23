import type { Metadata } from 'next'

import { getProviders } from '@/lib/providers'
import { generateOpenIDProviderDetailMetadata, OpenIDProviderDetailPage } from '@/components/pages/openid-providers-detail'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getProviders().map((p) => ({ id: p.identifier }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return generateOpenIDProviderDetailMetadata('en', id)
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <OpenIDProviderDetailPage lang="en" id={id} />
}
