import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import NachoLogo from './nacho_logo.svg'

export const metadata: Metadata = {
  title: 'NACHO - OAuth Client Helper',
  description: 'NACHO assists you throughout the process of creating an OpenID Connect (OAuth) client, including choosing the right grant type, token authentication method, and more.',
}

export default function Home() {
  return (
    <main className="flex flex-col max-w-xl mx-auto items-center justify-center">
      <div className="space-y-6 text-center mt-9 md:my-32">
        <Image src={NachoLogo} className="mx-auto" alt="Nacho" width={150} height={150} />
        <h1 className="flex flex-col space-y-4 font-bold tracking-tight text-gray-900 dark:text-gray-50">
          <span className="text-3xl sm:text-4xl">OAuth Client Helper</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Assists you throughout the process of creating an OpenID Connect (OAuth) client and sharing it.
        </p>
        <div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/clients/create"
          >
            Get Started
          </Link>
        </div>
        <div>
          <Link className="inline-flex items-center justify-center text-sm" href="/grant-types">
            I just want to choose a grant type
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </main>
  )
}
