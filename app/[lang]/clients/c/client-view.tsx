'use client'

import Link from 'next/link'

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { applicationTypeName, grantTypeName, tokenAuthenticationMethodLabel } from '@/lib/getters'
import type { Dictionary } from '@/lib/dictionaries'

const createShareableLink = (medium: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'cerberauth')
  url.searchParams.set('utm_medium', medium)
  return url.toString()
}

const onClipboardCopy = (data: string) => {
  navigator.clipboard.writeText(data)
}

export type ClientViewProps = {
  client: OAuth2Client
  dict: Dictionary['clientView']
}

export function ClientView({ client, dict }: ClientViewProps) {
  const shareByLink = () => {
    onClipboardCopy(createShareableLink('clipboard').toString())
  }

  if (!client) {
    return <Skeleton className="h-12" />
  }

  const shareByEmail = () => {
    const url = createShareableLink('email')
    const message = `mailto:?subject=${encodeURIComponent(dict.emailSubject)}&body=${encodeURIComponent(`${dict.emailBody} ${url}`)}`
    window.open(message)
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">{client.name} {dict.client}</h1>
      </div>

      <Card>
        <CardHeader title="Client Information">
          <CardTitle>{client.name} {dict.client}</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3">
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {dict.applicationType}
              </span>
              <span>{applicationTypeName(client.applicationType as ApplicationType)}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {dict.grantTypes}
              </span>
              <span>{client.grantTypes.map(type => grantTypeName(type as GrantType)).join(', ')}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {dict.tokenEndpointAuthMethod}
              </span>
              <span>{tokenAuthenticationMethodLabel(client.tokenEndpointAuthMethod)}</span>
            </li>
          </ul>

          <Separator className="my-2" />

          <div className="font-semibold">{dict.application}</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {dict.clientName}
              </span>
              <span>{client.name}</span>
            </li>

            <li className="flex justify-between">
              <span className="text-muted-foreground">
                {dict.redirectUris}
              </span>
              <ul className="text-right space-y-2">
                {client.redirectUris.map(uri => (
                  <li key={uri}>{uri}</li>
                ))}
              </ul>
            </li>

            <li className="flex justify-between">
              <span className="text-muted-foreground">
                {dict.scopes}
              </span>
              <span>{client.scopes.join(' ')}</span>
            </li>

            {Array.isArray(client.audiences) && client.audiences.length > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">
                  {dict.audiences}
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
                  {dict.allowedOrigins}
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
                  {dict.postLogoutRedirectUris}
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

              <div className="font-semibold">{dict.uiLegal}</div>
              <ul className="grid gap-3">
                {client.uri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {dict.uri}
                    </span>
                    <Link href={client.uri} target="_blank" rel="nofollow noopener noreferrer ugc">{client.uri}</Link>
                  </li>
                )}

                {client.logoUri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {dict.logoUri}
                    </span>
                    <span>{client.logoUri}</span>
                  </li>
                )}

                {client.policyUri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {dict.policyUri}
                    </span>
                    <Link href={client.policyUri} target="_blank" rel="nofollow noopener noreferrer ugc">{client.policyUri}</Link>
                  </li>
                )}

                {client.tosUri && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {dict.tosUri}
                    </span>
                    <Link href={client.tosUri} target="_blank" rel="nofollow noopener noreferrer ugc">{client.tosUri}</Link>
                  </li>
                )}
              </ul>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button className="active:bg-secondary/50 plausible-event-name=Client+URL+Clipboard+Copy" variant="outline" onClick={shareByLink}>{dict.copyLink}</Button>
          <Button className="plausible-event-name=Client+Email+Share" onClick={shareByEmail}>{dict.shareByEmail}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader title="Test Client">
          <CardTitle>{dict.developerTitle}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            {dict.developerDescription}
          </p>
        </CardContent>

        <CardFooter className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="plausible-event-name=Create+TestId+Client">{dict.createTestClient}</Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{dict.testClientDialogTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {dict.testClientDialogDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{dict.continue}</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  )
}
