import { type ApplicationType, applicationTypes, type GrantType, grantTypes, tokenAuthenticationMethods, TokenEndpointAuthMethod } from './consts'

export const applicationTypeName = (type: ApplicationType) => {
  return applicationTypes.find(option => option.value === type)?.label
}

const getGrantType = (type: GrantType) => {
  return grantTypes.find(grantType => grantType.id === type)
}

export const grantTypeName = (type: GrantType) => 
  getGrantType(type)?.label

export const grantTypeReferences = (type: GrantType) => 
  getGrantType(type)?.references || []

const getTokenAuthenticationMethod = (method: TokenEndpointAuthMethod) => {
  return tokenAuthenticationMethods.find(tokenMethod => tokenMethod.id === method)
}

export const tokenAuthenticationMethod = (method: TokenEndpointAuthMethod) =>
  getTokenAuthenticationMethod(method)?.label

export const tokenAuthenticationMethodReferences = (method: TokenEndpointAuthMethod) =>
  getTokenAuthenticationMethod(method)?.references || []
