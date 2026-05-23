import type { Metadata } from 'next'

import { generateClientsMetadata, ClientsPage } from '@/components/pages/clients'

export const generateMetadata = (): Promise<Metadata> => generateClientsMetadata('en')

export default function Page() {
  return <ClientsPage lang="en" />
}
