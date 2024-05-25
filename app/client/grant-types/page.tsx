'use client'

import { ChooseGrantType } from '@/components/choose-grant-type'
import { GrantType } from '@/lib/consts'

export default function GrantTypes() {
  const handleGrantTypeChange = (type: Array<keyof typeof GrantType>) => {
    console.log(`Selected grant type: ${type}`)
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Choose the right OAuth Grant Type</h1>
      </div>
      <div className="divide-y divide-gray-200">
        <ChooseGrantType onGrantTypeChange={handleGrantTypeChange} />
      </div>
    </main>
  )
}
