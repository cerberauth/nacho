'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { saveClient } from '@/lib/clients'
import { ApplicationTypes } from '@/lib/consts'
import { clientClientURLByOAuth2Client } from '@/lib/url'
import type { Dictionary } from '@/lib/dictionaries'

import { clientSchema as createClientSchema } from '@/app/clients/schema'
import { CreateClientForm } from './form'

const localStorageItem = 'client'

type Props = {
  dict: Dictionary['createClient']
  lang: string
}

export function CreateClientContainer({ dict, lang }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof createClientSchema>>({
    resolver: zodResolver(createClientSchema),
  })

  const onSubmit = useCallback(async (data: z.infer<typeof createClientSchema>) => {
    setIsSubmitting(true)
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

    const { track } = await import('@plausible-analytics/tracker')
    track('Create Client', { props: {} })
    const href = await clientClientURLByOAuth2Client(client)

    saveClient({ client, url: href })

    router.push(href)
  }, [router])

  return (
    <CreateClientForm
      onSubmit={onSubmit}
      form={form}
      isSubmitting={isSubmitting}
      dict={dict}
      lang={lang}
    />
  )
}
