'use client'

import { urlDecode } from '@/lib/url'

import { ClientView } from './client-view'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SearchParamsContainer() {
  const searchParams = useSearchParams()
  const encodedClient = searchParams.get('client')
  if (!encodedClient) {
    return null
  }

  return <ClientContainer encodedClient={encodedClient} />
}

function ClientContainer({ encodedClient }: { encodedClient: string }) {
  const [client, setClient] = useState<OAuth2Client | undefined>()
  useEffect(() => {
    urlDecode(encodedClient).then(setClient)
  }, [encodedClient])
  if (!client) {
    return null
  }

  return <ClientView client={client} />
}
