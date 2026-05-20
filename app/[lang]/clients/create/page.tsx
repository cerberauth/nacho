import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, type Locale } from '@/lib/dictionaries'
import { generateClientsCreateMetadata, ClientsCreatePage } from '@/components/pages/clients-create'

type Props = { params: Promise<{ lang: string }> }

export const dynamic = 'force-static'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return generateClientsCreateMetadata(lang as Locale)
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <ClientsCreatePage lang={lang as Locale} />
}
