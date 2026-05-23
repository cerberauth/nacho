import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, locales, type Locale } from '@/lib/dictionaries'
import { templates } from '@/data/templates'
import { generateTemplateDetailMetadata, TemplateDetailPage } from '@/components/pages/templates-detail'

type Props = { params: Promise<{ lang: string; template: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return locales
    .filter((l) => l !== 'en')
    .flatMap((lang) => templates.map((t) => ({ lang, template: t.identifier })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, template: templateParam } = await params
  if (!hasLocale(lang)) return {}
  return generateTemplateDetailMetadata(lang as Locale, templateParam)
}

export default async function Page({ params }: Props) {
  const { lang, template: templateParam } = await params
  if (!hasLocale(lang)) notFound()
  return <TemplateDetailPage lang={lang as Locale} templateParam={templateParam} />
}
