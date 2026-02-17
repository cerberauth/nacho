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
  FAPI = 'fapi',
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
import authlete from './authlete.json'
import awsCognito from './aws-cognito.json'
import keycloak from './keycloak.json'
import microsoftEntraID from './microsoft-entra-id.json'
import okta from './okta.json'
import oryHydra from './ory-hydra.json'
import pingIdentity from './ping-identity.json'

export {
  openIDConnectFeatures,

  auth0,
  authlete,
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
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.GrantType),
  },

  {
    name: 'Extensions',
    identifier: OpenIDConnectFeatureCategory.Extension,
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.Extension),
  },

  {
    name: 'Endpoints',
    identifier: OpenIDConnectFeatureCategory.Endpoint,
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.Endpoint),
  },

  {
    name: 'Token Endpoint Authentication Methods',
    identifier: OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod,
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod),
  },

  {
    name: 'Prompts',
    identifier: OpenIDConnectFeatureCategory.Prompt,
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.Prompt),
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
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.Feature),
  },

  {
    name: 'Financial-grade API (FAPI)',
    identifier: OpenIDConnectFeatureCategory.FAPI,
    features: openIDConnectFeatures.featureList.filter(feature => feature.category === OpenIDConnectFeatureCategory.FAPI),
  }
]

export const providers: OpenIDConnectProvider[] = [
  auth0,
  authlete,
  awsCognito,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
]
