'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getClients, deleteClient } from '@/lib/clients'
import { columns } from './columns'

const getCoreRowModelMemo = getCoreRowModel()
const defaultClients: Client[] = []

interface DataTableProps {} // eslint-disable-line

export function DataTable({}: DataTableProps) {
  const [clients, setClients] = useState<Client[]>(defaultClients)
  const onDeleteClientClick = useCallback((clientId: string) => {
    deleteClient(clientId)
    setClients(getClients())
  }, [])
  const dataColumns = useMemo(() => columns(onDeleteClientClick), [onDeleteClientClick])
  const table = useReactTable({
    data: clients ?? defaultClients,
    columns: dataColumns,
    getCoreRowModel: getCoreRowModelMemo,
  })

  useEffect(() => {
    let clientsGet = false
    if (!clientsGet) {
      setClients(getClients())
      clientsGet = true
    }

    return () => {
      clientsGet = true
    }
  }, [])

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No clients. Create one to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
