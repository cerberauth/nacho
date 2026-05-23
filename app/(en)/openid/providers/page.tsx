import type { Metadata } from 'next'

import { generateOpenIDProvidersMetadata, OpenIDProvidersPage } from '@/components/pages/openid-providers'

export const generateMetadata = (): Promise<Metadata> => generateOpenIDProvidersMetadata('en')

export default function Page() {
  return <OpenIDProvidersPage lang="en" />
}
