'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const columns = (onDeleteClientClick: (clientId: string) => void): ColumnDef<Client>[] => ([
  {
    accessorKey: 'clientName',
    header: 'Client',
    cell: ({ row }) => {
      const name = row.original.client.name
      const uri = row.original.client.uri || row.original.client.redirectUris?.[0]

      return (
        <Link href={row.original.url}>
          {name} {uri && <span className="text-xs text-gray-500">({uri})</span>}
        </Link>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {row.original.testIdClient && (
            <>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.testIdClient!.clientId)}
              >
                Copy TestID Client ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem>
            <Link href={row.original.url}>
              View client
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span onClick={() => onDeleteClientClick(row.original.client.id)}>
              Delete client
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
])