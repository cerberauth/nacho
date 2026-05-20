import type { Metadata } from 'next'

import { generateUseCasesMetadata, UseCasesPage } from '@/components/pages/use-cases'

export const dynamic = 'force-static'

export const generateMetadata = (): Promise<Metadata> => generateUseCasesMetadata('en')

export default function Page() {
  return <UseCasesPage lang="en" />
}
