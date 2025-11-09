import { DataTable } from './data-table'

export default function ClientsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-none tracking-tight mb-2 text-center">
          Recently Viewed Clients
        </h1>
      </div>

      <div className="py-8">
        <DataTable />
      </div>
    </main>
  )
}
