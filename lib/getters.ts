import { applicationTypes, grantTypes, tokenAuthenticationMethods, TokenEndpointAuthMethod } from './consts'

export const applicationTypeName = (type: string) => {
  return applicationTypes.find(option => option.value === type)?.label
}

const getGrantType = (type: string) => {
  return grantTypes.find(grantType => grantType.id === type)
}

export const grantTypeName = (type: string) => 
  getGrantType(type)?.label

export const grantTypeReferences = (type: string) => 
  getGrantType(type)?.references || []

const getTokenAuthenticationMethod = (method: string) => {
  return tokenAuthenticationMethods.find(tokenMethod => tokenMethod.id === method)
}

export const tokenAuthenticationMethod = (method: string) =>
  getTokenAuthenticationMethod(method)?.label

export const tokenAuthenticationMethodReferences = (method: string) =>
  getTokenAuthenticationMethod(method)?.references || []
