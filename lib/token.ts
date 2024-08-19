import { tokenIssuer } from '@/auth'
import { type AuthorizationServer, type Client, clientCredentialsGrantRequest, discoveryRequest, isOAuth2Error, OAuth2TokenEndpointResponse, parseWwwAuthenticateChallenges, processClientCredentialsResponse, processDiscoveryResponse, type WWWAuthenticateChallenge } from 'oauth4webapi'

const issuer = new URL(tokenIssuer)
const client: Client = {
  client_id: process.env.AUTH_API_CLIENT_ID!,
  client_secret: process.env.AUTH_API_CLIENT_SECRET,
  token_endpoint_auth_method: 'client_secret_basic',
}

let authorizationServer: AuthorizationServer | null = null
async function getAs(): Promise<AuthorizationServer> {
  if (authorizationServer) {
    return authorizationServer
  }

  const _authorizationServer = await discoveryRequest(issuer, { algorithm: 'oidc' })
    .then(response => processDiscoveryResponse(issuer, response))
  authorizationServer = _authorizationServer
  return _authorizationServer
}

let expiresAt: Date | null = null
let token: OAuth2TokenEndpointResponse | null = null
export async function getToken(): Promise<string> {
  if (token?.access_token && expiresAt && expiresAt > new Date()) {
    return token.access_token
  }

  const as = await getAs()
  const parameters = new URLSearchParams()
  if (process.env.AUTH_API_SCOPE) {
    parameters.set('scope', process.env.AUTH_API_SCOPE)
  }

  const response = await clientCredentialsGrantRequest(as, client, parameters)
  let challenges: WWWAuthenticateChallenge[] | undefined
  if ((challenges = parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.error('WWW-Authenticate Challenge', challenge)
    }
    throw new Error()
  }

  const result = await processClientCredentialsResponse(as, client, response)
  if (isOAuth2Error(result)) {
    console.error('OAuth2 Error', result)
    throw new Error()
  }

  if (!result.access_token || !result.expires_in) {
    console.error('Invalid Token Endpoint Response', result)
    throw new Error()
  }

  token = result
  expiresAt = new Date(Date.now() + (result.expires_in * 1000) - 100)
  return result.access_token
}
