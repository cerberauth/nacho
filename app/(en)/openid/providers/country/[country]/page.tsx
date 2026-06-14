import type { Metadata } from 'next'

import { countries } from '@/lib/countries'
import { getProvidersByNationalities } from '@/lib/providers'
import {
  generateOpenIDProvidersCountryMetadata,
  OpenIDProvidersCountryPage,
} from '@/components/pages/openid-providers-country'

type Props = { params: Promise<{ country: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return countries
    .filter((c) => getProvidersByNationalities(c.nationalities).length > 0)
    .map((c) => ({ country: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  return generateOpenIDProvidersCountryMetadata('en', country)
}

export default async function Page({ params }: Props) {
  const { country } = await params
  return <OpenIDProvidersCountryPage lang="en" country={country} />
}
