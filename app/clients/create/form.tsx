'use client'

import { CircleHelp } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ChooseGrantType } from '@/components/choose-grant-type'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { InputTags } from '@/components/ui/input-tags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApplicationTypes, tokenAuthenticationMethods } from '@/lib/consts'
import { getTemplateById } from '@/lib/templates'

import { clientSchema as createClientSchema } from '../schema'

const localStorageItem = 'client'

type CreateClientFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof createClientSchema>>>
  onSubmit: (data: z.infer<typeof createClientSchema>) => void
}

export function CreateClientForm({ form, onSubmit }: CreateClientFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const plausible = usePlausible()
  const data = form.watch()
  const template = useMemo(() => searchParams.get('template'), [searchParams])

  useEffect(() => {
    if (hasBeenInitialized) {
      return
    }

    let client: Partial<OAuth2Client> = {}
    const clientLocalStorage = localStorage.getItem(localStorageItem)
    if (clientLocalStorage) {
      client = JSON.parse(clientLocalStorage)
    }

    if (template) {
      form.setValue('template', template)
      const templateApplication = getTemplateById(template)
      client = templateApplication ? {
        name: templateApplication.name,
        ...client,
        ...{
          ...templateApplication.client,
          tokenEndpointAuthMethod: templateApplication.client.tokenEndpointAuthMethods[0],
        }
      } : client

      plausible('Create Client From Template', { props: { template } })
    }

    if (client) {
      form.reset(client)
    }

    setHasBeenInitialized(true)
  }, [hasBeenInitialized, template, form, plausible])

  useEffect(() => {
    if (!hasBeenInitialized || isSubmitting) {
      return
    }

    localStorage.setItem(localStorageItem, JSON.stringify(data))
  }, [hasBeenInitialized, isSubmitting, data])

  const onApplicationTypeChange = useCallback((type: ApplicationType | null) => {
    if (type === null) {
      form.resetField('applicationType')
      return
    }

    form.setValue('applicationType', type)
  }, [form])
  const onGrantTypeChange = useCallback((grantTypes: GrantType[]) => {
    form.setValue('grantTypes', grantTypes)
  }, [form])
  const onTokenEndpointAuthMethodChange = useCallback((authMethods: TokenEndpointAuthMethod[]) => {
    form.setValue('tokenEndpointAuthMethod', authMethods[0])
  }, [form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async (data) => {
        if (isSubmitting) {
          return
        }

        setIsSubmitting(true)
        await onSubmit(data)
        setIsSubmitting(false)
      })}>
        <main className="container mx-auto max-w-4xl px-4 py-12 space-y-4">
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
              template={template}
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {data.applicationType === ApplicationTypes.spa && (
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
                          <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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

                <CardContent className="space-y-2">
                  <FormField
                    control={form.control}
                    name="tokenEndpointAuthMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>
                          Token Endpoint Authentication Method <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} name={field.name} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Token Endpoint Auth Method" onBlur={field.onBlur} ref={field.ref}></SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                              {tokenAuthenticationMethods.map(({ id, label }) => (
                                <SelectItem key={id} value={id}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          The Token Endpoint Authentication Method of your application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <FormMessage />
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

        <div className="fixed bottom-0 w-full border-t-2 border-t-primary-500 py-4 bg-white">
          <div className="container mx-auto max-w-4xl w-full px-4 flex justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="mr-4">
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Create
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
