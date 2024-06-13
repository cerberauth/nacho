'use client'

import gravatarUrl from 'gravatar-url'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { signOut, signIn } from '@/auth'

export default function Header() {
  const session = useSession()
  console.log(session)
  const user = session.data?.user

  return (
    <header className="z-10 sticky top-0 w-full bg-primary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0"></div>

        <div className="flex flex-1 items-center space-x-2 justify-end">
          {session.status === 'unauthenticated' && (
            <Button className="text-white" onClick={() => signIn()}>Login</Button>
          )}

          {user?.email && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={gravatarUrl(user.email, { size: 36 })}
                      height={36}
                      width={36}
                    />
                    <AvatarFallback>{user.name}</AvatarFallback>
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

                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { }}>
                  <Link className="w-full" href="#" onClick={() => signOut()}>Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
