'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getClients, deleteClient } from '@/lib/clients'
import { columns } from './columns'
import { DataTable } from './data-table'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const onDeleteClientClick = useCallback((clientId: string) => {
    deleteClient(clientId)
    setClients(getClients())
  }, [])
  const dataColumns = useMemo(() => columns(onDeleteClientClick), [onDeleteClientClick])

  useEffect(() => {
    setClients(getClients())
  }, [])

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">
          Recently Viewed Clients
        </h1>
      </div>

      <div className="py-8">
        <DataTable columns={dataColumns} data={clients} />
      </div>
    </main>
  )
}
