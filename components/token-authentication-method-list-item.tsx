import { useMemo } from 'react'
import { tokenAuthenticationMethodLabel, tokenAuthenticationMethodReferences } from '@/lib/getters'

import { ListItemWithReferences } from './list-item-with-references'

export function TokenAuthenticationMethodListItem({ authMethod }: { authMethod: string }) {
  const name = useMemo(() => tokenAuthenticationMethodLabel(authMethod) || authMethod, [authMethod])
  const references = useMemo(() => tokenAuthenticationMethodReferences(authMethod), [authMethod])

  return (
    <ListItemWithReferences name={name} references={references} />
  )
}
