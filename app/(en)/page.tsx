import type { Metadata } from 'next'

import { generateHomeMetadata, HomePage } from '@/components/pages/home'

export const generateMetadata = (): Promise<Metadata> => generateHomeMetadata('en')

export default function Page() {
  return <HomePage lang="en" />
}
