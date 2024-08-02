'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { applicationTypes } from '@/lib/consts'

export const columns = (projectId: string): ColumnDef<OAuth2Client>[] => ([
  // {
  //   accessorKey: 'logo',
  //   header: '',
  //   cell: ({ row }) => {
  //     const logo = row.getValue('logoUri') as string | undefined
  //     return (
  //       <span className="min-w-6">
  //         <Avatar className="item-center">
  //           <AvatarImage src={logo} />
  //           <AvatarFallback>{(row.getValue('clientName') as string | undefined)?.charAt(0)}</AvatarFallback>
  //         </Avatar>
  //       </span>
  //     )
  //   }
  // },
  {
    accessorKey: 'clientName',
    header: 'Application',
    cell: ({ row }) => {
      const name = row.original.clientName || 'unnamed'
      const uri = row.original.clientUri || row.original.redirectUris?.[0]

      return (
        <Link href={`/app/p/${projectId}/clients/${row.original.clientId}`}>
          {name} {uri && <span className="text-xs text-gray-500">({uri})</span>}
        </Link>
      )
    }
  },
  {
    accessorKey: 'clientId',
    header: 'Client ID',
    cell: ({ row }) => {
      return (
        <Link href={`/app/p/${projectId}/clients/${row.original.clientId}`} className="text-xs">
          {row.getValue('clientId')}
        </Link>
      )
    }
  },
  {
    accessorKey: 'applicationType',
    header: 'Application Type',
    cell: ({ row }) => {
      if (!row.original.applicationType) {
        return <span className="text-gray-500">Unknown</span>
      }

      return <span>
        {applicationTypes.find(({ id }) => id === row.original.applicationType)?.label ?? row.original.applicationType}
      </span>
    }
  },
  // {
  //   accessorKey: 'owner',
  //   header: 'Owner',
  // },
  {
    id: 'actions',
    cell: ({ row }) => {
      const client = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.clientId!)}
            >
              Copy client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/app/p/${projectId}/clients/${client.clientId}`}>
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
])
