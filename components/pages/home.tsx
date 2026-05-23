import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import NachoLogo from '@/app/nacho_logo.svg'

export async function generateHomeMetadata(lang: Locale): Promise<Metadata> {
  const dict = await getDictionary(lang)
  return {
    title: dict.home.title,
    description: dict.home.description,
    alternates: {
      canonical: makeCanonical(lang, '/'),
      languages: makeLanguageAlternates('/'),
    },
  }
}

export async function HomePage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang)

  return (
    <main className="flex flex-col max-w-xl mx-auto items-center justify-center">
      <div className="space-y-6 text-center mt-9 md:my-32">
        <Image src={NachoLogo} className="mx-auto" alt="Nacho" width={150} height={150} priority />
        <h1 className="flex flex-col space-y-4 font-bold tracking-tight text-gray-900 dark:text-gray-50">
          <span className="text-3xl sm:text-4xl">{dict.home.title}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {dict.home.description}
        </p>
        <div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow-sm transition-colors hover:bg-gray-900/90 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href={langUrl(lang, '/clients/create')}
          >
            {dict.home.getStarted}
          </Link>
        </div>
        <div>
          <Link className="inline-flex items-center justify-center text-sm" href={langUrl(lang, '/grant-types')}>
            {dict.home.chooseGrantType}
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </main>
  )
}
