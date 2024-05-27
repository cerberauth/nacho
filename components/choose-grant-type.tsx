import { useState } from 'react'
import { ApplicationType, GrantType, TokenEndpointAuthMethod } from '@/lib/consts'
import { WithUserInteractionChoice } from './with-user-interaction-choice'
import { ApplicationTypeChoice } from './application-type-choice'
import { BffChoice } from './bff-choice'

const withSecretTokenEndpointAuthMethod = [TokenEndpointAuthMethod.clientSecretBasic, TokenEndpointAuthMethod.clientSecretPost, TokenEndpointAuthMethod.mtls]

type ChooseGrantTypeProps = {
  onApplicationTypeChange?: (type: ApplicationType) => void
  onGrantTypeChange: (grantTypes: Array<GrantType>) => void
  onTokenEndpointAuthMethodChange: (method: Array<TokenEndpointAuthMethod>) => void
}

export function ChooseGrantType({ onApplicationTypeChange, onGrantTypeChange, onTokenEndpointAuthMethodChange }: ChooseGrantTypeProps) {
  const [withUserInteraction, setWithUserInteraction] = useState<boolean | null>(null)
  const [applicationType, setApplicationType] = useState<keyof typeof ApplicationType | null>(null)
  const [bff, setBff] = useState<boolean | null>(null)

  const handleUserInteractionChange = (withUserInteraction: boolean) => {
    setWithUserInteraction(withUserInteraction)
  }

  const handleApplicationTypeChange = (type: keyof typeof ApplicationType) => {
    setApplicationType(type)
    if (typeof onApplicationTypeChange === 'function') {
      onApplicationTypeChange(ApplicationType[type])
    }

    let grantTypes: Array<GrantType> = []
    let tokenEndpointAuthMethod: Array<TokenEndpointAuthMethod> = []
    switch (type) {
      case ApplicationType.spa:
        grantTypes = [GrantType.authorizationCodeWithPKCE]
        tokenEndpointAuthMethod = bff ? withSecretTokenEndpointAuthMethod : [TokenEndpointAuthMethod.none]
        break

      case ApplicationType.mobileApplication:
      case ApplicationType.desktopApplication:
      case ApplicationType.cli:
        grantTypes = [GrantType.authorizationCodeWithPKCE]
        tokenEndpointAuthMethod = [TokenEndpointAuthMethod.none]
        break

      case ApplicationType.smartTvAndLimitedInputDevice:
        grantTypes = [GrantType.deviceCode]
        tokenEndpointAuthMethod = [TokenEndpointAuthMethod.none]
        break

      case ApplicationType.webApplication:
        grantTypes = [GrantType.authorizationCodeWithPKCE]
        tokenEndpointAuthMethod = withSecretTokenEndpointAuthMethod
        break

      case ApplicationType.machineToMachine:
        grantTypes = [GrantType.clientCredentials]
        tokenEndpointAuthMethod = withSecretTokenEndpointAuthMethod
        break
    }

    onGrantTypeChange(grantTypes)
    onTokenEndpointAuthMethodChange(tokenEndpointAuthMethod)
  }

  return (
    <div className="text-base leading-6 space-y-4 text-gray-700 sm:leading-7">
      {!withUserInteraction && (
        <WithUserInteractionChoice onChange={handleUserInteractionChange} />
      )}

      {withUserInteraction && !applicationType && (
        <ApplicationTypeChoice
          withUserInteraction={withUserInteraction}
          onChange={handleApplicationTypeChange}
        />
      )}

      {applicationType === ApplicationType.spa && bff === null && (
        <BffChoice onChange={setBff} />
      )}
    </div>
  )
}
