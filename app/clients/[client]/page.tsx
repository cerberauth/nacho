'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipboardIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useSession, signIn } from 'next-auth/react'
import { usePlausible } from 'next-plausible'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { applicationTypeName, grantTypeName, tokenAuthenticationMethodLabel } from '@/lib/getters'
import { getClientById, saveClient } from '@/lib/clients'
import { urlDecode, urlEncode } from '@/lib/url'

const issuer = 'https://testid.cerberauth.com'
const testIdOIDCDiscoveryEndpoint = `${issuer}/.well-known/openid-configuration`

const createShareableLink = (medium: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'cerberauth')
  url.searchParams.set('utm_medium', medium)
  return url.toString()
}

const createClient = async (client: OAuth2Client): Promise<TestIdClient> => {
  const response = await fetch('/api/testid/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  })
  if (!response.ok) {
    throw new Error(`Failed to create client: ${response.statusText}`)
  }
  return response.json()
}

const onClipboardCopy = (data: string) => {
  navigator.clipboard.writeText(data)
}

export const runtime = 'edge'
export const dynamic = 'force-static'
export const dynamicParams = false

export default function ClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session = useSession()
  const plausible = usePlausible()
  const { client: clientEncodedParam } = useParams<{ client: string }>()
  const [client, setClient] = useState<OAuth2Client | undefined>()
  const [testIdClient, setTestIdClient] = useState<TestIdClient | undefined>()
  const tokenAuthenticationMethod = useMemo<TokenEndpointAuthMethod>(() => Array.isArray(client?.tokenEndpointAuthMethod) ? client?.tokenEndpointAuthMethod[0] : client?.tokenEndpointAuthMethod, [client])
  const url = useMemo(() => `/clients/${clientEncodedParam}`, [clientEncodedParam])

  const createTestIdClient = useCallback(async () => {
    if (!client || testIdClient) {
      return
    }

    plausible('Create TestId Client', {
      props: {
        applicationType: client.applicationType,
        tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
        grantTypes: client.grantTypes,
      }
    })
    if (session.status === 'unauthenticated') {
      const callbackUrl = new URL(window.location.href)
      callbackUrl.searchParams.set('test_id_client', 'created')

      signIn('cerberauth', { callbackUrl: callbackUrl.toString() })
      return
    }

    const newTestIdClient = await createClient({
      ...client,
      tokenEndpointAuthMethod: tokenAuthenticationMethod,
    })
    setTestIdClient(newTestIdClient)
    saveClient({
      client,
      testIdClient: newTestIdClient,
      url,
    })
  }, [url, client, tokenAuthenticationMethod, testIdClient, session, plausible])

  const shareByLink = useCallback(() => {
    plausible('Client URL Clipboard Copy', { props: {} })
    const url = createShareableLink('clipboard')
    onClipboardCopy(url.toString())
  }, [plausible])

  const shareByEmail = useCallback(() => {
    plausible('Client Email Share', { props: {} })
    const url = createShareableLink('email')
    const message = `mailto:?subject=${encodeURIComponent('New Client Request')}&body=${encodeURIComponent(`Please we would need you to create a new OAuth2 client. You can check the following link for all the client details: ${url}`)}`
    window.open(message)
  }, [plausible])

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
        setTestIdClient(client.testIdClient)
      })
  }, [router, url, clientEncodedParam])

  useEffect(() => {
    if (!(client && searchParams.has('test_id_client'))) {
      return
    }

    createTestIdClient()
  }, [client, searchParams, createTestIdClient])

  if (!client) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">{client.name} Client</h1>
      </div>

      {testIdClient ? (
        <Card>
          <CardHeader title="Test Client">
            <CardTitle>Temporary Client</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              A temporary client has been created for you to perform tests. This client will be available for a limited time and will be deleted automatically.
            </p>

            <Separator className="my-4" />

            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  OpenID Connect Configuration
                </span>
                <div className="space-x-2">
                  <Link href={testIdOIDCDiscoveryEndpoint} target="_blank" className="text-sm">{testIdOIDCDiscoveryEndpoint}</Link>
                  <Button variant="outline" size="sm" onClick={() => onClipboardCopy(testIdOIDCDiscoveryEndpoint)}>
                    <ClipboardIcon className="w-3 h-3" />
                  </Button>
                </div>
              </li>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Issuer
                </span>
                <div className="space-x-2">
                  <span className="text-sm">{issuer}</span>
                  <Button className="active:bg-primary/80" variant="outline" size="sm" onClick={() => onClipboardCopy(issuer)}>
                    <ClipboardIcon className="w-3 h-3" />
                  </Button>
                </div>
              </li>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Client ID
                </span>
                <div className="space-x-2">
                  <span className="text-sm">{testIdClient.clientId}</span>
                  <Button className="active:bg-primary/80" variant="outline" size="sm" onClick={() => onClipboardCopy(testIdClient.clientId)}>
                    <ClipboardIcon className="w-3 h-3" />
                  </Button>
                </div>
              </li>

              {testIdClient.clientSecret && (
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Client Secret
                  </span>
                  <div className="space-x-2">
                    <span className="text-sm">{testIdClient.clientSecret}</span>
                    <Button className="active:bg-primary/80" variant="outline" size="sm" onClick={() => onClipboardCopy(testIdClient.clientSecret)}>
                      <ClipboardIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Test Client">
            <CardTitle>Create a temporary Client</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              This will allow you to test the integration in your application while waiting for your real client to be created.
            </p>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button onClick={createTestIdClient}>Create a Test Client</Button>
          </CardFooter>
        </Card>
      )}

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
              <span>{tokenAuthenticationMethodLabel(tokenAuthenticationMethod)}</span>
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
          <Button className="active:bg-secondary/50" variant="outline" onClick={shareByLink}>Copy Link</Button>
          <Button onClick={shareByEmail}>Share by Email</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
