export enum FeatureStatus {
  Supported = 'supported',
  NotSupported = 'not_supported',
  Partial = 'partial',
  Deprecated = 'deprecated',
  Unknown = 'unknown'
}

export enum OpenIDConnectFeatureCategory {
  GrantType = 'grant_type',
  Extension = 'extension',
  Endpoint = 'endpoint',
  TokenEndpointAuthenticationMethod = 'token_endpoint_authentication_method',
  Prompt = 'prompt',
  Feature = 'feature',
}

export type OpenIDConnectFeature = {
  name: string
  identifier: string
  category: string
  description?: string
  status: string
  url?: string
}

export type OpenIDConnectProvider = {
  name: string
  abstract: string
  identifier: string
  website?: string
  github?: string
  icon: {
    contentUrl: string
  }
  license: string
  featureList: Array<{
    identifier: string
    description?: string
    status: string
    url?: string
  }>
}

import openIDConnectFeatures from './features.json'

import auth0 from './auth0.json'
import keycloak from './keycloak.json'
import microsoftEntraID from './microsoft-entra-id.json'
import okta from './okta.json'
import oryHydra from './ory-hydra.json'
import pingIdentity from './ping-identity.json'

export {
  openIDConnectFeatures,

  auth0,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
}

export const featuresCategories = [
  {
    name: 'Grant Types',
    identifier: OpenIDConnectFeatureCategory.GrantType,
    features: [
      'authorization_code_grant',
      'implicit_grant',
      'client_credentials_grant',
      'refresh_token_grant',
      'password_grant',
      'urn:ietf:params:oauth:grant-type:token-exchange',
      'urn:openid:params:grant-type:ciba',
      'urn:ietf:params:oauth:grant-type:device_code',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'urn:ietf:params:oauth:grant-type:saml2-bearer'
    ]
  },

  {
    name: 'Extensions',
    identifier: OpenIDConnectFeatureCategory.Extension,
    features: [
      'pkce_extension',
      'par_extension',
      'rar_extension',
    ]
  },

  {
    name: 'Endpoints',
    identifier: OpenIDConnectFeatureCategory.Endpoint,
    features: [
      'authorization_endpoint',
      'token_endpoint',
      'userinfo_endpoint',
      'token_revocation_endpoint',
      'token_introspection_endpoint',
      'openid_connect_discovery_endpoint',
      'oauth_authorization_server_metadata_endpoint'
    ]
  },

  {
    name: 'Token Endpoint Authentication Methods',
    identifier: OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod,
    features: [
      'none_token_endpoint_auth',
      'client_secret_basic_token_endpoint_auth',
      'client_secret_post_token_endpoint_auth',
      'client_secret_jwt_token_endpoint_auth',
      'private_key_jwt_token_endpoint_auth',
      'tls_client_auth_token_endpoint_auth',
    ]
  },

  {
    name: 'Prompts',
    identifier: OpenIDConnectFeatureCategory.Prompt,
    features: [
      'login_prompt',
      'none_prompt',
      'consent_prompt',
      'select_account_prompt',
      'create_prompt',
    ]
  },

  // {
  //   name: 'Claims',
  //   features: []
  // },

  // {
  //   name: 'Scopes',
  //   features: []
  // },

  {
    name: 'Features',
    identifier: OpenIDConnectFeatureCategory.Feature,
    features: [
      'refresh_token_rotation',
      'dynamic_client_registration',
      'rp_initiated_logout',
    ]
  }
]

export const providers: OpenIDConnectProvider[] = [
  auth0,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
]
