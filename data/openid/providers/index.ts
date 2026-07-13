import { FeatureStatus } from '@/lib/types'

export { FeatureStatus }

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
  links?: string[]
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
  nationality?: string
  featureList: Array<{
    identifier: string
    description?: string
    status: string
    links?: string[]
  }>
}

import openIDConnectFeatures from './features.json'

import auth0 from './auth0.json'
import authlete from './authlete.json'
import awsCognito from './aws-cognito.json'
import clerk from './clerk.json'
import curity from './curity.json'
import cyberArk from './cyberark.json'
import fusionauth from './fusionauth.json'
import kinde from './kinde.json'
import keycloak from './keycloak.json'
import microsoftEntraID from './microsoft-entra-id.json'
import okta from './okta.json'
import oryHydra from './ory-hydra.json'
import pingIdentity from './ping-identity.json'
import sailpoint from './sailpoint.json'
import zitadel from './zitadel.json'

export {
  openIDConnectFeatures,

  auth0,
  authlete,
  clerk,
  curity,
  cyberArk,
  fusionauth,
  kinde,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
  sailpoint,
  zitadel,
}

export const getFeaturesCategories = (dict: any) => [
  {
    name: dict.categories.grant_types,
    identifier: OpenIDConnectFeatureCategory.GrantType,
    features: openIDConnectFeatures.featureList
      .filter((feature) => feature.category === OpenIDConnectFeatureCategory.GrantType)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.extensions,
    identifier: OpenIDConnectFeatureCategory.Extension,
    features: openIDConnectFeatures.featureList
      .filter((feature) => feature.category === OpenIDConnectFeatureCategory.Extension)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.endpoints,
    identifier: OpenIDConnectFeatureCategory.Endpoint,
    features: openIDConnectFeatures.featureList
      .filter((feature) => feature.category === OpenIDConnectFeatureCategory.Endpoint)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.token_endpoint_authentication_methods,
    identifier: OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod,
    features: openIDConnectFeatures.featureList
      .filter(
        (feature) => feature.category === OpenIDConnectFeatureCategory.TokenEndpointAuthenticationMethod,
      )
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.prompts,
    identifier: OpenIDConnectFeatureCategory.Prompt,
    features: openIDConnectFeatures.featureList
      .filter((feature) => feature.category === OpenIDConnectFeatureCategory.Prompt)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
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
    name: dict.categories.features,
    identifier: OpenIDConnectFeatureCategory.Feature,
    features: openIDConnectFeatures.featureList
      .filter((feature) => feature.category === OpenIDConnectFeatureCategory.Feature)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.fapi,
    identifier: OpenIDConnectFeatureCategory.FAPI,
    features: openIDConnectFeatures.featureList
      .filter((feature) => feature.category === OpenIDConnectFeatureCategory.FAPI)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },
]

export const providers: OpenIDConnectProvider[] = [
  auth0,
  authlete,
  awsCognito,
  clerk,
  curity,
  cyberArk,
  fusionauth,
  kinde,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
  sailpoint,
  zitadel,
]
