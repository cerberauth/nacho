'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { usePlausible } from 'next-plausible'
import { Suspense, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ApplicationTypes } from '@/lib/consts'
import { urlEncode } from '@/lib/url'

import { clientSchema as createClientSchema } from '../schema'
import { CreateClientForm } from './form'

const localStorageItem = 'client'

export const dynamic = 'force-static'
export const dynamicParams = false

export default function CreateClient() {
  const router = useRouter()
  const plausible = usePlausible()
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
  })

  const onSubmit = useCallback(async (data: z.infer<typeof createClientSchema>) => {
    const client: OAuth2Client = {
      ...data,
      id: nanoid(),
      audiences: data.audiences || [],
      scopes: data.scopes || [],
      allowedCorsOrigins: data.allowedCorsOrigins || [],
      postLogoutRedirectUris: data.postLogoutRedirectUris || [],
      grantTypes: data.grantTypes,
      applicationType: ApplicationTypes[data.applicationType],
      contacts: data.contacts || [],
    }

    localStorage.removeItem(localStorageItem)

    const encoded = await urlEncode(client)
    plausible('Create Client', { props: {} })
    router.push(`/clients/${encoded}`)
  }, [router, plausible])

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateClientForm form={form} onSubmit={onSubmit} />
      </Suspense>
    </main>
  )
}
