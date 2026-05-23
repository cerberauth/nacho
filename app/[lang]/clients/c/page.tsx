import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getDictionary, hasLocale } from '@/lib/dictionaries'
import { SearchParamsContainer } from './container'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function ClientPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Suspense fallback={<div>{dict.createClient.loading}</div>}>
        <SearchParamsContainer dict={dict.clientView} />
      </Suspense>
    </main>
  )
}
