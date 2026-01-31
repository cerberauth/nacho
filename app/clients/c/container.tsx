'use client'

import { saveClient, getClientById } from '@/lib/clients'
import { urlDecode, clientClientURLByEncodedClient } from '@/lib/url'

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
    urlDecode(encodedClient).then((decodedClient) => {
      setClient(decodedClient)

      // Save to localStorage if not already saved
      if (!getClientById(decodedClient.id)) {
        const url = clientClientURLByEncodedClient(encodedClient)
        saveClient({ client: decodedClient, url })
      }
    })
  }, [encodedClient])
  if (!client) {
    return null
  }

  return <ClientView client={client} />
}
