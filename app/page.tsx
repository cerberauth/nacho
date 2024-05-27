import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import OAuthLogo from './oauth_logo.svg'
import NachoLogo from './nacho_logo.svg'

export default function Home() {
  return (
    <main className="flex flex-col max-w-xl mx-auto items-center justify-center h-screen">
      <div className="space-y-6 text-center">
        <Image src={NachoLogo} className="mx-auto" alt="OAuth" width={175} height={175} />
        <h1 className="flex flex-col space-y-4 font-bold tracking-tight text-gray-900 dark:text-gray-50">
          <span className="text-4xl sm:text-5xl">NACHO</span>
          <span className="text-3xl sm:text-4xl">New OAuth Client Helper</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Nacho assists you throughout the process of creating an OAuth (and OpenID Connect)  client.
        </p>
        <div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/client/create"
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
