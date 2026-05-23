'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import NachoLogo from '../nacho_logo.svg'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { langUrl } from '@/lib/lang'

type HeaderProps = {
  lang: string
  dict: {
    clients: string
  }
}

export default function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname()

  const switchLocale = (newLang: string) => {
    const path = lang !== 'en' && pathname.startsWith(`/${lang}`)
      ? pathname.slice(`/${lang}`.length) || '/'
      : pathname
    return langUrl(newLang, path)
  }

  return (
    <header className="z-10 supports-backdrop-blur:bg-background/60 sticky top-0 w-full shadow-sm dark:shadow-secondary bg-background/95 backdrop-blur-sm">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Link href={langUrl(lang, '/')} className="font-medium text-lg flex">
            <Image src={NachoLogo} className="mr-2" alt="Nacho" width={30} height={30} priority />
            Nacho
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-4 mx-6">
          <Link href={langUrl(lang, '/clients')} className="font-medium">{dict.clients}</Link>
        </div>

        <div className="flex flex-1 items-center space-x-4 justify-end">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link
              href={switchLocale('en')}
              className={lang === 'en' ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-700'}
              aria-label="English"
            >
              EN
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href={switchLocale('fr')}
              className={lang === 'fr' ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-700'}
              aria-label="Français"
            >
              FR
            </Link>
          </div>

          <Link href="https://github.com/cerberauth/nacho" rel="nofollow noopener noreferrer" target="_blank">
            <GitHubLogoIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}
