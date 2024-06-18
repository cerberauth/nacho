import type { NextApiResponse } from 'next'
import { auth } from '@/auth'
import { GrantType, TokenEndpointAuthMethod } from '@/lib/consts'

export const runtime = 'edge'

export async function POST(req: Request, res: NextApiResponse) {
  const clientData = await req.json() as OAuthClient
  if (!clientData) {
    return res.status(400).send('Missing client data')
  }

  const session = await auth()
  if (!session?.token) {
    return new Response('You must be logged in.', { status: 401 })
  }

  let method = clientData.tokenEndpointAuthMethod?.[0];
  switch (method) {
    case TokenEndpointAuthMethod.clientSecretPost:
      method = 'client_secret_post'
    case TokenEndpointAuthMethod.none:
      method = 'none'
    case TokenEndpointAuthMethod.clientSecretBasic:
    default:
      method = 'client_secret_basic'
  }

  const response = await fetch('https://testid.cerberauth.com/oauth2/register', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_types: clientData.grantTypes.map((type) => {
        switch (type) {
          case GrantType.authorizationCodeWithPKCE:
            return 'authorization_code';
          case GrantType.refreshToken:
            return 'refresh_token';
          case GrantType.clientCredentials:
            return 'client_credentials';
          case GrantType.deviceCode:
            return 'urn:ietf:params:oauth:grant-type:device_code';
          default:
            return type;
        }
      }),
      token_endpoint_auth_method: method,

      client_name: clientData.name,
      allowed_cors_origins: clientData.allowedCorsOrigins,
      scope: clientData.scopes.join(' '),
      audience: clientData.audiences,
      redirect_uris: clientData.redirectUris,
      post_logout_redirect_uris: clientData.postLogoutRedirectUris,

      contacts: clientData.contacts,
      client_uri: clientData.uri,
      policy_uri: clientData.policyUri,
      tos_uri: clientData.tosUri,
      logo_uri: clientData.logoUri,
    }),
  })
  if (!response.ok) {
    throw new Error(`Failed to register client: ${response.statusText}`)
  }
  const data = await response.json()

  return Response.json({
    clientId: data.client_id,
    clientSecret: data.client_secret,
    client: clientData,
  })
}
