import type { Metadata } from 'next'

import { generateTemplatesMetadata, TemplatesPage } from '@/components/pages/templates'

export const generateMetadata = (): Metadata => generateTemplatesMetadata('en')

export default function Page() {
  return <TemplatesPage lang="en" />
}
