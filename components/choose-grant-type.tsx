import { usePlausible } from 'next-plausible'
import { useCallback, useState } from 'react'

import { ApplicationTypes, GrantTypes, TokenEndpointAuthMethods } from '@/lib/consts'
import { MiniUserInteractionChoiceCard, WithUserInteractionChoice } from './with-user-interaction-choice'
import { ApplicationTypeChoice, MiniApplicationTypeChosenCard } from './application-type/application-type-choice'
import { BffChoice, MiniBffChoiceCard } from './bff-choice'

const withSecretTokenEndpointAuthMethod = [TokenEndpointAuthMethods.clientSecretBasic, TokenEndpointAuthMethods.clientSecretPost, TokenEndpointAuthMethods.mtls]

type ChooseGrantTypeProps = {
  onApplicationTypeChange?: (type: ApplicationType | null) => void
  onGrantTypeChange: (grantTypes: Array<GrantType>) => void
  onTokenEndpointAuthMethodChange: (method: Array<TokenEndpointAuthMethod>) => void
  template?: string | null
}

export function ChooseGrantType({ onApplicationTypeChange, onGrantTypeChange, onTokenEndpointAuthMethodChange, template }: ChooseGrantTypeProps) {
  const plausible = usePlausible()
  const [withUserInteraction, setWithUserInteraction] = useState<boolean | null>(null)
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null)
  const [bff, setBff] = useState<boolean | null>(null)

  const handleBffChange = useCallback((value: boolean | null) => {
    plausible('bffChoice', { props: { bff: value } })
    setBff(value)
    onTokenEndpointAuthMethodChange(value ? withSecretTokenEndpointAuthMethod : [TokenEndpointAuthMethods.none])
  }, [plausible, onTokenEndpointAuthMethodChange])
  const handleApplicationTypeChange = useCallback((type: ApplicationType | null) => {
    plausible('applicationTypeChoice', { props: { applicationType: type } })
    setApplicationType(type)
    if (typeof onApplicationTypeChange === 'function') {
      onApplicationTypeChange(type)
    }

    let grantTypes: Array<GrantType> = []
    let tokenEndpointAuthMethod: Array<TokenEndpointAuthMethod> = []
    switch (type) {
      case ApplicationTypes.spa:
        grantTypes = [GrantTypes.authorizationCode, GrantTypes.pkce]
        tokenEndpointAuthMethod = bff ? withSecretTokenEndpointAuthMethod : [TokenEndpointAuthMethods.none]
        break

      case ApplicationTypes.mobileApplication:
      case ApplicationTypes.desktopApplication:
      case ApplicationTypes.cli:
        grantTypes = [GrantTypes.authorizationCode, GrantTypes.pkce, GrantTypes.refreshToken]
        tokenEndpointAuthMethod = [TokenEndpointAuthMethods.none]
        break

      case ApplicationTypes.smartTvAndLimitedInputDevice:
        grantTypes = [GrantTypes.deviceCode]
        tokenEndpointAuthMethod = [TokenEndpointAuthMethods.none]
        break

      case ApplicationTypes.webApplication:
        grantTypes = [GrantTypes.authorizationCode, GrantTypes.pkce, GrantTypes.refreshToken]
        tokenEndpointAuthMethod = withSecretTokenEndpointAuthMethod
        break

      case ApplicationTypes.machineToMachine:
        grantTypes = [GrantTypes.clientCredentials]
        tokenEndpointAuthMethod = withSecretTokenEndpointAuthMethod
        break

      default:
        handleBffChange(null)
        break
    }

    onGrantTypeChange(grantTypes)
    onTokenEndpointAuthMethodChange(tokenEndpointAuthMethod)
  }, [plausible, onApplicationTypeChange, onTokenEndpointAuthMethodChange, onGrantTypeChange, bff, handleBffChange])
  const handleUserInteractionChange = useCallback((withUserInteraction: boolean | null) => {
    handleApplicationTypeChange(null)
    plausible('userInteractionChoice', { props: { withUserInteraction } })
    setWithUserInteraction(withUserInteraction)
  }, [plausible, handleApplicationTypeChange])

  // TODO: Let the user choose the template and then show the template choice card
  if (template) {
    return null
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

      {applicationType === ApplicationTypes.spa && bff === null && (
        <BffChoice onChange={handleBffChange} />
      )}
    </div>
  )
}
