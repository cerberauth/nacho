import Image from 'next/image'
import Link from 'next/link'

import NachoLogo from './nacho_logo.svg'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function Header() {
  return (
    <header className="z-10 supports-backdrop-blur:bg-background/60 sticky top-0 w-full shadow-sm dark:shadow-secondary bg-background/95 backdrop-blur-sm">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Link href="/" className="font-medium text-lg flex">
            <Image src={NachoLogo} className="mr-2" alt="Nacho" width={30} height={30} priority />
            Nacho
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-4 mx-6">
          <Link href="/clients" className="font-medium">Clients</Link>
        </div>

        <div className="flex flex-1 items-center space-x-4 justify-end">
          <Link href="https://github.com/cerberauth/nacho" rel="nofollow noopener noreferrer" target="_blank">
            <GitHubLogoIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}
