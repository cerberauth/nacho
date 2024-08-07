'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleHelp } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ChooseGrantType } from '@/components/choose-grant-type'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { InputTags } from '@/components/ui/input-tags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { ApplicationType, GrantType, TokenEndpointAuthMethod } from '@/lib/consts'
import { urlEncode } from '@/lib/url'

const localStorageItem = 'client'

const createClientSchema = z.object({
  applicationType: z.enum(Object.values(ApplicationType) as [ApplicationType]),
  grantTypes: z.array(z.enum(Object.values(GrantType) as [GrantType])),
  tokenEndpointAuthMethod: z.array(z.enum(Object.keys(TokenEndpointAuthMethod) as [TokenEndpointAuthMethod])),

  name: z.string(),
  uri: z.string().optional(),
  allowedCorsOrigins: z.array(z.string()).optional(),
  scopes: z.array(z.string()).optional(),
  audiences: z.array(z.string()).optional(),
  redirectUris: z.array(z.string()),
  postLogoutRedirectUris: z.array(z.string()).optional(),

  contacts: z.array(z.string()).optional(),
  policyUri: z.string().optional(),
  tosUri: z.string().optional(),
  logoUri: z.string().optional(),
})

export default function CreateClient() {
  const router = useRouter()
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false)
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
  })
  const data = form.watch()

  useEffect(() => {
    if (hasBeenInitialized) {
      return
    }

    const client = localStorage.getItem(localStorageItem)
    form.reset(client ? JSON.parse(client) : undefined)
    setHasBeenInitialized(true)
  }, [hasBeenInitialized, form])

  useEffect(() => {
    if (!hasBeenInitialized) {
      return
    }

    localStorage.setItem(localStorageItem, JSON.stringify(data))
  }, [hasBeenInitialized, data])

  function onApplicationTypeChange(type: ApplicationType | null) {
    if (type === null) {
      form.resetField('applicationType')
      return
    }

    form.setValue('applicationType', type)
  }

  function onGrantTypeChange(grantTypes: GrantType[]) {
    form.setValue('grantTypes', grantTypes)
  }

  function onTokenEndpointAuthMethodChange(authMethods: TokenEndpointAuthMethod[]) {
    form.setValue('tokenEndpointAuthMethod', authMethods)
  }

  function onSubmit(data: z.infer<typeof createClientSchema>) {
    const client: OAuthClient = {
      ...data,
      id: nanoid(),
      audiences: data.audiences || [],
      scopes: data.scopes || [],
      allowedCorsOrigins: data.allowedCorsOrigins || [],
      postLogoutRedirectUris: data.postLogoutRedirectUris || [],
      grantTypes: data.grantTypes,
      applicationType: ApplicationType[data.applicationType],
      contacts: data.contacts || [],
    }

    urlEncode(client).then(encoded => {
      router.push(`/client/${encoded}`)
      localStorage.removeItem(localStorageItem)
    })
  }

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <main className="container mx-auto max-w-4xl px-4 py-12 pb-28 space-y-4">
            <div>
              <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2">Create your new client</h1>
              <p className="text-sm text-muted-foreground">
                Choose the type of application you are building and the grant type you want to use.
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              <ChooseGrantType
                onApplicationTypeChange={onApplicationTypeChange}
                onGrantTypeChange={onGrantTypeChange}
                onTokenEndpointAuthMethodChange={onTokenEndpointAuthMethodChange}
              />
            </div>

            <Collapsible title="Client details" open={data.grantTypes?.length > 0}>
              <CollapsibleContent className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical details</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Usually your application friendly name. Will be displayed in the authorization page.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="redirectUris"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Redirect URIs <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            List of redirect URIs (comma separated) that your client can redirect to.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    {data.applicationType === ApplicationType.spa && (
                      <FormField
                        control={form.control}
                        name="allowedCorsOrigins"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Allowed CORS Origins
                            </FormLabel>
                            <FormControl>
                              <InputTags {...field} />
                            </FormControl>
                            <FormDescription>
                              List of allowed CORS origins (comma separated) for your JavaScript Application.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="scopes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Scopes
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            List of scopes (comma separated) that your client can request.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="audiences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Audiences
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            List of audiences (comma separated) that your client can request.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postLogoutRedirectUris"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Post Logout Redirect URIs
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            List of post logout redirect URIs (comma separated) that your client can redirect to after logout.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible title="UI & Legal Details">
              <CollapsibleTrigger asChild>
                <Button variant="link" type="button" className="text-sm">UI & Legal Settings</Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>UI & Legal Details</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <FormField
                      control={form.control}
                      name="contacts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Contacts Email
                          </FormLabel>
                          <FormControl>
                            <InputTags type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            List of contacts email (comma separated) for your client.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="uri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Homepage URI
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="policyUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Policy URI
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tosUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Terms of Service URI
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logoUri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Logo URI
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The Logo URI of your application. Will be displayed in the authorization page.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible title="Advanced settings">
              <CollapsibleTrigger asChild>
                <Button variant="link" type="button" className="text-sm">Show advanced settings</Button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <FormField
                      control={form.control}
                      name="grantTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Grant Types <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            The grant types your client can use.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tokenEndpointAuthMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Token Endpoint Auth Method <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            The Token Endpoint Auth Method of your application.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Alert className="my-4">
              <CircleHelp className="w-4 h-4" />
              <AlertTitle>Data Usage</AlertTitle>
              <AlertDescription>
                The data you provide here <b>won&apos;t be send to our servers</b>. Only browser local storage and URL encoding is used to store and share the data.
              </AlertDescription>
            </Alert>
          </main>

          <footer className="fixed bottom-0 w-full border-t-2 border-t-primary-500 py-4 bg-white">
            <div className="container mx-auto max-w-4xl w-full px-4 flex justify-end">
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="mr-4">
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={!form.formState.isValid}>
                Create
              </Button>
            </div>
          </footer>
        </form>
      </Form >
    </main >
  )
}
