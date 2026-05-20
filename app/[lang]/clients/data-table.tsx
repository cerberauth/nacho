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
import type { Dictionary } from '@/lib/dictionaries'

const getCoreRowModelMemo = getCoreRowModel()
const defaultClients: Client[] = []

type DataTableProps = {
  dict: Dictionary['clients']
}

export function DataTable({ dict }: DataTableProps) {
  const [clients, setClients] = useState<Client[]>(defaultClients)
  const onDeleteClientClick = useCallback((clientId: string) => {
    deleteClient(clientId)
    setClients(getClients())
  }, [])
  const dataColumns = useMemo(() => columns(onDeleteClientClick, dict), [onDeleteClientClick, dict])
  const table = useReactTable({
    data: clients ?? defaultClients,
    columns: dataColumns,
    getCoreRowModel: getCoreRowModelMemo,
  })

  useEffect(() => {
    setClients(getClients())
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
              <TableCell colSpan={dataColumns.length} className='h-24 text-center'>
                {dict.noClients}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
