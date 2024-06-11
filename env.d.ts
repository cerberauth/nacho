type OAuthClient = {
  id: string
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

type TestIdClient = {
  clientId: string
  clientSecret: string
  client: OAuthClient
}
