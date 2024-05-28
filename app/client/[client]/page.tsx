'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { urlDecode } from '@/lib/url'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { applicationTypeName, grantTypeName, tokenAuthenticationMethod } from '@/lib/getters'
import { ApplicationType, GrantType, TokenEndpointAuthMethod } from '@/lib/consts'

export const dynamic = 'force-static'
export const dynamicParams = false

export default function ClientPage() {
  const [client, setClient] = useState<OAuthClient | null>(null)
  const { client: clientEncodedParam } = useParams<{ client: string }>()

  useEffect(() => {
    urlDecode(clientEncodedParam).then((data) => setClient(data))
  }, [clientEncodedParam])

  if (!client) {
    return <div>Loading...</div>
  }

  const onClipboardCopy = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('client', clientEncodedParam)
    navigator.clipboard.writeText(url.toString())
  }

  const shareByEmail = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('client', clientEncodedParam)
    const message = `mailto:?subject=${encodeURIComponent('New Client Request')}&body=${encodeURIComponent(`Please we would need you to create a new OAuth2 client. You can check the following link for all the client details: ${window.location.href}`)}`
    window.open(message)
    console.log(message)
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2">Client Details</h1>
        <p className="text-sm text-muted-foreground">
          Check one last time before you submit it for review and creation.
        </p>
      </div>

      <Card>
        <CardHeader title="Client Information">
          <CardTitle>{client.name} Client</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3">
          <div className="font-semibold">Implementation Recommendations</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Application Type
              </span>
              <span>{applicationTypeName(client.applicationType as ApplicationType)}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Grant Types
              </span>
              <span>{client.grantTypes.map(type => grantTypeName(type as GrantType)).join(', ')}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Token Endpoint Authentication Method
              </span>
              <span>{client.tokenEndpointAuthMethod.map(method => tokenAuthenticationMethod(method as TokenEndpointAuthMethod)).join(', ')}</span>
            </li>
          </ul>

          <Separator className="my-2" />

          <div className="font-semibold">Application</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Client Name
              </span>
              <span>{client.name}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Redirect URIs
              </span>
              <span>{client.redirectUris.join(', ')}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Scopes
              </span>
              <span>{client.scopes.join(', ')}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Audiences
              </span>
              <span>{client.audiences.join(', ')}</span>
            </li>

            {client.allowedCorsOrigins.length > 0 && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Allowed Origins
                </span>
                <span>{client.allowedCorsOrigins.join(', ')}</span>
              </li>
            )}

            {client.frontChannelLogoutUri && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Front Channel Logout URI
                </span>
                <span>{client.frontChannelLogoutUri}</span>
              </li>
            )}
          </ul>

          <Separator className="my-2" />

          <div className="font-semibold">UI & Legal</div>
          <ul className="grid gap-3">
            {client.uri && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  URI
                </span>
                <span>{client.uri}</span>
              </li>
            )}

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Logo URI
              </span>
              <span>{client.logoUri}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Policy URI
              </span>
              <span>{client.policyUri}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Terms of Service URI
              </span>
              <span>{client.tosUri}</span>
            </li>
          </ul>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClipboardCopy}>Copy Link</Button>
          <Button onClick={shareByEmail}>Share by Email</Button>
        </CardFooter>
      </Card>
    </main >
  )
}
