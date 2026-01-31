import { tokenAuthenticationMethodLabel, tokenAuthenticationMethodReferences } from '@/lib/getters'

import { ListItemWithReferences } from './list-item-with-references'

export function TokenAuthenticationMethodListItem({ authMethod }: { authMethod: string }) {
  const name = tokenAuthenticationMethodLabel(authMethod) || authMethod
  const references = tokenAuthenticationMethodReferences(authMethod)

  return (
    <ListItemWithReferences name={name} references={references} />
  )
}
