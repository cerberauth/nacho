import type { Metadata } from 'next'

import { generateGrantTypesMetadata, GrantTypesPage } from '@/components/pages/grant-types'

export const generateMetadata = (): Promise<Metadata> => generateGrantTypesMetadata('en')

export default function Page() {
  return <GrantTypesPage lang="en" />
}
