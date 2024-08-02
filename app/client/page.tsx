'use client'

import { useCallback, useEffect, useState } from 'react'
import { ClipboardIcon } from 'lucide-react'
import { useSession, signIn } from 'next-auth/react'
import { usePlausible } from 'next-plausible'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { urlDecode } from '@/lib/url'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { applicationTypeName, grantTypeName, tokenAuthenticationMethod } from '@/lib/getters'
import { ApplicationType, GrantType, TokenEndpointAuthMethod } from '@/lib/consts'
import { Table, TableBody, TableHeader } from '@/components/ui/table'

export const runtime = 'edge'
export const dynamic = 'force-static'
export const dynamicParams = false

const localStorageItem = () => 'nacho:clients'

const createShareableLink = (medium: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'cerberauth')
  url.searchParams.set('utm_medium', medium)
  return url.toString()
}

const createClient = async (client: OAuthClient) => {
  const response = await fetch('/api/testid/client', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  })
  if (!response.ok) {
    throw new Error(`Failed to create client: ${response.statusText}`)
  }
  return response.json<TestIdClient>()
}

export default function ClientPage() {
  const [client, setClient] = useState<OAuthClient | null>(null)
  const { client: clientEncodedParam } = useParams<{ client: string }>()

  useEffect(() => {
    urlDecode(clientEncodedParam).then((data) => setClient(data))
  }, [clientEncodedParam])

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">
          Recently Viewed Clients
        </h1>
      </div>

      <div className="py-8">

      </div>
    </main>
  )
}
