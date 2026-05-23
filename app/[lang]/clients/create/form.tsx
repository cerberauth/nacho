'use client'

import { CircleHelp } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
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
import type { Dictionary } from '@/lib/dictionaries'

import { clientSchema as createClientSchema } from '@/app/clients/schema'

const localStorageItem = 'client'

type CreateClientFormProps = {
  onSubmit: (data: z.infer<typeof createClientSchema>) => void
  form: ReturnType<typeof useForm<z.infer<typeof createClientSchema>>>
  isSubmitting: boolean
  dict: Dictionary['createClient']
  lang: string
}

export function CreateClientForm({ form, onSubmit, isSubmitting, dict, lang }: CreateClientFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const data = form.watch()
  const template = searchParams.get('template')
  const hasBeenInitialized = useRef(false)

  useEffect(() => {
    if (hasBeenInitialized.current) {
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

      import('@plausible-analytics/tracker').then(({ track }) => {
        track('Create Client From Template', { props: { template } })
      })
    }

    if (client) {
      form.reset(client)
    }

    hasBeenInitialized.current = true
  }, [template, form])

  useEffect(() => {
    if (!hasBeenInitialized.current || isSubmitting) {
      return
    }

    localStorage.setItem(localStorageItem, JSON.stringify(data))
  }, [isSubmitting, data])

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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <main className="container mx-auto max-w-4xl px-4 py-12 space-y-4">
          <div>
            <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2">{dict.title}</h1>
            <p className="text-sm text-muted-foreground">
              {dict.subtitle}
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
                  <CardTitle>{dict.technicalDetails}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {dict.name} <span className="text-red-500">{dict.nameRequired}</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.nameDescription}
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
                          {dict.redirectUris} <span className="text-red-500">{dict.redirectUrisRequired}</span>
                        </FormLabel>
                        <FormControl>
                          <InputTags {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.redirectUrisDescription}
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
                            {dict.allowedCorsOrigins}
                          </FormLabel>
                          <FormControl>
                            <InputTags {...field} />
                          </FormControl>
                          <FormDescription>
                            {dict.allowedCorsOriginsDescription}
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
                          {dict.scopes}
                        </FormLabel>
                        <FormControl>
                          <InputTags {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.scopesDescription}
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
                          {dict.audiences}
                        </FormLabel>
                        <FormControl>
                          <InputTags {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.audiencesDescription}
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
                          {dict.postLogoutRedirectUris}
                        </FormLabel>
                        <FormControl>
                          <InputTags {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.postLogoutRedirectUrisDescription}
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
              <Button variant="link" type="button" className="text-sm">{dict.uiLegalSettings}</Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{dict.uiLegalDetails}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <FormField
                    control={form.control}
                    name="contacts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {dict.contactsEmail}
                        </FormLabel>
                        <FormControl>
                          <InputTags type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.contactsEmailDescription}
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
                          {dict.homepageUri}
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
                          {dict.policyUri}
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
                          {dict.tosUri}
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
                          {dict.logoUri}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.logoUriDescription}
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
              <Button variant="link" type="button" className="text-sm">{dict.showAdvancedSettings}</Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <Card>
                <CardHeader>
                  <CardTitle>{dict.advancedSettings}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <FormField
                    control={form.control}
                    name="tokenEndpointAuthMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name}>
                          {dict.tokenEndpointAuthMethod} <span className="text-red-500">{dict.tokenEndpointAuthMethodRequired}</span>
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} name={field.name} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={dict.tokenEndpointAuthMethodPlaceholder} onBlur={field.onBlur} ref={field.ref}></SelectValue>
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
                          {dict.tokenEndpointAuthMethodDescription}
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
                          {dict.grantTypes} <span className="text-red-500">{dict.grantTypesRequired}</span>
                        </FormLabel>
                        <FormControl>
                          <InputTags {...field} />
                        </FormControl>
                        <FormDescription>
                          {dict.grantTypesDescription}
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
            <AlertTitle>{dict.dataUsageTitle}</AlertTitle>
            <AlertDescription>
              {dict.dataUsageDescription}
            </AlertDescription>
          </Alert>
        </main>

        <div className="fixed bottom-0 w-full border-t-2 border-t-primary-500 py-4 bg-white">
          <div className="container mx-auto max-w-4xl w-full px-4 flex justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="mr-4">
              {dict.cancel}
            </Button>
            <Button type="submit" size="lg">
              {dict.create}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
