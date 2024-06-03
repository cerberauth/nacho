type OAuthClient = {
  applicationType: string
  grantTypes: string[]
  tokenEndpointAuthMethod: string[]

  name: string
  allowedCorsOrigins: string[]
  scopes: string[]
  audiences: string[]
  redirectUris: string[]
  postLogoutRedirectUris: string[]

  contacts: string[]
  uri?: string
  policyUri?: string
  tosUri?: string
  logoUri?: string
}
