import { usePlausible } from 'next-plausible'
import { useState } from 'react'

import { ApplicationType, GrantType, TokenEndpointAuthMethod } from '@/lib/consts'
import { MiniUserInteractionChoiceCard, WithUserInteractionChoice } from './with-user-interaction-choice'
import { ApplicationTypeChoice, MiniApplicationTypeChosenCard } from './application-type/application-type-choice'
import { BffChoice, MiniBffChoiceCard } from './bff-choice'

const withSecretTokenEndpointAuthMethod = [TokenEndpointAuthMethod.clientSecretBasic, TokenEndpointAuthMethod.clientSecretPost, TokenEndpointAuthMethod.mtls]

type ChooseGrantTypeProps = {
  onApplicationTypeChange?: (type: ApplicationType | null) => void
  onGrantTypeChange: (grantTypes: Array<GrantType>) => void
  onTokenEndpointAuthMethodChange: (method: Array<TokenEndpointAuthMethod>) => void
}

export function ChooseGrantType({ onApplicationTypeChange, onGrantTypeChange, onTokenEndpointAuthMethodChange }: ChooseGrantTypeProps) {
  const plausible = usePlausible()
  const [withUserInteraction, setWithUserInteraction] = useState<boolean | null>(null)
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null)
  const [bff, setBff] = useState<boolean | null>(null)

  const handleUserInteractionChange = (withUserInteraction: boolean | null) => {
    handleApplicationTypeChange(null)
    plausible('userInteractionChoice', { props: { withUserInteraction } })
    setWithUserInteraction(withUserInteraction)
  }

  const handleApplicationTypeChange = (type: ApplicationType | null) => {
    plausible('applicationTypeChoice', { props: { applicationType: type } })
    setApplicationType(type)
    if (typeof onApplicationTypeChange === 'function') {
      onApplicationTypeChange(type)
    }

    let grantTypes: Array<GrantType> = []
    let tokenEndpointAuthMethod: Array<TokenEndpointAuthMethod> = []
    switch (type) {
      case ApplicationType.spa:
        grantTypes = [GrantType.authorizationCode, GrantType.pkce]
        tokenEndpointAuthMethod = bff ? withSecretTokenEndpointAuthMethod : [TokenEndpointAuthMethod.none]
        break

      case ApplicationType.mobileApplication:
      case ApplicationType.desktopApplication:
      case ApplicationType.cli:
        grantTypes = [GrantType.authorizationCode, GrantType.pkce, GrantType.refreshToken]
        tokenEndpointAuthMethod = [TokenEndpointAuthMethod.none]
        break

      case ApplicationType.smartTvAndLimitedInputDevice:
        grantTypes = [GrantType.deviceCode]
        tokenEndpointAuthMethod = [TokenEndpointAuthMethod.none]
        break

      case ApplicationType.webApplication:
        grantTypes = [GrantType.authorizationCode, GrantType.pkce, GrantType.refreshToken]
        tokenEndpointAuthMethod = withSecretTokenEndpointAuthMethod
        break

      case ApplicationType.machineToMachine:
        grantTypes = [GrantType.clientCredentials]
        tokenEndpointAuthMethod = withSecretTokenEndpointAuthMethod
        break

      default:
        handleBffChange(null)
        break
    }

    onGrantTypeChange(grantTypes)
    onTokenEndpointAuthMethodChange(tokenEndpointAuthMethod)
  }

  const handleBffChange = (value: boolean | null) => {
    plausible('bffChoice', { props: { bff: value } })
    setBff(value)
    onTokenEndpointAuthMethodChange(value ? withSecretTokenEndpointAuthMethod : [TokenEndpointAuthMethod.none])
  }

  return (
    <div className="text-base leading-6 space-y-4 text-gray-700 sm:leading-7">
      <div className="flex items-center space-x-2">
        {withUserInteraction !== null && (
          <MiniUserInteractionChoiceCard withUserInteraction={withUserInteraction} onClick={() => handleUserInteractionChange(null)} />
        )}

        {applicationType && (
          <MiniApplicationTypeChosenCard applicationType={applicationType} onClick={() => handleApplicationTypeChange(null)} />
        )}

        {bff !== null && (
          <MiniBffChoiceCard bff={bff} onClick={() => handleBffChange(null)} />
        )}
      </div>

      {withUserInteraction === null && (
        <WithUserInteractionChoice onChange={handleUserInteractionChange} />
      )}

      {withUserInteraction !== null && !applicationType && (
        <ApplicationTypeChoice
          withUserInteraction={withUserInteraction}
          onChange={handleApplicationTypeChange}
        />
      )}

      {applicationType === ApplicationType.spa && bff === null && (
        <BffChoice onChange={handleBffChange} />
      )}
    </div>
  )
}
