import type { Metadata } from 'next'

import { generateIAMProvidersMetadata, IAMProvidersPage } from '@/components/pages/iam-providers'

export const generateMetadata = (): Promise<Metadata> => generateIAMProvidersMetadata('en')

export default function Page() {
  return <IAMProvidersPage lang="en" />
}
