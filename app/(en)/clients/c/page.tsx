import { Suspense } from 'react'

import { getDictionary } from '@/lib/dictionaries'
import { SearchParamsContainer } from '@/app/[lang]/clients/c/container'

export default async function ClientPage() {
  const dict = await getDictionary('en')

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Suspense fallback={<div>{dict.createClient.loading}</div>}>
        <SearchParamsContainer dict={dict.clientView} />
      </Suspense>
    </main>
  )
}
