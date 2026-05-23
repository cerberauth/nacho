'use client'

import { saveClient, getClientById } from '@/lib/clients'
import { urlDecode, clientClientURLByEncodedClient } from '@/lib/url'

import { ClientView } from './client-view'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Dictionary } from '@/lib/dictionaries'

type Props = {
  dict: Dictionary['clientView']
}

export function SearchParamsContainer({ dict }: Props) {
  const searchParams = useSearchParams()
  const encodedClient = searchParams.get('client')
  if (!encodedClient) {
    return null
  }

  return <ClientContainer encodedClient={encodedClient} dict={dict} />
}

function ClientContainer({ encodedClient, dict }: { encodedClient: string; dict: Dictionary['clientView'] }) {
  const [client, setClient] = useState<OAuth2Client | undefined>()
  useEffect(() => {
    urlDecode(encodedClient).then((decodedClient) => {
      setClient(decodedClient)

      if (!getClientById(decodedClient.id)) {
        const url = clientClientURLByEncodedClient(encodedClient)
        saveClient({ client: decodedClient, url })
      }
    })
  }, [encodedClient])
  if (!client) {
    return null
  }

  return <ClientView client={client} dict={dict} />
}
