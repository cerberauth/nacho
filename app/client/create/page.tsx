'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ChooseGrantType } from '@/components/choose-grant-type'
import { Input } from '@/components/ui/input'
import { InputTags } from '@/components/ui/input-tags'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { ApplicationType, GrantType } from '@/lib/consts'

const applicationTypeKeys = Object.keys(ApplicationType) as [keyof typeof ApplicationType]
const grantTypeKeys = Object.keys(GrantType) as [keyof typeof GrantType]
const createClientSchema = z.object({
  applicationType: z.enum(applicationTypeKeys),
  grantTypes: z.array(z.enum(grantTypeKeys)),

  name: z.string(),
  uri: z.string().optional(),
  allowedCorsOrigins: z.array(z.string()),
  scopes: z.array(z.string()),
  audiences: z.array(z.string()),
  redirectUris: z.array(z.string()),
  frontChannelLogoutUri: z.string().optional(),
  tokenEndpointAuthMethod: z.enum(['none', 'client_secret_basic', 'client_secret_post', 'client_secret_jwt', 'private_key_jwt']),

  contacts: z.array(z.string()),
  policyUri: z.string().optional(),
  tosUri: z.string().optional(),
  logoUri: z.string().optional(),
})

export default function CreateClient() {
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null)
  const [grantTypes, setGrantTypes] = useState<GrantType[] | null>(null)
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
  })

  function onApplicationTypeChange(type: keyof typeof ApplicationType) {
    setApplicationType(ApplicationType[type])
    form.setValue('applicationType', type)
  }

  function onGrantTypeChange(grantTypes: Array<keyof typeof GrantType>) {
    setGrantTypes(grantTypes.map(gt => GrantType[gt]))
    form.setValue('grantTypes', grantTypes)
  }

  function onSubmit(data: z.infer<typeof createClientSchema>) {
    const client: OAuthClient = {
      ...data,
      grantTypes: data.grantTypes.map(gt => GrantType[gt]),
      applicationType: ApplicationType[data.applicationType],
    }

    console.log(client)
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create your new client</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Choose the type of application you are building and the grant type you want to use.
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {!grantTypes && (
              <ChooseGrantType
                onApplicationTypeChange={onApplicationTypeChange}
                onGrantTypeChange={onGrantTypeChange}
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Implementation details</h2>

            <FormField
              control={form.control}
              name="applicationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Application Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    The type of application you are building.
                  </FormDescription>
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
                    <InputTags {...field} disabled />
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The Token Endpoint Auth Method of your application.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Technical details</h2>
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

            {applicationType === ApplicationType.spa && (
              <FormField
                control={form.control}
                name="allowedCorsOrigins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Allowed CORS Origins <span className="text-red-500">*</span>
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
                    Scopes <span className="text-red-500">*</span>
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
                    Audiences <span className="text-red-500">*</span>
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

            <FormField
              control={form.control}
              name="frontChannelLogoutUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Front Channel Logout URI
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The Front Channel Logout URI of your application.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contacts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contacts Email <span className="text-red-500">*</span>
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

            <Button type="submit" className="w-full">
              Create client
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">UI & Legal Details</h2>


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
          </div>
        </form>
      </Form>
    </main>
  )
}
