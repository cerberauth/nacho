'use client'

import { ChooseGrantType } from '@/components/choose-grant-type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GrantType, TokenEndpointAuthMethod } from '@/lib/consts'
import { grantTypeName, grantTypeReferences, tokenAuthenticationMethod, tokenAuthenticationMethodReferences } from '@/lib/getters'
import { ArrowUpRight, SquareArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function GrantTypes() {
  const [selectedGrantTypes, setSelectedGrantTypes] = useState<GrantType[] | null>(null)
  const [selectedTokenEndpointAuthMethod, setSelectedTokenEndpointAuthMethod] = useState<TokenEndpointAuthMethod[] | null>(null)

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Choose the right OAuth Grant Type</h1>
      </div>
      <div className="divide-y divide-gray-200 space-y-4">
        <ChooseGrantType
          onGrantTypeChange={setSelectedGrantTypes}
          onTokenEndpointAuthMethodChange={setSelectedTokenEndpointAuthMethod}
        />

        {selectedGrantTypes && selectedGrantTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Grant Type(s) Recommendation</CardTitle>
            </CardHeader>

            <CardContent>
              <ul>
                {selectedGrantTypes.map((type) => (
                  <li key={type} className="space-y-2">
                    <span className="underline">{grantTypeName(type)}</span>
                    <ul className="text-sm my-6 ml-6 list-disc [&>li]:mt-2">
                      {grantTypeReferences(type).map((reference) => (
                        <li key={reference}>
                          <Link href={reference} target="_blank" className="inline-flex">
                            {reference}
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {selectedTokenEndpointAuthMethod && (
          <Card>
            <CardHeader>
              <CardTitle>Token Endpoint Authentication Method Recommendation</CardTitle>
            </CardHeader>

            <CardContent>
              <span className="underline">Possible Authentication Methods</span>
              <ul className="text-sm my-6 ml-6 list-disc [&>li]:mt-2">
                {selectedTokenEndpointAuthMethod.map((method) => (
                  <li key={method}>
                    <Link href={tokenAuthenticationMethodReferences(method)[0]} target="_blank" className="inline-flex">
                      {tokenAuthenticationMethod(method)}
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
