'use client'

import gravatarUrl from 'gravatar-url'
import { useSession, signOut, signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import NachoLogo from './nacho_logo.svg'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function Header() {
  const session = useSession()
  const user = session.data?.user

  return (
    <header className="z-10 supports-backdrop-blur:bg-background/60 sticky top-0 w-full shadow dark:shadow-secondary bg-background/95 backdrop-blur">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Link href="/" className="font-medium text-lg flex">
            <Image src={NachoLogo} className="mr-2" alt="Nacho" width={30} height={30} />
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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {user.email && (
                      <AvatarImage
                        src={gravatarUrl(user.email, { size: 36 })}
                        height={36}
                        width={36}
                        alt={user.name ?? user.email}
                      />
                    )}
                    <AvatarFallback>{user.name ?? user.email}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { }}>
                  <Link className="w-full" href="#" onClick={() => signOut()}>Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn('cerberauth')} variant="outline" size="sm">
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
