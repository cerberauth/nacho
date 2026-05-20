import type { Metadata } from 'next'

import { generateClientsCreateMetadata, ClientsCreatePage } from '@/components/pages/clients-create'

export const dynamic = 'force-static'

export const generateMetadata = (): Promise<Metadata> => generateClientsCreateMetadata('en')

export default function Page() {
  return <ClientsCreatePage lang="en" />
}
