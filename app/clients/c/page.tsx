import { Suspense } from 'react'
import { SearchParamsContainer } from './container'

type ClientPage = {
  searchParams: Promise<{ client?: string }>
}

export default function ClientPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsContainer />
      </Suspense>
    </main>
  )
}
