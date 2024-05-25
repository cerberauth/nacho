type OAuthClient = {
  applicationType: string
  grantTypes: string[]

  name: string
  allowedCorsOrigins: string[]
  scopes: string[]
  audiences: string[]
  redirectUris: string[]
  frontChannelLogoutUri?: string
  tokenEndpointAuthMethod: string

  contacts: string[]
  uri?: string
  policyUri?: string
  tosUri?: string
  logoUri?: string
}
