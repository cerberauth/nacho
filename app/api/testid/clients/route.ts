import { auth, tokenIssuer } from '@/auth'

import { GrantTypes, TokenEndpointAuthMethods } from '@/lib/consts'
import { getToken } from '@/lib/token'

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

  if (!req.auth?.user?.id) {
    return new Response(null, { status: 401 })
  }

  const method = clientData.tokenEndpointAuthMethod || TokenEndpointAuthMethods.clientSecretBasic;
  try {
    const token = await getToken()
    const response = await fetch('https://testid.cerberauth.com/oauth2/register', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_types: clientData.grantTypes || [GrantTypes.authorizationCode],
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
      console.error('TestID client registration error', response.status, await response.json())
      return new Response(null, { status: 400 })
    }

    const data = await response.json<OpenIDConnectProviderResponse>()
    const responseData: TestIdClient = {
      clientId: data.client_id,
      clientSecret: data.client_secret,
      client: clientData,
    }

    return Response.json(responseData, { status: 201 })
  } catch (err) {
    console.error('TestID client registration error', err)
    return new Response(null, { status: 500 })
  }
})
