import type { Metadata } from 'next'

import { countries } from '@/lib/countries'
import { getIAMProvidersByNationalities } from '@/lib/iam-providers'
import {
  generateIAMProvidersCountryMetadata,
  IAMProvidersCountryPage,
} from '@/components/pages/iam-providers-country'

type Props = { params: Promise<{ country: string }> }

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return countries
    .filter((c) => getIAMProvidersByNationalities(c.nationalities).length > 0)
    .map((c) => ({ country: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params
  return generateIAMProvidersCountryMetadata('en', country)
}

export default async function Page({ params }: Props) {
  const { country } = await params
  return <IAMProvidersCountryPage lang="en" country={country} />
}
