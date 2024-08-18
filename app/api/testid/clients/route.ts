import { auth } from '@/auth'

import { GrantTypes, TokenEndpointAuthMethods } from '@/lib/consts'

export const runtime = 'edge'

type OpenIDConnectProviderResponse = {
  client_id: string
  client_secret: string
  client: OAuth2Client
}

export const POST = auth(async (req) => {
  const clientData = await req.json() as OAuth2Client
  if (!clientData) {
    return new Response(null, { status: 400 })
  }

  if (!(req.auth?.token && req.auth?.user?.id)) {
    return new Response(null, { status: 401 })
  }

  let method = clientData.tokenEndpointAuthMethod?.[0];
  switch (method) {
    case TokenEndpointAuthMethods.clientSecretPost:
      method = 'client_secret_post'
    case TokenEndpointAuthMethods.none:
      method = 'none'
    case TokenEndpointAuthMethods.clientSecretBasic:
    default:
      method = 'client_secret_basic'
  }

  const response = await fetch('https://testid.cerberauth.com/oauth2/register', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${req.auth.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_types: clientData.grantTypes.map((type) => {
        switch (type) {
          case GrantTypes.authorizationCode:
            return 'authorization_code';
          case GrantTypes.refreshToken:
            return 'refresh_token';
          case GrantTypes.clientCredentials:
            return 'client_credentials';
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

      owner: req.auth.user.id,
      contacts: clientData.contacts,
      client_uri: clientData.uri,
      policy_uri: clientData.policyUri,
      tos_uri: clientData.tosUri,
      logo_uri: clientData.logoUri,
    }),
  })
  if (!response.ok) {
    return new Response(null, { status: response.status })
  }
  const data = await response.json<OpenIDConnectProviderResponse>()
  const responseData: TestIdClient = {
    clientId: data.client_id,
    clientSecret: data.client_secret,
    client: clientData,
  }

  return Response.json(responseData, { status: 201 })
})
