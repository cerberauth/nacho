import type { Metadata } from 'next'

import { templates } from '@/data/templates'
import { generateTemplateDetailMetadata, TemplateDetailPage } from '@/components/pages/templates-detail'

type Props = { params: Promise<{ template: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return templates.map((t) => ({ template: t.identifier }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { template: templateParam } = await params
  return generateTemplateDetailMetadata('en', templateParam)
}

export default async function Page({ params }: Props) {
  const { template: templateParam } = await params
  return <TemplateDetailPage lang="en" templateParam={templateParam} />
}
