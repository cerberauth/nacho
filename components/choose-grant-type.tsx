import { useState } from 'react'
import type { ApplicationType, GrantType } from '@/lib/consts'
import { WithUserInteractionChoice } from './with-user-interaction-choice'
import { ApplicationTypeChoice } from './application-type-choice'

type ChooseGrantTypeProps = {
  onApplicationTypeChange?: (type: keyof typeof ApplicationType) => void
  onGrantTypeChange: (grantTypes: Array<keyof typeof GrantType>) => void
}

export function ChooseGrantType({ onApplicationTypeChange, onGrantTypeChange }: ChooseGrantTypeProps) {
  const [withUserInteraction, setWithUserInteraction] = useState<boolean | null>(null)
  const [applicationType, setApplicationType] = useState<keyof typeof ApplicationType | null>(null)

  const handleUserInteractionChange = (withUserInteraction: boolean) => {
    setWithUserInteraction(withUserInteraction)
  }

  const handleApplicationTypeChange = (type: keyof typeof ApplicationType) => {
    setApplicationType(type)
    if (typeof onApplicationTypeChange === 'function') {
      onApplicationTypeChange(type)
    }

    onGrantTypeChange(['authorizationCodeWithPKCE'])
  }

  return (
    <div className="text-base leading-6 space-y-4 text-gray-700 sm:leading-7">
      {!withUserInteraction ? (
        <WithUserInteractionChoice onChange={handleUserInteractionChange} />
      ) : (
        <ApplicationTypeChoice
          withUserInteraction={withUserInteraction}
          onChange={handleApplicationTypeChange}
        />
      )}
    </div>
  )
}
