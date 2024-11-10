'use client'

import { useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { applicationTypeName, grantTypeName, tokenAuthenticationMethodLabel } from '@/lib/getters'
import { getClientById, saveClient } from '@/lib/clients'
import { urlDecode, urlEncode } from '@/lib/url'

const createShareableLink = (medium: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'cerberauth')
  url.searchParams.set('utm_medium', medium)
  return url.toString()
}

const onClipboardCopy = (data: string) => {
  navigator.clipboard.writeText(data)
}

export const runtime = 'edge'
export const dynamic = 'force-static'
export const dynamicParams = false

export default function ClientPage() {
  const router = useRouter()
  const { client: clientEncodedParam } = useParams<{ client: string }>()
  const [client, setClient] = useState<OAuth2Client | undefined>()
  const url = useMemo(() => `/clients/${clientEncodedParam}`, [clientEncodedParam])

  const shareByLink = () => {
    const url = createShareableLink('clipboard')
    onClipboardCopy(url.toString())
  }

  const shareByEmail = () => {
    const url = createShareableLink('email')
    const message = `mailto:?subject=${encodeURIComponent('New Client Request')}&body=${encodeURIComponent(`Please we would need you to create a new OAuth2 client. You can check the following link for all the client details: ${url}`)}`
    window.open(message)
  }

  useEffect(() => {
    urlDecode(clientEncodedParam)
      .then(async (data) => {
        if (!data.id) {
          data.id = nanoid()
          const newEncodedParam = await urlEncode(data)
          return router.push(`/clients/${newEncodedParam}`)
        }

        let client = getClientById(data.id)
        if (!client) {
          client = saveClient({
            client: data,
            url,
          })
        }

        setClient(client.client)
      })
  }, [router, url, clientEncodedParam])

  if (!client) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">{client.name} Client</h1>
      </div>

      <Card>
        <CardHeader title="Client Information">
          <CardTitle>{client.name} Client</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3">
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
              <span>{tokenAuthenticationMethodLabel(client.tokenEndpointAuthMethod)}</span>
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

            <li className="flex justify-between">
              <span className="text-muted-foreground">
                Redirect URIs
              </span>
              <ul className="text-right space-y-2">
                {client.redirectUris.map(uri => (
                  <li key={uri}>{uri}</li>
                ))}
              </ul>
            </li>

            <li className="flex justify-between">
              <span className="text-muted-foreground">
                Scopes
              </span>
              <span>{client.scopes.join(' ')}</span>
            </li>

            {Array.isArray(client.audiences) && client.audiences.length > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">
                  Audiences
                </span>
                <ul className="text-right space-y-2">
                  {client.audiences.map(audience => (
                    <li key={audience}>{audience}</li>
                  ))}
                </ul>
              </li>
            )}

            {Array.isArray(client.allowedCorsOrigins) && client.allowedCorsOrigins.length > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">
                  Allowed Origins
                </span>
                <ul className="text-right space-y-2">
                  {client.allowedCorsOrigins.map(allowedCorsOrigin => (
                    <li key={allowedCorsOrigin}>{allowedCorsOrigin}</li>
                  ))}
                </ul>
              </li>
            )}

            {Array.isArray(client.postLogoutRedirectUris) && client.postLogoutRedirectUris.length > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">
                  Post Logout Redirect URIs
                </span>
                <ul className="text-right space-y-2">
                  {client.postLogoutRedirectUris.map(uri => (
                    <li key={uri}>{uri}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>

          {(client.uri || client.logoUri || client.policyUri || client.tosUri) && (
            <>
              <Separator className="my-2" />

              <div className="font-semibold">UI & Legal</div>
              <ul className="grid gap-3">
                {client.uri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      URI
                    </span>
                    <Link href={client.uri} target="_blank" rel="nofollow noopener noreferrer ugc">{client.uri}</Link>
                  </li>
                )}

                {client.logoUri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Logo URI
                    </span>
                    <span>{client.logoUri}</span>
                  </li>
                )}

                {client.policyUri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Policy URI
                    </span>
                    <Link href={client.policyUri} target="_blank" rel="nofollow noopener noreferrer ugc">{client.policyUri}</Link>
                  </li>
                )}

                {client.tosUri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Terms of Service URI
                    </span>
                    <Link href={client.tosUri} target="_blank" rel="nofollow noopener noreferrer ugc">{client.tosUri}</Link>
                  </li>
                )}
              </ul>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button className="active:bg-secondary/50 plausible-event-name=Client+URL+Clipboard+Copy" variant="outline" onClick={shareByLink}>Copy Link</Button>
          <Button className="plausible-event-name=Client+Email+Share" onClick={shareByEmail}>Share by Email</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader title="Test Client">
          <CardTitle>Are you a developer?</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Create the real client can take some time. If you want to test the client right now, you can create a fake test client.
          </p>
        </CardContent>

        <CardFooter className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="plausible-event-name=Create+TestId+Client">Create a Test Client</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create a Test Client</AlertDialogTitle>
                <AlertDialogDescription>
                  This feature is not available yet. We are working on it.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Continue</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </main>
  )
}
